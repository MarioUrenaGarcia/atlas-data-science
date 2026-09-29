import { z } from 'zod';

const labels = (max: number) => z.array(z.string().min(1).max(12)).min(2).max(max);

const group = z
  .object({ nombre: z.string().min(1), opciones: z.array(z.string().min(1)).min(1).max(8) })
  .strict();

const stage = z
  .object({ nombre: z.string().min(1), opciones: z.array(z.string().min(1)).min(1).max(4) })
  .strict();

/** Largest number of leaves drawn in a counting tree. */
export const MAX_TREE_LEAVES = 64;

export const parametersSchema = z.discriminatedUnion('modo', [
  z.object({ modo: z.literal('suma'), categorias: z.array(group).min(2).max(4) }).strict(),
  z
    .object({ modo: z.literal('arbol'), etapas: z.array(stage).min(2).max(4) })
    .strict()
    .refine(
      (value) =>
        value.etapas.reduce((product, s) => product * s.opciones.length, 1) <= MAX_TREE_LEAVES,
      {
        message: `el árbol no puede tener más de ${MAX_TREE_LEAVES} hojas`,
      },
    ),
  z
    .object({
      modo: z.literal('ordenaciones'),
      objetos: labels(6),
      /** Initial number of positions; the full arrangement when omitted. */
      k: z.number().int().min(1).max(6).optional(),
      repeticion: z.boolean().optional(),
      /** Shows the switch between arrangements with and without repetition. */
      permitirRepeticion: z.boolean().optional(),
    })
    .strict(),
  z
    .object({ modo: z.literal('crecimiento'), nMax: z.number().int().min(5).max(40).optional() })
    .strict(),
  z
    .object({
      modo: z.literal('anagramas'),
      palabra: z
        .string()
        .regex(/^[A-ZÑ]{2,6}$/, 'la palabra debe tener entre 2 y 6 letras mayúsculas'),
    })
    .strict(),
  z.object({ modo: z.literal('circular'), personas: labels(6).min(3) }).strict(),
  z
    .object({
      modo: z.literal('combinaciones'),
      objetos: labels(6),
      k: z.number().int().min(1).max(6),
    })
    .strict(),
  z
    .object({
      modo: z.literal('estrellas-y-barras'),
      tipos: labels(5),
      k: z.number().int().min(0).max(8),
    })
    .strict(),
]);

export type CombinatoricsBoardConfig = z.infer<typeof parametersSchema>;
