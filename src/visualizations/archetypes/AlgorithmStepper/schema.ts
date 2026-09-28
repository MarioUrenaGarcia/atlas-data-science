import { z } from 'zod';
import { ALGORITHM_IDS } from './algorithmIds.ts';

export const parametersSchema = z
  .object({
    algoritmo: z.enum(ALGORITHM_IDS),
    /** Initial values of the algorithm's own controls. */
    valores: z.record(z.string(), z.union([z.number(), z.string(), z.boolean()])).optional(),
    /** Steps per second at normal speed. */
    ritmo: z.number().positive().max(20).optional(),
  })
  .strict();

export type AlgorithmStepperConfig = z.infer<typeof parametersSchema>;
