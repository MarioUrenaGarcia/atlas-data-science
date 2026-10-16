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
];
