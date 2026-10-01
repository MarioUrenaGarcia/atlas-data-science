import { z } from 'zod';

export const parametersSchema = z
  .object({
    /** Probability of heads in each toss. */
    p: z.number().min(0.1).max(0.9).optional(),
    /** Streak length used in the header. */
    racha: z.number().int().min(1).max(8).optional(),
    lanzamientos: z.number().int().min(100).max(100000).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type GamblersFallacyConfig = z.infer<typeof parametersSchema>;
