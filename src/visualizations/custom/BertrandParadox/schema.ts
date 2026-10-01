import { z } from 'zod';
import { BERTRAND_METHODS } from '../../../lib/probability/geometric.ts';

export const parametersSchema = z
  .object({
    metodo: z.enum(BERTRAND_METHODS).optional(),
    /** What the second panel shows: the chords themselves or their midpoints. */
    vista: z.enum(['cuerdas', 'puntos-medios']).optional(),
    cuerdas: z.number().int().min(50).max(10000).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type BertrandParadoxConfig = z.infer<typeof parametersSchema>;
