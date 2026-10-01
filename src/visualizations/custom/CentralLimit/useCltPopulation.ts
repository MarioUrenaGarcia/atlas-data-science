import { useCallback, useMemo } from 'react';
import {
  CLT_POPULATIONS,
  latticeMoments,
  standardize,
  sumDistributions,
  type CltPopulationId,
  type StandardizedPoint,
} from '../../../lib/limits/clt.ts';
import { makeBins, type Bins } from '../../shared/binning.ts';

export const Z_DOMAIN: [number, number] = [-4, 4];

/**
 * Exact laws of the standardized sums Z_1..Z_maxN of a population, with bins
 * for Z_n that respect the lattice when there is one.
 */
export function useCltPopulation(id: CltPopulationId, maxN: number) {
  const population = CLT_POPULATIONS[id];
  const moments = useMemo(() => latticeMoments(population.masses), [population]);
  const sums = useMemo(() => sumDistributions(population.masses, maxN), [population, maxN]);
  const standardized = useCallback(
    (n: number): StandardizedPoint[] => {
      const sum = sums[Math.min(maxN, Math.max(1, n)) - 1];
      return sum ? standardize(sum, n, moments) : [];
    },
    [sums, moments, maxN],
  );
  const bins = useCallback(
    (n: number): Bins => {
      const sd = Math.sqrt(n * moments.variance);
      return makeBins(
        Z_DOMAIN[0],
        Z_DOMAIN[1],
        population.lattice
          ? {
              spacing: population.masses.step / sd,
              origin: (n * population.masses.start - n * moments.mean) / sd,
            }
          : null,
      );
    },
    [population, moments],
  );
  return { population, moments, sums, standardized, bins };
}
