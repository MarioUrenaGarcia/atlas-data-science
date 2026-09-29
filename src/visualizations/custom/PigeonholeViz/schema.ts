import { z } from 'zod';

export const parametersSchema = z
  .object({
    objetos: z.number().int().min(1).max(40).optional(),
    cajas: z.number().int().min(1).max(10).optional(),
    estrategia: z.enum(['repartir', 'azar']).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type PigeonholeVizConfig = z.infer<typeof parametersSchema>;
