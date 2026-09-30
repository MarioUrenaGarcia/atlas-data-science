import { useMemo } from 'react';
import { useParameters } from '../../core/useParameters.ts';
import { IDENTITY, type Mat2 } from './matrix2.ts';

export interface NamedMatrix {
  nombre: string;
  matriz: Mat2;
}

const ENTRY_RANGE = 3;
const ENTRY_STEP = 0.1;
const ENTRY_KEYS = [
  ['a', 'b'],
  ['c', 'd'],
] as const;

/**
 * The matrix shown by a view. With several named matrices the reader picks
 * one from a list; with a single one each entry gets its own slider.
 */
export function useMatrixChoice(matrices: readonly NamedMatrix[], prefix = '') {
  const first = matrices[0]?.matriz ?? IDENTITY;
  const editable = matrices.length === 1;
  const definitions = useMemo(
    () =>
      editable
        ? ENTRY_KEYS.flatMap((row, i) =>
            row.map((key, j) => ({
              type: 'number' as const,
              key: `${prefix}${key}`,
              label: `Entrada (${i + 1}, ${j + 1})${prefix ? ` de ${prefix.toUpperCase()}` : ''}`,
              symbol: `${prefix}${key}`,
              min: -Math.max(ENTRY_RANGE, Math.ceil(Math.abs(first[i]?.[j] ?? 0))),
              max: Math.max(ENTRY_RANGE, Math.ceil(Math.abs(first[i]?.[j] ?? 0))),
              step: ENTRY_STEP,
              default: first[i]?.[j] ?? 0,
              digits: 1,
            })),
          )
        : [
            {
              type: 'select' as const,
              key: `${prefix}matriz`,
              label: 'Matriz',
              options: matrices.map((item, index) => ({
                value: String(index),
                label: item.nombre,
              })),
              default: '0',
            },
          ],
    [editable, first, matrices, prefix],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const matrix: Mat2 = editable
    ? [
        [Number(values[`${prefix}a`]), Number(values[`${prefix}b`])],
        [Number(values[`${prefix}c`]), Number(values[`${prefix}d`])],
      ]
    : (matrices[Number(values[`${prefix}matriz`])]?.matriz ?? first);
  const name = editable ? 'A' : (matrices[Number(values[`${prefix}matriz`])]?.nombre ?? '');
  return { parameters, values, matrix, name };
}
