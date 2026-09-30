import { z } from 'zod';
import {
  IMPROPER_CASE_IDS,
  LIMIT_CASE_IDS,
  PARTS_CASE_IDS,
  QUOTIENT_CASE_IDS,
  SUBSTITUTION_CASE_IDS,
} from '../../../lib/calculus/cases.ts';
import { CALC_FUNCTION_IDS } from '../../../lib/calculus/catalog.ts';
import { TAYLOR_FUNCTION_IDS } from '../../../lib/calculus/index.ts';

const fn = z.enum(CALC_FUNCTION_IDS);
const functions = z.array(fn).min(1).max(6);
const interval = z.tuple([z.number(), z.number()]);

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('transformaciones'),
      funciones: functions,
      /** Initial a, b, h, k of a f(b(x - h)) + k. */
      valores: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('limite'),
      casos: z.array(z.enum(LIMIT_CASE_IDS)).min(1).max(8),
      epsilon: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('secante'),
      funcion: fn,
      x0: z.number(),
      h: z.number().positive().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('derivadas'),
      funciones: functions,
      orden: z.union([z.literal(1), z.literal(2)]).optional(),
      criticos: z.boolean().optional(),
    })
    .strict(),
  z.object({ modo: z.literal('cadena'), exterior: fn, interior: fn, x0: z.number() }).strict(),
  z
    .object({ modo: z.literal('convexidad'), funciones: functions, cuerda: interval.optional() })
    .strict(),
  z
    .object({
      modo: z.literal('lhopital'),
      casos: z.array(z.enum(QUOTIENT_CASE_IDS)).min(1).max(6),
    })
    .strict(),
  z
    .object({ modo: z.literal('exponencial'), base: z.number().min(1.1).max(5).optional() })
    .strict(),
  z
    .object({
      modo: z.literal('taylor'),
      funciones: z.array(z.enum(TAYLOR_FUNCTION_IDS)).min(1).max(5),
      x0: z.number().optional(),
      orden: z.number().int().min(1).max(15).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('riemann'),
      funcion: fn,
      intervalo: interval,
      regla: z.enum(['izquierda', 'derecha', 'punto-medio', 'trapecio']).optional(),
    })
    .strict(),
  z.object({ modo: z.literal('area'), funcion: fn, intervalo: interval }).strict(),
  z
    .object({
      modo: z.literal('acumulada'),
      funcion: fn,
      desde: z.number(),
      hasta: z.number(),
      escala: z.number().positive().optional(),
      nombre: z.string().min(1).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('sustitucion'),
      casos: z.array(z.enum(SUBSTITUTION_CASE_IDS)).min(1).max(4),
    })
    .strict(),
  z
    .object({ modo: z.literal('partes'), casos: z.array(z.enum(PARTS_CASE_IDS)).min(1).max(4) })
    .strict(),
  z
    .object({
      modo: z.literal('impropia'),
      casos: z.array(z.enum(IMPROPER_CASE_IDS)).min(1).max(5),
    })
    .strict(),
  z.object({ modo: z.literal('gamma'), x: z.number().min(0.3).max(5).optional() }).strict(),
  z
    .object({
      modo: z.literal('beta'),
      a: z.number().min(0.3).max(6).optional(),
      b: z.number().min(0.3).max(6).optional(),
    })
    .strict(),
  z.object({ modo: z.literal('stirling'), n: z.number().int().min(1).max(60).optional() }).strict(),
  z.object({ modo: z.literal('indicadora'), intervalos: z.array(interval).min(1).max(4) }).strict(),
]);

export type CalculusVizConfig = z.infer<typeof parametersSchema>;
