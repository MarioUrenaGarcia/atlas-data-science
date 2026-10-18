import { z } from 'zod';

const PROBLEM_IDS = [
  'media-normal',
  'varianza-normal',
  'maximo-uniforme',
  'media-exponencial',
] as const;

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('diana'),
      sesgo: z.number().min(0).max(2).optional(),
      dispersion: z.number().min(0.1).max(2).optional(),
      /** Four boards with every combination of low and high bias and variance. */
      cuatro: z.boolean().optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('comparar'),
      problema: z.enum(PROBLEM_IDS),
      /** Estimators shown, by id; defaults to all of the problem. */
      estimadores: z.array(z.string()).min(1).max(5).optional(),
      n: z.number().int().min(2).max(100).optional(),
      theta: z.number().positive().optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('consistencia'),
      problema: z.enum(PROBLEM_IDS),
      estimadores: z.array(z.string()).min(1).max(3).optional(),
      nMaximo: z.number().int().min(20).max(1000).optional(),
      epsilon: z.number().positive().optional(),
      theta: z.number().positive().optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('compromiso'),
      n: z.number().int().min(1).max(100).optional(),
      theta: z.number().positive().optional(),
      sigma: z.number().positive().optional(),
    })
    .strict(),
]);

export type EstimatorLabConfig = z.infer<typeof parametersSchema>;
