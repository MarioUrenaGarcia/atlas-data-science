import { z } from 'zod';

const seed = z.number().int().nonnegative().optional();

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('borel-cantelli'),
      dependientes: z.boolean().optional(),
      exponente: z.number().min(0.5).max(2.5).optional(),
      constante: z.number().min(0.2).max(3).optional(),
      horizonte: z.number().int().min(100).max(100000).optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('cero-uno'),
      exponente: z.number().min(0.3).max(1.2).optional(),
      horizonte: z.number().int().min(100).max(50000).optional(),
      semilla: seed,
    })
    .strict(),
]);

export type TailEventsVizConfig = z.infer<typeof parametersSchema>;
