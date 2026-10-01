import { z } from 'zod';

export const MODES = [
  'normal',
  'construccion',
  'elipse',
  'condicional',
  'mahalanobis',
  't',
  'dirichlet',
  'wishart',
  'lkj',
] as const;
export type Mode = (typeof MODES)[number];

const values = z.record(z.string(), z.number());
const point = z.tuple([z.number().min(-8).max(8), z.number().min(-8).max(8)]);

/** A preset with real context that loads parameter values with one click. */
const preset = z
  .object({
    nombre: z.string().min(1).max(40),
    descripcion: z.string().min(1).max(320),
    valores: values,
  })
  .strict();

export const parametersSchema = z
  .object({
    modo: z.enum(MODES),
    /** Initial parameter values: mu1, mu2, sigma1, sigma2, rho, nu, a1, a2, a3, d, eta, nivel, corte. */
    valores: values.optional(),
    /** Probabilities of the contour ellipses drawn in the normal and t modes. */
    niveles: z.array(z.number().gt(0).lt(1)).min(1).max(4).optional(),
    /** Shows the principal axes of the covariance. */
    ejes: z.boolean().optional(),
    /** In the ellipse mode, also draws the rectangle of the two marginal intervals. */
    caja: z.boolean().optional(),
    /** In the Mahalanobis mode, the draggable points. */
    puntos: z.array(point).min(1).max(2).optional(),
    /** In the Wishart mode, samples the inverse Wishart instead. */
    inversa: z.boolean().optional(),
    casos: z.array(preset).max(6).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict();

export type MultivariateConfig = z.infer<typeof parametersSchema>;
export type MultivariatePreset = z.infer<typeof preset>;
