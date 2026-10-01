import type { SequenceId } from '../../../lib/limits/sequences.ts';

/** Vertical window of each sequence and whether its values are isolated spikes. */
export const SEQUENCE_DISPLAY: Record<SequenceId, { y: [number, number]; spikes: boolean }> = {
  'media-moneda': { y: [-0.5, 0.5], spikes: false },
  'ruido-decreciente': { y: [-2.5, 2.5], spikes: false },
  'maquina-de-escribir': { y: [-0.2, 1.2], spikes: true },
  'picos-independientes': { y: [-0.2, 1.2], spikes: true },
  'picos-cuadrado': { y: [-0.2, 1.2], spikes: true },
  'pico-creciente': { y: [-0.5, 6], spikes: true },
  'signo-alternante': { y: [-5, 5], spikes: false },
};
