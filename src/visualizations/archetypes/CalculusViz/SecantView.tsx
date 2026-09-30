import { useState } from 'react';
import { CALC_FUNCTIONS } from '../../../lib/calculus/catalog.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { autoYDomain } from '../../core/svg/plotDomain.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';

const STEPS = 30;
const SHRINK = 0.82;
const STEPS_PER_SECOND = 4;
const DOT_RADIUS = 6;

interface SecantViewProps {
  title: string;
  id: string;
  x0: number;
  h0: number;
}

/**
 * The derivative as the limit of secant slopes. A second point slides toward
 * (x0, f(x0)) and the secant through both turns into the tangent line; its
 * slope, the average rate of change, approaches f'(x0).
 */
export function SecantView({ title, id, x0, h0 }: SecantViewProps) {
  const fn = CALC_FUNCTIONS[id] ?? CALC_FUNCTIONS.cuadrada;
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  if (!fn) return null;
  const h = h0 * SHRINK ** step;
  const y0 = fn.f(x0);
  const x1 = x0 + h;
  const y1 = fn.f(x1);
  const secant = (y1 - y0) / h;
  const slope = fn.df(x0);
  const description =
    `Recta secante entre x₀ = ${formatNumber(x0, 2)} y x₀ + h con h = ${formatNumber(h, 4)}: pendiente ${formatNumber(secant, 4)}. ` +
    `La derivada en x₀ es ${formatNumber(slope, 4)}; la diferencia es ${formatNumber(Math.abs(secant - slope), 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'h', value: formatNumber(h, 4) },
        {
          label: 'Pendiente de la secante',
          value: formatNumber(secant, 4),
          color: DATA_COLORS.secondary,
        },
        {
          label: "f'(x₀), pendiente de la tangente",
          value: formatNumber(slope, 4),
          color: DATA_COLORS.highlight,
        },
        { label: 'Diferencia', value: formatNumber(Math.abs(secant - slope), 4) },
      ]}
      legend={[
        { label: 'f(x)', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Secante', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Tangente', color: DATA_COLORS.highlight, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`f(x) = ${fn.latex},\\quad \\frac{f(x_0 + h) - f(x_0)}{h} = ${formatNumber(secant, 4)} \\ \\xrightarrow[h \\to 0]{}\\ f'(x_0) = ${formatNumber(slope, 4)}`}
        />
      </p>
      <FunctionPlot
        xDomain={fn.domain}
        yDomain={autoYDomain([{ f: fn.f, color: '' }], fn.domain)}
        label={description}
        curves={[
          { f: fn.f, color: DATA_COLORS.primary, width: 3 },
          {
            f: (x) => y0 + slope * (x - x0),
            color: DATA_COLORS.highlight,
            dashed: true,
            width: 2,
            from: fn.domain[0],
            to: fn.domain[1],
          },
          {
            f: (x) => y0 + secant * (x - x0),
            color: DATA_COLORS.secondary,
            width: 2,
            from: fn.domain[0],
            to: fn.domain[1],
          },
        ]}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            <line
              x1={x(x0)}
              x2={x(x1)}
              y1={y(y0)}
              y2={y(y0)}
              stroke={DATA_COLORS.muted}
              strokeDasharray="3 3"
            />
            <line
              x1={x(x1)}
              x2={x(x1)}
              y1={y(y0)}
              y2={y(y1)}
              stroke={DATA_COLORS.muted}
              strokeDasharray="3 3"
            />
            <circle cx={x(x0)} cy={y(y0)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} />
            <circle cx={x(x1)} cy={y(y1)} r={DOT_RADIUS} fill={DATA_COLORS.secondary} />
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
