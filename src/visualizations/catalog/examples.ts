/** Sample configurations shown in the development catalog, one or more per visualization. */
export interface CatalogExample {
  component: string;
  title: string;
  params: Record<string, unknown>;
}

export const CATALOG_EXAMPLES: CatalogExample[] = [
  { component: 'DistributionExplorer', title: 'Normal', params: { distribucion: 'normal' } },
  {
    component: 'DistributionExplorer',
    title: 't frente a normal',
    params: {
      distribucion: 't',
      valores: { nu: 3 },
      referencia: { distribucion: 'normal', etiqueta: 'Normal estándar' },
    },
  },
  {
    component: 'DistributionExplorer',
    title: 'Poisson',
    params: { distribucion: 'poisson', valores: { lambda: 4 }, vista: 'acumulada' },
  },
  {
    component: 'DistributionExplorer',
    title: 'Beta',
    params: { distribucion: 'beta', valores: { a: 0.5, b: 0.5 } },
  },
  {
    component: 'SamplingSimulator',
    title: 'Media de una exponencial',
    params: {
      poblacion: { distribucion: 'exponencial' },
      estadistico: 'media',
      estadisticos: ['media', 'mediana', 'maximo'],
      n: 20,
    },
  },
  {
    component: 'SamplingSimulator',
    title: 'Varianza de una normal',
    params: { poblacion: { distribucion: 'normal' }, estadistico: 'varianza', n: 8 },
  },
  {
    component: 'ScatterPlayground',
    title: 'Conjuntos variados',
    params: {
      conjunto: 'lineal-positiva',
      conjuntos: ['lineal-positiva', 'curva', 'atipico', 'grupos', 'anscombe-2'],
      residuos: true,
    },
  },
  {
    component: 'MarkovChainViz',
    title: 'Clima de tres estados',
    params: {
      estados: ['Sol', 'Nubes', 'Lluvia'],
      matriz: [
        [0.7, 0.2, 0.1],
        [0.3, 0.4, 0.3],
        [0.2, 0.4, 0.4],
      ],
    },
  },
  {
    component: 'StochasticPaths',
    title: 'Movimiento browniano',
    params: { proceso: 'browniano', corte: 0.6 },
  },
  {
    component: 'StochasticPaths',
    title: 'Caminata aleatoria',
    params: { proceso: 'caminata', trayectorias: 40 },
  },
  {
    component: 'StochasticPaths',
    title: 'Ornstein-Uhlenbeck',
    params: { proceso: 'ornstein-uhlenbeck', valores: { x0: 3 }, horizonte: 4 },
  },
  { component: 'AlgorithmStepper', title: 'Bisección', params: { algoritmo: 'biseccion' } },
  {
    component: 'AlgorithmStepper',
    title: 'Newton-Raphson',
    params: { algoritmo: 'newton-raphson', valores: { funcion: 'arcotangente', x0: 1.2 } },
  },
];
