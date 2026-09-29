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
  {
    component: 'LogicViz',
    title: 'Conectivos',
    params: { modo: 'conectivos', enunciados: { p: 'Llueve', q: 'El piso está mojado' } },
  },
  {
    component: 'LogicViz',
    title: 'Tabla de verdad',
    params: { modo: 'tabla', formula: 'modus-tollens' },
  },
  {
    component: 'LogicViz',
    title: 'Cuantificadores',
    params: { modo: 'cuantificadores', predicado: 'primo' },
  },
  {
    component: 'VennSets',
    title: 'Operaciones',
    params: {
      modo: 'operaciones',
      universo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      conjuntos: [
        { etiqueta: 'A', elementos: [2, 4, 6, 8, 10, 12] },
        { etiqueta: 'B', elementos: [3, 6, 9, 12] },
      ],
      operacion: 'union',
      operaciones: ['union', 'interseccion', 'complemento', 'diferencia', 'diferencia-simetrica'],
    },
  },
  {
    component: 'VennSets',
    title: 'Tres conjuntos',
    params: {
      modo: 'regiones',
      universo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      conjuntos: [
        { etiqueta: 'A', elementos: [2, 4, 6, 8, 10, 12, 14] },
        { etiqueta: 'B', elementos: [3, 6, 9, 12, 15] },
        { etiqueta: 'C', elementos: [2, 3, 5, 7, 11, 13] },
      ],
    },
  },
  {
    component: 'SetStructures',
    title: 'Notación',
    params: {
      modo: 'notacion',
      universo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      predicado: 'par',
    },
  },
  {
    component: 'SetStructures',
    title: 'Producto',
    params: { modo: 'producto', a: ['1', '2', '3'], b: ['x', 'y'] },
  },
  {
    component: 'SetStructures',
    title: 'Potencia',
    params: { modo: 'potencia', elementos: ['a', 'b', 'c', 'd'] },
  },
  {
    component: 'SetStructures',
    title: 'Partición',
    params: { modo: 'particion', elementos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  },
  {
    component: 'FunctionMapping',
    title: 'Clasificación',
    params: {
      modo: 'clasificacion',
      ejemplos: [
        {
          nombre: 'Ejemplo',
          dominio: ['a', 'b', 'c'],
          codominio: ['1', '2', '3'],
          flechas: [
            [0, 0],
            [1, 0],
            [2, 2],
          ],
        },
      ],
    },
  },
  {
    component: 'FunctionMapping',
    title: 'Composición',
    params: {
      modo: 'composicion',
      a: ['1', '2', '3'],
      b: ['p', 'q', 'r'],
      c: ['x', 'y'],
      f: [1, 0, 2],
      g: [0, 1, 1],
    },
  },
  {
    component: 'RelationViz',
    title: 'Congruencia',
    params: { elementos: [1, 2, 3, 4, 5, 6, 7, 8], relacion: 'congruencia' },
  },
  {
    component: 'SequenceSeries',
    title: 'Sucesión',
    params: { modo: 'sucesion', sucesion: 'euler' },
  },
  { component: 'SequenceSeries', title: 'Serie', params: { modo: 'serie', serie: 'armonica' } },
  {
    component: 'SequenceSeries',
    title: 'Sumatoria',
    params: { modo: 'sumatoria', expresion: 'cuadrados' },
  },
  { component: 'CountableSets', title: 'Racionales', params: { vista: 'racionales' } },
  { component: 'CantorDiagonal', title: 'Diagonal', params: {} },
  { component: 'InductionViz', title: 'Fichas', params: {} },
];
