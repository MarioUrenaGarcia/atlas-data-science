import type { CatalogExample } from '../examples.ts';

export const INFERENCE_EXAMPLES: CatalogExample[] = [
  {
    component: 'SamplingLab',
    title: 'Error estándar',
    params: { modo: 'error-estandar', poblacion: 'exponencial' },
  },
  {
    component: 'SamplingLab',
    title: 'Cochran',
    params: { modo: 'cochran', poblacion: 'normal', n: 8 },
  },
  {
    component: 'SamplingLab',
    title: 'Pivote t',
    params: { modo: 'pivote', poblacion: 'normal', n: 5 },
  },
  {
    component: 'EstimatorLab',
    title: 'Diana',
    params: { modo: 'diana', sesgo: 0.6, dispersion: 0.5 },
  },
  { component: 'EstimatorLab', title: 'Cuatro dianas', params: { modo: 'diana', cuatro: true } },
  {
    component: 'EstimatorLab',
    title: 'Comparar estimadores',
    params: { modo: 'comparar', problema: 'maximo-uniforme', n: 8 },
  },
  {
    component: 'EstimatorLab',
    title: 'Consistencia',
    params: { modo: 'consistencia', problema: 'media-normal', estimadores: ['media', 'primero'] },
  },
  { component: 'EstimatorLab', title: 'Compromiso', params: { modo: 'compromiso' } },
];
