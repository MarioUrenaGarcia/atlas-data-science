import { z } from 'zod';

export const parametersSchema = z
  .object({
    candidatos: z.number().int().min(3).max(100).optional(),
    /** Candidates rejected before the rule starts choosing; defaults to the optimal value. */
    descartar: z.number().int().min(0).max(99).optional(),
    rondas: z.number().int().min(10).max(5000).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type SecretaryProblemConfig = z.infer<typeof parametersSchema>;
