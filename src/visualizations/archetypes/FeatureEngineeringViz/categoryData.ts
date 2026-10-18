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
    // Many tiny neighborhoods with small true differences: most of what the
    // in-sample encoding captures for them is each row's own price.
    noise: 7,
    categories: [
      { name: 'Centro', size: 30, mean: 35 },
      { name: 'Las Lomas', size: 20, mean: 41 },
      { name: 'Jardines', size: 12, mean: 38 },
      { name: 'Del Valle', size: 4, mean: 39 },
      { name: 'San Pedro', size: 3, mean: 36 },
      { name: 'El Mirador', size: 3, mean: 40 },
      { name: 'La Presa', size: 2, mean: 37 },
      { name: 'Los Pinos', size: 2, mean: 38 },
      { name: 'Las Flores', size: 2, mean: 39 },
      { name: 'El Roble', size: 1, mean: 38 },
      { name: 'La Loma', size: 1, mean: 37 },
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
  sucursales: {
    column: 'Sucursal',
    target: 'Ticket promedio',
    unit: 'pesos',
    noise: 30,
    categories: [
      { name: 'Centro', size: 40, mean: 150 },
      { name: 'Norte', size: 25, mean: 240 },
      { name: 'Sur', size: 25, mean: 120 },
      { name: 'Oriente', size: 12, mean: 180 },
      { name: 'Poniente', size: 6, mean: 160 },
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
