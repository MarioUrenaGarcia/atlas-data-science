import type { Random } from '../../../lib/random/index.ts';
import type { ScatterPreset } from './schema.ts';

export interface Point {
  x: number;
  y: number;
}

/** Coordinates live in a fixed [0, 10] x [0, 10] window. */
export const WINDOW = { min: 0, max: 10 } as const;

export const PRESET_LABELS: Record<ScatterPreset, string> = {
  'lineal-positiva': 'Relación lineal positiva',
  'lineal-negativa': 'Relación lineal negativa',
  'sin-relacion': 'Sin relación',
  curva: 'Relación curva',
  atipico: 'Con un valor atípico',
  heterocedastico: 'Dispersión creciente',
  grupos: 'Dos grupos',
  'anscombe-1': 'Anscombe I',
  'anscombe-2': 'Anscombe II',
  'anscombe-3': 'Anscombe III',
  'anscombe-4': 'Anscombe IV',
};

/** Anscombe's quartet (1973), rescaled into the plotting window. */
const ANSCOMBE: Record<'1' | '2' | '3' | '4', { x: number[]; y: number[] }> = {
  '1': {
    x: [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5],
    y: [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68],
  },
  '2': {
    x: [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5],
    y: [9.14, 8.14, 8.74, 8.77, 9.26, 8.1, 6.13, 3.1, 9.13, 7.26, 4.74],
  },
  '3': {
    x: [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5],
    y: [7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73],
  },
  '4': {
    x: [8, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8],
    y: [6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.5, 5.56, 7.91, 6.89],
  },
};

function clamp(value: number): number {
  return Math.min(WINDOW.max - 0.2, Math.max(WINDOW.min + 0.2, value));
}

export function generatePreset(preset: ScatterPreset, count: number, random: Random): Point[] {
  if (preset.startsWith('anscombe-')) {
    const data = ANSCOMBE[preset.slice(-1) as '1' | '2' | '3' | '4'];
    // Original ranges are roughly x in [4, 19] and y in [3, 13].
    return data.x.map((x, i) => ({
      x: clamp(((x - 2) / 18) * 10),
      y: clamp((((data.y[i] ?? 0) - 2) / 12) * 10),
    }));
  }
  if (preset === 'grupos') {
    // Two groups with a positive trend inside each, placed so that the pooled
    // trend is negative: the pattern behind Simpson's paradox.
    return Array.from({ length: count }, (_, i) => {
      const first = i % 2 === 0;
      const x = first ? random.uniform(0.6, 4.2) : random.uniform(5.2, 9.2);
      const y = first
        ? 6 + 0.7 * (x - 2.4) + random.normal(0, 0.5)
        : 2.4 + 0.7 * (x - 7.2) + random.normal(0, 0.5);
      return { x: clamp(x), y: clamp(y) };
    });
  }
  const points: Point[] = [];
  for (let i = 0; i < count; i += 1) {
    const x = random.uniform(0.8, 9.2);
    let y: number;
    switch (preset) {
      case 'lineal-positiva':
        y = 1.2 + 0.75 * x + random.normal(0, 0.9);
        break;
      case 'lineal-negativa':
        y = 8.8 - 0.7 * x + random.normal(0, 0.9);
        break;
      case 'sin-relacion':
        y = random.uniform(1, 9);
        break;
      case 'curva':
        y = 1 + 0.32 * (x - 5) ** 2 + random.normal(0, 0.45);
        break;
      case 'atipico':
        y = 2 + 0.6 * x + random.normal(0, 0.5);
        break;
      case 'heterocedastico':
        y = 1 + 0.7 * x + random.normal(0, 0.12 + 0.22 * x);
        break;
      default:
        y = random.uniform(1, 9);
    }
    points.push({ x: clamp(x), y: clamp(y) });
  }
  if (preset === 'atipico' && points.length > 0) points[points.length - 1] = { x: 8.8, y: 1.2 };
  return points;
}
