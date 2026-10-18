import { z } from 'zod';

export const SCALE_METHODS = ['minmax', 'estandar', 'robusto'] as const;
export const SCALE_CASES = ['clientes', 'casas', 'atletas'] as const;
export const NORM_CASES = ['textos', 'dietas'] as const;
export const BIN_METHODS = ['anchura', 'frecuencia'] as const;
export const ONEHOT_CASES = ['ciudades', 'pagos'] as const;
export const ORDINAL_CASES = ['tallas', 'colores', 'satisfaccion'] as const;
export const TARGET_CASES = ['colonias', 'marcas', 'sucursales'] as const;
export const HASH_CASES = ['municipios', 'navegadores'] as const;
export const DATE_CASES = ['viajes', 'compras'] as const;

const seed = z.number().int().nonnegative().optional();

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('escalamiento'),
      metodo: z.enum(SCALE_METHODS),
      caso: z.enum(SCALE_CASES),
      /** Adds an extreme value to the second variable. */
      atipico: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('norma'),
      caso: z.enum(NORM_CASES),
      p: z.enum(['1', '2', 'inf']).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('discretizacion'),
      metodo: z.enum(BIN_METHODS),
      intervalos: z.number().int().min(2).max(10).optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('onehot'),
      caso: z.enum(ONEHOT_CASES),
      eliminarPrimera: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('ordinal'),
      caso: z.enum(ORDINAL_CASES),
      orden: z.enum(['natural', 'alfabetico']).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('objetivo'),
      caso: z.enum(TARGET_CASES),
      m: z.number().min(0).max(50).optional(),
      fueraDePliegue: z.boolean().optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('frecuencia'),
      caso: z.enum(TARGET_CASES),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('hashing'),
      caso: z.enum(HASH_CASES),
      cubetas: z.number().int().min(2).max(64).optional(),
      signo: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('embedding'),
      pasos: z.number().int().min(5).max(600).optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('interaccion'),
      conInteraccion: z.boolean().optional(),
      efecto: z.number().min(-3).max(3).optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('polinomial'),
      grado: z.number().int().min(1).max(12).optional(),
      n: z.number().int().min(8).max(80).optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('fecha'),
      caso: z.enum(DATE_CASES),
    })
    .strict(),
  z
    .object({
      modo: z.literal('ciclica'),
      periodo: z.enum(['horas', 'meses', 'dias']).optional(),
      a: z.number().int().min(0).max(23).optional(),
      b: z.number().int().min(0).max(23).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('agregacion'),
      estadistico: z.enum(['conteo', 'suma', 'media', 'maximo']).optional(),
      semilla: seed,
    })
    .strict(),
]);

export type FeatureEngineeringConfig = z.infer<typeof parametersSchema>;
export type ScaleMethod = (typeof SCALE_METHODS)[number];
export type ScaleCaseId = (typeof SCALE_CASES)[number];
export type NormCaseId = (typeof NORM_CASES)[number];
export type BinMethod = (typeof BIN_METHODS)[number];
export type OneHotCaseId = (typeof ONEHOT_CASES)[number];
export type OrdinalCaseId = (typeof ORDINAL_CASES)[number];
export type TargetCaseId = (typeof TARGET_CASES)[number];
export type HashCaseId = (typeof HASH_CASES)[number];
export type DateCaseId = (typeof DATE_CASES)[number];
