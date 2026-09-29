import { z } from 'zod';

export const parametersSchema = z.discriminatedUnion('modo', [
  z.object({ modo: z.literal('bell'), n: z.number().int().min(1).max(6).optional() }).strict(),
  z
    .object({
      modo: z.literal('stirling'),
      n: z.number().int().min(2).max(7).optional(),
      k: z.number().int().min(1).max(7).optional(),
    })
    .strict(),
]);

export type SetPartitionsVizConfig = z.infer<typeof parametersSchema>;
