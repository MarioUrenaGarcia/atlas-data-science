import {
  selectionData,
  type FeatureSpec,
  type SelectionData,
} from '../../../lib/dataprep/selection.ts';

/** Crop yield example: three linear causes, an inverted U, a noisy copy of rain and three irrelevant codes. */
export const CROP_FEATURES: readonly FeatureSpec[] = [
  { name: 'Lluvia', role: 'lineal' },
  { name: 'Fertilizante', role: 'lineal' },
  { name: 'Horas de sol', role: 'lineal' },
  { name: 'Temperatura', role: 'cuadratica' },
  { name: 'Lluvia por satélite', role: 'redundante' },
  { name: 'Número de parcela', role: 'ruido' },
  { name: 'Letra del lote', role: 'ruido' },
  { name: 'Código del vendedor', role: 'ruido' },
];

export const ROLE_NAMES: Record<FeatureSpec['role'], string> = {
  lineal: 'efecto lineal',
  cuadratica: 'efecto en forma de U invertida',
  redundante: 'copia ruidosa de la lluvia',
  ruido: 'sin relación',
  interaccion: 'interacción',
};

export function cropData(seed: number, nTrain = 120): SelectionData {
  return selectionData(CROP_FEATURES, nTrain, 200, seed);
}
