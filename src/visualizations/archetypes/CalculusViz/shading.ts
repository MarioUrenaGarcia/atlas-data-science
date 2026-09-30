import type { RealFunction } from '../../../lib/calculus/index.ts';

const SAMPLES = 240;

/**
 * SVG polygon points of the region between the graph of f and the x axis on
 * [a, b], keeping only the part above the axis (sign 1) or below it (sign -1).
 */
export function areaPoints(
  f: RealFunction,
  a: number,
  b: number,
  x: (value: number) => number,
  y: (value: number) => number,
  sign: 1 | -1,
): string {
  if (b <= a) return '';
  const top: string[] = [];
  for (let i = 0; i <= SAMPLES; i += 1) {
    const t = a + ((b - a) * i) / SAMPLES;
    const value = f(t);
    const clipped = Number.isFinite(value)
      ? sign > 0
        ? Math.max(0, value)
        : Math.min(0, value)
      : 0;
    top.push(`${x(t)},${y(clipped)}`);
  }
  return `${x(a)},${y(0)} ${top.join(' ')} ${x(b)},${y(0)}`;
}
