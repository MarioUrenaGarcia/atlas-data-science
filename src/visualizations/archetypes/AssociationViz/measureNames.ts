import type { PairMeasure } from './schema.ts';

export const MEASURE_NAMES: Record<PairMeasure, string> = {
  covarianza: 'Covarianza muestral',
  pearson: 'Correlación de Pearson r',
  spearman: 'Correlación de Spearman',
  kendall: 'Tau de Kendall',
  distancia: 'Correlación de distancia',
};
