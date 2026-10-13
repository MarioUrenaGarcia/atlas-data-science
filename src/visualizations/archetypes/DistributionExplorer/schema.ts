import { z } from 'zod';
import { DISTRIBUTION_IDS } from '../../shared/distributionIds.ts';

const values = z.record(z.string(), z.number());

export const REGIONS = ['intervalo', 'izquierda', 'derecha', 'colas'] as const;
export type Region = (typeof REGIONS)[number];

/** A reference parameter computed from the main parameters. */
const link = z
  .object({
    de: z.array(z.string()).min(1),
    potencias: z.array(z.number()).optional(),
    factor: z.number().optional(),
  })
  .strict();

/** A preset that loads parameter values and, optionally, a probability region. */
const preset = z
  .object({
    nombre: z.string().min(1).max(40),
    /** Context and the reason the shape looks the way it does. */
    descripcion: z.string().min(1).max(320),
    valores: values,
    region: z.enum(REGIONS).optional(),
    desde: z.number().optional(),
    hasta: z.number().optional(),
  })
  .strict();

export const parametersSchema = z
  .object({
    distribucion: z.enum(DISTRIBUTION_IDS),
    /** Initial values of the distribution parameters. */
    valores: values.optional(),
    /** Distribution parameters shown as fixed instead of adjustable. */
    fijos: z.array(z.string()).optional(),
    vista: z.enum(['densidad', 'acumulada']).optional(),
    /** Kind of probability region: a <= X <= b, X <= a, X >= a or both tails. */
    region: z.enum(REGIONS).optional(),
    /** Initial region bounds a and b. */
    desde: z.number().optional(),
    hasta: z.number().optional(),
    /** Initial cumulative probability for the quantile marker. */
    probabilidad: z.number().gt(0).lt(1).optional(),
    /** Whether the simulated sample histogram is enabled at start; samples are drawn only on demand. */
    muestras: z.boolean().optional(),
    dominio: z.tuple([z.number(), z.number()]).optional(),
    /** Custom slider ranges for examples in real units; they also apply to the reference curve. Use with dominio. */
    rangos: z.record(z.string(), z.tuple([z.number(), z.number()])).optional(),
    /** A second curve drawn for comparison, which can be switched on and off. */
    referencia: z
      .object({
        distribucion: z.enum(DISTRIBUTION_IDS),
        valores: values.optional(),
        /**
         * Reference parameters that follow the main ones, each as a product
         * factor * a^pa * b^pb ... of main parameters, such as λ = n p.
         */
        enlace: z.record(z.string(), link).optional(),
        etiqueta: z.string().min(1),
        visible: z.boolean().optional(),
      })
      .strict()
      .optional(),
    /** Up to six cases with real context that load with one click. */
    casos: z.array(preset).max(6).optional(),
    /** A worked example: context, question and the region whose probability answers it. */
    ejemplo: z
      .object({
        titulo: z.string().min(1).max(60),
        contexto: z.string().min(1).max(320),
        pregunta: z.string().min(1).max(240),
        valores: values,
        region: z.enum(REGIONS),
        desde: z.number(),
        hasta: z.number().optional(),
      })
      .strict()
      .optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type DistributionExplorerConfig = z.infer<typeof parametersSchema>;
export type ReferenceLink = z.infer<typeof link>;
export type ExplorerPreset = z.infer<typeof preset>;
