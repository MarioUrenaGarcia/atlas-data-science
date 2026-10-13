import { z } from 'zod';
import { RELATIONS } from './relations.ts';

const relationIds = RELATIONS.map((relation) => relation.id) as [string, ...string[]];

export const parametersSchema = z
  .object({
    /** Relation selected when the page opens. */
    relacion: z.enum(relationIds).optional(),
    /** Subset of relations to show; all of them when omitted. */
    relaciones: z.array(z.enum(relationIds)).min(1).optional(),
  })
  .strict();

export type DistributionMapConfig = z.infer<typeof parametersSchema>;
