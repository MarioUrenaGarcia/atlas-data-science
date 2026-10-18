import { z } from 'zod';

const text = z.string().min(1);
const confidence = z.union([z.literal(0.8), z.literal(0.9), z.literal(0.95), z.literal(0.99)]);

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('tamano'),
      tipo: z.enum(['proporcion', 'media']),
      /** Anticipated proportion, for proportions. */
      p: z.number().min(0.01).max(0.99).optional(),
      /** Anticipated standard deviation, for means. */
      S: z.number().positive().optional(),
      margen: z.number().positive(),
      margenMaximo: z.number().positive().optional(),
      confianza: confidence,
      /** Population size; omitted for an effectively infinite population. */
      N: z.number().int().positive().optional(),
      deff: z.number().min(1).max(10).optional(),
      variable: text,
      unidad: z.string().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('margen'),
      p: z.number().min(0.02).max(0.98),
      n: z.number().int().min(10).max(5000),
      confianza: confidence,
      encuestas: z.number().int().min(5).max(100).optional(),
      variable: text,
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('fpc'),
      N: z.number().int().min(5).max(5000),
      S: z.number().positive(),
      n: z.number().int().min(1),
      variable: text,
      unidad: z.string().optional(),
      /** Draws the population as a strip of units with the sampled share highlighted. */
      franja: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('deff'),
      /** Units observed per cluster. */
      m: z.number().int().min(1).max(100),
      rho: z.number().min(0).max(1),
      n: z.number().int().min(10).max(5000),
      nombreConglomerado: text,
      nombreUnidad: text,
    })
    .strict(),
]);

export type PrecisionPlannerConfig = z.infer<typeof parametersSchema>;
export type SizeConfig = Extract<PrecisionPlannerConfig, { modo: 'tamano' }>;
export type MarginConfig = Extract<PrecisionPlannerConfig, { modo: 'margen' }>;
export type FpcConfig = Extract<PrecisionPlannerConfig, { modo: 'fpc' }>;
export type DeffConfig = Extract<PrecisionPlannerConfig, { modo: 'deff' }>;

export const CONFIDENCE_OPTIONS = [
  { value: '0.8', label: '80 %' },
  { value: '0.9', label: '90 %' },
  { value: '0.95', label: '95 %' },
  { value: '0.99', label: '99 %' },
] as const;
