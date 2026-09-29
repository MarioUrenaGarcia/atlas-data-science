import { z } from 'zod';

export const parametersSchema = z
  .object({
    vista: z.enum(['ferrers', 'euler']).optional(),
    n: z.number().int().min(1).max(12).optional(),
  })
  .strict();

export type IntegerPartitionsVizConfig = z.infer<typeof parametersSchema>;
