import { formatNumber } from '../../../lib/format/number.ts';
import type { Vec2 } from './schema.ts';

export const add = (a: Vec2, b: Vec2): Vec2 => [a[0] + b[0], a[1] + b[1]];
export const sub = (a: Vec2, b: Vec2): Vec2 => [a[0] - b[0], a[1] - b[1]];
export const scale = (a: Vec2, c: number): Vec2 => [a[0] * c, a[1] * c];
export const dot = (a: Vec2, b: Vec2) => a[0] * b[0] + a[1] * b[1];
export const length = (a: Vec2) => Math.hypot(a[0], a[1]);
export const cross = (a: Vec2, b: Vec2) => a[0] * b[1] - a[1] * b[0];

/** p-norm of a plane vector; p = Infinity gives the largest absolute coordinate. */
export function pNorm(a: Vec2, p: number): number {
  if (!Number.isFinite(p)) return Math.max(Math.abs(a[0]), Math.abs(a[1]));
  return (Math.abs(a[0]) ** p + Math.abs(a[1]) ** p) ** (1 / p);
}

/** Angle between two nonzero vectors, in degrees. */
export function angleDegrees(a: Vec2, b: Vec2): number {
  const cosine = dot(a, b) / (length(a) * length(b));
  return (Math.acos(Math.max(-1, Math.min(1, cosine))) * 180) / Math.PI;
}

export const vecText = (a: readonly number[], digits = 2) =>
  `(${a.map((value) => formatNumber(value, digits)).join(', ')})`;

export const vecLatex = (a: readonly number[], digits = 2) =>
  `\\begin{pmatrix} ${a.map((value) => formatNumber(value, digits)).join(' \\\\ ')} \\end{pmatrix}`;

/** Rounding noise of order 1e-16 is shown as the exact zero it stands for. */
export const roundOff = (value: number) => (Math.abs(value) < 1e-9 ? 0 : value);
