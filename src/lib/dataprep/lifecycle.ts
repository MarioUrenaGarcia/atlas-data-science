import { solve } from '../linalg/index.ts';
import { Random } from '../random/index.ts';
import { linearRegression } from '../stats/index.ts';

export interface LeastSquaresFit {
  coefficients: number[];
  fitted: number[];
  residuals: number[];
  /** Residual standard deviation with n - p degrees of freedom. */
  sigma: number;
}

/** Ordinary least squares through the normal equations; rows of `design` are observations. */
export function leastSquares(
  design: readonly (readonly number[])[],
  y: readonly number[],
): LeastSquaresFit | null {
  const p = design[0]?.length ?? 0;
  const gram = Array.from({ length: p }, (_, i) =>
    Array.from({ length: p }, (_, j) =>
      design.reduce((acc, row) => acc + (row[i] ?? 0) * (row[j] ?? 0), 0),
    ),
  );
  const rhs = Array.from({ length: p }, (_, i) =>
    design.reduce((acc, row, k) => acc + (row[i] ?? 0) * (y[k] ?? 0), 0),
  );
  const coefficients = solve(gram, rhs);
  if (!coefficients) return null;
  const fitted = design.map((row) =>
    row.reduce((acc, v, j) => acc + v * (coefficients[j] ?? 0), 0),
  );
  const residuals = y.map((v, i) => v - (fitted[i] ?? 0));
  const dof = Math.max(1, y.length - p);
  const sigma = Math.sqrt(residuals.reduce((acc, r) => acc + r * r, 0) / dof);
  return { coefficients, fitted, residuals, sigma };
}

export interface MonthlySeries {
  months: number;
  sales: number[];
  promo: boolean[];
}

const PERIOD = 12;

/** Design row of the sales model: intercept, trend, annual harmonic and promotion. */
export function salesDesignRow(t: number, promo: boolean): number[] {
  const angle = (2 * Math.PI * t) / PERIOD;
  return [1, t, Math.sin(angle), Math.cos(angle), promo ? 1 : 0];
}

export interface SalesSpec {
  months: number;
  base: number;
  trend: number;
  seasonal: number;
  promoEffect: number;
  noise: number;
  promoMonths: readonly number[];
}

/** Monthly sales with trend, a yearly cycle, promotion months and normal noise. */
export function simulateSales(spec: SalesSpec, random: Random): MonthlySeries {
  const promo = Array.from({ length: spec.months }, (_, t) => spec.promoMonths.includes(t));
  const sales = promo.map((isPromo, t) => {
    const angle = (2 * Math.PI * t) / PERIOD;
    return (
      spec.base +
      spec.trend * t +
      spec.seasonal * Math.sin(angle) +
      (isPromo ? spec.promoEffect : 0) +
      random.normal(0, spec.noise)
    );
  });
  return { months: spec.months, sales, promo };
}

export interface SalesModel {
  fit: LeastSquaresFit;
  predict: (t: number, promo: boolean) => number;
}

export function fitSalesModel(series: MonthlySeries): SalesModel | null {
  const design = series.sales.map((_, t) => salesDesignRow(t, series.promo[t] ?? false));
  const fit = leastSquares(design, series.sales);
  if (!fit) return null;
  return {
    fit,
    predict: (t, promo) =>
      salesDesignRow(t, promo).reduce((acc, v, j) => acc + v * (fit.coefficients[j] ?? 0), 0),
  };
}

export interface ChangeDecomposition {
  trend: number;
  season: number;
  promo: number;
  residual: number;
  total: number;
}

/**
 * Splits the observed change between months a and b into the contributions
 * of each model term plus the change in residuals; the parts add up exactly
 * to the observed change.
 */
export function decomposeChange(
  series: MonthlySeries,
  model: SalesModel,
  a: number,
  b: number,
): ChangeDecomposition {
  const [, trend = 0, sinCoef = 0, cosCoef = 0, promoCoef = 0] = model.fit.coefficients;
  const rowA = salesDesignRow(a, series.promo[a] ?? false);
  const rowB = salesDesignRow(b, series.promo[b] ?? false);
  const diff = (j: number) => (rowB[j] ?? 0) - (rowA[j] ?? 0);
  const total = (series.sales[b] ?? 0) - (series.sales[a] ?? 0);
  const trendPart = trend * diff(1);
  const seasonPart = sinCoef * diff(2) + cosCoef * diff(3);
  const promoPart = promoCoef * diff(4);
  return {
    trend: trendPart,
    season: seasonPart,
    promo: promoPart,
    residual: total - trendPart - seasonPart - promoPart,
    total,
  };
}

/** One record with quasi-identifiers, used to study re-identification risk. */
export interface PersonRecord {
  postal: string;
  age: number;
  sex: 'F' | 'M';
  diagnosis: string;
}

export type QuasiIdentifier = 'postal' | 'age' | 'sex';

export interface Generalization {
  /** Keep only the first digits of the postal code. */
  postalDigits: number;
  /** Width of the age bands; 1 keeps exact ages. */
  ageBand: number;
}

export function quasiKey(
  record: PersonRecord,
  keys: readonly QuasiIdentifier[],
  generalization: Generalization,
): string {
  return keys
    .map((key) => {
      if (key === 'postal') return record.postal.slice(0, generalization.postalDigits);
      if (key === 'age') {
        const band = Math.max(1, generalization.ageBand);
        const low = Math.floor(record.age / band) * band;
        return band === 1 ? String(record.age) : `${low}-${low + band - 1}`;
      }
      return record.sex;
    })
    .join('|');
}

/** Groups record indices that share the same generalized quasi-identifiers. */
export function equivalenceClasses(
  records: readonly PersonRecord[],
  keys: readonly QuasiIdentifier[],
  generalization: Generalization,
): Map<string, number[]> {
  const classes = new Map<string, number[]>();
  records.forEach((record, index) => {
    const key = quasiKey(record, keys, generalization);
    classes.set(key, [...(classes.get(key) ?? []), index]);
  });
  return classes;
}

/** Size of the smallest equivalence class: the k of k-anonymity. */
export function anonymityK(classes: Map<string, number[]>): number {
  let k = Number.POSITIVE_INFINITY;
  for (const members of classes.values()) k = Math.min(k, members.length);
  return Number.isFinite(k) ? k : 0;
}

/** Records alone in their class, which a linked public list identifies exactly. */
export function uniqueRecords(classes: Map<string, number[]>): number {
  let unique = 0;
  for (const members of classes.values()) if (members.length === 1) unique += 1;
  return unique;
}

const POSTAL_CODES = ['06700', '06720', '06760', '03100', '03140', '04510'];
const DIAGNOSES = ['Asma', 'Diabetes', 'Hipertensión', 'Migraña', 'Gastritis'];

/** A small synthetic health table with postal code, age, sex and a sensitive diagnosis. */
export function syntheticPatients(count: number, seed: number): PersonRecord[] {
  const random = new Random(seed);
  return Array.from({ length: count }, () => ({
    postal: POSTAL_CODES[random.int(0, POSTAL_CODES.length - 1)] ?? '06700',
    age: random.int(22, 71),
    sex: random.next() < 0.5 ? 'F' : 'M',
    diagnosis: DIAGNOSES[random.int(0, DIAGNOSES.length - 1)] ?? 'Asma',
  }));
}

export interface AnalysisRun {
  seed: number;
  dataVersion: number;
  codeVersion: number;
}

export interface AnalysisResult {
  slope: number;
  rows: number;
}

/**
 * Data versions grow over time: version v contains the first `base + v * step`
 * rows of a fixed source. Each row is (hours of study, exam score).
 */
export function versionedData(version: number, base = 40, step = 8): [number, number][] {
  const random = new Random(20240611);
  const total = base + 4 * step;
  const rows: [number, number][] = Array.from({ length: total }, () => {
    const hours = random.uniform(1, 12);
    const outlier = random.next() < 0.08;
    const score = 45 + 4 * hours + random.normal(0, 6) + (outlier ? random.uniform(25, 40) : 0);
    return [hours, Math.min(100, score)];
  });
  return rows.slice(0, base + version * step);
}

/** Score above which version 2 of the analysis code discards a row as a capture error. */
export const CODE_V2_CUTOFF = 95;

/**
 * The analysis: a random 70 % training split chosen with the run seed, an
 * optional cleaning rule (code version 2) and the least squares slope.
 */
export function runAnalysis(run: AnalysisRun): AnalysisResult {
  const data = versionedData(run.dataVersion);
  const random = new Random(run.seed);
  const cleaned = run.codeVersion >= 2 ? data.filter(([, s]) => s < CODE_V2_CUTOFF) : data;
  const train = cleaned.filter(() => random.next() < 0.7);
  const fit = linearRegression(
    train.map(([h]) => h),
    train.map(([, s]) => s),
  );
  return { slope: fit.slope, rows: train.length };
}

const FIXED_SEED = 2024;
const RUNS_PER_DATA_VERSION = 3;
const LAST_DATA_VERSION = 4;

/**
 * Configuration of the i-th execution of the analysis. A pinned factor keeps
 * its first value; a free one drifts as it would in an unmanaged project:
 * a new seed every run, a dataset that grows every few runs and a code
 * change halfway through.
 */
export function reproRunConfig(
  index: number,
  runs: number,
  pinned: { seed: boolean; data: boolean; code: boolean },
): AnalysisRun {
  return {
    seed: pinned.seed ? FIXED_SEED : 1000 + 37 * index,
    dataVersion: pinned.data
      ? 0
      : Math.min(LAST_DATA_VERSION, Math.floor(index / RUNS_PER_DATA_VERSION)),
    codeVersion: pinned.code ? 1 : index >= runs / 2 ? 2 : 1,
  };
}

/** Distinct values after rounding, used to count how many different answers a set of runs gave. */
export function distinctCount(values: readonly number[], digits = 6): number {
  return new Set(values.map((v) => v.toFixed(digits))).size;
}

export interface GroupRates {
  falsePositiveRate: number;
  falseNegativeRate: number;
  flaggedRate: number;
  baseRate: number;
}

/** Error rates of one group under a threshold rule. */
export function groupRates(
  cases: readonly { score: number; positive: boolean }[],
  threshold: number,
): GroupRates {
  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;
  for (const item of cases) {
    const flagged = item.score >= threshold;
    if (flagged && item.positive) tp += 1;
    else if (flagged) fp += 1;
    else if (item.positive) fn += 1;
    else tn += 1;
  }
  const n = cases.length;
  return {
    falsePositiveRate: fp + tn === 0 ? Number.NaN : fp / (fp + tn),
    falseNegativeRate: tp + fn === 0 ? Number.NaN : fn / (tp + fn),
    flaggedRate: n === 0 ? Number.NaN : (tp + fp) / n,
    baseRate: n === 0 ? Number.NaN : (tp + fn) / n,
  };
}
