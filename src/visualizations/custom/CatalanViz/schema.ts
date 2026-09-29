import { z } from 'zod';

export const parametersSchema = z
  .object({
    vista: z.enum(['caminos', 'parentesis', 'triangulaciones']).optional(),
    n: z.number().int().min(1).max(6).optional(),
  })
  .strict();

export type CatalanVizConfig = z.infer<typeof parametersSchema>;
