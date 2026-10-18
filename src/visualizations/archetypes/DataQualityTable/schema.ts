import { z } from 'zod';

const label = z.string().min(1);
const column = z
  .object({
    nombre: label,
    valores: z
      .array(z.union([z.number(), z.string(), z.null()]))
      .min(2)
      .max(500),
  })
  .strict();

export const QUALITY_DIMENSIONS = [
  'completitud',
  'validez',
  'exactitud',
  'consistencia',
  'unicidad',
  'oportunidad',
] as const;
export const DIMENSION_CASES = ['clientes', 'sensores'] as const;
export const DUPLICATE_CASES = ['clientes', 'productos'] as const;
export const STANDARDIZE_CASES = ['ciudades', 'escolaridad'] as const;
export const SCHEMA_CASES = ['pacientes', 'pedidos'] as const;
export const MECHANISMS = ['MCAR', 'MAR', 'MNAR'] as const;
export const SIMPLE_METHODS = ['media', 'mediana', 'moda'] as const;
export const OUTLIER_CASES = ['estatura', 'temperatura', 'montos'] as const;
export const OUTLIER_RULES = ['iqr', 'z', 'dominio'] as const;

const seed = z.number().int().nonnegative().optional();

const missingFields = {
  mecanismo: z.enum(MECHANISMS).optional(),
  tasa: z.number().min(0.05).max(0.6).optional(),
  fuerza: z.number().min(0).max(3).optional(),
  n: z.number().int().min(20).max(300).optional(),
  semilla: seed,
};

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('perfilado'),
      /** Custom columns; without them the home sales records are profiled. */
      columnas: z.array(column).min(1).max(8).optional(),
      /** Rows of the preview table. */
      filas: z.number().int().min(3).max(15).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('faltantes'),
      columnas: z.array(column).min(2).max(10).optional(),
      orden: z.enum(['original', 'patron', 'primera']).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('mecanismo'),
      mecanismo: z.enum(['mcar', 'mar', 'mnar']),
      n: z.number().int().min(50).max(1000).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('dimensiones'),
      caso: z.enum(DIMENSION_CASES),
      /** Runs only this dimension instead of all of them. */
      enfoque: z.enum(QUALITY_DIMENSIONS).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('duplicados'),
      caso: z.enum(DUPLICATE_CASES),
      umbral: z.number().min(0.5).max(1).optional(),
      normalizar: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('estandarizacion'),
      caso: z.enum(STANDARDIZE_CASES),
      /** Number of cleaning steps applied at the end of the animation (all by default). */
      pasos: z.number().int().min(0).max(5).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('esquema'),
      caso: z.enum(SCHEMA_CASES),
      /** Checks only presence and type rules, as a validation that ignores ranges and formats. */
      soloTipos: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('mecanismos'),
      ...missingFields,
      ocultos: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('eliminacion'),
      metodo: z.enum(['lista', 'pares']),
      tasa: z.number().min(0.02).max(0.4).optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('imputacion'),
      metodo: z.enum(SIMPLE_METHODS),
      ...missingFields,
    })
    .strict(),
  z
    .object({
      modo: z.literal('knn'),
      k: z.number().int().min(1).max(20).optional(),
      ...missingFields,
    })
    .strict(),
  z
    .object({
      modo: z.literal('mice'),
      m: z.number().int().min(2).max(8).optional(),
      iteraciones: z.number().int().min(2).max(20).optional(),
      ...missingFields,
    })
    .strict(),
  z
    .object({
      modo: z.literal('rubin'),
      m: z.number().int().min(2).max(20).optional(),
      ...missingFields,
    })
    .strict(),
  z
    .object({
      modo: z.literal('indicador'),
      tasa: z.number().min(0.05).max(0.6).optional(),
      /** Extra default probability of applicants who leave income blank. */
      efecto: z.number().min(0).max(0.5).optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('atipicos'),
      caso: z.enum(OUTLIER_CASES),
      regla: z.enum(OUTLIER_RULES).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('winsorizacion'),
      p: z.number().min(0).max(0.2).optional(),
      semilla: seed,
    })
    .strict(),
]);

export type DataQualityConfig = z.infer<typeof parametersSchema>;
export type QualityDimension = (typeof QUALITY_DIMENSIONS)[number];
export type DimensionCaseId = (typeof DIMENSION_CASES)[number];
export type DuplicateCaseId = (typeof DUPLICATE_CASES)[number];
export type StandardizeCaseId = (typeof STANDARDIZE_CASES)[number];
export type SchemaCaseId = (typeof SCHEMA_CASES)[number];
export type MechanismId = (typeof MECHANISMS)[number];
export type SimpleMethod = (typeof SIMPLE_METHODS)[number];
export type OutlierCaseId = (typeof OUTLIER_CASES)[number];
export type OutlierRule = (typeof OUTLIER_RULES)[number];
