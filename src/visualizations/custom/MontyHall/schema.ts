import { z } from 'zod';

export const parametersSchema = z
  .object({
    puertas: z.number().int().min(3).max(10).optional(),
    /** Whether the host knows where the car is and always opens doors with goats. */
    presentador: z.enum(['sabe', 'ignora']).optional(),
    /** Plays whole rounds per step instead of showing each phase. */
    rapido: z.boolean().optional(),
    rondas: z.number().int().min(10).max(5000).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type MontyHallConfig = z.infer<typeof parametersSchema>;
