/**
 * Kolmogorov-Smirnov distance between the empirical distribution function of
 * a sample and a continuous distribution function F, together with the point
 * where it is attained. The supremum is reached just before or at an
 * observation, so only those points are checked.
 */
export function ksDistance(
  sample: readonly number[],
  cdf: (x: number) => number,
): { distance: number; at: number } {
  const sorted = [...sample].sort((a, b) => a - b);
  const n = sorted.length;
  let distance = 0;
  let at = sorted[0] ?? 0;
  sorted.forEach((x, i) => {
    const f = cdf(x);
    const d = Math.max((i + 1) / n - f, f - i / n);
    if (d > distance) {
      distance = d;
      at = x;
    }
  });
  return { distance, at };
}

/** Kolmogorov distribution K(x) = P(sup |B(t)| <= x) of the Brownian bridge. */
export function kolmogorovCdf(x: number): number {
  if (x <= 0) return 0;
  if (x < 0.2) return 0;
  let total = 0;
  for (let k = 1; k <= 100; k += 1) {
    const term = (k % 2 === 1 ? 1 : -1) * Math.exp(-2 * k * k * x * x);
    total += term;
    if (Math.abs(term) < 1e-16) break;
  }
  return Math.max(0, Math.min(1, 1 - 2 * total));
}

/** Density of the Kolmogorov distribution, the derivative of kolmogorovCdf. */
export function kolmogorovPdf(x: number): number {
  if (x < 0.2) return 0;
  let total = 0;
  for (let k = 1; k <= 100; k += 1) {
    const term = (k % 2 === 1 ? 1 : -1) * k * k * Math.exp(-2 * k * k * x * x);
    total += term;
    if (Math.abs(term) < 1e-16) break;
  }
  return Math.max(0, 8 * x * total);
}

/**
 * Normalization of the law of the iterated logarithm, sqrt(2 n log log n).
 * Defined for n >= 3 so that log log n is positive.
 */
export function iteratedLogScale(n: number): number {
  return n < 3 ? Number.NaN : Math.sqrt(2 * n * Math.log(Math.log(n)));
}
