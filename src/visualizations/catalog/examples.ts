import { DESCRIPTIVE_EXAMPLES } from './examples/descriptive.ts';
import { DISTRIBUTION_EXAMPLES } from './examples/distributions.ts';
import { MULTIVARIABLE_EXAMPLES } from './examples/multivariable.ts';
import { LIMIT_EXAMPLES } from './examples/limits.ts';

/** Sample configurations shown in the development catalog, one or more per visualization. */
export interface CatalogExample {
  component: string;
  title: string;
  params: Record<string, unknown>;
}

export const CATALOG_EXAMPLES: CatalogExample[] = [
  { component: 'GamblersFallacy', title: 'Falacia del jugador', params: {} },
  { component: 'BertrandParadox', title: 'Paradoja de Bertrand', params: {} },
  { component: 'TwoEnvelopes', title: 'Dos sobres', params: {} },
  { component: 'StPetersburg', title: 'San Petersburgo', params: {} },
  { component: 'SecretaryProblem', title: 'Problema de la secretaria', params: {} },
  { component: 'CouponCollector', title: 'Coleccionista de cupones', params: {} },
  {
    component: 'GamblersRuin',
    title: 'Ruina del jugador',
    params: { inicial: 5, meta: 10, p: 0.47 },
  },
  {
    component: 'SimpsonParadox',
    title: 'Cálculos renales',
    params: {
      subgrupos: ['cálculos pequeños', 'cálculos grandes'],
      tratamientos: [
        {
          nombre: 'Cirugía abierta',
          datos: [
            { exitos: 81, total: 87 },
            { exitos: 192, total: 263 },
          ],
        },
        {
          nombre: 'Nefrolitotomía',
          datos: [
            { exitos: 234, total: 270 },
            { exitos: 55, total: 80 },
          ],
        },
      ],
    },
  },
  { component: 'BirthdayParadox', title: 'Cumpleaños', params: {} },
  { component: 'MontyHall', title: 'Monty Hall', params: {} },
  {
    component: 'BayesUpdater',
    title: 'Moneda equilibrada o cargada',
    params: {
      hipotesis: [
        { nombre: 'Equilibrada', prior: 0.5 },
        { nombre: 'Cargada', prior: 0.5 },
      ],
      observaciones: [
        { nombre: 'Cara', verosimilitudes: [0.5, 0.8] },
        { nombre: 'Cruz', verosimilitudes: [0.5, 0.2] },
      ],
      verdadera: 1,
    },
  },
  {
    component: 'IconArray',
    title: 'Prueba diagnóstica',
    params: {
      prevalencia: 0.01,
      sensibilidad: 0.9,
      especificidad: 0.95,
      condicion: 'tiene la enfermedad',
    },
  },
  {
    component: 'ProbabilityTree',
    title: 'Prueba diagnóstica',
    params: {
      niveles: ['Estado', 'Resultado'],
      ramas: [
        {
          etiqueta: 'Enfermo',
          prob: 0.1,
          ramas: [
            { etiqueta: 'Positivo', prob: 0.9 },
            { etiqueta: 'Negativo', prob: 0.1 },
          ],
        },
        {
          etiqueta: 'Sano',
          prob: 0.9,
          ramas: [
            { etiqueta: 'Positivo', prob: 0.2 },
            { etiqueta: 'Negativo', prob: 0.8 },
          ],
        },
      ],
      consultas: [
        { nombre: 'Positivo', hojas: ['Enfermo/Positivo', 'Sano/Positivo'] },
        {
          nombre: 'Enfermo dado positivo',
          hojas: ['Enfermo/Positivo'],
          condicion: ['Enfermo/Positivo', 'Sano/Positivo'],
        },
      ],
    },
  },
  {
    component: 'ProbabilitySquare',
    title: 'Teorema de Bayes',
    params: {
      modo: 'bayes',
      particion: [
        { etiqueta: 'Enfermo', prob: 0.1 },
        { etiqueta: 'Sano', prob: 0.9 },
      ],
      evento: 'Positivo',
      condicionales: [0.9, 0.2],
    },
  },
  {
    component: 'ProbabilitySquare',
    title: 'Probabilidad total',
    params: {
      modo: 'total',
      particion: [
        { etiqueta: 'Planta 1', prob: 0.5 },
        { etiqueta: 'Planta 2', prob: 0.3 },
        { etiqueta: 'Planta 3', prob: 0.2 },
      ],
      evento: 'Defectuosa',
      condicionales: [0.02, 0.05, 0.1],
    },
  },
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
    component: 'SampleSpaceLab',
    title: 'Eventos con dos dados',
    params: { modo: 'eventos', experimento: 'dos-dados', eventoA: 'suma-7', eventoB: 'dobles' },
  },
  {
    component: 'SampleSpaceLab',
    title: 'Regla de la suma',
    params: { modo: 'union', experimento: 'carta', eventoA: 'corazon', eventoB: 'figura' },
  },
  {
    component: 'SampleSpaceLab',
    title: 'Frecuencia relativa',
    params: { modo: 'frecuencia', experimento: 'dos-dados', eventoA: 'suma-7', trayectorias: 3 },
  },
  {
    component: 'SampleSpaceLab',
    title: 'Medida de probabilidad',
    params: { modo: 'medida', experimento: 'dado', eventoA: 'par', pesos: [1, 1, 1, 1, 1, 3] },
  },
  {
    component: 'SampleSpaceLab',
    title: 'Creencias como apuestas',
    params: { modo: 'apuestas' },
  },
  {
    component: 'SampleSpaceLab',
    title: 'Probabilidad condicional',
    params: { modo: 'condicional', experimento: 'dos-dados', eventoA: 'suma-8', eventoB: 'dobles' },
  },
  {
    component: 'GeometricProbability',
    title: 'Problema del encuentro',
    params: { escenario: 'encuentro', espera: 15 },
  },
  {
    component: 'GeometricProbability',
    title: 'Varilla rota',
    params: { escenario: 'varilla-rota' },
  },
  {
    component: 'GeometricProbability',
    title: 'Disco con radio uniforme',
    params: { escenario: 'disco', muestreo: 'radio' },
  },
  { component: 'BuffonNeedle', title: 'Aguja de Buffon', params: {} },
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
  {
    component: 'CombinatoricsBoard',
    title: 'Suma',
    params: {
      modo: 'suma',
      categorias: [
        { nombre: 'Sopas', opciones: ['caldo', 'crema', 'pozole'] },
        { nombre: 'Ensaladas', opciones: ['verde', 'rusa'] },
      ],
    },
  },
  {
    component: 'CombinatoricsBoard',
    title: 'Árbol',
    params: {
      modo: 'arbol',
      etapas: [
        { nombre: 'talla', opciones: ['S', 'M', 'L'] },
        { nombre: 'color', opciones: ['rojo', 'azul'] },
        { nombre: 'manga', opciones: ['corta', 'larga'] },
      ],
    },
  },
  {
    component: 'CombinatoricsBoard',
    title: 'Ordenaciones',
    params: { modo: 'ordenaciones', objetos: ['A', 'B', 'C', 'D'], permitirRepeticion: true, k: 3 },
  },
  { component: 'CombinatoricsBoard', title: 'Factorial', params: { modo: 'crecimiento' } },
  {
    component: 'CombinatoricsBoard',
    title: 'Anagramas',
    params: { modo: 'anagramas', palabra: 'CASAS' },
  },
  {
    component: 'CombinatoricsBoard',
    title: 'Mesa redonda',
    params: { modo: 'circular', personas: ['Ana', 'Beto', 'Caro', 'Dani', 'Eli'] },
  },
  {
    component: 'CombinatoricsBoard',
    title: 'Combinaciones',
    params: { modo: 'combinaciones', objetos: ['A', 'B', 'C', 'D', 'E'], k: 3 },
  },
  {
    component: 'CombinatoricsBoard',
    title: 'Estrellas y barras',
    params: { modo: 'estrellas-y-barras', tipos: ['fresa', 'limón', 'mango'], k: 4 },
  },
  { component: 'PascalTriangle', title: 'Triángulo', params: { modo: 'triangulo', filas: 10 } },
  {
    component: 'PascalTriangle',
    title: 'Caminos',
    params: { modo: 'caminos', derecha: 4, arriba: 3 },
  },
  {
    component: 'PascalTriangle',
    title: 'Identidades',
    params: {
      modo: 'identidades',
      identidad: 'pascal',
      identidades: ['pascal', 'vandermonde', 'simetria', 'suma-de-fila'],
    },
  },
  { component: 'PascalTriangle', title: 'Binomio', params: { modo: 'binomio', n: 4, a: 1, b: 2 } },
  { component: 'PascalTriangle', title: 'Multinomial', params: { modo: 'multinomial', n: 4 } },
  {
    component: 'VennSets',
    title: 'Inclusión y exclusión',
    params: {
      modo: 'inclusion-exclusion',
      universo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      conjuntos: [
        { etiqueta: 'A', elementos: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20] },
        { etiqueta: 'B', elementos: [3, 6, 9, 12, 15, 18] },
        { etiqueta: 'C', elementos: [5, 10, 15, 20] },
      ],
    },
  },
  { component: 'PigeonholeViz', title: 'Palomar', params: {} },
  { component: 'DerangementsViz', title: 'Desarreglos', params: {} },
  { component: 'CatalanViz', title: 'Catalan', params: { vista: 'triangulaciones' } },
  { component: 'IntegerPartitionsViz', title: 'Particiones', params: {} },
  { component: 'MonteCarloCounting', title: 'Monte Carlo', params: {} },
  { component: 'SetPartitionsViz', title: 'Bell', params: { modo: 'bell', n: 4 } },
  { component: 'SetPartitionsViz', title: 'Stirling', params: { modo: 'stirling', n: 5, k: 3 } },
  {
    component: 'GeneratingFunctionViz',
    title: 'Ordinaria',
    params: { modo: 'ordinaria', partes: [1, 2, 5, 10], nombre: 'moneda', objetivo: 20 },
  },
  {
    component: 'GeneratingFunctionViz',
    title: 'Exponencial',
    params: {
      modo: 'exponencial',
      letras: [
        { letra: 'A', regla: 'par' },
        { letra: 'B', regla: 'cualquiera' },
        { letra: 'C', regla: 'cualquiera' },
      ],
    },
  },
  { component: 'RecurrenceViz', title: 'Fibonacci', params: { c1: 1, c2: 1, a0: 0, a1: 1 } },
  {
    component: 'VectorPlane',
    title: 'Operaciones',
    params: { modo: 'operaciones', u: [2, 1], v: [1, 2] },
  },
  {
    component: 'VectorPlane',
    title: 'Combinación',
    params: { modo: 'combinacion', v1: [1, 0.5], v2: [-0.5, 1] },
  },
  {
    component: 'VectorPlane',
    title: 'Producto punto',
    params: { modo: 'producto-punto', u: [3, 1], v: [1, 2] },
  },
  { component: 'VectorPlane', title: 'Normas', params: { modo: 'normas', punto: [2, 1] } },
  {
    component: 'VectorPlane',
    title: 'Distancias',
    params: { modo: 'distancias', a: [-2, -1], b: [2, 2] },
  },
  {
    component: 'VectorPlane',
    title: 'Proyección',
    params: { modo: 'proyeccion', a: [1, 3], b: [3, 1] },
  },
  {
    component: 'VectorPlane',
    title: 'Gram-Schmidt',
    params: { modo: 'gram-schmidt', v1: [3, 1], v2: [2, 2] },
  },
  {
    component: 'VectorPlane',
    title: 'Cambio de base',
    params: { modo: 'cambio-base', b1: [2, 1], b2: [-1, 1], punto: [3, 3] },
  },
  {
    component: 'VectorPlane',
    title: 'Sistema',
    params: {
      modo: 'sistema',
      ecuaciones: [
        [1, 1, 3],
        [1, -1, 1],
      ],
    },
  },
  {
    component: 'MatrixTransform',
    title: 'Transformación',
    params: {
      modo: 'transformacion',
      matrices: [
        {
          nombre: 'A',
          matriz: [
            [2, 1],
            [1, 2],
          ],
        },
      ],
      circulo: true,
      propios: true,
    },
  },
  {
    component: 'MatrixTransform',
    title: 'Composición',
    params: {
      modo: 'composicion',
      pares: [
        {
          nombre: 'Rotación y escala',
          primera: [
            [0, -1],
            [1, 0],
          ],
          segunda: [
            [2, 0],
            [0, 1],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixTransform',
    title: 'Inversa',
    params: {
      modo: 'inversa',
      pares: [
        {
          nombre: 'Invertible',
          primera: [
            [2, 1],
            [1, 1],
          ],
        },
        {
          nombre: 'Singular',
          primera: [
            [1, 2],
            [0.5, 1],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixTransform',
    title: 'Propios',
    params: {
      modo: 'propios',
      matrices: [
        {
          nombre: 'A',
          matriz: [
            [3, 1],
            [0, 2],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixTransform',
    title: 'SVD',
    params: {
      modo: 'svd',
      matrices: [
        {
          nombre: 'A',
          matriz: [
            [2, 1],
            [0.5, 1.5],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixTransform',
    title: 'Forma cuadrática',
    params: {
      modo: 'forma-cuadratica',
      matrices: [
        {
          nombre: 'Definida positiva',
          matriz: [
            [2, 1],
            [1, 2],
          ],
        },
        {
          nombre: 'Indefinida',
          matriz: [
            [1, 2],
            [2, -1],
          ],
        },
        {
          nombre: 'Semidefinida',
          matriz: [
            [1, 1],
            [1, 1],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixTransform',
    title: 'Potencia',
    params: {
      modo: 'potencia',
      matrices: [
        {
          nombre: 'A',
          matriz: [
            [2, 1],
            [1, 3],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixTransform',
    title: 'Diagonalización',
    params: {
      modo: 'diagonalizacion',
      matrices: [
        {
          nombre: 'A',
          matriz: [
            [1, 2],
            [0, 3],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixTransform',
    title: 'Espectral',
    params: {
      modo: 'espectral',
      matrices: [
        {
          nombre: 'A',
          matriz: [
            [2, 1],
            [1, 2],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixTransform',
    title: 'Característico',
    params: {
      modo: 'caracteristico',
      matrices: [
        {
          nombre: 'A',
          matriz: [
            [2, 1],
            [1, 2],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixTransform',
    title: 'Subespacios',
    params: {
      modo: 'subespacios',
      matrices: [
        {
          nombre: 'Rango 1',
          matriz: [
            [1, 2],
            [2, 4],
          ],
        },
        {
          nombre: 'Rango 2',
          matriz: [
            [2, 1],
            [1, 3],
          ],
        },
        {
          nombre: 'Rango 0',
          matriz: [
            [0, 0],
            [0, 0],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixTransform',
    title: 'Pseudoinversa',
    params: {
      modo: 'pseudoinversa',
      matrices: [
        {
          nombre: 'A',
          matriz: [
            [1, 1],
            [1, 1],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixTransform',
    title: 'Estiramiento',
    params: {
      modo: 'estiramiento',
      matrices: [
        {
          nombre: 'A',
          matriz: [
            [3, 1],
            [1, 1],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixSteps',
    title: 'Gauss',
    params: {
      modo: 'gauss',
      aumentada: true,
      matrices: [
        {
          nombre: 'Sistema',
          matriz: [
            [2, 1, -1, 8],
            [-3, -1, 2, -11],
            [-2, 1, 2, -3],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixSteps',
    title: 'Rango',
    params: {
      modo: 'rango',
      reducida: true,
      matrices: [
        {
          nombre: 'A',
          matriz: [
            [1, 2, 1],
            [2, 4, 3],
            [3, 6, 4],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixSteps',
    title: 'LU',
    params: {
      modo: 'lu',
      matrices: [
        {
          nombre: 'A',
          matriz: [
            [2, 1, 1],
            [4, -6, 0],
            [-2, 7, 2],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixSteps',
    title: 'Cholesky',
    params: {
      modo: 'cholesky',
      matrices: [
        {
          nombre: 'A',
          matriz: [
            [4, 12, -16],
            [12, 37, -43],
            [-16, -43, 98],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixSteps',
    title: 'QR',
    params: {
      modo: 'qr',
      matrices: [
        {
          nombre: 'A',
          matriz: [
            [3, 2],
            [4, 1],
            [0, 2],
          ],
        },
      ],
    },
  },
  {
    component: 'MatrixGrid',
    title: 'Producto',
    params: {
      modo: 'operaciones',
      a: [
        [1, 2, 0],
        [3, -1, 4],
      ],
      b: [
        [2, 1],
        [0, 3],
        [1, -2],
      ],
    },
  },
  {
    component: 'MatrixGrid',
    title: 'Transpuesta',
    params: {
      modo: 'transpuesta',
      a: [
        [1, 2, 3],
        [4, 5, 6],
      ],
      b: [
        [1, 0],
        [2, 1],
        [0, 3],
      ],
    },
  },
  { component: 'MatrixGrid', title: 'Especiales', params: { modo: 'especiales' } },
  {
    component: 'MatrixGrid',
    title: 'Traza',
    params: {
      modo: 'traza',
      a: [
        [2, 1, 0],
        [1, 3, 4],
        [0, 2, 5],
      ],
      b: [
        [1, 0, 2],
        [3, 1, 0],
        [0, 1, 1],
      ],
    },
  },
  {
    component: 'MatrixGrid',
    title: 'Kronecker',
    params: {
      modo: 'kronecker',
      a: [
        [1, 2],
        [0, 3],
      ],
      b: [
        [1, -1],
        [2, 0],
      ],
    },
  },
  { component: 'MatrixGrid', title: 'Dispersa', params: { modo: 'dispersa', patron: 'rejilla' } },
  { component: 'MatrixGrid', title: 'Tensor', params: { modo: 'tensor' } },
  { component: 'MatrixGrid', title: 'Bajo rango', params: { modo: 'bajo-rango' } },
  {
    component: 'VectorPlane',
    title: 'Cerradura',
    params: {
      modo: 'cerradura',
      conjuntos: ['recta-origen', 'recta-desplazada', 'primer-cuadrante', 'union-ejes'],
    },
  },
  {
    component: 'Space3D',
    title: 'Espacio generado',
    params: {
      modo: 'generado',
      conjuntos: [
        {
          nombre: 'Dos independientes',
          vectores: [
            [2, 0, 1],
            [0, 2, 1],
          ],
        },
        {
          nombre: 'Tres coplanares',
          vectores: [
            [2, 0, 1],
            [0, 2, 1],
            [2, 2, 2],
          ],
        },
        {
          nombre: 'Tres independientes',
          vectores: [
            [2, 0, 0],
            [0, 2, 0],
            [1, 1, 2],
          ],
        },
      ],
    },
  },
  {
    component: 'Space3D',
    title: 'Proyección a un plano',
    params: { modo: 'proyeccion', a1: [2, 0, 0], a2: [1, 2, 0], b: [1, 1, 2.5] },
  },
  {
    component: 'CalculusViz',
    title: 'Transformaciones',
    params: {
      modo: 'transformaciones',
      funciones: ['cuadrada', 'seno', 'valor-absoluto'],
      valores: [-1.5, 2, 1, 0.5],
    },
  },
  {
    component: 'CalculusViz',
    title: 'Límite',
    params: {
      modo: 'limite',
      casos: ['removible', 'salto', 'infinito', 'oscilante'],
      epsilon: true,
    },
  },
  {
    component: 'CalculusViz',
    title: 'Secante',
    params: { modo: 'secante', funcion: 'cubica', x0: 0.5, h: 1.5 },
  },
  {
    component: 'CalculusViz',
    title: 'Derivadas',
    params: { modo: 'derivadas', funciones: ['cuartica', 'seno'], orden: 2, criticos: true },
  },
  {
    component: 'CalculusViz',
    title: 'Cadena',
    params: { modo: 'cadena', exterior: 'seno', interior: 'cuadrada', x0: 1 },
  },
  {
    component: 'CalculusViz',
    title: 'Convexidad',
    params: { modo: 'convexidad', funciones: ['cubica', 'exponencial'], cuerda: [-2, 0.5] },
  },
  {
    component: 'CalculusViz',
    title: "L'Hôpital",
    params: { modo: 'lhopital', casos: ['seno-x', 'uno-menos-coseno'] },
  },
  { component: 'CalculusViz', title: 'Exponencial', params: { modo: 'exponencial', base: 2 } },
  {
    component: 'CalculusViz',
    title: 'Taylor',
    params: { modo: 'taylor', funciones: ['sin', 'exp', 'log1p'], orden: 9 },
  },
  {
    component: 'CalculusViz',
    title: 'Riemann',
    params: { modo: 'riemann', funcion: 'seno', intervalo: [0, 4] },
  },
  {
    component: 'CalculusViz',
    title: 'Área',
    params: { modo: 'area', funcion: 'cubica', intervalo: [-2, 2] },
  },
  {
    component: 'CalculusViz',
    title: 'Acumulada',
    params: { modo: 'acumulada', funcion: 'coseno', desde: 0, hasta: 6.28 },
  },
  {
    component: 'CalculusViz',
    title: 'Sustitución',
    params: { modo: 'sustitucion', casos: ['coseno-cuadrado', 'logaritmo'] },
  },
  {
    component: 'CalculusViz',
    title: 'Partes',
    params: { modo: 'partes', casos: ['logaritmo', 'x-coseno'] },
  },
  {
    component: 'CalculusViz',
    title: 'Impropia',
    params: { modo: 'impropia', casos: ['inverso-cuadrado', 'reciproca', 'inverso-raiz'] },
  },
  { component: 'CalculusViz', title: 'Gamma', params: { modo: 'gamma', x: 3.5 } },
  { component: 'CalculusViz', title: 'Beta', params: { modo: 'beta', a: 2, b: 5 } },
  { component: 'CalculusViz', title: 'Stirling', params: { modo: 'stirling', n: 5 } },
  {
    component: 'CalculusViz',
    title: 'Indicadora',
    params: {
      modo: 'indicadora',
      intervalos: [
        [-1, 1],
        [2, 3.5],
      ],
    },
  },
  ...DESCRIPTIVE_EXAMPLES,
  ...DISTRIBUTION_EXAMPLES,
  ...MULTIVARIABLE_EXAMPLES,
  ...LIMIT_EXAMPLES,
];
