import type { OutlierCaseId } from './schema.ts';

export type OutlierTruth = 'normal' | 'extremo' | 'error';

export interface OutlierValue {
  value: number;
  truth: OutlierTruth;
  /** For capture errors: what probably happened and the corrected value, if any. */
  note?: string;
}

export interface OutlierCase {
  name: string;
  unit: string;
  /** Range of physically or logically possible values. */
  plausible: [number, number];
  /** Constant of the symmetric log scale, about the size of ordinary values. */
  symlog: number;
  values: readonly OutlierValue[];
}

const normals = (list: readonly number[]): OutlierValue[] =>
  list.map((value) => ({ value, truth: 'normal' }));

export const OUTLIER_CASES: Record<OutlierCaseId, OutlierCase> = {
  estatura: {
    name: 'Estatura de adultos registrada en una campaña de salud',
    unit: 'cm',
    plausible: [100, 230],
    symlog: 50,
    values: [
      ...normals([162, 171, 158, 176, 168, 181, 165, 159, 173, 170, 155, 178, 166, 169, 163]),
      { value: 203, truth: 'extremo', note: 'Jugador de baloncesto: estatura real' },
      ...normals([174, 160, 167, 172, 164]),
      { value: 1.72, truth: 'error', note: 'Capturada en metros: 172 cm' },
      { value: 17.2, truth: 'error', note: 'Punto decimal desplazado: 172 cm' },
      { value: 0, truth: 'error', note: 'Cero usado como valor faltante' },
      { value: 1680, truth: 'error', note: 'Capturada en milímetros: 168 cm' },
      { value: 148, truth: 'extremo', note: 'Persona de baja estatura: valor real' },
    ],
  },
  temperatura: {
    name: 'Temperatura horaria de una estación meteorológica en Mérida',
    unit: '°C',
    plausible: [-5, 50],
    symlog: 20,
    values: [
      ...normals([
        27.1, 29.4, 31.8, 33.5, 34.9, 35.6, 35.1, 33.7, 31.2, 29.0, 27.8, 26.5, 25.9, 25.1, 24.8,
        26.3,
      ]),
      { value: 41.5, truth: 'extremo', note: 'Onda de calor: valor real' },
      { value: 999, truth: 'error', note: 'Código de error del sensor' },
      ...normals([30.2, 32.6, 34.0]),
      { value: -40, truth: 'error', note: 'Sensor desconectado: valor por defecto' },
      { value: 95, truth: 'error', note: 'Registrada en grados Fahrenheit: 35 °C' },
      { value: 22.1, truth: 'extremo', note: 'Madrugada después de lluvia: valor real' },
    ],
  },
  montos: {
    name: 'Monto de compras en una tienda en línea',
    unit: 'pesos',
    plausible: [1, 200000],
    symlog: 500,
    values: [
      ...normals([350, 820, 1240, 560, 2300, 430, 990, 1780, 640, 3100, 270, 1450, 760, 5200, 880]),
      { value: 48000, truth: 'extremo', note: 'Compra de un equipo de cómputo: valor real' },
      ...normals([1120, 690, 2650]),
      { value: 1250000, truth: 'error', note: 'Ceros de más: 1250 pesos' },
      { value: -350, truth: 'error', note: 'Devolución capturada como compra' },
      { value: 15800, truth: 'extremo', note: 'Compra de muebles: valor real' },
    ],
  },
};
