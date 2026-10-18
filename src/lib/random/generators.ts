/**
 * Pseudorandom generators and methods to turn uniform numbers into other
 * distributions: linear congruential generators, the Mersenne Twister,
 * randomness tests, Box-Muller, the Marsaglia polar method, rejection
 * sampling, the ziggurat, the alias method and low-discrepancy sequences.
 * These are teaching implementations; the Atlas itself draws its random
 * numbers from the generator in ./index.ts.
 */

/** Linear congruential generator x_{n+1} = (a x_n + c) mod m, exact for m up to 2^32. */
export class LinearCongruential {
  readonly a: number;
  readonly c: number;
  readonly m: number;
  private state: number;

  constructor(a: number, c: number, m: number, seed: number) {
    this.a = a;
    this.c = c;
    this.m = m;
    this.state = ((seed % m) + m) % m;
  }

  /** Next integer state in [0, m). */
  nextInt(): number {
    // BigInt keeps a x_n exact when the product exceeds 2^53.
    this.state = Number((BigInt(this.a) * BigInt(this.state) + BigInt(this.c)) % BigInt(this.m));
    return this.state;
  }

  /** Next value scaled to [0, 1). */
  next(): number {
    return this.nextInt() / this.m;
  }
}

/** IBM RANDU, x_{n+1} = 65539 x_n mod 2^31, whose triples fall on 15 planes. */
export function randu(seed: number): LinearCongruential {
  return new LinearCongruential(65539, 0, 2 ** 31, seed % 2 === 0 ? seed + 1 : seed);
}

/** Length of the cycle reached from the seed, searching at most `limit` steps. */
export function lcgPeriod(
  a: number,
  c: number,
  m: number,
  seed: number,
  limit = 100000,
): number | null {
  const generator = new LinearCongruential(a, c, m, seed);
  const seen = new Map<number, number>();
  seen.set(((seed % m) + m) % m, 0);
  for (let i = 1; i <= limit; i += 1) {
    const x = generator.nextInt();
    const first = seen.get(x);
    if (first !== undefined) return i - first;
    seen.set(x, i);
  }
  return null;
}

/** Hull-Dobell conditions for a full period m when c is not zero. */
export function hullDobell(a: number, c: number, m: number): boolean {
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
  if (c === 0 || gcd(c, m) !== 1) return false;
  const primes: number[] = [];
  let rest = m;
  for (let p = 2; p * p <= rest; p += 1) {
    if (rest % p === 0) {
      primes.push(p);
      while (rest % p === 0) rest /= p;
    }
  }
  if (rest > 1) primes.push(rest);
  if (!primes.every((p) => (a - 1) % p === 0)) return false;
  return m % 4 !== 0 || (a - 1) % 4 === 0;
}

const N = 624;
const M = 397;
const MATRIX_A = 0x9908b0df;
const UPPER = 0x80000000;
const LOWER = 0x7fffffff;

/** MT19937, the 32-bit Mersenne Twister with period 2^19937 - 1. */
export class MersenneTwister {
  private readonly mt = new Uint32Array(N);
  private index = N + 1;

  constructor(seed: number) {
    this.mt[0] = seed >>> 0;
    for (let i = 1; i < N; i += 1) {
      const previous = this.mt[i - 1] ?? 0;
      const s = previous ^ (previous >>> 30);
      // 1812433253 * s mod 2^32, split to stay exact in double precision.
      this.mt[i] =
        (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253 + i) >>>
        0;
    }
    this.index = N;
  }

  private twist(): void {
    for (let i = 0; i < N; i += 1) {
      const y = ((this.mt[i] ?? 0) & UPPER) | ((this.mt[(i + 1) % N] ?? 0) & LOWER);
      this.mt[i] = (this.mt[(i + M) % N] ?? 0) ^ (y >>> 1) ^ (y & 1 ? MATRIX_A : 0);
    }
    this.index = 0;
  }

  /** Next 32-bit unsigned integer. */
  nextInt(): number {
    if (this.index >= N) this.twist();
    let y = this.mt[this.index] ?? 0;
    this.index += 1;
    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;
    return y >>> 0;
  }

  /** Next value in [0, 1). */
  next(): number {
    return this.nextInt() / 4294967296;
  }
}

export interface ChiSquareTest {
  counts: number[];
  expected: number;
  statistic: number;
  degrees: number;
}

/** Frequency test: counts of the values in k equal bins of [0, 1) and Pearson's statistic. */
export function frequencyTest(values: readonly number[], bins: number): ChiSquareTest {
  const counts = new Array<number>(bins).fill(0);
  for (const u of values) {
    const bin = Math.min(bins - 1, Math.floor(u * bins));
    counts[bin] = (counts[bin] ?? 0) + 1;
  }
  const expected = values.length / bins;
  const statistic = counts.reduce((s, c) => s + (c - expected) ** 2 / expected, 0);
  return { counts, expected, statistic, degrees: bins - 1 };
}

export interface RunsTest {
  runs: number;
  expected: number;
  variance: number;
  z: number;
}

/** Runs up and down: number of monotone runs, compared with (2n - 1)/3 and variance (16n - 29)/90. */
export function runsUpDown(values: readonly number[]): RunsTest {
  const n = values.length;
  let runs = n > 1 ? 1 : 0;
  for (let i = 2; i < n; i += 1) {
    const before = (values[i - 1] ?? 0) - (values[i - 2] ?? 0);
    const now = (values[i] ?? 0) - (values[i - 1] ?? 0);
    if (before * now < 0) runs += 1;
  }
  const expected = (2 * n - 1) / 3;
  const variance = (16 * n - 29) / 90;
  return { runs, expected, variance, z: (runs - expected) / Math.sqrt(variance) };
}

/** Lag-one serial correlation of a sequence. */
export function serialCorrelation(values: readonly number[]): number {
  const n = values.length;
  if (n < 3) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / n;
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i += 1) {
    const d = (values[i] ?? 0) - mean;
    denominator += d * d;
    if (i + 1 < n) numerator += d * ((values[i + 1] ?? 0) - mean);
  }
  return numerator / denominator;
}

/** Box-Muller: two uniforms in (0, 1] and [0, 1) give two independent standard normals. */
export function boxMuller(u1: number, u2: number): [number, number] {
  const r = Math.sqrt(-2 * Math.log(u1));
  const theta = 2 * Math.PI * u2;
  return [r * Math.cos(theta), r * Math.sin(theta)];
}

/** Marsaglia polar method for a point (v1, v2) in the square [-1, 1]^2; null when rejected. */
export function marsagliaPolar(v1: number, v2: number): [number, number] | null {
  const s = v1 * v1 + v2 * v2;
  if (s >= 1 || s === 0) return null;
  const factor = Math.sqrt((-2 * Math.log(s)) / s);
  return [v1 * factor, v2 * factor];
}

export interface RejectionStep {
  x: number;
  /** Height u M g(x) of the proposed point. */
  y: number;
  accepted: boolean;
}

/** One rejection-sampling proposal: x from g, accepted when u M g(x) <= f(x). */
export function rejectionStep(
  x: number,
  u: number,
  target: (x: number) => number,
  proposal: (x: number) => number,
  bound: number,
): RejectionStep {
  const y = u * bound * proposal(x);
  return { x, y, accepted: y <= target(x) };
}

export interface Ziggurat {
  /** Edges r = x_0 > x_1 > ... > x_{n-1} = 0: one per layer, the last one at the peak. */
  edges: number[];
  /** Common area of every layer, base strip included. */
  area: number;
}

const halfNormal = (x: number) => Math.exp(-(x * x) / 2);

/** Upper tail integral of exp(-x^2/2) from r to infinity. */
function halfNormalTail(r: number): number {
  // sqrt(pi/2) * erfc(r / sqrt(2)), with erfc by its continued fraction for r > 0.
  const t = r / Math.SQRT2;
  let f = 0;
  for (let k = 60; k >= 1; k -= 1) f = k / 2 / (t + f);
  const erfc = Math.exp(-t * t) / Math.sqrt(Math.PI) / (t + f);
  return Math.sqrt(Math.PI / 2) * erfc;
}

/**
 * Ziggurat for the half normal with n layers of equal area: the base strip
 * (rectangle up to r plus the tail) and n - 1 rectangles stacked above. The
 * edge r is found by bisection so that the top layer closes at height 1.
 */
export function buildZiggurat(layers: number): Ziggurat {
  const tryR = (r: number) => {
    const area = r * halfNormal(r) + halfNormalTail(r);
    const edges = [r];
    let x = r;
    // The base strip and layers - 2 inner edges; the top rectangle closes at the peak.
    for (let i = 1; i < layers - 1; i += 1) {
      const y = halfNormal(x) + area / x;
      if (y >= 1) return { edges: [...edges, 0], area, overshoot: y - 1, step: i };
      x = Math.sqrt(-2 * Math.log(y));
      edges.push(x);
    }
    return {
      edges: [...edges, 0],
      area,
      overshoot: halfNormal(x) + area / x - 1,
      step: layers - 1,
    };
  };
  let lo = 0.3;
  let hi = 6;
  for (let i = 0; i < 100; i += 1) {
    const mid = (lo + hi) / 2;
    const attempt = tryR(mid);
    // A larger r leaves less area per layer, so the stack falls short of height 1.
    if (attempt.step < layers - 1 || attempt.overshoot > 0) lo = mid;
    else hi = mid;
  }
  const result = tryR(hi);
  return { edges: result.edges, area: result.area };
}

export interface AliasTable {
  probability: number[];
  alias: number[];
}

/** Vose's alias method: O(k) table so that each draw needs one uniform column and one coin. */
export function aliasTable(weights: readonly number[]): AliasTable {
  const k = weights.length;
  const total = weights.reduce((s, w) => s + w, 0);
  const scaled = weights.map((w) => (w * k) / total);
  const probability = new Array<number>(k).fill(1);
  const alias = Array.from({ length: k }, (_, i) => i);
  const small: number[] = [];
  const large: number[] = [];
  scaled.forEach((value, i) => (value < 1 ? small : large).push(i));
  while (small.length > 0 && large.length > 0) {
    const s = small.pop() as number;
    const l = large.pop() as number;
    probability[s] = scaled[s] ?? 0;
    alias[s] = l;
    scaled[l] = (scaled[l] ?? 0) + (scaled[s] ?? 0) - 1;
    (scaled[l] < 1 ? small : large).push(l);
  }
  for (const i of [...small, ...large]) probability[i] = 1;
  return { probability, alias };
}

/** Draw from an alias table with one uniform: integer part picks the column, fraction the coin. */
export function aliasDraw(table: AliasTable, u: number): number {
  const k = table.probability.length;
  const column = Math.min(k - 1, Math.floor(u * k));
  const coin = u * k - column;
  return coin < (table.probability[column] ?? 1) ? column : (table.alias[column] ?? column);
}

/** Radical inverse of i in the given base: the van der Corput sequence. */
export function radicalInverse(i: number, base: number): number {
  let result = 0;
  let fraction = 1 / base;
  let n = i;
  while (n > 0) {
    result += (n % base) * fraction;
    n = Math.floor(n / base);
    fraction /= base;
  }
  return result;
}

/** Point i of the two-dimensional Halton sequence with bases 2 and 3. */
export function halton2(i: number): [number, number] {
  return [radicalInverse(i, 2), radicalInverse(i, 3)];
}

/**
 * Star discrepancy estimated on a grid of anchored boxes [0, a) x [0, b):
 * the largest gap between the fraction of points in a box and its area.
 */
export function starDiscrepancy(points: readonly [number, number][], grid = 32): number {
  const n = points.length;
  if (n === 0) return 1;
  let worst = 0;
  for (let i = 1; i <= grid; i += 1) {
    for (let j = 1; j <= grid; j += 1) {
      const a = i / grid;
      const b = j / grid;
      let inside = 0;
      for (const [x, y] of points) if (x < a && y < b) inside += 1;
      worst = Math.max(worst, Math.abs(inside / n - a * b));
    }
  }
  return worst;
}
