import { mean, variance } from '../stats/index.ts';

/** Standard error of the sample mean, sigma / sqrt(n). */
export function standardError(sigma: number, n: number): number {
  return sigma / Math.sqrt(n);
}

/**
 * Finite population correction sqrt((N - n) / (N - 1)) that multiplies the
 * standard error when sampling without replacement from N units.
 */
export function finitePopulationCorrection(populationSize: number, n: number): number {
  return Math.sqrt((populationSize - n) / (populationSize - 1));
}

/** Standard error of a sample proportion, sqrt(p (1 - p) / n). */
export function proportionStandardError(p: number, n: number): number {
  return Math.sqrt((p * (1 - p)) / n);
}

/** Studentized mean (xbar - mu) / (s / sqrt(n)), a pivot with a t distribution on n - 1 degrees of freedom under normality. */
export function tPivot(sample: readonly number[], mu: number): number {
  const n = sample.length;
  return (mean(sample) - mu) / Math.sqrt(variance(sample) / n);
}

/** (n - 1) S^2 / sigma^2, chi-square with n - 1 degrees of freedom under normality. */
export function chiSquarePivot(sample: readonly number[], sigma2: number): number {
  return ((sample.length - 1) * variance(sample)) / sigma2;
}

export interface SumOfSquares {
  /** Sum of (x_i - mu)^2. */
  total: number;
  /** Sum of (x_i - xbar)^2, with n - 1 degrees of freedom. */
  within: number;
  /** n (xbar - mu)^2, with 1 degree of freedom. */
  mean: number;
}

/**
 * Decomposition behind Cochran's theorem for one sample:
 * sum (x_i - mu)^2 = sum (x_i - xbar)^2 + n (xbar - mu)^2.
 */
export function sumOfSquares(sample: readonly number[], mu: number): SumOfSquares {
  const xbar = mean(sample);
  let total = 0;
  let within = 0;
  for (const x of sample) {
    total += (x - mu) ** 2;
    within += (x - xbar) ** 2;
  }
  return { total, within, mean: sample.length * (xbar - mu) ** 2 };
}
