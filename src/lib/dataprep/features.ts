import { mean, median, quantile, standardDeviation } from '../stats/index.ts';

/** Linear map of [min, max] onto [a, b]. */
export function minMaxScale(values: readonly number[], a = 0, b = 1): number[] {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  return values.map((v) => a + ((v - lo) * (b - a)) / span);
}

/** z = (x - mean) / sd with the sample standard deviation. */
export function standardize(values: readonly number[]): number[] {
  const m = mean(values);
  const s = standardDeviation(values) || 1;
  return values.map((v) => (v - m) / s);
}

/** (x - median) / IQR, resistant to outliers. */
export function robustScale(values: readonly number[]): number[] {
  const med = median(values);
  const iqr = quantile(values, 0.75) - quantile(values, 0.25) || 1;
  return values.map((v) => (v - med) / iqr);
}

/** L_p norm of a vector (p = Infinity gives the maximum absolute value). */
export function lpNorm(vector: readonly number[], p: number): number {
  if (!Number.isFinite(p)) return Math.max(...vector.map(Math.abs));
  return vector.reduce((acc, v) => acc + Math.abs(v) ** p, 0) ** (1 / p);
}

/** Divides a row by its L_p norm, so the row has norm 1. */
export function normalizeRow(vector: readonly number[], p: number): number[] {
  const n = lpNorm(vector, p) || 1;
  return vector.map((v) => v / n);
}

/** Box-Cox transform, defined for x > 0. */
export function boxCox(x: number, lambda: number): number {
  return Math.abs(lambda) < 1e-12 ? Math.log(x) : (x ** lambda - 1) / lambda;
}

/** Yeo-Johnson transform, defined for every real x. */
export function yeoJohnson(x: number, lambda: number): number {
  if (x >= 0) {
    return Math.abs(lambda) < 1e-12 ? Math.log1p(x) : ((x + 1) ** lambda - 1) / lambda;
  }
  return Math.abs(lambda - 2) < 1e-12
    ? -Math.log1p(-x)
    : -((1 - x) ** (2 - lambda) - 1) / (2 - lambda);
}

export type PowerFamily = 'box-cox' | 'yeo-johnson';

/**
 * Profile log-likelihood of a power transform under normality: the normal
 * log-likelihood of the transformed data plus the log Jacobian of the map.
 */
export function powerLogLikelihood(
  values: readonly number[],
  lambda: number,
  family: PowerFamily,
): number {
  const n = values.length;
  const transformed = values.map((v) =>
    family === 'box-cox' ? boxCox(v, lambda) : yeoJohnson(v, lambda),
  );
  const m = mean(transformed);
  const variance = transformed.reduce((acc, v) => acc + (v - m) ** 2, 0) / n;
  const jacobian =
    family === 'box-cox'
      ? (lambda - 1) * values.reduce((acc, v) => acc + Math.log(v), 0)
      : (lambda - 1) * values.reduce((acc, v) => acc + Math.sign(v) * Math.log1p(Math.abs(v)), 0);
  return -(n / 2) * Math.log(variance) + jacobian;
}

/** Lambda in [lo, hi] that maximizes the profile log-likelihood, by grid search then refinement. */
export function bestLambda(
  values: readonly number[],
  family: PowerFamily,
  lo = -2,
  hi = 3,
): number {
  let best = lo;
  let bestValue = Number.NEGATIVE_INFINITY;
  const scan = (from: number, to: number, steps: number) => {
    for (let i = 0; i <= steps; i += 1) {
      const lambda = from + ((to - from) * i) / steps;
      const ll = powerLogLikelihood(values, lambda, family);
      if (ll > bestValue) {
        bestValue = ll;
        best = lambda;
      }
    }
  };
  scan(lo, hi, 100);
  const width = (hi - lo) / 100;
  scan(best - width, best + width, 40);
  return best;
}

/** Bin edges with equal width. */
export function equalWidthEdges(values: readonly number[], bins: number): number[] {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  return Array.from({ length: bins + 1 }, (_, i) => lo + ((hi - lo) * i) / bins);
}

/** Bin edges at the quantiles, so each bin holds about the same number of values. */
export function equalFrequencyEdges(values: readonly number[], bins: number): number[] {
  return Array.from({ length: bins + 1 }, (_, i) => quantile(values, i / bins));
}

/** Index of the bin of each value; the last edge closes the last bin. */
export function assignBins(values: readonly number[], edges: readonly number[]): number[] {
  const last = edges.length - 2;
  return values.map((v) => {
    for (let b = 0; b <= last; b += 1) {
      if (v < (edges[b + 1] ?? Number.POSITIVE_INFINITY)) return b;
    }
    return last;
  });
}

/** Distinct categories in order of first appearance. */
export function categoriesOf(values: readonly string[]): string[] {
  return [...new Set(values)];
}

/** One-hot matrix: one 0/1 column per category, optionally dropping the first as reference. */
export function oneHot(
  values: readonly string[],
  categories: readonly string[],
  dropFirst = false,
): number[][] {
  const used = dropFirst ? categories.slice(1) : categories;
  return values.map((v) => used.map((c) => (c === v ? 1 : 0)));
}

export interface TargetEncoding {
  /** Encoded value of each category. */
  byCategory: Map<string, number>;
  globalMean: number;
}

/**
 * Smoothed target encoding: each category gets (n_c mean_c + m mean) / (n_c + m),
 * which shrinks small categories toward the global mean.
 */
export function targetEncode(
  categories: readonly string[],
  y: readonly number[],
  m: number,
): TargetEncoding {
  const globalMean = mean(y);
  const sums = new Map<string, { sum: number; n: number }>();
  categories.forEach((c, i) => {
    const s = sums.get(c) ?? { sum: 0, n: 0 };
    s.sum += y[i] ?? 0;
    s.n += 1;
    sums.set(c, s);
  });
  const byCategory = new Map<string, number>();
  for (const [c, s] of sums) byCategory.set(c, (s.sum + m * globalMean) / (s.n + m));
  return { byCategory, globalMean };
}

/**
 * Out-of-fold target encoding: each row is encoded with statistics computed
 * on the other folds only, so its own target never enters its feature.
 */
export function targetEncodeOutOfFold(
  categories: readonly string[],
  y: readonly number[],
  m: number,
  folds: number,
): number[] {
  return categories.map((c, i) => {
    const fold = i % folds;
    const otherCats: string[] = [];
    const otherY: number[] = [];
    categories.forEach((cc, j) => {
      if (j % folds !== fold) {
        otherCats.push(cc);
        otherY.push(y[j] ?? 0);
      }
    });
    const enc = targetEncode(otherCats, otherY, m);
    return enc.byCategory.get(c) ?? enc.globalMean;
  });
}

/** Share of rows of each category. */
export function frequencyEncode(values: readonly string[]): Map<string, number> {
  const counts = new Map<string, number>();
  values.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  const out = new Map<string, number>();
  for (const [c, n] of counts) out.set(c, n / values.length);
  return out;
}

/** 32-bit FNV-1a hash of a string. */
export function fnv1a(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/** Bucket of the hashing trick and the sign used by signed hashing. */
export function hashBucket(text: string, buckets: number): { bucket: number; sign: 1 | -1 } {
  const h = fnv1a(text);
  // A second hash of the same text decides the sign, so collisions tend to cancel.
  const s = fnv1a(`signo:${text}`);
  return { bucket: h % buckets, sign: s % 2 === 0 ? 1 : -1 };
}

/** Number of distinct pairs of categories that share a bucket. */
export function collisionPairs(values: readonly string[], buckets: number): number {
  const counts = new Map<number, number>();
  for (const v of new Set(values)) {
    const b = hashBucket(v, buckets).bucket;
    counts.set(b, (counts.get(b) ?? 0) + 1);
  }
  let pairs = 0;
  for (const n of counts.values()) pairs += (n * (n - 1)) / 2;
  return pairs;
}

/** Number of monomials of degree at most d in p variables, including the constant: C(p + d, d). */
export function polynomialFeatureCount(p: number, d: number): number {
  let result = 1;
  for (let i = 1; i <= d; i += 1) result = (result * (p + i)) / i;
  return Math.round(result);
}

/** Polynomial design row 1, x, x^2, ..., x^d for one variable. */
export function polynomialRow(x: number, degree: number): number[] {
  return Array.from({ length: degree + 1 }, (_, k) => x ** k);
}

/** sin and cos coordinates of a periodic value with the given period. */
export function cyclicEncode(value: number, period: number): [number, number] {
  const angle = (2 * Math.PI * value) / period;
  return [Math.sin(angle), Math.cos(angle)];
}

/** Euclidean distance between two cyclic encodings, equal to 2 sin(pi |a - b| / period). */
export function cyclicDistance(a: number, b: number, period: number): number {
  const [s1, c1] = cyclicEncode(a, period);
  const [s2, c2] = cyclicEncode(b, period);
  return Math.hypot(s1 - s2, c1 - c2);
}

export interface DateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  /** 0 = Monday, ..., 6 = Sunday. */
  weekday: number;
  weekend: boolean;
  dayOfYear: number;
}

/** Calendar parts of a UTC date-time given as 'YYYY-MM-DD HH:MM'. */
export function dateParts(text: string): DateParts {
  const [datePart = '', timePart = '00:00'] = text.split(' ');
  const [y = 0, m = 1, d = 1] = datePart.split('-').map(Number);
  const [hh = 0] = timePart.split(':').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, hh));
  const weekday = (date.getUTCDay() + 6) % 7;
  const start = Date.UTC(y, 0, 1);
  return {
    year: y,
    month: m,
    day: d,
    hour: hh,
    weekday,
    weekend: weekday >= 5,
    dayOfYear: Math.floor((date.getTime() - start) / 86400000) + 1,
  };
}

export interface GroupAggregate {
  key: string;
  count: number;
  sum: number;
  mean: number;
  max: number;
}

/** Count, sum, mean and maximum of a value per group key. */
export function aggregateBy(keys: readonly string[], values: readonly number[]): GroupAggregate[] {
  const groups = new Map<string, number[]>();
  keys.forEach((k, i) => groups.set(k, [...(groups.get(k) ?? []), values[i] ?? 0]));
  return [...groups.entries()].map(([key, vs]) => ({
    key,
    count: vs.length,
    sum: vs.reduce((a, b) => a + b, 0),
    mean: mean(vs),
    max: Math.max(...vs),
  }));
}

export interface EmbeddingTrace {
  /** Embedding of every category after each recorded step. */
  frames: [number, number][][];
  /** Loss after each recorded step. */
  losses: number[];
}

/** Squared error between target similarities and dot products, over pairs i < j. */
export function embeddingLoss(
  target: readonly (readonly number[])[],
  emb: readonly [number, number][],
): number {
  let loss = 0;
  for (let i = 0; i < emb.length; i += 1) {
    for (let j = i + 1; j < emb.length; j += 1) {
      const a = emb[i] ?? [0, 0];
      const b = emb[j] ?? [0, 0];
      const diff = (target[i]?.[j] ?? 0) - (a[0] * b[0] + a[1] * b[1]);
      loss += diff * diff;
    }
  }
  return loss;
}

/**
 * Learns two-dimensional embeddings whose dot products approximate a target
 * similarity matrix, by gradient descent from small random starting points.
 */
export function trainEmbeddings(
  target: readonly (readonly number[])[],
  start: readonly [number, number][],
  steps: number,
  rate: number,
): EmbeddingTrace {
  let emb = start.map((p) => [p[0], p[1]] as [number, number]);
  const frames = [emb.map((p) => [p[0], p[1]] as [number, number])];
  const losses = [embeddingLoss(target, emb)];
  for (let s = 0; s < steps; s += 1) {
    const grad = emb.map(() => [0, 0] as [number, number]);
    for (let i = 0; i < emb.length; i += 1) {
      for (let j = 0; j < emb.length; j += 1) {
        if (i === j) continue;
        const a = emb[i] ?? [0, 0];
        const b = emb[j] ?? [0, 0];
        const diff = (target[i]?.[j] ?? 0) - (a[0] * b[0] + a[1] * b[1]);
        const g = grad[i] ?? [0, 0];
        g[0] -= diff * b[0];
        g[1] -= diff * b[1];
      }
    }
    emb = emb.map((p, i) => [p[0] - rate * (grad[i]?.[0] ?? 0), p[1] - rate * (grad[i]?.[1] ?? 0)]);
    frames.push(emb.map((p) => [p[0], p[1]] as [number, number]));
    losses.push(embeddingLoss(target, emb));
  }
  return { frames, losses };
}
