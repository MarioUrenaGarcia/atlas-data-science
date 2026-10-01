import { z } from 'zod';

const TOLERANCE = 1e-6;

export const parametersSchema = z
  .object({
    hipotesis: z
      .array(z.object({ nombre: z.string().min(1), prior: z.number().min(0).max(1) }).strict())
      .min(2)
      .max(6),
    /** Possible observations with their probability under each hypothesis, in the same order. */
    observaciones: z
      .array(
        z
          .object({
            nombre: z.string().min(1),
            verosimilitudes: z.array(z.number().min(0).max(1)),
          })
          .strict(),
      )
      .min(2)
      .max(6),
    /** Fixed sequence of observed names; when absent, data are simulated from `verdadera`. */
    secuencia: z.array(z.string().min(1)).min(1).max(60).optional(),
    /** Index of the hypothesis that generates simulated data. */
    verdadera: z.number().int().min(0).max(5).optional(),
    contexto: z.string().min(1).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict()
  .superRefine((value, context) => {
    const k = value.hipotesis.length;
    const total = value.hipotesis.reduce((sum, h) => sum + h.prior, 0);
    if (Math.abs(total - 1) > TOLERANCE) {
      context.addIssue({
        code: 'custom',
        path: ['hipotesis'],
        message: `las a priori suman ${total}`,
      });
    }
    value.observaciones.forEach((observation, index) => {
      if (observation.verosimilitudes.length !== k) {
        context.addIssue({
          code: 'custom',
          path: ['observaciones', index],
          message: 'una verosimilitud por hipótesis',
        });
      }
    });
    // Under each hypothesis the observations must form a distribution.
    for (let h = 0; h < k; h += 1) {
      const sum = value.observaciones.reduce((acc, o) => acc + (o.verosimilitudes[h] ?? 0), 0);
      if (Math.abs(sum - 1) > TOLERANCE) {
        context.addIssue({
          code: 'custom',
          path: ['observaciones'],
          message: `bajo "${value.hipotesis[h]?.nombre}" las verosimilitudes suman ${sum}`,
        });
      }
    }
    const names = new Set(value.observaciones.map((o) => o.nombre));
    value.secuencia?.forEach((name, index) => {
      if (!names.has(name)) {
        context.addIssue({
          code: 'custom',
          path: ['secuencia', index],
          message: `"${name}" desconocida`,
        });
      }
    });
    if (value.verdadera !== undefined && value.verdadera >= k) {
      context.addIssue({ code: 'custom', path: ['verdadera'], message: 'índice fuera de rango' });
    }
  });

export type BayesUpdaterConfig = z.infer<typeof parametersSchema>;
