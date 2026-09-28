/**
 * Numerical calculus for one-variable functions.
 */

export type RealFunction = (x: number) => number;

/** Central difference with a step scaled to the magnitude of x. */
export function derivative(
  f: RealFunction,
  x: number,
  h = 1e-5 * Math.max(1, Math.abs(x)),
): number {
  return (f(x + h) - f(x - h)) / (2 * h);
}

export function secondDerivative(
  f: RealFunction,
  x: number,
  h = 1e-4 * Math.max(1, Math.abs(x)),
): number {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}

/** Slope of the secant through (x, f(x)) and (x + h, f(x + h)). */
export function secantSlope(f: RealFunction, x: number, h: number): number {
  return (f(x + h) - f(x)) / h;
}

export type RiemannRule = 'izquierda' | 'derecha' | 'punto-medio' | 'trapecio';

export interface RiemannPiece {
  x0: number;
  x1: number;
  /** Height used for the rectangle, or the two heights for the trapezoid rule. */
  heights: [number, number];
  area: number;
}

export function riemannPieces(
  f: RealFunction,
  a: number,
  b: number,
  n: number,
  rule: RiemannRule,
): RiemannPiece[] {
  const width = (b - a) / n;
  return Array.from({ length: n }, (_, i) => {
    const x0 = a + i * width;
    const x1 = x0 + width;
    if (rule === 'trapecio') {
      const y0 = f(x0);
      const y1 = f(x1);
      return { x0, x1, heights: [y0, y1], area: (width * (y0 + y1)) / 2 };
    }
    const x = rule === 'izquierda' ? x0 : rule === 'derecha' ? x1 : (x0 + x1) / 2;
    const y = f(x);
    return { x0, x1, heights: [y, y], area: width * y };
  });
}

export function riemannSum(
  f: RealFunction,
  a: number,
  b: number,
  n: number,
  rule: RiemannRule,
): number {
  return riemannPieces(f, a, b, n, rule).reduce((total, piece) => total + piece.area, 0);
}

export function simpson(f: RealFunction, a: number, b: number, n = 100): number {
  const steps = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / steps;
  let total = f(a) + f(b);
  for (let i = 1; i < steps; i += 1) total += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  return (total * h) / 3;
}

/** Adaptive Simpson quadrature with a global error tolerance. */
export function integrate(
  f: RealFunction,
  a: number,
  b: number,
  tolerance = 1e-10,
  maxDepth = 40,
): number {
  const simpsonRule = (x0: number, x1: number, f0: number, fm: number, f1: number) =>
    ((x1 - x0) / 6) * (f0 + 4 * fm + f1);
  const recurse = (
    x0: number,
    x1: number,
    f0: number,
    fm: number,
    f1: number,
    whole: number,
    tol: number,
    depth: number,
  ): number => {
    const m = (x0 + x1) / 2;
    const lm = (x0 + m) / 2;
    const rm = (m + x1) / 2;
    const flm = f(lm);
    const frm = f(rm);
    const left = simpsonRule(x0, m, f0, flm, fm);
    const right = simpsonRule(m, x1, fm, frm, f1);
    const delta = left + right - whole;
    if (depth <= 0 || Math.abs(delta) <= 15 * tol) return left + right + delta / 15;
    return (
      recurse(x0, m, f0, flm, fm, left, tol / 2, depth - 1) +
      recurse(m, x1, fm, frm, f1, right, tol / 2, depth - 1)
    );
  };
  const fa = f(a);
  const fb = f(b);
  const fm = f((a + b) / 2);
  return recurse(a, b, fa, fm, fb, simpsonRule(a, b, fa, fm, fb), tolerance, maxDepth);
}

export interface TaylorFunction {
  id: string;
  label: string;
  f: RealFunction;
  /** n-th derivative evaluated at x. */
  derivativeAt: (n: number, x: number) => number;
  /** Interval where the function is defined and plotted. */
  domain: [number, number];
}

function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

/** Functions with closed-form derivatives of every order, for Taylor polynomials. */
export const TAYLOR_FUNCTIONS: Record<string, TaylorFunction> = {
  exp: {
    id: 'exp',
    label: 'e^x',
    f: Math.exp,
    derivativeAt: (_n, x) => Math.exp(x),
    domain: [-4, 4],
  },
  sin: {
    id: 'sin',
    label: 'sen x',
    f: Math.sin,
    derivativeAt: (n, x) => Math.sin(x + (n * Math.PI) / 2),
    domain: [-2 * Math.PI, 2 * Math.PI],
  },
  cos: {
    id: 'cos',
    label: 'cos x',
    f: Math.cos,
    derivativeAt: (n, x) => Math.cos(x + (n * Math.PI) / 2),
    domain: [-2 * Math.PI, 2 * Math.PI],
  },
  log1p: {
    id: 'log1p',
    label: 'log(1 + x)',
    f: (x) => Math.log(1 + x),
    derivativeAt: (n, x) =>
      n === 0 ? Math.log(1 + x) : ((-1) ** (n - 1) * factorial(n - 1)) / (1 + x) ** n,
    domain: [-0.95, 3],
  },
  geometric: {
    id: 'geometric',
    label: '1 / (1 - x)',
    f: (x) => 1 / (1 - x),
    derivativeAt: (n, x) => factorial(n) / (1 - x) ** (n + 1),
    domain: [-2, 0.95],
  },
};

/** Taylor polynomial of the given order around x0, as a function. */
export function taylorPolynomial(fn: TaylorFunction, x0: number, order: number): RealFunction {
  const coefficients = Array.from(
    { length: order + 1 },
    (_, n) => fn.derivativeAt(n, x0) / factorial(n),
  );
  return (x: number) => {
    let total = 0;
    let power = 1;
    for (const coefficient of coefficients) {
      total += coefficient * power;
      power *= x - x0;
    }
    return total;
  };
}

/** Samples a function on an even grid, skipping non-finite values. */
export function sampleFunction(
  f: RealFunction,
  a: number,
  b: number,
  points = 200,
): { x: number; y: number }[] {
  const result: { x: number; y: number }[] = [];
  for (let i = 0; i <= points; i += 1) {
    const x = a + ((b - a) * i) / points;
    const y = f(x);
    if (Number.isFinite(y)) result.push({ x, y });
  }
  return result;
}
