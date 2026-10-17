/**
 * Small numerical analysis toolkit for the Atlas visualizations: floating point
 * anatomy, error of finite differences, stable and unstable formulas,
 * interpolation, splines, quadrature, automatic differentiation, iterative
 * solvers and ODE integrators. Everything works on plain numbers and arrays.
 */

export type RealFunction = (x: number) => number;

/* ------------------------------------------------------------------ */
/* Floating point                                                      */
/* ------------------------------------------------------------------ */

export type FloatFormat = 'float32' | 'float64';

export interface FloatParts {
  /** Value actually stored after rounding to the format. */
  stored: number;
  sign: 0 | 1;
  /** Raw exponent bits, as a string of 0 and 1. */
  exponentBits: string;
  /** Raw fraction bits, as a string of 0 and 1. */
  fractionBits: string;
  /** Exponent without the bias; for subnormals, the minimum exponent. */
  exponent: number;
  /** 1.fraction for normal numbers, 0.fraction for subnormals. */
  significand: number;
  kind: 'normal' | 'subnormal' | 'cero' | 'infinito' | 'nan';
  /** Gap to the next representable number of larger magnitude. */
  ulp: number;
}

const FORMATS = {
  float32: { exponentBits: 8, fractionBits: 23, bias: 127 },
  float64: { exponentBits: 11, fractionBits: 52, bias: 1023 },
} as const;

/** Machine epsilon: the gap between 1 and the next representable number. */
export function machineEpsilon(format: FloatFormat): number {
  return 2 ** -FORMATS[format].fractionBits;
}

/** Rounds a number to the nearest value of the format. */
export function roundTo(format: FloatFormat, x: number): number {
  return format === 'float32' ? Math.fround(x) : x;
}

/** Decomposes x, rounded to the format, into sign, exponent and fraction bits. */
export function floatParts(x: number, format: FloatFormat): FloatParts {
  const spec = FORMATS[format];
  const stored = roundTo(format, x);
  let bits: string;
  if (format === 'float32') {
    const view = new DataView(new ArrayBuffer(4));
    view.setFloat32(0, stored);
    bits = view.getUint32(0).toString(2).padStart(32, '0');
  } else {
    const view = new DataView(new ArrayBuffer(8));
    view.setFloat64(0, stored);
    bits =
      view.getUint32(0).toString(2).padStart(32, '0') +
      view.getUint32(4).toString(2).padStart(32, '0');
  }
  const sign = bits[0] === '1' ? 1 : 0;
  const exponentBits = bits.slice(1, 1 + spec.exponentBits);
  const fractionBits = bits.slice(1 + spec.exponentBits);
  const rawExponent = parseInt(exponentBits, 2);
  const allOnes = 2 ** spec.exponentBits - 1;
  let fraction = 0;
  for (let i = 0; i < fractionBits.length; i += 1) {
    if (fractionBits[i] === '1') fraction += 2 ** -(i + 1);
  }
  let kind: FloatParts['kind'];
  let exponent: number;
  let significand: number;
  if (rawExponent === allOnes) {
    kind = fraction === 0 ? 'infinito' : 'nan';
    exponent = rawExponent - spec.bias;
    significand = 1 + fraction;
  } else if (rawExponent === 0) {
    kind = fraction === 0 ? 'cero' : 'subnormal';
    exponent = 1 - spec.bias;
    significand = fraction;
  } else {
    kind = 'normal';
    exponent = rawExponent - spec.bias;
    significand = 1 + fraction;
  }
  const ulp =
    kind === 'normal' || kind === 'subnormal' || kind === 'cero'
      ? 2 ** (exponent - spec.fractionBits)
      : Number.NaN;
  return { stored, sign, exponentBits, fractionBits, exponent, significand, kind, ulp };
}

/* ------------------------------------------------------------------ */
/* Finite differences                                                  */
/* ------------------------------------------------------------------ */

export type DifferenceScheme = 'adelante' | 'centrada';

/** Finite difference approximation of f'(x) with step h. */
export function finiteDifference(
  f: RealFunction,
  x: number,
  h: number,
  scheme: DifferenceScheme,
): number {
  return scheme === 'adelante' ? (f(x + h) - f(x)) / h : (f(x + h) - f(x - h)) / (2 * h);
}

/**
 * Model of the total error of a finite difference: truncation, proportional to
 * h or h^2, plus rounding, proportional to eps/h. `curvature` is the size of
 * f'' (forward) or f''' (central) near x.
 */
export function differenceErrorModel(
  h: number,
  scheme: DifferenceScheme,
  curvature: number,
  valueSize: number,
  epsilon = machineEpsilon('float64'),
): { truncation: number; rounding: number; total: number } {
  const truncation = scheme === 'adelante' ? (curvature * h) / 2 : (curvature * h * h) / 6;
  const rounding =
    scheme === 'adelante' ? (2 * epsilon * valueSize) / h : (epsilon * valueSize) / h;
  return { truncation, rounding, total: truncation + rounding };
}

/** Step that minimizes the error model. */
export function optimalStep(
  scheme: DifferenceScheme,
  curvature: number,
  valueSize: number,
  epsilon = machineEpsilon('float64'),
): number {
  return scheme === 'adelante'
    ? 2 * Math.sqrt((epsilon * valueSize) / curvature)
    : Math.cbrt((3 * epsilon * valueSize) / curvature);
}

/* ------------------------------------------------------------------ */
/* Stability                                                           */
/* ------------------------------------------------------------------ */

/**
 * I_n = integral of x^n e^(x - 1) on [0, 1] satisfies I_n = 1 - n I_(n-1).
 * Forward from I_0 = 1 - 1/e the initial rounding error is multiplied by n!;
 * backward from a crude guess at large N the error is divided by N!/n!.
 */
export function integralRecurrence(
  n: number,
  direction: 'adelante' | 'atras',
  start = 25,
): number[] {
  if (direction === 'adelante') {
    const values = [1 - Math.exp(-1)];
    for (let k = 1; k <= n; k += 1) values.push(1 - k * (values[k - 1] ?? 0));
    return values;
  }
  const values = new Array<number>(Math.max(n, start) + 1).fill(0);
  for (let k = Math.max(n, start); k >= 1; k -= 1) values[k - 1] = (1 - (values[k] ?? 0)) / k;
  return values.slice(0, n + 1);
}

/** Variance with the one-pass textbook formula E[X^2] - E[X]^2, prone to cancellation. */
export function naiveVariance(values: readonly number[]): number {
  const n = values.length;
  let sum = 0;
  let squares = 0;
  for (const v of values) {
    sum += v;
    squares += v * v;
  }
  return (squares - (sum * sum) / n) / (n - 1);
}

/** Variance with Welford's update, which never subtracts two large similar numbers. */
export function welfordVariance(values: readonly number[]): number {
  let mean = 0;
  let m2 = 0;
  values.forEach((v, i) => {
    const delta = v - mean;
    mean += delta / (i + 1);
    m2 += delta * (v - mean);
  });
  return m2 / (values.length - 1);
}

/* ------------------------------------------------------------------ */
/* Log-sum-exp                                                         */
/* ------------------------------------------------------------------ */

export function naiveLogSumExp(xs: readonly number[]): number {
  return Math.log(xs.reduce((sum, x) => sum + Math.exp(x), 0));
}

export function logSumExp(xs: readonly number[]): number {
  const m = Math.max(...xs);
  if (!Number.isFinite(m)) return m;
  return m + Math.log(xs.reduce((sum, x) => sum + Math.exp(x - m), 0));
}

/** Softmax computed through log-sum-exp, safe for large inputs. */
export function softmax(xs: readonly number[]): number[] {
  const lse = logSumExp(xs);
  return xs.map((x) => Math.exp(x - lse));
}

/* ------------------------------------------------------------------ */
/* Interpolation                                                       */
/* ------------------------------------------------------------------ */

export function equispacedNodes(n: number, a: number, b: number): number[] {
  if (n === 1) return [(a + b) / 2];
  return Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));
}

/** Chebyshev points of the first kind, clustered near the ends of [a, b]. */
export function chebyshevNodes(n: number, a: number, b: number): number[] {
  return Array.from({ length: n }, (_, i) => {
    const t = Math.cos(((2 * i + 1) * Math.PI) / (2 * n));
    return (a + b) / 2 + ((b - a) / 2) * -t;
  });
}

/** Interpolating polynomial through (xs, ys), evaluated with the barycentric formula. */
export function lagrangeInterpolant(xs: readonly number[], ys: readonly number[]): RealFunction {
  const weights = xs.map((xi, i) => {
    let w = 1;
    xs.forEach((xj, j) => {
      if (j !== i) w *= xi - xj;
    });
    return 1 / w;
  });
  return (x) => {
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < xs.length; i += 1) {
      const diff = x - (xs[i] ?? 0);
      if (diff === 0) return ys[i] ?? 0;
      const term = (weights[i] ?? 0) / diff;
      numerator += term * (ys[i] ?? 0);
      denominator += term;
    }
    return numerator / denominator;
  };
}

/** Largest absolute difference between f and g sampled on [a, b]. */
export function maxError(
  f: RealFunction,
  g: RealFunction,
  a: number,
  b: number,
  samples = 600,
): number {
  let worst = 0;
  for (let i = 0; i <= samples; i += 1) {
    const x = a + ((b - a) * i) / samples;
    worst = Math.max(worst, Math.abs(f(x) - g(x)));
  }
  return worst;
}

/** Natural cubic spline: piecewise cubics with continuous second derivative and zero curvature at the ends. */
export function naturalCubicSpline(
  xs: readonly number[],
  ys: readonly number[],
): RealFunction & { second: number[] } {
  const n = xs.length - 1;
  const h = Array.from({ length: n }, (_, i) => (xs[i + 1] ?? 0) - (xs[i] ?? 0));
  const second = new Array<number>(n + 1).fill(0);
  if (n >= 2) {
    // Tridiagonal system for the interior second derivatives (Thomas algorithm).
    const size = n - 1;
    const diag = new Array<number>(size).fill(0);
    const upper = new Array<number>(size).fill(0);
    const lower = new Array<number>(size).fill(0);
    const rhs = new Array<number>(size).fill(0);
    for (let i = 1; i < n; i += 1) {
      const hPrev = h[i - 1] ?? 1;
      const hNext = h[i] ?? 1;
      diag[i - 1] = 2 * (hPrev + hNext);
      lower[i - 1] = hPrev;
      upper[i - 1] = hNext;
      rhs[i - 1] =
        6 * (((ys[i + 1] ?? 0) - (ys[i] ?? 0)) / hNext - ((ys[i] ?? 0) - (ys[i - 1] ?? 0)) / hPrev);
    }
    for (let i = 1; i < size; i += 1) {
      const m = (lower[i] ?? 0) / (diag[i - 1] ?? 1);
      diag[i] = (diag[i] ?? 0) - m * (upper[i - 1] ?? 0);
      rhs[i] = (rhs[i] ?? 0) - m * (rhs[i - 1] ?? 0);
    }
    // Back substitution; second[n] stays 0, so the last interior row needs no correction.
    for (let i = size - 1; i >= 0; i -= 1) {
      const next = i < size - 1 ? (second[i + 2] ?? 0) : 0;
      second[i + 1] = ((rhs[i] ?? 0) - (upper[i] ?? 0) * next) / (diag[i] ?? 1);
    }
  }
  const evaluate = (x: number) => {
    let i = 0;
    while (i < n - 1 && x > (xs[i + 1] ?? 0)) i += 1;
    const x0 = xs[i] ?? 0;
    const x1 = xs[i + 1] ?? 0;
    const hi = h[i] ?? 1;
    const a = (x1 - x) / hi;
    const b = (x - x0) / hi;
    return (
      a * (ys[i] ?? 0) +
      b * (ys[i + 1] ?? 0) +
      (((a ** 3 - a) * (second[i] ?? 0) + (b ** 3 - b) * (second[i + 1] ?? 0)) * hi * hi) / 6
    );
  };
  return Object.assign(evaluate, { second });
}

/* ------------------------------------------------------------------ */
/* Quadrature                                                          */
/* ------------------------------------------------------------------ */

export type QuadratureRule = 'trapecio' | 'simpson' | 'gauss';

export function trapezoid(f: RealFunction, a: number, b: number, n: number): number {
  const h = (b - a) / n;
  let sum = (f(a) + f(b)) / 2;
  for (let i = 1; i < n; i += 1) sum += f(a + i * h);
  return sum * h;
}

/** Composite Simpson rule; n is rounded up to an even number of subintervals. */
export function simpson(f: RealFunction, a: number, b: number, n: number): number {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / m;
  let sum = f(a) + f(b);
  for (let i = 1; i < m; i += 1) sum += (i % 2 === 1 ? 4 : 2) * f(a + i * h);
  return (sum * h) / 3;
}

/** Nodes and weights of the n-point Gauss-Legendre rule on [-1, 1]. */
export function gaussLegendre(n: number): { nodes: number[]; weights: number[] } {
  const nodes: number[] = [];
  const weights: number[] = [];
  for (let i = 1; i <= n; i += 1) {
    // Newton's method on P_n starting from the Chebyshev-like guess.
    let x = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5));
    let derivative = 1;
    for (let iteration = 0; iteration < 100; iteration += 1) {
      let p0 = 1;
      let p1 = x;
      for (let k = 2; k <= n; k += 1) {
        const p2 = ((2 * k - 1) * x * p1 - (k - 1) * p0) / k;
        p0 = p1;
        p1 = p2;
      }
      const pn = n === 0 ? 1 : p1;
      const pPrev = n === 1 ? 1 : p0;
      derivative = (n * (x * pn - pPrev)) / (x * x - 1);
      const dx = pn / derivative;
      x -= dx;
      if (Math.abs(dx) < 1e-15) break;
    }
    nodes.push(x);
    weights.push(2 / ((1 - x * x) * derivative * derivative));
  }
  return { nodes: nodes.reverse(), weights: weights.reverse() };
}

export function gaussQuadrature(f: RealFunction, a: number, b: number, n: number): number {
  const { nodes, weights } = gaussLegendre(n);
  const half = (b - a) / 2;
  const mid = (a + b) / 2;
  return nodes.reduce((sum, t, i) => sum + (weights[i] ?? 0) * f(mid + half * t), 0) * half;
}

/** Number of evaluations of f that each rule spends with parameter n. */
export function quadratureEvaluations(rule: QuadratureRule, n: number): number {
  if (rule === 'gauss') return n;
  if (rule === 'simpson') return (n % 2 === 0 ? n : n + 1) + 1;
  return n + 1;
}

export function quadrature(
  rule: QuadratureRule,
  f: RealFunction,
  a: number,
  b: number,
  n: number,
): number {
  if (rule === 'trapecio') return trapezoid(f, a, b, n);
  if (rule === 'simpson') return simpson(f, a, b, n);
  return gaussQuadrature(f, a, b, n);
}

/* ------------------------------------------------------------------ */
/* Automatic differentiation                                           */
/* ------------------------------------------------------------------ */

export interface GraphNode {
  id: string;
  /** LaTeX of the operation, such as "x_1 x_2". */
  latex: string;
  inputs: string[];
  value: number;
  /** Forward mode: derivative with respect to the chosen input. */
  tangent: number;
  /** Reverse mode: derivative of the output with respect to this node. */
  adjoint: number;
}

/**
 * Computational graph of f(x1, x2) = x1 x2 + sin(x1). Forward mode propagates
 * tangents from one input; reverse mode propagates adjoints from the output
 * and gives both partial derivatives in a single sweep.
 */
export function autodiffGraph(x1: number, x2: number, seed: 'x1' | 'x2'): GraphNode[] {
  const v1 = x1;
  const v2 = x2;
  const v3 = v1 * v2;
  const v4 = Math.sin(v1);
  const v5 = v3 + v4;
  const t1 = seed === 'x1' ? 1 : 0;
  const t2 = seed === 'x2' ? 1 : 0;
  const t3 = t1 * v2 + v1 * t2;
  const t4 = Math.cos(v1) * t1;
  const t5 = t3 + t4;
  const a5 = 1;
  const a4 = a5;
  const a3 = a5;
  const a2 = a3 * v1;
  const a1 = a3 * v2 + a4 * Math.cos(v1);
  return [
    { id: 'v1', latex: 'x_1', inputs: [], value: v1, tangent: t1, adjoint: a1 },
    { id: 'v2', latex: 'x_2', inputs: [], value: v2, tangent: t2, adjoint: a2 },
    { id: 'v3', latex: 'v_1 v_2', inputs: ['v1', 'v2'], value: v3, tangent: t3, adjoint: a3 },
    {
      id: 'v4',
      latex: '\\operatorname{sen} v_1',
      inputs: ['v1'],
      value: v4,
      tangent: t4,
      adjoint: a4,
    },
    { id: 'v5', latex: 'v_3 + v_4', inputs: ['v3', 'v4'], value: v5, tangent: t5, adjoint: a5 },
  ];
}

/* ------------------------------------------------------------------ */
/* Iterative linear solvers                                            */
/* ------------------------------------------------------------------ */

export type IterativeMethod = 'jacobi' | 'gauss-seidel';

/** Iterates of Jacobi or Gauss-Seidel for A x = b, starting at x0. */
export function iterativeSolve(
  A: readonly (readonly number[])[],
  b: readonly number[],
  x0: readonly number[],
  method: IterativeMethod,
  iterations: number,
): number[][] {
  const n = b.length;
  const path = [x0.slice()];
  let x = x0.slice();
  for (let k = 0; k < iterations; k += 1) {
    const next = x.slice();
    for (let i = 0; i < n; i += 1) {
      const row = A[i] ?? [];
      let sum = b[i] ?? 0;
      for (let j = 0; j < n; j += 1) {
        if (j === i) continue;
        const xj = method === 'gauss-seidel' ? (next[j] ?? 0) : (x[j] ?? 0);
        sum -= (row[j] ?? 0) * xj;
      }
      next[i] = sum / (row[i] ?? 1);
    }
    x = next;
    path.push(x.slice());
  }
  return path;
}

/** Spectral radius of the iteration matrix of a 2 by 2 system, which decides convergence. */
export function iterationRadius(
  A: readonly (readonly number[])[],
  method: IterativeMethod,
): number {
  const a = A[0]?.[0] ?? 1;
  const b = A[0]?.[1] ?? 0;
  const c = A[1]?.[0] ?? 0;
  const d = A[1]?.[1] ?? 1;
  const product = (b * c) / (a * d);
  return method === 'jacobi' ? Math.sqrt(Math.abs(product)) : Math.abs(product);
}

/* ------------------------------------------------------------------ */
/* Ordinary differential equations                                     */
/* ------------------------------------------------------------------ */

export type OdeMethod = 'euler' | 'rk2' | 'rk4';
export type OdeRight = (t: number, y: number) => number;

/** Steps of y' = f(t, y) from (t0, y0) with step h. */
export function solveOde(
  f: OdeRight,
  t0: number,
  y0: number,
  h: number,
  steps: number,
  method: OdeMethod,
): { t: number; y: number }[] {
  const points = [{ t: t0, y: y0 }];
  let t = t0;
  let y = y0;
  for (let k = 0; k < steps; k += 1) {
    if (method === 'euler') {
      y += h * f(t, y);
    } else if (method === 'rk2') {
      const k1 = f(t, y);
      const k2 = f(t + h, y + h * k1);
      y += (h * (k1 + k2)) / 2;
    } else {
      const k1 = f(t, y);
      const k2 = f(t + h / 2, y + (h * k1) / 2);
      const k3 = f(t + h / 2, y + (h * k2) / 2);
      const k4 = f(t + h, y + h * k3);
      y += (h * (k1 + 2 * k2 + 2 * k3 + k4)) / 6;
    }
    t += h;
    points.push({ t, y });
  }
  return points;
}

/** Order of accuracy of each method: the global error behaves like h^order. */
export const ODE_ORDER: Readonly<Record<OdeMethod, number>> = { euler: 1, rk2: 2, rk4: 4 };
