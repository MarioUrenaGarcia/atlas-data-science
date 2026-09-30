import type { Random } from '../random/index.ts';
import { discreteQuantile } from './discrete.ts';
import { logBeta, logChoose, logFactorial } from './special.ts';
import type { DiscreteDistribution } from './types.ts';

function check(condition: boolean, message: string): void {
  if (!condition) throw new RangeError(message);
}

function poissonLogPmf(k: number, lambda: number): number {
  return k * Math.log(lambda) - lambda - logFactorial(k);
}

/** Cumulative sums of a finite mass function over consecutive integers starting at `first`. */
function cumulativeTable(masses: readonly number[]): number[] {
  const table: number[] = [];
  let total = 0;
  for (const mass of masses) {
    total += mass;
    table.push(total);
  }
  return table;
}

/** Index of the first cumulative value at or above u, by binary search. */
function searchCumulative(table: readonly number[], u: number): number {
  let lo = 0;
  let hi = table.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if ((table[mid] ?? 1) >= u) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

/**
 * Binomial count whose success probability is itself Beta(a, b). Mixing over
 * p inflates the variance by the factor (a + b + n) / (a + b + 1).
 */
export function betaBinomial(n: number, a: number, b: number): DiscreteDistribution {
  check(Number.isInteger(n) && n >= 0, 'n must be a nonnegative integer');
  check(a > 0 && b > 0, 'shape parameters must be positive');
  const masses = Array.from({ length: n + 1 }, (_, k) =>
    Math.exp(logChoose(n, k) + logBeta(k + a, n - k + b) - logBeta(a, b)),
  );
  const table = cumulativeTable(masses);
  const pmf = (k: number) => (Number.isInteger(k) && k >= 0 && k <= n ? (masses[k] ?? 0) : 0);
  const cdf = (x: number) => {
    const k = Math.floor(x);
    return k < 0 ? 0 : k >= n ? 1 : Math.min(1, table[k] ?? 1);
  };
  const s = a + b;
  return {
    kind: 'discrete',
    name: 'Beta-binomial',
    mean: (n * a) / s,
    variance: (n * a * b * (s + n)) / (s * s * (s + 1)),
    support: [0, n],
    pmf,
    cdf,
    quantile: (q) => discreteQuantile(cdf, q, 0, n, (n * a) / s),
    sample: (random) => random.binomial(n, random.beta(a, b)),
  };
}

/** Generalized harmonic number H(N, s) = sum of k^(-s) for k = 1..N. */
export function harmonicNumber(count: number, exponent: number): number {
  let total = 0;
  for (let k = count; k >= 1; k -= 1) total += k ** -exponent;
  return total;
}

/** Zipf law over the ranks 1..N: P(k) is proportional to k^(-s). */
export function zipf(count: number, exponent: number): DiscreteDistribution {
  check(Number.isInteger(count) && count >= 1, 'N must be a positive integer');
  check(exponent >= 0, 's must be nonnegative');
  const normalizer = harmonicNumber(count, exponent);
  const masses = Array.from({ length: count }, (_, i) => (i + 1) ** -exponent / normalizer);
  const table = cumulativeTable(masses);
  const mean = harmonicNumber(count, exponent - 1) / normalizer;
  const cdf = (x: number) => {
    const k = Math.floor(x);
    return k < 1 ? 0 : k >= count ? 1 : Math.min(1, table[k - 1] ?? 1);
  };
  return {
    kind: 'discrete',
    name: 'Zipf',
    mean,
    variance: harmonicNumber(count, exponent - 2) / normalizer - mean * mean,
    support: [1, count],
    pmf: (k) => (Number.isInteger(k) && k >= 1 && k <= count ? (masses[k - 1] ?? 0) : 0),
    cdf,
    quantile: (q) => 1 + searchCumulative(table, q - 1e-12),
    sample: (random) => 1 + searchCumulative(table, random.next()),
  };
}

/**
 * Success probability of the geometric count in Kemp's construction of the
 * logarithmic distribution: s = (1 - p)^U with U uniform on (0, 1).
 */
export function logarithmicMixingProbability(p: number, u: number): number {
  return (1 - p) ** u;
}

/** Logarithmic (log-series) distribution on 1, 2, 3, ... with parameter p in (0, 1). */
export function logarithmic(p: number): DiscreteDistribution {
  check(p > 0 && p < 1, 'p must be in (0, 1)');
  const log1mp = Math.log(1 - p);
  const pmf = (k: number) =>
    !Number.isInteger(k) || k < 1 ? 0 : Math.exp(k * Math.log(p) - Math.log(k)) / -log1mp;
  const cdf = (x: number) => {
    const k = Math.floor(x);
    if (k < 1) return 0;
    let total = 0;
    for (let j = 1; j <= k; j += 1) {
      total += pmf(j);
      if (total >= 1 - 1e-15) return 1;
    }
    return total;
  };
  const mean = -p / ((1 - p) * log1mp);
  return {
    kind: 'discrete',
    name: 'Logarítmica',
    mean,
    variance: (-p * (p + log1mp)) / ((1 - p) ** 2 * log1mp * log1mp),
    support: [1, Number.POSITIVE_INFINITY],
    pmf,
    cdf,
    quantile: (q) => discreteQuantile(cdf, q, 1, Number.POSITIVE_INFINITY, mean),
    sample: (random) => random.geometric(logarithmicMixingProbability(p, random.next())),
  };
}

/** Poisson count that is replaced by a structural zero with probability pi. */
export function zeroInflatedPoisson(pi: number, lambda: number): DiscreteDistribution {
  check(pi >= 0 && pi < 1, 'pi must be in [0, 1)');
  check(lambda > 0, 'lambda must be positive');
  const pmf = (k: number) => {
    if (!Number.isInteger(k) || k < 0) return 0;
    const poissonMass = Math.exp(poissonLogPmf(k, lambda));
    return (k === 0 ? pi : 0) + (1 - pi) * poissonMass;
  };
  const cdf = (x: number) => {
    const k = Math.floor(x);
    if (k < 0) return 0;
    let total = 0;
    for (let j = 0; j <= k; j += 1) {
      total += pmf(j);
      if (total >= 1 - 1e-15) return 1;
    }
    return total;
  };
  const mean = (1 - pi) * lambda;
  return {
    kind: 'discrete',
    name: 'Poisson inflada en ceros',
    mean,
    variance: (1 - pi) * lambda * (1 + pi * lambda),
    support: [0, Number.POSITIVE_INFINITY],
    pmf,
    cdf,
    quantile: (q) => discreteQuantile(cdf, q, 0, Number.POSITIVE_INFINITY, mean),
    sample: (random) => (random.bernoulli(pi) ? 0 : random.poisson(lambda)),
  };
}

/** Standard deviations below the mean where the Skellam lower tail is negligible. */
const SKELLAM_TAIL_SDS = 14;

/**
 * Difference N1 - N2 of independent Poisson counts. The mass is computed as
 * the convolution sum over N2, which avoids evaluating Bessel functions.
 */
export function skellam(mu1: number, mu2: number): DiscreteDistribution {
  check(mu1 > 0 && mu2 > 0, 'rates must be positive');
  const sd = Math.sqrt(mu1 + mu2);
  const pmf = (k: number) => {
    if (!Number.isInteger(k)) return 0;
    let total = 0;
    const start = Math.max(0, -k);
    // Terms peak near j = mu2 and decay quickly after; stop once they are negligible.
    for (let j = start; j < start + 10000; j += 1) {
      const term = Math.exp(poissonLogPmf(j + k, mu1) + poissonLogPmf(j, mu2));
      total += term;
      if (j > mu2 + k && term < total * 1e-17) break;
    }
    return total;
  };
  const lowest = Math.floor(mu1 - mu2 - SKELLAM_TAIL_SDS * sd - 5);
  const cdf = (x: number) => {
    const k = Math.floor(x);
    if (k < lowest) return 0;
    let total = 0;
    for (let j = lowest; j <= k; j += 1) total += pmf(j);
    return Math.min(1, total);
  };
  return {
    kind: 'discrete',
    name: 'Skellam',
    mean: mu1 - mu2,
    variance: mu1 + mu2,
    support: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
    pmf,
    cdf,
    quantile: (q) =>
      discreteQuantile(cdf, q, lowest, Number.POSITIVE_INFINITY, Math.round(mu1 - mu2)),
    sample: (random) => random.poisson(mu1) - random.poisson(mu2),
  };
}

/** Random sign: -1 or +1 with probability 1/2 each. */
export function rademacher(): DiscreteDistribution {
  return {
    kind: 'discrete',
    name: 'Rademacher',
    mean: 0,
    variance: 1,
    support: [-1, 1],
    pmf: (k) => (k === 1 || k === -1 ? 0.5 : 0),
    cdf: (x) => (x < -1 ? 0 : x < 1 ? 0.5 : 1),
    quantile: (q) => (q <= 0.5 ? -1 : 1),
    sample: (random) => (random.bernoulli(0.5) ? 1 : -1),
  };
}

/**
 * Sum of n independent Rademacher signs, S = 2B - n with B ~ Bin(n, 1/2).
 * Its support has the parity of n.
 */
export function rademacherSum(n: number): DiscreteDistribution {
  check(Number.isInteger(n) && n >= 1, 'n must be a positive integer');
  const pmf = (k: number) => {
    if (!Number.isInteger(k) || Math.abs(k) > n || (k + n) % 2 !== 0) return 0;
    return Math.exp(logChoose(n, (k + n) / 2) - n * Math.LN2);
  };
  const cdf = (x: number) => {
    let total = 0;
    for (let k = -n; k <= Math.min(n, Math.floor(x)); k += 2) total += pmf(k);
    return Math.min(1, total);
  };
  return {
    kind: 'discrete',
    name: 'Suma de signos',
    mean: 0,
    variance: n,
    support: [-n, n],
    pmf,
    cdf,
    quantile: (q) => discreteQuantile(cdf, q, -n, n, 0),
    sample: (random) => 2 * random.binomial(n, 0.5) - n,
  };
}

/** Distribution of X + c for an integer shift c, such as trials = failures + r. */
export function shifted(distribution: DiscreteDistribution, shift: number): DiscreteDistribution {
  check(Number.isInteger(shift), 'the shift must be an integer');
  return {
    ...distribution,
    mean: distribution.mean + shift,
    support: [distribution.support[0] + shift, distribution.support[1] + shift],
    pmf: (k) => distribution.pmf(k - shift),
    cdf: (x) => distribution.cdf(x - shift),
    quantile: (q) => distribution.quantile(q) + shift,
    sample: (random) => distribution.sample(random) + shift,
  };
}

/** Probability of the count vector under a multinomial with the given probabilities. */
export function multinomialPmf(
  counts: readonly number[],
  probabilities: readonly number[],
): number {
  check(counts.length === probabilities.length, 'counts and probabilities must match');
  if (counts.some((count) => !Number.isInteger(count) || count < 0)) return 0;
  const n = counts.reduce((sum, count) => sum + count, 0);
  let log = logFactorial(n);
  for (let i = 0; i < counts.length; i += 1) {
    const count = counts[i] ?? 0;
    const p = probabilities[i] ?? 0;
    if (count === 0) continue;
    if (p === 0) return 0;
    log += count * Math.log(p) - logFactorial(count);
  }
  return Math.exp(log);
}

/** Counts of n independent categorical draws, obtained by sequential binomial splitting. */
export function sampleMultinomial(
  random: Random,
  n: number,
  probabilities: readonly number[],
): number[] {
  const counts: number[] = [];
  let remaining = n;
  let mass = probabilities.reduce((sum, p) => sum + p, 0);
  probabilities.forEach((p, index) => {
    if (index === probabilities.length - 1) {
      counts.push(remaining);
      return;
    }
    const share = mass > 0 ? Math.min(1, p / mass) : 0;
    const count = remaining > 0 ? random.binomial(remaining, share) : 0;
    counts.push(count);
    remaining -= count;
    mass -= p;
  });
  return counts;
}
