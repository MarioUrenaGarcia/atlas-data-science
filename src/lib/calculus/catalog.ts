import { erf, gammaFunction } from '../distributions/special.ts';
import type { RealFunction } from './index.ts';

/**
 * Functions of one variable with exact first and second derivatives and, when
 * it exists in closed form, an antiderivative. Visualizations draw the exact
 * derivative instead of a numerical one so tangents and areas are precise.
 */
export interface CalcFunction {
  id: string;
  /** LaTeX of f(x). */
  latex: string;
  /** LaTeX of f'(x), when it has a readable closed form. */
  derivativeLatex?: string;
  f: RealFunction;
  df: RealFunction;
  d2f: RealFunction;
  /** An antiderivative, F' = f. */
  antiderivative?: RealFunction;
  antiderivativeLatex?: string;
  /** Interval where the function is plotted. */
  domain: [number, number];
}

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
const softplus = (x: number) => (x > 30 ? x : Math.log1p(Math.exp(x)));
const SQRT_PI = Math.sqrt(Math.PI);

function entry(
  id: string,
  latex: string,
  f: RealFunction,
  df: RealFunction,
  d2f: RealFunction,
  domain: [number, number],
  extra: Partial<
    Pick<CalcFunction, 'derivativeLatex' | 'antiderivative' | 'antiderivativeLatex'>
  > = {},
): CalcFunction {
  return { id, latex, f, df, d2f, domain, ...extra };
}

const LIST: CalcFunction[] = [
  entry(
    'cuadrada',
    'x^2',
    (x) => x * x,
    (x) => 2 * x,
    () => 2,
    [-3, 3],
    {
      derivativeLatex: '2x',
      antiderivative: (x) => (x * x * x) / 3,
      antiderivativeLatex: '\\tfrac{x^3}{3}',
    },
  ),
  entry(
    'cubica',
    'x^3 - 3x',
    (x) => x ** 3 - 3 * x,
    (x) => 3 * x * x - 3,
    (x) => 6 * x,
    [-2.5, 2.5],
    {
      derivativeLatex: '3x^2 - 3',
      antiderivative: (x) => x ** 4 / 4 - (3 * x * x) / 2,
      antiderivativeLatex: '\\tfrac{x^4}{4} - \\tfrac{3x^2}{2}',
    },
  ),
  entry(
    'cubica-recorrido',
    'x^3 - 6x^2 + 9x',
    (x) => x ** 3 - 6 * x * x + 9 * x,
    (x) => 3 * x * x - 12 * x + 9,
    (x) => 6 * x - 12,
    [0, 4],
    {
      derivativeLatex: '3x^2 - 12x + 9',
      antiderivative: (x) => x ** 4 / 4 - 2 * x ** 3 + (9 * x * x) / 2,
      antiderivativeLatex: '\\tfrac{x^4}{4} - 2x^3 + \\tfrac{9x^2}{2}',
    },
  ),
  entry(
    'costo',
    'x^3 - 6x^2 + 15x',
    (x) => x ** 3 - 6 * x * x + 15 * x,
    (x) => 3 * x * x - 12 * x + 15,
    (x) => 6 * x - 12,
    [0, 4.5],
    {
      derivativeLatex: '3x^2 - 12x + 15',
      antiderivative: (x) => x ** 4 / 4 - 2 * x ** 3 + (15 * x * x) / 2,
      antiderivativeLatex: '\\tfrac{x^4}{4} - 2x^3 + \\tfrac{15x^2}{2}',
    },
  ),
  entry(
    'cuartica',
    'x^4 - 4x^2 + x',
    (x) => x ** 4 - 4 * x * x + x,
    (x) => 4 * x ** 3 - 8 * x + 1,
    (x) => 12 * x * x - 8,
    [-2.3, 2.3],
    { derivativeLatex: '4x^3 - 8x + 1' },
  ),
  entry(
    'seno',
    '\\operatorname{sen} x',
    Math.sin,
    Math.cos,
    (x) => -Math.sin(x),
    [-2 * Math.PI, 2 * Math.PI],
    {
      derivativeLatex: '\\cos x',
      antiderivative: (x) => -Math.cos(x),
      antiderivativeLatex: '-\\cos x',
    },
  ),
  entry(
    'coseno',
    '\\cos x',
    Math.cos,
    (x) => -Math.sin(x),
    (x) => -Math.cos(x),
    [-2 * Math.PI, 2 * Math.PI],
    {
      derivativeLatex: '-\\operatorname{sen} x',
      antiderivative: Math.sin,
      antiderivativeLatex: '\\operatorname{sen} x',
    },
  ),
  entry('exponencial', 'e^x', Math.exp, Math.exp, Math.exp, [-3, 2.5], {
    derivativeLatex: 'e^x',
    antiderivative: Math.exp,
    antiderivativeLatex: 'e^x',
  }),
  entry(
    'logaritmo',
    '\\log x',
    Math.log,
    (x) => 1 / x,
    (x) => -1 / (x * x),
    [0.02, 6],
    {
      derivativeLatex: '\\tfrac{1}{x}',
      antiderivative: (x) => x * Math.log(x) - x,
      antiderivativeLatex: 'x\\log x - x',
    },
  ),
  entry(
    'raiz',
    '\\sqrt{x}',
    Math.sqrt,
    (x) => 0.5 / Math.sqrt(x),
    (x) => -0.25 * x ** -1.5,
    [0, 6],
    {
      derivativeLatex: '\\tfrac{1}{2\\sqrt{x}}',
      antiderivative: (x) => (2 / 3) * x ** 1.5,
      antiderivativeLatex: '\\tfrac{2}{3}x^{3/2}',
    },
  ),
  entry(
    'reciproca',
    '\\tfrac{1}{x}',
    (x) => 1 / x,
    (x) => -1 / (x * x),
    (x) => 2 / x ** 3,
    [-4, 4],
    {
      derivativeLatex: '-\\tfrac{1}{x^2}',
      antiderivative: (x) => Math.log(Math.abs(x)),
      antiderivativeLatex: '\\log |x|',
    },
  ),
  entry(
    'inverso-cuadrado',
    '\\tfrac{1}{x^2}',
    (x) => 1 / (x * x),
    (x) => -2 / x ** 3,
    (x) => 6 / x ** 4,
    [0.05, 8],
    {
      derivativeLatex: '-\\tfrac{2}{x^3}',
      antiderivative: (x) => -1 / x,
      antiderivativeLatex: '-\\tfrac{1}{x}',
    },
  ),
  entry(
    'inverso-raiz',
    '\\tfrac{1}{\\sqrt{x}}',
    (x) => 1 / Math.sqrt(x),
    (x) => -0.5 * x ** -1.5,
    (x) => 0.75 * x ** -2.5,
    [0.01, 4],
    {
      antiderivative: (x) => 2 * Math.sqrt(x),
      antiderivativeLatex: '2\\sqrt{x}',
    },
  ),
  entry(
    'valor-absoluto',
    '|x|',
    Math.abs,
    (x) => Math.sign(x),
    () => 0,
    [-3, 3],
    {
      derivativeLatex: '\\operatorname{signo}(x)',
      antiderivative: (x) => (x * Math.abs(x)) / 2,
      antiderivativeLatex: '\\tfrac{x|x|}{2}',
    },
  ),
  entry(
    'raiz-cubica',
    '\\sqrt[3]{x}',
    Math.cbrt,
    (x) => 1 / (3 * Math.cbrt(x) ** 2),
    (x) => -2 / (9 * Math.cbrt(x) ** 5),
    [-3, 3],
    {
      derivativeLatex: '\\tfrac{1}{3\\sqrt[3]{x^2}}',
    },
  ),
  entry(
    'gauss',
    'e^{-x^2}',
    (x) => Math.exp(-x * x),
    (x) => -2 * x * Math.exp(-x * x),
    (x) => (4 * x * x - 2) * Math.exp(-x * x),
    [-3, 3],
    {
      derivativeLatex: '-2x\\,e^{-x^2}',
      antiderivative: (x) => (SQRT_PI / 2) * erf(x),
      antiderivativeLatex: '\\tfrac{\\sqrt{\\pi}}{2}\\operatorname{erf}(x)',
    },
  ),
  entry(
    'x-exp',
    'x\\,e^{-x}',
    (x) => x * Math.exp(-x),
    (x) => (1 - x) * Math.exp(-x),
    (x) => (x - 2) * Math.exp(-x),
    [-0.5, 8],
    {
      derivativeLatex: '(1 - x)\\,e^{-x}',
      antiderivative: (x) => -(x + 1) * Math.exp(-x),
      antiderivativeLatex: '-(x + 1)\\,e^{-x}',
    },
  ),
  entry(
    'sigmoide',
    '\\sigma(x) = \\tfrac{1}{1 + e^{-x}}',
    sigmoid,
    (x) => sigmoid(x) * (1 - sigmoid(x)),
    (x) => sigmoid(x) * (1 - sigmoid(x)) * (1 - 2 * sigmoid(x)),
    [-7, 7],
    {
      derivativeLatex: '\\sigma(x)\\,(1 - \\sigma(x))',
      antiderivative: softplus,
      antiderivativeLatex: '\\log(1 + e^{x})',
    },
  ),
  entry(
    'softplus',
    '\\log(1 + e^{x})',
    softplus,
    sigmoid,
    (x) => sigmoid(x) * (1 - sigmoid(x)),
    [-6, 6],
    {
      derivativeLatex: '\\sigma(x) = \\tfrac{1}{1 + e^{-x}}',
    },
  ),
  entry(
    'escalon',
    'H(x)',
    (x) => (x >= 0 ? 1 : 0),
    () => 0,
    () => 0,
    [-3, 3],
    {
      derivativeLatex: '0 \\ (x \\neq 0)',
      antiderivative: (x) => Math.max(0, x),
      antiderivativeLatex: '\\max(0, x)',
    },
  ),
  entry(
    'seno-sobre-x',
    '\\tfrac{\\operatorname{sen} x}{x}',
    (x) => (x === 0 ? 1 : Math.sin(x) / x),
    (x) => (x === 0 ? 0 : (x * Math.cos(x) - Math.sin(x)) / (x * x)),
    (x) => (x === 0 ? -1 / 3 : ((2 - x * x) * Math.sin(x) - 2 * x * Math.cos(x)) / x ** 3),
    [-12, 12],
  ),
  entry(
    'seno-cuadrado',
    '\\operatorname{sen}(x^2)',
    (x) => Math.sin(x * x),
    (x) => 2 * x * Math.cos(x * x),
    (x) => 2 * Math.cos(x * x) - 4 * x * x * Math.sin(x * x),
    [-3, 3],
    {
      derivativeLatex: '2x\\cos(x^2)',
    },
  ),
  entry(
    'gamma',
    '\\Gamma(x)',
    gammaFunction,
    (x) => numericDerivative(gammaFunction, x),
    (x) => numericSecond(gammaFunction, x),
    [0.05, 5],
  ),
];

function numericDerivative(f: RealFunction, x: number): number {
  const h = 1e-5 * Math.max(1, Math.abs(x));
  return (f(x + h) - f(x - h)) / (2 * h);
}

function numericSecond(f: RealFunction, x: number): number {
  const h = 1e-4 * Math.max(1, Math.abs(x));
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}

export const CALC_FUNCTIONS: Readonly<Record<string, CalcFunction>> = Object.fromEntries(
  LIST.map((item) => [item.id, item]),
);

export const CALC_FUNCTION_IDS = LIST.map((item) => item.id) as [string, ...string[]];

/**
 * Samples a function into polylines, breaking where it is undefined or where
 * two neighbors differ by more than `jump`, so poles and jumps are not joined
 * by vertical segments.
 */
export function sampleSegments(
  f: RealFunction,
  a: number,
  b: number,
  points: number,
  jump: number,
): { x: number; y: number }[][] {
  const segments: { x: number; y: number }[][] = [];
  let current: { x: number; y: number }[] = [];
  let previous: number | null = null;
  for (let i = 0; i <= points; i += 1) {
    const x = a + ((b - a) * i) / points;
    const y = f(x);
    const finite = Number.isFinite(y);
    if (!finite || (previous !== null && Math.abs(y - previous) > jump)) {
      if (current.length > 1) segments.push(current);
      current = [];
    }
    if (finite) current.push({ x, y });
    previous = finite ? y : null;
  }
  if (current.length > 1) segments.push(current);
  return segments;
}
