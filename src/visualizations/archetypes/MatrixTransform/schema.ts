import { z } from 'zod';

const entry = z.number().min(-10).max(10);
const matrix = z.tuple([z.tuple([entry, entry]), z.tuple([entry, entry])]);
const namedMatrix = z.object({ nombre: z.string().min(1), matriz: matrix }).strict();
/** Either one matrix, editable entry by entry, or several named ones to choose from. */
const matrices = z.array(namedMatrix).min(1).max(8);

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('transformacion'),
      matrices,
      circulo: z.boolean().optional(),
      propios: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('composicion'),
      pares: z
        .array(z.object({ nombre: z.string().min(1), primera: matrix, segunda: matrix }).strict())
        .min(1)
        .max(6),
    })
    .strict(),
  z
    .object({
      modo: z.literal('inversa'),
      pares: z
        .array(z.object({ nombre: z.string().min(1), primera: matrix }).strict())
        .min(1)
        .max(6),
    })
    .strict(),
  z.object({ modo: z.literal('propios'), matrices }).strict(),
  z.object({ modo: z.literal('svd'), matrices }).strict(),
  z.object({ modo: z.literal('diagonalizacion'), matrices }).strict(),
  z.object({ modo: z.literal('espectral'), matrices }).strict(),
  z.object({ modo: z.literal('caracteristico'), matrices }).strict(),
  z.object({ modo: z.literal('subespacios'), matrices }).strict(),
  z.object({ modo: z.literal('pseudoinversa'), matrices }).strict(),
  z.object({ modo: z.literal('estiramiento'), matrices }).strict(),
  z.object({ modo: z.literal('forma-cuadratica'), matrices }).strict(),
  z
    .object({
      modo: z.literal('potencia'),
      matrices,
      anguloInicial: z.number().min(-180).max(180).optional(),
    })
    .strict(),
]);

export type MatrixTransformConfig = z.infer<typeof parametersSchema>;
