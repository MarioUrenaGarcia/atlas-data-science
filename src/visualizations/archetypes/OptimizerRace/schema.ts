import { z } from 'zod';
import { PLANE_SETS } from '../../../lib/optimization/extras.ts';
import { TEST_FUNCTIONS } from '../../../lib/optimization/index.ts';

const FUNCTION_IDS = Object.keys(TEST_FUNCTIONS) as [string, ...string[]];
const SET_IDS = Object.keys(PLANE_SETS) as [string, ...string[]];
const METHODS = [
  'gradiente',
  'momentum',
  'nesterov',
  'adagrad',
  'rmsprop',
  'adam',
  'newton',
  'gradiente-armijo',
  'gradiente-exacto',
  'bfgs',
  'lbfgs',
  'conjugado',
  'coordenadas',
] as const;

const functions = z.array(z.enum(FUNCTION_IDS)).min(1).max(5);
const point = z.tuple([z.number(), z.number()]);
const seed = z.number().int().min(0).optional();
const halfPlane = z
  .object({
    a: point,
    c: z.number(),
    /** LaTeX of the constraint, such as "x + y \\le 1". */
    etiqueta: z.string().min(1),
  })
  .strict();

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('carrera'),
      funciones: functions,
      metodos: z.array(z.enum(METHODS)).min(1).max(4),
      inicio: point,
      tasa: z.number().positive().optional(),
    })
    .strict(),
  z.object({ modo: z.literal('tasa'), funciones: functions, tasas: z.array(z.number().positive()).min(1).max(4), inicio: point }).strict(),
  z
    .object({
      modo: z.literal('busqueda-lineal'),
      funciones: functions,
      inicio: point,
      alfa0: z.number().positive().optional(),
      c1: z.number().min(0.0001).max(0.9).optional(),
      rho: z.number().min(0.1).max(0.9).optional(),
    })
    .strict(),
  z.object({ modo: z.literal('inicios'), funciones: functions }).strict(),
  z
    .object({
      modo: z.literal('poblacion'),
      metodo: z.enum(['nelder-mead', 'recocido', 'genetico', 'enjambre']),
      funciones: functions,
      inicio: point.optional(),
      semilla: seed,
      /** Initial Nelder-Mead triangle; replaces the small one built at the start. */
      triangulo: z.tuple([point, point, point]).optional(),
      /** Factor by which the annealing temperature is multiplied each step. */
      enfriamiento: z.number().min(0.5).max(0.999).optional(),
      /** Mutation scale of the genetic algorithm, as a fraction of the window width. */
      mutacion: z.number().min(0).max(0.3).optional(),
      /** Inertia of the particle swarm. */
      inercia: z.number().min(0).max(1.2).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('lineal'),
      metodo: z.enum(['grafico', 'simplex']),
      c: z.tuple([z.number(), z.number()]),
      a: z.array(z.tuple([z.number(), z.number()])).min(1).max(5),
      b: z.array(z.number().nonnegative()).min(1).max(5),
      variables: z.tuple([z.string().min(1), z.string().min(1)]).optional(),
    })
    .strict()
    .refine((v) => v.a.length === v.b.length),
  z
    .object({
      modo: z.literal('dualidad'),
      objetivo: point,
      /** Normal of the constraint aᵀx <= c; its second entry must be positive. */
      normal: z.tuple([z.number(), z.number().positive()]),
      cota: z.number(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('proximal'),
      matriz: z.tuple([point, point]),
      centro: point,
      lambda: z.number().nonnegative(),
      inicio: point,
    })
    .strict(),
  z
    .object({
      modo: z.literal('estocastico'),
      lote: z.number().int().min(1).max(40),
      tasa: z.number().positive(),
      semilla: seed,
    })
    .strict(),
  z.object({ modo: z.literal('pareto'), semilla: seed, /** Fixed weight of f₁; the figure opens paused on it. */ peso: z.number().min(0).max(1).optional() }).strict(),
  z.object({ modo: z.literal('convexo'), conjuntos: z.array(z.enum(SET_IDS)).min(1).max(6), semilla: seed }).strict(),
  z
    .object({
      modo: z.literal('restricciones'),
      funciones: functions,
      restricciones: z.array(halfPlane).min(1).max(4),
      inicio: point,
      tasa: z.number().positive(),
    })
    .strict(),
]);

export type OptimizerRaceConfig = z.infer<typeof parametersSchema>;
