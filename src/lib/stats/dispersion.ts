import {
  mean,
  meanAbsoluteDeviation,
  median,
  medianAbsoluteDeviation,
  quantile,
  standardDeviation,
  variance,
  type QuantileMethod,
} from './index.ts';

export type SpreadMeasure =
  'rango' | 'varianza' | 'varianza-n' | 'desviacion' | 'cv' | 'riq' | 'mad' | 'dam';

/** Scale factor that makes the MAD estimate sigma for normal data: 1 / Phi^-1(3/4). */
export const MAD_NORMAL_SCALE = 1.4826;

/** Coefficient of variation s / mean; undefined when the mean is not positive. */
export function coefficientOfVariation(values: readonly number[]): number {
  const m = mean(values);
  return m > 0 ? standardDeviation(values) / m : Number.NaN;
}

export function spreadMeasure(measure: SpreadMeasure, values: readonly number[]): number {
  if (values.length === 0) return Number.NaN;
  switch (measure) {
    case 'rango':
      return Math.max(...values) - Math.min(...values);
    case 'varianza':
      return variance(values);
    case 'varianza-n':
      return variance(values, true);
    case 'desviacion':
      return standardDeviation(values);
    case 'cv':
      return coefficientOfVariation(values);
    case 'riq':
      return quantile(values, 0.75) - quantile(values, 0.25);
    case 'mad':
      return medianAbsoluteDeviation(values);
    case 'dam':
      return meanAbsoluteDeviation(values);
  }
}

/** Modified z-scores 0.6745 (x - median) / MAD, robust to outliers. */
export function modifiedZScores(values: readonly number[]): number[] {
  const m = median(values);
  const mad = medianAbsoluteDeviation(values);
  return values.map((value) => (mad > 0 ? (0.6745 * (value - m)) / mad : Number.NaN));
}

export interface BoxplotStats {
  q1: number;
  median: number;
  q3: number;
  iqr: number;
  lowerFence: number;
  upperFence: number;
  /** Most extreme observations inside the fences, where whiskers end. */
  lowerWhisker: number;
  upperWhisker: number;
  outliers: number[];
  min: number;
  max: number;
}

/** Tukey boxplot with fences at k interquartile ranges beyond the quartiles. */
export function boxplotStats(
  values: readonly number[],
  k = 1.5,
  method: QuantileMethod = 7,
): BoxplotStats {
  const q1 = quantile(values, 0.25, method);
  const q3 = quantile(values, 0.75, method);
  const iqr = q3 - q1;
  const lowerFence = q1 - k * iqr;
  const upperFence = q3 + k * iqr;
  const inside = values.filter((value) => value >= lowerFence && value <= upperFence);
  return {
    q1,
    median: quantile(values, 0.5, method),
    q3,
    iqr,
    lowerFence,
    upperFence,
    lowerWhisker: Math.min(...inside),
    upperWhisker: Math.max(...inside),
    outliers: values.filter((value) => value < lowerFence || value > upperFence),
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

export const QUANTILE_METHODS: readonly QuantileMethod[] = [1, 2, 4, 5, 6, 7, 8, 9];

/** Plotting position m(p) of Hyndman and Fan: the quantile sits at rank n p + m. */
export function quantileRank(n: number, p: number, method: QuantileMethod): number {
  if (method === 1 || method === 2) return n * p;
  const m = { 4: 0, 5: 0.5, 6: p, 7: 1 - p, 8: (p + 1) / 3, 9: p / 4 + 3 / 8 }[method];
  return n * p + m;
}
