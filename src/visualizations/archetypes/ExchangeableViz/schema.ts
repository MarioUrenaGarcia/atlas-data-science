import { z } from 'zod';

export const EXCHANGEABLE_MODES = ['polya', 'de-finetti'] as const;

export const parametersSchema = z
  .object({
    modo: z.enum(EXCHANGEABLE_MODES),
    /** Initial balls of each color in the urn, also the parameters of the beta mixture. */
    a: z.number().min(0.5).max(10).optional(),
    b: z.number().min(0.5).max(10).optional(),
    /** Draws per sequence. */
    n: z.number().int().min(2).max(200).optional(),
    /** Number of sequences drawn side by side (urn mode) or repetitions (de Finetti mode). */
    secuencias: z.number().int().min(5).max(3000).optional(),
    /** Names of the two outcomes. */
    exito: z.string().min(1).optional(),
    fracaso: z.string().min(1).optional(),
    contexto: z.string().min(1).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type ExchangeableVizConfig = z.infer<typeof parametersSchema>;
