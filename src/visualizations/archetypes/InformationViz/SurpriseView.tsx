import { useState } from 'react';
import { surprise } from '../../../lib/information/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { bitsTex } from './units.ts';

const STEPS_PER_SECOND = 0.8;
const DOT_RADIUS = 6;
const Y_MAX = 8;
const P_MIN = 0.003;

interface SurpriseViewProps {
  title: string;
  events: readonly { nombre: string; p: number }[];
}

/**
 * The surprise -log2 p of an event as a function of its probability. The
 * animation visits each event, marks it on the curve and writes its surprise
 * in bits; rare events sit high on the curve, certain ones at zero.
 */
export function SurpriseView({ title, events }: SurpriseViewProps) {
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => (value + 1) % events.length),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
  });
  const current = events[Math.min(step, events.length - 1)] ?? { nombre: '', p: 0.5 };
  const bits = surprise(current.p);
  const description =
    `Evento "${current.nombre}" con probabilidad ${formatNumber(current.p, 4)}: sorpresa ${formatNumber(bits, 3)} bits. ` +
    events.map((e) => `${e.nombre}: ${formatNumber(surprise(e.p), 2)} bits`).join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Evento', value: current.nombre },
        { label: 'Probabilidad p', value: formatNumber(current.p, 4) },
        { label: 'Sorpresa en bits', value: formatNumber(bits, 3), color: DATA_COLORS.highlight },
        { label: 'Sorpresa en nats', value: formatNumber(surprise(current.p, Math.E), 3) },
      ]}
      legend={[
        { label: 'I(p) = -log₂ p', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Eventos', color: DATA_COLORS.secondary, shape: 'circle' },
        { label: 'Evento actual', color: DATA_COLORS.highlight, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`I(\\text{${current.nombre}}) = -\\log_2 ${formatNumber(current.p, 4)} = ${bitsTex(bits)}`}
      />
      <FunctionPlot
        xDomain={[0, 1]}
        yDomain={[0, Y_MAX]}
        xLabel="probabilidad p"
        label={description}
        curves={[
          {
            f: (p) => surprise(Math.max(P_MIN, p)),
            color: DATA_COLORS.primary,
            width: 3,
            from: P_MIN,
          },
        ]}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {events.map((e, i) => (
              <circle
                key={i}
                cx={x(e.p)}
                cy={y(Math.min(Y_MAX, surprise(e.p)))}
                r={DOT_RADIUS}
                fill={i === step ? DATA_COLORS.highlight : DATA_COLORS.secondary}
                stroke="var(--color-surface)"
                strokeWidth={2}
              />
            ))}
            <line
              x1={x(current.p)}
              x2={x(current.p)}
              y1={y(0)}
              y2={y(Math.min(Y_MAX, bits))}
              stroke={DATA_COLORS.highlight}
              strokeDasharray="4 4"
            />
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
