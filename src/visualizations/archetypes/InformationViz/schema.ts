import { z } from 'zod';

const probability = z.number().min(0).max(1);
const weights = z.array(z.number().min(0)).min(2).max(6);
const labels = z.array(z.string().min(1).max(12)).min(2).max(6);
const table = z
  .array(z.array(z.number().min(0)).min(2).max(3))
  .min(2)
  .max(3);

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('sorpresa'),
      eventos: z
        .array(z.object({ nombre: z.string().min(1), p: probability }).strict())
        .min(1)
        .max(6),
    })
    .strict(),
  z.object({ modo: z.literal('entropia'), p: weights, etiquetas: labels.optional() }).strict(),
  z
    .object({
      modo: z.literal('conjunta'),
      tabla: table,
      enfoque: z.enum(['conjunta', 'condicional', 'mutua']).optional(),
      filas: labels.optional(),
      columnas: labels.optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('divergencia'),
      p: weights,
      q: weights,
      enfoque: z.enum(['cruzada', 'kl', 'jensen-shannon']).optional(),
      etiquetas: labels.optional(),
    })
    .strict(),
  z
    .object({ modo: z.literal('asimetria'), separacion: z.number().min(0).max(5).optional() })
    .strict(),
  z
    .object({
      modo: z.literal('diferencial'),
      familia: z.enum(['uniforme', 'normal', 'exponencial']),
      parametro: z.number().positive().max(10).optional(),
    })
    .strict(),
  z.object({ modo: z.literal('maxent'), media: z.number().min(1).max(6).optional() }).strict(),
  z
    .object({
      modo: z.literal('huffman'),
      p: z.array(z.number().positive()).min(2).max(8),
      etiquetas: z.array(z.string().min(1).max(4)).min(2).max(8).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('fuente'),
      p: probability.optional(),
      bloque: z.number().int().min(1).max(6).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('perplejidad'),
      p: weights,
      q: weights,
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('procesamiento'),
      ruido1: probability.optional(),
      ruido2: probability.optional(),
    })
    .strict(),
  z.object({ modo: z.literal('wasserstein'), p: weights, q: weights }).strict(),
  z
    .object({
      modo: z.literal('divergencias-f'),
      p: weights,
      q: weights,
      f: z.enum(['kl', 'kl-inversa', 'variacion-total', 'hellinger', 'chi-cuadrada']).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('mdl'),
      ruido: z.number().min(0).max(1).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
]);

export type InformationVizConfig = z.infer<typeof parametersSchema>;
