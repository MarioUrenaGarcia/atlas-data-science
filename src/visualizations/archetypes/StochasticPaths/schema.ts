import { z } from 'zod';
import { PROCESS_IDS } from '../../../lib/stochastic/paths.ts';

export const parametersSchema = z
  .object({
    proceso: z.enum(PROCESS_IDS),
    /** Initial values of the process parameters (x0, mu, sigma, theta, p, lambda). */
    valores: z
      .object({
        x0: z.number().optional(),
        mu: z.number().optional(),
        sigma: z.number().positive().optional(),
        theta: z.number().positive().optional(),
        p: z.number().min(0).max(1).optional(),
        lambda: z.number().positive().optional(),
      })
      .strict()
      .optional(),
    trayectorias: z.number().int().min(1).max(400).optional(),
    horizonte: z.number().positive().optional(),
    pasos: z.number().int().min(10).max(1000).optional(),
    /** Relative position in [0, 1] of the time slice. */
    corte: z.number().min(0).max(1).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type StochasticPathsConfig = z.infer<typeof parametersSchema>;
