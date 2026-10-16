import { z } from 'zod';
import { TRANSFORM_IDS } from '../../../lib/probability/transform.ts';
import { DISTRIBUTION_IDS } from '../../shared/distributionIds.ts';

export const TRANSFORMATION_MODES = [
  'cdf',
  'jacobiano',
  'integral-probabilidad',
  'transformada-inversa',
] as const;

export const parametersSchema = z
  .object({
    modo: z.enum(TRANSFORMATION_MODES),
    /** Distribution of X (or the target distribution in inverse transform sampling). */
    distribucion: z.enum(DISTRIBUTION_IDS).optional(),
    parametros: z.record(z.string(), z.number()).optional(),
    transformacion: z.enum(TRANSFORM_IDS).optional(),
    /** Coefficients of the linear transformation a x + b. */
    a: z.number().optional(),
    b: z.number().optional(),
    /** Initial threshold y in the CDF method. */
    y: z.number().optional(),
    muestras: z.number().int().min(50).max(20000).optional(),
    contexto: z.string().min(1).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type TransformationVizConfig = z.infer<typeof parametersSchema>;
