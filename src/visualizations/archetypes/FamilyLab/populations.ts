import {
  cauchy,
  exponential,
  gumbel,
  laplace,
  logistic,
  lognormal,
  normal,
  pareto,
  studentT,
  uniform,
  type ContinuousDistribution,
} from '../../../lib/distributions/index.ts';
import type { BASE_IDS, EMPIRICAL_IDS, SUBGAUSSIAN_IDS, TAIL_IDS } from './schema.ts';

export interface Population {
  label: string;
  distribution: ContinuousDistribution;
  /** Distributions symmetric about zero, whose upper tail is read as F(-t) to avoid cancellation in 1 - F(t). */
  symmetric?: boolean;
}

/** P(X > t), computed without the cancellation of 1 - F(t) when the distribution is symmetric. */
export function survival(population: Population, t: number): number {
  const d = population.distribution;
  return population.symmetric ? d.cdf(-t) : 1 - d.cdf(t);
}

/** Standard members of location and scale families, transformed as mu + sigma Z. */
export const BASES: Record<(typeof BASE_IDS)[number], Population> = {
  normal: { label: 'Normal estándar', distribution: normal(0, 1) },
  logistica: { label: 'Logística estándar', distribution: logistic(0, 1) },
  cauchy: { label: 'Cauchy estándar', distribution: cauchy(0, 1) },
  laplace: { label: 'Laplace estándar', distribution: laplace(0, 1) },
  gumbel: { label: 'Gumbel estándar', distribution: gumbel(0, 1) },
};

/** Distributions with tails of different weight, compared through P(X > t). */
export const TAILS: Record<(typeof TAIL_IDS)[number], Population> = {
  normal: { label: 'Normal estándar', distribution: normal(0, 1), symmetric: true },
  exponencial: { label: 'Exponencial de tasa 1', distribution: exponential(1) },
  lognormal: { label: 'Lognormal (0, 1)', distribution: lognormal(0, 1) },
  pareto: { label: 'Pareto de índice 1.5', distribution: pareto(1, 1.5) },
  cauchy: { label: 'Cauchy estándar', distribution: cauchy(0, 1), symmetric: true },
  t3: { label: 't con 3 grados', distribution: studentT(3), symmetric: true },
};

export const EMPIRICAL: Record<(typeof EMPIRICAL_IDS)[number], Population> = {
  normal: { label: 'Normal estándar', distribution: normal(0, 1) },
  exponencial: { label: 'Exponencial de tasa 1', distribution: exponential(1) },
  uniforme: { label: 'Uniforme en [0, 1]', distribution: uniform(0, 1) },
  lognormal: { label: 'Lognormal (0, 0.5)', distribution: lognormal(0, 0.5) },
};

export interface CenteredTail {
  label: string;
  /** P(|X - E[X]| >= t). */
  tail: (t: number) => number;
  /** Smallest variance proxy that makes the sub-Gaussian bound hold, when one exists. */
  proxy: number | null;
  variance: number;
}

const LAPLACE_SCALE = Math.SQRT1_2;

/** Centered distributions with variance close to one, some sub-Gaussian and some not. */
export const CENTERED: Record<(typeof SUBGAUSSIAN_IDS)[number], CenteredTail> = {
  normal: {
    label: 'Normal estándar',
    tail: (t) => 2 * normal(0, 1).cdf(-t),
    proxy: 1,
    variance: 1,
  },
  rademacher: {
    label: 'Signo de Rademacher',
    tail: (t) => (t <= 1 ? 1 : 0),
    proxy: 1,
    variance: 1,
  },
  uniforme: {
    label: 'Uniforme en [-1, 1]',
    tail: (t) => Math.max(0, 1 - t),
    proxy: 1 / 3,
    variance: 1 / 3,
  },
  laplace: {
    label: 'Laplace con varianza 1',
    tail: (t) => Math.exp(-t / LAPLACE_SCALE),
    proxy: null,
    variance: 1,
  },
  t3: {
    label: 't con 3 grados',
    tail: (t) => 2 * studentT(3).cdf(-t),
    proxy: null,
    variance: 3,
  },
};
