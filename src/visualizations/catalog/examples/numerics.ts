import type { CatalogExample } from '../examples.ts';

/** Catalog entries for the numerical analysis visualizations. */
export const NUMERICS_EXAMPLES: CatalogExample[] = [
  {
    component: 'NumericsLab',
    title: 'Punto flotante',
    params: { modo: 'flotante', valor: 0.1, formato: 'float32' },
  },
  {
    component: 'NumericsLab',
    title: 'Error y paso',
    params: { modo: 'error-paso', funcion: 'exponencial', x0: 1 },
  },
  {
    component: 'NumericsLab',
    title: 'Recurrencia inestable',
    params: { modo: 'estabilidad', caso: 'recurrencia' },
  },
  {
    component: 'NumericsLab',
    title: 'Varianza con desplazamiento',
    params: { modo: 'estabilidad', caso: 'varianza' },
  },
  {
    component: 'NumericsLab',
    title: 'Log-sum-exp',
    params: { modo: 'logsumexp', valores: [1, 2, 3.5] },
  },
  {
    component: 'NumericsLab',
    title: 'Interpolación de Runge',
    params: { modo: 'interpolacion', funcion: 'runge', n: 5 },
  },
  {
    component: 'NumericsLab',
    title: 'Spline cúbico',
    params: {
      modo: 'spline',
      puntos: [
        [0, 1],
        [1, 3],
        [2, 2],
        [3, 3.5],
        [4, 0.5],
        [5, 1],
      ],
      polinomio: true,
    },
  },
  {
    component: 'NumericsLab',
    title: 'Cuadratura',
    params: { modo: 'cuadratura', funcion: 'seno', reglas: ['trapecio', 'simpson', 'gauss'] },
  },
  {
    component: 'NumericsLab',
    title: 'Diferenciación automática',
    params: { modo: 'autodiff', x1: 2, x2: 3 },
  },
  {
    component: 'NumericsLab',
    title: 'Jacobi y Gauss-Seidel',
    params: {
      modo: 'iterativo',
      matriz: [
        [4, 1],
        [2, 5],
      ],
      b: [9, 13],
      inicio: [-2, 4],
      metodos: ['jacobi', 'gauss-seidel'],
    },
  },
  {
    component: 'NumericsLab',
    title: 'Euler y Runge-Kutta',
    params: { modo: 'edo', ecuacion: 'logistica', h: 0.5, metodos: ['euler', 'rk4'] },
  },
];
