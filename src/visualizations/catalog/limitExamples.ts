import type { CatalogExample } from './examples.ts';

/** Catalog entries for the limit theorem visualizations. */
export const LIMIT_EXAMPLES: CatalogExample[] = [
  {
    component: 'ConvergenceViz',
    title: 'Convergencia en probabilidad',
    params: {
      modo: 'probabilidad',
      sucesion: 'media-moneda',
      sucesiones: ['media-moneda', 'maquina-de-escribir', 'signo-alternante'],
    },
  },
  {
    component: 'ConvergenceViz',
    title: 'Convergencia casi segura',
    params: {
      modo: 'casi-segura',
      sucesion: 'picos-independientes',
      sucesiones: ['picos-independientes', 'picos-cuadrado'],
      epsilon: 0.5,
    },
  },
  {
    component: 'ConvergenceViz',
    title: 'Media cuadrática',
    params: {
      modo: 'media-cuadratica',
      sucesion: 'pico-creciente',
      sucesiones: ['pico-creciente', 'ruido-decreciente'],
    },
  },
  {
    component: 'ConvergenceViz',
    title: 'Distribución',
    params: {
      modo: 'distribucion',
      sucesion: 'maximo-uniformes',
      sucesiones: ['maximo-uniformes', 'binomial-poisson', 'punto-1-n'],
    },
  },
  {
    component: 'ConvergenceViz',
    title: 'Relaciones',
    params: {
      modo: 'relaciones',
      sucesion: 'maquina-de-escribir',
      sucesiones: ['maquina-de-escribir', 'pico-creciente', 'signo-alternante'],
    },
  },
  {
    component: 'LargeNumbers',
    title: 'Ley débil',
    params: {
      modo: 'debil',
      poblacion: 'dado',
      poblaciones: ['dado', 'moneda', 'pareto', 'cauchy'],
      epsilon: 0.3,
    },
  },
  {
    component: 'LargeNumbers',
    title: 'Ley fuerte',
    params: {
      modo: 'fuerte',
      poblacion: 'exponencial',
      epsilon: 0.15,
      escalaLog: true,
      horizonte: 3000,
    },
  },
  { component: 'LargeNumbers', title: 'Logaritmo iterado', params: { modo: 'logaritmo-iterado' } },
  {
    component: 'LargeNumbers',
    title: 'Grandes desviaciones',
    params: {
      modo: 'grandes-desviaciones',
      poblacion: 'bernoulli',
      poblaciones: ['bernoulli', 'normal', 'exponencial', 'poisson'],
    },
  },
  {
    component: 'CentralLimit',
    title: 'TCL clásico',
    params: {
      modo: 'clasico',
      poblacion: 'exponencial',
      poblaciones: ['exponencial', 'dado', 'bimodal', 'asimetrica-discreta'],
      n: 10,
    },
  },
  {
    component: 'CentralLimit',
    title: 'Convolución',
    params: {
      modo: 'convolucion',
      poblacion: 'uniforme',
      poblaciones: ['uniforme', 'arcoseno', 'lognormal'],
    },
  },
  {
    component: 'CentralLimit',
    title: 'Berry-Esseen',
    params: {
      modo: 'berry-esseen',
      poblacion: 'bernoulli',
      poblaciones: ['bernoulli', 'exponencial', 'uniforme'],
    },
  },
  {
    component: 'CentralLimit',
    title: 'Lyapunov',
    params: {
      modo: 'lyapunov',
      escenario: 'uniformes-crecientes',
      escenarios: ['uniformes-crecientes', 'uniformes-geometricas'],
    },
  },
  {
    component: 'CentralLimit',
    title: 'Lindeberg',
    params: {
      modo: 'lindeberg',
      escenario: 'bernoulli-raiz',
      escenarios: ['bernoulli-raiz', 'bernoulli-cuadraticas', 'normales-geometricas'],
      n: 60,
    },
  },
  {
    component: 'CentralLimit',
    title: 'Multivariado',
    params: {
      modo: 'multivariado',
      poblacion: 'parabola',
      poblaciones: ['parabola', 'dado-par', 'exponenciales-acumuladas'],
    },
  },
  {
    component: 'CentralLimit',
    title: 'Falla',
    params: {
      modo: 'falla',
      poblacion: 'cauchy',
      poblaciones: ['cauchy', 'pareto', 'exponencial'],
      n: 50,
    },
  },
  {
    component: 'AsymptoticTransform',
    title: 'Método delta',
    params: {
      modo: 'delta',
      poblacion: { distribucion: 'exponencial', valores: { lambda: 0.5 } },
      transformacion: 'logaritmo',
      transformaciones: ['logaritmo', 'inverso', 'cuadrado'],
    },
  },
  {
    component: 'AsymptoticTransform',
    title: 'Delta de segundo orden',
    params: {
      modo: 'delta',
      poblacion: { distribucion: 'bernoulli', valores: { p: 0.5 } },
      transformacion: 'varianza-bernoulli',
      n: 50,
    },
  },
  {
    component: 'AsymptoticTransform',
    title: 'Delta multivariado',
    params: {
      modo: 'delta-multivariado',
      medias: [4, 2],
      desviaciones: [1.5, 0.8],
      correlacion: 0.4,
      transformacion: 'cociente',
      transformaciones: ['cociente', 'producto', 'distancia'],
    },
  },
  {
    component: 'AsymptoticTransform',
    title: 'Slutsky',
    params: { modo: 'slutsky', variante: 'estadistico-t', n: 15 },
  },
  {
    component: 'AsymptoticTransform',
    title: 'Slutsky contraejemplo',
    params: { modo: 'slutsky', variante: 'contraejemplo' },
  },
  {
    component: 'AsymptoticTransform',
    title: 'Mapeo continuo',
    params: {
      modo: 'mapeo',
      funcion: 'cuadrado',
      funciones: ['cuadrado', 'valor-absoluto', 'exponencial', 'signo', 'indicadora-en-cero'],
    },
  },
  {
    component: 'TailEventsViz',
    title: 'Borel-Cantelli',
    params: { modo: 'borel-cantelli', exponente: 1.2 },
  },
  {
    component: 'TailEventsViz',
    title: 'Borel-Cantelli dependiente',
    params: { modo: 'borel-cantelli', dependientes: true },
  },
  { component: 'TailEventsViz', title: 'Ley 0-1', params: { modo: 'cero-uno', exponente: 0.6 } },
  {
    component: 'EmpiricalProcessViz',
    title: 'Glivenko-Cantelli',
    params: {
      modo: 'glivenko-cantelli',
      poblacion: { distribucion: 'normal' },
      poblaciones: ['normal', 'exponencial', 'beta'],
    },
  },
  {
    component: 'EmpiricalProcessViz',
    title: 'Donsker caminata',
    params: { modo: 'donsker-caminata' },
  },
  {
    component: 'EmpiricalProcessViz',
    title: 'Donsker empírico',
    params: { modo: 'donsker-empirico', n: 200 },
  },
];
