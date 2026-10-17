import type { Cell } from '../../../lib/stats/eda.ts';
import { homesDataset } from '../../../lib/stats/eda.ts';

export interface Column {
  nombre: string;
  valores: Cell[];
}

/** The home sales records as named columns, the default data of the quality views. */
export function homesColumns(): Column[] {
  const homes = homesDataset();
  return [
    { nombre: 'Zona', valores: homes.map((h) => h.zona) },
    { nombre: 'Superficie (m²)', valores: homes.map((h) => h.superficie) },
    { nombre: 'Habitaciones', valores: homes.map((h) => h.habitaciones) },
    { nombre: 'Antigüedad (años)', valores: homes.map((h) => h.antiguedad) },
    { nombre: 'Precio (millones)', valores: homes.map((h) => h.precio) },
  ];
}
