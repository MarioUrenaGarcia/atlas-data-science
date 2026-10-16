import { z } from 'zod';

export const CRISP_CASES = ['abandono', 'inventario', 'mantenimiento', 'readmision'] as const;
export const FRAMING_CASES = ['abandono', 'inventario', 'becas', 'mantenimiento'] as const;
export const QUESTION_CASES = ['sucursales', 'escuelas', 'hospitales'] as const;
export const METRIC_CASES = ['retencion', 'fraude', 'mantenimiento'] as const;
export const ANALYTICS_KINDS = [
  'descriptiva',
  'diagnostica',
  'predictiva',
  'prescriptiva',
] as const;
export const REPRO_FACTORS = ['semilla', 'datos', 'codigo'] as const;
export const MODEL_METRICS = ['exactitud', 'f1', 'precision', 'sensibilidad'] as const;
export const QUASI_IDENTIFIERS = ['sex', 'age', 'postal'] as const;

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('crisp'),
      caso: z.enum(CRISP_CASES),
    })
    .strict(),
  z
    .object({
      modo: z.literal('planteamiento'),
      caso: z.enum(FRAMING_CASES),
      /** Shows a deficient framing of the same request next to the good one. */
      comparar: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('pregunta'),
      caso: z.enum(QUESTION_CASES),
      /** Index of the operational definition selected at the start. */
      definicion: z.number().int().min(0).max(3).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('metricas'),
      caso: z.enum(METRIC_CASES),
      metrica: z.enum(MODEL_METRICS).optional(),
      prevalencia: z.number().min(0.02).max(0.5).optional(),
      separacion: z.number().min(0.5).max(4).optional(),
      umbral: z.number().min(0.05).max(0.95).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('analitica'),
      tipo: z.enum(ANALYTICS_KINDS),
      precio: z.number().positive().optional(),
      costo: z.number().positive().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('reproducibilidad'),
      fijar: z.array(z.enum(REPRO_FACTORS)).max(3),
      corridas: z.number().int().min(4).max(20).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('privacidad'),
      claves: z.array(z.enum(QUASI_IDENTIFIERS)).min(1).max(3).optional(),
      digitosCp: z.number().int().min(1).max(5).optional(),
      bandaEdad: z.number().int().min(1).max(20).optional(),
      registros: z.number().int().min(12).max(48).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('equidad'),
      umbral: z.number().min(0.05).max(0.95).optional(),
      /** Base rates of the outcome in groups A and B. */
      tasas: z.tuple([z.number().min(0.05).max(0.8), z.number().min(0.05).max(0.8)]).optional(),
      porGrupo: z.boolean().optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
]);

export type DataProjectConfig = z.infer<typeof parametersSchema>;
export type CrispCaseId = (typeof CRISP_CASES)[number];
export type FramingCaseId = (typeof FRAMING_CASES)[number];
export type QuestionCaseId = (typeof QUESTION_CASES)[number];
export type MetricCaseId = (typeof METRIC_CASES)[number];
export type AnalyticsKind = (typeof ANALYTICS_KINDS)[number];
export type ReproFactor = (typeof REPRO_FACTORS)[number];
export type ModelMetric = (typeof MODEL_METRICS)[number];
