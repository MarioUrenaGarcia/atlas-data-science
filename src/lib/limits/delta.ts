import type { Random } from '../random/index.ts';

/**
 * Smooth transformations used with the delta method. Each carries its first
 * and second derivatives: the first gives the asymptotic standard error and
 * the second the limit when the first vanishes.
 */
export const TRANSFORM_IDS = [
  'logaritmo',
  'cuadrado',
  'inverso',
  'raiz',
  'exponencial',
  'varianza-bernoulli',
  'logit',
] as const;
export type TransformId = (typeof TRANSFORM_IDS)[number];

export interface Transform {
  label: string;
  /** g(x) in LaTeX with the argument written as #. */
  latex: string;
  g: (x: number) => number;
  d1: (x: number) => number;
  d2: (x: number) => number;
  /** Open interval where g is defined. */
  domain: [number, number];
}

export const TRANSFORMS: Record<TransformId, Transform> = {
  logaritmo: {
    label: 'Logaritmo',
    latex: '\\log #',
    g: Math.log,
    d1: (x) => 1 / x,
    d2: (x) => -1 / (x * x),
    domain: [0, Number.POSITIVE_INFINITY],
  },
  cuadrado: {
    label: 'Cuadrado',
    latex: '#^2',
    g: (x) => x * x,
    d1: (x) => 2 * x,
    d2: () => 2,
    domain: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
  },
  inverso: {
    label: 'Recíproco',
    latex: '1/#',
    g: (x) => 1 / x,
    d1: (x) => -1 / (x * x),
    d2: (x) => 2 / (x * x * x),
    domain: [0, Number.POSITIVE_INFINITY],
  },
  raiz: {
    label: 'Raíz cuadrada',
    latex: '\\sqrt{#}',
    g: Math.sqrt,
    d1: (x) => 0.5 / Math.sqrt(x),
    d2: (x) => -0.25 / x ** 1.5,
    domain: [0, Number.POSITIVE_INFINITY],
  },
  exponencial: {
    label: 'Exponencial',
    latex: 'e^{#}',
    g: Math.exp,
    d1: Math.exp,
    d2: Math.exp,
    domain: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
  },
  'varianza-bernoulli': {
    label: 'Varianza de una Bernoulli, x(1 - x)',
    latex: '#(1 - #)',
    g: (x) => x * (1 - x),
    d1: (x) => 1 - 2 * x,
    d2: () => -2,
    domain: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
  },
  logit: {
    label: 'Logit, log(x/(1 - x))',
    latex: '\\log\\frac{#}{1 - #}',
    g: (x) => Math.log(x / (1 - x)),
    d1: (x) => 1 / (x * (1 - x)),
    d2: (x) => (2 * x - 1) / (x * x * (1 - x) * (1 - x)),
    domain: [0, 1],
  },
};

export function transformLatex(transform: Transform, argument: string): string {
  return transform.latex.replaceAll('#', argument);
}

/**
 * Asymptotic law of g(mean_n) from the delta method: normal with mean g(mu)
 * and standard deviation |g'(mu)| sigma / sqrt(n). When g'(mu) = 0 the
 * second order term dominates and n (g(mean_n) - g(mu)) tends to
 * g''(mu) sigma^2 / 2 times a chi-square with one degree of freedom.
 */
export function deltaApproximation(
  transform: Transform,
  mu: number,
  sigma: number,
  n: number,
): { center: number; sd: number; firstOrder: boolean } {
  const slope = transform.d1(mu);
  return {
    center: transform.g(mu),
    sd: (Math.abs(slope) * sigma) / Math.sqrt(n),
    firstOrder: Math.abs(slope) > 1e-9,
  };
}

/** Functions of two means for the multivariate delta method. */
export const BIVARIATE_TRANSFORM_IDS = [
  'cociente',
  'producto',
  'distancia',
  'diferencia-log',
] as const;
export type BivariateTransformId = (typeof BIVARIATE_TRANSFORM_IDS)[number];

export interface BivariateTransform {
  label: string;
  latex: string;
  g: (x: number, y: number) => number;
  gradient: (x: number, y: number) => [number, number];
}

export const BIVARIATE_TRANSFORMS: Record<BivariateTransformId, BivariateTransform> = {
  cociente: {
    label: 'Cociente x / y',
    latex: 'g(x, y) = x / y',
    g: (x, y) => x / y,
    gradient: (x, y) => [1 / y, -x / (y * y)],
  },
  producto: {
    label: 'Producto x y',
    latex: 'g(x, y) = x\\,y',
    g: (x, y) => x * y,
    gradient: (x, y) => [y, x],
  },
  distancia: {
    label: 'Distancia al origen',
    latex: 'g(x, y) = \\sqrt{x^2 + y^2}',
    g: (x, y) => Math.hypot(x, y),
    gradient: (x, y) => {
      const r = Math.hypot(x, y);
      return [x / r, y / r];
    },
  },
  'diferencia-log': {
    label: 'Diferencia de logaritmos log x - log y',
    latex: 'g(x, y) = \\log x - \\log y',
    g: (x, y) => Math.log(x) - Math.log(y),
    gradient: (x, y) => [1 / x, -1 / y],
  },
};

/** Variance of a linear combination a^T X for a 2 x 2 covariance matrix. */
export function quadraticForm(
  a: readonly [number, number],
  covariance: readonly [readonly [number, number], readonly [number, number]],
): number {
  const [a1, a2] = a;
  const [[s11, s12], [s21, s22]] = covariance;
  return a1 * a1 * s11 + a1 * a2 * (s12 + s21) + a2 * a2 * s22;
}

/** Draw from a bivariate normal with the given means, standard deviations and correlation. */
export function sampleBivariateNormal(
  random: Random,
  mean: readonly [number, number],
  sd: readonly [number, number],
  rho: number,
): [number, number] {
  const z1 = random.normal();
  const z2 = random.normal();
  return [mean[0] + sd[0] * z1, mean[1] + sd[1] * (rho * z1 + Math.sqrt(1 - rho * rho) * z2)];
}
