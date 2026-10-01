import { createOptimizer, goldenSection, type OptimizerId, type Point, type TestFunction } from './index.ts';

/**
 * Iterates of deterministic optimizers, computed in advance so a
 * visualization can step through them. Every method stops early when the
 * gradient vanishes or the iterate leaves a generous box around the domain.
 */

export type PathMethod =
  | OptimizerId
  | 'gradiente-armijo'
  | 'gradiente-exacto'
  | 'bfgs'
  | 'lbfgs'
  | 'conjugado'
  | 'coordenadas';

export interface PathStep {
  point: Point;
  value: number;
  /** Step length used to reach this point, when the method chooses one. */
  alpha?: number;
}

type Mat = [[number, number], [number, number]];

const dot = (u: Point, v: Point) => u[0] * v[0] + u[1] * v[1];
const add = (u: Point, v: Point, c = 1): Point => [u[0] + c * v[0], u[1] + c * v[1]];
const matVec = (m: Mat, v: Point): Point => [m[0][0] * v[0] + m[0][1] * v[1], m[1][0] * v[0] + m[1][1] * v[1]];
const GRADIENT_TOLERANCE = 1e-10;
/** Iterates farther than this many window widths from the domain end the path. */
const ESCAPE = 4;

function escaped(fn: TestFunction, [x, y]: Point): boolean {
  const { x: [x0, x1], y: [y0, y1] } = fn.domain;
  const w = x1 - x0;
  const h = y1 - y0;
  return (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    x < x0 - ESCAPE * w ||
    x > x1 + ESCAPE * w ||
    y < y0 - ESCAPE * h ||
    y > y1 + ESCAPE * h
  );
}

export interface LineSearchTrial {
  alpha: number;
  value: number;
  armijo: boolean;
  wolfe: boolean;
}

/**
 * Backtracking along a descent direction d: tries α = α₀, ρα₀, ρ²α₀, ...
 * and records whether each trial satisfies the Armijo condition
 * φ(α) <= φ(0) + c₁ α φ'(0) and the curvature condition φ'(α) >= c₂ φ'(0),
 * where φ(α) = f(x + α d).
 */
export function lineSearchTrials(
  fn: TestFunction,
  x: Point,
  d: Point,
  { alpha0 = 1, shrink = 0.5, c1 = 1e-4, c2 = 0.9, maxTrials = 30 } = {},
): LineSearchTrial[] {
  const f0 = fn.f(x);
  const slope0 = dot(fn.gradient(x), d);
  const trials: LineSearchTrial[] = [];
  let alpha = alpha0;
  for (let k = 0; k < maxTrials; k += 1) {
    const p = add(x, d, alpha);
    const value = fn.f(p);
    const armijo = value <= f0 + c1 * alpha * slope0;
    const wolfe = armijo && dot(fn.gradient(p), d) >= c2 * slope0;
    trials.push({ alpha, value, armijo, wolfe });
    if (armijo) break;
    alpha *= shrink;
  }
  return trials;
}

/** Step that minimizes f along d, found by bracketing and golden-section search. */
export function exactStep(fn: TestFunction, x: Point, d: Point): number {
  const phi = (alpha: number) => fn.f(add(x, d, alpha));
  let high = 1e-3;
  // Grow the bracket until φ starts increasing.
  while (phi(2 * high) < phi(high) && high < 1e6) high *= 2;
  return goldenSection(phi, 0, 2 * high, 1e-12);
}

function armijoAlpha(fn: TestFunction, x: Point, d: Point): number {
  const trials = lineSearchTrials(fn, x, d);
  return trials[trials.length - 1]?.alpha ?? 0;
}

const WOLFE_C1 = 1e-4;
const WOLFE_C2 = 0.9;
const MAX_EXPANSIONS = 30;

/**
 * Step satisfying the Wolfe conditions when possible: backtracking from 1
 * until Armijo holds, or doubling while Armijo still holds and the slope is
 * too negative. Quasi-Newton methods need the growth: a step capped at 1
 * keeps their curvature estimates from learning long, flat directions.
 */
function wolfeAlpha(fn: TestFunction, x: Point, d: Point): number {
  const f0 = fn.f(x);
  const slope0 = dot(fn.gradient(x), d);
  const armijo = (alpha: number) => fn.f(add(x, d, alpha)) <= f0 + WOLFE_C1 * alpha * slope0;
  const curvature = (alpha: number) => dot(fn.gradient(add(x, d, alpha)), d) >= WOLFE_C2 * slope0;
  let alpha = 1;
  if (!armijo(alpha)) return armijoAlpha(fn, x, d);
  for (let k = 0; k < MAX_EXPANSIONS && !curvature(alpha) && armijo(2 * alpha); k += 1) alpha *= 2;
  return alpha;
}

/** Iterates of a method from x0, at most n steps. */
export function optimizerPath(
  method: PathMethod,
  fn: TestFunction,
  x0: Point,
  n: number,
  learningRate = 0.1,
  memory = 3,
): PathStep[] {
  const path: PathStep[] = [{ point: x0, value: fn.f(x0) }];
  const push = (point: Point, alpha?: number) => {
    path.push({ point, value: fn.f(point), alpha });
    return !escaped(fn, point);
  };

  if (
    method === 'gradiente' ||
    method === 'momentum' ||
    method === 'nesterov' ||
    method === 'adagrad' ||
    method === 'rmsprop' ||
    method === 'adam' ||
    method === 'newton'
  ) {
    const optimizer = createOptimizer(method, fn, x0, { learningRate });
    for (let k = 0; k < n; k += 1) {
      if (Math.hypot(...fn.gradient(optimizer.position)) < GRADIENT_TOLERANCE) break;
      if (!push(optimizer.step())) break;
    }
    return path;
  }

  let x = x0;
  if (method === 'gradiente-armijo' || method === 'gradiente-exacto') {
    for (let k = 0; k < n; k += 1) {
      const g = fn.gradient(x);
      if (Math.hypot(...g) < GRADIENT_TOLERANCE) break;
      const d: Point = [-g[0], -g[1]];
      const alpha = method === 'gradiente-armijo' ? armijoAlpha(fn, x, d) : exactStep(fn, x, d);
      x = add(x, d, alpha);
      if (!push(x, alpha)) break;
    }
    return path;
  }

  if (method === 'coordenadas') {
    // Exact minimization along x, then along y, alternately.
    for (let k = 0; k < n; k += 1) {
      const g = fn.gradient(x);
      if (Math.hypot(...g) < GRADIENT_TOLERANCE) break;
      const d: Point = k % 2 === 0 ? [-Math.sign(g[0]) || 1, 0] : [0, -Math.sign(g[1]) || 1];
      const alpha = exactStep(fn, x, d);
      x = add(x, d, alpha);
      if (!push(x, alpha)) break;
    }
    return path;
  }

  if (method === 'conjugado') {
    // Nonlinear conjugate gradient, Polak-Ribière with restart, exact line search.
    let g = fn.gradient(x);
    let d: Point = [-g[0], -g[1]];
    for (let k = 0; k < n; k += 1) {
      if (Math.hypot(...g) < GRADIENT_TOLERANCE) break;
      const alpha = exactStep(fn, x, d);
      x = add(x, d, alpha);
      if (!push(x, alpha)) break;
      const next = fn.gradient(x);
      const beta = Math.max(0, dot(next, [next[0] - g[0], next[1] - g[1]]) / dot(g, g));
      d = [-next[0] + beta * d[0], -next[1] + beta * d[1]];
      g = next;
    }
    return path;
  }

  if (method === 'bfgs') {
    // H approximates the inverse Hessian; it starts as the identity.
    let h: Mat = [
      [1, 0],
      [0, 1],
    ];
    let g = fn.gradient(x);
    for (let k = 0; k < n; k += 1) {
      if (Math.hypot(...g) < GRADIENT_TOLERANCE) break;
      const hg = matVec(h, g);
      const d: Point = [-hg[0], -hg[1]];
      const alpha = wolfeAlpha(fn, x, d);
      const next = add(x, d, alpha);
      const s: Point = [next[0] - x[0], next[1] - x[1]];
      const nextG = fn.gradient(next);
      const y: Point = [nextG[0] - g[0], nextG[1] - g[1]];
      const sy = dot(s, y);
      // The update keeps H positive definite only when sᵀy > 0.
      if (sy > 1e-12) {
        const rho = 1 / sy;
        const hy = matVec(h, y);
        const yhy = dot(y, hy);
        h = [
          [
            h[0][0] - rho * (s[0] * hy[0] + hy[0] * s[0]) + (rho * rho * yhy + rho) * s[0] * s[0],
            h[0][1] - rho * (s[0] * hy[1] + hy[0] * s[1]) + (rho * rho * yhy + rho) * s[0] * s[1],
          ],
          [
            h[1][0] - rho * (s[1] * hy[0] + hy[1] * s[0]) + (rho * rho * yhy + rho) * s[1] * s[0],
            h[1][1] - rho * (s[1] * hy[1] + hy[1] * s[1]) + (rho * rho * yhy + rho) * s[1] * s[1],
          ],
        ];
      }
      x = next;
      g = nextG;
      if (!push(x, alpha)) break;
    }
    return path;
  }

  // L-BFGS with the two-loop recursion over the last `memory` pairs.
  const pairs: { s: Point; y: Point; rho: number }[] = [];
  let g = fn.gradient(x);
  for (let k = 0; k < n; k += 1) {
    if (Math.hypot(...g) < GRADIENT_TOLERANCE) break;
    let q: Point = [g[0], g[1]];
    const alphas: number[] = [];
    for (let i = pairs.length - 1; i >= 0; i -= 1) {
      const pair = pairs[i] as { s: Point; y: Point; rho: number };
      const a = pair.rho * dot(pair.s, q);
      alphas[i] = a;
      q = add(q, pair.y, -a);
    }
    const last = pairs[pairs.length - 1];
    const gamma = last ? dot(last.s, last.y) / dot(last.y, last.y) : 1;
    let r: Point = [gamma * q[0], gamma * q[1]];
    pairs.forEach((pair, i) => {
      const b = pair.rho * dot(pair.y, r);
      r = add(r, pair.s, (alphas[i] ?? 0) - b);
    });
    const d: Point = [-r[0], -r[1]];
    const alpha = wolfeAlpha(fn, x, d);
    const next = add(x, d, alpha);
    const nextG = fn.gradient(next);
    const s: Point = [next[0] - x[0], next[1] - x[1]];
    const y: Point = [nextG[0] - g[0], nextG[1] - g[1]];
    const sy = dot(s, y);
    if (sy > 1e-12) {
      pairs.push({ s, y, rho: 1 / sy });
      if (pairs.length > memory) pairs.shift();
    }
    x = next;
    g = nextG;
    if (!push(x, alpha)) break;
  }
  return path;
}
