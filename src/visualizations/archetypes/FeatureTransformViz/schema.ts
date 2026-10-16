import { z } from 'zod';
import { sampleSchema } from '../ChartGallery/schema.ts';

const label = z.string().min(1);
const axis = z.object({ variable: label, unidad: z.string().optional() }).strict();

export const TRANSFORMS = [
  'identidad',
  'raiz',
  'raiz-cubica',
  'log',
  'log10',
  'reciproco',
] as const;
export type TransformId = (typeof TRANSFORMS)[number];

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('transformacion'),
      muestra: sampleSchema,
      eje: axis,
      funcion: z.enum(TRANSFORMS).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.enum(['box-cox', 'yeo-johnson']),
      muestra: sampleSchema,
      eje: axis,
      /** Initial lambda once the sweep ends; defaults to the optimum. */
      lambda: z.number().min(-2).max(3).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('atipicos-riq'),
      muestra: sampleSchema,
      eje: axis,
      k: z.number().min(0.5).max(3).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('atipicos-z'),
      muestra: sampleSchema,
      eje: axis,
      /** Extreme values added one at a time to the sample. */
      extremos: z.array(z.number()).min(1).max(10),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
]);

export type FeatureTransformConfig = z.infer<typeof parametersSchema>;
