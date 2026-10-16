import { z } from 'zod';

export const POPULATIONS = ['normal', 'exponencial', 'uniforme', 'lognormal'] as const;
export type PopulationId = (typeof POPULATIONS)[number];

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('error-estandar'),
      poblacion: z.enum(POPULATIONS),
      /** Largest sample size of the sweep. */
      nMaximo: z.number().int().min(10).max(400).optional(),
      media: z.number().positive().optional(),
      desviacion: z.number().positive().optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('cochran'),
      poblacion: z.enum(POPULATIONS),
      n: z.number().int().min(2).max(50).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('pivote'),
      poblacion: z.enum(POPULATIONS),
      n: z.number().int().min(2).max(60).optional(),
      media: z.number().optional(),
      desviacion: z.number().positive().optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
]);

export type SamplingLabConfig = z.infer<typeof parametersSchema>;
