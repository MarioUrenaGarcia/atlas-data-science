import { scaleLinear, scaleLog } from 'd3-scale';
import { useMemo } from 'react';
import type { DiscreteDistribution } from '../../../lib/distributions/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { Bars, type Bar } from '../../core/svg/Bars.tsx';
import { CurvePath, type XY } from '../../core/svg/CurvePath.tsx';
import { OutcomeAxis } from './OutcomeAxis.tsx';
import type { ReferenceCurve } from './processes.ts';
import type { StageBox } from './stage.ts';

export type OutcomeView = 'masa' | 'acumulada' | 'loglog';

interface OutcomeChartProps {
  box: StageBox;
  theory: DiscreteDistribution;
  reference: ReferenceCurve | null;
  values: readonly number[];
  /** Completed values that are structural zeros, drawn as their own layer at 0. */
  structural: number;
  view: OutcomeView;
  domain: [number, number];
  /** Tick labels for categorical outcomes 0..k-1. */
  labels?: readonly string[];
  latest: number | null;
  axisLabel: string;
}

const MARGIN = { left: 50, right: 16, top: 10, bottom: 36 };
const BAR_SHARE = 0.7;

function powersOfTen(lo: number, hi: number): number[] {
  const result: number[] = [];
  for (let e = Math.floor(Math.log10(lo)); e <= Math.ceil(Math.log10(hi)); e += 1) {
    const value = 10 ** e;
    if (value >= lo * 0.999 && value <= hi * 1.001) result.push(value);
  }
  return result;
}

/** Relative frequencies of the simulated values against the theoretical mass function. */
export function OutcomeChart({
  box,
  theory,
  reference,
  values,
  structural,
  view,
  domain,
  labels,
  latest,
  axisLabel,
}: OutcomeChartProps) {
  const [lo, hi] = domain;
  const integers = useMemo(
    () => Array.from({ length: Math.max(0, hi - lo + 1) }, (_, index) => lo + index),
    [lo, hi],
  );
  const counts = useMemo(() => {
    const map = new Map<number, number>();
    for (const value of values) map.set(value, (map.get(value) ?? 0) + 1);
    return map;
  }, [values]);
  const total = values.length;
  const frequency = (k: number) => (total > 0 ? (counts.get(k) ?? 0) / total : 0);

  const inner = {
    left: box.x + MARGIN.left,
    top: box.y + MARGIN.top,
    width: Math.max(10, box.width - MARGIN.left - MARGIN.right),
    height: Math.max(10, box.height - MARGIN.top - MARGIN.bottom),
  };
  const baseline = inner.top + inner.height;

  if (view === 'loglog') {
    const masses = integers.map((k) => theory.pmf(k)).filter((mass) => mass > 0);
    const minMass = Math.min(...masses, 1);
    const x = scaleLog()
      .domain([Math.max(1, lo), Math.max(2, hi)])
      .range([inner.left, inner.left + inner.width]);
    const y = scaleLog()
      .domain([minMass / 2, 1])
      .range([baseline, inner.top]);
    const theoryLine: XY[] = integers
      .filter((k) => k >= 1 && theory.pmf(k) > 0)
      .map((k) => ({ x: Math.log10(k), y: Math.log10(theory.pmf(k)) }));
    return (
      <g>
        <Axis
          scale={y}
          orientation="left"
          position={inner.left}
          gridLength={inner.width}
          tickValues={powersOfTen(minMass / 2, 1)}
          format={(value) => (value >= 0.01 ? String(value) : `1e${Math.round(Math.log10(value))}`)}
        />
        <Axis
          scale={x}
          orientation="bottom"
          position={baseline}
          tickValues={powersOfTen(Math.max(1, lo), Math.max(2, hi))}
          format={(value) => String(value)}
          label={`${axisLabel} (escala logarítmica)`}
        />
        <CurvePath
          points={theoryLine}
          xScale={(value) => x(10 ** value)}
          yScale={(value) => y(10 ** value)}
          color={DATA_COLORS.primary}
          width={2}
          animate={false}
        />
        <g aria-hidden="true">
          {integers.map((k) => {
            const f = frequency(k);
            return f > 0 ? (
              <circle key={k} cx={x(k)} cy={y(f)} r={3} fill={DATA_COLORS.highlight} />
            ) : null;
          })}
        </g>
      </g>
    );
  }

  const x = scaleLinear()
    .domain([lo - 0.5, hi + 0.5])
    .range([inner.left, inner.left + inner.width]);
  const slot = inner.width / Math.max(1, integers.length);
  const barHalf = Math.max(0.5, Math.min(slot * BAR_SHARE, 36) / 2);

  if (view === 'acumulada') {
    const y = scaleLinear().domain([0, 1]).range([baseline, inner.top]);
    const theoryCdf: XY[] = [
      { x: lo - 0.5, y: theory.cdf(lo - 1) },
      ...integers.map((k) => ({ x: k, y: theory.cdf(k) })),
    ];
    theoryCdf.push({ x: hi + 0.5, y: theory.cdf(hi) });
    let running = values.filter((value) => value < lo).length;
    const empirical: XY[] = [{ x: lo - 0.5, y: total > 0 ? running / total : 0 }];
    integers.forEach((k) => {
      running += counts.get(k) ?? 0;
      empirical.push({ x: k, y: total > 0 ? running / total : 0 });
    });
    empirical.push({ x: hi + 0.5, y: empirical[empirical.length - 1]?.y ?? 0 });
    return (
      <g>
        <Axis
          scale={y}
          orientation="left"
          position={inner.left}
          gridLength={inner.width}
          ticks={5}
        />
        <OutcomeAxis
          x={x}
          baseline={baseline}
          integers={integers}
          labels={labels}
          label={axisLabel}
        />
        <CurvePath
          points={theoryCdf}
          xScale={x}
          yScale={y}
          color={DATA_COLORS.primary}
          width={2.5}
          step
          animate={false}
        />
        {total > 0 && (
          <CurvePath
            points={empirical}
            xScale={x}
            yScale={y}
            color={DATA_COLORS.highlight}
            width={1.5}
            step
            animate={false}
          />
        )}
      </g>
    );
  }

  const theoryMax = Math.max(...integers.map((k) => theory.pmf(k)), 0);
  const referenceMax = reference
    ? Math.max(...integers.map((k) => reference.distribution.pmf(k)), 0)
    : 0;
  const frequencyMax = Math.max(...integers.map(frequency), 0);
  const y = scaleLinear()
    .domain([0, Math.max(0.05, theoryMax, referenceMax, frequencyMax) * 1.1])
    .nice()
    .range([baseline, inner.top]);
  const structuralShare = total > 0 ? structural / total : 0;
  const bars: Bar[] = integers.map((k) => ({
    x0: k - barHalf / slot,
    x1: k + barHalf / slot,
    value: frequency(k),
    color: k === latest ? DATA_COLORS.highlight : undefined,
  }));

  return (
    <g>
      <Axis scale={y} orientation="left" position={inner.left} gridLength={inner.width} ticks={5} />
      <OutcomeAxis
        x={x}
        baseline={baseline}
        integers={integers}
        labels={labels}
        label={axisLabel}
      />
      <Bars
        bars={bars}
        xScale={x}
        yScale={y}
        color={DATA_COLORS.light}
        opacity={0.75}
        gap={0}
        animate={false}
      />
      {structuralShare > 0 && lo <= 0 && hi >= 0 && (
        <rect
          aria-hidden="true"
          x={x(0) - barHalf}
          y={y(structuralShare)}
          width={barHalf * 2}
          height={Math.max(0, baseline - y(structuralShare))}
          fill={DATA_COLORS.tertiary}
          fillOpacity={0.85}
        />
      )}
      {reference && (
        <g aria-hidden="true">
          {integers.map((k) => {
            const mass = reference.distribution.pmf(k);
            return mass > 0 ? (
              <line
                key={k}
                x1={x(k) - barHalf}
                x2={x(k) + barHalf}
                y1={y(mass)}
                y2={y(mass)}
                stroke={DATA_COLORS.muted}
                strokeWidth={2}
                strokeDasharray="4 3"
              />
            ) : null;
          })}
        </g>
      )}
      <g aria-hidden="true">
        {integers.map((k) => {
          const mass = theory.pmf(k);
          if (!(mass > 0)) return null;
          return (
            <g key={k}>
              <line
                x1={x(k)}
                x2={x(k)}
                y1={baseline}
                y2={y(mass)}
                stroke={DATA_COLORS.primary}
                strokeWidth={1.5}
              />
              <circle
                cx={x(k)}
                cy={y(mass)}
                r={Math.min(4, Math.max(2, barHalf / 2))}
                fill={DATA_COLORS.primary}
              />
            </g>
          );
        })}
      </g>
    </g>
  );
}
