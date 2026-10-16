import { scaleLinear, scaleLog } from 'd3-scale';
import { histogram } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import type { ChartBox } from '../../core/svg/chartBox.ts';

function extent(values: readonly number[], log: boolean): [number, number] {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  if (log) return [lo / 1.1, hi * 1.1];
  const d = (hi - lo) * 0.05 || 1;
  return [lo - d, hi + d];
}

interface HistogramPanelProps {
  box: ChartBox;
  values: readonly number[];
  /** Fixed domain so the axis does not jump while data accumulate. */
  domain: [number, number];
  bins: number;
  label: string;
  color?: string;
  maxCount?: number;
}

/** Histogram with its own axes inside a chart box. */
export function HistogramPanel({
  box,
  values,
  domain,
  bins,
  label,
  color = DATA_COLORS.primary,
  maxCount,
}: HistogramPanelProps) {
  const result = histogram(values, bins, domain);
  const top = maxCount ?? Math.max(1, ...result.map((b) => b.count));
  const x = scaleLinear()
    .domain(domain)
    .range([box.inner.left, box.inner.left + box.inner.width]);
  const y = scaleLinear()
    .domain([0, top * 1.05])
    .range([box.inner.top + box.inner.height, box.inner.top]);
  return (
    <g>
      <Axis
        scale={y}
        orientation="left"
        position={box.inner.left}
        gridLength={box.inner.width}
        ticks={5}
        label="Frecuencia"
      />
      <Axis
        scale={x}
        orientation="bottom"
        position={box.inner.top + box.inner.height}
        ticks={7}
        label={label}
      />
      <g aria-hidden="true">
        {result.map((b, i) => (
          <rect
            key={i}
            x={x(b.x0)}
            y={y(b.count)}
            width={Math.max(0, x(b.x1) - x(b.x0) - 1)}
            height={y(0) - y(b.count)}
            fill={color}
            fillOpacity={0.75}
          />
        ))}
      </g>
    </g>
  );
}

export interface ScatterPoint {
  x: number;
  y: number;
  color?: string;
  highlight?: boolean;
}

interface ScatterPanelProps {
  box: ChartBox;
  points: readonly ScatterPoint[];
  /** All points that may appear, used to fix the axes. */
  extentOf: readonly ScatterPoint[];
  xLabel: string;
  yLabel: string;
  log?: boolean;
  radius?: number;
}

/** Scatter plot with optional logarithmic axes; highlighted points are drawn larger with an outline. */
export function ScatterPanel({
  box,
  points,
  extentOf,
  xLabel,
  yLabel,
  log = false,
  radius = 3,
}: ScatterPanelProps) {
  const xs = extentOf.map((p) => p.x);
  const ys = extentOf.map((p) => p.y);
  const range = [box.inner.left, box.inner.left + box.inner.width] as [number, number];
  const rangeY = [box.inner.top + box.inner.height, box.inner.top] as [number, number];
  const x = log
    ? scaleLog().domain(extent(xs, true)).range(range)
    : scaleLinear().domain(extent(xs, false)).range(range);
  const y = log
    ? scaleLog().domain(extent(ys, true)).range(rangeY)
    : scaleLinear().domain(extent(ys, false)).range(rangeY);
  return (
    <g>
      <Axis
        scale={y}
        orientation="left"
        position={box.inner.left}
        gridLength={box.inner.width}
        ticks={5}
        label={yLabel}
      />
      <Axis
        scale={x}
        orientation="bottom"
        position={box.inner.top + box.inner.height}
        ticks={6}
        label={xLabel}
      />
      <g aria-hidden="true">
        {points.map((p, i) =>
          p.highlight ? (
            <circle
              key={i}
              cx={x(p.x)}
              cy={y(p.y)}
              r={radius + 3}
              fill={p.color ?? DATA_COLORS.secondary}
              stroke={DATA_COLORS.text}
              strokeWidth={1.5}
            />
          ) : (
            <circle
              key={i}
              cx={x(p.x)}
              cy={y(p.y)}
              r={radius}
              fill={p.color ?? DATA_COLORS.primary}
              fillOpacity={0.7}
            />
          ),
        )}
      </g>
    </g>
  );
}
