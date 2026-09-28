import { logChoose, logFactorial, regularizedBeta, regularizedGammaQ } from './special.ts';
import type { DiscreteDistribution } from './types.ts';

function check(condition: boolean, message: string): void {
  if (!condition) throw new RangeError(message);
}

/**
 * Smallest integer k in [lo, hi] with cdf(k) >= p. The search walks up from
 * an initial guess, which is fast for the distributions used in the Atlas.
 */
function discreteQuantile(
  cdf: (k: number) => number,
  p: number,
  lo: number,
  hi: number,
  guess: number,
): number {
  let k = Math.max(lo, Math.min(Number.isFinite(hi) ? hi : guess, Math.floor(guess)));
  // A small tolerance absorbs rounding in cdf values that equal p exactly in exact arithmetic.
  const target = p - 1e-12;
  while (k > lo && cdf(k - 1) >= target) k -= 1;
  while (cdf(k) < target && k < hi) k += 1;
  return k;
}

export function bernoulli(p: number): DiscreteDistribution {
  check(p >= 0 && p <= 1, 'p must be in [0, 1]');
  return {
    kind: 'discrete',
    name: 'Bernoulli',
    mean: p,
    variance: p * (1 - p),
    support: [0, 1],
    pmf: (k) => (k === 1 ? p : k === 0 ? 1 - p : 0),
    cdf: (k) => (k < 0 ? 0 : k < 1 ? 1 - p : 1),
    quantile: (q) => (q <= 1 - p ? 0 : 1),
    sample: (random) => (random.bernoulli(p) ? 1 : 0),
  };
}

export function binomial(n: number, p: number): DiscreteDistribution {
  check(Number.isInteger(n) && n >= 0, 'n must be a nonnegative integer');
  check(p >= 0 && p <= 1, 'p must be in [0, 1]');
  const pmf = (k: number) => {
    if (!Number.isInteger(k) || k < 0 || k > n) return 0;
    if (p === 0) return k === 0 ? 1 : 0;
    if (p === 1) return k === n ? 1 : 0;
    return Math.exp(logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
  };
  const cdf = (x: number) => {
    const k = Math.floor(x);
    if (k < 0) return 0;
    if (k >= n) return 1;
    return regularizedBeta(1 - p, n - k, k + 1);
  };
  return {
    kind: 'discrete',
    name: 'Binomial',
    mean: n * p,
    variance: n * p * (1 - p),
    support: [0, n],
    pmf,
    cdf,
    quantile: (q) => discreteQuantile(cdf, q, 0, n, n * p),
    sample: (random) => random.binomial(n, p),
  };
}

export function poisson(lambda: number): DiscreteDistribution {
  check(lambda > 0, 'lambda must be positive');
  const cdf = (x: number) => {
    const k = Math.floor(x);
    return k < 0 ? 0 : regularizedGammaQ(k + 1, lambda);
  };
  return {
    kind: 'discrete',
    name: 'Poisson',
    mean: lambda,
    variance: lambda,
    support: [0, Number.POSITIVE_INFINITY],
    pmf: (k) =>
      !Number.isInteger(k) || k < 0 ? 0 : Math.exp(k * Math.log(lambda) - lambda - logFactorial(k)),
    cdf,
    quantile: (q) => discreteQuantile(cdf, q, 0, Number.POSITIVE_INFINITY, lambda),
    sample: (random) => random.poisson(lambda),
  };
}

/** Number of trials up to and including the first success; support 1, 2, 3, ... */
export function geometric(p: number): DiscreteDistribution {
  check(p > 0 && p <= 1, 'p must be in (0, 1]');
  const cdf = (x: number) => {
    const k = Math.floor(x);
    return k < 1 ? 0 : 1 - (1 - p) ** k;
  };
  return {
    kind: 'discrete',
    name: 'Geométrica',
    mean: 1 / p,
    variance: (1 - p) / (p * p),
    support: [1, Number.POSITIVE_INFINITY],
    pmf: (k) => (!Number.isInteger(k) || k < 1 ? 0 : (1 - p) ** (k - 1) * p),
    cdf,
    quantile: (q) => Math.max(1, Math.ceil(Math.log(1 - q) / Math.log(1 - p) - 1e-12)),
    sample: (random) => random.geometric(p),
  };
}

/** Number of failures before the r-th success; support 0, 1, 2, ... */
export function negativeBinomial(r: number, p: number): DiscreteDistribution {
  check(r > 0 && p > 0 && p <= 1, 'r must be positive and p in (0, 1]');
  const cdf = (x: number) => {
    const k = Math.floor(x);
    return k < 0 ? 0 : regularizedBeta(p, r, k + 1);
  };
  return {
    kind: 'discrete',
    name: 'Binomial negativa',
    mean: (r * (1 - p)) / p,
    variance: (r * (1 - p)) / (p * p),
    support: [0, Number.POSITIVE_INFINITY],
    pmf: (k) =>
      !Number.isInteger(k) || k < 0
        ? 0
        : Math.exp(
            logFactorial(k + r - 1) -
              logFactorial(k) -
              logFactorial(r - 1) +
              r * Math.log(p) +
              k * Math.log(1 - p),
          ),
    cdf,
    quantile: (q) => discreteQuantile(cdf, q, 0, Number.POSITIVE_INFINITY, (r * (1 - p)) / p),
    sample: (random) => {
      // Sum of r geometric counts of failures.
      let failures = 0;
      for (let i = 0; i < r; i += 1) failures += random.geometric(p) - 1;
      return failures;
    },
  };
}

/** Successes in n draws without replacement from N items of which K are successes. */
export function hypergeometric(
  population: number,
  successes: number,
  draws: number,
): DiscreteDistribution {
  check(successes <= population && draws <= population, 'invalid hypergeometric parameters');
  const lo = Math.max(0, draws - (population - successes));
  const hi = Math.min(draws, successes);
  const pmf = (k: number) =>
    !Number.isInteger(k) || k < lo || k > hi
      ? 0
      : Math.exp(
          logChoose(successes, k) +
            logChoose(population - successes, draws - k) -
            logChoose(population, draws),
        );
  const cdf = (x: number) => {
    let total = 0;
    for (let k = lo; k <= Math.min(hi, Math.floor(x)); k += 1) total += pmf(k);
    return Math.min(1, total);
  };
  const p = successes / population;
  return {
    kind: 'discrete',
    name: 'Hipergeométrica',
    mean: draws * p,
    variance: (draws * p * (1 - p) * (population - draws)) / (population - 1 || 1),
    support: [lo, hi],
    pmf,
    cdf,
    quantile: (q) => discreteQuantile(cdf, q, lo, hi, draws * p),
    sample: (random) => {
      let remainingSuccesses = successes;
      let remaining = population;
      let count = 0;
      for (let i = 0; i < draws; i += 1) {
        if (random.next() < remainingSuccesses / remaining) {
          count += 1;
          remainingSuccesses -= 1;
        }
        remaining -= 1;
      }
      return count;
    },
  };
}

export function discreteUniform(min: number, max: number): DiscreteDistribution {
  check(
    Number.isInteger(min) && Number.isInteger(max) && max >= min,
    'bounds must be ordered integers',
  );
  const count = max - min + 1;
  return {
    kind: 'discrete',
    name: 'Uniforme discreta',
    mean: (min + max) / 2,
    variance: (count * count - 1) / 12,
    support: [min, max],
    pmf: (k) => (Number.isInteger(k) && k >= min && k <= max ? 1 / count : 0),
    cdf: (x) => (x < min ? 0 : x >= max ? 1 : (Math.floor(x) - min + 1) / count),
    quantile: (q) => Math.min(max, min + Math.max(0, Math.ceil(q * count) - 1)),
    sample: (random) => random.int(min, max),
  };
}

/** Categorical distribution over 0..k-1 with the given probabilities. */
export function categorical(probabilities: readonly number[]): DiscreteDistribution {
  const total = probabilities.reduce((sum, value) => sum + value, 0);
  check(
    total > 0 && probabilities.every((value) => value >= 0),
    'probabilities must be nonnegative',
  );
  const normalized = probabilities.map((value) => value / total);
  const cumulative: number[] = [];
  normalized.reduce((sum, value, index) => {
    cumulative[index] = sum + value;
    return sum + value;
  }, 0);
  const mean = normalized.reduce((sum, value, index) => sum + index * value, 0);
  const variance = normalized.reduce((sum, value, index) => sum + value * (index - mean) ** 2, 0);
  return {
    kind: 'discrete',
    name: 'Categórica',
    mean,
    variance,
    support: [0, normalized.length - 1],
    pmf: (k) => normalized[k] ?? 0,
    cdf: (x) => (x < 0 ? 0 : x >= normalized.length - 1 ? 1 : (cumulative[Math.floor(x)] ?? 0)),
    quantile: (q) => {
      const index = cumulative.findIndex((value) => value >= q);
      return index < 0 ? normalized.length - 1 : index;
    },
    sample: (random) => random.categorical(normalized),
  };
}
