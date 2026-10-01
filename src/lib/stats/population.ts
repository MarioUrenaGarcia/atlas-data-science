import { Random } from '../random/index.ts';
import { mean, median } from './index.ts';

export type PopulationShape = 'normal' | 'sesgada' | 'bernoulli';
export type PopulationStatistic = 'media' | 'mediana' | 'proporcion' | 'maximo';

export interface PopulationSpec {
  size: number;
  shape: PopulationShape;
  /** Mean for numeric shapes, probability of success for bernoulli. */
  center: number;
  spread?: number;
  decimals?: number;
}

const GAMMA_SHAPE = 2;

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * A finite population of numeric values. Skewed populations use a gamma
 * distribution with shape 2 scaled to the requested mean, which gives the
 * long right tail typical of incomes or waiting times.
 */
export function generatePopulation(spec: PopulationSpec, random: Random): number[] {
  const decimals = spec.decimals ?? 0;
  const values: number[] = [];
  for (let i = 0; i < spec.size; i += 1) {
    if (spec.shape === 'bernoulli') {
      values.push(random.bernoulli(Math.min(1, Math.max(0, spec.center))) ? 1 : 0);
    } else if (spec.shape === 'normal') {
      values.push(round(random.normal(spec.center, spec.spread ?? 1), decimals));
    } else {
      values.push(round(random.gamma(GAMMA_SHAPE, GAMMA_SHAPE / spec.center), decimals));
    }
  }
  return values;
}

export function populationStatistic(
  statistic: PopulationStatistic,
  values: readonly number[],
): number {
  if (values.length === 0) return Number.NaN;
  switch (statistic) {
    case 'media':
    case 'proporcion':
      return mean(values);
    case 'mediana':
      return median(values);
    case 'maximo':
      return Math.max(...values);
  }
}

/** Simple random sample of indices, without replacement. */
export function simpleRandomSample(size: number, n: number, random: Random): number[] {
  const indices = Array.from({ length: size }, (_, i) => i);
  for (let i = 0; i < Math.min(n, size); i += 1) {
    const j = i + Math.floor(random.next() * (size - i));
    [indices[i], indices[j]] = [indices[j] ?? 0, indices[i] ?? 0];
  }
  return indices.slice(0, Math.min(n, size));
}

/**
 * Biased sample: each unit is chosen with weight proportional to the square of
 * its rank, so large values are overrepresented, as when only the most
 * visible or most willing units answer.
 */
export function biasedSample(values: readonly number[], n: number, random: Random): number[] {
  const order = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
  const weights = new Map<number, number>();
  order.forEach((item, rank) => weights.set(item.index, (rank + 1) ** 2));
  const chosen: number[] = [];
  const available = new Set(values.map((_, index) => index));
  while (chosen.length < Math.min(n, values.length)) {
    let total = 0;
    for (const index of available) total += weights.get(index) ?? 0;
    let target = random.next() * total;
    let pick = -1;
    for (const index of available) {
      target -= weights.get(index) ?? 0;
      pick = index;
      if (target <= 0) break;
    }
    available.delete(pick);
    chosen.push(pick);
  }
  return chosen;
}

/** Every subset of size n of the indices 0, ..., size - 1, in lexicographic order. */
export function allSamples(size: number, n: number): number[][] {
  const result: number[][] = [];
  const current: number[] = [];
  const visit = (start: number) => {
    if (current.length === n) {
      result.push([...current]);
      return;
    }
    for (let i = start; i <= size - (n - current.length); i += 1) {
      current.push(i);
      visit(i + 1);
      current.pop();
    }
  };
  visit(0);
  return result;
}
