import { z } from 'zod';

export const CORPORA = ['resenas', 'noticias', 'negacion', 'clima'] as const;

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('bolsa'),
      corpus: z.enum(CORPORA),
      /** Removes frequent function words before counting. */
      sinVacias: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('tfidf'),
      corpus: z.enum(CORPORA),
    })
    .strict(),
  z
    .object({
      modo: z.literal('ngramas'),
      corpus: z.enum(CORPORA),
      n: z.number().int().min(1).max(3).optional(),
    })
    .strict(),
]);

export type TextFeaturesConfig = z.infer<typeof parametersSchema>;
export type CorpusId = (typeof CORPORA)[number];
