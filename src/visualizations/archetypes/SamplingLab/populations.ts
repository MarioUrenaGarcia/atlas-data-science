import {
  type ContinuousDistribution,
  exponential,
  lognormal,
  normal,
  uniform,
} from '../../../lib/distributions/index.ts';
import type { PopulationId } from './schema.ts';

export const POPULATION_NAMES: Record<PopulationId, string> = {
  normal: 'Normal',
  exponencial: 'Exponencial (asimétrica)',
  uniforme: 'Uniforme',
  lognormal: 'Lognormal (muy asimétrica)',
};

/**
 * Population with the requested mean and standard deviation in each family,
 * so that only the shape changes between options.
 */
export function makePopulation(
  id: PopulationId,
  mu: number,
  sigma: number,
): ContinuousDistribution {
  switch (id) {
    case 'normal':
      return normal(mu, sigma);
    case 'exponencial': {
      // An exponential with rate 1 / sigma has mean and sd sigma; shifting moves the mean to mu.
      const base = exponential(1 / sigma);
      const shift = mu - sigma;
      return {
        ...base,
        name: 'Exponencial desplazada',
        mean: mu,
        support: [shift, Number.POSITIVE_INFINITY],
        pdf: (x) => base.pdf(x - shift),
        cdf: (x) => base.cdf(x - shift),
        quantile: (p) => base.quantile(p) + shift,
        sample: (random) => base.sample(random) + shift,
      };
    }
    case 'uniforme': {
      const half = sigma * Math.sqrt(3);
      return uniform(mu - half, mu + half);
    }
    case 'lognormal': {
      // Log-scale parameters chosen so the mean is mu and the sd is sigma.
      const s2 = Math.log(1 + (sigma / mu) ** 2);
      return lognormal(Math.log(mu) - s2 / 2, Math.sqrt(s2));
    }
  }
}
