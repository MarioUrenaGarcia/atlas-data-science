import { z } from 'zod';

export const parametersSchema = z
  .object({
    /** Coefficients of a_n = c1 a_(n-1) + c2 a_(n-2). */
    c1: z.number().min(-6).max(6),
    c2: z.number().min(-9).max(9),
    a0: z.number().min(-10).max(10),
    a1: z.number().min(-10).max(10),
    terminos: z.number().int().min(8).max(30).optional(),
  })
  .strict();

export type RecurrenceVizConfig = z.infer<typeof parametersSchema>;
