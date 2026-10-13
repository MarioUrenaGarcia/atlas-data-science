import type { Random } from '../random/index.ts';
import {
  gammaFunction,
  invertMonotone,
  logBeta,
  logChoose,
  logFactorial,
  logGamma,
  regularizedGammaP,
  regularizedGammaQ,
  standardNormalCdf,
  standardNormalQuantile,
} from './special.ts';
import type { ContinuousDistribution } from './types.ts';

function check(condition: boolean, message: string): void {
  if (!condition) throw new RangeError(message);
}

const SQRT_2PI = Math.sqrt(2 * Math.PI);
const standardNormalPdf = (z: number) => Math.exp(-0.5 * z * z) / SQRT_2PI;

/** Composite Simpson rule with an even number of panels. */
export function simpsonIntegral(
  f: (x: number) => number,
  a: number,
  b: number,
  panels = 400,
): number {
  const n = panels % 2 === 0 ? panels : panels + 1;
  const h = (b - a) / n;
  let total = f(a) + f(b);
  for (let i = 1; i < n; i += 1) total += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  return (total * h) / 3;
}

/** Below this argument the power series of the Bessel functions is used; above it, the asymptotic expansion. */
const BESSEL_SERIES_LIMIT = 15;

/** e^(-z) I_nu(z) for nu = 0 or 1 and z >= 0, scaled so large arguments do not overflow. */
export function besselIScaled(order: 0 | 1, z: number): number {
  const x = Math.abs(z);
  if (x <= BESSEL_SERIES_LIMIT) {
    let term = order === 0 ? 1 : x / 2;
    let total = term;
    const quarter = (x * x) / 4;
    for (let m = 1; m < 200; m += 1) {
      term *= quarter / (m * (m + order));
      total += term;
      if (term < total * 1e-17) break;
    }
    const value = total * Math.exp(-x);
    return order === 1 && z < 0 ? -value : value;
  }
  // Asymptotic expansion I_nu(x) ~ e^x / sqrt(2 pi x) * sum of (-1)^k a_k(nu) / x^k.
  const mu = 4 * order * order;
  let term = 1;
  let total = 1;
  for (let k = 1; k < 12; k += 1) {
    term *= -(mu - (2 * k - 1) ** 2) / (k * 8 * x);
    total += term;
  }
  const value = total / Math.sqrt(2 * Math.PI * x);
  return order === 1 && z < 0 ? -value : value;
}

export function besselI(order: 0 | 1, z: number): number {
  return besselIScaled(order, z) * Math.exp(Math.abs(z));
}

/** Distribution built from a density on a finite or infinite interval, with numerical cdf and quantile. */
function fromDensity(options: {
  name: string;
  support: readonly [number, number];
  pdf: (x: number) => number;
  cdf: (x: number) => number;
  mean: number;
  variance: number;
  sample: (random: Random) => number;
}): ContinuousDistribution {
  const { support, cdf } = options;
  return {
    kind: 'continuous',
    name: options.name,
    mean: options.mean,
    variance: options.variance,
    support: [support[0], support[1]],
    pdf: options.pdf,
    cdf,
    quantile: (p) => invertMonotone(cdf, p, support[0], support[1], 1e-10),
    sample: options.sample,
  };
}

/** Frechet (type II extreme value) distribution with shape alpha, scale s and location m. */
export function frechet(alpha: number, scale = 1, location = 0): ContinuousDistribution {
  check(alpha > 0 && scale > 0, 'alpha and scale must be positive');
  const cdf = (x: number) => (x <= location ? 0 : Math.exp(-(((x - location) / scale) ** -alpha)));
  const mean =
    alpha > 1 ? location + scale * gammaFunction(1 - 1 / alpha) : Number.POSITIVE_INFINITY;
  const variance =
    alpha > 2
      ? scale * scale * (gammaFunction(1 - 2 / alpha) - gammaFunction(1 - 1 / alpha) ** 2)
      : Number.POSITIVE_INFINITY;
  const quantile = (p: number) => location + scale * (-Math.log(p)) ** (-1 / alpha);
  return {
    kind: 'continuous',
    name: 'Fréchet',
    mean,
    variance,
    support: [location, Number.POSITIVE_INFINITY],
    pdf: (x) => {
      if (x <= location) return 0;
      const z = (x - location) / scale;
      return (alpha / scale) * z ** (-1 - alpha) * Math.exp(-(z ** -alpha));
    },
    cdf,
    quantile,
    sample: (random) => quantile(1 - random.next()),
  };
}

/** Rice distribution: length of a 2D normal vector with mean length nu and per-axis sd sigma. */
export function rice(nu: number, sigma = 1): ContinuousDistribution {
  check(nu >= 0 && sigma > 0, 'nu must be nonnegative and sigma positive');
  const s2 = sigma * sigma;
  const pdf = (x: number) => {
    if (x <= 0) return 0;
    const z = (x * nu) / s2;
    // I0(z) e^{-(x^2 + nu^2)/2s^2} written with the scaled Bessel function to avoid overflow.
    return (x / s2) * Math.exp(-((x - nu) ** 2) / (2 * s2)) * besselIScaled(0, z);
  };
  const upper = nu + 12 * sigma;
  const cdf = (x: number) =>
    x <= 0 ? 0 : Math.min(1, simpsonIntegral(pdf, 0, Math.min(x, upper), 600));
  const half = -(nu * nu) / (2 * s2);
  // Laguerre polynomial L_{1/2}(t) = e^{t/2}[(1 - t) I0(-t/2) - t I1(-t/2)], evaluated with scaled Bessels.
  const laguerre = (1 - half) * besselIScaled(0, -half / 2) - half * besselIScaled(1, -half / 2);
  const mean = sigma * Math.sqrt(Math.PI / 2) * laguerre;
  return fromDensity({
    name: 'Rice',
    support: [0, Number.POSITIVE_INFINITY],
    pdf,
    cdf,
    mean,
    variance: 2 * s2 + nu * nu - mean * mean,
    sample: (random) => Math.hypot(random.normal(nu, sigma), random.normal(0, sigma)),
  });
}

/** Von Mises distribution on the circle, represented on [mu - pi, mu + pi]. */
export function vonMises(mu: number, kappa: number): ContinuousDistribution {
  check(kappa >= 0, 'kappa must be nonnegative');
  const normalizer = 2 * Math.PI * besselIScaled(0, kappa);
  const pdf = (x: number) =>
    x < mu - Math.PI || x > mu + Math.PI
      ? 0
      : Math.exp(kappa * (Math.cos(x - mu) - 1)) / normalizer;
  const cdf = (x: number) =>
    x <= mu - Math.PI
      ? 0
      : x >= mu + Math.PI
        ? 1
        : Math.min(1, simpsonIntegral(pdf, mu - Math.PI, x, 400));
  const variance = simpsonIntegral((x) => (x - mu) ** 2 * pdf(x), mu - Math.PI, mu + Math.PI, 800);
  return fromDensity({
    name: 'Von Mises',
    support: [mu - Math.PI, mu + Math.PI],
    pdf,
    cdf,
    mean: mu,
    variance,
    sample: (random) => {
      if (kappa < 1e-8) return mu + random.uniform(-Math.PI, Math.PI);
      // Best and Fisher (1979) rejection algorithm.
      const tau = 1 + Math.sqrt(1 + 4 * kappa * kappa);
      const rho = (tau - Math.sqrt(2 * tau)) / (2 * kappa);
      const r = (1 + rho * rho) / (2 * rho);
      for (;;) {
        const z = Math.cos(Math.PI * random.next());
        const f = (1 + r * z) / (r + z);
        const c = kappa * (r - f);
        const u = random.next();
        if (c * (2 - c) - u > 0 || Math.log(c / u) + 1 - c >= 0) {
          const angle = Math.acos(Math.max(-1, Math.min(1, f)));
          return mu + (random.next() < 0.5 ? -angle : angle);
        }
      }
    },
  });
}

/** Mean circular resultant length E[cos(X - mu)] = I1(kappa)/I0(kappa) of a von Mises variable. */
export function vonMisesConcentration(kappa: number): number {
  return kappa === 0 ? 0 : besselIScaled(1, kappa) / besselIScaled(0, kappa);
}

/** Normal(mu, sigma^2) restricted to [a, b] and renormalized. */
export function truncatedNormal(
  mu: number,
  sigma: number,
  a: number,
  b: number,
): ContinuousDistribution {
  check(sigma > 0 && b > a, 'sigma must be positive and b > a');
  const alpha = (a - mu) / sigma;
  const beta = (b - mu) / sigma;
  const phiA = Number.isFinite(alpha) ? standardNormalPdf(alpha) : 0;
  const phiB = Number.isFinite(beta) ? standardNormalPdf(beta) : 0;
  const cdfA = standardNormalCdf(alpha);
  const mass = standardNormalCdf(beta) - cdfA;
  check(mass > 0, 'the interval has no probability');
  const aTerm = Number.isFinite(alpha) ? alpha * phiA : 0;
  const bTerm = Number.isFinite(beta) ? beta * phiB : 0;
  const ratio = (phiA - phiB) / mass;
  const cdf = (x: number) =>
    x <= a ? 0 : x >= b ? 1 : (standardNormalCdf((x - mu) / sigma) - cdfA) / mass;
  const quantile = (p: number) => mu + sigma * standardNormalQuantile(cdfA + p * mass);
  return {
    kind: 'continuous',
    name: 'Normal truncada',
    mean: mu + sigma * ratio,
    variance: sigma * sigma * (1 + (aTerm - bTerm) / mass - ratio * ratio),
    support: [a, b],
    pdf: (x) => (x < a || x > b ? 0 : standardNormalPdf((x - mu) / sigma) / (sigma * mass)),
    cdf,
    quantile,
    sample: (random) => quantile(random.next()),
  };
}

/** Skew-normal distribution of Azzalini with location xi, scale omega and shape alpha. */
export function skewNormal(xi: number, omega: number, alpha: number): ContinuousDistribution {
  check(omega > 0, 'omega must be positive');
  const delta = alpha / Math.sqrt(1 + alpha * alpha);
  const pdf = (x: number) => {
    const z = (x - xi) / omega;
    return (2 / omega) * standardNormalPdf(z) * standardNormalCdf(alpha * z);
  };
  const lower = xi - 10 * omega;
  const cdf = (x: number) =>
    x <= lower ? 0 : Math.min(1, simpsonIntegral(pdf, lower, Math.min(x, xi + 10 * omega), 600));
  const mean = xi + omega * delta * Math.sqrt(2 / Math.PI);
  return fromDensity({
    name: 'Normal asimétrica',
    support: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
    pdf,
    cdf,
    mean,
    variance: omega * omega * (1 - (2 * delta * delta) / Math.PI),
    sample: (random) => {
      const u0 = Math.abs(random.normal());
      const u1 = random.normal();
      return xi + omega * (delta * u0 + Math.sqrt(1 - delta * delta) * u1);
    },
  });
}

/** Inverse gamma: 1/Y with Y ~ Gamma(alpha, rate beta). */
export function inverseGamma(alpha: number, beta: number): ContinuousDistribution {
  check(alpha > 0 && beta > 0, 'alpha and beta must be positive');
  const logNormalizer = alpha * Math.log(beta) - logGamma(alpha);
  const cdf = (x: number) => (x <= 0 ? 0 : regularizedGammaQ(alpha, beta / x));
  return {
    kind: 'continuous',
    name: 'Gamma inversa',
    mean: alpha > 1 ? beta / (alpha - 1) : Number.POSITIVE_INFINITY,
    variance:
      alpha > 2 ? (beta * beta) / ((alpha - 1) ** 2 * (alpha - 2)) : Number.POSITIVE_INFINITY,
    support: [0, Number.POSITIVE_INFINITY],
    pdf: (x) => (x <= 0 ? 0 : Math.exp(logNormalizer - (alpha + 1) * Math.log(x) - beta / x)),
    cdf,
    quantile: (p) => invertMonotone(cdf, p, 0, Number.POSITIVE_INFINITY),
    sample: (random) => beta / random.gamma(alpha, 1),
  };
}

/** Terms of the Poisson mixture kept for noncentral distributions. */
const POISSON_TERMS = 400;

/** Noncentral chi-square with k degrees of freedom and noncentrality lambda, as a Poisson mixture. */
export function noncentralChiSquare(k: number, lambda: number): ContinuousDistribution {
  check(k > 0 && lambda >= 0, 'k must be positive and lambda nonnegative');
  const half = lambda / 2;
  const weight = (j: number) =>
    half === 0 ? (j === 0 ? 1 : 0) : Math.exp(-half + j * Math.log(half) - logFactorial(j));
  const center = Math.floor(half);
  const first = Math.max(0, center - POISSON_TERMS / 2);
  const last = center + POISSON_TERMS / 2;
  const pdf = (x: number) => {
    if (x <= 0) return 0;
    let total = 0;
    for (let j = first; j <= last; j += 1) {
      const w = weight(j);
      if (w < 1e-300) continue;
      const shape = k / 2 + j;
      total += w * Math.exp((shape - 1) * Math.log(x) - x / 2 - shape * Math.LN2 - logGamma(shape));
    }
    return total;
  };
  const cdf = (x: number) => {
    if (x <= 0) return 0;
    let total = 0;
    for (let j = first; j <= last; j += 1) {
      const w = weight(j);
      if (w < 1e-300) continue;
      total += w * regularizedGammaP(k / 2 + j, x / 2);
    }
    return Math.min(1, total);
  };
  return fromDensity({
    name: 'Chi-cuadrada no central',
    support: [0, Number.POSITIVE_INFINITY],
    pdf,
    cdf,
    mean: k + lambda,
    variance: 2 * (k + 2 * lambda),
    sample: (random) => random.chiSquare(k + 2 * random.poisson(Math.max(half, 1e-12))),
  });
}

/** Noncentral t: (Z + mu) / sqrt(V / nu) with Z normal and V chi-square with nu degrees of freedom. */
export function noncentralT(nu: number, mu: number): ContinuousDistribution {
  check(nu > 0, 'nu must be positive');
  // Integrals over V use u = V / nu, whose density is Gamma(nu/2, rate nu/2).
  const shape = nu / 2;
  const logNormalizer = shape * Math.log(shape) - logGamma(shape);
  const uDensity = (u: number) =>
    u <= 0 ? 0 : Math.exp(logNormalizer + (shape - 1) * Math.log(u) - shape * u);
  const uMax = 1 + 14 / Math.sqrt(shape) + 20 / nu;
  const panels = 800;
  const pdf = (t: number) =>
    simpsonIntegral(
      (u) => {
        const root = Math.sqrt(u);
        return uDensity(u) * root * standardNormalPdf(t * root - mu);
      },
      0,
      uMax,
      panels,
    );
  const cdf = (t: number) =>
    simpsonIntegral((u) => uDensity(u) * standardNormalCdf(t * Math.sqrt(u) - mu), 0, uMax, panels);
  const factor =
    nu > 1 ? Math.sqrt(nu / 2) * Math.exp(logGamma((nu - 1) / 2) - logGamma(nu / 2)) : 0;
  const mean = nu > 1 ? mu * factor : Number.NaN;
  return fromDensity({
    name: 't no central',
    support: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
    pdf,
    cdf,
    mean,
    variance: nu > 2 ? (nu * (1 + mu * mu)) / (nu - 2) - mean * mean : Number.POSITIVE_INFINITY,
    sample: (random) => (random.normal() + mu) / Math.sqrt(random.chiSquare(nu) / nu),
  });
}

/** Kumaraswamy distribution on [0, 1] with cdf 1 - (1 - x^a)^b. */
export function kumaraswamy(a: number, b: number): ContinuousDistribution {
  check(a > 0 && b > 0, 'a and b must be positive');
  const moment = (n: number) => b * Math.exp(logBeta(1 + n / a, b));
  const mean = moment(1);
  const quantile = (p: number) => (1 - (1 - p) ** (1 / b)) ** (1 / a);
  return {
    kind: 'continuous',
    name: 'Kumaraswamy',
    mean,
    variance: moment(2) - mean * mean,
    support: [0, 1],
    pdf: (x) => (x <= 0 || x >= 1 ? 0 : a * b * x ** (a - 1) * (1 - x ** a) ** (b - 1)),
    cdf: (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - (1 - x ** a) ** b),
    quantile,
    sample: (random) => quantile(random.next()),
  };
}

/** Levy distribution with location mu and scale c: mu + c / Z^2 with Z standard normal. */
export function levy(mu: number, c: number): ContinuousDistribution {
  check(c > 0, 'c must be positive');
  const quantile = (p: number) => mu + c / standardNormalQuantile(1 - p / 2) ** 2;
  return {
    kind: 'continuous',
    name: 'Lévy',
    mean: Number.POSITIVE_INFINITY,
    variance: Number.POSITIVE_INFINITY,
    support: [mu, Number.POSITIVE_INFINITY],
    pdf: (x) => {
      if (x <= mu) return 0;
      const d = x - mu;
      return (Math.sqrt(c / (2 * Math.PI)) * Math.exp(-c / (2 * d))) / d ** 1.5;
    },
    cdf: (x) => (x <= mu ? 0 : 2 * (1 - standardNormalCdf(Math.sqrt(c / (x - mu))))),
    quantile,
    sample: (random) => mu + c / random.normal() ** 2,
  };
}

/** Exponent of exp(-(gamma t)^alpha) below which the stable characteristic function is negligible. */
const STABLE_TAIL = 36;

/**
 * Alpha-stable distribution in the parametrization whose characteristic
 * function is exp(i delta t - |gamma t|^alpha (1 - i beta sign(t) tan(pi alpha / 2)))
 * for alpha != 1 (with the logarithmic correction for alpha = 1). The density
 * and the cdf come from Fourier inversion with the Gil-Pelaez formula.
 */
export function stable(
  alpha: number,
  beta: number,
  scale = 1,
  location = 0,
): ContinuousDistribution {
  check(
    alpha > 0 && alpha <= 2 && beta >= -1 && beta <= 1 && scale > 0,
    'invalid stable parameters',
  );
  const isOne = Math.abs(alpha - 1) < 1e-9;
  const tangent = isOne ? 0 : Math.tan((Math.PI * alpha) / 2);
  const tMax = STABLE_TAIL ** (1 / alpha) / scale;
  const phase = (t: number, x: number) =>
    isOne
      ? t * (location - x) - (t > 0 ? (beta * 2 * scale * t * Math.log(t)) / Math.PI : 0)
      : t * (location - x) + beta * (scale * t) ** alpha * tangent;
  const panels = (x: number) =>
    Math.min(60000, Math.max(600, Math.ceil(tMax * (Math.abs(x - location) + 2 * scale) * 6)));
  // For alpha < 1, exp(-t^alpha) has an infinite slope at 0; with t = s^(1/alpha) the integrand is smooth.
  const power = alpha < 1 ? 1 / alpha : 1;
  const sMax = tMax ** (1 / power);
  const overT = (g: (t: number) => number, x: number) =>
    simpsonIntegral(
      (s) => g(s ** power) * power * s ** (power - 1),
      // Starting just above 0 evaluates the finite limits of the integrands without special cases.
      1e-10,
      sMax,
      panels(x),
    );
  const pdf = (x: number) =>
    Math.max(
      0,
      overT((t) => Math.exp(-((scale * t) ** alpha)) * Math.cos(phase(t, x)), x) / Math.PI,
    );
  // Gil-Pelaez: F(x) = 1/2 - (1/pi) int_0^inf Im[e^{-itx} phi(t)] / t dt; the integrand is finite at 0+.
  const cdf = (x: number) => {
    const value = overT((t) => (Math.exp(-((scale * t) ** alpha)) * Math.sin(phase(t, x))) / t, x);
    return Math.min(1, Math.max(0, 0.5 - value / Math.PI));
  };
  return {
    kind: 'continuous',
    name: 'Estable',
    mean: alpha > 1 ? location : Number.NaN,
    variance: alpha === 2 ? 2 * scale * scale : Number.POSITIVE_INFINITY,
    support:
      alpha < 1 && beta === 1
        ? [location, Number.POSITIVE_INFINITY]
        : alpha < 1 && beta === -1
          ? [Number.NEGATIVE_INFINITY, location]
          : [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
    pdf,
    cdf,
    quantile: (p) =>
      invertMonotone(cdf, p, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 1e-6),
    sample: (random) => {
      // Chambers, Mallows and Stuck (1976).
      const v = random.uniform(-Math.PI / 2, Math.PI / 2);
      const w = random.exponential(1);
      if (isOne) {
        const term =
          (Math.PI / 2 + beta * v) * Math.tan(v) -
          beta * Math.log(((Math.PI / 2) * w * Math.cos(v)) / (Math.PI / 2 + beta * v));
        return (
          location + scale * (2 / Math.PI) * term + (2 / Math.PI) * beta * scale * Math.log(scale)
        );
      }
      const b = Math.atan(beta * tangent) / alpha;
      const s = (1 + beta * beta * tangent * tangent) ** (1 / (2 * alpha));
      const x =
        ((s * Math.sin(alpha * (v + b))) / Math.cos(v) ** (1 / alpha)) *
        (Math.cos(v - alpha * (v + b)) / w) ** ((1 - alpha) / alpha);
      return location + scale * x;
    },
  };
}

/** Sum of n uniforms on [0, 1] (Irwin-Hall), exact for the moderate n used here. */
export function irwinHall(n: number): ContinuousDistribution {
  const terms = (x: number, power: number) => {
    let total = 0;
    for (let k = 0; k <= Math.min(n, Math.floor(x)); k += 1) {
      const sign = k % 2 === 0 ? 1 : -1;
      total += sign * Math.exp(logChoose(n, k) + power * Math.log(x - k));
    }
    return total;
  };
  const cdf = (x: number) =>
    x <= 0 ? 0 : x >= n ? 1 : Math.min(1, Math.max(0, terms(x, n) / Math.exp(logFactorial(n))));
  return {
    kind: 'continuous',
    name: n === 1 ? 'Uniforme' : 'Suma de uniformes',
    mean: n / 2,
    variance: n / 12,
    support: [0, n],
    pdf: (x) =>
      x <= 0 || x >= n
        ? 0
        : n === 1
          ? 1
          : Math.max(0, terms(x, n - 1) / Math.exp(logFactorial(n - 1))),
    cdf,
    quantile: (p) => invertMonotone(cdf, p, 0, n, 1e-10),
    sample: (random) => {
      let total = 0;
      for (let i = 0; i < n; i += 1) total += random.next();
      return total;
    },
  };
}

/** Constant of the generalized central limit theorem for a power tail of index alpha. */
export function stableTailConstant(alpha: number): number {
  if (Math.abs(alpha - 1) < 1e-6) return 2 / Math.PI;
  return (1 - alpha) / (gammaFunction(2 - alpha) * Math.cos((Math.PI * alpha) / 2));
}
