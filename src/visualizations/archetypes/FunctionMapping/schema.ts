import { z } from 'zod';

const labels = z.array(z.string().min(1)).min(1).max(8);

const mapping = z
  .object({
    nombre: z.string().min(1),
    dominio: labels,
    codominio: labels,
    /** Pairs (domain index, codomain index). */
    flechas: z.array(z.tuple([z.number().int().min(0), z.number().int().min(0)])),
  })
  .strict()
  .superRefine((value, context) => {
    value.flechas.forEach(([from, to], index) => {
      if (from >= value.dominio.length || to >= value.codominio.length) {
        context.addIssue({
          code: 'custom',
          path: ['flechas', index],
          message: 'índice fuera de los conjuntos',
        });
      }
    });
  });

export const parametersSchema = z.discriminatedUnion('modo', [
  z.object({ modo: z.literal('funcion'), ejemplos: z.array(mapping).min(1) }).strict(),
  z.object({ modo: z.literal('clasificacion'), ejemplos: z.array(mapping).min(1) }).strict(),
  z
    .object({
      modo: z.literal('composicion'),
      a: labels,
      b: labels,
      c: labels,
      /** Image index in B of each element of A. */
      f: z.array(z.number().int().min(0)),
      /** Image index in C of each element of B. */
      g: z.array(z.number().int().min(0)),
    })
    .strict()
    .superRefine((value, context) => {
      if (value.f.length !== value.a.length || value.f.some((index) => index >= value.b.length)) {
        context.addIssue({
          code: 'custom',
          path: ['f'],
          message: 'f debe asignar un elemento de B a cada elemento de A',
        });
      }
      if (value.g.length !== value.b.length || value.g.some((index) => index >= value.c.length)) {
        context.addIssue({
          code: 'custom',
          path: ['g'],
          message: 'g debe asignar un elemento de C a cada elemento de B',
        });
      }
    }),
]);

export type FunctionMappingConfig = z.infer<typeof parametersSchema>;
export type MappingExample = z.infer<typeof mapping>;
