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
  { component: 'SufficiencyLab', title: 'Suficiencia', params: { modo: 'suficiencia', n: 4 } },
  {
    component: 'SufficiencyLab',
    title: 'Factorización',
    params: {
      modo: 'factorizacion',
      muestras: [
        [1, 2, 3],
        [0, 2, 4],
        [2, 3, 4],
      ],
    },
  },
  { component: 'SufficiencyLab', title: 'Rao-Blackwell', params: { modo: 'rao-blackwell' } },
  { component: 'SufficiencyLab', title: 'Completitud', params: { modo: 'completitud' } },
  { component: 'SufficiencyLab', title: 'Ancilar y Basu', params: { modo: 'ancilar' } },
];
