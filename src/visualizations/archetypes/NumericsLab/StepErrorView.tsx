import { useMemo, useState } from 'react';
import { NUMERIC_FUNCTIONS } from '../../../lib/numerics/functions.ts';
import {
  differenceErrorModel,
  finiteDifference,
  optimalStep,
  type DifferenceScheme,
} from '../../../lib/numerics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { exact, sci } from './format.ts';

const K_MIN = -16;
const K_MAX = 0;
const K_STEP = 0.25;
const STEPS_PER_SECOND = 6;
const Y_DOMAIN: [number, number] = [-14, 1];
const DOT_RADIUS = 6;
/** Floor for the logarithm of an error that happens to be exactly zero. */
const ZERO_ERROR = 1e-17;
/** Digits that show where the approximation starts to differ from the derivative. */
const DIGITS = 12;

interface StepErrorViewProps {
  title: string;
  id: string;
  x0: number;
  scheme: DifferenceScheme;
  initialExponent: number;
}

/**
 * Error of a finite difference as the step h = 10^k shrinks, on logarithmic
 * axes. For large h the truncation error dominates and falls with a fixed
 * slope; for tiny h the rounding error of f(x + h) - f(x), divided by h, takes
 * over and grows. The best step sits where both are similar.
 */
export function StepErrorView({ title, id, x0, scheme, initialExponent }: StepErrorViewProps) {
  const fn = NUMERIC_FUNCTIONS[id] ?? NUMERIC_FUNCTIONS.exponencial;
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'esquema',
        label: 'Diferencia',
        options: [
          { value: 'adelante', label: 'Hacia adelante, (f(x + h) - f(x)) / h' },
          { value: 'centrada', label: 'Centrada, (f(x + h) - f(x - h)) / 2h' },
        ],
        default: scheme,
      },
    ],
    [scheme],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, unknown>;
  const chosen = String(values.esquema) as DifferenceScheme;
  const startIndex = Math.round((K_MAX - initialExponent) / K_STEP);
  const total = Math.round((K_MAX - K_MIN) / K_STEP);
  const [index, setIndex] = useState(startIndex);
  const playback = usePlayback({
    step: () => setIndex((value) => Math.min(total, value + 1)),
    reset: () => setIndex(startIndex),
    rate: STEPS_PER_SECOND,
    done: index >= total,
  });
  if (!fn) return null;
  const k = K_MAX - index * K_STEP;
  const h = 10 ** k;
  const truth = fn.d1(x0);
  const approx = finiteDifference(fn.f, x0, h, chosen);
  const error = Math.abs(approx - truth);
  const curvature = Math.abs(chosen === 'adelante' ? fn.d2(x0) : fn.d3(x0)) || 1;
  const size = Math.abs(fn.f(x0)) || 1;
  const model = differenceErrorModel(h, chosen, curvature, size);
  const best = optimalStep(chosen, curvature, size);
  const log = (v: number) => Math.log10(Math.max(ZERO_ERROR, v));
  const actualCurve = (t: number) =>
    log(Math.abs(finiteDifference(fn.f, x0, 10 ** t, chosen) - truth));
  const formula =
    chosen === 'adelante'
      ? `\\frac{f(${x0} + h) - f(${x0})}{h}`
      : `\\frac{f(${x0} + h) - f(${x0} - h)}{2h}`;
  const description =
    `Derivada de ${id} en x = ${x0} con h = ${sci(h)}: aproximación ${exact(approx)}, valor exacto ${exact(truth)}, error ${sci(error)}. ` +
    `Error de truncamiento del modelo ${sci(model.truncation)} y de redondeo ${sci(model.rounding)}; el mejor paso es cerca de ${sci(best)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Paso h', value: sci(h) },
        { label: 'Aproximación', value: exact(approx, false, DIGITS), color: DATA_COLORS.primary },
        { label: 'Derivada exacta', value: exact(truth, false, DIGITS) },
        { label: 'Error', value: sci(error), color: DATA_COLORS.highlight },
        {
          label: 'Truncamiento (modelo)',
          value: sci(model.truncation),
          color: DATA_COLORS.secondary,
        },
        { label: 'Redondeo (modelo)', value: sci(model.rounding), color: DATA_COLORS.tertiary },
        { label: 'Mejor paso', value: sci(best) },
      ]}
      legend={[
        { label: 'Error medido', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Truncamiento', color: DATA_COLORS.secondary, shape: 'dashed' },
        { label: 'Redondeo', color: DATA_COLORS.tertiary, shape: 'dashed' },
        { label: 'Paso actual', color: DATA_COLORS.highlight, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`${formula}\\Big|_{h = ${sci(h, true)}} = ${exact(approx, true)},\\qquad |\\text{error}| = ${sci(error, true)}\\ \\approx\\ \\underbrace{${sci(model.truncation, true)}}_{\\text{truncamiento}} + \\underbrace{${sci(model.rounding, true)}}_{\\text{redondeo}}`}
      />
      <FunctionPlot
        xDomain={[K_MIN, K_MAX]}
        yDomain={Y_DOMAIN}
        xLabel="log₁₀ h"
        label={`Logaritmo del error contra logaritmo del paso. ${description}`}
        curves={[
          { f: actualCurve, color: DATA_COLORS.primary, width: 2 },
          {
            f: (t) => log(differenceErrorModel(10 ** t, chosen, curvature, size).truncation),
            color: DATA_COLORS.secondary,
            width: 2,
            dashed: true,
          },
          {
            f: (t) => log(differenceErrorModel(10 ** t, chosen, curvature, size).rounding),
            color: DATA_COLORS.tertiary,
            width: 2,
            dashed: true,
          },
        ]}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            <line
              x1={x(Math.log10(best))}
              x2={x(Math.log10(best))}
              y1={y(Y_DOMAIN[0])}
              y2={y(Y_DOMAIN[1])}
              stroke={DATA_COLORS.muted}
              strokeDasharray="4 4"
            />
            <circle
              cx={x(k)}
              cy={y(log(error))}
              r={DOT_RADIUS}
              fill={DATA_COLORS.highlight}
              stroke="var(--color-surface)"
              strokeWidth={2}
            />
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
