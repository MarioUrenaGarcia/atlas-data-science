import { z } from 'zod';

export const parametersSchema = z
  .object({
    personas: z.number().int().min(2).max(100).optional(),
    /** Number of equally likely days; 365 for birthdays, smaller for analogous problems. */
    dias: z.number().int().min(10).max(366).optional(),
    /** Probability shown as a target line on the curve, such as 0.5. */
    objetivo: z.number().min(0.01).max(0.99).optional(),
    grupos: z.number().int().min(10).max(5000).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type BirthdayParadoxConfig = z.infer<typeof parametersSchema>;
