import { z } from 'zod';

export const MODES = [
  'exponencial',
  'suficiencia',
  'localizacion-escala',
  'conjugada',
  'mezcla',
  'compuesta',
  'continuidad',
  'colas',
  'subgaussiana',
  'empirica',
] as const;
export type FamilyMode = (typeof MODES)[number];

export const EXPONENTIAL_IDS = ['bernoulli', 'poisson', 'normal', 'exponencial'] as const;
export const BASE_IDS = ['normal', 'logistica', 'cauchy', 'laplace', 'gumbel'] as const;
export const CONJUGATE_IDS = ['beta-bernoulli', 'gamma-poisson', 'normal-normal'] as const;
export const TAIL_IDS = ['normal', 'exponencial', 'lognormal', 'pareto', 'cauchy', 't3'] as const;
export const SUBGAUSSIAN_IDS = ['normal', 'rademacher', 'uniforme', 'laplace', 't3'] as const;
export const EMPIRICAL_IDS = ['normal', 'exponencial', 'uniforme', 'lognormal'] as const;

const values = z.record(z.string(), z.number());

const preset = z
  .object({
    nombre: z.string().min(1).max(40),
    descripcion: z.string().min(1).max(320),
    valores: values,
  })
  .strict();

export const parametersSchema = z
  .object({
    modo: z.enum(MODES),
    /** Initial slider values; keys depend on the mode. */
    valores: values.optional(),
    /** Exponential family shown in the exponencial mode. */
    familia: z.enum(EXPONENTIAL_IDS).optional(),
    /** Standard family transformed in the localizacion-escala mode. */
    base: z.enum(BASE_IDS).optional(),
    /** Prior and likelihood pair of the conjugada mode. */
    modelo: z.enum(CONJUGATE_IDS).optional(),
    /** Distributions compared in the colas mode. */
    distribuciones: z.array(z.enum(TAIL_IDS)).min(1).max(6).optional(),
    /** Distribution checked against the sub-Gaussian bound. */
    subgaussiana: z.enum(SUBGAUSSIAN_IDS).optional(),
    /** Population sampled in the empirica mode. */
    poblacion: z.enum(EMPIRICAL_IDS).optional(),
    /** Initial Bernoulli sequence of the suficiencia mode, as ones and zeros. */
    secuencia: z
      .string()
      .regex(/^[01]{2,16}$/)
      .optional(),
    casos: z.array(preset).max(6).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type FamilyLabConfig = z.infer<typeof parametersSchema>;
