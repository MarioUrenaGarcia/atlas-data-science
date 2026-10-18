import { choose as binomialCoefficient } from '../distributions/special.ts';

/** All binary sequences of length n, in lexicographic order. */
export function binarySequences(n: number): number[][] {
  return Array.from({ length: 2 ** n }, (_, code) =>
    Array.from({ length: n }, (_, i) => (code >> (n - 1 - i)) & 1),
  );
}

/** Probability of one Bernoulli sequence with k ones out of n, p^k (1 - p)^(n - k). */
export function sequenceProbability(sequence: readonly number[], p: number): number {
  const k = sequence.reduce((t, x) => t + x, 0);
  return p ** k * (1 - p) ** (sequence.length - k);
}

/**
 * Probability of a sequence given its total k. It equals 1 / C(n, k) for
 * every p: once the total is known the order carries no information about
 * p, which is what makes the total sufficient.
 */
export function conditionalGivenSum(sequence: readonly number[], p: number): number {
  const n = sequence.length;
  const k = sequence.reduce((t, x) => t + x, 0);
  const total = binomialCoefficient(n, k) * p ** k * (1 - p) ** (n - k);
  return sequenceProbability(sequence, p) / total;
}

/**
 * Rao-Blackwellized estimator of P(X = 0) = exp(-lambda) for a Poisson
 * sample: E[1{X_1 = 0} | sum = t] = ((n - 1) / n)^t.
 */
export function raoBlackwellPoissonZero(n: number, total: number): number {
  return ((n - 1) / n) ** total;
}

/**
 * Expected value E_p[g(T)] for T ~ Binomial(n, p) and a function g given by
 * its values g(0), ..., g(n). For a complete family this polynomial in p is
 * identically zero only when every g(k) is zero.
 */
export function binomialExpectation(g: readonly number[], p: number): number {
  const n = g.length - 1;
  let total = 0;
  for (let k = 0; k <= n; k += 1) {
    total += (g[k] ?? 0) * binomialCoefficient(n, k) * p ** k * (1 - p) ** (n - k);
  }
  return total;
}

/** Normal log-likelihood of mu with known sigma, up to a constant. */
export function normalLogLikelihood(sample: readonly number[], mu: number, sigma: number): number {
  return -sample.reduce((t, x) => t + (x - mu) ** 2, 0) / (2 * sigma * sigma);
}
