import { useMemo, useState } from 'react';
import { lagrangeInterpolant, naturalCubicSpline } from '../../../lib/numerics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { sci } from './format.ts';

const STEPS_PER_SECOND = 1.5;
const DOT_RADIUS = 5;
/** Margin around the data, as a fraction of their range. */
const MARGIN = 0.25;

interface SplineViewProps {
  title: string;
  points: readonly (readonly [number, number])[];
  polynomial: boolean;
}

/**
 * A natural cubic spline drawn piece by piece: one cubic between each pair of
 * consecutive points, glued so that value, slope and curvature agree at every
 * knot, with zero curvature at the ends. The single polynomial through the
 * same points can be overlaid for comparison.
 */
export function SplineView({ title, points, polynomial }: SplineViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'toggle' as const,
        key: 'polinomio',
        label: 'Mostrar el polinomio por los mismos puntos',
        default: polynomial,
      },
    ],
    [polynomial],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, unknown>;
  const showPolynomial = Boolean(values.polinomio);
  const sorted = [...points].sort((p, q) => p[0] - q[0]);
  const xs = sorted.map((p) => p[0]);
  const ys = sorted.map((p) => p[1]);
  const spline = naturalCubicSpline(xs, ys);
  const poly = lagrangeInterpolant(xs, ys);
  const pieces = xs.length - 1;
  const [shown, setShown] = useState(pieces);
  const playback = usePlayback({
    step: () => setShown((value) => Math.min(pieces, value + 1)),
    reset: () => setShown(0),
    rate: STEPS_PER_SECOND,
    done: shown >= pieces,
  });
  const x0 = xs[0] ?? 0;
  const x1 = xs[xs.length - 1] ?? 1;
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const span = yMax - yMin || 1;
  const reach = xs[Math.min(shown, pieces)] ?? x0;
  const knot = Math.max(0, Math.min(shown, pieces));
  const curvature = spline.second[knot] ?? 0;
  const description =
    `Spline cúbico natural por ${xs.length} puntos: ${shown} de ${pieces} piezas dibujadas. ` +
    `Segunda derivada en los nudos: ${spline.second.map((s) => s.toFixed(2)).join(', ')}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Piezas cúbicas', value: `${shown} de ${pieces}` },
        { label: `S'' en el nudo ${knot}`, value: sci(curvature) },
        { label: "S'' en los extremos", value: '0 y 0' },
      ]}
      legend={[
        { label: 'Spline cúbico natural', color: DATA_COLORS.primary, shape: 'line' },
        ...(showPolynomial
          ? [
              {
                label: 'Polinomio interpolante',
                color: DATA_COLORS.secondary,
                shape: 'dashed' as const,
              },
            ]
          : []),
        { label: 'Puntos', color: DATA_COLORS.text, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`S(x) = a_i + b_i(x - x_i) + c_i(x - x_i)^2 + d_i(x - x_i)^3\\ \\text{en}\\ [x_i, x_{i+1}],\\qquad S''(x_{${knot}}) = ${sci(curvature, true)},\\quad S''(x_0) = S''(x_{${pieces}}) = 0`}
      />
      <FunctionPlot
        xDomain={[x0 - (x1 - x0) * 0.05, x1 + (x1 - x0) * 0.05]}
        yDomain={[yMin - span * MARGIN * 2, yMax + span * MARGIN * 2]}
        label={description}
        curves={[
          ...(showPolynomial
            ? [{ f: poly, color: DATA_COLORS.secondary, width: 2, dashed: true, from: x0, to: x1 }]
            : []),
          ...(shown > 0
            ? [{ f: spline, color: DATA_COLORS.primary, width: 3, from: x0, to: reach }]
            : []),
        ]}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {xs.map((xi, i) => (
              <circle
                key={i}
                cx={x(xi)}
                cy={y(ys[i] ?? 0)}
                r={DOT_RADIUS}
                fill="var(--color-surface)"
                stroke={DATA_COLORS.text}
                strokeWidth={2}
              />
            ))}
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
