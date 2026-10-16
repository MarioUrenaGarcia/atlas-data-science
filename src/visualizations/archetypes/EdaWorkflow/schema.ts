import { z } from 'zod';

export const NUMERIC_VARIABLES = ['precio', 'superficie', 'habitaciones', 'antiguedad'] as const;
export const VARIABLES = [...NUMERIC_VARIABLES, 'zona'] as const;
export const PAIRS = [
  'superficie-precio',
  'zona-precio',
  'zona-habitaciones',
  'antiguedad-precio',
] as const;

export const parametersSchema = z.discriminatedUnion('modo', [
  z.object({ modo: z.literal('recorrido') }).strict(),
  z
    .object({
      modo: z.literal('univariado'),
      variable: z.enum(VARIABLES).optional(),
      escalaLog: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('bivariado'),
      par: z.enum(PAIRS).optional(),
      excluirErrores: z.boolean().optional(),
      escalaLog: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('multivariado'),
      vista: z.enum(['color', 'paneles', 'correlaciones']).optional(),
    })
    .strict(),
]);

export type EdaConfig = z.infer<typeof parametersSchema>;
