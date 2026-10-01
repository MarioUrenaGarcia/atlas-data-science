import { z } from 'zod';

export const SQUARE_MODES = ['producto', 'total', 'bayes', 'independencia'] as const;

const TOLERANCE = 1e-6;

export const parametersSchema = z
  .object({
    modo: z.enum(SQUARE_MODES),
    /** Partition of the sample space into columns, with their probabilities. */
    particion: z
      .array(z.object({ etiqueta: z.string().min(1), prob: z.number().min(0).max(1) }).strict())
      .min(2)
      .max(4),
    /** Name of the event split inside each column, and of its complement. */
    evento: z.string().min(1).optional(),
    complemento: z.string().min(1).optional(),
    /** P(event | column i), one per column. */
    condicionales: z.array(z.number().min(0).max(1)).min(2).max(4),
    /** Column highlighted in the product and Bayes modes. */
    columna: z.number().int().min(0).max(3).optional(),
    /** One line describing the situation, shown above the square. */
    contexto: z.string().min(1).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    const total = value.particion.reduce((sum, part) => sum + part.prob, 0);
    if (Math.abs(total - 1) > TOLERANCE) {
      context.addIssue({
        code: 'custom',
        path: ['particion'],
        message: `las probabilidades de la partición deben sumar 1 (suman ${total})`,
      });
    }
    if (value.condicionales.length !== value.particion.length) {
      context.addIssue({
        code: 'custom',
        path: ['condicionales'],
        message: 'se requiere una probabilidad condicional por columna',
      });
    }
    if (value.columna !== undefined && value.columna >= value.particion.length) {
      context.addIssue({ code: 'custom', path: ['columna'], message: 'columna fuera de rango' });
    }
  });

export type ProbabilitySquareConfig = z.infer<typeof parametersSchema>;
