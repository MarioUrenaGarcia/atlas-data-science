import type { ScaleLinear } from 'd3-scale';
import { histogram } from '../../../lib/stats/index.ts';

interface HistBarsProps {
  values: readonly number[];
  bins: number;
  domain: [number, number];
  x: ScaleLinear<number, number>;
  /** Pixel position of the baseline. */
  base: number;
  /** Pixel height of the tallest possible bar. */
  height: number;
  color: string;
  /** Count that maps to the full height; defaults to the tallest bin. */
  maxCount?: number;
  opacity?: number;
}

/** Histogram bars drawn upward from a baseline inside a larger chart. */
export function HistBars({
  values,
  bins,
  domain,
  x,
  base,
  height,
  color,
  maxCount,
  opacity = 0.6,
}: HistBarsProps) {
  const result = histogram(values, bins, domain);
  const top = maxCount ?? Math.max(1, ...result.map((b) => b.count));
  return (
    <g aria-hidden="true">
      {result.map((b, i) => {
        const h = (height * b.count) / top;
        return (
          <rect
            key={i}
            x={x(b.x0)}
            y={base - h}
            width={Math.max(0, x(b.x1) - x(b.x0) - 1)}
            height={h}
            fill={color}
            fillOpacity={opacity}
          />
        );
      })}
    </g>
  );
}

interface DotStripProps {
  values: readonly number[];
  x: ScaleLinear<number, number>;
  y: number;
  color: string | ((index: number) => string);
  /** Vertical spread of the deterministic jitter in pixels. */
  spread?: number;
  radius?: number;
}

/** Observations as dots along a line, spread vertically by a fixed pattern so ties stay visible. */
export function DotStrip({ values, x, y, color, spread = 10, radius = 3 }: DotStripProps) {
  return (
    <g aria-hidden="true">
      {values.map((v, i) => (
        <circle
          key={i}
          cx={x(v)}
          cy={y + spread * (((i * 0.618034) % 1) - 0.5)}
          r={radius}
          fill={typeof color === 'function' ? color(i) : color}
          fillOpacity={0.75}
        />
      ))}
    </g>
  );
}
