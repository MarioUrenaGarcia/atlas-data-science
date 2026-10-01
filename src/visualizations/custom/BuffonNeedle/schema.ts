import { z } from 'zod';

export const parametersSchema = z
  .object({
    /** Needle length as a fraction of the spacing between lines. */
    largo: z.number().min(0.1).max(1).optional(),
    vista: z.enum(['agujas', 'espacio']).optional(),
    agujas: z.number().int().min(100).max(20000).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type BuffonNeedleConfig = z.infer<typeof parametersSchema>;
