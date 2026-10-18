import { z } from 'zod';

const text = z.string().min(1);

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('reservorio'),
      /** Number of items in the stream. */
      longitud: z.number().int().min(5).max(60),
      k: z.number().int().min(1).max(12),
      /** Streams replayed after the first one to estimate inclusion frequencies. */
      repeticiones: z.number().int().min(0).max(5000).optional(),
      nombreElemento: text,
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('bola-de-nieve'),
      tamano: z.number().int().min(40).max(220),
      proporcion: z.number().min(0.05).max(0.6),
      homofilia: z.number().min(0.5).max(1),
      semillas: z.number().int().min(1).max(8),
      cupones: z.number().int().min(1).max(6),
      olas: z.number().int().min(1).max(8),
      nombreMiembro: text,
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('supervivencia'),
      unidades: z.number().int().min(10).max(120),
      periodos: z.number().int().min(3).max(20),
      /** Mean return per period across all units. */
      media: z.number(),
      /** Spread of the true mean return between units. */
      dispersion: z.number().min(0),
      /** Noise of each period's return. */
      volatilidad: z.number().positive(),
      /** A unit closes when its accumulated value falls below this level (start = 1). */
      umbral: z.number().min(0).max(1),
      nombreUnidad: text,
      nombrePeriodo: text,
      variable: text,
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
]);

export type SamplingProcessConfig = z.infer<typeof parametersSchema>;
export type ReservoirConfig = Extract<SamplingProcessConfig, { modo: 'reservorio' }>;
export type SnowballConfig = Extract<SamplingProcessConfig, { modo: 'bola-de-nieve' }>;
export type SurvivalConfig = Extract<SamplingProcessConfig, { modo: 'supervivencia' }>;
