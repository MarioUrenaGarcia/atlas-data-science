import { z } from 'zod';

export const parametersSchema = z
  .object({
    /** Coefficients of a_n = c1 a_(n-1) + c2 a_(n-2). */
    c1: z.number().min(-2).max(2),
    c2: z.number().min(-1).max(1),
    a0: z.number().min(-5).max(5),
    a1: z.number().min(-5).max(5),
    terminos: z.number().int().min(8).max(30).optional(),
  })
  .strict();

export type RecurrenceVizConfig = z.infer<typeof parametersSchema>;
