import { z } from 'zod';

export const SHAPES = [
  'normal',
  'sesgo-derecha',
  'sesgo-izquierda',
  'colas-pesadas',
  'uniforme',
  'laplace',
  'mezcla',
] as const;

const label = z.string().min(1);

/** A sample given by its values or generated from a family of shapes. */
export const sampleSchema = z
  .object({
    nombre: label,
    valores: z.array(z.number()).min(2).max(2000).optional(),
    forma: z.enum(SHAPES).optional(),
    centro: z.number().optional(),
    escala: z.number().positive().optional(),
    parametro: z.number().positive().optional(),
    n: z.number().int().min(5).max(2000).optional(),
    decimales: z.number().int().min(0).max(3).optional(),
  })
  .strict()
  .refine((s) => Boolean(s.valores) !== Boolean(s.forma), { message: 'se indica valores o forma' });

export type SampleSpec = z.infer<typeof sampleSchema>;

const axis = z.object({ variable: label, unidad: z.string().optional() }).strict();

export const parametersSchema = z.discriminatedUnion('grafico', [
  z
    .object({
      grafico: z.literal('histograma'),
      muestra: sampleSchema,
      eje: axis,
      intervalos: z.number().int().min(2).max(80).optional(),
      /** Shows the three classic rules side by side. */
      reglas: z.boolean().optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      grafico: z.literal('cajas'),
      grupos: z.array(sampleSchema).min(1).max(6),
      eje: axis,
      violin: z.boolean().optional(),
      puntos: z.boolean().optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      grafico: z.literal('tallo'),
      valores: z.array(z.number()).min(5).max(80),
      eje: axis,
      /** Value of one unit of the leaf, such as 1 or 0.1. */
      hoja: z.number().positive().optional(),
    })
    .strict(),
  z
    .object({
      grafico: z.literal('densidad'),
      muestra: sampleSchema,
      eje: axis,
      nucleo: z.enum(['gaussian', 'epanechnikov', 'uniform', 'triangular']).optional(),
      ancho: z.number().positive().optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      grafico: z.literal('ecdf'),
      grupos: z.array(sampleSchema).min(1).max(3),
      eje: axis,
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      grafico: z.literal('probabilidad'),
      tipo: z.enum(['qq', 'pp']),
      muestra: sampleSchema,
      eje: axis,
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      grafico: z.literal('dispersion'),
      /** Pairs generated as y = mediaY + b (x - media) + noise, or given explicitly. */
      puntos: z
        .array(z.tuple([z.number(), z.number()]))
        .min(3)
        .max(5000)
        .optional(),
      generador: z
        .object({
          n: z.number().int().min(10).max(20000),
          pendiente: z.number(),
          ruido: z.number().nonnegative(),
          media: z.number().optional(),
          /** Center of y; defaults to the center of x. */
          mediaY: z.number().optional(),
          escala: z.number().positive().optional(),
          /** Rounds x to this step, which creates ties and overplotting. */
          redondeo: z.number().positive().optional(),
        })
        .strict()
        .optional(),
      ejes: z.object({ x: axis, y: axis }).strict(),
      /** Initial rendering: points, transparency, jitter or hexagonal bins. */
      vista: z.enum(['puntos', 'transparencia', 'dispersion-aleatoria', 'hexagonos']).optional(),
      /** Radius of the hexagons in pixels. */
      radio: z.number().int().min(5).max(30).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      grafico: z.literal('matriz-dispersion'),
      variables: z
        .array(z.object({ nombre: label, valores: z.array(z.number()).min(5).max(500) }).strict())
        .min(3)
        .max(5),
      grupos: z.array(z.number().int().nonnegative()).optional(),
      nombresGrupos: z.array(label).optional(),
    })
    .strict(),
  z
    .object({
      grafico: z.literal('calor'),
      filas: z.array(label).min(2).max(24),
      columnas: z.array(label).min(2).max(31),
      valores: z.array(z.array(z.number())).min(2).max(24),
      paleta: z.enum(['secuencial', 'divergente', 'categorica', 'arcoiris']),
      /** Center of a diverging palette. */
      centro: z.number().optional(),
      variable: label,
      /** Offers the palette selector to compare choices. */
      compararPaletas: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      grafico: z.literal('barras'),
      categorias: z.array(label).min(2).max(15),
      valores: z.array(z.number().nonnegative()).min(2).max(15),
      variable: label,
      vista: z.enum(['barras', 'pastel', 'ambas']),
      ordenar: z.boolean().optional(),
      horizontal: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      grafico: z.literal('lineas'),
      periodos: z.array(label).min(3).max(60),
      series: z
        .array(z.object({ nombre: label, valores: z.array(z.number()) }).strict())
        .min(1)
        .max(6),
      variable: label,
      escala: z.enum(['lineal', 'logaritmica']).optional(),
      /** Draws only the markers without joining them. */
      soloPuntos: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      grafico: z.literal('paralelas'),
      variables: z.array(label).min(3).max(8),
      filas: z
        .array(z.object({ grupo: label, valores: z.array(z.number()) }).strict())
        .min(3)
        .max(200),
    })
    .strict(),
  z
    .object({
      grafico: z.literal('mosaico'),
      filas: z.object({ nombre: label, categorias: z.array(label).min(2).max(5) }).strict(),
      columnas: z.object({ nombre: label, categorias: z.array(label).min(2).max(5) }).strict(),
      conteos: z.array(z.array(z.number().int().nonnegative())).min(2).max(5),
    })
    .strict(),
  z
    .object({
      grafico: z.literal('enjambre'),
      grupos: z.array(sampleSchema).min(1).max(5),
      eje: axis,
      modo: z.enum(['franjas', 'enjambre']),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      grafico: z.literal('ridgeline'),
      grupos: z.array(sampleSchema).min(2).max(14),
      eje: axis,
      solapamiento: z.number().min(0).max(3).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      grafico: z.literal('tinta'),
      categorias: z.array(label).min(2).max(8),
      valores: z.array(z.number().positive()).min(2).max(8),
      variable: label,
    })
    .strict(),
  z
    .object({
      grafico: z.literal('enganoso'),
      truco: z.enum(['eje-truncado', 'pictograma', 'ventana', 'relacion-aspecto']),
      etiquetas: z.array(label).min(2).max(40),
      valores: z.array(z.number().positive()).min(2).max(40),
      variable: label,
    })
    .strict(),
  z
    .object({
      grafico: z.literal('percepcion'),
      a: z.number().min(5).max(100),
      b: z.number().min(5).max(100),
    })
    .strict(),
]);

export type ChartGalleryConfig = z.infer<typeof parametersSchema>;
