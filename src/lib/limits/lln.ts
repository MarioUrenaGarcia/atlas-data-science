import type { Random } from '../random/index.ts';

/**
 * Populations for running means. Cauchy has no mean, and Pareto with index
 * 1.5 has a mean but infinite variance, so they show where the laws of large
 * numbers and the Chebyshev argument stop working.
 */
export const LLN_POPULATION_IDS = [
  'moneda',
  'dado',
  'exponencial',
  'uniforme',
  'pareto',
  'cauchy',
] as const;
export type LlnPopulationId = (typeof LLN_POPULATION_IDS)[number];

export interface LlnPopulation {
  label: string;
  /** Mean, NaN when it does not exist. */
  mean: number;
  /** Standard deviation, Infinity when the variance is infinite. */
  sd: number;
  sample: (random: Random) => number;
  /** Half height of the plotting window around the mean. */
  window: number;
}

const PARETO_INDEX = 1.5;
const PARETO_MIN = 1;

export const LLN_POPULATIONS: Record<LlnPopulationId, LlnPopulation> = {
  moneda: {
    label: 'Moneda: 1 si cae cara',
    mean: 0.5,
    sd: 0.5,
    sample: (random) => (random.bernoulli(0.5) ? 1 : 0),
    window: 0.5,
  },
  dado: {
    label: 'Dado equilibrado',
    mean: 3.5,
    sd: Math.sqrt(35 / 12),
    sample: (random) => random.int(1, 6),
    window: 2.5,
  },
  exponencial: {
    label: 'Exponencial con media 1',
    mean: 1,
    sd: 1,
    sample: (random) => random.exponential(1),
    window: 1,
  },
  uniforme: {
    label: 'Uniforme en [0, 1]',
    mean: 0.5,
    sd: Math.sqrt(1 / 12),
    sample: (random) => random.uniform(),
    window: 0.5,
  },
  pareto: {
    label: 'Pareto con índice 1.5: media 3, varianza infinita',
    mean: (PARETO_INDEX * PARETO_MIN) / (PARETO_INDEX - 1),
    sd: Number.POSITIVE_INFINITY,
    // Inverse transform: x_m / U^(1/alpha).
    sample: (random) => PARETO_MIN / (1 - random.uniform()) ** (1 / PARETO_INDEX),
    window: 3,
  },
  cauchy: {
    label: 'Cauchy estándar: sin media',
    mean: Number.NaN,
    sd: Number.NaN,
    sample: (random) => Math.tan(Math.PI * (random.uniform() - 0.5)),
    window: 6,
  },
};

/** Running means of `count` independent sequences of length `length`. */
export function runningMeans(
  population: LlnPopulation,
  count: number,
  length: number,
  random: Random,
): Float64Array[] {
  return Array.from({ length: count }, () => {
    const path = new Float64Array(length);
    let total = 0;
    for (let i = 0; i < length; i += 1) {
      total += population.sample(random);
      path[i] = total / (i + 1);
    }
    return path;
  });
}

/** Chebyshev bound sigma^2 / (n eps^2), capped at 1. */
export function chebyshevBound(sd: number, n: number, eps: number): number {
  return Math.min(1, (sd * sd) / (n * eps * eps));
}

/** Partial sums of a simple symmetric random walk, S_1..S_length. */
export function randomWalk(length: number, random: Random): Float64Array {
  const path = new Float64Array(length);
  let s = 0;
  for (let i = 0; i < length; i += 1) {
    s += random.bernoulli(0.5) ? 1 : -1;
    path[i] = s;
  }
  return path;
}
