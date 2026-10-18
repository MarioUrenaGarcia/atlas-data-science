import { useState } from 'react';
import { logSumExp, naiveLogSumExp, softmax } from '../../../lib/numerics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { exact } from './format.ts';

/** Shift added to every input per animation step. */
const SHIFT_STEP = 50;
const MAX_SHIFT = 1000;
const STEPS_PER_SECOND = 2;
const BAR_WIDTH = 0.6;
/** Largest x with a finite e^x in double precision. */
const OVERFLOW = Math.log(Number.MAX_VALUE);
const DIGITS = 12;

interface LogSumExpViewProps {
  title: string;
  values: readonly number[];
}

/**
 * The log of a sum of exponentials. As a constant is added to every input,
 * e^x overflows and the direct formula returns infinity, while subtracting
 * the maximum first keeps every exponential in [0, 1]. The bars show the
 * softmax weights, which do not change with the shift.
 */
export function LogSumExpView({ title, values }: LogSumExpViewProps) {
  const total = MAX_SHIFT / SHIFT_STEP;
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(total, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= total,
  });
  const shift = step * SHIFT_STEP;
  const xs = values.map((v) => v + shift);
  const m = Math.max(...xs);
  const naive = naiveLogSumExp(xs);
  const stable = logSumExp(xs);
  const weights = softmax(xs);
  const overflowed = xs.filter((x) => x > OVERFLOW).length;
  const list = xs.map((x) => exact(x)).join(', ');
  const description =
    `Entradas ${list}. La fórmula directa da ${exact(naive)}; restando el máximo ${exact(m)} se obtiene ${exact(stable)}. ` +
    `${overflowed} exponenciales se desbordan. Pesos softmax: ${weights.map((w) => w.toFixed(3)).join(', ')}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Desplazamiento c', value: String(shift) },
        { label: 'Máximo m', value: exact(m) },
        {
          label: 'log Σ eˣ directo',
          value: exact(naive, false, DIGITS),
          color: DATA_COLORS.quaternary,
        },
        {
          label: 'm + log Σ eˣ⁻ᵐ',
          value: exact(stable, false, DIGITS),
          color: DATA_COLORS.primary,
        },
        { label: 'Exponenciales desbordadas', value: `${overflowed} de ${xs.length}` },
      ]}
      legend={[
        { label: 'Peso softmax eˣ⁻ᵐ / Σ eˣ⁻ᵐ', color: DATA_COLORS.primary },
        { label: 'Entrada cuya eˣ directa se desborda', color: DATA_COLORS.quaternary },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`\\log \\sum_i e^{x_i} = ${exact(naive, true)}\\qquad m + \\log \\sum_i e^{x_i - m} = ${exact(m, true)} + \\log ${exact(
          xs.reduce((s, x) => s + Math.exp(x - m), 0),
          true,
        )} = ${exact(stable, true)}`}
      />
      <FunctionPlot
        xDomain={[-0.5, xs.length - 0.5]}
        yDomain={[0, 1]}
        xLabel="entrada i"
        label={`Pesos softmax de cada entrada. ${description}`}
        curves={[]}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {weights.map((w, i) => (
              <rect
                key={i}
                x={x(i - BAR_WIDTH / 2)}
                width={x(i + BAR_WIDTH / 2) - x(i - BAR_WIDTH / 2)}
                y={y(w)}
                height={y(0) - y(w)}
                fill={(xs[i] ?? 0) > OVERFLOW ? DATA_COLORS.quaternary : DATA_COLORS.primary}
                fillOpacity={0.8}
              />
            ))}
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
