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
]);

export type SetStructuresConfig = z.infer<typeof parametersSchema>;
