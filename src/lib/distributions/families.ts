/**
 * Families of distributions and relations between them: exponential
 * families in natural form, conjugate updates, normal mixtures, compound
 * Poisson sums, the continuity correction and tail comparisons.
 */
import type { Random } from '../random/index.ts';
import { normal } from './continuous.ts';
import { binomial } from './discrete.ts';
import { logGamma } from './special.ts';

/** An exponential family p(x | eta) = h(x) exp(eta T(x) - A(eta)) with scalar natural parameter. */
export interface ExponentialFamily {
  id: 'bernoulli' | 'poisson' | 'normal' | 'exponencial';
  label: string;
  discrete: boolean;
  /** Natural parameter range shown on the slider. */
  etaRange: [number, number];
  /** Log partition function A(eta). */
  logPartition: (eta: number) => number;
  /** Mean of the sufficient statistic, A'(eta). */
  mean: (eta: number) => number;
  /** Variance of the sufficient statistic, A''(eta). */
  variance: (eta: number) => number;
  /** Density or mass in natural form. */
  density: (x: number, eta: number) => number;
  /** Usual parameter as a function of eta, with its name. */
  usual: (eta: number) => { name: string; value: number };
  /** Plotting window for x given eta. */
  window: (eta: number) => [number, number];
}

const logFactorial = (k: number) => logGamma(k + 1);

export const EXPONENTIAL_FAMILIES: Record<ExponentialFamily['id'], ExponentialFamily> = {
  bernoulli: {
    id: 'bernoulli',
    label: 'Bernoulli',
    discrete: true,
    etaRange: [-5, 5],
    logPartition: (eta) => Math.log1p(Math.exp(eta)),
    mean: (eta) => 1 / (1 + Math.exp(-eta)),
    variance: (eta) => {
      const p = 1 / (1 + Math.exp(-eta));
      return p * (1 - p);
    },
    density: (x, eta) => (x === 0 || x === 1 ? Math.exp(eta * x - Math.log1p(Math.exp(eta))) : 0),
    usual: (eta) => ({ name: 'p', value: 1 / (1 + Math.exp(-eta)) }),
    window: () => [-0.5, 1.5],
  },
  poisson: {
    id: 'poisson',
    label: 'Poisson',
    discrete: true,
    etaRange: [-1.5, 3],
    logPartition: (eta) => Math.exp(eta),
    mean: (eta) => Math.exp(eta),
    variance: (eta) => Math.exp(eta),
    density: (x, eta) =>
      Number.isInteger(x) && x >= 0 ? Math.exp(eta * x - Math.exp(eta) - logFactorial(x)) : 0,
    usual: (eta) => ({ name: 'λ', value: Math.exp(eta) }),
    window: (eta) => [-0.5, Math.ceil(Math.exp(eta) + 4 * Math.sqrt(Math.exp(eta)) + 2) + 0.5],
  },
  normal: {
    id: 'normal',
    label: 'Normal con varianza 1',
    discrete: false,
    etaRange: [-3, 3],
    logPartition: (eta) => (eta * eta) / 2,
    mean: (eta) => eta,
    variance: () => 1,
    density: (x, eta) => Math.exp(eta * x - (eta * eta) / 2 - (x * x) / 2) / Math.sqrt(2 * Math.PI),
    usual: (eta) => ({ name: 'μ', value: eta }),
    window: () => [-6, 6],
  },
  exponencial: {
    id: 'exponencial',
    label: 'Exponencial',
    discrete: false,
    etaRange: [-4, -0.25],
    logPartition: (eta) => -Math.log(-eta),
    mean: (eta) => -1 / eta,
    variance: (eta) => 1 / (eta * eta),
    density: (x, eta) => (x < 0 ? 0 : Math.exp(eta * x + Math.log(-eta))),
    usual: (eta) => ({ name: 'λ', value: -eta }),
    window: (eta) => [0, Math.max(3, 6 / -eta)],
  },
};

/** Log likelihood of Bernoulli trials, which depends on the data only through the number of successes. */
export function bernoulliLogLikelihood(trials: readonly number[], p: number): number {
  const k = trials.reduce((sum, value) => sum + value, 0);
  return k * Math.log(p) + (trials.length - k) * Math.log(1 - p);
}

export type ConjugateModel = 'beta-bernoulli' | 'gamma-poisson' | 'normal-normal';

export interface ConjugateState {
  /** Hyperparameters: (a, b) for beta and gamma (shape and rate), (mean, variance) for the normal. */
  a: number;
  b: number;
}

/**
 * Posterior hyperparameters after the observations. Beta-Bernoulli adds
 * successes and failures; gamma-Poisson adds the total count to the shape
 * and the number of observations to the rate; normal-normal with known
 * data variance combines precisions.
 */
export function conjugateUpdate(
  model: ConjugateModel,
  prior: ConjugateState,
  data: readonly number[],
  dataVariance = 1,
): ConjugateState {
  const n = data.length;
  const total = data.reduce((sum, value) => sum + value, 0);
  switch (model) {
    case 'beta-bernoulli':
      return { a: prior.a + total, b: prior.b + n - total };
    case 'gamma-poisson':
      return { a: prior.a + total, b: prior.b + n };
    case 'normal-normal': {
      const precision = 1 / prior.b + n / dataVariance;
      const mean = (prior.a / prior.b + total / dataVariance) / precision;
      return { a: mean, b: 1 / precision };
    }
  }
}

/** Mean of the distribution described by the hyperparameters. */
export function conjugateMean(model: ConjugateModel, state: ConjugateState): number {
  switch (model) {
    case 'beta-bernoulli':
      return state.a / (state.a + state.b);
    case 'gamma-poisson':
      return state.a / state.b;
    case 'normal-normal':
      return state.a;
  }
}

export interface MixtureComponent {
  weight: number;
  mean: number;
  sd: number;
}

/** Density of a mixture of normals; weights are normalized to add up to one. */
export function mixtureDensity(components: readonly MixtureComponent[], x: number): number {
  const total = components.reduce((sum, c) => sum + c.weight, 0);
  return components.reduce((sum, c) => sum + (c.weight / total) * normal(c.mean, c.sd).pdf(x), 0);
}

/** Mean and variance of a normal mixture by the laws of total expectation and variance. */
export function mixtureMoments(components: readonly MixtureComponent[]): {
  mean: number;
  variance: number;
  within: number;
  between: number;
} {
  const total = components.reduce((sum, c) => sum + c.weight, 0);
  const mean = components.reduce((sum, c) => sum + (c.weight / total) * c.mean, 0);
  const within = components.reduce((sum, c) => sum + (c.weight / total) * c.sd * c.sd, 0);
  const between = components.reduce((sum, c) => sum + (c.weight / total) * (c.mean - mean) ** 2, 0);
  return { mean, variance: within + between, within, between };
}

/** One draw of a normal mixture with the index of the component that produced it. */
export function sampleMixture(
  random: Random,
  components: readonly MixtureComponent[],
): { value: number; component: number } {
  const total = components.reduce((sum, c) => sum + c.weight, 0);
  let u = random.uniform() * total;
  let index = components.length - 1;
  for (let i = 0; i < components.length; i += 1) {
    u -= components[i]?.weight ?? 0;
    if (u <= 0) {
      index = i;
      break;
    }
  }
  const chosen = components[index] ?? { mean: 0, sd: 1 };
  return { value: random.normal(chosen.mean, chosen.sd), component: index };
}

/** Compound Poisson sum S = X_1 + ... + X_N with N ~ Poisson(lambda) and X_i ~ Gamma(shape, rate). */
export function sampleCompoundPoisson(
  random: Random,
  lambda: number,
  shape: number,
  rate: number,
): { total: number; count: number } {
  const count = random.poisson(lambda);
  let total = 0;
  for (let i = 0; i < count; i += 1) total += random.gamma(shape, rate);
  return { total, count };
}

/** Mean, variance and probability of zero of a compound Poisson sum with gamma summands. */
export function compoundPoissonMoments(
  lambda: number,
  shape: number,
  rate: number,
): { mean: number; variance: number; zero: number } {
  const m1 = shape / rate;
  const m2 = (shape * (shape + 1)) / (rate * rate);
  return { mean: lambda * m1, variance: lambda * m2, zero: Math.exp(-lambda) };
}

export interface ContinuityComparison {
  exact: number;
  plain: number;
  corrected: number;
}

/** P(a <= X <= b) for X ~ Bin(n, p), exactly and by the normal approximation with and without correction. */
export function continuityCorrection(
  n: number,
  p: number,
  a: number,
  b: number,
): ContinuityComparison {
  const exact = binomial(n, p).cdf(b) - binomial(n, p).cdf(a - 1);
  const approx = normal(n * p, Math.sqrt(n * p * (1 - p)));
  return {
    exact,
    plain: approx.cdf(b) - approx.cdf(a),
    corrected: approx.cdf(b + 0.5) - approx.cdf(a - 0.5),
  };
}

/** Sub-Gaussian bound 2 exp(-t^2 / (2 sigma^2)) for P(|X - mu| >= t). */
export function subGaussianBound(t: number, sigma: number): number {
  return Math.min(1, 2 * Math.exp(-(t * t) / (2 * sigma * sigma)));
}
