import { useMemo, useState } from 'react';
import {
  enumerateRationals,
  MEASURE_FUNCTIONS,
  type MeasureFunctionId,
} from '../../../lib/measure/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';

const STEPS_PER_SECOND = 3;
const DEFAULT_POINTS = 25;
const DOT_RADIUS = 4;
/** Size of the change at each marked point, upward where f is low and downward where it is high. */
const SHIFT = 0.4;

/** Value of g at a changed point: always different from f, and inside [0, 1]. */
const changed = (value: number) => (value > 0.5 ? value - SHIFT : value + SHIFT);

interface AlmostSureViewProps {
  title: string;
  id: MeasureFunctionId;
  points?: number;
}

/**
 * Two functions equal almost everywhere: g is f changed at rational points,
 * where it moves 0.4 up or down. The changed points form a set of measure zero, so the
 * area under the curve, the Lebesgue integral, is the same for f and g. The
 * animation changes one more rational point per step.
 */
export function AlmostSureView({ title, id, points = DEFAULT_POINTS }: AlmostSureViewProps) {
  const fn = MEASURE_FUNCTIONS[id];
  const rationals = useMemo(() => enumerateRationals(points), [points]);
  const [shown, setShown] = useState(0);
  const playback = usePlayback({
    step: () => setShown((value) => Math.min(points, value + 1)),
    reset: () => setShown(0),
    rate: STEPS_PER_SECOND,
    done: shown >= points,
  });
  const marked = rationals.slice(0, shown);
  const description =
    `g coincide con f(x) = ${fn.name} salvo en ${shown} puntos racionales, donde se desplaza 0.4. ` +
    `El conjunto donde difieren tiene medida 0 y las dos integrales valen ${formatNumber(fn.integral, 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Puntos cambiados', value: String(shown) },
        { label: 'λ({f ≠ g})', value: '0', color: DATA_COLORS.highlight },
        { label: '∫ f dλ', value: formatNumber(fn.integral, 4) },
        { label: '∫ g dλ', value: formatNumber(fn.integral, 4) },
      ]}
      legend={[
        {
          label: 'f, y g fuera de los puntos cambiados',
          color: DATA_COLORS.primary,
          shape: 'line',
        },
        {
          label: 'Valores de g en los puntos cambiados',
          color: DATA_COLORS.highlight,
          shape: 'circle',
        },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`f = g \\ \\text{c.s.},\\quad \\lambda(\\{f \\ne g\\}) = 0 \\;\\Longrightarrow\\; \\int_0^1 g\\,d\\lambda = \\int_0^1 f\\,d\\lambda = ${formatNumber(fn.integral, 4)}`}
      />
      <FunctionPlot
        xDomain={[0, 1]}
        yDomain={[0, 1.1]}
        label={description}
        curves={[
          {
            f: fn.f,
            color: DATA_COLORS.primary,
            width: 3,
            breaks: id === 'escalon' ? [0.5] : undefined,
          },
        ]}
        background={({ x, y }) => {
          const n = 200;
          const pts = Array.from({ length: n + 1 }, (_, i) => `${x(i / n)},${y(fn.f(i / n))}`);
          return (
            <polygon
              points={`${x(0)},${y(0)} ${pts.join(' ')} ${x(1)},${y(0)}`}
              fill={DATA_COLORS.primary}
              fillOpacity={0.15}
              aria-hidden="true"
            />
          );
        }}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {marked.map((r, i) => (
              <g key={i}>
                <line
                  x1={x(r.value)}
                  x2={x(r.value)}
                  y1={y(fn.f(r.value))}
                  y2={y(changed(fn.f(r.value)))}
                  stroke={DATA_COLORS.highlight}
                  strokeDasharray="3 3"
                  strokeOpacity={0.6}
                />
                <circle
                  cx={x(r.value)}
                  cy={y(changed(fn.f(r.value)))}
                  r={DOT_RADIUS}
                  fill={DATA_COLORS.highlight}
                  stroke="var(--color-surface)"
                  strokeWidth={1.5}
                />
              </g>
            ))}
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
