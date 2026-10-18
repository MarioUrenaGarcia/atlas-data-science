/**
 * Order statistics of an independent sample from a continuous distribution:
 * the density and distribution function of the k-th smallest value, with the
 * maximum and the minimum as the extreme cases.
 */
import { logChoose } from '../distributions/special.ts';

/**
 * Density of the k-th order statistic X_(k) of n independent draws with
 * distribution function F and density f, evaluated where F(x) = u and f(x) = fx:
 * n C(n-1, k-1) u^(k-1) (1-u)^(n-k) fx.
 */
export function orderStatisticDensity(k: number, n: number, u: number, fx: number): number {
  if (k < 1 || k > n || fx <= 0 || u < 0 || u > 1) return 0;
  const logCoefficient = Math.log(n) + logChoose(n - 1, k - 1);
  const logTerms =
    (k - 1 > 0 ? (k - 1) * Math.log(u) : 0) + (n - k > 0 ? (n - k) * Math.log(1 - u) : 0);
  if (!Number.isFinite(logTerms)) return 0;
  return Math.exp(logCoefficient + logTerms) * fx;
}

/**
 * P(X_(k) <= x) where u = F(x): the probability that at least k of the n
 * draws fall at or below x, a binomial tail.
 */
export function orderStatisticCdf(k: number, n: number, u: number): number {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  let total = 0;
  for (let j = k; j <= n; j += 1) {
    total += Math.exp(logChoose(n, j) + j * Math.log(u) + (n - j) * Math.log(1 - u));
  }
  return Math.min(1, total);
}

/** Expected value of the k-th order statistic of n uniforms on (0, 1). */
export function uniformOrderMean(k: number, n: number): number {
  return k / (n + 1);
}
