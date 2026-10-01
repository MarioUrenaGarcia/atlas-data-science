import { z } from 'zod';

export const PAIR_MEASURES = ['covarianza', 'pearson', 'spearman', 'kendall', 'distancia'] as const;
export const GENERATORS = [
  'lineal',
  'parabola',
  'circulo',
  'independiente',
  'exponencial',
  'escalon',
  'senoidal',
] as const;

const label = z.string().min(1);
const names = z.object({ x: label, y: label }).strict();

const generator = z
  .object({
    tipo: z.enum(GENERATORS),
    n: z.number().int().min(5).max(200),
    /** Noise as a fraction of the spread of y. */
    ruido: z.number().min(0).max(3).optional(),
    /** Sign or strength of the trend for linear and exponential shapes. */
    pendiente: z.number().optional(),
  })
  .strict();

const points = z
  .array(z.tuple([z.number(), z.number()]))
  .min(3)
  .max(120);

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('correlacion'),
      medida: z.enum(PAIR_MEASURES),
      lecturas: z.array(z.enum(PAIR_MEASURES)).min(1).max(5).optional(),
      puntos: points.optional(),
      generador: generator.optional(),
      nombres: names,
      recta: z.boolean().optional(),
      decimales: z.number().int().min(0).max(3).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict()
    .refine((config) => Boolean(config.puntos) !== Boolean(config.generador), {
      message: 'se indica puntos o generador, no ambos',
    }),
  z
    .object({
      modo: z.literal('confusor'),
      vista: z.enum(['grupos', 'residuos']),
      nombres: z.object({ x: label, y: label, z: label }).strict(),
      /** Labels of the strata of the confounder, from low to high. */
      niveles: z.array(label).min(2).max(5),
      n: z.number().int().min(20).max(300),
      efectoX: z.number(),
      efectoY: z.number(),
      /** Direct effect of x on y within each stratum; 0 means no causal link. */
      directo: z.number().optional(),
      ruido: z.number().positive().optional(),
      /** Values of x and y in the lowest level of the confounder. */
      origen: z.tuple([z.number(), z.number()]).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('espuria'),
      nombres: names,
      pasos: z.number().int().min(20).max(300),
      /** Constant drift per step of each series; zero gives driftless random walks. */
      deriva: z.tuple([z.number(), z.number()]).optional(),
      /** Starts with the correlation of period-to-period changes selected. */
      diferencias: z.boolean().optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('matriz'),
      variables: z
        .array(z.object({ nombre: label, valores: z.array(z.number()).min(4).max(80) }).strict())
        .min(3)
        .max(7),
    })
    .strict(),
  z
    .object({
      modo: z.literal('contingencia'),
      enfoque: z.enum(['tabla', 'phi', 'cramer', 'informacion']),
      filas: z.object({ nombre: label, categorias: z.array(label).min(2).max(5) }).strict(),
      columnas: z.object({ nombre: label, categorias: z.array(label).min(2).max(5) }).strict(),
      conteos: z.array(z.array(z.number().int().nonnegative())).min(2).max(5),
    })
    .strict(),
  z
    .object({
      modo: z.literal('mic'),
      puntos: points.optional(),
      generador: generator.optional(),
      nombres: names,
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
]);

export type AssociationVizConfig = z.infer<typeof parametersSchema>;
export type PairMeasure = (typeof PAIR_MEASURES)[number];
export type GeneratorSpec = z.infer<typeof generator>;
