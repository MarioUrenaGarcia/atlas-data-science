import type { RealFunction } from './index.ts';

/** A function studied near a point: its one-sided limits and its value there, if any. */
export interface LimitCase {
  id: string;
  latex: string;
  f: RealFunction;
  point: number;
  /** Limits from the left and right; Infinity or -Infinity for vertical asymptotes, NaN if they do not exist. */
  left: number;
  right: number;
  /** f(point), or NaN when the function is not defined there. */
  value: number;
  domain: [number, number];
}

const H = (x: number) => (x >= 0 ? 1 : 0);

export const LIMIT_CASES: Readonly<Record<string, LimitCase>> = {
  continua: {
    id: 'continua',
    latex: 'f(x) = x^2 - 2x + 2',
    f: (x) => x * x - 2 * x + 2,
    point: 2,
    left: 2,
    right: 2,
    value: 2,
    domain: [-0.5, 4],
  },
  removible: {
    id: 'removible',
    latex: 'f(x) = \\dfrac{x^2 - 1}{x - 1}',
    f: (x) => (x === 1 ? NaN : (x * x - 1) / (x - 1)),
    point: 1,
    left: 2,
    right: 2,
    value: NaN,
    domain: [-1.5, 3.5],
  },
  'removible-redefinida': {
    id: 'removible-redefinida',
    latex: 'f(x) = \\begin{cases} x + 1 & x \\neq 1 \\\\ 3 & x = 1 \\end{cases}',
    f: (x) => (x === 1 ? 3 : x + 1),
    point: 1,
    left: 2,
    right: 2,
    value: 3,
    domain: [-1.5, 3.5],
  },
  salto: {
    id: 'salto',
    latex: 'f(x) = H(x) + \\tfrac{x}{2}',
    f: (x) => H(x) + x / 2,
    point: 0,
    left: 0,
    right: 1,
    value: 1,
    domain: [-3, 3],
  },
  infinito: {
    id: 'infinito',
    latex: 'f(x) = \\dfrac{1}{(x - 1)^2}',
    f: (x) => 1 / ((x - 1) * (x - 1)),
    point: 1,
    left: Infinity,
    right: Infinity,
    value: NaN,
    domain: [-1.5, 3.5],
  },
  'infinito-signos': {
    id: 'infinito-signos',
    latex: 'f(x) = \\dfrac{1}{x}',
    f: (x) => 1 / x,
    point: 0,
    left: -Infinity,
    right: Infinity,
    value: NaN,
    domain: [-3, 3],
  },
  oscilante: {
    id: 'oscilante',
    latex: 'f(x) = \\operatorname{sen}\\!\\big(\\tfrac{1}{x}\\big)',
    f: (x) => Math.sin(1 / x),
    point: 0,
    left: NaN,
    right: NaN,
    value: NaN,
    domain: [-0.6, 0.6],
  },
  'seno-sobre-x': {
    id: 'seno-sobre-x',
    latex: 'f(x) = \\dfrac{\\operatorname{sen} x}{x}',
    f: (x) => Math.sin(x) / x,
    point: 0,
    left: 1,
    right: 1,
    value: NaN,
    domain: [-8, 8],
  },
  'valor-absoluto': {
    id: 'valor-absoluto',
    latex: 'f(x) = \\dfrac{|x|}{x}',
    f: (x) => Math.abs(x) / x,
    point: 0,
    left: -1,
    right: 1,
    value: NaN,
    domain: [-3, 3],
  },
};

export const LIMIT_CASE_IDS = Object.keys(LIMIT_CASES) as [string, ...string[]];

/** A 0/0 quotient near a point, with the derivatives used by L'Hôpital's rule. */
export interface QuotientCase {
  id: string;
  latex: string;
  derivativesLatex: string;
  f: RealFunction;
  g: RealFunction;
  df: RealFunction;
  dg: RealFunction;
  point: number;
  limit: number;
  domain: [number, number];
}

export const QUOTIENT_CASES: Readonly<Record<string, QuotientCase>> = {
  'seno-x': {
    id: 'seno-x',
    latex: '\\dfrac{\\operatorname{sen} x}{x}',
    derivativesLatex: '\\dfrac{\\cos x}{1}',
    f: Math.sin,
    g: (x) => x,
    df: Math.cos,
    dg: () => 1,
    point: 0,
    limit: 1,
    domain: [-3, 3],
  },
  'exp-menos-uno': {
    id: 'exp-menos-uno',
    latex: '\\dfrac{e^{x} - 1}{x}',
    derivativesLatex: '\\dfrac{e^{x}}{1}',
    f: (x) => Math.exp(x) - 1,
    g: (x) => x,
    df: Math.exp,
    dg: () => 1,
    point: 0,
    limit: 1,
    domain: [-2, 2],
  },
  'uno-menos-coseno': {
    id: 'uno-menos-coseno',
    latex: '\\dfrac{1 - \\cos x}{x^2}',
    derivativesLatex: '\\dfrac{\\operatorname{sen} x}{2x}',
    f: (x) => 1 - Math.cos(x),
    g: (x) => x * x,
    df: Math.sin,
    dg: (x) => 2 * x,
    point: 0,
    limit: 0.5,
    domain: [-3, 3],
  },
  'log-x-menos-uno': {
    id: 'log-x-menos-uno',
    latex: '\\dfrac{\\log x}{x - 1}',
    derivativesLatex: '\\dfrac{1/x}{1}',
    f: Math.log,
    g: (x) => x - 1,
    df: (x) => 1 / x,
    dg: () => 1,
    point: 1,
    limit: 1,
    domain: [0.2, 2.5],
  },
  'cubo-menos-ocho': {
    id: 'cubo-menos-ocho',
    latex: '\\dfrac{x^3 - 8}{x - 2}',
    derivativesLatex: '\\dfrac{3x^2}{1}',
    f: (x) => x ** 3 - 8,
    g: (x) => x - 2,
    df: (x) => 3 * x * x,
    dg: () => 1,
    point: 2,
    limit: 12,
    domain: [0.5, 3.5],
  },
};

export const QUOTIENT_CASE_IDS = Object.keys(QUOTIENT_CASES) as [string, ...string[]];

/** ∫_a^b h(x) dx = ∫_{g(a)}^{g(b)} k(u) du with u = g(x). */
export interface SubstitutionCase {
  id: string;
  leftLatex: string;
  rightLatex: string;
  substitutionLatex: string;
  h: RealFunction;
  k: RealFunction;
  g: RealFunction;
  a: number;
  b: number;
}

export const SUBSTITUTION_CASES: Readonly<Record<string, SubstitutionCase>> = {
  'coseno-cuadrado': {
    id: 'coseno-cuadrado',
    leftLatex: '\\int_0^{\\sqrt{\\pi/2}} 2x\\cos(x^2)\\,dx',
    rightLatex: '\\int_0^{\\pi/2} \\cos u\\,du',
    substitutionLatex: 'u = x^2,\\ du = 2x\\,dx',
    h: (x) => 2 * x * Math.cos(x * x),
    k: Math.cos,
    g: (x) => x * x,
    a: 0,
    b: Math.sqrt(Math.PI / 2),
  },
  'gauss-lineal': {
    id: 'gauss-lineal',
    leftLatex: '\\int_0^{2} x\\,e^{-x^2}\\,dx',
    rightLatex: '\\int_0^{4} \\tfrac{1}{2}e^{-u}\\,du',
    substitutionLatex: 'u = x^2,\\ du = 2x\\,dx',
    h: (x) => x * Math.exp(-x * x),
    k: (u) => 0.5 * Math.exp(-u),
    g: (x) => x * x,
    a: 0,
    b: 2,
  },
  'lineal-interior': {
    id: 'lineal-interior',
    leftLatex: '\\int_1^{2} (2x - 1)^3\\,dx',
    rightLatex: '\\int_1^{3} \\tfrac{1}{2}u^3\\,du',
    substitutionLatex: 'u = 2x - 1,\\ du = 2\\,dx',
    h: (x) => (2 * x - 1) ** 3,
    k: (u) => 0.5 * u ** 3,
    g: (x) => 2 * x - 1,
    a: 1,
    b: 2,
  },
  logaritmo: {
    id: 'logaritmo',
    leftLatex: '\\int_1^{e} \\frac{(\\log x)^2}{x}\\,dx',
    rightLatex: '\\int_0^{1} u^2\\,du',
    substitutionLatex: 'u = \\log x,\\ du = \\tfrac{dx}{x}',
    h: (x) => Math.log(x) ** 2 / x,
    k: (u) => u * u,
    g: Math.log,
    a: 1,
    b: Math.E,
  },
};

export const SUBSTITUTION_CASE_IDS = Object.keys(SUBSTITUTION_CASES) as [string, ...string[]];

/** Integration by parts drawn as the curve (u(t), v(t)) for t in [a, b]. */
export interface PartsCase {
  id: string;
  integralLatex: string;
  choiceLatex: string;
  u: RealFunction;
  v: RealFunction;
  du: RealFunction;
  dv: RealFunction;
  a: number;
  b: number;
}

export const PARTS_CASES: Readonly<Record<string, PartsCase>> = {
  'x-exponencial': {
    id: 'x-exponencial',
    integralLatex: '\\int_0^1 x\\,e^{x}\\,dx',
    choiceLatex: 'u = x,\\ dv = e^{x}\\,dx \\ \\Rightarrow\\ du = dx,\\ v = e^{x}',
    u: (t) => t,
    v: Math.exp,
    du: () => 1,
    dv: Math.exp,
    a: 0,
    b: 1,
  },
  logaritmo: {
    id: 'logaritmo',
    integralLatex: '\\int_1^{e} \\log x\\,dx',
    choiceLatex: 'u = \\log x,\\ dv = dx \\ \\Rightarrow\\ du = \\tfrac{dx}{x},\\ v = x',
    u: Math.log,
    v: (t) => t,
    du: (t) => 1 / t,
    dv: () => 1,
    a: 1,
    b: Math.E,
  },
  'x-coseno': {
    id: 'x-coseno',
    integralLatex: '\\int_0^{\\pi/2} x\\cos x\\,dx',
    choiceLatex:
      'u = x,\\ dv = \\cos x\\,dx \\ \\Rightarrow\\ du = dx,\\ v = \\operatorname{sen} x',
    u: (t) => t,
    v: Math.sin,
    du: () => 1,
    dv: Math.cos,
    a: 0,
    b: Math.PI / 2,
  },
};

export const PARTS_CASE_IDS = Object.keys(PARTS_CASES) as [string, ...string[]];

/** An improper integral: an infinite upper limit or a singularity at the lower one. */
export interface ImproperCase {
  id: string;
  latex: string;
  f: RealFunction;
  /** Antiderivative used to compute partial integrals exactly. */
  F: RealFunction;
  kind: 'infinito' | 'singular';
  /** Finite end of the interval. */
  a: number;
  /** Value of the integral, or Infinity if it diverges. */
  value: number;
}

export const IMPROPER_CASES: Readonly<Record<string, ImproperCase>> = {
  'inverso-cuadrado': {
    id: 'inverso-cuadrado',
    latex: '\\int_1^{\\infty} \\frac{dx}{x^2}',
    f: (x) => 1 / (x * x),
    F: (x) => -1 / x,
    kind: 'infinito',
    a: 1,
    value: 1,
  },
  reciproca: {
    id: 'reciproca',
    latex: '\\int_1^{\\infty} \\frac{dx}{x}',
    f: (x) => 1 / x,
    F: Math.log,
    kind: 'infinito',
    a: 1,
    value: Infinity,
  },
  exponencial: {
    id: 'exponencial',
    latex: '\\int_0^{\\infty} e^{-x}\\,dx',
    f: (x) => Math.exp(-x),
    F: (x) => -Math.exp(-x),
    kind: 'infinito',
    a: 0,
    value: 1,
  },
  'inverso-raiz': {
    id: 'inverso-raiz',
    latex: '\\int_0^{1} \\frac{dx}{\\sqrt{x}}',
    f: (x) => 1 / Math.sqrt(x),
    F: (x) => 2 * Math.sqrt(x),
    kind: 'singular',
    a: 1,
    value: 2,
  },
  'reciproca-singular': {
    id: 'reciproca-singular',
    latex: '\\int_0^{1} \\frac{dx}{x}',
    f: (x) => 1 / x,
    F: Math.log,
    kind: 'singular',
    a: 1,
    value: Infinity,
  },
};

export const IMPROPER_CASE_IDS = Object.keys(IMPROPER_CASES) as [string, ...string[]];
