import { z } from 'zod';

export const parametersSchema = z
  .object({
    /** Number of distinct coupons, all equally likely in each draw. */
    cupones: z.number().int().min(2).max(60).optional(),
    colecciones: z.number().int().min(5).max(2000).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type CouponCollectorConfig = z.infer<typeof parametersSchema>;
