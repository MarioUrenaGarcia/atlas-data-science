import { z } from 'zod';
import { DISTRIBUTION_IDS } from '../../shared/distributionIds.ts';

export const ORDER_MODES = ['orden', 'extremos'] as const;

export const parametersSchema = z
  .object({
    modo: z.enum(ORDER_MODES),
    /** Continuous distribution of each draw; discrete choices fall back to the standard normal. */
    distribucion: z.enum(DISTRIBUTION_IDS),
    parametros: z.record(z.string(), z.number()).optional(),
    /** Sample size and rank of the order statistic. */
    n: z.number().int().min(2).max(30).optional(),
    k: z.number().int().min(1).max(30).optional(),
    /** Number of simulated samples. */
    muestras: z.number().int().min(50).max(5000).optional(),
    nombre: z.string().min(1).optional(),
    contexto: z.string().min(1).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict()
  .refine((value) => value.k === undefined || value.k <= (value.n ?? 5), {
    path: ['k'],
    message: 'el rango k no puede superar el tamaño de muestra n',
  });

export type OrderStatsVizConfig = z.infer<typeof parametersSchema>;
