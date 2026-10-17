import type { CatalogExample } from '../examples.ts';

const households = {
  columnas: 20,
  filas: 12,
  estratos: [
    { nombre: 'Norte', media: 1500 },
    { nombre: 'Centro', media: 1900 },
    { nombre: 'Sur', media: 2400 },
  ],
  desviacion: 350,
  icc: 0.3,
  minimo: 400,
  decimales: 0,
  variable: 'Gasto semanal',
  unidad: 'pesos',
  nombreUnidad: 'Hogar',
};

/** Catalog entries for the sampling and experimental design visualizations. */
export const SAMPLING_EXAMPLES: CatalogExample[] = [
  {
    component: 'SurveySampler',
    title: 'Diseños de muestreo comparados',
    params: {
      diseno: 'estratificado',
      disenos: ['mas', 'estratificado', 'conglomerados', 'sistematico', 'pps'],
      n: 24,
      comparar: true,
      poblacion: households,
    },
  },
  {
    component: 'SamplingWeights',
    title: 'Asignación de Neyman',
    params: {
      modo: 'asignacion',
      asignacion: 'neyman',
      n: 60,
      variable: 'Ventas',
      estratos: [
        { nombre: 'Pequeñas', N: 600, S: 20 },
        { nombre: 'Medianas', N: 300, S: 80 },
        { nombre: 'Grandes', N: 100, S: 300, costo: 4 },
      ],
    },
  },
  {
    component: 'SamplingWeights',
    title: 'Post-estratificación por edad',
    params: {
      modo: 'postestratificacion',
      criterio: 'Grupo de edad',
      variable: 'Horas de pantalla',
      unidad: 'h',
      grupos: [
        { nombre: '18 a 29', poblacion: 0.3, muestra: 120, media: 6.1 },
        { nombre: '30 a 49', poblacion: 0.4, muestra: 200, media: 4.2 },
        { nombre: '50 o más', poblacion: 0.3, muestra: 180, media: 2.7 },
      ],
    },
  },
  {
    component: 'SamplingWeights',
    title: 'Raking por sexo y edad',
    params: {
      modo: 'raking',
      filas: { nombre: 'Sexo', categorias: ['Mujeres', 'Hombres'], objetivos: [5200, 4800] },
      columnas: {
        nombre: 'Edad',
        categorias: ['18 a 34', '35 a 54', '55 o más'],
        objetivos: [3500, 3800, 2700],
      },
      muestra: [
        [90, 140, 120],
        [60, 100, 90],
      ],
      medias: [
        [0.62, 0.48, 0.35],
        [0.55, 0.41, 0.3],
      ],
      variable: 'Apoyo',
    },
  },
  {
    component: 'SamplingWeights',
    title: 'Horvitz-Thompson con granjas',
    params: {
      modo: 'horvitz-thompson',
      diseno: 'pps',
      disenos: ['pps', 'poisson', 'mas'],
      n: 4,
      comparar: true,
      variable: 'Producción',
      unidad: 't',
      nombreTamano: 'Hectáreas',
      nombreUnidad: 'Granja',
      unidades: [
        { nombre: 'A', tamano: 12, valor: 30 },
        { nombre: 'B', tamano: 4, valor: 9 },
        { nombre: 'C', tamano: 30, valor: 70 },
        { nombre: 'D', tamano: 8, valor: 22 },
        { nombre: 'E', tamano: 20, valor: 41 },
        { nombre: 'F', tamano: 6, valor: 16 },
        { nombre: 'G', tamano: 15, valor: 33 },
        { nombre: 'H', tamano: 5, valor: 10 },
      ],
    },
  },
  {
    component: 'PrecisionPlanner',
    title: 'Tamaño de muestra',
    params: {
      modo: 'tamano',
      tipo: 'proporcion',
      p: 0.5,
      margen: 0.03,
      margenMaximo: 0.12,
      confianza: 0.95,
      N: 5000,
      variable: 'Intención de voto',
    },
  },
  {
    component: 'PrecisionPlanner',
    title: 'Margen de error',
    params: { modo: 'margen', p: 0.42, n: 1000, confianza: 0.95, variable: 'Aprobación' },
  },
  {
    component: 'PrecisionPlanner',
    title: 'Corrección por población finita',
    params: { modo: 'fpc', N: 200, S: 12, n: 120, variable: 'Calificación' },
  },
  {
    component: 'PrecisionPlanner',
    title: 'Efecto de diseño',
    params: {
      modo: 'deff',
      m: 20,
      rho: 0.05,
      n: 600,
      nombreConglomerado: 'Escuela',
      nombreUnidad: 'Alumno',
    },
  },
  {
    component: 'SamplingProcess',
    title: 'Reservorio',
    params: { modo: 'reservorio', longitud: 30, k: 5, nombreElemento: 'Registro' },
  },
  {
    component: 'SamplingProcess',
    title: 'Bola de nieve',
    params: {
      modo: 'bola-de-nieve',
      tamano: 160,
      proporcion: 0.25,
      homofilia: 0.9,
      semillas: 3,
      cupones: 3,
      olas: 5,
      nombreMiembro: 'Músico',
    },
  },
  {
    component: 'SamplingProcess',
    title: 'Supervivencia de fondos',
    params: {
      modo: 'supervivencia',
      unidades: 60,
      periodos: 10,
      media: 0.03,
      dispersion: 0.03,
      volatilidad: 0.15,
      umbral: 0.7,
      nombreUnidad: 'Fondo',
      nombrePeriodo: 'Año',
      variable: 'Rendimiento anual',
    },
  },
];
