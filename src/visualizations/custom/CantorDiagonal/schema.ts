import { z } from 'zod';

export const parametersSchema = z
  .object({
    filas: z.number().int().min(3).max(10).optional(),
    semilla: z.number().int().nonnegative().optional(),
    /** Fixed first rows of the list, as binary digits. */
    lista: z
      .array(z.array(z.union([z.literal(0), z.literal(1)])).min(1))
      .min(3)
      .max(10)
      .optional(),
  })
  .strict();

export type CantorDiagonalConfig = z.infer<typeof parametersSchema>;
