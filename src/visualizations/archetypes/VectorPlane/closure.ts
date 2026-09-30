import type { Vec2 } from './schema.ts';

export type PlaneSubset =
  'recta-origen' | 'recta-desplazada' | 'primer-cuadrante' | 'union-ejes' | 'plano' | 'origen';

export interface SubsetInfo {
  label: string;
  latex: string;
  /** Whether the set is a subspace of the plane. */
  subspace: boolean;
  /** Which requirement fails, when it is not a subspace. */
  failure: string;
  contains: (v: Vec2) => boolean;
  /** Closest point of the set, used to keep dragged vectors inside it. */
  project: (v: Vec2) => Vec2;
}

const SLOPE = 2;
const OFFSET = 1;
const TOLERANCE = 1e-9;

const onLine = (v: Vec2, offset: number) => Math.abs(v[1] - SLOPE * v[0] - offset) < TOLERANCE;

function projectOntoLine(v: Vec2, offset: number): Vec2 {
  // Closest point of y = SLOPE x + offset: move along the normal (-SLOPE, 1).
  const distance = (v[1] - SLOPE * v[0] - offset) / (1 + SLOPE * SLOPE);
  return [v[0] + SLOPE * distance, v[1] - distance];
}

export const SUBSETS: Record<PlaneSubset, SubsetInfo> = {
  'recta-origen': {
    label: 'Recta que pasa por el origen, y = 2x',
    latex: 'W = \\{(x, y) : y = 2x\\}',
    subspace: true,
    failure: '',
    contains: (v) => onLine(v, 0),
    project: (v) => projectOntoLine(v, 0),
  },
  'recta-desplazada': {
    label: 'Recta que no pasa por el origen, y = 2x + 1',
    latex: 'W = \\{(x, y) : y = 2x + 1\\}',
    subspace: false,
    failure: 'No contiene al vector cero, y la suma de dos de sus puntos se sale de la recta.',
    contains: (v) => onLine(v, OFFSET),
    project: (v) => projectOntoLine(v, OFFSET),
  },
  'primer-cuadrante': {
    label: 'Primer cuadrante (coordenadas no negativas)',
    latex: 'W = \\{(x, y) : x \\ge 0,\\ y \\ge 0\\}',
    subspace: false,
    failure:
      'Es cerrado bajo la suma, pero multiplicar por un escalar negativo lo saca del cuadrante.',
    contains: (v) => v[0] >= -TOLERANCE && v[1] >= -TOLERANCE,
    project: (v) => [Math.max(0, v[0]), Math.max(0, v[1])],
  },
  'union-ejes': {
    label: 'Unión de los dos ejes',
    latex: 'W = \\{(x, y) : x = 0 \\text{ o } y = 0\\}',
    subspace: false,
    failure: 'Es cerrado bajo escalares, pero la suma de un vector de cada eje cae fuera de ambos.',
    contains: (v) => Math.abs(v[0]) < TOLERANCE || Math.abs(v[1]) < TOLERANCE,
    project: (v) => (Math.abs(v[0]) < Math.abs(v[1]) ? [0, v[1]] : [v[0], 0]),
  },
  plano: {
    label: 'Todo el plano',
    latex: 'W = \\mathbb{R}^2',
    subspace: true,
    failure: '',
    contains: () => true,
    project: (v) => v,
  },
  origen: {
    label: 'Solo el origen',
    latex: 'W = \\{\\mathbf{0}\\}',
    subspace: true,
    failure: '',
    contains: (v) => Math.abs(v[0]) < TOLERANCE && Math.abs(v[1]) < TOLERANCE,
    project: () => [0, 0],
  },
};
