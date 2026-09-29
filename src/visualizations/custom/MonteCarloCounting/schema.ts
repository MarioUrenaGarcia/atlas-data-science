import { z } from 'zod';

export const MONTE_CARLO_PROBLEMS = ['sin-unos-consecutivos', 'subconjuntos-suma'] as const;

export const parametersSchema = z
  .object({
    problema: z.enum(MONTE_CARLO_PROBLEMS).optional(),
    largo: z.number().int().min(8).max(30).optional(),
    limite: z.number().int().min(10).max(200).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type MonteCarloCountingConfig = z.infer<typeof parametersSchema>;
