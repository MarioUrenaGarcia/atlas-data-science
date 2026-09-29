import { z } from 'zod';

export const SET_OPERATIONS = [
  'union',
  'interseccion',
  'complemento',
  'diferencia',
  'diferencia-simetrica',
] as const;
export type SetOperation = (typeof SET_OPERATIONS)[number];

const setDefinition = z
  .object({ etiqueta: z.string().min(1), elementos: z.array(z.number().int()) })
  .strict();

export const parametersSchema = z
  .object({
    modo: z.enum(['operaciones', 'de-morgan', 'regiones']),
    /** Universe of discourse; defaults to the union of the sets. */
    universo: z.array(z.number().int()).min(1).max(60),
    conjuntos: z.array(setDefinition).min(2).max(3),
    operacion: z.enum(SET_OPERATIONS).optional(),
    operaciones: z.array(z.enum(SET_OPERATIONS)).min(1).optional(),
    /** Which De Morgan law is built first. */
    ley: z.enum(['union', 'interseccion']).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    const universe = new Set(value.universo);
    value.conjuntos.forEach((set, index) => {
      if (set.elementos.some((element) => !universe.has(element))) {
        context.addIssue({
          code: 'custom',
          path: ['conjuntos', index],
          message: 'todo elemento debe pertenecer al universo',
        });
      }
    });
    if (value.modo !== 'regiones' && value.conjuntos.length !== 2) {
      context.addIssue({
        code: 'custom',
        path: ['conjuntos'],
        message: 'este modo usa exactamente dos conjuntos',
      });
    }
  });

export type VennSetsConfig = z.infer<typeof parametersSchema>;
