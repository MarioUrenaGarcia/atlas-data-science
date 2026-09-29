import { z } from 'zod';
import { PREDICATE_IDS } from '../LogicViz/predicates.ts';

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('notacion'),
      universo: z.array(z.number().int()).min(2).max(30),
      predicado: z.enum(PREDICATE_IDS),
      predicados: z.array(z.enum(PREDICATE_IDS)).min(1).optional(),
      k: z.number().int().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('producto'),
      a: z.array(z.string().min(1)).min(1).max(6),
      b: z.array(z.string().min(1)).min(1).max(6),
      nombres: z.tuple([z.string().min(1), z.string().min(1)]).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('potencia'),
      elementos: z.array(z.string().min(1)).min(1).max(5),
    })
    .strict(),
  z
    .object({
      modo: z.literal('particion'),
      elementos: z.array(z.number().int()).min(2).max(16),
      /** Initial number of classes when grouping by remainder. */
      modulo: z.number().int().min(1).max(8).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('recta'),
      valores: z.array(z.number()).min(1).max(30),
      conjuntos: z
        .array(
          z
            .object({
              etiqueta: z.string().min(1),
              desde: z.number().optional(),
              hasta: z.number().optional(),
            })
            .strict(),
        )
        .min(1)
        .max(3),
      unidad: z.string().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('reparto'),
      universo: z.string().min(1),
      bloques: z
        .array(
          z
            .object({
              nombre: z.string().min(1),
              n: z.number().int().positive(),
              partes: z
                .array(
                  z.object({ nombre: z.string().min(1), n: z.number().int().positive() }).strict(),
                )
                .optional(),
            })
            .strict()
            .refine(
              (block) =>
                !block.partes || block.partes.reduce((sum, part) => sum + part.n, 0) === block.n,
              {
                message: 'las partes deben sumar el tamaño del bloque',
              },
            ),
        )
        .min(1)
        .max(8),
    })
    .strict(),
]);

export type SetStructuresConfig = z.infer<typeof parametersSchema>;
