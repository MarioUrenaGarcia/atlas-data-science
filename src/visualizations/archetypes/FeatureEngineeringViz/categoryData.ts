import { Random } from '../../../lib/random/index.ts';
import type { TargetCaseId } from './schema.ts';

export interface CategorySpec {
  name: string;
  size: number;
  /** True mean of the target in this category. */
  mean: number;
}

export interface CategoryCase {
  column: string;
  target: string;
  unit: string;
  noise: number;
  categories: readonly CategorySpec[];
}

export const CATEGORY_CASES: Record<TargetCaseId, CategoryCase> = {
  colonias: {
    column: 'Colonia',
    target: 'Precio por m²',
    unit: 'miles de pesos',
    noise: 6,
    categories: [
      { name: 'Centro', size: 60, mean: 32 },
      { name: 'Las Lomas', size: 40, mean: 48 },
      { name: 'Jardines', size: 25, mean: 36 },
      { name: 'Del Valle', size: 12, mean: 41 },
      { name: 'San Pedro', size: 6, mean: 29 },
      { name: 'El Mirador', size: 3, mean: 44 },
      { name: 'La Presa', size: 2, mean: 33 },
      { name: 'Altavista', size: 1, mean: 39 },
    ],
  },
  marcas: {
    column: 'Marca del auto',
    target: 'Precio de reventa',
    unit: 'miles de pesos',
    noise: 40,
    categories: [
      { name: 'Marca A', size: 55, mean: 210 },
      { name: 'Marca B', size: 45, mean: 260 },
      { name: 'Marca C', size: 30, mean: 180 },
      { name: 'Marca D', size: 14, mean: 320 },
      { name: 'Marca E', size: 14, mean: 240 },
      { name: 'Marca F', size: 4, mean: 410 },
      { name: 'Marca G', size: 2, mean: 150 },
      { name: 'Marca H', size: 2, mean: 280 },
    ],
  },
};

export interface CategoryRows {
  categories: string[];
  y: number[];
}

/** Rows of the categorical table, shuffled so folds mix categories. */
export function categoryRows(item: CategoryCase, seed: number): CategoryRows {
  const random = new Random(seed);
  const rows: { c: string; y: number; key: number }[] = [];
  for (const spec of item.categories) {
    for (let i = 0; i < spec.size; i += 1) {
      rows.push({
        c: spec.name,
        y: Number(random.normal(spec.mean, item.noise).toFixed(1)),
        key: random.next(),
      });
    }
  }
  rows.sort((a, b) => a.key - b.key);
  return { categories: rows.map((r) => r.c), y: rows.map((r) => r.y) };
}
