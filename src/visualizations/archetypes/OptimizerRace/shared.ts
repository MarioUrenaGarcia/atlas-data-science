import { useMemo } from 'react';
import { TEST_FUNCTIONS, type Point, type TestFunction } from '../../../lib/optimization/index.ts';
import type { PathMethod } from '../../../lib/optimization/paths.ts';
import { num } from '../../core/plane/levels.ts';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';

export const METHOD_NAMES: Record<PathMethod, string> = {
  gradiente: 'Descenso de gradiente',
  momentum: 'Momento',
  nesterov: 'Nesterov',
  adagrad: 'AdaGrad',
  rmsprop: 'RMSProp',
  adam: 'Adam',
  newton: 'Newton',
  'gradiente-armijo': 'Gradiente con Armijo',
  'gradiente-exacto': 'Gradiente con paso exacto',
  bfgs: 'BFGS',
  lbfgs: 'L-BFGS',
  conjugado: 'Gradiente conjugado',
  coordenadas: 'Descenso por coordenadas',
};

/** Methods whose step is a fixed learning rate chosen by the reader. */
export const USES_RATE = new Set<PathMethod>(['gradiente', 'momentum', 'nesterov', 'adagrad', 'rmsprop', 'adam', 'newton']);

export const fnOf = (id: string): TestFunction => TEST_FUNCTIONS[id] ?? (TEST_FUNCTIONS.cuadratica as TestFunction);
export const point = (p: Point, digits = 2) => `(${num(p[0], digits)}, ${num(p[1], digits)})`;
export const pointTex = (p: Point, digits = 3) => `\\begin{pmatrix} ${num(p[0], digits)} \\\\ ${num(p[1], digits)} \\end{pmatrix}`;

/** Lowest value of the function among its known minimizers, or null when it has none. */
export function knownMinimum(fn: TestFunction): number | null {
  return fn.minima.length ? Math.min(...fn.minima.map((m) => fn.f(m))) : null;
}

/**
 * Selector among test functions and sliders for a starting point. The start
 * is clamped to the window of the chosen function.
 */
export function useFunctionChoice(ids: readonly string[], start: Point | null, extra: readonly ParameterDefinition[] = []) {
  const first = fnOf(ids[0] ?? 'cuadratica');
  const definitions = useMemo(
    () => [
      ...(ids.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'funcion',
              label: 'Función',
              options: ids.map((id) => ({ value: id, label: fnOf(id).label })),
              default: ids[0] ?? 'cuadratica',
            },
          ]
        : []),
      ...(start
        ? [
            {
              type: 'number' as const,
              key: 'x0',
              label: 'Punto inicial, coordenada x',
              symbol: 'x₀',
              min: first.domain.x[0],
              max: first.domain.x[1],
              step: 0.1,
              default: start[0],
              digits: 1,
            },
            {
              type: 'number' as const,
              key: 'y0',
              label: 'Punto inicial, coordenada y',
              symbol: 'y₀',
              min: first.domain.y[0],
              max: first.domain.y[1],
              step: 0.1,
              default: start[1],
              digits: 1,
            },
          ]
        : []),
      ...extra,
    ],
    [ids, start, extra, first],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string | number | boolean>;
  const fn = fnOf(ids.length > 1 ? String(values.funcion) : (ids[0] ?? 'cuadratica'));
  const clamp = (v: number, [lo, hi]: [number, number]) => Math.max(lo, Math.min(hi, v));
  const x0: Point = start ? [clamp(Number(values.x0), fn.domain.x), clamp(Number(values.y0), fn.domain.y)] : [0, 0];
  return { parameters, values, fn, start: x0 };
}

/** Element of a list that is known to exist; a missing one is a programming error. */
export function item<T>(list: readonly T[], index: number): T {
  const value = list[index];
  if (value === undefined) throw new RangeError(`índice ${index} fuera de la lista de ${list.length}`);
  return value;
}
