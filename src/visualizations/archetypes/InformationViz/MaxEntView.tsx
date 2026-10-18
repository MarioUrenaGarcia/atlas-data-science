import { useState } from 'react';
import { entropy, maxEntropyWithMean } from '../../../lib/information/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { BarChart } from './BarChart.tsx';
import { bitsTex, bitsText } from './units.ts';

const FACES = [1, 2, 3, 4, 5, 6];
const MEAN_FROM = 1.5;
const MEAN_TO = 5.5;
const MEAN_STEP = 0.1;
const STEPS_PER_SECOND = 5;
const ROUNDING_FLOOR = 1e-9;
const Y_MAX = 0.8;

interface MaxEntViewProps {
  title: string;
  mean?: number;
}

/**
 * Jaynes' die: among all distributions on the faces 1 to 6 with a given mean,
 * the one with the largest entropy has the exponential form
 * p_k proportional to e^(lambda k). The animation moves the required mean and the bars
 * tilt; at mean 3.5 the answer is the uniform die with lambda = 0.
 */
export function MaxEntView({ title, mean }: MaxEntViewProps) {
  const total = Math.round((MEAN_TO - MEAN_FROM) / MEAN_STEP);
  const first =
    mean === undefined
      ? 0
      : Math.round((Math.min(MEAN_TO, Math.max(MEAN_FROM, mean)) - MEAN_FROM) / MEAN_STEP);
  const [step, setStep] = useState(first);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(total, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= total,
  });
  const target = MEAN_FROM + step * MEAN_STEP;
  const solved = maxEntropyWithMean(FACES, target);
  const p = solved.p;
  // Bisection leaves rounding noise near 1e-17 at the symmetric mean 3.5.
  const lambda = Math.abs(solved.lambda) < ROUNDING_FLOOR ? 0 : solved.lambda;
  const h = entropy(p);
  const description =
    `Media exigida ${formatNumber(target, 2)}: la distribución de máxima entropía es ` +
    `(${p.map((v) => formatNumber(v, 3)).join(', ')}), con λ = ${formatNumber(lambda, 3)} y entropía ${formatNumber(h, 3)} bits.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Media exigida', value: formatNumber(target, 2) },
        { label: 'λ', value: formatNumber(lambda, 3) },
        { label: 'Entropía H', value: bitsText(h, 3), color: DATA_COLORS.highlight },
        {
          label: 'Máximo sin restricción',
          value: bitsText(Math.log2(FACES.length), 3),
        },
      ]}
      legend={[{ label: 'p(k), probabilidad de la cara k', color: DATA_COLORS.primary }]}
      description={description}
    >
      <FormulaLine
        tex={`p(k) = \\frac{e^{\\lambda k}}{\\sum_{j=1}^{6} e^{\\lambda j}},\\quad \\lambda = ${formatNumber(lambda, 3)},\\quad \\sum_k k\\,p(k) = ${formatNumber(target, 2)},\\quad H = ${bitsTex(h)}`}
      />
      <BarChart
        series={[{ values: p, color: DATA_COLORS.primary }]}
        labels={FACES.map(String)}
        yDomain={[0, Y_MAX]}
        annotations={p.map((v) => formatNumber(v, 3))}
        label={description}
      />
    </VizFrame>
  );
}
