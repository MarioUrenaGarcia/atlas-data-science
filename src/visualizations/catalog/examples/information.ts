import type { CatalogExample } from '../examples.ts';

/** Catalog entries for the information theory visualizations. */
export const INFORMATION_EXAMPLES: CatalogExample[] = [
  {
    component: 'InformationViz',
    title: 'Sorpresa',
    params: {
      modo: 'sorpresa',
      eventos: [
        { nombre: 'moneda', p: 0.5 },
        { nombre: 'dado', p: 1 / 6 },
        { nombre: 'lotería', p: 0.001 },
      ],
    },
  },
  {
    component: 'InformationViz',
    title: 'Entropía',
    params: { modo: 'entropia', p: [0.7, 0.2, 0.1] },
  },
  {
    component: 'InformationViz',
    title: 'Información mutua',
    params: {
      modo: 'conjunta',
      tabla: [
        [0.4, 0.1],
        [0.1, 0.4],
      ],
      enfoque: 'mutua',
    },
  },
  {
    component: 'InformationViz',
    title: 'Divergencia KL',
    params: { modo: 'divergencia', p: [0.5, 0.3, 0.2], q: [0.2, 0.3, 0.5], enfoque: 'kl' },
  },
  {
    component: 'InformationViz',
    title: 'Asimetría de KL',
    params: { modo: 'asimetria', separacion: 3 },
  },
  {
    component: 'InformationViz',
    title: 'Entropía diferencial',
    params: { modo: 'diferencial', familia: 'normal' },
  },
  { component: 'InformationViz', title: 'Máxima entropía', params: { modo: 'maxent', media: 4.5 } },
  {
    component: 'InformationViz',
    title: 'Huffman',
    params: { modo: 'huffman', p: [0.4, 0.2, 0.2, 0.1, 0.1] },
  },
  {
    component: 'InformationViz',
    title: 'Codificación de fuente',
    params: { modo: 'fuente', p: 0.1 },
  },
  {
    component: 'InformationViz',
    title: 'Perplejidad',
    params: { modo: 'perplejidad', p: [0.5, 0.25, 0.15, 0.1], q: [0.25, 0.25, 0.25, 0.25] },
  },
  {
    component: 'InformationViz',
    title: 'Procesamiento de datos',
    params: { modo: 'procesamiento', ruido1: 0.1 },
  },
  {
    component: 'InformationViz',
    title: 'Wasserstein',
    params: { modo: 'wasserstein', p: [0.5, 0.5, 0, 0, 0], q: [0, 0, 0, 0.5, 0.5] },
  },
  {
    component: 'InformationViz',
    title: 'Divergencias f',
    params: { modo: 'divergencias-f', p: [0.5, 0.3, 0.2], q: [0.2, 0.4, 0.4], f: 'hellinger' },
  },
  { component: 'InformationViz', title: 'Longitud mínima de descripción', params: { modo: 'mdl' } },
];
