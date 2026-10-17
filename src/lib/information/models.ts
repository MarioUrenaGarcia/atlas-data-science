/**
 * Continuous and model-selection helpers for information theory views:
 * fitting a normal to a bimodal density by forward and reverse KL, and the
 * two-part description length of polynomial models.
 */

export const normalDensity = (x: number, mu: number, sigma: number) =>
  Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));

/** A two-component normal mixture with equal weights and modes at ±separation/2. */
export function bimodalDensity(separation: number, sigma = 0.6): (x: number) => number {
  return (x) =>
    0.5 * normalDensity(x, -separation / 2, sigma) + 0.5 * normalDensity(x, separation / 2, sigma);
}

/** Equally spaced grid on [a, b] with n intervals. */
export function grid(a: number, b: number, n: number): number[] {
  return Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);
}

/** KL divergence between two densities on a grid, in nats; the grid must cover both. */
export function gridKL(
  p: (x: number) => number,
  q: (x: number) => number,
  xs: readonly number[],
): number {
  const dx = (xs[1] ?? 1) - (xs[0] ?? 0);
  let sum = 0;
  for (const x of xs) {
    const px = p(x);
    const qx = Math.max(q(x), 1e-300);
    if (px > 1e-300) sum += px * Math.log(px / qx) * dx;
  }
  return sum;
}

/** Steps of the search grid for the reverse fit. */
const MU_STEPS = 80;
const SIGMA_STEPS = 60;
const SIGMA_UNIT = 0.05;
const TIE_TOLERANCE = 1e-9;

/**
 * Normal that minimizes KL(p || q), the forward direction, which matches the
 * mean and variance of p and covers every mode, or KL(q || p), the reverse
 * direction, found by search, which settles on a single mode.
 */
export function fitNormal(
  p: (x: number) => number,
  xs: readonly number[],
  direction: 'forward' | 'reverse',
  { muSteps = MU_STEPS, sigmaSteps = SIGMA_STEPS } = {},
): { mu: number; sigma: number; divergence: number } {
  const dx = (xs[1] ?? 1) - (xs[0] ?? 0);
  if (direction === 'forward') {
    const mu = xs.reduce((s, x) => s + x * p(x) * dx, 0);
    const variance = xs.reduce((s, x) => s + (x - mu) ** 2 * p(x) * dx, 0);
    const sigma = Math.sqrt(variance);
    return { mu, sigma, divergence: gridKL(p, (x) => normalDensity(x, mu, sigma), xs) };
  }
  let best = { mu: 0, sigma: 1, divergence: Infinity };
  const lo = xs[0] ?? -5;
  const hi = xs[xs.length - 1] ?? 5;
  for (let i = 0; i <= muSteps; i += 1) {
    const mu = lo / 2 + ((hi - lo) / 2) * (i / muSteps);
    for (let k = 1; k <= sigmaSteps; k += 1) {
      const sigma = (SIGMA_UNIT * SIGMA_STEPS * k) / sigmaSteps;
      const d = gridKL((x) => normalDensity(x, mu, sigma), p, xs);
      // The tolerance keeps the first of two mirror-image optima, so the fit does not jump between modes.
      if (d < best.divergence - TIE_TOLERANCE) best = { mu, sigma, divergence: d };
    }
  }
  return best;
}

/** Least squares polynomial coefficients c_0, ..., c_d by normal equations with partial pivoting. */
export function polyfit(xs: readonly number[], ys: readonly number[], degree: number): number[] {
  const m = degree + 1;
  const A: number[][] = Array.from({ length: m }, (_, r) =>
    Array.from({ length: m + 1 }, (_, c) =>
      c < m
        ? xs.reduce((s, x) => s + x ** (r + c), 0)
        : xs.reduce((s, x, i) => s + (ys[i] ?? 0) * x ** r, 0),
    ),
  );
  for (let col = 0; col < m; col += 1) {
    let pivot = col;
    for (let r = col + 1; r < m; r += 1) {
      if (Math.abs(A[r]?.[col] ?? 0) > Math.abs(A[pivot]?.[col] ?? 0)) pivot = r;
    }
    const swap = A[col] ?? [];
    A[col] = A[pivot] ?? [];
    A[pivot] = swap;
    const pivotRow = A[col] ?? [];
    for (let r = 0; r < m; r += 1) {
      const row = A[r];
      if (r === col || !row) continue;
      const factor = (row[col] ?? 0) / (pivotRow[col] ?? 1);
      for (let c = col; c <= m; c += 1) row[c] = (row[c] ?? 0) - factor * (pivotRow[c] ?? 0);
    }
  }
  return A.map((row, r) => (row[m] ?? 0) / (row[r] ?? 1));
}

export const polyval = (c: readonly number[], x: number) =>
  c.reduce((s, ci, k) => s + ci * x ** k, 0);

/**
 * Two-part description length in bits of data explained by a polynomial of
 * the given degree: (d + 1)/2 log2 n bits for the parameters plus n/2 log2(RSS/n)
 * for the residuals, up to a constant shared by all degrees.
 */
export function descriptionLength(
  xs: readonly number[],
  ys: readonly number[],
  degree: number,
): { model: number; data: number; total: number } {
  const n = xs.length;
  const c = polyfit(xs, ys, degree);
  const rss = xs.reduce((s, x, i) => s + ((ys[i] ?? 0) - polyval(c, x)) ** 2, 0);
  const model = ((degree + 1) / 2) * Math.log2(n);
  const data = (n / 2) * Math.log2(Math.max(rss / n, 1e-12));
  return { model, data, total: model + data };
}
