import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import type { Distribution } from '../../../lib/distributions/index.ts';
import { density } from '../../../lib/distributions/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { Bars, type Bar } from '../../core/svg/Bars.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath, type XY } from '../../core/svg/CurvePath.tsx';
import { DraggablePoint } from '../../core/svg/DraggablePoint.tsx';
import styles from '../../core/svg/svg.module.css';
import { inRegion, usesSecondBound } from './regions.ts';
import type { Region } from './schema.ts';

export type ChartView = 'densidad' | 'acumulada';

interface DistributionChartProps {
  distribution: Distribution;
  reference: { distribution: Distribution; label: string } | null;
  domain: [number, number];
  view: ChartView;
  /** Region bounds a and b, in the order they were set. */
  from: number;
  to: number;
  region: Region;
  probability: number;
  samples: readonly number[];
  showSamples: boolean;
  label: string;
  onIntervalChange: (from: number, to: number) => void;
}

const CURVE_POINTS = 320;
/** Radius of the markers of a discrete reference distribution. */
const REFERENCE_MARKER = 3.5;
const HISTOGRAM_BINS = 40;
/** Densities that diverge (beta with a < 1) are clipped so the rest stays readable. */
const MAX_DENSITY = 4;

export function DistributionChart({
  distribution,
  reference,
  domain,
  view,
  from,
  to,
  region,
  probability,
  samples,
  showSamples,
  label,
  onIntervalChange,
}: DistributionChartProps) {
  const discrete = distribution.kind === 'discrete';
  const [lo, hi] = domain;

  const integers = useMemo(() => {
    const first = Math.ceil(Math.max(lo, distribution.support[0]));
    const last = Math.floor(Math.min(hi, distribution.support[1]));
    return Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => first + index);
  }, [lo, hi, distribution]);

  const curve = useMemo<XY[]>(() => {
    const points: XY[] = [];
    for (let i = 0; i <= CURVE_POINTS; i += 1) {
      const x = lo + ((hi - lo) * i) / CURVE_POINTS;
      const y = view === 'densidad' ? density(distribution, x) : distribution.cdf(x);
      points.push({ x, y: Number.isFinite(y) ? Math.min(y, MAX_DENSITY) : MAX_DENSITY });
    }
    return points;
  }, [lo, hi, distribution, view]);

  // A discrete reference has mass only at integers; sampling it on the
  // continuous grid would miss almost every atom.
  const discreteReference = reference?.distribution.kind === 'discrete' && view === 'densidad';
  const referenceCurve = useMemo<XY[] | null>(() => {
    if (!reference) return null;
    if (discreteReference) {
      const support = reference.distribution.support;
      const first = Math.ceil(Math.max(lo, support[0]));
      const last = Math.floor(Math.min(hi, support[1]));
      return Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => {
        const k = first + index;
        return { x: k, y: density(reference.distribution, k) };
      });
    }
    return Array.from({ length: CURVE_POINTS + 1 }, (_, i) => {
      const x = lo + ((hi - lo) * i) / CURVE_POINTS;
      const y =
        view === 'densidad' ? density(reference.distribution, x) : reference.distribution.cdf(x);
      return { x, y: Number.isFinite(y) ? Math.min(y, MAX_DENSITY) : MAX_DENSITY };
    });
  }, [lo, hi, reference, view, discreteReference]);

  const histogram = useMemo<Bar[]>(() => {
    if (!showSamples || samples.length === 0 || view !== 'densidad') return [];
    if (discrete) {
      const counts = new Map<number, number>();
      for (const value of samples) counts.set(value, (counts.get(value) ?? 0) + 1);
      return integers.map((k) => ({
        x0: k - 0.3,
        x1: k + 0.3,
        value: (counts.get(k) ?? 0) / samples.length,
      }));
    }
    const width = (hi - lo) / HISTOGRAM_BINS;
    const counts = new Array<number>(HISTOGRAM_BINS).fill(0);
    for (const value of samples) {
      if (value < lo || value >= hi) continue;
      const index = Math.floor((value - lo) / width);
      counts[index] = (counts[index] ?? 0) + 1;
    }
    return counts.map((count, index) => ({
      x0: lo + index * width,
      x1: lo + (index + 1) * width,
      value: count / (samples.length * width),
    }));
  }, [showSamples, samples, view, discrete, integers, lo, hi]);

  const empiricalCdf = useMemo<XY[] | null>(() => {
    if (!showSamples || samples.length === 0 || view !== 'acumulada') return null;
    const sorted = [...samples].sort((a, b) => a - b);
    const points: XY[] = [{ x: lo, y: 0 }];
    sorted.forEach((value, index) => {
      if (value >= lo && value <= hi) points.push({ x: value, y: (index + 1) / sorted.length });
    });
    points.push({ x: hi, y: points[points.length - 1]?.y ?? 1 });
    return points;
  }, [showSamples, samples, view, lo, hi]);

  const yMax = useMemo(() => {
    if (view === 'acumulada') return 1;
    const values = discrete
      ? integers.map((k) => density(distribution, k))
      : curve.map((point) => point.y);
    const referenceMax = referenceCurve ? Math.max(...referenceCurve.map((point) => point.y)) : 0;
    const histogramMax = histogram.length > 0 ? Math.max(...histogram.map((bar) => bar.value)) : 0;
    return Math.max(0.05, ...values, referenceMax, histogramMax) * 1.1;
  }, [view, discrete, integers, distribution, curve, referenceCurve, histogram]);

  const quantile = distribution.quantile(probability);

  return (
    <ChartSvg label={label} aspect={0.55} interactive={view === 'densidad'}>
      {(box) => {
        const x = scaleLinear()
          .domain([lo, hi])
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLinear()
          .domain([0, yMax])
          .nice()
          .range([box.inner.top + box.inner.height, box.inner.top]);
        const baseline = box.inner.top + box.inner.height;
        const toData = (px: number) => Math.min(hi, Math.max(lo, x.invert(px)));
        // Contiguous runs of the curve inside the region, each filled on its own (the tails give two).
        const shadedRuns: XY[][] = [];
        for (const point of curve) {
          if (!inRegion(region, from, to, point.x)) continue;
          const run = shadedRuns.at(-1);
          const previous = run?.at(-1);
          const gap = previous ? point.x - previous.x > ((hi - lo) / CURVE_POINTS) * 1.5 : true;
          if (!run || gap) shadedRuns.push([point]);
          else run.push(point);
        }
        const stemWidth = Math.max(
          2,
          Math.min(18, (box.inner.width / Math.max(1, integers.length)) * 0.5),
        );
        return (
          <>
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              ticks={5}
            />
            <Axis scale={x} orientation="bottom" position={baseline} ticks={8} />

            {histogram.length > 0 && (
              <Bars
                bars={histogram}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.light}
                opacity={0.55}
              />
            )}

            {view === 'densidad' && discrete && (
              <g aria-hidden="true">
                {integers.map((k) => {
                  const inside = inRegion(region, from, to, k);
                  const top = y(density(distribution, k));
                  return (
                    <rect
                      key={k}
                      x={x(k) - stemWidth / 2}
                      y={top}
                      width={stemWidth}
                      height={Math.max(0, baseline - top)}
                      fill={inside ? DATA_COLORS.secondary : DATA_COLORS.primary}
                      fillOpacity={inside ? 0.9 : 0.75}
                    />
                  );
                })}
              </g>
            )}

            {view === 'densidad' && !discrete && (
              <>
                {shadedRuns
                  .filter((run) => run.length > 1)
                  .map((run, index) => (
                    <CurvePath
                      key={index}
                      points={run}
                      xScale={x}
                      yScale={y}
                      color={DATA_COLORS.secondary}
                      fill
                      fillOpacity={0.3}
                      width={0}
                      animate={false}
                    />
                  ))}
                <CurvePath
                  points={curve}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.primary}
                  width={2.5}
                />
              </>
            )}

            {view === 'acumulada' && (
              <>
                <CurvePath
                  points={curve}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.primary}
                  width={2.5}
                  step={discrete}
                />
                {empiricalCdf && (
                  <CurvePath
                    points={empiricalCdf}
                    xScale={x}
                    yScale={y}
                    color={DATA_COLORS.highlight}
                    width={1.5}
                    step
                    animate={false}
                  />
                )}
                <line
                  x1={box.inner.left}
                  x2={x(quantile)}
                  y1={y(probability)}
                  y2={y(probability)}
                  stroke={DATA_COLORS.secondary}
                  strokeDasharray="5 4"
                />
              </>
            )}

            {referenceCurve && (
              <CurvePath
                points={referenceCurve}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.muted}
                width={1.5}
                dashed
              />
            )}
            {referenceCurve && discreteReference && (
              <g aria-hidden="true">
                {referenceCurve.map((point) => (
                  <circle
                    key={point.x}
                    cx={x(point.x)}
                    cy={y(point.y)}
                    r={REFERENCE_MARKER}
                    fill="var(--color-surface)"
                    stroke={DATA_COLORS.muted}
                    strokeWidth={1.5}
                  />
                ))}
              </g>
            )}

            {Number.isFinite(quantile) && quantile >= lo && quantile <= hi && (
              <g aria-hidden="true">
                <line
                  x1={x(quantile)}
                  x2={x(quantile)}
                  y1={baseline}
                  y2={box.inner.top}
                  stroke={DATA_COLORS.secondary}
                  strokeDasharray="5 4"
                />
                <text x={x(quantile) + 4} y={box.inner.top + 12} className={styles.labelMuted}>
                  xₚ
                </text>
              </g>
            )}

            {Number.isFinite(distribution.mean) &&
              distribution.mean >= lo &&
              distribution.mean <= hi && (
                <path
                  d={`M${x(distribution.mean)},${baseline - 1} l-6,10 h12 z`}
                  fill={DATA_COLORS.text}
                  aria-hidden="true"
                />
              )}

            {view === 'densidad' && (
              <>
                <DraggablePoint
                  x={x(from)}
                  y={baseline}
                  color={DATA_COLORS.secondary}
                  axis="x"
                  label="Límite a de la región"
                  valueText={`a = ${from.toFixed(2)}`}
                  onDrag={(px) =>
                    onIntervalChange(
                      usesSecondBound(region) ? Math.min(toData(px), to) : toData(px),
                      to,
                    )
                  }
                />
                {usesSecondBound(region) && (
                  <DraggablePoint
                    x={x(to)}
                    y={baseline}
                    color={DATA_COLORS.secondary}
                    axis="x"
                    label="Límite b de la región"
                    valueText={`b = ${to.toFixed(2)}`}
                    onDrag={(px) => onIntervalChange(from, Math.max(toData(px), from))}
                  />
                )}
              </>
            )}
          </>
        );
      }}
    </ChartSvg>
  );
}
