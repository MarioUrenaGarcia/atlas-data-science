/** Untidy tables and their tidy versions, with the cell moves that connect them. */

export interface Table {
  headers: string[];
  rows: string[][];
}

/** A table cell; row -1 refers to the header. */
export type Cell = [number, number];

export interface TidyStep {
  source: Cell[];
  target: Cell[];
}

export interface TidyCase {
  name: string;
  problem: string;
  unit: string;
  source: Table;
  target: Table;
  steps: TidyStep[];
}

export type TidyCaseId = 'calificaciones' | 'clima' | 'ventas';

/** Wide to long: every value cell becomes one row keyed by its unit and its column header. */
function pivotLonger(
  name: string,
  problem: string,
  unit: string,
  idHeader: string,
  keyHeader: string,
  valueHeader: string,
  columns: string[],
  rows: [string, ...string[]][],
): TidyCase {
  const target: string[][] = [];
  const steps: TidyStep[] = [];
  rows.forEach(([id, ...values], r) => {
    values.forEach((value, c) => {
      steps.push({
        source: [
          [r, 0],
          [-1, c + 1],
          [r, c + 1],
        ],
        target: [
          [target.length, 0],
          [target.length, 1],
          [target.length, 2],
        ],
      });
      target.push([id, columns[c] ?? '', value]);
    });
  });
  return {
    name,
    problem,
    unit,
    source: { headers: [idHeader, ...columns], rows },
    target: { headers: [idHeader, keyHeader, valueHeader], rows: target },
    steps,
  };
}

function ventas(): TidyCase {
  const stores = ['Norte', 'Sur', 'Centro'];
  const measures = ['unidades', 'ingreso'];
  const values = [
    ['120', '3600'],
    ['80', '2800'],
    ['150', '4200'],
  ];
  const sourceRows: string[][] = [];
  const steps: TidyStep[] = [];
  stores.forEach((store, s) => {
    measures.forEach((measure, m) => {
      steps.push({
        source: [
          [sourceRows.length, 0],
          [sourceRows.length, 1],
          [sourceRows.length, 2],
        ],
        target: [
          [s, 0],
          [s, m + 1],
        ],
      });
      sourceRows.push([store, measure, values[s]?.[m] ?? '']);
    });
  });
  return {
    name: 'Ventas semanales por tienda',
    problem:
      'Los nombres de dos variables (unidades e ingreso) están guardados como valores de una columna.',
    unit: 'tienda',
    source: { headers: ['tienda', 'medida', 'valor'], rows: sourceRows },
    target: {
      headers: ['tienda', 'unidades', 'ingreso'],
      rows: stores.map((store, s) => [store, values[s]?.[0] ?? '', values[s]?.[1] ?? '']),
    },
    steps,
  };
}

export const TIDY_CASES: Record<TidyCaseId, TidyCase> = {
  calificaciones: pivotLonger(
    'Calificaciones por materia',
    'Los encabezados Matemáticas, Historia y Biología son valores de una variable (materia), no nombres de variables.',
    'estudiante en una materia',
    'estudiante',
    'materia',
    'calificación',
    ['Matemáticas', 'Historia', 'Biología'],
    [
      ['Ana', '9.1', '7.8', '8.5'],
      ['Beto', '6.4', '8.9', '7.2'],
      ['Carla', '8.0', '9.5', '9.0'],
    ],
  ),
  clima: pivotLonger(
    'Temperatura media mensual',
    'Los meses están repartidos en columnas: cada fila mezcla tres observaciones distintas.',
    'ciudad en un mes',
    'ciudad',
    'mes',
    'temperatura (°C)',
    ['enero', 'abril', 'julio'],
    [
      ['Monterrey', '14.6', '23.5', '29.1'],
      ['Mérida', '23.1', '28.2', '28.9'],
      ['Toluca', '9.8', '14.9', '14.5'],
    ],
  ),
  ventas: ventas(),
};
