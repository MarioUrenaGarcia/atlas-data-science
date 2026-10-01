import { z } from 'zod';
import {
  EVENT_OPERATIONS,
  EXPERIMENT_IDS,
  experiment,
  type ExperimentId,
} from '../../../lib/probability/sampleSpace.ts';

export const SAMPLE_SPACE_MODES = [
  'eventos',
  'union',
  'frecuencia',
  'medida',
  'apuestas',
  'condicional',
] as const;

/** Experiments small enough to draw one bar per outcome. */
export const MEASURE_EXPERIMENTS: readonly ExperimentId[] = [
  'moneda',
  'dado',
  'dos-monedas',
  'tres-monedas',
  'cuatro-monedas',
];

export const parametersSchema = z
  .object({
    modo: z.enum(SAMPLE_SPACE_MODES),
    experimento: z.enum(EXPERIMENT_IDS).optional(),
    /** Event ids from the experiment catalog. */
    eventoA: z.string().optional(),
    eventoB: z.string().optional(),
    /** Events offered in the selectors; defaults to the whole catalog. */
    eventos: z.array(z.string()).min(1).optional(),
    operacion: z.enum(EVENT_OPERATIONS).optional(),
    operaciones: z.array(z.enum(EVENT_OPERATIONS)).min(1).optional(),
    /** Conditional mode: which event is known to have happened. */
    condicion: z.enum(['A', 'B']).optional(),
    /** Unnormalized weight of each outcome, in the experiment's order. */
    pesos: z.array(z.number().nonnegative()).optional(),
    normalizar: z.boolean().optional(),
    ensayos: z.number().int().min(20).max(20000).optional(),
    trayectorias: z.number().int().min(1).max(8).optional(),
    banda: z.boolean().optional(),
    escalaLog: z.boolean().optional(),
    /** Frequency mode: relative frequency, or the excess n_A - n P(A) that grows like sqrt(n). */
    grafica: z.enum(['relativa', 'exceso']).optional(),
    /** Frequency mode: value marked with a thin line, such as 0.5 for a fair bet. */
    referencia: z.number().min(0).max(1).optional(),
    /** Subjective mode: description of the uncertain event and initial degrees of belief. */
    proposicion: z.string().min(1).optional(),
    creenciaA: z.number().min(0).max(1).optional(),
    creenciaNoA: z.number().min(0).max(1).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict()
  .superRefine((value, context) => {
    const id = value.experimento ?? 'dos-dados';
    const space = experiment(id);
    const known = new Set(space.events.map((event) => event.id));
    for (const key of ['eventoA', 'eventoB'] as const) {
      const eventId = value[key];
      if (eventId !== undefined && !known.has(eventId)) {
        context.addIssue({
          code: 'custom',
          path: [key],
          message: `evento "${eventId}" desconocido para ${id}`,
        });
      }
    }
    value.eventos?.forEach((eventId, index) => {
      if (!known.has(eventId)) {
        context.addIssue({
          code: 'custom',
          path: ['eventos', index],
          message: `evento "${eventId}" desconocido para ${id}`,
        });
      }
    });
    if (value.pesos && value.pesos.length !== space.outcomes.length) {
      context.addIssue({
        code: 'custom',
        path: ['pesos'],
        message: `se esperan ${space.outcomes.length} pesos`,
      });
    }
    if (value.modo === 'medida' && !MEASURE_EXPERIMENTS.includes(id)) {
      context.addIssue({
        code: 'custom',
        path: ['experimento'],
        message: 'el modo medida usa experimentos de a lo más 16 resultados',
      });
    }
  });

export type SampleSpaceLabConfig = z.infer<typeof parametersSchema>;
