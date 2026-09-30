import { z } from 'zod';

const matrix = z
  .array(z.array(z.number().min(-100).max(100)).min(1).max(5))
  .min(1)
  .max(5)
  .refine(
    (rows) => rows.every((row) => row.length === rows[0]?.length),
    'Todas las filas deben tener la misma longitud.',
  );

export const SPECIAL_KINDS = [
  'identidad',
  'diagonal',
  'triangular-superior',
  'triangular-inferior',
  'simetrica',
  'antisimetrica',
  'ortogonal',
  'permutacion',
] as const;

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('operaciones'),
      a: matrix,
      b: matrix,
      escalar: z.number().min(-5).max(5).optional(),
      vista: z.enum(['suma', 'escalar', 'producto']).optional(),
    })
    .strict(),
  z.object({ modo: z.literal('transpuesta'), a: matrix, b: matrix.optional() }).strict(),
  z
    .object({
      modo: z.literal('especiales'),
      tipos: z.array(z.enum(SPECIAL_KINDS)).min(1).optional(),
      n: z.number().int().min(2).max(5).optional(),
    })
    .strict(),
  z.object({ modo: z.literal('traza'), a: matrix, b: matrix }).strict(),
  z.object({ modo: z.literal('kronecker'), a: matrix, b: matrix }).strict(),
  z
    .object({
      modo: z.literal('dispersa'),
      patron: z.enum(['tridiagonal', 'banda', 'aleatoria', 'rejilla']).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('tensor'),
      forma: z
        .tuple([
          z.number().int().min(2).max(4),
          z.number().int().min(2).max(5),
          z.number().int().min(2).max(5),
        ])
        .optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('bajo-rango'),
      imagen: z.enum(['figura', 'degradado', 'tablero']).optional(),
    })
    .strict(),
]);

export type MatrixGridConfig = z.infer<typeof parametersSchema>;
export type SpecialKind = (typeof SPECIAL_KINDS)[number];
