import type { RealFunction } from './index.ts';

/** Test functions for numerical methods, with exact derivatives and antiderivatives. */
export interface NumericFunction {
  id: string;
  latex: string;
  f: RealFunction;
  /** First, second and third derivatives, used for exact error references. */
  d1: RealFunction;
  d2: RealFunction;
  d3: RealFunction;
  antiderivative: RealFunction;
  /** Natural interval for plots, interpolation and quadrature. */
  domain: [number, number];
}

const runge = (x: number) => 1 / (1 + 25 * x * x);

const LIST: NumericFunction[] = [
  {
    id: 'exponencial',
    latex: 'e^{x}',
    f: Math.exp,
    d1: Math.exp,
    d2: Math.exp,
    d3: Math.exp,
    antiderivative: Math.exp,
    domain: [0, 2],
  },
  {
    id: 'seno',
    latex: '\\operatorname{sen} x',
    f: Math.sin,
    d1: Math.cos,
    d2: (x) => -Math.sin(x),
    d3: (x) => -Math.cos(x),
    antiderivative: (x) => -Math.cos(x),
    domain: [0, Math.PI],
  },
  {
    id: 'raiz',
    latex: '\\sqrt{x}',
    f: Math.sqrt,
    d1: (x) => 0.5 / Math.sqrt(x),
    d2: (x) => -0.25 * x ** -1.5,
    d3: (x) => 0.375 * x ** -2.5,
    antiderivative: (x) => (2 / 3) * x ** 1.5,
    domain: [0, 1],
  },
  {
    id: 'runge',
    latex: '\\dfrac{1}{1 + 25x^2}',
    f: runge,
    d1: (x) => (-50 * x) / (1 + 25 * x * x) ** 2,
    d2: (x) => (50 * (75 * x * x - 1)) / (1 + 25 * x * x) ** 3,
    d3: (x) => (-15000 * x * (25 * x * x - 1)) / (1 + 25 * x * x) ** 4,
    antiderivative: (x) => Math.atan(5 * x) / 5,
    domain: [-1, 1],
  },
  {
    id: 'valor-absoluto',
    latex: '|x|',
    f: Math.abs,
    d1: Math.sign,
    d2: () => 0,
    d3: () => 0,
    antiderivative: (x) => (x * Math.abs(x)) / 2,
    domain: [-1, 1],
  },
  {
    id: 'polinomio',
    latex: 'x^3 - 2x + 1',
    f: (x) => x ** 3 - 2 * x + 1,
    d1: (x) => 3 * x * x - 2,
    d2: (x) => 6 * x,
    d3: () => 6,
    antiderivative: (x) => x ** 4 / 4 - x * x + x,
    domain: [-1.5, 1.5],
  },
];

export const NUMERIC_FUNCTIONS: Readonly<Record<string, NumericFunction>> = Object.fromEntries(
  LIST.map((item) => [item.id, item]),
);

export const NUMERIC_FUNCTION_IDS = LIST.map((item) => item.id) as [string, ...string[]];

/** Right-hand sides y' = f(t, y) with exact solutions, for the ODE view. */
export interface OdeCase {
  id: string;
  latex: string;
  f: (t: number, y: number) => number;
  exact: (t: number) => number;
  t0: number;
  y0: number;
  tEnd: number;
}

const ODE_LIST: OdeCase[] = [
  {
    id: 'decaimiento',
    latex: "y' = -2y,\\ y(0) = 1",
    f: (_t, y) => -2 * y,
    exact: (t) => Math.exp(-2 * t),
    t0: 0,
    y0: 1,
    tEnd: 3,
  },
  {
    id: 'logistica',
    latex: "y' = y(1 - y),\\ y(0) = 0.1",
    f: (_t, y) => y * (1 - y),
    exact: (t) => 1 / (1 + 9 * Math.exp(-t)),
    t0: 0,
    y0: 0.1,
    tEnd: 8,
  },
  {
    id: 'forzada',
    latex: "y' = \\cos t - y,\\ y(0) = 0",
    f: (t, y) => Math.cos(t) - y,
    exact: (t) => (Math.cos(t) + Math.sin(t) - Math.exp(-t)) / 2,
    t0: 0,
    y0: 0,
    tEnd: 8,
  },
  {
    id: 'rigida',
    latex: "y' = -30y,\\ y(0) = 1",
    f: (_t, y) => -30 * y,
    exact: (t) => Math.exp(-30 * t),
    t0: 0,
    y0: 1,
    tEnd: 1,
  },
];

export const ODE_CASES: Readonly<Record<string, OdeCase>> = Object.fromEntries(
  ODE_LIST.map((item) => [item.id, item]),
);

export const ODE_CASE_IDS = ODE_LIST.map((item) => item.id) as [string, ...string[]];
