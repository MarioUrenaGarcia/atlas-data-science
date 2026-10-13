import { useMemo } from 'react';
import { FIELDS, type Field2, type Point2 } from '../../../lib/multivariable/index.ts';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';

const PLAIN: Record<string, string> = {
  suma: 'x + y (plano inclinado)',
  producto: 'xy (silla girada)',
  paraboloide: 'x² + y² (tazón)',
  eliptico: 'x² + 3y² (tazón alargado)',
  'cuadratica-girada': '2x² + 2xy + y² (tazón girado)',
  silla: 'x² - y² (silla)',
  'silla-mono': 'x³ - 3xy² (silla de mono)',
  gaussiana: 'e^(-(x² + y²)) (campana)',
  'dos-colinas': 'dos colinas',
  'min-y-silla': 'x³ - 3x + y² (mínimo y silla)',
  himmelblau: 'Himmelblau (cuatro mínimos)',
  ondas: 'sen x cos y (ondas)',
  plano: '2x - y + 1 (plano)',
  rosenbrock: 'valle de Rosenbrock',
};

export const fieldName = (id: string) => PLAIN[id] ?? id;

/**
 * Selector among catalog fields, optional sliders for a point (x, y) inside
 * the domain, and any extra parameters of the view.
 */
export function useFieldChoice(
  ids: readonly string[],
  point: Point2 | null,
  extra: readonly ParameterDefinition[] = [],
) {
  const first = FIELDS[ids[0] ?? 'paraboloide'] ?? (FIELDS.paraboloide as Field2);
  const [[x0, x1], [y0, y1]] = first.domain;
  const definitions = useMemo(
    () => [
      ...(ids.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'campo',
              label: 'Función',
              options: ids.map((id) => ({ value: id, label: fieldName(id) })),
              default: ids[0] ?? 'paraboloide',
            },
          ]
        : []),
      ...(point
        ? [
            {
              type: 'number' as const,
              key: 'px',
              label: 'Punto, coordenada x',
              symbol: 'x₀',
              min: x0,
              max: x1,
              step: 0.05,
              default: point[0],
              digits: 2,
            },
            {
              type: 'number' as const,
              key: 'py',
              label: 'Punto, coordenada y',
              symbol: 'y₀',
              min: y0,
              max: y1,
              step: 0.05,
              default: point[1],
              digits: 2,
            },
          ]
        : []),
      ...extra,
    ],
    [ids, point, extra, x0, x1, y0, y1],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string | number | boolean>;
  const id = ids.length > 1 ? String(values.campo) : (ids[0] ?? 'paraboloide');
  const field = FIELDS[id] ?? first;
  const [[dx0, dx1], [dy0, dy1]] = field.domain;
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const p: Point2 = point
    ? [clamp(Number(values.px), dx0, dx1), clamp(Number(values.py), dy0, dy1)]
    : [0, 0];
  return { parameters, values, field, point: p };
}
