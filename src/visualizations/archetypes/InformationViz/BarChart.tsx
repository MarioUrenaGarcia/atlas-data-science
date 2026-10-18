import { scaleLinear } from 'd3-scale';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';

/** Width of the group of bars at each category, as a fraction of the category spacing. */
const GROUP_WIDTH = 0.7;
const ANNOTATION_OFFSET = 6;
const ANNOTATION_ROOM = 22;
const DEFAULT_ASPECT = 0.5;

export interface BarSeries {
  values: readonly number[];
  color: string;
  /** Draw as an outline instead of a filled bar. */
  outline?: boolean;
}

interface BarChartProps {
  series: readonly BarSeries[];
  labels: readonly string[];
  yDomain: [number, number];
  label: string;
  aspect?: number;
  /** Optional text above each category, such as a contribution. */
  annotations?: readonly string[];
  /** Stack the series on top of each other instead of placing them side by side. */
  stacked?: boolean;
}

/**
 * Grouped bars for one or more distributions over the same categories. The
 * horizontal axis is categorical, so it carries the category names instead
 * of numeric ticks.
 */
export function BarChart({
  series,
  labels,
  yDomain,
  label,
  aspect = DEFAULT_ASPECT,
  annotations,
  stacked = false,
}: BarChartProps) {
  const count = labels.length;
  const width = stacked ? GROUP_WIDTH : GROUP_WIDTH / series.length;
  return (
    <ChartSvg
      label={label}
      aspect={aspect}
      minHeight={220}
      maxHeight={380}
      margins={{ left: 46, bottom: 36, top: annotations ? ANNOTATION_ROOM : 16 }}
    >
      {(box) => {
        const x = scaleLinear()
          .domain([-0.5, count - 0.5])
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLinear()
          .domain(yDomain)
          .range([box.inner.top + box.inner.height, box.inner.top]);
        const base = y(Math.max(yDomain[0], 0));
        return (
          <>
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              ticks={5}
            />
            <Axis
              scale={x}
              orientation="bottom"
              position={box.inner.top + box.inner.height}
              tickValues={labels.map((_, i) => i)}
              format={(value) => labels[Math.round(value)] ?? ''}
            />
            <g aria-hidden="true">
              {series.map((s, k) =>
                s.values.map((v, i) => {
                  const left = i - GROUP_WIDTH / 2 + (stacked ? 0 : k * width);
                  const below = stacked
                    ? series.slice(0, k).reduce((sum, other) => sum + (other.values[i] ?? 0), 0)
                    : 0;
                  const clamp = (value: number) =>
                    Math.max(yDomain[0], Math.min(yDomain[1], value));
                  const top = y(clamp(below + v));
                  const bottom = stacked ? y(clamp(below)) : base;
                  return (
                    <rect
                      key={`${k}-${i}`}
                      x={x(left)}
                      width={x(left + width) - x(left)}
                      y={Math.min(top, bottom)}
                      height={Math.abs(bottom - top)}
                      fill={s.outline ? 'none' : s.color}
                      fillOpacity={0.8}
                      stroke={s.color}
                      strokeWidth={s.outline ? 2 : 0}
                    />
                  );
                }),
              )}
              {annotations?.map((text, i) => (
                <text
                  key={`a${i}`}
                  x={x(i)}
                  y={box.inner.top - ANNOTATION_OFFSET}
                  textAnchor="middle"
                  fontSize={12}
                  fill="var(--color-text)"
                >
                  {text}
                </text>
              ))}
            </g>
          </>
        );
      }}
    </ChartSvg>
  );
}
