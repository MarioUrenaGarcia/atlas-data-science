import { z } from 'zod';

const matrix = z
  .array(z.array(z.number().min(-1000).max(1000)).min(1).max(6))
  .min(1)
  .max(6)
  .refine(
    (rows) => rows.every((row) => row.length === rows[0]?.length),
    'Todas las filas deben tener la misma longitud.',
  );

const choice = z.object({ nombre: z.string().min(1), matriz: matrix }).strict();

export const parametersSchema = z
  .object({
    modo: z.enum(['gauss', 'rango', 'lu', 'cholesky', 'qr']),
    /** One or more named matrices; with several, the reader picks one. */
    matrices: z.array(choice).min(1).max(6),
    /** In gauss mode, whether the last column is the right-hand side of a system. */
    aumentada: z.boolean().optional(),
    /** Continue to the reduced row echelon form. */
    reducida: z.boolean().optional(),
  })
  .strict();

export type MatrixStepsConfig = z.infer<typeof parametersSchema>;
