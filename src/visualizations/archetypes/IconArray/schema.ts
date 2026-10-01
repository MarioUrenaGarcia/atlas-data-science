import { z } from 'zod';

export const parametersSchema = z
  .object({
    poblacion: z.union([z.literal(100), z.literal(1000)]).optional(),
    prevalencia: z.number().min(0).max(1).optional(),
    sensibilidad: z.number().min(0).max(1).optional(),
    especificidad: z.number().min(0).max(1).optional(),
    /** Name of the condition, such as "tiene la enfermedad". */
    condicion: z.string().min(1).optional(),
    /** Name of a positive result, such as "la alarma suena". */
    positivo: z.string().min(1).optional(),
    /** Stage the animation ends on: positives (predictive value of a positive) or negatives. */
    enfoque: z.enum(['positivos', 'negativos']).optional(),
    contexto: z.string().min(1).optional(),
  })
  .strict();

export type IconArrayConfig = z.infer<typeof parametersSchema>;
