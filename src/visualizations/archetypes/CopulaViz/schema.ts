import { z } from 'zod';
import { COPULA_IDS } from '../../../lib/probability/copula.ts';
import { DISTRIBUTION_IDS } from '../../shared/distributionIds.ts';

export const COPULA_MODES = ['copula', 'sklar', 'colas'] as const;

export const parametersSchema = z
  .object({
    modo: z.enum(COPULA_MODES),
    familia: z.enum(COPULA_IDS),
    /** Families offered in the selector; the configured one is always included. */
    familias: z.array(z.enum(COPULA_IDS)).min(1).optional(),
    /** Strength of dependence as Kendall's tau; each family converts it to its own parameter. */
    tau: z.number().min(0).max(0.9).optional(),
    /** Marginal distributions of X and Y in Sklar's construction. */
    margenX: z.enum(DISTRIBUTION_IDS).optional(),
    parametrosX: z.record(z.string(), z.number()).optional(),
    margenY: z.enum(DISTRIBUTION_IDS).optional(),
    parametrosY: z.record(z.string(), z.number()).optional(),
    nombreX: z.string().min(1).optional(),
    nombreY: z.string().min(1).optional(),
    muestras: z.number().int().min(100).max(4000).optional(),
    /** Threshold q of the tail view: the corners are u, v > q and u, v <= 1 - q. */
    q: z.number().min(0.5).max(0.995).optional(),
    contexto: z.string().min(1).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type CopulaVizConfig = z.infer<typeof parametersSchema>;
