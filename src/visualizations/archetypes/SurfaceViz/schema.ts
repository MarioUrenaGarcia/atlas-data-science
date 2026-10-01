import { z } from 'zod';
import { KKT_CASE_IDS, LAGRANGE_CASE_IDS } from '../../../lib/multivariable/constraints.ts';
import { CURVE_IDS } from '../../../lib/multivariable/curves.ts';
import { FIELD_IDS, MAP_IDS } from '../../../lib/multivariable/index.ts';
import { QUADRATIC_CASE_IDS } from '../../../lib/multivariable/matrixCalculus.ts';

const field = z.enum(FIELD_IDS);
const fields = z.array(field).min(1).max(6);
const fraction = z.number().min(0.05).max(0.75);
const interval = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b);

export const parametersSchema = z.discriminatedUnion('modo', [
  z.object({ modo: z.literal('superficie'), campos: fields }).strict(),
  z.object({ modo: z.literal('curvas'), campos: fields }).strict(),
  z.object({ modo: z.literal('parciales'), campos: fields }).strict(),
  z.object({ modo: z.literal('gradiente'), campos: fields }).strict(),
  z.object({ modo: z.literal('direccional'), campos: fields }).strict(),
  z.object({ modo: z.literal('tangente'), campos: fields }).strict(),
  z.object({ modo: z.literal('hessiana'), campos: fields }).strict(),
  z.object({ modo: z.literal('criticos'), campos: fields }).strict(),
  z
    .object({
      modo: z.literal('trayectoria'),
      campos: fields,
      curvas: z.array(z.enum(CURVE_IDS)).min(1).max(3),
    })
    .strict(),
  z
    .object({
      modo: z.literal('jacobiana'),
      mapas: z.array(z.enum(MAP_IDS)).min(1).max(4),
      /** Position of the small square, as fractions of the input window. */
      punto: z.tuple([fraction, fraction]).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('integral-doble'),
      casos: z
        .array(z.object({ campo: field, region: z.tuple([interval, interval]) }).strict())
        .min(1)
        .max(4),
    })
    .strict(),
  z
    .object({
      modo: z.literal('coordenadas'),
      sistemas: z.array(z.enum(['polares', 'cilindricas', 'esfericas'])).min(1).max(3),
    })
    .strict(),
  z.object({ modo: z.literal('gaussiana') }).strict(),
  z
    .object({ modo: z.literal('matricial'), casos: z.array(z.enum(QUADRATIC_CASE_IDS)).min(1).max(3) })
    .strict(),
  z
    .object({ modo: z.literal('lagrange'), casos: z.array(z.enum(LAGRANGE_CASE_IDS)).min(1).max(3) })
    .strict(),
  z.object({ modo: z.literal('kkt'), casos: z.array(z.enum(KKT_CASE_IDS)).min(1).max(2) }).strict(),
]);

export type SurfaceVizConfig = z.infer<typeof parametersSchema>;
