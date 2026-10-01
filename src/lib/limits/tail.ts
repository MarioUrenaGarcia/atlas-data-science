import type { Random } from '../random/index.ts';

/** Probability p_n = min(1, c / n^s) of the n-th event in the Borel-Cantelli simulations. */
export function eventProbability(n: number, c: number, s: number): number {
  return Math.min(1, c / n ** s);
}

/** Partial sum of p_1 + ... + p_n. */
export function partialSum(n: number, c: number, s: number): number {
  let total = 0;
  for (let k = 1; k <= n; k += 1) total += eventProbability(k, c, s);
  return total;
}

const TAIL_TERMS = 1_000_000;

/**
 * For n = 1..length, P(some A_m occurs for m >= n) = 1 - prod_{m >= n} (1 - p_m)
 * for independent events. The product beyond `length` is accumulated for a
 * million more terms and the remaining tail of sum p_m is added in closed
 * form (integral bound); the curve is then built backwards in one pass.
 */
export function independentTailUnion(length: number, c: number, s: number): Float64Array {
  const result = new Float64Array(length);
  let logSurvival = 0;
  let certain = s <= 1;
  if (!certain) {
    for (let m = length + 1; m <= length + TAIL_TERMS; m += 1) {
      const p = eventProbability(m, c, s);
      if (p >= 1) {
        certain = true;
        break;
      }
      logSurvival += Math.log1p(-p);
    }
    const end = length + TAIL_TERMS + 1;
    logSurvival -= (c * end ** (1 - s)) / (s - 1);
  }
  for (let n = length; n >= 1; n -= 1) {
    const p = eventProbability(n, c, s);
    if (p >= 1) certain = true;
    else logSurvival += Math.log1p(-p);
    result[n - 1] = certain ? 1 : 1 - Math.exp(logSurvival);
  }
  return result;
}

/**
 * Occurrence indices (0-based) of the events in one run. Independent events
 * use p_n = min(1, c / n^s); dependent ones are A_n = {U < 1/n} with a single
 * uniform U, so their probabilities sum to infinity and yet only finitely
 * many occur.
 */
export function simulateEvents(
  length: number,
  c: number,
  s: number,
  dependent: boolean,
  random: Random,
): number[] {
  const hits: number[] = [];
  if (dependent) {
    const u = random.uniform();
    for (let n = 1; n <= length; n += 1) if (u < 1 / n) hits.push(n - 1);
    return hits;
  }
  for (let n = 1; n <= length; n += 1)
    if (random.uniform() < eventProbability(n, c, s)) hits.push(n - 1);
  return hits;
}

/** Partial sums of the random series sum eps_i / i^a with independent fair signs. */
export function randomSignSeries(length: number, a: number, random: Random): Float64Array {
  const path = new Float64Array(length);
  let total = 0;
  for (let i = 1; i <= length; i += 1) {
    total += (random.bernoulli(0.5) ? 1 : -1) / i ** a;
    path[i - 1] = total;
  }
  return path;
}

/** Variance of the n-th partial sum of the random sign series: sum 1 / i^(2a). */
export function seriesVariance(n: number, a: number): number {
  let total = 0;
  for (let i = 1; i <= n; i += 1) total += 1 / i ** (2 * a);
  return total;
}

/** max - min of path values at indices n-1 .. 2n-1, clipped to the path length. */
export function oscillation(path: Float64Array, n: number): number {
  let lo = Number.POSITIVE_INFINITY;
  let hi = Number.NEGATIVE_INFINITY;
  for (let i = n - 1; i < Math.min(path.length, 2 * n); i += 1) {
    const value = path[i] ?? 0;
    if (value < lo) lo = value;
    if (value > hi) hi = value;
  }
  return hi - lo;
}
