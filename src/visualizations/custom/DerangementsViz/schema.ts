import { z } from 'zod';

export const parametersSchema = z
  .object({
    n: z.number().int().min(2).max(10).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type DerangementsVizConfig = z.infer<typeof parametersSchema>;
