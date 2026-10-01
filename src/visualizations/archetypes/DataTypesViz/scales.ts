/** Measurement scales and the transformations that leave their information intact. */

export type ScaleId = 'nominal' | 'ordinal' | 'intervalo' | 'razon';
export type OperationId = 'igualdad' | 'orden' | 'diferencia' | 'cociente';
export type ScaleVariable = 'colores' | 'satisfaccion' | 'temperatura' | 'peso';

export const SCALE_ORDER: readonly ScaleId[] = ['nominal', 'ordinal', 'intervalo', 'razon'];

export const SCALE_NAMES: Record<ScaleId, string> = {
  nominal: 'Nominal',
  ordinal: 'Ordinal',
  intervalo: 'De intervalo',
  razon: 'De razón',
};

export const OPERATIONS: readonly { id: OperationId; label: string; tex: string }[] = [
  { id: 'igualdad', label: 'Igual o distinto', tex: '=,\\ \\neq' },
  { id: 'orden', label: 'Mayor o menor', tex: '<,\\ >' },
  { id: 'diferencia', label: 'Diferencias', tex: '+,\\ -' },
  { id: 'cociente', label: 'Cocientes', tex: '\\times,\\ \\div' },
];

/** Each scale allows its own operation and every operation of the weaker scales. */
export function allows(scale: ScaleId, operation: OperationId): boolean {
  const level = SCALE_ORDER.indexOf(scale);
  const needed = { igualdad: 0, orden: 1, diferencia: 2, cociente: 3 }[operation];
  return level >= needed;
}

export interface ScaleCase {
  scale: ScaleId;
  variable: string;
  unit: string;
  unitAfter: string;
  transformName: string;
  transformTex: string;
  /** Values of the ticks drawn on the original axis. */
  ticks: number[];
  /** Label of each tick (categories for nominal and ordinal variables). */
  tickLabels?: string[];
  transform: (value: number) => number;
  a: number;
  b: number;
}

const NOMINAL_RECODE = [3, 1, 2, 4];
const ORDINAL_RECODE = [1, 2, 4, 7, 10];
const POUNDS_PER_KILOGRAM = 2.20462;
const FAHRENHEIT_SLOPE = 1.8;
const FAHRENHEIT_OFFSET = 32;

export const SCALE_CASES: Record<ScaleVariable, ScaleCase> = {
  colores: {
    scale: 'nominal',
    variable: 'Color de ojos (código)',
    unit: '',
    unitAfter: '',
    transformName: 'Otra asignación de códigos',
    transformTex:
      '\\text{azul}\\!:1\\!\\mapsto\\!3,\\ \\text{café}\\!:2\\!\\mapsto\\!1,\\ \\text{verde}\\!:3\\!\\mapsto\\!2,\\ \\text{gris}\\!:4\\!\\mapsto\\!4',
    ticks: [1, 2, 3, 4],
    tickLabels: ['azul', 'café', 'verde', 'gris'],
    transform: (value) => NOMINAL_RECODE[Math.round(value) - 1] ?? value,
    a: 1,
    b: 3,
  },
  satisfaccion: {
    scale: 'ordinal',
    variable: 'Satisfacción (código)',
    unit: '',
    unitAfter: '',
    transformName: 'Recodificación creciente',
    transformTex: '1,2,3,4,5 \\mapsto 1,2,4,7,10',
    ticks: [1, 2, 3, 4, 5],
    tickLabels: ['muy baja', 'baja', 'media', 'alta', 'muy alta'],
    transform: (value) => ORDINAL_RECODE[Math.round(value) - 1] ?? value,
    a: 2,
    b: 4,
  },
  temperatura: {
    scale: 'intervalo',
    variable: 'Temperatura',
    unit: '°C',
    unitAfter: '°F',
    transformName: 'Cambio de grados Celsius a Fahrenheit',
    transformTex: 'F = 1.8\\,C + 32',
    ticks: [0, 10, 20, 30, 40],
    transform: (value) => FAHRENHEIT_SLOPE * value + FAHRENHEIT_OFFSET,
    a: 10,
    b: 20,
  },
  peso: {
    scale: 'razon',
    variable: 'Peso',
    unit: 'kg',
    unitAfter: 'lb',
    transformName: 'Cambio de kilogramos a libras',
    transformTex: 'L = 2.20462\\,K',
    ticks: [0, 20, 40, 60, 80, 100],
    transform: (value) => POUNDS_PER_KILOGRAM * value,
    a: 40,
    b: 80,
  },
};

export interface StatementCheck {
  operation: OperationId;
  before: string;
  after: string;
  /** Whether the statement keeps its meaning after the admissible transformation. */
  preserved: boolean;
}

function fixed(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

/**
 * Statements about the pair (a, b) before and after the transformation. A
 * statement is meaningful on a scale when every admissible transformation
 * preserves it; differences are compared through their ratio to the whole
 * range, which an affine change keeps.
 */
export function checkStatements(item: ScaleCase): StatementCheck[] {
  const { a, b, transform } = item;
  const ta = transform(a);
  const tb = transform(b);
  const [lo, hi] = [item.ticks[0] ?? 0, item.ticks[item.ticks.length - 1] ?? 1];
  const relativeBefore = (b - a) / (hi - lo);
  const relativeAfter = (tb - ta) / (transform(hi) - transform(lo));
  return [
    {
      operation: 'igualdad',
      before: a === b ? 'A = B' : 'A ≠ B',
      after: ta === tb ? 'A = B' : 'A ≠ B',
      preserved: (a === b) === (ta === tb),
    },
    {
      operation: 'orden',
      before: a < b ? 'A < B' : 'A > B',
      after: ta < tb ? 'A < B' : 'A > B',
      preserved: a < b === ta < tb,
    },
    {
      operation: 'diferencia',
      before: `B - A = ${fixed(b - a)}`,
      after: `B - A = ${fixed(tb - ta)}`,
      preserved: Math.abs(relativeBefore - relativeAfter) < 1e-9,
    },
    {
      operation: 'cociente',
      before: `B / A = ${fixed(b / a)}`,
      after: `B / A = ${fixed(tb / ta)}`,
      preserved: Math.abs(b / a - tb / ta) < 1e-9,
    },
  ];
}
