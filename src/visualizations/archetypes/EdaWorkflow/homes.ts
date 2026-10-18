import { ENTRY_ERRORS, type Home, homesDataset, ZONES } from '../../../lib/stats/eda.ts';

export type NumericVariable = 'precio' | 'superficie' | 'habitaciones' | 'antiguedad';
export type Variable = NumericVariable | 'zona';

export const VARIABLE_NAMES: Record<Variable, string> = {
  precio: 'Precio (millones de pesos)',
  superficie: 'Superficie (m²)',
  habitaciones: 'Habitaciones',
  antiguedad: 'Antigüedad (años)',
  zona: 'Zona',
};

export const HOMES: readonly Home[] = homesDataset();
export { ENTRY_ERRORS, ZONES };

/** Values of a numeric variable for the given rows, null where missing. */
export function numeric(
  variable: NumericVariable,
  rows: readonly Home[] = HOMES,
): (number | null)[] {
  return rows.map((h) => h[variable]);
}

export function present(values: readonly (number | null)[]): number[] {
  return values.filter((v): v is number => v !== null);
}

/** Rows without the two capture errors in the floor area. */
export function cleanRows(): Home[] {
  return HOMES.filter((_, i) => !ENTRY_ERRORS.includes(i));
}
