import { z } from 'zod';

export const DESIGNS = [
  'mas',
  'estratificado',
  'conglomerados',
  'sistematico',
  'multietapa',
  'pps',
  'cuotas',
  'conveniencia',
  'seleccion',
  'marco',
  'no-respuesta',
] as const;

const text = z.string().min(1);

export const populationSchema = z
  .object({
    columnas: z.number().int().min(6).max(40),
    filas: z.number().int().min(4).max(30),
    /** Horizontal bands of rows, from top to bottom. */
    estratos: z
      .array(
        z
          .object({
            nombre: text,
            media: z.number(),
            desviacion: z.number().positive().optional(),
          })
          .strict(),
      )
      .min(1)
      .max(6),
    /** Width and height of each cluster block. */
    conglomerado: z.tuple([z.number().int().min(1), z.number().int().min(1)]).optional(),
    icc: z.number().min(0).max(0.95).optional(),
    desviacion: z.number().positive(),
    tendencia: z.number().optional(),
    periodo: z.number().int().min(0).optional(),
    amplitud: z.number().optional(),
    correlacionTamano: z.number().min(-0.95).max(0.95).optional(),
    binaria: z.boolean().optional(),
    minimo: z.number().optional(),
    decimales: z.number().int().min(0).max(3).optional(),
    variable: text,
    unidad: z.string().optional(),
    /** Name of one unit in singular, such as "hogar" or "parcela". */
    nombreUnidad: text,
    /** Name of one cluster, such as "manzana" or "escuela". */
    nombreConglomerado: z.string().optional(),
    /** Name of the size measure for PPS, such as "número de empleados". */
    nombreTamano: z.string().optional(),
  })
  .strict();

export const parametersSchema = z
  .object({
    diseno: z.enum(DESIGNS),
    /** Designs offered in a selector; the first view uses `diseno`. */
    disenos: z.array(z.enum(DESIGNS)).min(2).max(5).optional(),
    poblacion: populationSchema,
    /** Units for element designs or clusters for cluster designs. */
    n: z.number().int().min(1).max(400),
    nMaximo: z.number().int().min(2).max(400).optional(),
    reemplazo: z.boolean().optional(),
    asignacion: z.enum(['proporcional', 'neyman', 'igual']).optional(),
    porConglomerado: z.number().int().min(1).max(30).optional(),
    /** Strength of the selection bias for the "seleccion" design. */
    sesgo: z.number().min(-3).max(3).optional(),
    /** Share of each stratum present in the frame for the "marco" design. */
    cobertura: z.array(z.number().min(0).max(1)).optional(),
    /** Response model for the "no-respuesta" design. */
    respuesta: z
      .object({ base: z.number().min(-4).max(4), pendiente: z.number().min(-4).max(4) })
      .strict()
      .optional(),
    /** Number of samples drawn; 1 stops after the first sample. */
    repeticiones: z.number().int().min(1).max(2000).optional(),
    /** Overlays the estimates of simple random samples of the same number of units. */
    comparar: z.boolean().optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type SurveySamplerConfig = z.infer<typeof parametersSchema>;
export type PopulationConfig = z.infer<typeof populationSchema>;
