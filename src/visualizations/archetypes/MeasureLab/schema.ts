import { z } from 'zod';

const functionId = z.enum(['cuadrado', 'raiz', 'onda', 'escalon']);
const element = z.number().int().min(0).max(5);

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('sigma'),
      puntos: z.number().int().min(2).max(6),
      generadores: z.array(z.array(element).max(6)).min(1).max(3),
      etiquetas: z.array(z.string().min(1).max(3)).min(2).max(6).optional(),
    })
    .strict(),
  z
    .object({ modo: z.literal('cantor'), nivel: z.number().int().min(0).max(8).optional() })
    .strict(),
  z
    .object({
      modo: z.literal('cubrimiento'),
      epsilon: z.number().positive().max(1).optional(),
      cantidad: z.number().int().min(1).max(40).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('continuidad'),
      sentido: z.enum(['creciente', 'decreciente']),
    })
    .strict(),
  z
    .object({
      modo: z.literal('preimagen'),
      funcion: functionId,
      intervalo: z.tuple([z.number(), z.number()]).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('casi-seguro'),
      funcion: functionId,
      puntos: z.number().int().min(1).max(40).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('simple'),
      funcion: functionId,
      enfoque: z.enum(['lebesgue', 'riemann']).optional(),
      n: z.number().int().min(1).max(6).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('sucesion'),
      caso: z.enum(['potencias', 'creciente', 'escalon-alto', 'alternante']),
      enfoque: z.enum(['limite', 'fatou']).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('radon'),
      densidad: z.enum(['lineal', 'onda', 'escalon']),
    })
    .strict(),
  z
    .object({
      modo: z.literal('fubini'),
      caso: z.enum(['contraejemplo', 'absoluta', 'continua']),
    })
    .strict(),
  z
    .object({
      modo: z.literal('lp'),
      p: z.number().min(1).max(10).optional(),
      vista: z.enum(['bola', 'funcion']).optional(),
    })
    .strict(),
]);

export type MeasureLabConfig = z.infer<typeof parametersSchema>;
