import { z } from 'zod';
import { RELATION_RULES } from './rules.ts';

export const parametersSchema = z
  .object({
    /** Positive integers, since the divisibility rule needs a nonzero divisor. */
    elementos: z.array(z.number().int().positive()).min(2).max(10),
    relacion: z.enum(RELATION_RULES),
    relaciones: z.array(z.enum(RELATION_RULES)).min(1).optional(),
    vista: z.enum(['matriz', 'grafo', 'plano', 'hasse']).optional(),
    /** Text shown for each element in place of the number. */
    etiquetas: z.array(z.string().min(1)).optional(),
    k: z.number().int().min(1).max(6).optional(),
  })
  .strict();

export type RelationVizConfig = z.infer<typeof parametersSchema>;
