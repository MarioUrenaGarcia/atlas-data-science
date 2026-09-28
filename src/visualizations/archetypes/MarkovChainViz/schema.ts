import { z } from 'zod';

export const parametersSchema = z
  .object({
    estados: z.array(z.string().min(1)).min(2).max(8),
    /** Transition weights by row; each row is normalized to sum one. */
    matriz: z.array(z.array(z.number().min(0))),
    inicial: z.number().int().min(0).optional(),
    editable: z.boolean().optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict()
  .superRefine((value, context) => {
    const size = value.estados.length;
    if (value.matriz.length !== size || value.matriz.some((row) => row.length !== size)) {
      context.addIssue({
        code: 'custom',
        path: ['matriz'],
        message: `la matriz debe ser de ${size} x ${size}`,
      });
    }
    value.matriz.forEach((row, index) => {
      if (row.reduce((total, entry) => total + entry, 0) <= 0) {
        context.addIssue({
          code: 'custom',
          path: ['matriz', index],
          message: 'cada renglón necesita al menos un peso positivo',
        });
      }
    });
    if (value.inicial !== undefined && value.inicial >= size) {
      context.addIssue({
        code: 'custom',
        path: ['inicial'],
        message: 'el estado inicial no existe',
      });
    }
  });

export type MarkovChainConfig = z.infer<typeof parametersSchema>;
