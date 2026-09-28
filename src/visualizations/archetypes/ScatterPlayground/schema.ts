import { z } from 'zod';

export const SCATTER_PRESETS = [
  'lineal-positiva',
  'lineal-negativa',
  'sin-relacion',
  'curva',
  'atipico',
  'heterocedastico',
  'grupos',
  'anscombe-1',
  'anscombe-2',
  'anscombe-3',
  'anscombe-4',
] as const;

export type ScatterPreset = (typeof SCATTER_PRESETS)[number];

export const SCATTER_MEASURES = [
  'pearson',
  'spearman',
  'kendall',
  'covarianza',
  'recta',
  'r2',
] as const;

export const parametersSchema = z
  .object({
    conjunto: z.enum(SCATTER_PRESETS),
    /** Presets offered in the selector. */
    conjuntos: z.array(z.enum(SCATTER_PRESETS)).min(1).optional(),
    /** Number of generated points for random presets. */
    puntos: z.number().int().min(4).max(80).optional(),
    medidas: z.array(z.enum(SCATTER_MEASURES)).min(1).optional(),
    recta: z.boolean().optional(),
    residuos: z.boolean().optional(),
    cuadrados: z.boolean().optional(),
    medias: z.boolean().optional(),
    etiquetas: z
      .object({ x: z.string().min(1), y: z.string().min(1) })
      .strict()
      .optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type ScatterPlaygroundConfig = z.infer<typeof parametersSchema>;
