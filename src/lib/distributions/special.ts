/* eslint-disable no-loss-of-precision -- Published coefficients (Lanczos, AS241) are kept verbatim; digits beyond double precision round harmlessly. */
/**
 * Special functions used by the distributions. Implementations follow the
 * standard references (Lanczos for the gamma function, series and Lentz
 * continued fractions for incomplete gamma and beta, Wichura's AS241 for the
 * normal quantile) and are accurate to roughly 1e-13 in the tested ranges.
 */

const LANCZOS_G = 7;
const LANCZOS_COEFFICIENTS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
  1.5056327351493116e-7,
];

const EPSILON = 1e-15;
const TINY = 1e-300;
const MAX_ITERATIONS = 500;

/** Natural logarithm of the absolute value of the gamma function. */
export function logGamma(x: number): number {
  if (x < 0.5) {
    // Reflection formula: Gamma(x) Gamma(1 - x) = pi / sin(pi x).
    return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - logGamma(1 - x);
  }
  const z = x - 1;
  let sum = LANCZOS_COEFFICIENTS[0] ?? 0;
  for (let i = 1; i < LANCZOS_G + 2; i += 1) {
    sum += (LANCZOS_COEFFICIENTS[i] ?? 0) / (z + i);
  }
  const t = z + LANCZOS_G + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(sum);
}

export function gammaFunction(x: number): number {
  if (Number.isInteger(x) && x <= 0) return Number.NaN;
  if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gammaFunction(1 - x));
  if (Number.isInteger(x) && x <= 171) {
    let result = 1;
    for (let i = 2; i < x; i += 1) result *= i;
    return result;
  }
  return Math.exp(logGamma(x));
}

export function logBeta(a: number, b: number): number {
  return logGamma(a) + logGamma(b) - logGamma(a + b);
}

export function betaFunction(a: number, b: number): number {
  return Math.exp(logBeta(a, b));
}

/** log(n!) with exact values for small n. */
export function logFactorial(n: number): number {
  if (n < 0) return Number.NaN;
  if (n < 2) return 0;
  return logGamma(n + 1);
}

export function logChoose(n: number, k: number): number {
  if (k < 0 || k > n) return Number.NEGATIVE_INFINITY;
  return logFactorial(n) - logFactorial(k) - logFactorial(n - k);
}

/** Binomial coefficient, exact for results below 2^53. */
export function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  const m = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= m; i += 1) {
    result = (result * (n - m + i)) / i;
  }
  return Math.round(result);
}

function lowerGammaSeries(a: number, x: number): number {
  let term = 1 / a;
  let sum = term;
  for (let n = 1; n < MAX_ITERATIONS; n += 1) {
    term *= x / (a + n);
    sum += term;
    if (Math.abs(term) < Math.abs(sum) * EPSILON) break;
  }
  return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
}

function upperGammaFraction(a: number, x: number): number {
  let b = x + 1 - a;
  let c = 1 / TINY;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < MAX_ITERATIONS; i += 1) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < TINY) d = TINY;
    c = b + an / c;
    if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < EPSILON) break;
  }
  return Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
}

/** Regularized lower incomplete gamma function P(a, x). */
export function regularizedGammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  if (!Number.isFinite(x)) return 1;
  return x < a + 1 ? lowerGammaSeries(a, x) : 1 - upperGammaFraction(a, x);
}

/** Regularized upper incomplete gamma function Q(a, x) = 1 - P(a, x). */
export function regularizedGammaQ(a: number, x: number): number {
  if (x <= 0) return 1;
  if (!Number.isFinite(x)) return 0;
  return x < a + 1 ? 1 - lowerGammaSeries(a, x) : upperGammaFraction(a, x);
}

function betaFraction(a: number, b: number, x: number): number {
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < TINY) d = TINY;
  d = 1 / d;
  let h = d;
  for (let m = 1; m < MAX_ITERATIONS; m += 1) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < TINY) d = TINY;
    c = 1 + aa / c;
    if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < TINY) d = TINY;
    c = 1 + aa / c;
    if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < EPSILON) break;
  }
  return h;
}

/** Regularized incomplete beta function I_x(a, b). */
export function regularizedBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const front = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - logBeta(a, b));
  // The continued fraction converges fastest when x < (a + 1) / (a + b + 2).
  if (x < (a + 1) / (a + b + 2)) return (front * betaFraction(a, b, x)) / a;
  return 1 - (front * betaFraction(b, a, 1 - x)) / b;
}

export function erf(x: number): number {
  if (x === 0) return 0;
  const value = regularizedGammaP(0.5, x * x);
  return x > 0 ? value : -value;
}

export function erfc(x: number): number {
  if (x < 0) return 1 + regularizedGammaP(0.5, x * x);
  return regularizedGammaQ(0.5, x * x);
}

/** Standard normal cumulative distribution function. */
export function standardNormalCdf(z: number): number {
  return 0.5 * erfc(-z / Math.SQRT2);
}

/**
 * Standard normal quantile by Wichura's algorithm AS241 (PPND16), with
 * relative accuracy near 1e-16 across (0, 1).
 */
export function standardNormalQuantile(p: number): number {
  if (p <= 0) return Number.NEGATIVE_INFINITY;
  if (p >= 1) return Number.POSITIVE_INFINITY;
  const q = p - 0.5;
  if (Math.abs(q) <= 0.425) {
    const r = 0.180625 - q * q;
    return (
      (q *
        (((((((r * 2509.0809287301226727 + 33430.575583588128105) * r + 67265.770927008700853) * r +
          45921.953931549871457) *
          r +
          13731.693765509461125) *
          r +
          1971.5909503065514427) *
          r +
          133.14166789178437745) *
          r +
          3.387132872796366608)) /
      (((((((r * 5226.495278852545925 + 28729.085735721942674) * r + 39307.89580009271061) * r +
        21213.794301586595867) *
        r +
        5394.1960214247511077) *
        r +
        687.1870074920579083) *
        r +
        42.313330701600911252) *
        r +
        1)
    );
  }
  let r = q < 0 ? p : 1 - p;
  r = Math.sqrt(-Math.log(r));
  let value: number;
  if (r <= 5) {
    r -= 1.6;
    value =
      (((((((r * 7.7454501427834140764e-4 + 0.0227238449892691845833) * r +
        0.24178072517745061177) *
        r +
        1.27045825245236838258) *
        r +
        3.64784832476320460504) *
        r +
        5.7694972214606914055) *
        r +
        4.6303378461565452959) *
        r +
        1.42343711074968357734) /
      (((((((r * 1.05075007164441684324e-9 + 5.475938084995344946e-4) * r +
        0.0151986665636164571966) *
        r +
        0.14810397642748007459) *
        r +
        0.68976733498510000455) *
        r +
        1.6763848301838038494) *
        r +
        2.05319162663775882187) *
        r +
        1);
  } else {
    r -= 5;
    value =
      (((((((r * 2.01033439929228813265e-7 + 2.71155556874348757815e-5) * r +
        0.0012426609473880784386) *
        r +
        0.026532189526576123093) *
        r +
        0.29656057182850489123) *
        r +
        1.7848265399172913358) *
        r +
        5.4637849111641143699) *
        r +
        6.6579046435011037772) /
      (((((((r * 2.04426310338993978564e-15 + 1.4215117583164458887e-7) * r +
        1.8463183175100546818e-5) *
        r +
        7.868691311456132591e-4) *
        r +
        0.0148753612908506148525) *
        r +
        0.13692988092273580531) *
        r +
        0.59983220655588793769) *
        r +
        1);
  }
  return q < 0 ? -value : value;
}

/**
 * Finds x with f(x) = target for a nondecreasing f on [lo, hi] by bisection.
 * Robust for any cumulative distribution; used where no closed-form quantile
 * exists. Infinite bounds are expanded until they bracket the target.
 */
export function invertMonotone(
  f: (x: number) => number,
  target: number,
  lo: number,
  hi: number,
  tolerance = 1e-12,
): number {
  let low = Number.isFinite(lo) ? lo : Math.min(-1, Number.isFinite(hi) ? hi - 1 : -1);
  let high = Number.isFinite(hi) ? hi : Math.max(1, low + 1);
  if (!Number.isFinite(lo)) {
    let step = 1;
    while (f(low) > target) {
      low -= step;
      step *= 2;
    }
  }
  if (!Number.isFinite(hi)) {
    let step = 1;
    while (f(high) < target) {
      high += step;
      step *= 2;
    }
  }
  for (let i = 0; i < 200; i += 1) {
    const middle = (low + high) / 2;
    if (f(middle) < target) low = middle;
    else high = middle;
    if (high - low <= tolerance * Math.max(1, Math.abs(middle))) break;
  }
  return (low + high) / 2;
}
