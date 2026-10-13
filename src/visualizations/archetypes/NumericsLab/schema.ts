import { z } from 'zod';
import { NUMERIC_FUNCTION_IDS, ODE_CASE_IDS } from '../../../lib/numerics/functions.ts';

const fn = z.enum(NUMERIC_FUNCTION_IDS);
const pair = z.tuple([z.number(), z.number()]);

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('flotante'),
      valor: z.number(),
      formato: z.enum(['float32', 'float64']).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('error-paso'),
      funcion: fn,
      x0: z.number(),
      esquema: z.enum(['adelante', 'centrada']).optional(),
      /** Initial exponent k of the step h = 10^k. */
      paso: z.number().min(-16).max(0).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('estabilidad'),
      caso: z.enum(['recurrencia', 'varianza']),
      /** Offset added to the data in the variance case. */
      desplazamiento: z.number().min(0).max(12).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('logsumexp'),
      valores: z.array(z.number().min(-1000).max(1000)).min(2).max(6),
    })
    .strict(),
  z
    .object({
      modo: z.literal('interpolacion'),
      funcion: fn,
      nodos: z.enum(['equiespaciados', 'chebyshev']).optional(),
      n: z.number().int().min(2).max(20).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('spline'),
      puntos: z.array(pair).min(3).max(10),
      polinomio: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('cuadratura'),
      funcion: fn,
      intervalo: pair.optional(),
      reglas: z
        .array(z.enum(['trapecio', 'simpson', 'gauss']))
        .min(1)
        .max(3),
    })
    .strict(),
  z
    .object({
      modo: z.literal('autodiff'),
      x1: z.number().min(-4).max(4),
      x2: z.number().min(-4).max(4),
      sentido: z.enum(['forward', 'reverse']).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('iterativo'),
      matriz: z.tuple([pair, pair]),
      b: pair,
      inicio: pair.optional(),
      metodos: z
        .array(z.enum(['jacobi', 'gauss-seidel']))
        .min(1)
        .max(2),
    })
    .strict(),
  z
    .object({
      modo: z.literal('edo'),
      ecuacion: z.enum(ODE_CASE_IDS),
      h: z.number().positive().max(2),
      metodos: z
        .array(z.enum(['euler', 'rk2', 'rk4']))
        .min(1)
        .max(3),
    })
    .strict(),
]);

export type NumericsLabConfig = z.infer<typeof parametersSchema>;
