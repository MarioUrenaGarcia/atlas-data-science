import { z } from 'zod';
import { JOINT_MODELS } from '../../../lib/probability/joint.ts';
import { VARIABLE_IDS, findVariable } from '../../../lib/probability/randomVariable.ts';
import { EXPERIMENT_IDS, experiment } from '../../../lib/probability/sampleSpace.ts';

export const JOINT_MODES = [
  'conjunta',
  'marginales',
  'condicional',
  'esperanza-condicional',
  'esperanza-total',
  'varianza-total',
  'independencia',
  'covarianza',
  'suma',
  'matriz-covarianza',
] as const;

export const parametersSchema = z
  .object({
    modo: z.enum(JOINT_MODES),
    /** Two variables defined on the same classic experiment. */
    experimento: z.enum(EXPERIMENT_IDS).optional(),
    variable: z.enum(VARIABLE_IDS).optional(),
    segunda: z.enum(VARIABLE_IDS).optional(),
    /** A finite joint table: one row of probabilities per value of X, one column per value of Y. */
    valoresX: z.array(z.number()).min(1).max(12).optional(),
    valoresY: z.array(z.number()).min(1).max(12).optional(),
    probabilidades: z
      .array(z.array(z.number().nonnegative()).min(1).max(12))
      .min(1)
      .max(12)
      .optional(),
    /** A continuous joint density, discretized on a fine grid. */
    modelo: z.enum(JOINT_MODELS).optional(),
    /** Parameters of the model: muX, muY, sigmaX, sigmaY, rho for the normal; lambda for the exponentials. */
    parametros: z.record(z.string(), z.number()).optional(),
    /** Names and symbols of the two variables when the source is a table or a model. */
    nombreX: z.string().min(1).optional(),
    nombreY: z.string().min(1).optional(),
    simboloX: z.string().min(1).optional(),
    simboloY: z.string().min(1).optional(),
    /** Initial point: the corner of P(X <= x, Y <= y), the conditioning value of X or the sum s. */
    x: z.number().optional(),
    y: z.number().optional(),
    s: z.number().optional(),
    /** Whether the correlation (and the standard deviations of the normal) get sliders. */
    editable: z.boolean().optional(),
    contexto: z.string().min(1).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict()
  .superRefine((value, context) => {
    const sources = [
      value.experimento !== undefined,
      value.probabilidades !== undefined,
      value.modelo !== undefined,
    ].filter(Boolean).length;
    if (sources !== 1) {
      context.addIssue({
        code: 'custom',
        path: ['experimento'],
        message: 'indique exactamente una fuente: experimento, probabilidades o modelo',
      });
    }
    if (value.experimento) {
      for (const id of [value.variable, value.segunda]) {
        if (!id || !findVariable(value.experimento, id)) {
          context.addIssue({
            code: 'custom',
            path: ['variable'],
            message: `indique dos variables definidas para ${experiment(value.experimento).label}`,
          });
        }
      }
    }
    if (value.probabilidades) {
      const rows = value.probabilidades;
      if (
        !value.valoresX ||
        !value.valoresY ||
        rows.length !== value.valoresX.length ||
        rows.some((row) => row.length !== value.valoresY?.length)
      ) {
        context.addIssue({
          code: 'custom',
          path: ['probabilidades'],
          message: 'una fila por valor de X y una columna por valor de Y',
        });
      }
    }
    if (value.modo === 'matriz-covarianza' && value.modelo !== 'normal-bivariada') {
      context.addIssue({
        code: 'custom',
        path: ['modelo'],
        message: 'el modo matriz-covarianza usa el modelo normal-bivariada',
      });
    }
  });

export type JointDistribution2DConfig = z.infer<typeof parametersSchema>;
