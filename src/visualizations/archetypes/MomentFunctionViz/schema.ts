import { z } from 'zod';
import { DISTRIBUTION_IDS } from '../../shared/distributionIds.ts';

export const MOMENT_FUNCTION_MODES = ['fgm', 'cumulantes', 'caracteristica', 'fgp'] as const;

export const parametersSchema = z
  .object({
    modo: z.enum(MOMENT_FUNCTION_MODES),
    distribucion: z.enum(DISTRIBUTION_IDS).optional(),
    parametros: z.record(z.string(), z.number()).optional(),
    /** A finite distribution given directly; probabilities are normalized. */
    valores: z.array(z.number()).min(1).max(40).optional(),
    probabilidades: z.array(z.number().nonnegative()).min(1).max(40).optional(),
    nombre: z.string().min(1).optional(),
    /** Half width of the t window (MGF, cumulants) or its length (characteristic function). */
    t: z.number().positive().max(40).optional(),
    /** Highest order of the Taylor polynomial or of the probabilities read from the PGF. */
    orden: z.number().int().min(1).max(8).optional(),
    contexto: z.string().min(1).optional(),
  })
  .strict()
  .refine((value) => (value.distribucion === undefined) !== (value.valores === undefined), {
    message: 'indique una distribución o una lista de valores',
  });

export type MomentFunctionVizConfig = z.infer<typeof parametersSchema>;
