import { z } from 'zod';

export const GENESIS_PROCESSES = [
  'dado',
  'moneda',
  'ensayos',
  'primer-exito',
  'r-exitos',
  'urna',
  'llegadas',
  'ruleta',
  'bolas-en-cajas',
  'beta-binomial',
  'ranking',
  'mezcla-geometrica',
  'ceros-inflados',
  'diferencia-de-llegadas',
  'signos',
] as const;

export type GenesisProcess = (typeof GENESIS_PROCESSES)[number];

const category = z
  .object({
    etiqueta: z.string().min(1).max(24),
    probabilidad: z.number().positive(),
  })
  .strict();

export const parametersSchema = z
  .object({
    proceso: z.enum(GENESIS_PROCESSES),
    /** Initial values of the numeric controls of the process. */
    valores: z.record(z.string(), z.number()).optional(),
    /** Controls shown as fixed values instead of sliders. */
    fijos: z.array(z.string()).optional(),
    /** Categories of a spinner or of the boxes that receive balls. */
    categorias: z.array(category).min(2).max(8).optional(),
    /** Names of the two outcomes of a trial. */
    exito: z.string().min(1).max(24).optional(),
    fracaso: z.string().min(1).max(24).optional(),
    /** Names of the two arrival streams whose difference is counted. */
    flujos: z.tuple([z.string().min(1).max(24), z.string().min(1).max(24)]).optional(),
    /** What is counted, shown in labels (for example "llamadas en una hora"). */
    unidad: z.string().min(1).max(48).optional(),
    /** Labels of the first ranks in a rank-frequency process. */
    etiquetas: z.array(z.string().min(1).max(20)).max(100).optional(),
    /** Urn draws start with replacement. */
    reemplazo: z.boolean().optional(),
    /** Splits the arrival window into this many slots with at most one arrival each. */
    rendijas: z.number().int().min(2).max(200).optional(),
    /** Counts the trials instead of the failures (waiting-time processes). */
    conteo: z.enum(['ensayos', 'fracasos']).optional(),
    /** Shows the comparison distribution of the process at start. */
    comparar: z.boolean().optional(),
    vista: z.enum(['masa', 'acumulada', 'loglog', 'conjunta']).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type DistributionGenesisConfig = z.infer<typeof parametersSchema>;
