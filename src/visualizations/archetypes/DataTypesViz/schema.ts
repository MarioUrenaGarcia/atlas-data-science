import { z } from 'zod';

/** Classification axes and the bins each one sorts examples into. */
export const CLASS_AXES = {
  naturaleza: ['cualitativo', 'cuantitativo'],
  medida: ['discreto', 'continuo'],
  escala: ['nominal', 'ordinal', 'intervalo', 'razon'],
  estructura: ['estructurado', 'semiestructurado', 'no-estructurado'],
  temporal: ['transversal', 'longitudinal', 'panel'],
} as const;

export type ClassAxis = keyof typeof CLASS_AXES;

const AXIS_IDS = Object.keys(CLASS_AXES) as [ClassAxis, ...ClassAxis[]];

const example = z
  .object({
    nombre: z.string().min(1),
    /** A few illustrative values, shown on the card. */
    valores: z.string().min(1),
    clase: z.string().min(1),
    razon: z.string().min(1),
  })
  .strict();

const label = z.string().min(1);

export const POPULATION_SHAPES = ['normal', 'sesgada', 'bernoulli'] as const;
export const POPULATION_STATISTICS = ['media', 'mediana', 'proporcion', 'maximo'] as const;

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('poblacion'),
      /** "muestra" stops after one sample; "parametro" repeats samples and keeps a history. */
      enfoque: z.enum(['muestra', 'parametro']),
      tamano: z.number().int().min(3).max(400),
      /** Fixed population values; tamano must equal their count. */
      valores: z.array(z.number()).min(3).max(400).optional(),
      /** Visits every possible sample once (only for small populations). */
      enumerar: z.boolean().optional(),
      n: z.number().int().min(2).max(80),
      forma: z.enum(POPULATION_SHAPES),
      /** Center and spread of the values (normal and skewed shapes), or success rate (bernoulli). */
      centro: z.number(),
      dispersion: z.number().positive().optional(),
      estadistico: z.enum(POPULATION_STATISTICS),
      unidad: label,
      variable: label,
      /** Label of the successful outcome for proportions. */
      exito: label.optional(),
      /** "sesgada" favors the units with the largest values, as a self-selected sample does. */
      seleccion: z.enum(['aleatoria', 'sesgada']).optional(),
      decimales: z.number().int().min(0).max(3).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('clasificar'),
      eje: z.enum(AXIS_IDS),
      ejemplos: z.array(example).min(2).max(10),
    })
    .strict()
    .superRefine((config, context) => {
      const bins: readonly string[] = CLASS_AXES[config.eje];
      config.ejemplos.forEach((item, index) => {
        if (!bins.includes(item.clase)) {
          context.addIssue({
            code: 'custom',
            path: ['ejemplos', index, 'clase'],
            message: `clase "${item.clase}" no pertenece al eje ${config.eje}`,
          });
        }
      });
    }),
  z
    .object({
      modo: z.literal('valores'),
      discreta: z.object({ nombre: label, unidad: label, desde: z.number().int() }).strict(),
      continua: z
        .object({ nombre: label, unidad: label, desde: z.number(), valor: z.number() })
        .strict(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('escalas'),
      variable: z.enum(['colores', 'satisfaccion', 'temperatura', 'peso']),
    })
    .strict(),
  z
    .object({
      modo: z.literal('panel'),
      unidades: z.array(label).min(3).max(8),
      periodos: z.array(label).min(3).max(8),
      variable: label,
      /** Row-major values: one row per unit, one column per period. */
      valores: z.array(z.array(z.number())).min(3).max(8),
      vista: z.enum(['transversal', 'longitudinal', 'panel']).optional(),
      /** Missing cells make an unbalanced panel. */
      faltantes: z.array(z.tuple([z.number().int(), z.number().int()])).optional(),
    })
    .strict()
    .superRefine((config, context) => {
      if (config.valores.length !== config.unidades.length) {
        context.addIssue({ code: 'custom', path: ['valores'], message: 'una fila por unidad' });
      }
      config.valores.forEach((row, index) => {
        if (row.length !== config.periodos.length) {
          context.addIssue({
            code: 'custom',
            path: ['valores', index],
            message: 'una columna por periodo',
          });
        }
      });
    }),
  z
    .object({
      modo: z.literal('estructura'),
      caso: z.enum(['resenas', 'sensores', 'pedidos']),
    })
    .strict(),
  z
    .object({
      modo: z.literal('ordenados'),
      caso: z.enum(['calificaciones', 'clima', 'ventas', 'presion', 'goles']),
    })
    .strict(),
]);

export type DataTypesVizConfig = z.infer<typeof parametersSchema>;
export type ClassExample = z.infer<typeof example>;
