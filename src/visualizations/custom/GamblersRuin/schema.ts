import { z } from 'zod';

export const parametersSchema = z
  .object({
    /** Initial fortune, in betting units. */
    inicial: z.number().int().min(1).max(49).optional(),
    /** Fortune at which the gambler stops as a winner. */
    meta: z.number().int().min(2).max(50).optional(),
    /** Probability of winning each unit bet. */
    p: z.number().min(0.3).max(0.7).optional(),
    partidas: z.number().int().min(10).max(2000).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict()
  .refine((value) => (value.inicial ?? 5) < (value.meta ?? 10), {
    message: 'el capital inicial debe ser menor que la meta',
  });

export type GamblersRuinConfig = z.infer<typeof parametersSchema>;
