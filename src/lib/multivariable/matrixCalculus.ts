import type { Point2, Sym2 } from './index.ts';

/**
 * A quadratic function of a vector, f(x) = 1/2 xᵀAx - bᵀx + c, with A
 * symmetric positive definite. Its gradient is Ax - b and its minimum is the
 * solution of Ax = b.
 */
export interface QuadraticCase {
  id: string;
  name: string;
  a: Sym2;
  b: Point2;
  c: number;
  /** Plotted window around the minimum. */
  domain: [Point2, Point2];
  /** Start of the gradient descent path. */
  start: Point2;
  /** Data of a least-squares problem, when the case comes from one. */
  data?: { x: Point2[]; y: number[] };
}

export function quadraticValue(q: QuadraticCase, [x, y]: Point2): number {
  const [[a, b], [, d]] = q.a;
  return 0.5 * (a * x * x + 2 * b * x * y + d * y * y) - q.b[0] * x - q.b[1] * y + q.c;
}

export function quadraticGradient(q: QuadraticCase, [x, y]: Point2): Point2 {
  const [[a, b], [, d]] = q.a;
  return [a * x + b * y - q.b[0], b * x + d * y - q.b[1]];
}

/** Solution of Ax = b, the minimum of the quadratic. */
export function quadraticMinimum(q: QuadraticCase): Point2 {
  const [[a, b], [, d]] = q.a;
  const det = a * d - b * b;
  return [(d * q.b[0] - b * q.b[1]) / det, (a * q.b[1] - b * q.b[0]) / det];
}

/**
 * Least squares ‖Xβ - y‖² as a quadratic in β = (β₀, β₁) for the line
 * y = β₀ + β₁ t: A = 2XᵀX, b = 2Xᵀy and c = yᵀy.
 */
export function leastSquaresCase(t: number[], y: number[]): Pick<QuadraticCase, 'a' | 'b' | 'c' | 'data'> {
  const n = t.length;
  const st = t.reduce((s, v) => s + v, 0);
  const stt = t.reduce((s, v) => s + v * v, 0);
  const sy = y.reduce((s, v) => s + v, 0);
  const sty = t.reduce((s, v, i) => s + v * (y[i] ?? 0), 0);
  const syy = y.reduce((s, v) => s + v * v, 0);
  return {
    a: [
      [2 * n, 2 * st],
      [2 * st, 2 * stt],
    ],
    b: [2 * sy, 2 * sty],
    c: syy,
    data: { x: t.map((v) => [1, v] as Point2), y },
  };
}

/** Hours of study measured from their mean of 3, which makes XᵀX diagonal and the descent well conditioned. */
const HOURS = [-2, -1, 0, 1, 2];
const SCORES = [3, 4, 6, 6, 8];

export const QUADRATIC_CASES: Readonly<Record<string, QuadraticCase>> = {
  redonda: {
    id: 'redonda',
    name: 'A = 2I, contornos circulares',
    a: [
      [2, 0],
      [0, 2],
    ],
    b: [2, 1],
    c: 0,
    domain: [
      [-1.5, 3.5],
      [-2, 3],
    ],
    start: [-1, 2.5],
  },
  alargada: {
    id: 'alargada',
    name: 'A con valores propios 1 y 9',
    a: [
      [5, 4],
      [4, 5],
    ],
    b: [1, 2],
    c: 0,
    domain: [
      [-3, 3],
      [-2.5, 3.5],
    ],
    start: [-2.5, 2.8],
  },
  'minimos-cuadrados': {
    id: 'minimos-cuadrados',
    name: 'Mínimos cuadrados de una recta',
    ...leastSquaresCase(HOURS, SCORES),
    domain: [
      [3, 8],
      [-0.5, 2.5],
    ],
    start: [3.4, 2.3],
  },
};

export const QUADRATIC_CASE_IDS = Object.keys(QUADRATIC_CASES) as [string, ...string[]];
