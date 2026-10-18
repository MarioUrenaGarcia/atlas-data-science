/**
 * Probability inequalities: tail bounds from moments (Markov, Chebyshev,
 * Cantelli), exponential concentration bounds for sums and averages of
 * independent bounded variables (Chernoff, Hoeffding, Bernstein,
 * McDiarmid), the union bound, and exact binomial tails to compare them with.
 */
import { logChoose } from '../distributions/special.ts';

/** Markov: P(X >= a) <= E[X] / a for X >= 0 and a > 0. */
export function markovBound(mean: number, a: number): number {
  return a > 0 ? Math.min(1, mean / a) : 1;
}

/** Chebyshev: P(|X - mu| >= k sigma) <= 1 / k^2. */
export function chebyshevBound(k: number): number {
  return k > 0 ? Math.min(1, 1 / (k * k)) : 1;
}

/** Cantelli (one-sided Chebyshev): P(X - mu >= t) <= sigma^2 / (sigma^2 + t^2) for t > 0. */
export function cantelliBound(variance: number, t: number): number {
  return t > 0 ? variance / (variance + t * t) : 1;
}

/** Relative entropy between Bernoulli(a) and Bernoulli(p), the exponent of the Chernoff bound. */
export function bernoulliKl(a: number, p: number): number {
  const term = (x: number, y: number) => (x <= 0 ? 0 : x * Math.log(x / y));
  if (p <= 0 || p >= 1) return a === p ? 0 : Number.POSITIVE_INFINITY;
  return term(a, p) + term(1 - a, 1 - p);
}

/**
 * Chernoff bound for the average of n independent Bernoulli(p) trials:
 * P(mean >= p + t) <= exp(-n D(p + t || p)), the optimized exponential bound.
 */
export function chernoffBound(n: number, p: number, t: number): number {
  const a = p + t;
  if (t <= 0) return 1;
  if (a > 1) return 0;
  return Math.min(1, Math.exp(-n * bernoulliKl(a, p)));
}

/** Hoeffding: P(mean - mu >= t) <= exp(-2 n t^2 / (b - a)^2) for variables in [a, b]. */
export function hoeffdingBound(n: number, t: number, range = 1): number {
  return t > 0 ? Math.min(1, Math.exp((-2 * n * t * t) / (range * range))) : 1;
}

/**
 * Bernstein: P(mean - mu >= t) <= exp(-n t^2 / (2 sigma^2 + 2 c t / 3)) for
 * independent variables with variance sigma^2 and |X - mu| <= c.
 */
export function bernsteinBound(n: number, t: number, variance: number, c: number): number {
  return t > 0 ? Math.min(1, Math.exp((-n * t * t) / (2 * variance + (2 * c * t) / 3))) : 1;
}

/** McDiarmid: P(f - E f >= t) <= exp(-2 t^2 / sum c_i^2) for bounded differences c_i. */
export function mcdiarmidBound(t: number, sumSquares: number): number {
  return t > 0 && sumSquares > 0 ? Math.min(1, Math.exp((-2 * t * t) / sumSquares)) : 1;
}

/** Exact P(S = k) for S ~ Binomial(n, p). */
export function binomialPmf(n: number, p: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (p <= 0) return k === 0 ? 1 : 0;
  if (p >= 1) return k === n ? 1 : 0;
  return Math.exp(logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
}

/** Exact P(S / n - p >= t) for S ~ Binomial(n, p): the upper tail of the sample proportion. */
export function binomialUpperTail(n: number, p: number, t: number): number {
  const first = Math.ceil(n * (p + t) - 1e-9);
  let total = 0;
  for (let k = Math.max(0, first); k <= n; k += 1) total += binomialPmf(n, p, k);
  return Math.min(1, total);
}

/** Exact P(|S / n - p| >= t) for S ~ Binomial(n, p). */
export function binomialTwoSidedTail(n: number, p: number, t: number): number {
  let total = 0;
  for (let k = 0; k <= n; k += 1) {
    if (Math.abs(k / n - p) >= t - 1e-12) total += binomialPmf(n, p, k);
  }
  return Math.min(1, total);
}

/** Union bound: P(A_1 or ... or A_m) <= sum P(A_i), capped at 1. */
export function unionBound(probabilities: readonly number[]): number {
  return Math.min(
    1,
    probabilities.reduce((sum, p) => sum + p, 0),
  );
}

/**
 * Birthday problem: exact probability that among n people with d equally
 * likely birthdays at least two share one, and the union bound over the
 * n(n-1)/2 pairs, each sharing with probability 1/d.
 */
export function birthdayCollision(n: number, d = 365): { exact: number; bound: number } {
  let none = 1;
  for (let i = 0; i < n; i += 1) none *= Math.max(0, (d - i) / d);
  return { exact: 1 - none, bound: Math.min(1, (n * (n - 1)) / (2 * d)) };
}
