import { z } from 'zod';

const counts = z
  .object({ exitos: z.number().int().nonnegative(), total: z.number().int().positive() })
  .strict();

export const parametersSchema = z
  .object({
    /** Names of the two subgroups, such as "cálculos pequeños" and "cálculos grandes". */
    subgrupos: z.array(z.string().min(1)).length(2),
    tratamientos: z
      .array(z.object({ nombre: z.string().min(1), datos: z.array(counts).length(2) }).strict())
      .length(2),
    /** What a success is, such as "tratamiento exitoso". */
    exito: z.string().min(1).optional(),
    contexto: z.string().min(1).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    value.tratamientos.forEach((treatment, t) =>
      treatment.datos.forEach((cell, g) => {
        if (cell.exitos > cell.total) {
          context.addIssue({
            code: 'custom',
            path: ['tratamientos', t, 'datos', g],
            message: 'más éxitos que casos',
          });
        }
      }),
    );
  });

export type SimpsonParadoxConfig = z.infer<typeof parametersSchema>;
