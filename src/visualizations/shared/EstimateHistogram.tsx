import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import { DATA_COLORS } from '../core/colors.ts';
import { Axis } from '../core/svg/Axis.tsx';
import { Bars, type Bar } from '../core/svg/Bars.tsx';
import { ChartSvg } from '../core/svg/ChartSvg.tsx';
import styles from '../core/svg/svg.module.css';

interface Marker {
  value: number;
  label: string;
  color: string;
  dashed?: boolean;
}

interface EstimateHistogramProps {
  values: readonly number[];
  /** Second set drawn as an outline, such as the same estimator under another design. */
  compare?: readonly number[];
  domain: [number, number];
  markers: readonly Marker[];
  label: string;
  axisLabel: string;
  bins?: number;
  color?: string;
  compareColor?: string;
  /** Optional shaded interval, such as a margin of error or a rejection region. */
  band?: { from: number; to: number; color: string };
}

function binCounts(values: readonly number[], lo: number, hi: number, bins: number): number[] {
  const width = (hi - lo) / bins;
  const counts = new Array<number>(bins).fill(0);
  for (const value of values) {
    if (!Number.isFinite(value) || value < lo || value > hi) continue;
    const index = Math.min(bins - 1, Math.floor((value - lo) / width));
    counts[index] = (counts[index] ?? 0) + 1;
  }
  return counts;
}

/**
 * Histogram of an estimator over repeated samples with reference markers,
 * scaled as relative frequency so two histograms of different sizes compare.
 */
export function EstimateHistogram({
  values,
  compare,
  domain,
  markers,
  label,
  axisLabel,
  bins = 32,
  color = DATA_COLORS.secondary,
  compareColor = DATA_COLORS.text,
  band,
}: EstimateHistogramProps) {
  const [lo, hi] = domain;
  const width = (hi - lo) / bins;
  const bars = useMemo<Bar[]>(
    () =>
      binCounts(values, lo, hi, bins).map((count, i) => ({
        x0: lo + i * width,
        x1: lo + (i + 1) * width,
        value: values.length === 0 ? 0 : count / values.length,
      })),
    [values, lo, hi, bins, width],
  );
  const outline = useMemo(() => {
    if (!compare || compare.length === 0) return null;
    return binCounts(compare, lo, hi, bins).map((count) => count / compare.length);
  }, [compare, lo, hi, bins]);
  const yMax = Math.max(0.05, ...bars.map((bar) => bar.value), ...(outline ?? [])) * 1.15;
  return (
    <ChartSvg label={label} aspect={0.34} minHeight={170} maxHeight={260} margins={{ top: 22 }}>
      {(box) => {
        const x = scaleLinear()
          .domain([lo, hi])
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLinear()
          .domain([0, yMax])
          .range([box.inner.top + box.inner.height, box.inner.top]);
        const bottom = box.inner.top + box.inner.height;
        return (
          <>
            {band && (
              <rect
                x={x(Math.max(lo, band.from))}
                y={box.inner.top}
                width={Math.max(0, x(Math.min(hi, band.to)) - x(Math.max(lo, band.from)))}
                height={box.inner.height}
                fill={band.color}
                fillOpacity={0.12}
                aria-hidden="true"
              />
            )}
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              ticks={3}
              format={(v) => `${Math.round(v * 100)} %`}
            />
            <Axis scale={x} orientation="bottom" position={bottom} ticks={7} label={axisLabel} />
            <Bars bars={bars} xScale={x} yScale={y} color={color} opacity={0.7} animate={false} />
            {outline && (
              <path
                d={outline
                  .map((value, i) => {
                    const x0 = x(lo + i * width);
                    const x1 = x(lo + (i + 1) * width);
                    return `${i === 0 ? 'M' : 'L'}${x0},${y(value)}L${x1},${y(value)}`;
                  })
                  .join('')}
                fill="none"
                stroke={compareColor}
                strokeWidth={1.5}
                strokeOpacity={0.8}
                aria-hidden="true"
              />
            )}
            {markers
              .filter((m) => Number.isFinite(m.value) && m.value >= lo && m.value <= hi)
              .map((m, i) => (
                <g key={i} aria-hidden="true">
                  <line
                    x1={x(m.value)}
                    x2={x(m.value)}
                    y1={box.inner.top - 4}
                    y2={bottom}
                    stroke={m.color}
                    strokeWidth={2.5}
                    strokeDasharray={m.dashed ? '5 4' : undefined}
                  />
                  <text
                    x={x(m.value)}
                    y={box.inner.top + (i === 0 ? -8 : 8 + 13 * (i - 1))}
                    textAnchor={
                      x(m.value) > box.inner.left + box.inner.width * 0.7 ? 'end' : 'start'
                    }
                    dx={x(m.value) > box.inner.left + box.inner.width * 0.7 ? -5 : 5}
                    className={styles.label}
                  >
                    {m.label}
                  </text>
                </g>
              ))}
          </>
        );
      }}
    </ChartSvg>
  );
}
