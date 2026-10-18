import { z } from 'zod';
import { DISTRIBUTION_IDS } from '../../shared/distributionIds.ts';

export const INEQUALITY_MODES = [
  'cola',
  'concentracion',
  'jensen',
  'holder',
  'union',
  'mcdiarmid',
  'medida',
] as const;

export const TAIL_BOUNDS = ['markov', 'chebyshev', 'cantelli'] as const;
export const SUM_BOUNDS = ['chebyshev', 'hoeffding', 'chernoff', 'bernstein'] as const;
export const JENSEN_FUNCTIONS = [
  'cuadrado',
  'exponencial',
  'logaritmo',
  'raiz',
  'valor-absoluto',
] as const;

export const parametersSchema = z
  .object({
    modo: z.enum(INEQUALITY_MODES),
    /** Tail bound compared with the exact tail in the tail mode. */
    cota: z.enum(TAIL_BOUNDS).optional(),
    distribucion: z.enum(DISTRIBUTION_IDS).optional(),
    parametros: z.record(z.string(), z.number()).optional(),
    /** Initial threshold: a for Markov, k for Chebyshev, t for Cantelli and the concentration modes. */
    umbral: z.number().optional(),
    /** Success probability of each trial and number of trials in the concentration mode. */
    p: z.number().gt(0).lt(1).optional(),
    n: z.number().int().min(1).max(2000).optional(),
    /** Bounds drawn in the concentration mode, the first one highlighted. */
    cotas: z.array(z.enum(SUM_BOUNDS)).min(1).optional(),
    /** Function and finite distribution of the Jensen mode. */
    funcion: z.enum(JENSEN_FUNCTIONS).optional(),
    valores: z.array(z.number()).min(1).max(12).optional(),
    probabilidades: z.array(z.number().nonnegative()).min(1).max(12).optional(),
    /** Correlation of the normal pair and Hölder exponent p in the Hölder mode. */
    rho: z.number().min(-0.99).max(0.99).optional(),
    exponente: z.number().min(1.05).max(8).optional(),
    /** Number of people and of possible birthdays in the union mode. */
    personas: z.number().int().min(2).max(100).optional(),
    dias: z.number().int().min(2).max(1000).optional(),
    /** Balls thrown into as many bins in the McDiarmid mode. */
    bolas: z.number().int().min(5).max(500).optional(),
    /** Dimension of the Gaussian vector in the measure concentration mode. */
    dimension: z.number().int().min(1).max(1000).optional(),
    muestras: z.number().int().min(100).max(5000).optional(),
    nombre: z.string().min(1).optional(),
    contexto: z.string().min(1).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.modo === 'cola' && (!value.cota || !value.distribucion)) {
      context.addIssue({
        code: 'custom',
        path: ['cota'],
        message: 'el modo cola requiere una cota y una distribucion',
      });
    }
    if (
      value.valores &&
      value.probabilidades &&
      value.valores.length !== value.probabilidades.length
    ) {
      context.addIssue({
        code: 'custom',
        path: ['probabilidades'],
        message: 'una probabilidad por valor',
      });
    }
  });

export type InequalityBoundConfig = z.infer<typeof parametersSchema>;
