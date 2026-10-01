import type { CatalogExample } from '../examples.ts';

/** Catalog entries for the optimization visualizations. */
export const OPTIMIZATION_EXAMPLES: CatalogExample[] = [
  {
    component: 'OptimizerRace',
    title: 'Carrera de optimizadores',
    params: { modo: 'carrera', funciones: ['rosenbrock', 'cuadratica', 'himmelblau'], metodos: ['gradiente', 'newton', 'bfgs'], inicio: [-1.2, 1], tasa: 0.001 },
  },
  { component: 'OptimizerRace', title: 'Tasa de aprendizaje', params: { modo: 'tasa', funciones: ['cuadratica'], tasas: [0.02, 0.15, 0.205], inicio: [3, 1.5] } },
  { component: 'OptimizerRace', title: 'Búsqueda lineal', params: { modo: 'busqueda-lineal', funciones: ['cuadratica', 'rosenbrock'], inicio: [3, 1.5], alfa0: 0.3 } },
  { component: 'OptimizerRace', title: 'Varios inicios', params: { modo: 'inicios', funciones: ['himmelblau', 'girada'] } },
  { component: 'OptimizerRace', title: 'Nelder-Mead', params: { modo: 'poblacion', metodo: 'nelder-mead', funciones: ['himmelblau'], inicio: [-1, -1] } },
  { component: 'OptimizerRace', title: 'Recocido simulado', params: { modo: 'poblacion', metodo: 'recocido', funciones: ['rastrigin'], inicio: [3, 3] } },
  { component: 'OptimizerRace', title: 'Algoritmo genético', params: { modo: 'poblacion', metodo: 'genetico', funciones: ['rastrigin'] } },
  { component: 'OptimizerRace', title: 'Enjambre', params: { modo: 'poblacion', metodo: 'enjambre', funciones: ['himmelblau'] } },
  {
    component: 'OptimizerRace',
    title: 'Simplex',
    params: { modo: 'lineal', metodo: 'simplex', c: [3, 5], a: [[1, 0], [0, 2], [3, 2]], b: [4, 12, 18] },
  },
  { component: 'OptimizerRace', title: 'Dualidad', params: { modo: 'dualidad', objetivo: [1.5, 1.5], normal: [1, 1], cota: 1 } },
  {
    component: 'OptimizerRace',
    title: 'Gradiente proximal',
    params: { modo: 'proximal', matriz: [[2, 0.5], [0.5, 1]], centro: [2, 0.3], lambda: 0.8, inicio: [-0.5, 1.5] },
  },
  { component: 'OptimizerRace', title: 'Descenso estocástico', params: { modo: 'estocastico', lote: 4, tasa: 0.1 } },
  { component: 'OptimizerRace', title: 'Frente de Pareto', params: { modo: 'pareto' } },
  { component: 'OptimizerRace', title: 'Conjuntos convexos', params: { modo: 'convexo', conjuntos: ['disco', 'luna', 'poligono', 'anillo'] } },
  {
    component: 'OptimizerRace',
    title: 'Restricciones',
    params: {
      modo: 'restricciones',
      funciones: ['girada'],
      restricciones: [
        { a: [1, 0], c: 0.5, etiqueta: 'x \\le 0.5' },
        { a: [-1, -1], c: 0, etiqueta: 'x + y \\ge 0' },
      ],
      inicio: [-2, 2],
      tasa: 0.15,
    },
  },
];
