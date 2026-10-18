import type { CSSProperties } from 'react';

/** Background tint for a matrix cell, darker for larger values. */
export function heatStyle(value: number, max: number): CSSProperties | undefined {
  if (value <= 0 || max <= 0) return undefined;
  return {
    background: `color-mix(in srgb, var(--data-1) ${Math.round(15 + 45 * (value / max))}%, transparent)`,
  };
}
