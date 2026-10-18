import type { CatalogExample } from '../examples.ts';

/** Catalog entries for the measure theory visualizations. */
export const MEASURE_EXAMPLES: CatalogExample[] = [
  {
    component: 'MeasureLab',
    title: 'Sigma-álgebra generada',
    params: { modo: 'sigma', puntos: 4, generadores: [[0], [0, 1]] },
  },
  { component: 'MeasureLab', title: 'Conjunto de Cantor', params: { modo: 'cantor' } },
  {
    component: 'MeasureLab',
    title: 'Cubrimiento de los racionales',
    params: { modo: 'cubrimiento' },
  },
  {
    component: 'MeasureLab',
    title: 'Continuidad de la medida',
    params: { modo: 'continuidad', sentido: 'creciente' },
  },
  { component: 'MeasureLab', title: 'Preimagen', params: { modo: 'preimagen', funcion: 'onda' } },
  {
    component: 'MeasureLab',
    title: 'Casi seguramente',
    params: { modo: 'casi-seguro', funcion: 'raiz' },
  },
  {
    component: 'MeasureLab',
    title: 'Funciones simples',
    params: { modo: 'simple', funcion: 'cuadrado', enfoque: 'lebesgue' },
  },
  {
    component: 'MeasureLab',
    title: 'Sucesión de funciones',
    params: { modo: 'sucesion', caso: 'escalon-alto' },
  },
  {
    component: 'MeasureLab',
    title: 'Radon-Nikodym',
    params: { modo: 'radon', densidad: 'lineal' },
  },
  { component: 'MeasureLab', title: 'Fubini', params: { modo: 'fubini', caso: 'contraejemplo' } },
  { component: 'MeasureLab', title: 'Espacios Lp', params: { modo: 'lp', vista: 'bola' } },
];
