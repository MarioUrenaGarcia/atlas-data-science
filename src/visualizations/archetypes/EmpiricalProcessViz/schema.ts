import { z } from 'zod';
import { DISTRIBUTION_IDS } from '../../shared/distributionIds.ts';

const seed = z.number().int().nonnegative().optional();

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('glivenko-cantelli'),
      poblacion: z
        .object({
          distribucion: z.enum(DISTRIBUTION_IDS),
          valores: z.record(z.string(), z.number()).optional(),
        })
        .strict(),
      poblaciones: z.array(z.enum(DISTRIBUTION_IDS)).min(1).optional(),
      horizonte: z.number().int().min(50).max(5000).optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('donsker-caminata'),
      nivel: z.number().int().min(1).max(11).optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('donsker-empirico'),
      n: z.number().int().min(5).max(2000).optional(),
      semilla: seed,
    })
    .strict(),
]);

export type EmpiricalProcessVizConfig = z.infer<typeof parametersSchema>;
