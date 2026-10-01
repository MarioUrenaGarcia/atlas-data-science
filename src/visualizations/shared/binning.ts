import type { StandardizedPoint } from '../../lib/limits/clt.ts';

/** Equal-width bins given by their left edge and width. */
export interface Bins {
  start: number;
  width: number;
  count: number;
}

const TARGET_BINS = 40;

/**
 * Bins over [lo, hi]. For a lattice distribution with spacing `spacing` the
 * edges fall halfway between atoms and each bin holds a whole number of
 * atoms, so histograms of lattice values do not show aliasing stripes.
 */
export function makeBins(
  lo: number,
  hi: number,
  lattice: { spacing: number; origin: number } | null,
): Bins {
  const target = (hi - lo) / TARGET_BINS;
  if (!lattice) return { start: lo, width: target, count: TARGET_BINS };
  const perBin = Math.max(1, Math.round(target / lattice.spacing));
  const width = perBin * lattice.spacing;
  const firstEdge = lattice.origin - lattice.spacing / 2;
  const start = firstEdge + Math.floor((lo - firstEdge) / width) * width;
  return { start, width, count: Math.ceil((hi - start) / width) };
}

/** Histogram densities of the values: count / (total * width). */
export function binValues(values: readonly number[], bins: Bins): number[] {
  const counts = new Array<number>(bins.count).fill(0);
  for (const value of values) {
    const index = Math.floor((value - bins.start) / bins.width);
    if (index >= 0 && index < bins.count) counts[index] = (counts[index] ?? 0) + 1;
  }
  const total = Math.max(1, values.length);
  return counts.map((count) => count / (total * bins.width));
}

/** Exact probability of each bin divided by its width, from standardized masses. */
export function binMasses(points: readonly StandardizedPoint[], bins: Bins): number[] {
  const masses = new Array<number>(bins.count).fill(0);
  for (const { z, mass } of points) {
    const index = Math.floor((z - bins.start) / bins.width);
    if (index >= 0 && index < bins.count) masses[index] = (masses[index] ?? 0) + mass;
  }
  return masses.map((mass) => mass / bins.width);
}
