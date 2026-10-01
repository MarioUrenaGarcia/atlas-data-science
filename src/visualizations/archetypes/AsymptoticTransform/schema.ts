import { z } from 'zod';
import { BIVARIATE_TRANSFORM_IDS, TRANSFORM_IDS } from '../../../lib/limits/delta.ts';
import { MAP_IDS } from '../../../lib/limits/mapping.ts';
import { DISTRIBUTION_IDS } from '../../shared/distributionIds.ts';

const population = z
  .object({
    distribucion: z.enum(DISTRIBUTION_IDS),
    valores: z.record(z.string(), z.number()).optional(),
  })
  .strict();
const seed = z.number().int().nonnegative().optional();

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('delta'),
      poblacion: population,
      transformacion: z.enum(TRANSFORM_IDS),
      transformaciones: z.array(z.enum(TRANSFORM_IDS)).min(1).optional(),
      n: z.number().int().min(1).max(400).optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('delta-multivariado'),
      medias: z.tuple([z.number(), z.number()]),
      desviaciones: z.tuple([z.number().positive(), z.number().positive()]),
      correlacion: z.number().min(-0.95).max(0.95).optional(),
      transformacion: z.enum(BIVARIATE_TRANSFORM_IDS),
      transformaciones: z.array(z.enum(BIVARIATE_TRANSFORM_IDS)).min(1).optional(),
      n: z.number().int().min(2).max(400).optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('slutsky'),
      variante: z.enum(['estadistico-t', 'contraejemplo']),
      poblacion: population.optional(),
      n: z.number().int().min(2).max(300).optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('mapeo'),
      funcion: z.enum(MAP_IDS),
      funciones: z.array(z.enum(MAP_IDS)).min(1).optional(),
      nMaximo: z.number().int().min(10).max(400).optional(),
    })
    .strict(),
]);

export type AsymptoticTransformConfig = z.infer<typeof parametersSchema>;
