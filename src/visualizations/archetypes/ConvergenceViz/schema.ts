import { z } from 'zod';
import { DISTRIBUTION_SEQUENCE_IDS } from '../../../lib/limits/distributionSequences.ts';
import { SEQUENCE_IDS } from '../../../lib/limits/sequences.ts';

const sequence = z.enum(SEQUENCE_IDS);
const sequences = z.array(sequence).min(1).max(7);

const pathMode = (mode: 'probabilidad' | 'casi-segura' | 'media-cuadratica') =>
  z
    .object({
      modo: z.literal(mode),
      sucesion: sequence,
      sucesiones: sequences.optional(),
      epsilon: z.number().min(0.02).max(0.9).optional(),
      trayectorias: z.number().int().min(10).max(300).optional(),
      horizonte: z.number().int().min(20).max(1000).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict();

export const parametersSchema = z.discriminatedUnion('modo', [
  pathMode('probabilidad'),
  pathMode('casi-segura'),
  pathMode('media-cuadratica'),
  z
    .object({
      modo: z.literal('distribucion'),
      sucesion: z.enum(DISTRIBUTION_SEQUENCE_IDS),
      sucesiones: z.array(z.enum(DISTRIBUTION_SEQUENCE_IDS)).min(1).max(6).optional(),
      n: z.number().int().min(1).max(200).optional(),
      nMaximo: z.number().int().min(5).max(200).optional(),
      x0: z.number().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('relaciones'),
      sucesion: sequence,
      sucesiones: sequences.optional(),
    })
    .strict(),
]);

export type ConvergenceVizConfig = z.infer<typeof parametersSchema>;
export type PathMode = 'probabilidad' | 'casi-segura' | 'media-cuadratica';
