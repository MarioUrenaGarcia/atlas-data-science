import { standardNormalQuantile } from '../distributions/special.ts';
import { studentT } from '../distributions/continuous.ts';
import type { Random } from '../random/index.ts';
import { mean, median, pearson, quantile, variance } from '../stats/index.ts';

export type Mechanism = 'MCAR' | 'MAR' | 'MNAR';

export interface MissingPoint {
  x: number;
  y: number;
  /** True when y is missing (x is always observed). */
  missing: boolean;
}

export interface MissingSpec {
  n: number;
  /** Correlation between x and y. */
  rho: number;
  meanX: number;
  sdX: number;
  meanY: number;
  sdY: number;
  mechanism: Mechanism;
  /** Expected share of missing y values. */
  rate: number;
  /** Strength of the dependence of the missingness on x (MAR) or y (MNAR), per standard deviation. */
  strength: number;
}

function logistic(v: number): number {
  return 1 / (1 + Math.exp(-v));
}

/**
 * Intercept a such that the average of logistic(a + b z) over the given
 * standardized values equals the target rate (bisection on a monotone function).
 */
export function calibrateIntercept(z: readonly number[], slope: number, rate: number): number {
  let lo = -30;
  let hi = 30;
  for (let i = 0; i < 80; i += 1) {
    const mid = (lo + hi) / 2;
    const avg = z.reduce((acc, v) => acc + logistic(mid + slope * v), 0) / Math.max(1, z.length);
    if (avg < rate) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Probability that y is missing for a point, given the mechanism and calibrated intercept. */
export function missingProbability(
  mechanism: Mechanism,
  intercept: number,
  strength: number,
  zx: number,
  zy: number,
): number {
  if (mechanism === 'MCAR') return logistic(intercept);
  return logistic(intercept + strength * (mechanism === 'MAR' ? zx : zy));
}

/**
 * Bivariate normal pairs with y deleted according to a missingness
 * mechanism: MCAR ignores the data, MAR depends on the observed x and MNAR
 * on the value of y itself. Larger values are more likely to be missing.
 */
export function simulateMissing(spec: MissingSpec, random: Random): MissingPoint[] {
  const pairs = Array.from({ length: spec.n }, () => {
    const zx = random.normal();
    const zy = spec.rho * zx + Math.sqrt(1 - spec.rho * spec.rho) * random.normal();
    return { zx, zy };
  });
  const driver = pairs.map((p) => (spec.mechanism === 'MAR' ? p.zx : p.zy));
  const slope = spec.mechanism === 'MCAR' ? 0 : spec.strength;
  const intercept = calibrateIntercept(driver, slope, spec.rate);
  return pairs.map(({ zx, zy }) => ({
    x: spec.meanX + spec.sdX * zx,
    y: spec.meanY + spec.sdY * zy,
    missing: random.next() < missingProbability(spec.mechanism, intercept, spec.strength, zx, zy),
  }));
}

export type SimpleImputation = 'media' | 'mediana' | 'moda';

/** Most frequent value; ties keep the smallest. Values are compared after rounding to `digits`. */
export function modeOf(values: readonly number[], digits = 0): number {
  const counts = new Map<number, number>();
  for (const v of values) {
    const key = Number(v.toFixed(digits));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let best = Number.NaN;
  let bestCount = -1;
  for (const [value, count] of [...counts.entries()].sort((a, b) => a[0] - b[0])) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }
  return best;
}

/** Fill value of a simple imputation computed from the observed values only. */
export function simpleFillValue(
  observed: readonly number[],
  method: SimpleImputation,
  digits = 0,
): number {
  if (method === 'media') return mean(observed);
  if (method === 'mediana') return median(observed);
  return modeOf(observed, digits);
}

/** Replaces every NaN by the fill value. */
export function imputeSimple(
  values: readonly number[],
  method: SimpleImputation,
  digits = 0,
): number[] {
  const observed = values.filter((v) => !Number.isNaN(v));
  const fill = simpleFillValue(observed, method, digits);
  return values.map((v) => (Number.isNaN(v) ? fill : v));
}

export interface ImputationEffect {
  meanObserved: number;
  meanImputed: number;
  sdObserved: number;
  sdImputed: number;
  corrObserved: number;
  corrImputed: number;
}

/** Summary of how an imputation changes the mean, spread and correlation of y. */
export function imputationEffect(
  points: readonly MissingPoint[],
  imputedY: readonly number[],
): ImputationEffect {
  const obs = points.filter((p) => !p.missing);
  return {
    meanObserved: mean(obs.map((p) => p.y)),
    meanImputed: mean(imputedY),
    sdObserved: Math.sqrt(variance(obs.map((p) => p.y))),
    sdImputed: Math.sqrt(variance(imputedY)),
    corrObserved: pearson(
      obs.map((p) => p.x),
      obs.map((p) => p.y),
    ),
    corrImputed: pearson(
      points.map((p) => p.x),
      imputedY,
    ),
  };
}

export interface KnnImputation {
  value: number;
  neighbors: number[];
}

/**
 * Imputes the missing y of `target` with the mean y of the k complete points
 * whose x is closest (ties broken by index).
 */
export function knnImpute(
  points: readonly MissingPoint[],
  target: number,
  k: number,
): KnnImputation {
  const t = points[target];
  if (!t) return { value: Number.NaN, neighbors: [] };
  const neighbors = points
    .map((p, i) => ({ i, d: Math.abs(p.x - t.x), ok: !p.missing && i !== target }))
    .filter((c) => c.ok)
    .sort((a, b) => a.d - b.d || a.i - b.i)
    .slice(0, k)
    .map((c) => c.i);
  const value = mean(neighbors.map((i) => points[i]?.y ?? 0));
  return { value, neighbors };
}

/** Rows of a table with possibly missing (NaN) cells. */
export type Table = readonly (readonly number[])[];

/** Rows without any missing cell. */
export function listwiseRows(table: Table): number[] {
  return table.flatMap((row, i) => (row.every((v) => !Number.isNaN(v)) ? [i] : []));
}

/** Rows where both columns a and b are observed. */
export function pairwiseRows(table: Table, a: number, b: number): number[] {
  return table.flatMap((row, i) =>
    !Number.isNaN(row[a] ?? Number.NaN) && !Number.isNaN(row[b] ?? Number.NaN) ? [i] : [],
  );
}

/** Pearson correlation of columns a and b over the given rows. */
export function correlationOnRows(
  table: Table,
  rows: readonly number[],
  a: number,
  b: number,
): number {
  return pearson(
    rows.map((i) => table[i]?.[a] ?? 0),
    rows.map((i) => table[i]?.[b] ?? 0),
  );
}

export interface RubinPooled {
  /** Pooled estimate: average of the m estimates. */
  qBar: number;
  /** Average within-imputation variance. */
  within: number;
  /** Between-imputation variance of the estimates. */
  between: number;
  /** Total variance W + (1 + 1/m) B. */
  total: number;
  /** Degrees of freedom of the reference t distribution. */
  df: number;
  /** Fraction of the total variance due to missing data. */
  lambda: number;
}

/** Rubin's rules for combining m point estimates and their squared standard errors. */
export function rubinPool(estimates: readonly number[], variances: readonly number[]): RubinPooled {
  const m = estimates.length;
  const qBar = mean(estimates);
  const within = mean(variances);
  const between = m > 1 ? variance(estimates) : 0;
  const total = within + (1 + 1 / m) * between;
  const lambda = total > 0 ? ((1 + 1 / m) * between) / total : 0;
  const df = lambda > 0 ? (m - 1) / (lambda * lambda) : Number.POSITIVE_INFINITY;
  return { qBar, within, between, total, df, lambda };
}

/** Normal-approximation 95 % interval used when the degrees of freedom are large. */
export function normalInterval(
  center: number,
  varianceValue: number,
  level = 0.95,
): [number, number] {
  const z = standardNormalQuantile(0.5 + level / 2);
  const half = z * Math.sqrt(varianceValue);
  return [center - half, center + half];
}

export interface WinsorizeResult {
  values: number[];
  low: number;
  high: number;
  clippedLow: number;
  clippedHigh: number;
}

/** Caps values below the p-quantile and above the (1 - p)-quantile at those quantiles. */
export function winsorizeQuantiles(values: readonly number[], p: number): WinsorizeResult {
  const low = quantile(values, p);
  const high = quantile(values, 1 - p);
  let clippedLow = 0;
  let clippedHigh = 0;
  const out = values.map((v) => {
    if (v < low) {
      clippedLow += 1;
      return low;
    }
    if (v > high) {
      clippedHigh += 1;
      return high;
    }
    return v;
  });
  return { values: out, low, high, clippedLow, clippedHigh };
}

/** Tukey fences Q1 - c IQR and Q3 + c IQR. */
export function tukeyFences(values: readonly number[], c = 1.5): [number, number] {
  const q1 = quantile(values, 0.25);
  const q3 = quantile(values, 0.75);
  return [q1 - c * (q3 - q1), q3 + c * (q3 - q1)];
}

/**
 * Interval of Rubin's rules, Q-bar plus or minus t_{nu, (1 + level) / 2} sqrt(T),
 * with the normal quantile when the degrees of freedom are infinite.
 */
export function rubinInterval(pooled: RubinPooled, level = 0.95): [number, number] {
  const p = 0.5 + level / 2;
  const q = Number.isFinite(pooled.df)
    ? studentT(pooled.df).quantile(p)
    : standardNormalQuantile(p);
  const half = q * Math.sqrt(pooled.total);
  return [pooled.qBar - half, pooled.qBar + half];
}
