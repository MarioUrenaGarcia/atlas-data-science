import { z } from 'zod';
import { VECTOR_POPULATION_IDS } from '../../../lib/limits/bivariate.ts';
import { CLT_POPULATION_IDS } from '../../../lib/limits/clt.ts';
import { SCENARIO_IDS } from '../../../lib/limits/lindeberg.ts';

export const FAILURE_POPULATION_IDS = ['cauchy', 'pareto', 'exponencial'] as const;
export type FailurePopulationId = (typeof FAILURE_POPULATION_IDS)[number];

const population = z.enum(CLT_POPULATION_IDS);
const populations = z.array(population).min(1).max(8);
const seed = z.number().int().nonnegative().optional();

const scenarioMode = (mode: 'lyapunov' | 'lindeberg') =>
  z
    .object({
      modo: z.literal(mode),
      escenario: z.enum(SCENARIO_IDS),
      escenarios: z.array(z.enum(SCENARIO_IDS)).min(1).optional(),
      n: z.number().int().min(1).max(300).optional(),
      epsilon: z.number().min(0.02).max(1).optional(),
      semilla: seed,
    })
    .strict();

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('clasico'),
      poblacion: population,
      poblaciones: populations.optional(),
      n: z.number().int().min(1).max(60).optional(),
      exacta: z.boolean().optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('convolucion'),
      poblacion: population,
      poblaciones: populations.optional(),
      nMaximo: z.number().int().min(5).max(60).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('berry-esseen'),
      poblacion: population,
      poblaciones: populations.optional(),
      nMaximo: z.number().int().min(10).max(60).optional(),
    })
    .strict(),
  scenarioMode('lyapunov'),
  scenarioMode('lindeberg'),
  z
    .object({
      modo: z.literal('multivariado'),
      poblacion: z.enum(VECTOR_POPULATION_IDS),
      poblaciones: z.array(z.enum(VECTOR_POPULATION_IDS)).min(1).optional(),
      n: z.number().int().min(1).max(100).optional(),
      semilla: seed,
    })
    .strict(),
  z
    .object({
      modo: z.literal('falla'),
      poblacion: z.enum(FAILURE_POPULATION_IDS),
      poblaciones: z.array(z.enum(FAILURE_POPULATION_IDS)).min(1).optional(),
      n: z.number().int().min(1).max(1000).optional(),
      semilla: seed,
    })
    .strict(),
]);

export type CentralLimitConfig = z.infer<typeof parametersSchema>;
