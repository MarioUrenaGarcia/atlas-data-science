import { z } from 'zod';

export const LETTER_RULES = ['cualquiera', 'par', 'impar', 'al-menos-uno', 'a-lo-mas-uno'] as const;
export type LetterRule = (typeof LETTER_RULES)[number];

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('ordinaria'),
      /** Allowed part sizes, such as coin denominations. */
      partes: z.array(z.number().int().min(1).max(20)).min(1).max(6),
      /** Name of each part size, shown in the factors. */
      nombre: z.string().min(1).optional(),
      objetivo: z.number().int().min(1).max(40).optional(),
      unaVez: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('exponencial'),
      letras: z
        .array(z.object({ letra: z.string().length(1), regla: z.enum(LETTER_RULES) }).strict())
        .min(1)
        .max(4),
      n: z.number().int().min(1).max(8).optional(),
    })
    .strict(),
]);

export type GeneratingFunctionVizConfig = z.infer<typeof parametersSchema>;
