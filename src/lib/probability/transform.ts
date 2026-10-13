/**
 * Transformations Y = g(X) of a continuous random variable: the inverse
 * branches of g, the density of Y by the change of variables formula and the
 * distribution function of Y by the CDF method.
 */

export const TRANSFORM_IDS = [
  'cuadrado',
  'exponencial',
  'logaritmo-negativo',
  'lineal',
  'raiz',
  'reciproco',
] as const;
export type TransformId = (typeof TRANSFORM_IDS)[number];

export interface InverseBranch {
  /** The x with g(x) = y on this branch. */
  x: (y: number) => number;
  /** Derivative dx/dy on this branch, whose absolute value is the Jacobian. */
  dxdy: (y: number) => number;
}

export interface Transform {
  id: TransformId;
  g: (x: number) => number;
  /** Derivative g'(x). */
  dg: (x: number) => number;
  /** LaTeX of g(x). */
  tex: string;
  /** Inverse branches valid for a given y; empty when y is not attained. */
  branches: (y: number) => InverseBranch[];
  monotone: boolean;
}

export function transformOf(id: TransformId, a = 2, b = 1): Transform {
  switch (id) {
    case 'cuadrado':
      return {
        id,
        g: (x) => x * x,
        dg: (x) => 2 * x,
        tex: 'x^2',
        branches: (y) =>
          y > 0
            ? [
                { x: (v) => Math.sqrt(v), dxdy: (v) => 1 / (2 * Math.sqrt(v)) },
                { x: (v) => -Math.sqrt(v), dxdy: (v) => -1 / (2 * Math.sqrt(v)) },
              ]
            : [],
        monotone: false,
      };
    case 'exponencial':
      return {
        id,
        g: (x) => Math.exp(x),
        dg: (x) => Math.exp(x),
        tex: 'e^{x}',
        branches: (y) => (y > 0 ? [{ x: (v) => Math.log(v), dxdy: (v) => 1 / v }] : []),
        monotone: true,
      };
    case 'logaritmo-negativo':
      return {
        id,
        g: (x) => -Math.log(x),
        dg: (x) => -1 / x,
        tex: '-\\log x',
        branches: (y) => (y >= 0 ? [{ x: (v) => Math.exp(-v), dxdy: (v) => -Math.exp(-v) }] : []),
        monotone: true,
      };
    case 'lineal':
      return {
        id,
        g: (x) => a * x + b,
        dg: () => a,
        tex: `${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}`,
        branches: () => [{ x: (v) => (v - b) / a, dxdy: () => 1 / a }],
        monotone: true,
      };
    case 'raiz':
      return {
        id,
        g: (x) => Math.sqrt(x),
        dg: (x) => 1 / (2 * Math.sqrt(x)),
        tex: '\\sqrt{x}',
        branches: (y) => (y >= 0 ? [{ x: (v) => v * v, dxdy: (v) => 2 * v }] : []),
        monotone: true,
      };
    case 'reciproco':
      return {
        id,
        g: (x) => 1 / x,
        dg: (x) => -1 / (x * x),
        tex: '1/x',
        branches: (y) => (y > 0 ? [{ x: (v) => 1 / v, dxdy: (v) => -1 / (v * v) }] : []),
        monotone: true,
      };
  }
}

/** Density of Y = g(X) by the change of variables formula, summing over the inverse branches. */
export function transformedDensity(
  pdf: (x: number) => number,
  transform: Transform,
  y: number,
): number {
  return transform
    .branches(y)
    .reduce((sum, branch) => sum + pdf(branch.x(y)) * Math.abs(branch.dxdy(y)), 0);
}

/** Intervals of [lo, hi] where g(x) <= y, with endpoints refined by bisection. */
export function sublevelIntervals(
  transform: Transform,
  y: number,
  lo: number,
  hi: number,
  steps = 400,
): [number, number][] {
  const inside = (x: number) => transform.g(x) <= y;
  const refine = (a: number, b: number) => {
    // a and b lie on opposite sides of the boundary.
    let left = a;
    let right = b;
    const leftInside = inside(left);
    for (let i = 0; i < 50; i += 1) {
      const mid = (left + right) / 2;
      if (inside(mid) === leftInside) left = mid;
      else right = mid;
    }
    return (left + right) / 2;
  };
  const h = (hi - lo) / steps;
  const intervals: [number, number][] = [];
  let start: number | null = inside(lo) ? lo : null;
  for (let i = 1; i <= steps; i += 1) {
    const a = lo + (i - 1) * h;
    const b = lo + i * h;
    const was = inside(a);
    const now = inside(b);
    if (!was && now) start = refine(a, b);
    if (was && !now && start !== null) {
      intervals.push([start, refine(a, b)]);
      start = null;
    }
  }
  if (start !== null) intervals.push([start, hi]);
  return intervals;
}

/**
 * F_Y(y) = P(g(X) <= y) by the CDF method: the probability, under X, of the
 * set where g(x) <= y, computed from the distribution function of X on the
 * intervals that form that set.
 */
export function transformedCdf(
  cdf: (x: number) => number,
  transform: Transform,
  y: number,
  lo: number,
  hi: number,
): number {
  return sublevelIntervals(transform, y, lo, hi).reduce((sum, [a, b]) => sum + cdf(b) - cdf(a), 0);
}
