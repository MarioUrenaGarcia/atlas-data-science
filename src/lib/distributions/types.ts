import type { Random } from '../random/index.ts';

interface DistributionBase {
  /** Human-readable name used in labels. */
  name: string;
  mean: number;
  variance: number;
  /** Closed support interval; infinite bounds are allowed. */
  support: readonly [number, number];
  cdf(x: number): number;
  quantile(p: number): number;
  sample(random: Random): number;
}

export interface ContinuousDistribution extends DistributionBase {
  kind: 'continuous';
  pdf(x: number): number;
}

export interface DiscreteDistribution extends DistributionBase {
  kind: 'discrete';
  pmf(k: number): number;
}

export type Distribution = ContinuousDistribution | DiscreteDistribution;

/** Density or mass, whichever applies. */
export function density(distribution: Distribution, x: number): number {
  return distribution.kind === 'continuous' ? distribution.pdf(x) : distribution.pmf(x);
}
