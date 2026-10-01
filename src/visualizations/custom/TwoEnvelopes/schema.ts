import { z } from 'zod';

export const parametersSchema = z
  .object({
    /** The smaller amount is uniform on [1, maximo]. */
    maximo: z.number().min(10).max(1000).optional(),
    /** Threshold strategy: switch only when the opened envelope holds less than this. */
    umbral: z.number().min(0).max(2000).optional(),
    juegos: z.number().int().min(100).max(20000).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type TwoEnvelopesConfig = z.infer<typeof parametersSchema>;
