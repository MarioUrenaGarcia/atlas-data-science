import { z } from 'zod';

const vector = z.tuple([z.number().min(-6).max(6), z.number().min(-6).max(6)]);
const equation = z.tuple([z.number(), z.number(), z.number()]);

const subsets = z.enum([
  'recta-origen',
  'recta-desplazada',
  'primer-cuadrante',
  'union-ejes',
  'plano',
  'origen',
]);

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('cerradura'),
      conjuntos: z.array(subsets).min(1),
      u: vector.optional(),
      v: vector.optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('operaciones'),
      u: vector,
      v: vector,
      escalar: z.number().min(-3).max(3).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('combinacion'),
      v1: vector,
      v2: vector,
      /** Initial coefficients a and b of a v1 + b v2. */
      coeficientes: z.tuple([z.number(), z.number()]).optional(),
    })
    .strict(),
  z.object({ modo: z.literal('producto-punto'), u: vector, v: vector }).strict(),
  z
    .object({ modo: z.literal('normas'), punto: vector, p: z.number().min(1).max(10).optional() })
    .strict(),
  z
    .object({
      modo: z.literal('distancias'),
      a: vector,
      b: vector,
      p: z.number().min(1).max(10).optional(),
    })
    .strict(),
  z.object({ modo: z.literal('proyeccion'), a: vector, b: vector }).strict(),
  z.object({ modo: z.literal('gram-schmidt'), v1: vector, v2: vector }).strict(),
  z.object({ modo: z.literal('cambio-base'), b1: vector, b2: vector, punto: vector }).strict(),
  z
    .object({
      modo: z.literal('sistema'),
      /** Rows [a, b, c] of the equations a x + b y = c. */
      ecuaciones: z.tuple([equation, equation]),
      /** Other systems offered in a selector, each with its name. */
      alternativas: z
        .array(
          z
            .object({ nombre: z.string().min(1), ecuaciones: z.tuple([equation, equation]) })
            .strict(),
        )
        .optional(),
    })
    .strict(),
]);

export type VectorPlaneConfig = z.infer<typeof parametersSchema>;
export type Vec2 = [number, number];
