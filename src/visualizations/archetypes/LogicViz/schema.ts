import { z } from 'zod';
import { FORMULA_IDS } from './formulas.ts';
import { PREDICATE_IDS } from './predicates.ts';

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('conectivos'),
      /** Everyday statements read as p and q. */
      enunciados: z.object({ p: z.string().min(1), q: z.string().min(1) }).strict(),
      /** Truth values shown first. */
      inicial: z.object({ p: z.boolean(), q: z.boolean() }).strict().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('tabla'),
      formula: z.enum(FORMULA_IDS),
      formulas: z.array(z.enum(FORMULA_IDS)).min(1).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('cuantificadores'),
      predicado: z.enum(PREDICATE_IDS),
      predicados: z.array(z.enum(PREDICATE_IDS)).min(1).optional(),
      /** Domain {inicio, ..., inicio + tamano - 1}. */
      inicio: z.number().int().optional(),
      tamano: z.number().int().min(2).max(60).optional(),
      /** Explicit finite domain; replaces inicio and tamano. */
      dominio: z.array(z.number().int()).min(1).max(40).optional(),
      k: z.number().int().optional(),
    })
    .strict(),
]);

export type LogicVizConfig = z.infer<typeof parametersSchema>;
