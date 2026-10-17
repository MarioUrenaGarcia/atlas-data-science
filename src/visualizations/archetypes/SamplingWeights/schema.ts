import { z } from 'zod';

const text = z.string().min(1);

const stratum = z
  .object({
    nombre: text,
    /** Number of units in the stratum, N_h. */
    N: z.number().int().positive(),
    /** Standard deviation within the stratum, S_h. */
    S: z.number().positive(),
    /** Cost of observing one unit, for the cost-optimal allocation. */
    costo: z.number().positive().optional(),
  })
  .strict();

const group = z
  .object({
    nombre: text,
    /** Population share or count of the group; shares are normalized. */
    poblacion: z.number().positive(),
    /** Respondents of the group in the sample. */
    muestra: z.number().int().nonnegative(),
    /** Mean of the variable among the group's respondents. */
    media: z.number(),
  })
  .strict();

const margin = z
  .object({
    nombre: text,
    categorias: z.array(text).min(2).max(5),
    objetivos: z.array(z.number().positive()).min(2).max(5),
  })
  .strict();

const unit = z
  .object({
    nombre: z.string().optional(),
    tamano: z.number().positive(),
    valor: z.number(),
  })
  .strict();

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('asignacion'),
      estratos: z.array(stratum).min(2).max(6),
      n: z.number().int().min(2).max(2000),
      asignacion: z.enum(['proporcional', 'neyman', 'igual', 'optima']),
      variable: text,
      unidad: z.string().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('postestratificacion'),
      grupos: z.array(group).min(2).max(6),
      variable: text,
      unidad: z.string().optional(),
      decimales: z.number().int().min(0).max(3).optional(),
      /** Name of the grouping variable, such as "Grupo de edad". */
      criterio: text,
    })
    .strict(),
  z
    .object({
      modo: z.literal('raking'),
      filas: margin,
      columnas: margin,
      muestra: z.array(z.array(z.number().nonnegative()).min(2).max(5)).min(2).max(5),
      /** Mean of the variable in each cell, to show the weighted estimate. */
      medias: z.array(z.array(z.number()).min(2).max(5)).min(2).max(5).optional(),
      iteraciones: z.number().int().min(1).max(12).optional(),
      variable: z.string().optional(),
      unidad: z.string().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('horvitz-thompson'),
      unidades: z.array(unit).min(4).max(40),
      n: z.number().int().min(1).max(20),
      diseno: z.enum(['pps', 'poisson', 'mas']),
      disenos: z
        .array(z.enum(['pps', 'poisson', 'mas']))
        .min(2)
        .max(3)
        .optional(),
      /** Overlays the naive estimator N times the sample mean. */
      comparar: z.boolean().optional(),
      repeticiones: z.number().int().min(1).max(2000).optional(),
      variable: text,
      unidad: z.string().optional(),
      nombreTamano: text,
      nombreUnidad: text,
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
]);

export type SamplingWeightsConfig = z.infer<typeof parametersSchema>;
export type AllocationConfig = Extract<SamplingWeightsConfig, { modo: 'asignacion' }>;
export type PostStratConfig = Extract<SamplingWeightsConfig, { modo: 'postestratificacion' }>;
export type RakingConfig = Extract<SamplingWeightsConfig, { modo: 'raking' }>;
export type HtConfig = Extract<SamplingWeightsConfig, { modo: 'horvitz-thompson' }>;
