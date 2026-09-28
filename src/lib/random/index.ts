import { logGamma } from '../distributions/special.ts';

const TWO_POW_32 = 4294967296;
const TWO_POW_53 = 9007199254740992;

function rotateLeft(value: number, shift: number): number {
  return ((value << shift) | (value >>> (32 - shift))) >>> 0;
}

/** SplitMix32 spreads a single 32-bit seed into well-mixed state words. */
function splitMix32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x9e3779b9) >>> 0;
    let z = state;
    z = Math.imul(z ^ (z >>> 16), 0x85ebca6b) >>> 0;
    z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35) >>> 0;
    return (z ^ (z >>> 16)) >>> 0;
  };
}

/** Converts arbitrary text into a 32-bit seed (FNV-1a). */
export function seedFromText(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/** A fresh seed drawn from the platform's random source, for the "new seed" button. */
export function randomSeed(): number {
  return Math.floor(Math.random() * 1_000_000);
}

/**
 * Seeded pseudorandom generator based on xoshiro128** (Blackman and Vigna).
 * Every visualization draws from an instance of this class so that a seed
 * reproduces the exact same simulation.
 */
export class Random {
  private s0 = 0;
  private s1 = 0;
  private s2 = 0;
  private s3 = 0;
  private spareNormal: number | null = null;
  readonly seed: number;

  constructor(seed: number) {
    this.seed = seed >>> 0;
    const mix = splitMix32(this.seed);
    this.s0 = mix();
    this.s1 = mix();
    this.s2 = mix();
    this.s3 = mix();
    // An all-zero state would produce only zeros; splitmix output makes it vanishingly rare.
    if ((this.s0 | this.s1 | this.s2 | this.s3) === 0) this.s0 = 1;
  }

  /** Next raw 32-bit unsigned integer. */
  nextUint32(): number {
    const result = Math.imul(rotateLeft(Math.imul(this.s1, 5) >>> 0, 7), 9) >>> 0;
    const t = (this.s1 << 9) >>> 0;
    this.s2 = (this.s2 ^ this.s0) >>> 0;
    this.s3 = (this.s3 ^ this.s1) >>> 0;
    this.s1 = (this.s1 ^ this.s2) >>> 0;
    this.s0 = (this.s0 ^ this.s3) >>> 0;
    this.s2 = (this.s2 ^ t) >>> 0;
    this.s3 = rotateLeft(this.s3, 11);
    return result;
  }

  /** Uniform double in [0, 1) with 53 bits of randomness. */
  next(): number {
    const high = this.nextUint32() >>> 5;
    const low = this.nextUint32() >>> 6;
    return (high * 67108864 + low) / TWO_POW_53;
  }

  /** Uniform value in [min, max). */
  uniform(min = 0, max = 1): number {
    return min + (max - min) * this.next();
  }

  /** Uniform integer in [min, max], both inclusive. */
  int(min: number, max: number): number {
    const range = max - min + 1;
    if (range <= TWO_POW_32) {
      // Rejection sampling removes the modulo bias.
      const limit = TWO_POW_32 - (TWO_POW_32 % range);
      let value = this.nextUint32();
      while (value >= limit) value = this.nextUint32();
      return min + (value % range);
    }
    return min + Math.floor(this.next() * range);
  }

  bernoulli(p: number): boolean {
    return this.next() < p;
  }

  /** Normal variate by the Marsaglia polar method, caching the second value. */
  normal(mean = 0, sd = 1): number {
    if (this.spareNormal !== null) {
      const spare = this.spareNormal;
      this.spareNormal = null;
      return mean + sd * spare;
    }
    let u: number;
    let v: number;
    let s: number;
    do {
      u = this.uniform(-1, 1);
      v = this.uniform(-1, 1);
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    const factor = Math.sqrt((-2 * Math.log(s)) / s);
    this.spareNormal = v * factor;
    return mean + sd * u * factor;
  }

  /** Exponential variate with the given rate (mean 1 / rate). */
  exponential(rate = 1): number {
    return -Math.log(1 - this.next()) / rate;
  }

  /** Gamma variate with shape and rate, by Marsaglia and Tsang (2000). */
  gamma(shape: number, rate = 1): number {
    if (shape < 1) {
      // Boost: Gamma(a) = Gamma(a + 1) * U^(1/a).
      const u = this.next();
      return this.gamma(shape + 1, rate) * Math.pow(u === 0 ? Number.MIN_VALUE : u, 1 / shape);
    }
    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    for (;;) {
      let x: number;
      let v: number;
      do {
        x = this.normal();
        v = 1 + c * x;
      } while (v <= 0);
      v = v * v * v;
      const u = this.next();
      if (u < 1 - 0.0331 * x * x * x * x) return (d * v) / rate;
      if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return (d * v) / rate;
    }
  }

  beta(a: number, b: number): number {
    const x = this.gamma(a);
    const y = this.gamma(b);
    return x / (x + y);
  }

  chiSquare(degrees: number): number {
    return this.gamma(degrees / 2, 0.5);
  }

  studentT(degrees: number): number {
    return this.normal() / Math.sqrt(this.chiSquare(degrees) / degrees);
  }

  /** Poisson variate: multiplication method for small means, PTRS (Hormann 1993) otherwise. */
  poisson(lambda: number): number {
    if (lambda <= 0) return 0;
    if (lambda < 30) {
      const limit = Math.exp(-lambda);
      let k = 0;
      let product = this.next();
      while (product > limit) {
        k += 1;
        product *= this.next();
      }
      return k;
    }
    const slam = Math.sqrt(lambda);
    const logLambda = Math.log(lambda);
    const b = 0.931 + 2.53 * slam;
    const a = -0.059 + 0.02483 * b;
    const inverseAlpha = 1.1239 + 1.1328 / (b - 3.4);
    const vr = 0.9277 - 3.6224 / (b - 2);
    for (;;) {
      const u = this.next() - 0.5;
      const v = this.next();
      const us = 0.5 - Math.abs(u);
      const k = Math.floor(((2 * a) / us + b) * u + lambda + 0.43);
      if (us >= 0.07 && v <= vr) return k;
      if (k < 0 || (us < 0.013 && v > us)) continue;
      if (
        Math.log(v) + Math.log(inverseAlpha) - Math.log(a / (us * us) + b) <=
        -lambda + k * logLambda - logGamma(k + 1)
      ) {
        return k;
      }
    }
  }

  /** Binomial variate: direct counting for small n, BTRS (Hormann 1993) for large n. */
  binomial(n: number, p: number): number {
    if (p <= 0 || n === 0) return 0;
    if (p >= 1) return n;
    if (p > 0.5) return n - this.binomial(n, 1 - p);
    if (n * p < 10) {
      // Inversion by sequential search from zero.
      const q = 1 - p;
      const ratio = p / q;
      let probability = Math.pow(q, n);
      let cumulative = probability;
      const u = this.next();
      let k = 0;
      while (u > cumulative && k < n) {
        probability *= (ratio * (n - k)) / (k + 1);
        cumulative += probability;
        k += 1;
      }
      return k;
    }
    const q = 1 - p;
    const spq = Math.sqrt(n * p * q);
    const b = 1.15 + 2.53 * spq;
    const a = -0.0873 + 0.0248 * b + 0.01 * p;
    const c = n * p + 0.5;
    const vr = 0.92 - 4.2 / b;
    const alpha = (2.83 + 5.1 / b) * spq;
    const lpq = Math.log(p / q);
    const m = Math.floor((n + 1) * p);
    const h = logGamma(m + 1) + logGamma(n - m + 1);
    for (;;) {
      const u = this.next() - 0.5;
      let v = this.next();
      const us = 0.5 - Math.abs(u);
      const k = Math.floor(((2 * a) / us + b) * u + c);
      if (k < 0 || k > n) continue;
      if (us >= 0.07 && v <= vr) return k;
      v = Math.log((v * alpha) / (a / (us * us) + b));
      if (v <= h - logGamma(k + 1) - logGamma(n - k + 1) + (k - m) * lpq) return k;
    }
  }

  /** Number of Bernoulli trials up to and including the first success. */
  geometric(p: number): number {
    if (p >= 1) return 1;
    return Math.floor(Math.log(1 - this.next()) / Math.log(1 - p)) + 1;
  }

  /** Index drawn with probability proportional to the weights. */
  categorical(weights: readonly number[]): number {
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let threshold = this.next() * total;
    for (let i = 0; i < weights.length; i += 1) {
      threshold -= weights[i] ?? 0;
      if (threshold < 0) return i;
    }
    return weights.length - 1;
  }

  /** Returns a shuffled copy (Fisher-Yates). */
  shuffle<T>(items: readonly T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = this.int(0, i);
      const temp = copy[i] as T;
      copy[i] = copy[j] as T;
      copy[j] = temp;
    }
    return copy;
  }

  /** k distinct elements chosen uniformly at random, in random order. */
  sample<T>(items: readonly T[], k: number): T[] {
    const copy = [...items];
    const count = Math.min(k, copy.length);
    for (let i = 0; i < count; i += 1) {
      const j = this.int(i, copy.length - 1);
      const temp = copy[i] as T;
      copy[i] = copy[j] as T;
      copy[j] = temp;
    }
    return copy.slice(0, count);
  }

  /** k elements chosen uniformly with replacement. */
  sampleWithReplacement<T>(items: readonly T[], k: number): T[] {
    return Array.from({ length: k }, () => items[this.int(0, items.length - 1)] as T);
  }
}
