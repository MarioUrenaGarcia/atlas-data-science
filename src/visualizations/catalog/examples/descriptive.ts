import type { CatalogExample } from '../examples.ts';

/** Catalog entries for the descriptive statistics visualizations. */
export const DESCRIPTIVE_EXAMPLES: CatalogExample[] = [
  {
    component: 'DataTypesViz',
    title: 'Población y muestra',
    params: {
      modo: 'poblacion',
      enfoque: 'muestra',
      tamano: 200,
      n: 12,
      forma: 'normal',
      centro: 165,
      dispersion: 8,
      estadistico: 'media',
      unidad: 'estudiante',
      variable: 'Estatura (cm)',
    },
  },
  {
    component: 'DataTypesViz',
    title: 'Parámetro y estadístico',
    params: {
      modo: 'poblacion',
      enfoque: 'parametro',
      tamano: 300,
      n: 20,
      forma: 'bernoulli',
      centro: 0.35,
      estadistico: 'proporcion',
      unidad: 'votante',
      variable: 'Apoya la propuesta',
      exito: 'sí',
    },
  },
  {
    component: 'DataTypesViz',
    title: 'Clasificar por escala',
    params: {
      modo: 'clasificar',
      eje: 'escala',
      ejemplos: [
        {
          nombre: 'Tipo de sangre',
          valores: 'A, B, AB, O',
          clase: 'nominal',
          razon: 'Solo distingue grupos.',
        },
        {
          nombre: 'Talla',
          valores: 'CH, M, G',
          clase: 'ordinal',
          razon: 'Hay orden, pero no distancias.',
        },
        {
          nombre: 'Año',
          valores: '1990, 2024',
          clase: 'intervalo',
          razon: 'El año cero es convencional.',
        },
        {
          nombre: 'Ingreso',
          valores: '0, 8500',
          clase: 'razon',
          razon: 'El cero es ausencia de ingreso.',
        },
      ],
    },
  },
  {
    component: 'DataTypesViz',
    title: 'Discreto y continuo',
    params: {
      modo: 'valores',
      discreta: { nombre: 'Hijos por hogar', unidad: 'hijos', desde: 2 },
      continua: { nombre: 'Estatura', unidad: 'cm', desde: 160, valor: 172.3648 },
    },
  },
  {
    component: 'DataTypesViz',
    title: 'Escalas',
    params: { modo: 'escalas', variable: 'temperatura' },
  },
  {
    component: 'DataTypesViz',
    title: 'Panel',
    params: {
      modo: 'panel',
      unidades: ['Jalisco', 'Sonora', 'Yucatán', 'Puebla'],
      periodos: ['2020', '2021', '2022', '2023'],
      variable: 'Desempleo (%)',
      valores: [
        [4.9, 4.1, 3.2, 2.9],
        [4.4, 3.8, 3.1, 2.8],
        [3.1, 2.6, 2.2, 2.0],
        [3.8, 3.5, 2.9, 2.6],
      ],
      faltantes: [[2, 1]],
    },
  },
  {
    component: 'DataTypesViz',
    title: 'Estructura',
    params: { modo: 'estructura', caso: 'pedidos' },
  },
  {
    component: 'DataTypesViz',
    title: 'Datos ordenados',
    params: { modo: 'ordenados', caso: 'clima' },
  },
];
