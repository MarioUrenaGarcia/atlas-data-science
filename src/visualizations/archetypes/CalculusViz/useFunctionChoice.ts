import { useMemo } from 'react';
import { CALC_FUNCTIONS, type CalcFunction } from '../../../lib/calculus/catalog.ts';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';

/**
 * Selector among catalog functions plus extra parameters of the view. With a
 * single function the selector is omitted.
 */
export function useFunctionChoice(
  ids: readonly string[],
  extra: readonly ParameterDefinition[] = [],
) {
  const definitions = useMemo(
    () => [
      ...(ids.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'funcion',
              label: 'Función',
              options: ids.map((id) => ({ value: id, label: plainLabel(id) })),
              default: ids[0] ?? '',
            },
          ]
        : []),
      ...extra,
    ],
    [ids, extra],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string | number | boolean>;
  const id = ids.length > 1 ? String(values.funcion) : (ids[0] ?? '');
  const fn = CALC_FUNCTIONS[id] ?? CALC_FUNCTIONS.cuadrada;
  return { parameters, values, fn: fn as CalcFunction };
}

const PLAIN: Record<string, string> = {
  cuadrada: 'x²',
  cubica: 'x³ - 3x',
  cuartica: 'x⁴ - 4x² + x',
  seno: 'sen x',
  coseno: 'cos x',
  exponencial: 'eˣ',
  logaritmo: 'log x',
  raiz: 'raíz de x',
  reciproca: '1/x',
  'inverso-cuadrado': '1/x²',
  'inverso-raiz': '1/raíz de x',
  'valor-absoluto': '|x|',
  'raiz-cubica': 'raíz cúbica de x',
  gauss: 'e^(-x²)',
  'x-exp': 'x e^(-x)',
  sigmoide: 'sigmoide',
  softplus: 'softplus',
  escalon: 'escalón H(x)',
  'seno-sobre-x': 'sen x / x',
  'seno-cuadrado': 'sen(x²)',
  gamma: 'gamma',
};

/** Plain-text name of a catalog function, for selectors and descriptions. */
export function plainLabel(id: string): string {
  return PLAIN[id] ?? id;
}
