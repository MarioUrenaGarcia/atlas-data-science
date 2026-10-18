import type { ScaleCaseId } from './schema.ts';

export interface ScaleCase {
  names: [string, string];
  units: [string, string];
  /** Rows of (first variable, second variable). */
  rows: readonly [number, number][];
  /** Extreme row added when the outlier option is on. */
  extreme: [number, number];
  /** Labels of the rows, used to name the query point and its neighbor. */
  labels: readonly string[];
}

export const SCALE_CASES: Record<ScaleCaseId, ScaleCase> = {
  clientes: {
    names: ['Edad', 'Ingreso mensual'],
    units: ['años', 'pesos'],
    rows: [
      [25, 21000],
      [62, 22500],
      [27, 31000],
      [45, 18000],
      [33, 42000],
      [51, 35000],
      [38, 26000],
      [58, 47000],
      [29, 15500],
      [41, 39000],
    ],
    extreme: [47, 250000],
    labels: ['Ana', 'Beto', 'Carla', 'Diego', 'Elsa', 'Fabián', 'Gina', 'Hugo', 'Irma', 'Joel'],
  },
  casas: {
    names: ['Superficie', 'Recámaras'],
    units: ['m²', 'recámaras'],
    rows: [
      [120, 3],
      [123, 1],
      [95, 2],
      [180, 4],
      [70, 1],
      [150, 3],
      [210, 5],
      [88, 2],
      [135, 4],
      [110, 2],
    ],
    extreme: [140, 12],
    labels: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'],
  },
  atletas: {
    names: ['Estatura', 'Tiempo en 100 m'],
    units: ['cm', 's'],
    rows: [
      [178, 11.2],
      [179, 13.4],
      [169, 11.6],
      [185, 12.1],
      [172, 12.9],
      [190, 11.0],
      [165, 13.1],
      [181, 12.5],
      [175, 11.8],
      [168, 12.3],
    ],
    extreme: [176, 19.5],
    labels: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'],
  },
};
