import { useMemo } from 'react';
import { useTween } from '../useTween.ts';

export interface Bar {
  x0: number;
  x1: number;
  /** Bar top in data units. */
  value: number;
  /** Optional per-bar fill, for highlighted ranges. */
  color?: string;
}

interface BarsProps {
  bars: readonly Bar[];
  xScale: (value: number) => number;
  yScale: (value: number) => number;
  color: string;
  opacity?: number;
  /** Gap between bars in pixels. */
  gap?: number;
  animate?: boolean;
}

/** Histogram or bar chart whose heights animate between updates. */
export function Bars({
  bars,
  xScale,
  yScale,
  color,
  opacity = 0.85,
  gap = 1,
  animate = true,
}: BarsProps) {
  const targets = useMemo(() => bars.map((bar) => bar.value), [bars]);
  const tweened = useTween(targets, animate ? 280 : 0);
  const baseline = yScale(0);
  return (
    <g aria-hidden="true">
      {bars.map((bar, index) => {
        const left = xScale(bar.x0);
        const right = xScale(bar.x1);
        const top = yScale(tweened[index] ?? bar.value);
        const width = Math.max(0.5, right - left - gap);
        return (
          <rect
            key={index}
            x={left + gap / 2}
            y={Math.min(top, baseline)}
            width={width}
            height={Math.abs(baseline - top)}
            fill={bar.color ?? color}
            fillOpacity={opacity}
          />
        );
      })}
    </g>
  );
}
