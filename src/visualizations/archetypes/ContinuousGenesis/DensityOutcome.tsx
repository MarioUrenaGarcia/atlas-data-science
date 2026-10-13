import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import type { ContinuousDistribution } from '../../../lib/distributions/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { Bars, type Bar } from '../../core/svg/Bars.tsx';
import { CurvePath, type XY } from '../../core/svg/CurvePath.tsx';
import type { ReferenceCurve } from './processes.ts';
import type { StageBox } from './stage.ts';

export type DensityView = 'densidad' | 'acumulada';

interface DensityOutcomeProps {
  box: StageBox;
  theory: ContinuousDistribution;
  reference: ReferenceCurve | null;
  values: readonly number[];
  view: DensityView;
  domain: [number, number];
  latest: number | null;
  axisLabel: string;
}

const MARGIN = { left: 50, right: 16, top: 10, bottom: 36 };
const BINS = 40;
const CURVE_POINTS = 240;
/** Densities that diverge at an endpoint are clipped so the rest stays readable. */
const DENSITY_CAP_FACTOR = 5;
/** Room above the highest point of the curves, where histogram bars may still grow. */
const HEADROOM = 1.3;

/**
 * Histogram of the simulated values, scaled as a density so it can be
 * compared with the theoretical curve, or the empirical cdf against the cdf.
 */
export function DensityOutcome({
  box,
  theory,
  reference,
  values,
  view,
  domain,
  latest,
  axisLabel,
}: DensityOutcomeProps) {
  const [lo, hi] = domain;
  const width = (hi - lo) / BINS;
  const inner = {
    left: box.x + MARGIN.left,
    top: box.y + MARGIN.top,
    width: Math.max(10, box.width - MARGIN.left - MARGIN.right),
    height: Math.max(10, box.height - MARGIN.top - MARGIN.bottom),
  };
  const baseline = inner.top + inner.height;
  const total = values.length;

  const counts = useMemo(() => {
    const bins = new Array<number>(BINS).fill(0);
    for (const v of values) {
      if (v < lo || v >= hi) continue;
      const index = Math.min(BINS - 1, Math.floor((v - lo) / width));
      bins[index] = (bins[index] ?? 0) + 1;
    }
    return bins;
  }, [values, lo, hi, width]);

  const curve = useMemo<XY[]>(() => {
    const points: XY[] = [];
    for (let i = 0; i <= CURVE_POINTS; i += 1) {
      const x = lo + ((hi - lo) * i) / CURVE_POINTS;
      const y = view === 'densidad' ? theory.pdf(x) : theory.cdf(x);
      points.push({ x, y: Number.isFinite(y) ? y : 0 });
    }
    return points;
  }, [lo, hi, theory, view]);

  const referenceCurve = useMemo<XY[] | null>(() => {
    if (!reference) return null;
    return Array.from({ length: CURVE_POINTS + 1 }, (_, i) => {
      const x = lo + ((hi - lo) * i) / CURVE_POINTS;
      const y = view === 'densidad' ? reference.distribution.pdf(x) : reference.distribution.cdf(x);
      return { x, y: Number.isFinite(y) ? y : 0 };
    });
  }, [lo, hi, reference, view]);

  // Density at the median, a typical height used to cap infinite densities at an endpoint.
  const typical = useMemo(() => theory.pdf(theory.quantile(0.5)), [theory]);
  const x = scaleLinear()
    .domain([lo, hi])
    .range([inner.left, inner.left + inner.width]);

  if (view === 'acumulada') {
    const y = scaleLinear().domain([0, 1]).range([baseline, inner.top]);
    const sorted = [...values].sort((a, b) => a - b);
    const below = sorted.filter((v) => v < lo).length;
    const empirical: XY[] = [{ x: lo, y: total > 0 ? below / total : 0 }];
    sorted.forEach((v, index) => {
      if (v >= lo && v <= hi) empirical.push({ x: v, y: (index + 1) / total });
    });
    empirical.push({ x: hi, y: empirical.at(-1)?.y ?? 0 });
    return (
      <g>
        <Axis
          scale={y}
          orientation="left"
          position={inner.left}
          gridLength={inner.width}
          ticks={5}
        />
        <Axis scale={x} orientation="bottom" position={baseline} ticks={8} label={axisLabel} />
        <CurvePath
          points={curve}
          xScale={x}
          yScale={y}
          color={DATA_COLORS.primary}
          width={2.5}
          animate={false}
        />
        {referenceCurve && (
          <CurvePath
            points={referenceCurve}
            xScale={x}
            yScale={y}
            color={DATA_COLORS.muted}
            width={1.5}
            dashed
            animate={false}
          />
        )}
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

  const densities = counts.map((count) => (total > 0 ? count / (total * width) : 0));
  const curveMax = Math.max(...curve.map((point) => point.y), 0);
  const referenceMax = referenceCurve ? Math.max(...referenceCurve.map((point) => point.y)) : 0;
  // The axis follows the theoretical curve, not the noisy early histogram, so it stays still while
  // results accumulate; an infinite density at an endpoint is capped at a multiple of the typical height.
  const cap = Number.isFinite(typical) && typical > 0 ? typical * DENSITY_CAP_FACTOR * 2 : curveMax;
  const yMax = Math.max(0.02, Math.min(cap, Math.max(curveMax, referenceMax))) * HEADROOM;
  const y = scaleLinear().domain([0, yMax]).nice().range([baseline, inner.top]);
  const top = y.domain()[1] ?? yMax;
  const clip = (points: XY[]) => points.map((point) => ({ x: point.x, y: Math.min(point.y, top) }));
  const latestBin =
    latest !== null && latest >= lo && latest < hi ? Math.floor((latest - lo) / width) : -1;
  const bars: Bar[] = densities.map((density, index) => ({
    x0: lo + index * width,
    x1: lo + (index + 1) * width,
    value: Math.min(density, top),
    color: index === latestBin ? DATA_COLORS.highlight : undefined,
  }));

  return (
    <g>
      <Axis scale={y} orientation="left" position={inner.left} gridLength={inner.width} ticks={5} />
      <Axis scale={x} orientation="bottom" position={baseline} ticks={8} label={axisLabel} />
      <Bars
        bars={bars}
        xScale={x}
        yScale={y}
        color={DATA_COLORS.light}
        opacity={0.7}
        animate={false}
      />
      {referenceCurve && (
        <CurvePath
          points={clip(referenceCurve)}
          xScale={x}
          yScale={y}
          color={DATA_COLORS.muted}
          width={1.5}
          dashed
          animate={false}
        />
      )}
      <CurvePath
        points={clip(curve)}
        xScale={x}
        yScale={y}
        color={DATA_COLORS.primary}
        width={2.5}
        animate={false}
      />
    </g>
  );
}
