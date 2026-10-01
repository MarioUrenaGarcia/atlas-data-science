import { z } from 'zod';
import { DISTRIBUTION_IDS } from '../../shared/distributionIds.ts';

const values = z.record(z.string(), z.number());

export const parametersSchema = z
  .object({
    distribucion: z.enum(DISTRIBUTION_IDS),
    /** Initial values of the distribution parameters. */
    valores: values.optional(),
    /** Distribution parameters shown as fixed instead of adjustable. */
    fijos: z.array(z.string()).optional(),
    vista: z.enum(['densidad', 'acumulada']).optional(),
    /** Initial shaded interval. */
    desde: z.number().optional(),
    hasta: z.number().optional(),
    /** Initial cumulative probability for the quantile marker. */
    probabilidad: z.number().gt(0).lt(1).optional(),
    /** Whether the simulated sample histogram is shown at start. */
    muestras: z.boolean().optional(),
    dominio: z.tuple([z.number(), z.number()]).optional(),
    /** Custom slider ranges for examples in real units; they also apply to the reference curve. Use with dominio. */
    rangos: z.record(z.string(), z.tuple([z.number(), z.number()])).optional(),
    /** A fixed second curve drawn for comparison. */
    referencia: z
      .object({
        distribucion: z.enum(DISTRIBUTION_IDS),
        valores: values.optional(),
        etiqueta: z.string().min(1),
      })
      .strict()
      .optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type DistributionExplorerConfig = z.infer<typeof parametersSchema>;
