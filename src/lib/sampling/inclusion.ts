import { Random } from '../random/index.ts';

/**
 * Inclusion probabilities π_i = n x_i / X of a fixed-size design proportional
 * to size. Units whose π would exceed 1 are taken with certainty and the rest
 * of the sample is spread over the remaining units, repeating as needed.
 */
export function inclusionProbabilities(sizes: readonly number[], n: number): number[] {
  const pi = new Array<number>(sizes.length).fill(0);
  const certain = new Set<number>();
  for (let guard = 0; guard < sizes.length; guard += 1) {
    const remaining = n - certain.size;
    const rest = sizes.reduce((acc, x, i) => (certain.has(i) ? acc : acc + x), 0);
    let changed = false;
    sizes.forEach((x, i) => {
      if (certain.has(i)) {
        pi[i] = 1;
        return;
      }
      const value = rest === 0 ? 0 : (remaining * x) / rest;
      if (value >= 1) {
        certain.add(i);
        changed = true;
      }
      pi[i] = Math.min(1, value);
    });
    if (!changed) break;
  }
  return pi;
}

/**
 * Systematic πps sampling (Madow): units are laid end to end with lengths π_i,
 * a random start u in [0, 1) is chosen and the units covering u, u + 1, ...
 * are selected. Each unit is included with probability exactly π_i.
 */
export function systematicPps(pi: readonly number[], random: Random): number[] {
  return systematicPpsFrom(pi, random.next());
}

/** Systematic πps selection for a given start u in [0, 1). */
export function systematicPpsFrom(pi: readonly number[], start: number): number[] {
  const chosen: number[] = [];
  let cumulative = 0;
  let next = start;
  pi.forEach((p, i) => {
    const end = cumulative + p;
    while (next < end - 1e-12) {
      if (chosen[chosen.length - 1] !== i) chosen.push(i);
      next += 1;
    }
    cumulative = end;
  });
  return chosen;
}

/** Poisson sampling: each unit enters independently with its own probability. */
export function poissonSample(pi: readonly number[], random: Random): number[] {
  const chosen: number[] = [];
  pi.forEach((p, i) => {
    if (random.next() < p) chosen.push(i);
  });
  return chosen;
}

/** Horvitz-Thompson estimator of the population total: Σ y_i / π_i over the sample. */
export function horvitzThompsonTotal(
  sample: readonly number[],
  values: readonly number[],
  pi: readonly number[],
): number {
  return sample.reduce((acc, i) => acc + (values[i] ?? 0) / (pi[i] ?? 1), 0);
}

/**
 * Variance of the Horvitz-Thompson total under Poisson sampling, where the
 * joint inclusion probabilities factor: Σ (1 - π_i) y_i² / π_i.
 */
export function poissonHtVariance(values: readonly number[], pi: readonly number[]): number {
  return values.reduce((acc, y, i) => {
    const p = pi[i] ?? 1;
    return p <= 0 ? acc : acc + ((1 - p) * y * y) / p;
  }, 0);
}
