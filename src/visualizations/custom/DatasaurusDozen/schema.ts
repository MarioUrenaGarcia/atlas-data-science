import { z } from 'zod';
import { DATASAURUS_TARGETS } from '../../../lib/stats/datasaurus.ts';

export const parametersSchema = z
  .object({
    /** Shape the points start from. */
    inicio: z.enum(DATASAURUS_TARGETS).optional(),
    /** Shape the points move toward. */
    forma: z.enum(DATASAURUS_TARGETS).optional(),
    /** After reaching a shape, continue with the next one. */
    recorrido: z.boolean().optional(),
    /** Draws the outline of the target shape behind the points. */
    mostrarForma: z.boolean().optional(),
    puntos: z.number().int().min(40).max(300).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type DatasaurusDozenConfig = z.infer<typeof parametersSchema>;
