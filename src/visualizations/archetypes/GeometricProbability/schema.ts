import { z } from 'zod';
import { GEOMETRIC_SCENARIOS } from '../../../lib/probability/geometric.ts';

export const parametersSchema = z
  .object({
    escenario: z.enum(GEOMETRIC_SCENARIOS),
    /** Meeting problem: minutes each person waits, over a window of `horizonte` minutes. */
    espera: z.number().min(1).max(60).optional(),
    horizonte: z.number().min(10).max(120).optional(),
    /** Disc scenario: radius of the favorable inner disc, and how the random point is drawn. */
    radio: z.number().min(0.05).max(1).optional(),
    muestreo: z.enum(['area', 'radio']).optional(),
    /** Quadratic scenario: upper limits of the uniform coefficients b and c. */
    bMax: z.number().min(0.5).max(6).optional(),
    cMax: z.number().min(0.5).max(6).optional(),
    puntos: z.number().int().min(100).max(20000).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type GeometricProbabilityConfig = z.infer<typeof parametersSchema>;
