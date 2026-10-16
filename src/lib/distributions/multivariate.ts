/**
 * Multivariate distributions for small dimensions: the multivariate normal
 * and t, Dirichlet, Wishart, inverse Wishart and LKJ correlation matrices.
 * Vectors and matrices follow the conventions of src/lib/linalg.
 */
import {
  cholesky,
  determinant,
  inverse,
  multiply,
  multiplyVector,
  transpose,
  zeros,
  type Matrix,
  type Vector,
} from '../linalg/index.ts';
import type { Random } from '../random/index.ts';
import { logGamma } from './special.ts';

/** Covariance matrix of two variables from standard deviations and correlation. */
export function covariance2(sigma1: number, sigma2: number, rho: number): Matrix {
  return [
    [sigma1 * sigma1, rho * sigma1 * sigma2],
    [rho * sigma1 * sigma2, sigma2 * sigma2],
  ];
}

function choleskyOrThrow(matrix: Matrix): Matrix {
  const factor = cholesky(matrix);
  if (!factor) throw new Error('The matrix must be symmetric positive definite.');
  return factor;
}

/** Squared Mahalanobis distance (x - mu)^T Sigma^{-1} (x - mu). */
export function mahalanobis2(x: Vector, mu: Vector, sigma: Matrix): number {
  const precision = inverse(sigma);
  if (!precision) throw new Error('The covariance matrix must be invertible.');
  const diff = x.map((value, i) => value - (mu[i] ?? 0));
  const projected = multiplyVector(precision, diff);
  return diff.reduce((total, value, i) => total + value * (projected[i] ?? 0), 0);
}

/** Density of the multivariate normal N(mu, Sigma). */
export function mvnPdf(x: Vector, mu: Vector, sigma: Matrix): number {
  const d = mu.length;
  const det = determinant(sigma);
  return Math.exp(-0.5 * mahalanobis2(x, mu, sigma)) / Math.sqrt((2 * Math.PI) ** d * det);
}

/** One draw of N(mu, Sigma) as mu + L z with L the Cholesky factor of Sigma. */
export function sampleMvn(random: Random, mu: Vector, sigma: Matrix): Vector {
  const lower = choleskyOrThrow(sigma);
  const z = mu.map(() => random.normal());
  const lz = multiplyVector(lower, z);
  return mu.map((value, i) => value + (lz[i] ?? 0));
}

/**
 * Points of the ellipse (x - mu)^T Sigma^{-1} (x - mu) = c for a 2 by 2
 * covariance, traced as mu + sqrt(c) L (cos t, sin t).
 */
export function ellipsePoints(mu: Vector, sigma: Matrix, c: number, count = 96): Vector[] {
  const lower = choleskyOrThrow(sigma);
  const radius = Math.sqrt(c);
  return Array.from({ length: count + 1 }, (_, i) => {
    const t = (2 * Math.PI * i) / count;
    const p = multiplyVector(lower, [radius * Math.cos(t), radius * Math.sin(t)]);
    return [(mu[0] ?? 0) + (p[0] ?? 0), (mu[1] ?? 0) + (p[1] ?? 0)];
  });
}

/** Squared radius c whose ellipse holds probability q for a bivariate normal: -2 log(1 - q). */
export function normalEllipseLevel(q: number): number {
  return -2 * Math.log(1 - q);
}

export interface PrincipalAxes {
  /** Eigenvalues, largest first. */
  values: [number, number];
  /** Unit eigenvectors matching the eigenvalues. */
  vectors: [Vector, Vector];
}

/** Eigen decomposition of a symmetric 2 by 2 matrix, largest eigenvalue first. */
export function principalAxes(sigma: Matrix): PrincipalAxes {
  const a = sigma[0]?.[0] ?? 0;
  const b = sigma[0]?.[1] ?? 0;
  const d = sigma[1]?.[1] ?? 0;
  const half = (a + d) / 2;
  const root = Math.sqrt(((a - d) / 2) ** 2 + b * b);
  const l1 = half + root;
  const l2 = half - root;
  const angle = 0.5 * Math.atan2(2 * b, a - d);
  const v1: Vector = [Math.cos(angle), Math.sin(angle)];
  const v2: Vector = [-Math.sin(angle), Math.cos(angle)];
  return { values: [l1, l2], vectors: [v1, v2] };
}

export interface Conditional {
  mean: number;
  variance: number;
}

/** Distribution of X2 given X1 = x1 for a bivariate normal. */
export function conditionalNormal(mu: Vector, sigma: Matrix, x1: number): Conditional {
  const s11 = sigma[0]?.[0] ?? 1;
  const s12 = sigma[0]?.[1] ?? 0;
  const s22 = sigma[1]?.[1] ?? 1;
  return {
    mean: (mu[1] ?? 0) + (s12 / s11) * (x1 - (mu[0] ?? 0)),
    variance: s22 - (s12 * s12) / s11,
  };
}

/** Density of the multivariate t with nu degrees of freedom, location mu and scale Sigma. */
export function mvtPdf(x: Vector, mu: Vector, sigma: Matrix, nu: number): number {
  const d = mu.length;
  const logNormalizer =
    logGamma((nu + d) / 2) -
    logGamma(nu / 2) -
    (d / 2) * Math.log(nu * Math.PI) -
    0.5 * Math.log(determinant(sigma));
  return Math.exp(logNormalizer - ((nu + d) / 2) * Math.log1p(mahalanobis2(x, mu, sigma) / nu));
}

/** One draw of the multivariate t: mu + L z / sqrt(W / nu) with W chi-squared. */
export function sampleMvt(random: Random, mu: Vector, sigma: Matrix, nu: number): Vector {
  const lower = choleskyOrThrow(sigma);
  const scale = Math.sqrt(nu / random.chiSquare(nu));
  const lz = multiplyVector(
    lower,
    mu.map(() => random.normal()),
  );
  return mu.map((value, i) => value + scale * (lz[i] ?? 0));
}

/** Density of the Dirichlet distribution on the simplex. */
export function dirichletPdf(x: Vector, alpha: Vector): number {
  if (x.some((value) => value <= 0) || Math.abs(x.reduce((a, b) => a + b, 0) - 1) > 1e-9) return 0;
  const total = alpha.reduce((a, b) => a + b, 0);
  const logNormalizer = logGamma(total) - alpha.reduce((sum, a) => sum + logGamma(a), 0);
  return Math.exp(
    logNormalizer + alpha.reduce((sum, a, i) => sum + (a - 1) * Math.log(x[i] ?? 0), 0),
  );
}

/** One Dirichlet draw by normalizing independent gamma variables. */
export function sampleDirichlet(random: Random, alpha: Vector): Vector {
  const gammas = alpha.map((a) => random.gamma(a));
  const total = gammas.reduce((a, b) => a + b, 0);
  return gammas.map((value) => value / total);
}

export interface DirichletMoments {
  mean: Vector;
  variance: Vector;
}

export function dirichletMoments(alpha: Vector): DirichletMoments {
  const total = alpha.reduce((a, b) => a + b, 0);
  const mean = alpha.map((a) => a / total);
  return {
    mean,
    variance: mean.map((m) => (m * (1 - m)) / (total + 1)),
  };
}

/**
 * One Wishart draw with nu degrees of freedom and scale V, as the sum of
 * nu outer products x x^T with x ~ N(0, V). Integer nu keeps the
 * construction visible; nu must be at least the dimension.
 */
export function sampleWishart(random: Random, nu: number, scale: Matrix): Matrix {
  const d = scale.length;
  const total = zeros(d, d);
  for (let k = 0; k < Math.round(nu); k += 1) {
    const x = sampleMvn(random, new Array<number>(d).fill(0), scale);
    for (let i = 0; i < d; i += 1) {
      const row = total[i] as number[];
      for (let j = 0; j < d; j += 1) row[j] = (row[j] ?? 0) + (x[i] ?? 0) * (x[j] ?? 0);
    }
  }
  return total;
}

/** Inverse Wishart draw: the inverse of a Wishart with scale Psi^{-1}. */
export function sampleInverseWishart(random: Random, nu: number, psi: Matrix): Matrix {
  const psiInverse = inverse(psi);
  if (!psiInverse) throw new Error('The scale matrix must be invertible.');
  const w = inverse(sampleWishart(random, nu, psiInverse));
  if (!w) throw new Error('The Wishart draw was singular.');
  return w;
}

/** Mean of the Wishart, nu V. */
export function wishartMean(nu: number, scale: Matrix): Matrix {
  return scale.map((row) => row.map((value) => nu * value));
}

/** Mean of the inverse Wishart, Psi / (nu - d - 1), defined for nu > d + 1. */
export function inverseWishartMean(nu: number, psi: Matrix): Matrix | null {
  const d = psi.length;
  if (nu <= d + 1) return null;
  return psi.map((row) => row.map((value) => value / (nu - d - 1)));
}

/**
 * LKJ correlation matrix of dimension d with concentration eta, sampled by
 * the C-vine method: partial correlations at tree level k are
 * Beta(b_k, b_k) on (-1, 1) with b_k = eta + (d - 2 - k)/2, then converted
 * to correlations with the recursion of Lewandowski, Kurowicka and Joe.
 */
export function sampleLkj(random: Random, d: number, eta: number): Matrix {
  const partial = zeros(d, d);
  const corr = zeros(d, d);
  for (let i = 0; i < d; i += 1) (corr[i] as number[])[i] = 1;
  for (let k = 0; k < d - 1; k += 1) {
    const b = eta + (d - 2 - k) / 2;
    for (let j = k + 1; j < d; j += 1) {
      const value = 2 * random.beta(b, b) - 1;
      (partial[k] as number[])[j] = value;
      let r = value;
      for (let l = k - 1; l >= 0; l -= 1) {
        const pk = partial[l]?.[k] ?? 0;
        const pj = partial[l]?.[j] ?? 0;
        r = r * Math.sqrt((1 - pk * pk) * (1 - pj * pj)) + pk * pj;
      }
      (corr[k] as number[])[j] = r;
      (corr[j] as number[])[k] = r;
    }
  }
  return corr;
}

/** Shape b of the Beta(b, b) on (-1, 1) that each LKJ correlation follows: eta - 1 + d/2. */
export function lkjMarginalShape(d: number, eta: number): number {
  return eta - 1 + d / 2;
}

/** Density of a single correlation of an LKJ(eta) matrix of dimension d. */
export function lkjMarginalPdf(r: number, d: number, eta: number): number {
  if (r <= -1 || r >= 1) return 0;
  const b = lkjMarginalShape(d, eta);
  const logBeta = 2 * logGamma(b) - logGamma(2 * b);
  return Math.exp((b - 1) * Math.log((1 - r * r) / 4) - logBeta) / 2;
}

/** Sample covariance matrix of a set of vectors, dividing by n - 1. */
export function sampleCovariance(points: readonly Vector[]): Matrix {
  const n = points.length;
  const d = points[0]?.length ?? 0;
  const mean = new Array<number>(d).fill(0);
  for (const p of points) for (let i = 0; i < d; i += 1) mean[i] = (mean[i] ?? 0) + (p[i] ?? 0) / n;
  const centered = points.map((p) => p.map((value, i) => value - (mean[i] ?? 0)));
  const product = multiply(transpose(centered), centered);
  return product.map((row) => row.map((value) => value / Math.max(1, n - 1)));
}
