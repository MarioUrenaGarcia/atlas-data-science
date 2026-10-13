import { z } from 'zod';

export const parametersSchema = z
  .object({
    /** Four panels side by side, or one set with draggable points and its residuals. */
    vista: z.enum(['cuarteto', 'conjunto']).optional(),
    /** Set shown in the single-set view, from 1 to 4. */
    conjunto: z.number().int().min(1).max(4).optional(),
  })
  .strict();

export type AnscombeQuartetConfig = z.infer<typeof parametersSchema>;
