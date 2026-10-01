import { Random } from '../random/index.ts';
import type { Point } from './index.ts';

/** Soft thresholding, the proximal operator of t|·|: shrinks toward 0 by t and sets small values to 0. */
export function softThreshold(z: number, t: number): number {
  const shrunk = Math.max(0, Math.abs(z) - t);
  // Exact zero, never -0, so callers can test for coefficients set to 0.
  return shrunk === 0 ? 0 : Math.sign(z) * shrunk;
}

/**
 * A lasso problem in two coefficients: minimize 1/2 (β - b)ᵀA(β - b) + λ|β|₁,
 * with A symmetric positive definite. The smooth part plays the role of a
 * least-squares loss whose unpenalized minimum is b.
 */
export interface LassoProblem {
  a: [[number, number], [number, number]];
  b: Point;
  lambda: number;
}

export function lassoObjective(p: LassoProblem, [x, y]: Point): number {
  const dx = x - p.b[0];
  const dy = y - p.b[1];
  const [[a, c], [, d]] = p.a;
  return 0.5 * (a * dx * dx + 2 * c * dx * dy + d * dy * dy) + p.lambda * (Math.abs(x) + Math.abs(y));
}

export interface ProximalStep {
  point: Point;
  /** Gradient step before the proximal map. */
  gradientPoint: Point;
}

/** ISTA, proximal gradient: a gradient step on the smooth part followed by soft thresholding. */
export function proximalGradient(p: LassoProblem, start: Point, iterations: number): ProximalStep[] {
  const [[a, c], [, d]] = p.a;
  // Step 1/L with L the largest eigenvalue of A guarantees descent.
  const largest = (a + d) / 2 + Math.hypot((a - d) / 2, c);
  const t = 1 / largest;
  let point = start;
  const steps: ProximalStep[] = [{ point, gradientPoint: point }];
  for (let k = 0; k < iterations; k += 1) {
    const dx = point[0] - p.b[0];
    const dy = point[1] - p.b[1];
    const gradientPoint: Point = [point[0] - t * (a * dx + c * dy), point[1] - t * (c * dx + d * dy)];
    point = [softThreshold(gradientPoint[0], t * p.lambda), softThreshold(gradientPoint[1], t * p.lambda)];
    steps.push({ point, gradientPoint });
  }
  return steps;
}

/** Points of a dataset for a line y = β₀ + β₁ t with Gaussian noise. */
export function lineData(n: number, intercept: number, slope: number, noise: number, seed: number) {
  const random = new Random(seed);
  return Array.from({ length: n }, () => {
    const t = random.uniform(-2, 2);
    return { t, y: intercept + slope * t + random.normal(0, noise) };
  });
}

/** Average squared error of the line with coefficients β on the data. */
export function meanSquaredError(data: { t: number; y: number }[], [b0, b1]: Point): number {
  return data.reduce((s, { t, y }) => s + (b0 + b1 * t - y) ** 2, 0) / data.length;
}

function gradientOn(data: { t: number; y: number }[], [b0, b1]: Point): Point {
  let g0 = 0;
  let g1 = 0;
  for (const { t, y } of data) {
    const r = b0 + b1 * t - y;
    g0 += 2 * r;
    g1 += 2 * r * t;
  }
  return [g0 / data.length, g1 / data.length];
}

/**
 * Stochastic gradient descent on the mean squared error: each step uses the
 * gradient of a random mini-batch, an unbiased but noisy estimate of the full
 * gradient. With batch equal to the data size it is ordinary gradient descent.
 */
export function stochasticGradientPath(
  data: { t: number; y: number }[],
  start: Point,
  { batch = 1, rate = 0.1, iterations = 100, seed = 1 } = {},
): Point[] {
  const random = new Random(seed);
  let point = start;
  const path: Point[] = [point];
  for (let k = 0; k < iterations; k += 1) {
    const sample = batch >= data.length ? data : Array.from({ length: batch }, () => data[random.int(0, data.length - 1)] as { t: number; y: number });
    const g = gradientOn(sample, point);
    point = [point[0] - rate * g[0], point[1] - rate * g[1]];
    path.push(point);
  }
  return path;
}

/** Least-squares solution of the line fit, the minimum of the mean squared error. */
export function leastSquaresLine(data: { t: number; y: number }[]): Point {
  const n = data.length;
  const mt = data.reduce((s, d) => s + d.t, 0) / n;
  const my = data.reduce((s, d) => s + d.y, 0) / n;
  const sxy = data.reduce((s, d) => s + (d.t - mt) * (d.y - my), 0);
  const sxx = data.reduce((s, d) => s + (d.t - mt) ** 2, 0);
  const slope = sxy / sxx;
  return [my - slope * mt, slope];
}

/** Points not dominated by any other in the minimization of both coordinates. */
export function paretoFront(points: readonly Point[]): Point[] {
  return points.filter(
    (p) => !points.some((q) => q !== p && q[0] <= p[0] && q[1] <= p[1] && (q[0] < p[0] || q[1] < p[1])),
  );
}

/**
 * Two competing objectives of a decision (x, y): distances squared to two
 * ideal points. Their Pareto set is the segment between the ideal points, and
 * minimizing w f₁ + (1 - w) f₂ gives the point (1 - w) of the way along it.
 */
export const IDEAL_A: Point = [0, 0];
export const IDEAL_B: Point = [2, 1];
export const objectives = ([x, y]: Point): Point => [
  (x - IDEAL_A[0]) ** 2 + (y - IDEAL_A[1]) ** 2,
  (x - IDEAL_B[0]) ** 2 + (y - IDEAL_B[1]) ** 2,
];
export const weightedOptimum = (w: number): Point => [
  w * IDEAL_A[0] + (1 - w) * IDEAL_B[0],
  w * IDEAL_A[1] + (1 - w) * IDEAL_B[1],
];

/** Plane sets for checking convexity: a point is inside or not. */
export interface PlaneSet {
  id: string;
  name: string;
  convex: boolean;
  inside: (p: Point) => boolean;
}

export const PLANE_SETS: Readonly<Record<string, PlaneSet>> = {
  disco: { id: 'disco', name: 'Disco', convex: true, inside: ([x, y]) => x * x + y * y <= 2.25 },
  poligono: {
    id: 'poligono',
    name: 'Polígono definido por desigualdades lineales',
    convex: true,
    inside: ([x, y]) => x + y <= 1.5 && x - 2 * y <= 1.5 && -x + 0.5 * y <= 1.2 && y >= -1.2,
  },
  elipse: { id: 'elipse', name: 'Elipse llena', convex: true, inside: ([x, y]) => (x * x) / 3 + y * y <= 1 },
  luna: {
    id: 'luna',
    name: 'Media luna',
    convex: false,
    inside: ([x, y]) => x * x + y * y <= 2.25 && (x - 0.9) ** 2 + y * y >= 1.2,
  },
  anillo: { id: 'anillo', name: 'Anillo', convex: false, inside: ([x, y]) => x * x + y * y <= 2.25 && x * x + y * y >= 0.6 },
  cruz: {
    id: 'cruz',
    name: 'Cruz',
    convex: false,
    inside: ([x, y]) => (Math.abs(x) <= 0.5 && Math.abs(y) <= 1.6) || (Math.abs(y) <= 0.5 && Math.abs(x) <= 1.6),
  },
};

/** First point of the segment from p to q that leaves the set, or null if the segment stays inside. */
export function segmentExit(set: PlaneSet, p: Point, q: Point, samples = 200): Point | null {
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const r: Point = [p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])];
    if (!set.inside(r)) return r;
  }
  return null;
}

/** Random pairs of points of the set, with whether their segment stays inside. */
export function segmentTrials(set: PlaneSet, count: number, seed: number) {
  const random = new Random(seed);
  const pick = (): Point => {
    for (;;) {
      const p: Point = [random.uniform(-1.8, 1.8), random.uniform(-1.8, 1.8)];
      if (set.inside(p)) return p;
    }
  };
  return Array.from({ length: count }, () => {
    const p = pick();
    const q = pick();
    return { p, q, exit: segmentExit(set, p, q) };
  });
}
