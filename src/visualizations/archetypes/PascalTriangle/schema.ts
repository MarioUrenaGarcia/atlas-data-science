import { z } from 'zod';

export const IDENTITIES = ['pascal', 'vandermonde', 'simetria', 'suma-de-fila'] as const;

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('triangulo'),
      filas: z.number().int().min(2).max(16).optional(),
      /** Colors cells by their remainder modulo this number when given. */
      modulo: z.number().int().min(2).max(7).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('caminos'),
      derecha: z.number().int().min(1).max(6),
      arriba: z.number().int().min(1).max(6),
    })
    .strict(),
  z
    .object({
      modo: z.literal('identidades'),
      identidad: z.enum(IDENTITIES),
      identidades: z.array(z.enum(IDENTITIES)).min(1).optional(),
      n: z.number().int().min(2).max(8).optional(),
      k: z.number().int().min(0).max(8).optional(),
      /** Sizes of the two groups in Vandermonde's identity. */
      grupos: z.tuple([z.number().int().min(1).max(8), z.number().int().min(1).max(8)]).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('binomio'),
      n: z.number().int().min(1).max(8),
      a: z.number().optional(),
      b: z.number().optional(),
    })
    .strict(),
  z.object({ modo: z.literal('multinomial'), n: z.number().int().min(1).max(9) }).strict(),
]);

export type PascalTriangleConfig = z.infer<typeof parametersSchema>;
