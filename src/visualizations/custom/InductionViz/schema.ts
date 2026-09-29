import { z } from 'zod';

export const parametersSchema = z
  .object({
    vista: z.enum(['fichas', 'escalera']).optional(),
    n: z.number().int().min(2).max(14).optional(),
  })
  .strict();

export type InductionVizConfig = z.infer<typeof parametersSchema>;
