import {
  gamma,
  normal,
  type ContinuousDistribution,
  type Distribution,
} from '../../../lib/distributions/index.ts';
import { mean, median, standardDeviation, variance } from '../../../lib/stats/index.ts';
import type { StatisticId } from './schema.ts';

export const STATISTIC_LABELS: Record<StatisticId, string> = {
  media: 'Media muestral',
  mediana: 'Mediana muestral',
  varianza: 'Varianza muestral',
  desviacion: 'Desviación estándar muestral',
  proporcion: 'Proporción muestral',
  suma: 'Suma',
  'suma-estandarizada': 'Suma estandarizada',
  maximo: 'Máximo',
  minimo: 'Mínimo',
  rango: 'Rango',
};

export function computeStatistic(
  id: StatisticId,
  sample: readonly number[],
  population: Distribution,
): number {
  switch (id) {
    case 'media':
    case 'proporcion':
      return mean(sample);
    case 'mediana':
      return median(sample);
    case 'varianza':
      return sample.length > 1 ? variance(sample) : 0;
    case 'desviacion':
      return sample.length > 1 ? standardDeviation(sample) : 0;
    case 'suma':
      return sample.reduce((total, value) => total + value, 0);
    case 'suma-estandarizada': {
      const total = sample.reduce((sum, value) => sum + value, 0);
      return (
        (total - sample.length * population.mean) / Math.sqrt(sample.length * population.variance)
      );
    }
    case 'maximo':
      return Math.max(...sample);
    case 'minimo':
      return Math.min(...sample);
    case 'rango':
      return Math.max(...sample) - Math.min(...sample);
  }
}

export interface Theory {
  distribution: ContinuousDistribution;
  /** Whether the curve is exact or a large-sample approximation. */
  exact: boolean;
  label: string;
}

/**
 * Sampling distribution of the statistic when it is known in closed form or
 * through the central limit theorem. Returns null when neither applies, for
 * example for the mean of a Cauchy population.
 */
export function theoreticalSampling(
  id: StatisticId,
  n: number,
  population: Distribution,
  populationIsNormal: boolean,
): Theory | null {
  const mu = population.mean;
  const sigma2 = population.variance;
  const finite = Number.isFinite(mu) && Number.isFinite(sigma2) && sigma2 > 0;
  if (!finite) return null;
  switch (id) {
    case 'media':
    case 'proporcion':
      return {
        distribution: normal(mu, Math.sqrt(sigma2 / n)),
        exact: populationIsNormal,
        label: populationIsNormal
          ? 'Distribución exacta de la media'
          : 'Aproximación normal (teorema central del límite)',
      };
    case 'suma':
      return {
        distribution: normal(n * mu, Math.sqrt(n * sigma2)),
        exact: populationIsNormal,
        label: populationIsNormal
          ? 'Distribución exacta de la suma'
          : 'Aproximación normal de la suma',
      };
    case 'suma-estandarizada':
      return { distribution: normal(0, 1), exact: populationIsNormal, label: 'Normal estándar' };
    case 'varianza':
      if (!populationIsNormal || n < 2) return null;
      // (n - 1) S^2 / sigma^2 ~ chi-square(n - 1), so S^2 ~ Gamma((n - 1) / 2, rate (n - 1) / (2 sigma^2)).
      return {
        distribution: gamma((n - 1) / 2, (n - 1) / (2 * sigma2)),
        exact: true,
        label: 'Distribución exacta: múltiplo de una chi-cuadrada',
      };
    default:
      return null;
  }
}
