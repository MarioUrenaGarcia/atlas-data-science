import { z } from 'zod';
import { REAL_FUNCTION_IDS } from '../../../lib/sets/realFunctions.ts';
import { CURVE_IDS } from './curves.ts';

const interval = z
  .tuple([z.number(), z.number()])
  .refine(([a, b]) => a < b, { message: 'el extremo izquierdo debe ser menor que el derecho' });

const restricted = z
  .object({
    funcion: z.enum(REAL_FUNCTION_IDS),
    dominio: interval,
    codominio: interval,
    /** Short name shown in the selector, such as "x² en [0, 2]". */
    nombre: z.string().min(1).optional(),
  })
  .strict();

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({ modo: z.literal('clasificacion'), funciones: z.array(restricted).min(1).max(8) })
    .strict(),
  z.object({ modo: z.literal('inversa'), funciones: z.array(restricted).min(1).max(8) }).strict(),
  z
    .object({ modo: z.literal('vertical'), curvas: z.array(z.enum(CURVE_IDS)).min(1).max(6) })
    .strict(),
]);

export type FunctionGraphConfig = z.infer<typeof parametersSchema>;
export type RestrictedFunction = z.infer<typeof restricted>;
