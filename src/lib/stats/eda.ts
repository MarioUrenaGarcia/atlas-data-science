import { Random } from '../random/index.ts';
import {
  mean,
  median,
  medianAbsoluteDeviation,
  quantile,
  standardDeviation,
  sum,
  variance,
} from './index.ts';

/** Box-Cox transform of a positive value; the limit at lambda = 0 is the natural log. */
export function boxCox(x: number, lambda: number): number {
  if (Math.abs(lambda) < 1e-12) return Math.log(x);
  return (x ** lambda - 1) / lambda;
}

/**
 * Yeo-Johnson transform, defined for every real value: it applies a Box-Cox
 * transform to x + 1 for x >= 0 and a mirrored one with parameter 2 - lambda
 * to 1 - x for x < 0, so it is continuous and increasing.
 */
export function yeoJohnson(x: number, lambda: number): number {
  if (x >= 0) {
    return Math.abs(lambda) < 1e-12 ? Math.log1p(x) : ((x + 1) ** lambda - 1) / lambda;
  }
  return Math.abs(lambda - 2) < 1e-12
    ? -Math.log1p(-x)
    : -((1 - x) ** (2 - lambda) - 1) / (2 - lambda);
}

export type PowerFamily = 'box-cox' | 'yeo-johnson';

export function powerTransform(family: PowerFamily, x: number, lambda: number): number {
  return family === 'box-cox' ? boxCox(x, lambda) : yeoJohnson(x, lambda);
}

/**
 * Profile log-likelihood of lambda under the model that the transformed
 * values are normal, up to an additive constant:
 * -n/2 log(sigma^2(lambda)) + (lambda - 1) * sum of the log-Jacobian terms.
 * The Jacobian term is log x for Box-Cox and sign(x) log(|x| + 1) for
 * Yeo-Johnson; sigma^2 is the variance of the transformed values with
 * denominator n, the maximum likelihood estimate.
 */
export function profileLogLikelihood(
  family: PowerFamily,
  values: readonly number[],
  lambda: number,
): number {
  const n = values.length;
  const transformed = values.map((x) => powerTransform(family, x, lambda));
  const m = mean(transformed);
  const s2 = sum(transformed.map((t) => (t - m) ** 2)) / n;
  const jacobian =
    family === 'box-cox'
      ? sum(values.map((x) => Math.log(x)))
      : sum(values.map((x) => Math.sign(x) * Math.log1p(Math.abs(x))));
  return (-n / 2) * Math.log(s2) + (lambda - 1) * jacobian;
}

const LAMBDA_MIN = -3;
const LAMBDA_MAX = 3;
const GRID_STEP = 0.05;
const GOLDEN = (Math.sqrt(5) - 1) / 2;

/**
 * Lambda that maximizes the profile log-likelihood in [-3, 3]: a coarse grid
 * locates the best bracket and golden-section search refines it, since the
 * profile is unimodal near its maximum.
 */
export function optimalLambda(family: PowerFamily, values: readonly number[]): number {
  const f = (lambda: number) => profileLogLikelihood(family, values, lambda);
  let best = LAMBDA_MIN;
  let bestValue = -Infinity;
  for (let lambda = LAMBDA_MIN; lambda <= LAMBDA_MAX + 1e-9; lambda += GRID_STEP) {
    const value = f(lambda);
    if (value > bestValue) {
      bestValue = value;
      best = lambda;
    }
  }
  let a = Math.max(LAMBDA_MIN, best - GRID_STEP);
  let b = Math.min(LAMBDA_MAX, best + GRID_STEP);
  for (let k = 0; k < 40; k += 1) {
    const c = b - GOLDEN * (b - a);
    const d = a + GOLDEN * (b - a);
    if (f(c) > f(d)) b = d;
    else a = c;
  }
  return (a + b) / 2;
}

export interface Fences {
  q1: number;
  q3: number;
  iqr: number;
  lower: number;
  upper: number;
}

/** Tukey fences Q1 - k IQR and Q3 + k IQR, with quartiles of type 7. */
export function tukeyFences(values: readonly number[], k = 1.5): Fences {
  const q1 = quantile(values, 0.25);
  const q3 = quantile(values, 0.75);
  const iqr = q3 - q1;
  return { q1, q3, iqr, lower: q1 - k * iqr, upper: q3 + k * iqr };
}

/** Indices of the values outside the Tukey fences. */
export function iqrOutliers(values: readonly number[], k = 1.5): number[] {
  const { lower, upper } = tukeyFences(values, k);
  return values.flatMap((x, i) => (x < lower || x > upper ? [i] : []));
}

/** Standard scores (x - mean) / s with the sample standard deviation. */
export function zScoresOf(values: readonly number[]): number[] {
  const m = mean(values);
  const s = standardDeviation(values);
  return values.map((x) => (x - m) / s);
}

/** Consistency constant: for normal data the MAD equals 0.6745 times sigma. */
export const MAD_CONSTANT = 0.6745;

/**
 * Modified z-scores of Iglewicz and Hoaglin, 0.6745 (x - median) / MAD. The
 * median and the MAD are not dragged by the outliers they try to detect.
 */
export function modifiedZScores(values: readonly number[]): number[] {
  const m = median(values);
  const mad = medianAbsoluteDeviation(values);
  return values.map((x) => (MAD_CONSTANT * (x - m)) / mad);
}

export type Cell = number | string | null;

export interface ColumnProfile {
  name: string;
  kind: 'numerica' | 'categorica';
  count: number;
  missing: number;
  distinct: number;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  sd?: number;
  /** Most frequent value and its count. */
  mode: { value: string; count: number };
  /** Values counted, most frequent first. */
  top: { value: string; count: number }[];
}

/**
 * Profile of one column: its type, completeness, cardinality and either
 * numeric summaries or category frequencies.
 */
export function profileColumn(name: string, cells: readonly Cell[]): ColumnProfile {
  const present = cells.filter((c): c is number | string => c !== null);
  const numeric = present.length > 0 && present.every((c) => typeof c === 'number');
  const counts = new Map<string, number>();
  for (const c of present) counts.set(String(c), (counts.get(String(c)) ?? 0) + 1);
  const top = [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  const profile: ColumnProfile = {
    name,
    kind: numeric ? 'numerica' : 'categorica',
    count: cells.length,
    missing: cells.length - present.length,
    distinct: counts.size,
    mode: top[0] ?? { value: '', count: 0 },
    top,
  };
  if (numeric) {
    const xs = present as number[];
    profile.min = Math.min(...xs);
    profile.max = Math.max(...xs);
    profile.mean = mean(xs);
    profile.median = median(xs);
    profile.sd = xs.length > 1 ? Math.sqrt(variance(xs)) : 0;
  }
  return profile;
}

export interface MissingPattern {
  /** One flag per column, true where the value is missing. */
  missing: boolean[];
  count: number;
}

/** Distinct patterns of missing values across columns, most frequent first. */
export function missingPatterns(rows: readonly (readonly Cell[])[]): MissingPattern[] {
  const map = new Map<string, MissingPattern>();
  for (const row of rows) {
    const missing = row.map((c) => c === null);
    const key = missing.map((m) => (m ? '1' : '0')).join('');
    const found = map.get(key);
    if (found) found.count += 1;
    else map.set(key, { missing, count: 1 });
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export type MissingMechanism = 'mcar' | 'mar' | 'mnar';

export interface MissingDemo {
  /** Age, always observed. */
  age: number[];
  /** Income in thousands, the true values. */
  income: number[];
  /** True where the income was not reported. */
  missing: boolean[];
}

/**
 * Survey of age and income where income goes unreported with probability 0.3
 * on average, under three mechanisms: completely at random (MCAR), depending
 * on the observed age (MAR, younger people answer less), or depending on the
 * income itself (MNAR, higher incomes are hidden more often).
 */
export function missingDemo(mechanism: MissingMechanism, n: number, seed: number): MissingDemo {
  const random = new Random(seed);
  const age: number[] = [];
  const income: number[] = [];
  const missing: boolean[] = [];
  for (let i = 0; i < n; i += 1) {
    const a = Math.round(random.uniform(20, 65));
    const y = Math.exp(Math.log(8 + 0.25 * (a - 20)) + random.normal(0, 0.35));
    const z = (Math.log(y) - Math.log(12)) / 0.45;
    const p =
      mechanism === 'mcar'
        ? 0.3
        : mechanism === 'mar'
          ? Math.min(0.9, Math.max(0.02, 0.3 + 0.012 * (42.5 - a)))
          : 1 / (1 + Math.exp(-(1.6 * z - 1.5)));
    age.push(a);
    income.push(Math.round(y * 10) / 10);
    missing.push(random.uniform(0, 1) < p);
  }
  return { age, income, missing };
}

export const ZONES = ['Norte', 'Centro', 'Sur'] as const;
export type Zone = (typeof ZONES)[number];

export interface Home {
  zona: Zone;
  /** Floor area in square meters. */
  superficie: number;
  habitaciones: number;
  /** Age of the building in years; null when not recorded. */
  antiguedad: number | null;
  /** Price in millions of pesos. */
  precio: number;
}

const ZONE_WEIGHTS = [0.35, 0.4, 0.25];
/** Price per square meter in thousands of pesos. */
const ZONE_PRICE = [28, 40, 18];
/** Rows whose floor area was typed with an extra zero, a typical capture error. */
export const ENTRY_ERRORS = [17, 113];

/**
 * Synthetic sale records of homes used along the exploratory analysis: a
 * right-skewed price that grows with the area and depends on the zone, a
 * capture error in two areas, and building ages missing far more often in
 * the southern zone.
 */
export function homesDataset(n = 200, seed = 4242): Home[] {
  const random = new Random(seed);
  return Array.from({ length: n }, (_, i) => {
    const z = random.categorical(ZONE_WEIGHTS);
    const zona = ZONES[z] ?? 'Centro';
    const area = Math.exp(Math.log(90) + random.normal(0, 0.35));
    const habitaciones = Math.min(6, Math.max(1, Math.round(area / 35 + random.normal(0, 0.6))));
    const age = Math.round(Math.exp(Math.log(15) + random.normal(0, 0.6)));
    const price = ((ZONE_PRICE[z] ?? 30) * area * Math.exp(random.normal(0, 0.2))) / 1000;
    const missingAge = random.uniform(0, 1) < (zona === 'Sur' ? 0.35 : 0.05);
    const superficie = Math.round(area) * (ENTRY_ERRORS.includes(i) ? 10 : 1);
    return {
      zona,
      superficie,
      habitaciones,
      antiguedad: missingAge ? null : age,
      precio: Math.round(price * 100) / 100,
    };
  });
}
