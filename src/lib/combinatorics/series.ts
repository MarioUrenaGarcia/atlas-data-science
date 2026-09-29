import { factorial } from './counting.ts';

/** Product of two polynomials given by coefficient lists, truncated to degree `maxDegree`. */
export function polynomialProduct(
  a: readonly number[],
  b: readonly number[],
  maxDegree = a.length + b.length - 2,
): number[] {
  const result = Array.from({ length: maxDegree + 1 }, () => 0);
  a.forEach((x, i) => {
    b.forEach((y, j) => {
      if (i + j <= maxDegree) result[i + j] = (result[i + j] ?? 0) + x * y;
    });
  });
  return result;
}

/**
 * Coefficients of the ordinary generating function of one part size used any
 * number of times (up to `maxCopies`): 1 + x^s + x^(2s) + ...
 */
export function partFactor(
  size: number,
  maxDegree: number,
  maxCopies = Number.POSITIVE_INFINITY,
): number[] {
  return Array.from({ length: maxDegree + 1 }, (_, degree) =>
    degree % size === 0 && degree / size <= maxCopies ? 1 : 0,
  );
}

/**
 * Successive partial products of the factors for each part size. Entry i holds
 * the coefficients after multiplying the first i + 1 factors, so coefficient n
 * counts the ways to reach total n with those sizes.
 */
export function ordinaryProducts(
  sizes: readonly number[],
  maxDegree: number,
  maxCopies?: number,
): number[][] {
  const steps: number[][] = [];
  let current = [1, ...Array.from({ length: maxDegree }, () => 0)];
  for (const size of sizes) {
    current = polynomialProduct(current, partFactor(size, maxDegree, maxCopies), maxDegree);
    steps.push(current);
  }
  return steps;
}

/**
 * Product of exponential generating functions given by their counts a_n
 * (not divided by n!). The result counts labelled structures split into two
 * parts: c_n = sum_k C(n, k) a_k b_(n - k).
 */
export function exponentialProduct(
  a: readonly number[],
  b: readonly number[],
  maxDegree: number,
): number[] {
  return Array.from({ length: maxDegree + 1 }, (_, n) => {
    let total = 0;
    for (let k = 0; k <= n; k += 1) {
      total += (factorial(n) / (factorial(k) * factorial(n - k))) * (a[k] ?? 0) * (b[n - k] ?? 0);
    }
    return total;
  });
}

/** Terms a_0 .. a_(count - 1) of a_n = c_1 a_(n - 1) + ... + c_d a_(n - d) with the given initial values. */
export function linearRecurrence(
  coefficients: readonly number[],
  initial: readonly number[],
  count: number,
): number[] {
  const terms = initial.slice(0, count);
  for (let n = terms.length; n < count; n += 1) {
    let value = 0;
    coefficients.forEach((c, index) => {
      value += c * (terms[n - 1 - index] ?? 0);
    });
    terms.push(value);
  }
  return terms;
}

export interface Complex {
  re: number;
  im: number;
}

/** Roots of the characteristic equation r^2 = c1 r + c2 of a second-order recurrence. */
export function characteristicRoots(c1: number, c2: number): [Complex, Complex] {
  const discriminant = c1 * c1 + 4 * c2;
  if (discriminant >= 0) {
    const root = Math.sqrt(discriminant);
    return [
      { re: (c1 + root) / 2, im: 0 },
      { re: (c1 - root) / 2, im: 0 },
    ];
  }
  const imaginary = Math.sqrt(-discriminant) / 2;
  return [
    { re: c1 / 2, im: imaginary },
    { re: c1 / 2, im: -imaginary },
  ];
}

export function modulus(z: Complex): number {
  return Math.hypot(z.re, z.im);
}

/**
 * Closed form of a second-order recurrence evaluated at n. With distinct real
 * roots a_n = A r1^n + B r2^n; with a double root a_n = (A + B n) r^n; with
 * complex roots a_n = rho^n (A cos(n theta) + B sin(n theta)). A and B are
 * fitted to a_0 and a_1.
 */
export function secondOrderClosedForm(
  c1: number,
  c2: number,
  a0: number,
  a1: number,
): (n: number) => number {
  const [r1, r2] = characteristicRoots(c1, c2);
  const TOLERANCE = 1e-12;
  if (r1.im !== 0) {
    const rho = modulus(r1);
    const theta = Math.atan2(r1.im, r1.re);
    const a = a0;
    const b = (a1 / rho - a * Math.cos(theta)) / Math.sin(theta);
    return (n) => rho ** n * (a * Math.cos(n * theta) + b * Math.sin(n * theta));
  }
  if (Math.abs(r1.re - r2.re) < TOLERANCE) {
    const r = r1.re;
    if (r === 0) return (n) => (n === 0 ? a0 : n === 1 ? a1 : 0);
    const a = a0;
    const b = a1 / r - a0;
    return (n) => (a + b * n) * r ** n;
  }
  const b = (a1 - r1.re * a0) / (r2.re - r1.re);
  const a = a0 - b;
  return (n) => a * r1.re ** n + b * r2.re ** n;
}
