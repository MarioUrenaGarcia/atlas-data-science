import { z } from 'zod';

export const PARTITIONS = ['suma', 'suma-y-primero', 'completa', 'primero'] as const;
export type PartitionId = (typeof PARTITIONS)[number];

export const FACTORIZATION_MODELS = ['normal', 'poisson', 'uniforme'] as const;
export type FactorizationModel = (typeof FACTORIZATION_MODELS)[number];

export const parametersSchema = z.discriminatedUnion('modo', [
  z
    .object({
      modo: z.literal('suficiencia'),
      n: z.number().int().min(2).max(5).optional(),
      particion: z.enum(PARTITIONS).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('factorizacion'),
      /** Samples whose likelihood curves are compared. */
      muestras: z.array(z.array(z.number()).min(2).max(12)).min(2).max(4),
      sigma: z.number().positive().optional(),
      /** Model whose likelihood is factored; sigma applies only to the normal one. */
      modelo: z.enum(FACTORIZATION_MODELS).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('rao-blackwell'),
      lambda: z.number().positive().max(5).optional(),
      n: z.number().int().min(2).max(50).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('completitud'),
      /** Values g(0), ..., g(n) of the function of a binomial count. */
      g: z.array(z.number()).min(2).max(5).optional(),
    })
    .strict(),
  z
    .object({
      modo: z.literal('ancilar'),
      n: z.number().int().min(2).max(30).optional(),
      sigma: z.number().min(0.5).max(3).optional(),
      semilla: z.number().int().nonnegative().optional(),
    })
    .strict(),
]);

export type SufficiencyLabConfig = z.infer<typeof parametersSchema>;
