import { z } from 'zod';

const label = z.string().min(1);
const column = z
  .object({
    nombre: label,
    valores: z
      .array(z.union([z.number(), z.string(), z.null()]))
      .min(2)
      .max(500),
  })
  .strict();

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('perfilado'),
      /** Custom columns; without them the home sales records are profiled. */
      columnas: z.array(column).min(1).max(8).optional(),
      /** Rows of the preview table. */
      filas: z.number().int().min(3).max(15).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('faltantes'),
      columnas: z.array(column).min(2).max(10).optional(),
      orden: z.enum(['original', 'patron', 'primera']).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('mecanismo'),
      mecanismo: z.enum(['mcar', 'mar', 'mnar']),
      n: z.number().int().min(50).max(1000).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
]);

export type DataQualityConfig = z.infer<typeof parametersSchema>;
