import { beta, exponential, lognormal, normal, uniform } from '../distributions/index.ts';
import { standardNormalCdf } from '../distributions/special.ts';
import type { ContinuousDistribution } from '../distributions/types.ts';
import type { Random } from '../random/index.ts';

/**
 * Populations for the central limit theorem. Each one is represented by
 * probability masses on an evenly spaced grid: exactly for lattice
 * distributions and by a midpoint discretization for continuous ones. Sums of
 * independent copies are then exact convolutions of the masses.
 */
export const CLT_POPULATION_IDS = [
  'uniforme',
  'exponencial',
  'bernoulli',
  'dado',
  'bimodal',
  'arcoseno',
  'lognormal',
  'asimetrica-discreta',
] as const;
export type CltPopulationId = (typeof CLT_POPULATION_IDS)[number];

/** Masses p_i at the points start + i * step. */
export interface LatticeMasses {
  start: number;
  step: number;
  masses: Float64Array;
}

export interface CltPopulation {
  label: string;
  /** Whether the population lives on a lattice (sums are drawn as bars). */
  lattice: boolean;
  masses: LatticeMasses;
  sample: (random: Random) => number;
}

const CONTINUOUS_BINS = 120;
const TAIL = 1e-4;

/** Midpoint discretization of a continuous density on [lo, hi]. */
export function discretize(
  distribution: ContinuousDistribution,
  lo: number,
  hi: number,
  bins = CONTINUOUS_BINS,
): LatticeMasses {
  const step = (hi - lo) / bins;
  const masses = new Float64Array(bins);
  let total = 0;
  for (let i = 0; i < bins; i += 1) {
    const mass = Math.max(
      0,
      distribution.cdf(lo + (i + 1) * step) - distribution.cdf(lo + i * step),
    );
    masses[i] = mass;
    total += mass;
  }
  for (let i = 0; i < bins; i += 1) masses[i] = (masses[i] ?? 0) / total;
  return { start: lo + step / 2, step, masses };
}

function latticeOf(values: readonly number[], probabilities: readonly number[]): LatticeMasses {
  const start = values[0] ?? 0;
  const step = values.length > 1 ? (values[1] ?? 1) - start : 1;
  return { start, step, masses: Float64Array.from(probabilities) };
}

function continuous(label: string, distribution: ContinuousDistribution, lo?: number, hi?: number) {
  const left = lo ?? distribution.quantile(TAIL);
  const right = hi ?? distribution.quantile(1 - TAIL);
  return {
    label,
    lattice: false,
    masses: discretize(distribution, left, right),
    sample: (random: Random) => distribution.sample(random),
  };
}

const BERNOULLI_P = 0.2;
const MIXTURE_CENTER = 2;
const MIXTURE_SD = 0.5;
const SKEWED_VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const SKEWED_PROBABILITIES = [0.55, 0.3, 0, 0, 0, 0, 0, 0, 0, 0, 0.15];

function mixture(): ContinuousDistribution {
  const left = normal(-MIXTURE_CENTER, MIXTURE_SD);
  const right = normal(MIXTURE_CENTER, MIXTURE_SD);
  return {
    kind: 'continuous',
    name: 'Mezcla bimodal',
    mean: 0,
    variance: MIXTURE_CENTER ** 2 + MIXTURE_SD ** 2,
    support: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
    pdf: (x) => 0.5 * (left.pdf(x) + right.pdf(x)),
    cdf: (x) => 0.5 * (left.cdf(x) + right.cdf(x)),
    quantile: (p) => (p < 0.5 ? left.quantile(2 * p) : right.quantile(2 * p - 1)),
    sample: (random) => (random.bernoulli(0.5) ? right.sample(random) : left.sample(random)),
  };
}

export const CLT_POPULATIONS: Record<CltPopulationId, CltPopulation> = {
  uniforme: continuous('Uniforme en [0, 1]', uniform(0, 1), 0, 1),
  exponencial: continuous('Exponencial con media 1 (asimétrica)', exponential(1), 0, 9),
  bernoulli: {
    label: `Bernoulli con p = ${BERNOULLI_P}`,
    lattice: true,
    masses: latticeOf([0, 1], [1 - BERNOULLI_P, BERNOULLI_P]),
    sample: (random) => (random.bernoulli(BERNOULLI_P) ? 1 : 0),
  },
  dado: {
    label: 'Dado equilibrado',
    lattice: true,
    masses: latticeOf(
      [1, 2, 3, 4, 5, 6],
      [1, 1, 1, 1, 1, 1].map((w) => w / 6),
    ),
    sample: (random) => random.int(1, 6),
  },
  bimodal: continuous('Mezcla con dos modas', mixture(), -4, 4),
  arcoseno: continuous('Beta(1/2, 1/2): masa en los extremos', beta(0.5, 0.5), 0, 1),
  lognormal: continuous('Lognormal muy asimétrica', lognormal(0, 0.7), 0, 14),
  'asimetrica-discreta': {
    label: 'Discreta con un valor raro y grande',
    lattice: true,
    masses: latticeOf(SKEWED_VALUES, SKEWED_PROBABILITIES),
    sample: (random) => {
      const u = random.uniform();
      if (u < 0.55) return 0;
      return u < 0.85 ? 1 : 10;
    },
  },
};

export interface Moments {
  mean: number;
  variance: number;
  /** E|X - mu|^3, the quantity in the Berry-Esseen bound. */
  absoluteThird: number;
  /** E[(X - mu)^3] / sigma^3. */
  skewness: number;
}

export function latticeMoments({ start, step, masses }: LatticeMasses): Moments {
  let mean = 0;
  masses.forEach((p, i) => {
    mean += p * (start + i * step);
  });
  let variance = 0;
  let absoluteThird = 0;
  let third = 0;
  masses.forEach((p, i) => {
    const d = start + i * step - mean;
    variance += p * d * d;
    absoluteThird += p * Math.abs(d) ** 3;
    third += p * d ** 3;
  });
  return { mean, variance, absoluteThird, skewness: third / variance ** 1.5 };
}

/** Distribution of the sum of two independent lattice variables with the same step. */
export function convolve(a: LatticeMasses, b: LatticeMasses): LatticeMasses {
  const masses = new Float64Array(a.masses.length + b.masses.length - 1);
  for (let i = 0; i < a.masses.length; i += 1) {
    const pa = a.masses[i] ?? 0;
    if (pa === 0) continue;
    for (let j = 0; j < b.masses.length; j += 1) {
      masses[i + j] = (masses[i + j] ?? 0) + pa * (b.masses[j] ?? 0);
    }
  }
  return { start: a.start + b.start, step: a.step, masses };
}

/** Masses of S_1, ..., S_maxN, built incrementally so each n costs one convolution. */
export function sumDistributions(population: LatticeMasses, maxN: number): LatticeMasses[] {
  const result: LatticeMasses[] = [population];
  for (let n = 2; n <= maxN; n += 1) {
    result.push(convolve(result[n - 2] ?? population, population));
  }
  return result;
}

export interface StandardizedPoint {
  /** Standardized value z = (s - n mu) / (sigma sqrt n). */
  z: number;
  mass: number;
}

/** Points of the standardized sum Z_n = (S_n - n mu) / (sigma sqrt n). */
export function standardize(sum: LatticeMasses, n: number, moments: Moments): StandardizedPoint[] {
  const scale = Math.sqrt(n * moments.variance);
  const points: StandardizedPoint[] = [];
  sum.masses.forEach((mass, i) => {
    points.push({ z: (sum.start + i * sum.step - n * moments.mean) / scale, mass });
  });
  return points;
}

/**
 * Kolmogorov distance sup_x |F_n(x) - Phi(x)| between the standardized sum
 * and the standard normal. At each atom both one-sided limits of F_n are
 * compared, which is where the supremum is attained for a step function.
 * For a discretized continuous population each mass stands for a bin
 * centered at the point, so F_n there is the cumulative mass up to the middle
 * of the bin.
 */
export function kolmogorovToNormal(
  points: readonly StandardizedPoint[],
  lattice: boolean,
): { distance: number; at: number } {
  let cumulative = 0;
  let distance = 0;
  let at = 0;
  for (const { z, mass } of points) {
    const phi = standardNormalCdf(z);
    let d: number;
    if (lattice) {
      const before = Math.abs(cumulative - phi);
      cumulative += mass;
      d = Math.max(before, Math.abs(cumulative - phi));
    } else {
      d = Math.abs(cumulative + mass / 2 - phi);
      cumulative += mass;
    }
    if (d > distance) {
      distance = d;
      at = z;
    }
  }
  return { distance, at };
}

/** Best known constant for the i.i.d. Berry-Esseen inequality (Shevtsova, 2011). */
export const BERRY_ESSEEN_CONSTANT = 0.4748;

export function berryEsseenBound(moments: Moments, n: number): number {
  return (BERRY_ESSEEN_CONSTANT * moments.absoluteThird) / (moments.variance ** 1.5 * Math.sqrt(n));
}
