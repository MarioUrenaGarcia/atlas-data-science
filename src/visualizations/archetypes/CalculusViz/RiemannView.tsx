import { useMemo, useState } from 'react';
import { CALC_FUNCTIONS } from '../../../lib/calculus/catalog.ts';
import { integrate, riemannPieces, type RiemannRule } from '../../../lib/calculus/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { autoYDomain } from '../../core/svg/plotDomain.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';

const MAX_DOUBLINGS = 7;
const STEPS_PER_SECOND = 0.8;
const RULES: { value: RiemannRule; label: string; latex: string }[] = [
  { value: 'izquierda', label: 'Extremo izquierdo', latex: 'f(x_{i-1})' },
  { value: 'derecha', label: 'Extremo derecho', latex: 'f(x_i)' },
  { value: 'punto-medio', label: 'Punto medio', latex: 'f\\big(\\tfrac{x_{i-1} + x_i}{2}\\big)' },
  { value: 'trapecio', label: 'Trapecio', latex: '\\tfrac{f(x_{i-1}) + f(x_i)}{2}' },
];

interface RiemannViewProps {
  title: string;
  id: string;
  interval: [number, number];
  rule: RiemannRule;
}

/**
 * Riemann sums with n = 1, 2, 4, ... subintervals. Each rectangle (or
 * trapezoid) approximates the area of one strip; doubling n refines the
 * partition and the sum approaches the integral. Pieces below the axis count
 * as negative area.
 */
export function RiemannView({ title, id, interval, rule }: RiemannViewProps) {
  const fn = CALC_FUNCTIONS[id] ?? CALC_FUNCTIONS.cuadrada;
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'regla',
        label: 'Altura de cada pieza',
        options: RULES.map(({ value, label }) => ({ value, label })),
        default: rule,
      },
    ],
    [rule],
  );
  const parameters = useParameters(definitions);
  const chosen = (parameters.values as Record<string, RiemannRule>).regla ?? rule;
  const [doublings, setDoublings] = useState(0);
  const playback = usePlayback({
    step: () => setDoublings((value) => Math.min(MAX_DOUBLINGS, value + 1)),
    reset: () => setDoublings(0),
    rate: STEPS_PER_SECOND,
    done: doublings >= MAX_DOUBLINGS,
  });
  if (!fn) return null;
  const [a, b] = interval;
  const n = 2 ** doublings;
  const pieces = riemannPieces(fn.f, a, b, n, chosen);
  const sum = pieces.reduce((total, piece) => total + piece.area, 0);
  const exact = fn.antiderivative
    ? fn.antiderivative(b) - fn.antiderivative(a)
    : integrate(fn.f, a, b);
  const ruleLatex = RULES.find((item) => item.value === chosen)?.latex ?? 'f(x_i)';
  const description =
    `Suma de Riemann con n = ${n} piezas de ancho ${formatNumber((b - a) / n, 4)} (regla: ${chosen}): ${formatNumber(sum, 5)}. ` +
    `Integral exacta ${formatNumber(exact, 5)}, error ${formatNumber(Math.abs(sum - exact), 5)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'Piezas n', value: String(n) },
        { label: 'Ancho Δx', value: formatNumber((b - a) / n, 4) },
        { label: 'Suma de Riemann', value: formatNumber(sum, 5), color: DATA_COLORS.secondary },
        { label: 'Integral', value: formatNumber(exact, 5), color: DATA_COLORS.primary },
        { label: 'Error', value: formatNumber(Math.abs(sum - exact), 5) },
      ]}
      legend={[
        { label: 'f(x)', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Pieza con área positiva', color: DATA_COLORS.secondary },
        { label: 'Pieza con área negativa', color: DATA_COLORS.quaternary },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`S_{${n}} = \\sum_{i=1}^{${n}} ${ruleLatex}\\,\\Delta x = ${formatNumber(sum, 5)} \\ \\approx\\ \\int_{${formatNumber(a, 2)}}^{${formatNumber(b, 2)}} ${fn.latex}\\,dx = ${formatNumber(exact, 5)}`}
        />
      </p>
      <FunctionPlot
        xDomain={[a - (b - a) * 0.1, b + (b - a) * 0.1]}
        yDomain={autoYDomain([{ f: fn.f, color: '', from: a, to: b }], [a, b])}
        label={description}
        curves={[{ f: fn.f, color: DATA_COLORS.primary, width: 3 }]}
        background={({ x, y }) => (
          <g aria-hidden="true">
            {pieces.map((piece, index) => {
              const [h0, h1] = piece.heights;
              const color = piece.area >= 0 ? DATA_COLORS.secondary : DATA_COLORS.quaternary;
              const points = `${x(piece.x0)},${y(0)} ${x(piece.x0)},${y(h0)} ${x(piece.x1)},${y(h1)} ${x(piece.x1)},${y(0)}`;
              return (
                <polygon
                  key={index}
                  points={points}
                  fill={color}
                  fillOpacity={0.35}
                  stroke={color}
                  strokeWidth={n > 32 ? 0.5 : 1.2}
                />
              );
            })}
          </g>
        )}
      />
    </VizFrame>
  );
}
