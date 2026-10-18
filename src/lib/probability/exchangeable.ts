/**
 * Exchangeable binary sequences: the Pólya urn, which adds a ball of the
 * drawn color after each draw, and its de Finetti representation as a
 * mixture of independent Bernoulli sequences with a beta-distributed
 * success probability.
 */
import { logBeta } from '../distributions/special.ts';
import type { Random } from '../random/index.ts';

/**
 * Draws from a Pólya urn that starts with `a` balls of the first color and
 * `b` of the second; each draw returns the ball plus one more of its color.
 * Returns 1 for the first color and 0 for the second.
 */
export function polyaSequence(a: number, b: number, n: number, random: Random): number[] {
  let first = a;
  let second = b;
  const draws: number[] = [];
  for (let k = 0; k < n; k += 1) {
    const hit = random.uniform() < first / (first + second) ? 1 : 0;
    draws.push(hit);
    if (hit) first += 1;
    else second += 1;
  }
  return draws;
}

/**
 * The same law by de Finetti's theorem: draw p from Beta(a, b), then n
 * independent Bernoulli(p) trials. Returns the sequence and the drawn p.
 */
export function mixtureSequence(
  a: number,
  b: number,
  n: number,
  random: Random,
): { draws: number[]; p: number } {
  const x = random.gamma(a, 1);
  const y = random.gamma(b, 1);
  const p = x / (x + y);
  return { draws: Array.from({ length: n }, () => (random.uniform() < p ? 1 : 0)), p };
}

/**
 * Probability of one particular sequence with k ones among n draws from the
 * urn: B(a + k, b + n - k) / B(a, b). It depends only on k, not on the order,
 * which is what exchangeability means.
 */
export function polyaSequenceProbability(a: number, b: number, n: number, k: number): number {
  return Math.exp(logBeta(a + k, b + n - k) - logBeta(a, b));
}
