import { z } from 'zod';
import { NOTATION_IDS, SEQUENCE_IDS, SERIES_IDS, SUP_SET_IDS } from './catalog.ts';

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('sucesion'),
      sucesion: z.enum(SEQUENCE_IDS),
      sucesiones: z.array(z.enum(SEQUENCE_IDS)).min(1).optional(),
      epsilon: z.number().positive().optional(),
      terminos: z.number().int().min(5).max(200).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('supremo'),
      conjunto: z.enum(SUP_SET_IDS),
      conjuntos: z.array(z.enum(SUP_SET_IDS)).min(1).optional(),
      epsilon: z.number().positive().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('serie'),
      serie: z.enum(SERIES_IDS),
      series: z.array(z.enum(SERIES_IDS)).min(1).optional(),
      terminos: z.number().int().min(5).max(400).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('geometrica'),
      razon: z.number().min(-1.2).max(1.2).optional(),
      primero: z.number().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('sumatoria'),
      expresion: z.enum(NOTATION_IDS),
      expresiones: z.array(z.enum(NOTATION_IDS)).min(1).optional(),
      n: z.number().int().min(1).max(12).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('datos'),
      valores: z.array(z.number()).min(2).max(9),
      nombre: z.string().min(1).optional(),
    })
    .strict(),
]);

export type SequenceSeriesConfig = z.infer<typeof parametersSchema>;
