import { z } from 'zod';

export const parametersSchema = z
  .object({
    filas: z.number().int().min(3).max(10).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type CantorDiagonalConfig = z.infer<typeof parametersSchema>;
