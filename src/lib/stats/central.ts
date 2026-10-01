import {
  geometricMean,
  harmonicMean,
  mean,
  median,
  modes,
  sorted,
  trimmedMean,
  weightedMean,
  winsorizedMean,
} from './index.ts';

export type CenterMeasure =
  | 'media'
  | 'ponderada'
  | 'geometrica'
  | 'armonica'
  | 'cuadratica'
  | 'recortada'
  | 'winsorizada'
  | 'mediana'
  | 'moda'
  | 'rango-medio';

export function midrange(values: readonly number[]): number {
  if (values.length === 0) return Number.NaN;
  return (Math.min(...values) + Math.max(...values)) / 2;
}

/** Root mean square, the mean that squares, averages and takes the square root. */
export function quadraticMean(values: readonly number[]): number {
  return Math.sqrt(mean(values.map((value) => value * value)));
}

/** Number of observations removed from each end by trimming a proportion. */
export function trimCount(n: number, proportion: number): number {
  return Math.floor(n * proportion);
}

/**
 * Indices (into the original array) of the observations that trimming or
 * winsorizing affects: the `cut` smallest and the `cut` largest. Ties are
 * broken by position so exactly 2 * cut indices are returned.
 */
export function extremeIndices(
  values: readonly number[],
  proportion: number,
): {
  low: number[];
  high: number[];
} {
  const cut = trimCount(values.length, proportion);
  const order = values
    .map((value, index) => ({ value, index }))
    .sort((a, b) => a.value - b.value || a.index - b.index);
  return {
    low: order.slice(0, cut).map((item) => item.index),
    high: order.slice(order.length - cut).map((item) => item.index),
  };
}

/** Values with the `cut` most extreme on each side replaced by the nearest kept value. */
export function winsorize(values: readonly number[], proportion: number): number[] {
  const cut = trimCount(values.length, proportion);
  if (cut === 0 || values.length === 0) return [...values];
  const x = sorted(values);
  const low = x[cut] as number;
  const high = x[x.length - 1 - cut] as number;
  return values.map((value) => Math.min(high, Math.max(low, value)));
}

export interface CenterOptions {
  weights?: readonly number[];
  /** Proportion trimmed or winsorized on each side. */
  proportion?: number;
}

/** Value of a measure of central tendency; NaN when it is undefined for the data. */
export function centerMeasure(
  measure: CenterMeasure,
  values: readonly number[],
  options: CenterOptions = {},
): number {
  if (values.length === 0) return Number.NaN;
  const positive = values.every((value) => value > 0);
  switch (measure) {
    case 'media':
      return mean(values);
    case 'ponderada':
      return weightedMean(values, options.weights ?? values.map(() => 1));
    case 'geometrica':
      return positive ? geometricMean(values) : Number.NaN;
    case 'armonica':
      return positive ? harmonicMean(values) : Number.NaN;
    case 'cuadratica':
      return quadraticMean(values);
    case 'recortada':
      return trimmedMean(values, options.proportion ?? 0.1);
    case 'winsorizada':
      return winsorizedMean(values, options.proportion ?? 0.1);
    case 'mediana':
      return median(values);
    case 'moda': {
      const found = modes(values);
      // A single mode is reported; with ties every value is a mode and none is singled out.
      return found.length === 1 ? (found[0] as number) : Number.NaN;
    }
    case 'rango-medio':
      return midrange(values);
  }
}
