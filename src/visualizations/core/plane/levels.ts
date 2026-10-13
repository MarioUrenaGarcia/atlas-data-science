import { formatNumber } from '../../../lib/format/number.ts';
import type { Point2 } from '../../../lib/multivariable/index.ts';

const GRID = 40;
const LOW = 0.005;
const HIGH = 0.995;

export interface FieldRange {
  min: number;
  max: number;
  /** Evenly spaced contour levels between robust quantiles. */
  levels: number[];
}

/** Value range of f on the domain and a set of contour levels, ignoring extreme spikes. */
export function fieldRange(
  f: (x: number, y: number) => number,
  domain: [Point2, Point2],
  count = 10,
): FieldRange {
  const [[x0, x1], [y0, y1]] = domain;
  const values: number[] = [];
  for (let i = 0; i <= GRID; i += 1) {
    for (let j = 0; j <= GRID; j += 1) {
      const v = f(x0 + ((x1 - x0) * i) / GRID, y0 + ((y1 - y0) * j) / GRID);
      if (Number.isFinite(v)) values.push(v);
    }
  }
  values.sort((a, b) => a - b);
  const at = (q: number) => values[Math.round(q * (values.length - 1))] ?? 0;
  const min = at(LOW);
  const max = at(HIGH);
  // Levels at quantiles of the sampled values, so steep functions still get curves in their flat regions.
  const levels = Array.from({ length: count }, (_, k) => at((k + 0.5) / count));
  return { min, max, levels };
}

/** Relative height in [0, 1], clamped, used to shade surfaces and heat maps. */
export const relative = (value: number, range: FieldRange) =>
  Math.max(0, Math.min(1, (value - range.min) / (range.max - range.min || 1)));

/** Fixed-decimal display that shows values below the last digit as 0 instead of scientific notation. */
export function num(value: number, digits = 3): string {
  return formatNumber(Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value, digits);
}
