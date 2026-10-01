import type { Distribution } from '../../../lib/distributions/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import type { Region } from './schema.ts';

/** P(X <= x), counting the mass at x for discrete distributions. */
function atMost(distribution: Distribution, x: number): number {
  return distribution.kind === 'discrete' ? distribution.cdf(Math.floor(x)) : distribution.cdf(x);
}

/** P(X >= x), counting the mass at x for discrete distributions. */
function atLeast(distribution: Distribution, x: number): number {
  return distribution.kind === 'discrete'
    ? 1 - distribution.cdf(Math.ceil(x) - 1)
    : 1 - distribution.cdf(x);
}

/** Probability of the region; a and b are taken in increasing order. */
export function regionProbability(
  distribution: Distribution,
  region: Region,
  a: number,
  b: number,
): number {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  switch (region) {
    case 'intervalo':
      // P(lo <= X <= hi) = P(X <= hi) - P(X < lo), and P(X < lo) = 1 - P(X >= lo).
      return Math.max(0, atMost(distribution, hi) + atLeast(distribution, lo) - 1);
    case 'izquierda':
      return atMost(distribution, a);
    case 'derecha':
      return atLeast(distribution, a);
    case 'colas':
      return Math.min(1, atMost(distribution, lo) + atLeast(distribution, hi));
  }
}

/** Whether x belongs to the shaded region. */
export function inRegion(region: Region, a: number, b: number, x: number): boolean {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  switch (region) {
    case 'intervalo':
      return x >= lo && x <= hi;
    case 'izquierda':
      return x <= a;
    case 'derecha':
      return x >= a;
    case 'colas':
      return x <= lo || x >= hi;
  }
}

/** Readable expression of the region, such as "P(2 ≤ X ≤ 5)". */
export function regionLabel(region: Region, a: number, b: number): string {
  const lo = formatNumber(Math.min(a, b), 2);
  const hi = formatNumber(Math.max(a, b), 2);
  const first = formatNumber(a, 2);
  switch (region) {
    case 'intervalo':
      return `P(${lo} ≤ X ≤ ${hi})`;
    case 'izquierda':
      return `P(X ≤ ${first})`;
    case 'derecha':
      return `P(X ≥ ${first})`;
    case 'colas':
      return `P(X ≤ ${lo} o X ≥ ${hi})`;
  }
}

/** Whether the region uses the second bound b. */
export function usesSecondBound(region: Region): boolean {
  return region === 'intervalo' || region === 'colas';
}
