import { z } from 'zod';

export const CENTER_MEASURES = [
  'media',
  'ponderada',
  'geometrica',
  'armonica',
  'cuadratica',
  'recortada',
  'winsorizada',
  'mediana',
  'moda',
  'rango-medio',
] as const;

const label = z.string().min(1);

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('centro'),
      datos: z.array(z.number()).min(2).max(60),
      /** Measures drawn as markers; the first one drives the formula header. */
      medidas: z.array(z.enum(CENTER_MEASURES)).min(1).max(6),
      /** Weights for the weighted mean, one per observation. */
      pesos: z.array(z.number().positive()).optional(),
      /** Proportion trimmed or winsorized on each side. */
      proporcion: z.number().min(0).max(0.45).optional(),
      /** Draws the line as a beam resting on a fulcrum at the mean. */
      balanza: z.boolean().optional(),
      /** After all points appear, observation `indice` slides to the value `hasta`. */
      atipico: z
        .object({ indice: z.number().int().nonnegative(), hasta: z.number() })
        .strict()
        .optional(),
      variable: label,
      unidad: z.string().optional(),
      dominio: z.tuple([z.number(), z.number()]).optional(),
      decimales: z.number().int().min(0).max(3).optional(),
      /** Labels shown above each observation, such as names of stores or months. */
      etiquetas: z.array(z.string()).optional(),
    })
    .strict()
    .superRefine((config, context) => {
      if (config.pesos && config.pesos.length !== config.datos.length) {
        context.addIssue({ code: 'custom', path: ['pesos'], message: 'un peso por dato' });
      }
      if (config.etiquetas && config.etiquetas.length !== config.datos.length) {
        context.addIssue({ code: 'custom', path: ['etiquetas'], message: 'una etiqueta por dato' });
      }
      if (config.atipico && config.atipico.indice >= config.datos.length) {
        context.addIssue({
          code: 'custom',
          path: ['atipico', 'indice'],
          message: 'índice fuera de rango',
        });
      }
    }),
  z
    .object({
      modo: z.literal('semicirculo'),
      a: z.number().positive(),
      b: z.number().positive(),
      variable: label.optional(),
    })
    .strict(),
]);

export type DataStripConfig = z.infer<typeof parametersSchema>;
export type CenterMeasureId = (typeof CENTER_MEASURES)[number];
