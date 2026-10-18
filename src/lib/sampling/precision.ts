import { standardNormalQuantile } from '../distributions/special.ts';
import { Random } from '../random/index.ts';

/** Critical value z_{1 - α/2} for a two-sided interval of the given confidence. */
export function criticalValue(confidence: number): number {
  return standardNormalQuantile(1 - (1 - confidence) / 2);
}

/** Variance factor of sampling without replacement: 1 - n/N (1 for an infinite population). */
export function finitePopulationFactor(n: number, N: number | null): number {
  if (N === null || !Number.isFinite(N)) return 1;
  return Math.max(0, 1 - n / N);
}

/** Correction applied to a standard error computed with the population σ: √((N - n)/(N - 1)). */
export function finitePopulationCorrection(n: number, N: number): number {
  if (N <= 1) return 0;
  return Math.sqrt(Math.max(0, (N - n) / (N - 1)));
}

/** Margin of error z √((1 - n/N) S² / n) for a mean with deviation S. */
export function marginOfErrorMean(
  s: number,
  n: number,
  confidence: number,
  N: number | null = null,
): number {
  return criticalValue(confidence) * Math.sqrt((finitePopulationFactor(n, N) * s * s) / n);
}

/** Margin of error of a proportion: z √((1 - n/N) p(1 - p) / n). */
export function marginOfErrorProportion(
  p: number,
  n: number,
  confidence: number,
  N: number | null = null,
): number {
  return criticalValue(confidence) * Math.sqrt((finitePopulationFactor(n, N) * p * (1 - p)) / n);
}

/** Size n0 for an infinite population, before the finite population adjustment. */
export function initialSampleSize(variance: number, margin: number, confidence: number): number {
  const z = criticalValue(confidence);
  return (z * z * variance) / (margin * margin);
}

/** n = n0 / (1 + n0 / N), rounded up; equal to ⌈n0⌉ when N is unknown or infinite. */
export function adjustForPopulation(n0: number, N: number | null): number {
  if (N === null || !Number.isFinite(N)) return Math.ceil(n0);
  return Math.ceil(n0 / (1 + n0 / N));
}

/** Sample size for estimating a mean within ± margin with the given confidence. */
export function sampleSizeMean(
  s: number,
  margin: number,
  confidence: number,
  N: number | null = null,
  deff = 1,
): number {
  return adjustForPopulation(initialSampleSize(s * s, margin, confidence) * deff, N);
}

/** Sample size for a proportion; p = 0.5 gives the conservative (largest) size. */
export function sampleSizeProportion(
  p: number,
  margin: number,
  confidence: number,
  N: number | null = null,
  deff = 1,
): number {
  return adjustForPopulation(initialSampleSize(p * (1 - p), margin, confidence) * deff, N);
}

/** Design effect of cluster sampling with equal clusters of size m and intraclass correlation ρ. */
export function clusterDesignEffect(m: number, rho: number): number {
  return 1 + (m - 1) * rho;
}

/** Effective sample size: the simple random sample size with the same precision. */
export function effectiveSampleSize(n: number, deff: number): number {
  return deff <= 0 ? n : n / deff;
}

/** Kish's design effect from unequal weights: n Σ w² / (Σ w)². */
export function weightingDesignEffect(weights: readonly number[]): number {
  const sum = weights.reduce((a, b) => a + b, 0);
  const squares = weights.reduce((a, b) => a + b * b, 0);
  return sum === 0 ? 1 : (weights.length * squares) / (sum * sum);
}

export interface Poll {
  estimate: number;
  margin: number;
  covers: boolean;
}

/** Repeated polls of size n from a population with proportion p, each with its margin of error. */
export function simulatePolls(
  p: number,
  n: number,
  confidence: number,
  count: number,
  random: Random,
): Poll[] {
  return Array.from({ length: count }, () => {
    let successes = 0;
    for (let i = 0; i < n; i += 1) if (random.next() < p) successes += 1;
    const estimate = successes / n;
    const margin = marginOfErrorProportion(estimate, n, confidence);
    return { estimate, margin, covers: Math.abs(estimate - p) <= margin };
  });
}
