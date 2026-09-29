import { z } from 'zod';

export const parametersSchema = z
  .object({
    vista: z.enum(['finitos', 'enteros', 'racionales']).optional(),
  })
  .strict();

export type CountableSetsConfig = z.infer<typeof parametersSchema>;
