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

const elementsSchema = z
  .object({
    modo: z.enum(['operaciones', 'de-morgan', 'regiones', 'inclusion-exclusion']),
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
    if (
      (value.modo === 'operaciones' || value.modo === 'de-morgan') &&
      value.conjuntos.length !== 2
    ) {
      context.addIssue({
        code: 'custom',
        path: ['conjuntos'],
        message: 'este modo usa exactamente dos conjuntos',
      });
    }
  });

/** Region of a diagram written as the labels it lies in, such as "AC", or "ninguno" for the outside. */
export const OUTSIDE = 'ninguno';

const countsSchema = z
  .object({
    modo: z.literal('conteos'),
    /** One-letter names of the sets, in order. */
    etiquetas: z.array(z.string().length(1)).min(2).max(3),
    /** Name of the universe, such as "Encuestados". */
    universo: z.string().min(1).optional(),
    /** Number of elements of each region; missing regions are empty. */
    conteos: z.record(z.string(), z.number().int().nonnegative()),
    /** Unions of regions highlighted one after another, each with its name. */
    consultas: z
      .array(z.object({ nombre: z.string().min(1), regiones: z.array(z.string()).min(1) }).strict())
      .min(1),
  })
  .strict()
  .superRefine((value, context) => {
    const valid = (key: string) =>
      key === OUTSIDE ||
      ([...key].every((letter) => value.etiquetas.includes(letter)) &&
        [...key].join('') === value.etiquetas.filter((label) => key.includes(label)).join(''));
    for (const key of Object.keys(value.conteos)) {
      if (!valid(key))
        context.addIssue({
          code: 'custom',
          path: ['conteos', key],
          message: `región inválida "${key}"`,
        });
    }
    value.consultas.forEach((query, index) => {
      for (const key of query.regiones) {
        if (!valid(key)) {
          context.addIssue({
            code: 'custom',
            path: ['consultas', index],
            message: `región inválida "${key}"`,
          });
        }
      }
    });
  });

export const parametersSchema = z.union([elementsSchema, countsSchema]);

export type VennSetsConfig = z.infer<typeof parametersSchema>;
export type VennCountsConfig = z.infer<typeof countsSchema>;
