import { useMemo, useState } from 'react';
import { binaryEntropy, entropy, normalize } from '../../../lib/information/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { BarChart } from './BarChart.tsx';
import styles from './InformationViz.module.css';
import { bitsTex, bitsText } from './units.ts';

const STEPS = 20;
const STEPS_PER_SECOND = 4;
const DOT_RADIUS = 6;

interface EntropyViewProps {
  title: string;
  weights: readonly number[];
  labels?: readonly string[];
}

/**
 * Entropy of a discrete distribution, with one slider per category. The
 * animation mixes the distribution with the uniform one, step by step, and the
 * entropy climbs to its maximum log2 k. With two categories, a second panel
 * shows the binary entropy curve and where the distribution sits on it.
 */
export function EntropyView({ title, weights, labels }: EntropyViewProps) {
  const k = weights.length;
  const names = labels ?? weights.map((_, i) => `x${i + 1}`);
  const definitions = useMemo(
    () =>
      weights.map((w, i) => ({
        type: 'number' as const,
        key: `w${i}`,
        label: `Peso de ${names[i] ?? i + 1}`,
        min: 0,
        max: 1,
        step: 0.01,
        default: w,
        digits: 2,
      })),
    [weights, names],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, unknown>;
  const base = normalize(weights.map((_, i) => Number(values[`w${i}`])));
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  const t = step / STEPS;
  const p = base.map((pi) => (1 - t) * pi + t / k);
  const h = entropy(p);
  const terms = p.map((pi) => (pi > 0 ? -pi * Math.log2(pi) : 0));
  const description =
    `Distribución ${p.map((pi, i) => `${names[i]} = ${formatNumber(pi, 3)}`).join(', ')}: entropía ${formatNumber(h, 3)} bits, ` +
    `máximo posible ${formatNumber(Math.log2(k), 3)} bits con la uniforme.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Entropía H', value: bitsText(h, 3), color: DATA_COLORS.highlight },
        { label: 'Máximo log₂ k', value: bitsText(Math.log2(k), 3) },
        { label: 'Mezcla con la uniforme', value: `${Math.round(t * 100)} %` },
      ]}
      legend={[{ label: 'p(x)', color: DATA_COLORS.primary }]}
      description={description}
    >
      <FormulaLine
        tex={`H(X) = -\\sum_x p(x)\\log_2 p(x) = ${terms.map((v) => formatNumber(v, 3)).join(' + ')} = ${bitsTex(h)}`}
      />
      <div className={k === 2 ? styles.pair : undefined}>
        <BarChart
          series={[{ values: p, color: DATA_COLORS.primary }]}
          labels={names}
          yDomain={[0, 1]}
          annotations={p.map((pi) => `${formatNumber(pi > 0 ? -Math.log2(pi) : 0, 2)} b`)}
          label={`Probabilidades y sorpresa de cada valor. ${description}`}
        />
        {k === 2 && (
          <FunctionPlot
            xDomain={[0, 1]}
            yDomain={[0, 1.1]}
            xLabel="p"
            label={`Entropía binaria. ${description}`}
            curves={[
              {
                f: (x) => binaryEntropy(Math.min(1, Math.max(0, x))),
                color: DATA_COLORS.secondary,
                width: 3,
              },
            ]}
          >
            {({ x, y }) => (
              <circle
                cx={x(p[0] ?? 0)}
                cy={y(h)}
                r={DOT_RADIUS}
                fill={DATA_COLORS.highlight}
                stroke="var(--color-surface)"
                strokeWidth={2}
                aria-hidden="true"
              />
            )}
          </FunctionPlot>
        )}
      </div>
    </VizFrame>
  );
}
