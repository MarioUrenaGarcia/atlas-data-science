import { standardNormalQuantile } from '../distributions/special.ts';

/** Exact number of binary strings of the given length with no two adjacent ones (a Fibonacci number). */
export function stringsWithoutAdjacentOnes(length: number): number {
  let endsInZero = 1;
  let endsInOne = 1;
  if (length === 0) return 1;
  for (let i = 2; i <= length; i += 1)
    [endsInZero, endsInOne] = [endsInZero + endsInOne, endsInZero];
  return endsInZero + endsInOne;
}

export function hasAdjacentOnes(bits: readonly number[]): boolean {
  return bits.some((bit, index) => bit === 1 && bits[index + 1] === 1);
}

/** Exact number of subsets of {1, ..., n} whose elements add up to at most `limit`. */
export function subsetsWithSumAtMost(n: number, limit: number): number {
  const ways: number[] = Array.from({ length: limit + 1 }, (_, total) => (total === 0 ? 1 : 0));
  for (let item = 1; item <= n; item += 1) {
    for (let total = limit; total >= item; total -= 1)
      ways[total] = (ways[total] ?? 0) + (ways[total - item] ?? 0);
  }
  return ways.reduce((sum, value) => sum + value, 0);
}

export interface CountEstimate {
  estimate: number;
  low: number;
  high: number;
}

/**
 * Estimate of the size of a subset of a finite universe from the share of
 * uniform samples that fall in it, with a normal approximation interval.
 */
export function estimateCount(
  hits: number,
  samples: number,
  universe: number,
  confidence = 0.95,
): CountEstimate {
  if (samples === 0) return { estimate: 0, low: 0, high: universe };
  const share = hits / samples;
  const z = standardNormalQuantile(1 - (1 - confidence) / 2);
  const margin = z * Math.sqrt((share * (1 - share)) / samples);
  return {
    estimate: share * universe,
    low: Math.max(0, share - margin) * universe,
    high: Math.min(1, share + margin) * universe,
  };
}
