import {
  logChoose,
  logFactorial,
  regularizedGammaQ,
  standardNormalCdf,
} from '../distributions/special.ts';

/**
 * Cramér's theorem: for i.i.d. X_i with a finite moment generating function,
 * P(mean_n >= a) decays like exp(-n I(a)) for a above the mean, where I is
 * the Legendre transform of the cumulant generating function.
 */
export const LD_POPULATION_IDS = ['bernoulli', 'normal', 'exponencial', 'poisson'] as const;
export type LdPopulationId = (typeof LD_POPULATION_IDS)[number];

export interface LdPopulation {
  label: string;
  mean: number;
  sd: number;
  /** Cumulant generating function log E[e^{theta X}]. */
  cgf: (theta: number) => number;
  /** Rate function I(x). */
  rate: (x: number) => number;
  /** Maximizer theta of theta x - cgf(theta), the slope of the tangent in the Legendre picture. */
  tilt: (x: number) => number;
  /** Natural logarithm of the exact P(mean_n >= a). */
  logTail: (n: number, a: number) => number;
  /** Values of a that make sense for the sliders. */
  range: [number, number];
  thetaRange: [number, number];
}

const BERNOULLI_P = 0.3;
const POISSON_RATE = 2;

/** log(e^a + e^b) without overflow. */
function logAdd(a: number, b: number): number {
  if (a === Number.NEGATIVE_INFINITY) return b;
  if (b === Number.NEGATIVE_INFINITY) return a;
  const m = Math.max(a, b);
  return m + Math.log(Math.exp(a - m) + Math.exp(b - m));
}

/** log P(Bin(n, p) >= k). */
export function logBinomialUpperTail(n: number, p: number, k: number): number {
  let total = Number.NEGATIVE_INFINITY;
  for (let j = Math.max(0, k); j <= n; j += 1) {
    total = logAdd(total, logChoose(n, j) + j * Math.log(p) + (n - j) * Math.log(1 - p));
  }
  return total;
}

/** log P(Poisson(lambda) >= k), summing terms until they are negligible. */
export function logPoissonUpperTail(lambda: number, k: number): number {
  const start = Math.max(0, k);
  let logTerm = start * Math.log(lambda) - lambda - logFactorial(start);
  let total = logTerm;
  for (let j = start + 1; j < start + 2000; j += 1) {
    logTerm += Math.log(lambda) - Math.log(j);
    total = logAdd(total, logTerm);
    if (j > lambda && logTerm < total - 40) break;
  }
  return total;
}

/**
 * log(1 - Phi(z)). For large z the complement underflows, so the asymptotic
 * Mills ratio expansion is used there.
 */
export function logNormalUpperTail(z: number): number {
  if (z < 8) return Math.log(1 - standardNormalCdf(z));
  const z2 = z * z;
  return -0.5 * z2 - Math.log(z * Math.sqrt(2 * Math.PI)) + Math.log(1 - 1 / z2 + 3 / (z2 * z2));
}

const xlogx = (x: number, y: number) => (x === 0 ? 0 : x * Math.log(x / y));

export const LD_POPULATIONS: Record<LdPopulationId, LdPopulation> = {
  bernoulli: {
    label: `Bernoulli con p = ${BERNOULLI_P}`,
    mean: BERNOULLI_P,
    sd: Math.sqrt(BERNOULLI_P * (1 - BERNOULLI_P)),
    cgf: (t) => Math.log(1 - BERNOULLI_P + BERNOULLI_P * Math.exp(t)),
    rate: (x) =>
      x < 0 || x > 1
        ? Number.POSITIVE_INFINITY
        : xlogx(x, BERNOULLI_P) + xlogx(1 - x, 1 - BERNOULLI_P),
    tilt: (x) => Math.log((x * (1 - BERNOULLI_P)) / ((1 - x) * BERNOULLI_P)),
    logTail: (n, a) => logBinomialUpperTail(n, BERNOULLI_P, Math.ceil(n * a - 1e-9)),
    range: [0.35, 0.9],
    thetaRange: [-3, 4],
  },
  normal: {
    label: 'Normal estándar',
    mean: 0,
    sd: 1,
    cgf: (t) => (t * t) / 2,
    rate: (x) => (x * x) / 2,
    tilt: (x) => x,
    logTail: (n, a) => logNormalUpperTail(a * Math.sqrt(n)),
    range: [0.1, 2],
    thetaRange: [-2.5, 2.5],
  },
  exponencial: {
    label: 'Exponencial con media 1',
    mean: 1,
    sd: 1,
    cgf: (t) => (t < 1 ? -Math.log(1 - t) : Number.POSITIVE_INFINITY),
    rate: (x) => (x > 0 ? x - 1 - Math.log(x) : Number.POSITIVE_INFINITY),
    tilt: (x) => 1 - 1 / x,
    // The sum of n Exp(1) variables is Gamma(n, 1).
    logTail: (n, a) => Math.log(regularizedGammaQ(n, n * a)),
    range: [1.1, 3],
    thetaRange: [-2, 0.9],
  },
  poisson: {
    label: `Poisson con media ${POISSON_RATE}`,
    mean: POISSON_RATE,
    sd: Math.sqrt(POISSON_RATE),
    cgf: (t) => POISSON_RATE * (Math.exp(t) - 1),
    rate: (x) => (x < 0 ? Number.POSITIVE_INFINITY : xlogx(x, POISSON_RATE) - x + POISSON_RATE),
    tilt: (x) => Math.log(x / POISSON_RATE),
    logTail: (n, a) => logPoissonUpperTail(n * POISSON_RATE, Math.ceil(n * a - 1e-9)),
    range: [2.2, 5],
    thetaRange: [-1.5, 1.2],
  },
};

/** log of the central limit approximation 1 - Phi((a - mu) sqrt(n) / sigma). */
export function logCltTail(population: LdPopulation, n: number, a: number): number {
  return logNormalUpperTail(((a - population.mean) * Math.sqrt(n)) / population.sd);
}
