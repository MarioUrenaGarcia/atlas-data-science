import { z } from 'zod';

const seed = z.number().int().nonnegative().optional();

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('dimensionalidad'),
      /** Largest number of dimensions reached by the animation. */
      dimensiones: z.number().int().min(2).max(1000).optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('filtro'),
      k: z.number().int().min(1).max(8).optional(),
      semilla: seed,
    })
    .strict(),
  z.object({ modo: z.literal('envoltura'), semilla: seed }).strict(),
  z.object({ modo: z.literal('embebida'), semilla: seed }).strict(),
  z
    .object({
      modo: z.literal('informacion'),
      variable: z.number().int().min(0).max(7).optional(),
      semilla: seed,
    })
    .strict(),
  z.object({ modo: z.literal('rfe'), semilla: seed }).strict(),
]);

export type FeatureSelectionConfig = z.infer<typeof parametersSchema>;
