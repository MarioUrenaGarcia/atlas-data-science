import { z } from 'zod';
import { EXPERIMENT_IDS, experiment } from '../../../lib/probability/sampleSpace.ts';
import { VARIABLE_IDS, findVariable } from '../../../lib/probability/randomVariable.ts';
import { DISTRIBUTION_IDS } from '../../shared/distributionIds.ts';

export const RANDOM_VARIABLE_MODES = [
  'mapeo',
  'acumulada',
  'esperanza',
  'varianza',
  'lotus',
  'forma',
  'linealidad',
  'mixta',
] as const;

export const LOTUS_FUNCTIONS = [
  'cuadrado',
  'abs-centro',
  'lineal',
  'exponencial',
  'umbral',
] as const;

export const parametersSchema = z
  .object({
    modo: z.enum(RANDOM_VARIABLE_MODES),
    /** A variable defined on a classic experiment. */
    experimento: z.enum(EXPERIMENT_IDS).optional(),
    variable: z.enum(VARIABLE_IDS).optional(),
    /** Variables offered in the selector. */
    variables: z.array(z.enum(VARIABLE_IDS)).min(1).optional(),
    /** A second variable for the linearity mode, on the same experiment. */
    segunda: z.enum(VARIABLE_IDS).optional(),
    /** A finite distribution given directly; probabilities are normalized. */
    valores: z.array(z.number()).min(1).max(40).optional(),
    probabilidades: z.array(z.number().nonnegative()).min(1).max(40).optional(),
    /** A named distribution from the catalog, discretized for continuous ones. */
    distribucion: z.enum(DISTRIBUTION_IDS).optional(),
    parametros: z.record(z.string(), z.number()).optional(),
    /** Name and symbol used in labels when the source is not a catalog variable. */
    nombre: z.string().min(1).optional(),
    simbolo: z.string().min(1).optional(),
    /** Initial marker for the cumulative view and initial probability for the quantile. */
    x: z.number().optional(),
    p: z.number().gt(0).lt(1).optional(),
    vista: z.enum(['acumulada', 'supervivencia']).optional(),
    /** Affine change Y = aX + b in the variance mode. */
    a: z.number().min(-3).max(3).optional(),
    b: z.number().min(-10).max(10).optional(),
    funcion: z.enum(LOTUS_FUNCTIONS).optional(),
    /** Point masses of a mixed distribution; the continuous part carries the rest. */
    atomos: z
      .array(z.object({ x: z.number(), p: z.number().gt(0).lt(1) }).strict())
      .min(1)
      .max(6)
      .optional(),
    /** Center c of |X - c| and threshold of the indicator in the LOTUS mode. */
    c: z.number().optional(),
    /** Order of the moment in the shape mode. */
    orden: z.number().int().min(1).max(6).optional(),
    momento: z.enum(['crudo', 'central']).optional(),
    /** Whether the bars can be dragged to change the probabilities. */
    editable: z.boolean().optional(),
    contexto: z.string().min(1).optional(),
    semilla: z.number().int().nonnegative().optional(),
  })
  .strict()
  .superRefine((value, context) => {
    const sources = [
      value.experimento !== undefined,
      value.valores !== undefined,
      value.distribucion !== undefined,
    ].filter(Boolean).length;
    if (sources !== 1) {
      context.addIssue({
        code: 'custom',
        path: ['experimento'],
        message: 'indique exactamente una fuente: experimento, valores o distribucion',
      });
    }
    if (
      value.valores &&
      value.probabilidades &&
      value.valores.length !== value.probabilidades.length
    ) {
      context.addIssue({
        code: 'custom',
        path: ['probabilidades'],
        message: 'una probabilidad por valor',
      });
    }
    if (value.experimento) {
      const id = value.experimento;
      for (const variable of [value.variable, value.segunda, ...(value.variables ?? [])]) {
        if (variable && !findVariable(id, variable)) {
          context.addIssue({
            code: 'custom',
            path: ['variable'],
            message: `la variable "${variable}" no está definida para ${experiment(id).label}`,
          });
        }
      }
    }
    if (value.modo === 'mapeo' && !value.experimento) {
      context.addIssue({
        code: 'custom',
        path: ['modo'],
        message: 'el modo mapeo requiere un experimento',
      });
    }
    if (value.modo === 'mixta') {
      const mass = (value.atomos ?? []).reduce((total, atom) => total + atom.p, 0);
      if (!value.distribucion || !value.atomos || mass >= 1) {
        context.addIssue({
          code: 'custom',
          path: ['atomos'],
          message:
            'el modo mixta requiere una distribucion continua y atomos con probabilidad total menor que 1',
        });
      }
    }
    if (value.modo === 'linealidad' && (!value.experimento || !value.segunda)) {
      context.addIssue({
        code: 'custom',
        path: ['segunda'],
        message: 'el modo linealidad requiere un experimento y una segunda variable',
      });
    }
  });

export type RandomVariableLabConfig = z.infer<typeof parametersSchema>;
