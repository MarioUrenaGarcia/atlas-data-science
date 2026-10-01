import { z } from 'zod';

export const parametersSchema = z
  .object({
    /** Maximum payout the bank can afford, as a power of two exponent; 0 means no limit. */
    limiteExponente: z.number().int().min(0).max(40).optional(),
    juegos: z.number().int().min(100).max(200000).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type StPetersburgConfig = z.infer<typeof parametersSchema>;
