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

export const SHAPE_FAMILIES = [
  'normal',
  'sesgo-derecha',
  'sesgo-izquierda',
  'colas-pesadas',
  'uniforme',
  'laplace',
  'mezcla',
] as const;

export const SPREAD_MEASURES = [
  'rango',
  'varianza',
  'varianza-n',
  'desviacion',
  'cv',
  'riq',
  'mad',
  'dam',
  'suma',
] as const;

const dataset = z
  .object({
    datos: z.array(z.number()).min(2).max(30),
    variable: label,
    unidad: z.string().optional(),
    etiquetas: z.array(z.string()).optional(),
    dominio: z.tuple([z.number(), z.number()]).optional(),
    resaltar: z.number().int().nonnegative().optional(),
  })
  .strict();

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
  z
    .object({
      modo: z.literal('dispersion'),
      datos: z.array(z.number()).min(2).max(24),
      medida: z.enum(SPREAD_MEASURES),
      lecturas: z.array(z.enum(SPREAD_MEASURES)).min(1).max(6).optional(),
      cuadrados: z.boolean().optional(),
      banda: z.boolean().optional(),
      variable: label,
      unidad: z.string().optional(),
      etiquetas: z.array(z.string()).optional(),
      dominio: z.tuple([z.number(), z.number()]).optional(),
      decimales: z.number().int().min(0).max(3).optional(),
      comparar: dataset.optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('bessel'),
      n: z.number().int().min(2).max(30),
      media: z.number(),
      desviacion: z.number().positive(),
      variable: label,
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('cuantiles'),
      datos: z.array(z.number()).min(2).max(60),
      familia: z.enum(['cuantil', 'cuartiles', 'deciles', 'percentiles']),
      p: z.number().min(0.01).max(0.99).optional(),
      metodo: z
        .union([
          z.literal(1),
          z.literal(2),
          z.literal(4),
          z.literal(5),
          z.literal(6),
          z.literal(7),
          z.literal(8),
          z.literal(9),
        ])
        .optional(),
      compararMetodos: z.boolean().optional(),
      variable: label,
      unidad: z.string().optional(),
      decimales: z.number().int().min(0).max(3).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('caja'),
      datos: z.array(z.number()).min(4).max(60),
      k: z.number().min(0.5).max(3).optional(),
      hasta: z.number().int().min(1).max(6).optional(),
      variable: label,
      unidad: z.string().optional(),
      dominio: z.tuple([z.number(), z.number()]).optional(),
      decimales: z.number().int().min(0).max(3).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('forma'),
      enfoque: z.enum(['asimetria', 'curtosis', 'modas', 'colas']),
      forma: z.enum(SHAPE_FAMILIES),
      /** Families offered in the selector; they should share the same kind of shape control. */
      formas: z.array(z.enum(SHAPE_FAMILIES)).min(1).max(7).optional(),
      parametro: z.number().positive().optional(),
      peso: z.number().min(0.05).max(0.95).optional(),
      n: z.number().int().min(40).max(2000).optional(),
      centro: z.number(),
      escala: z.number().positive(),
      variable: label,
      unidad: z.string().optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('estandarizar'),
      grupos: z.array(dataset).min(1).max(2),
      robusta: z.boolean().optional(),
      umbral: z.number().positive().optional(),
      decimales: z.number().int().min(0).max(3).optional(),
    })
    .strict(),
]);

export type DataStripConfig = z.infer<typeof parametersSchema>;
export type CenterMeasureId = (typeof CENTER_MEASURES)[number];
