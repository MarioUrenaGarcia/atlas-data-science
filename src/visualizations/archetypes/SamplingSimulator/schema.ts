import { z } from 'zod';
import { DISTRIBUTION_IDS } from '../../shared/distributionIds.ts';

export const STATISTICS = [
  'media',
  'mediana',
  'varianza',
  'desviacion',
  'proporcion',
  'suma',
  'suma-estandarizada',
  'maximo',
  'minimo',
  'rango',
] as const;

export type StatisticId = (typeof STATISTICS)[number];

export const parametersSchema = z
  .object({
    poblacion: z
      .object({
        distribucion: z.enum(DISTRIBUTION_IDS),
        valores: z.record(z.string(), z.number()).optional(),
      })
      .strict(),
    estadistico: z.enum(STATISTICS),
    /** Statistics offered in the selector; defaults to the initial one only. */
    estadisticos: z.array(z.enum(STATISTICS)).min(1).optional(),
    n: z.number().int().min(1).max(500).optional(),
    nMaximo: z.number().int().min(2).max(500).optional(),
    /** Overlay of the theoretical or approximate sampling distribution. */
    teoria: z.boolean().optional(),
    /** Whether the population parameters can be changed. */
    poblacionEditable: z.boolean().optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type SamplingSimulatorConfig = z.infer<typeof parametersSchema>;
