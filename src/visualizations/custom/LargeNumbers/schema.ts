import { z } from 'zod';
import { LD_POPULATION_IDS } from '../../../lib/limits/largeDeviations.ts';
import { LLN_POPULATION_IDS } from '../../../lib/limits/lln.ts';

const meansMode = (mode: 'debil' | 'fuerte') =>
  z
    .object({
      modo: z.literal(mode),
      poblacion: z.enum(LLN_POPULATION_IDS),
      poblaciones: z.array(z.enum(LLN_POPULATION_IDS)).min(1).optional(),
      epsilon: z.number().positive().max(3).optional(),
      trayectorias: z.number().int().min(1).max(200).optional(),
      horizonte: z.number().int().min(50).max(5000).optional(),
      escalaLog: z.boolean().optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict();

export const parametersSchema = z.discriminatedUnion('modo', [
  meansMode('debil'),
  meansMode('fuerte'),
  z
    .object({
      modo: z.literal('logaritmo-iterado'),
      trayectorias: z.number().int().min(1).max(60).optional(),
      horizonte: z.number().int().min(1000).max(100000).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('grandes-desviaciones'),
      poblacion: z.enum(LD_POPULATION_IDS),
      poblaciones: z.array(z.enum(LD_POPULATION_IDS)).min(1).optional(),
      a: z.number().optional(),
      nMaximo: z.number().int().min(20).max(400).optional(),
    })
    .strict(),
]);

export type LargeNumbersConfig = z.infer<typeof parametersSchema>;
