import { z } from 'zod';

const vector = z.tuple([
  z.number().min(-4).max(4),
  z.number().min(-4).max(4),
  z.number().min(-4).max(4),
]);

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('generado'),
      /** Named sets of one to three vectors; the reader picks one. */
      conjuntos: z
        .array(
          z.object({ nombre: z.string().min(1), vectores: z.array(vector).min(1).max(3) }).strict(),
        )
        .min(1)
        .max(6),
    })
    .strict(),
  z.object({ modo: z.literal('proyeccion'), a1: vector, a2: vector, b: vector }).strict(),
]);

export type Space3DConfig = z.infer<typeof parametersSchema>;
