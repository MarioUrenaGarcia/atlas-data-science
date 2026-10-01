import { z } from 'zod';

export const CONTINUOUS_PROCESSES = [
  'punto-uniforme',
  'suma-uniformes',
  'llegadas',
  'suma-cuadrados',
  'cociente-t',
  'cociente-f',
  'producto',
  'maximo',
  'minimo',
  'maximo-pareto',
  'distancia',
  'faro',
  'diferencia-exponenciales',
  'estadistico-de-orden',
  'log-momios',
  'potencia-de-uniforme',
  'minimo-de-maximos',
  'truncamiento',
  'seleccion',
  'inverso-gamma',
  'inverso-cuadrado',
  'direccion',
  'suma-colas-pesadas',
] as const;

export type ContinuousProcess = (typeof CONTINUOUS_PROCESSES)[number];

export const parametersSchema = z
  .object({
    proceso: z.enum(CONTINUOUS_PROCESSES),
    /** Initial values of the numeric controls of the process. */
    valores: z.record(z.string(), z.number()).optional(),
    /** Controls shown as fixed values instead of sliders. */
    fijos: z.array(z.string()).optional(),
    /** What the simulated quantity represents, shown in labels. */
    unidad: z.string().min(1).max(48).optional(),
    /** Shows the comparison curve of the process at start. */
    comparar: z.boolean().optional(),
    vista: z.enum(['densidad', 'acumulada']).optional(),
    /** Horizontal window of the histogram; computed from the distribution when omitted. */
    dominio: z.tuple([z.number(), z.number()]).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type ContinuousGenesisConfig = z.infer<typeof parametersSchema>;
