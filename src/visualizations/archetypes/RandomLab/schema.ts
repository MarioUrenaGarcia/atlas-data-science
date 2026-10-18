import { z } from 'zod';

export const MODES = [
  'ciclo',
  'pares',
  'semilla',
  'pruebas',
  'box-muller',
  'polar',
  'aceptacion-rechazo',
  'ziggurat',
  'alias',
  'baja-discrepancia',
] as const;

export const GENERATOR_IDS = ['mt', 'lcg-pequeno', 'randu', 'sesgado'] as const;
export type GeneratorId = (typeof GENERATOR_IDS)[number];

export const TARGET_IDS = ['beta', 'bimodal', 'normal-truncada'] as const;
export type TargetId = (typeof TARGET_IDS)[number];

const values = z.record(z.string(), z.number());

const preset = z
  .object({
    nombre: z.string().min(1).max(40),
    descripcion: z.string().min(1).max(320),
    valores: values,
    /** In the pares mode, turns the slice of triples on or off along with the numeric values. */
    ternas: z.boolean().optional(),
  })
  .strict();

export const parametersSchema = z
  .object({
    modo: z.enum(MODES),
    valores: values.optional(),
    /** Generator examined in the pares and pruebas modes. */
    generador: z.enum(GENERATOR_IDS).optional(),
    /** In the pares mode, starts showing the slice of triples instead of consecutive pairs. */
    ternas: z.boolean().optional(),
    /** Target density of the aceptacion-rechazo mode. */
    objetivo: z.enum(TARGET_IDS).optional(),
    /** Probabilities of the categories in the alias mode. */
    pesos: z.array(z.number().positive()).min(2).max(8).optional(),
    casos: z.array(preset).max(6).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type RandomLabConfig = z.infer<typeof parametersSchema>;
