import { useState } from 'react';
import {
  binaryChannel,
  composeChannels,
  jointInformation,
  throughChannel,
} from '../../../lib/information/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { BarChart } from './BarChart.tsx';
import { bitsTex, bitsText } from './units.ts';

const INPUT = [0.5, 0.5];
const STEPS = 25;
const STEPS_PER_SECOND = 4;
const MAX_NOISE = 0.5;

interface ChannelViewProps {
  title: string;
  noise1?: number;
  noise2?: number;
}

/**
 * Markov chain X -> Y -> Z built from two binary symmetric channels. Y keeps
 * part of the information of X and Z, which only sees Y, can never know more:
 * I(X; Z) <= I(X; Y). The animation raises the noise of the second channel
 * from zero, where Z is a copy of Y, to one half, where Z is pure noise.
 */
export function ChannelView({ title, noise1 = 0.1, noise2 = 0.2 }: ChannelViewProps) {
  const parameters = useParameters([
    {
      type: 'number',
      key: 'e1',
      label: 'Ruido del primer canal ε₁',
      min: 0,
      max: MAX_NOISE,
      step: 0.01,
      default: noise1,
      digits: 2,
    },
  ] as const);
  const e1 = Number(parameters.values.e1);
  const first = Math.round((Math.min(MAX_NOISE, Math.max(0, noise2)) / MAX_NOISE) * STEPS);
  const [step, setStep] = useState(first);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  const e2 = (MAX_NOISE * step) / STEPS;
  const W1 = binaryChannel(e1);
  const W2 = binaryChannel(e2);
  const ixy = jointInformation(throughChannel(INPUT, W1)).mutual;
  const ixz = jointInformation(throughChannel(INPUT, composeChannels(W1, W2))).mutual;
  const flip = e1 * (1 - e2) + e2 * (1 - e1);
  const description =
    `Ruido ε₁ = ${formatNumber(e1, 2)} y ε₂ = ${formatNumber(e2, 2)}: X y Z difieren con probabilidad ${formatNumber(flip, 3)}. ` +
    `I(X;Y) = ${formatNumber(ixy, 3)} bits e I(X;Z) = ${formatNumber(ixz, 3)} bits.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Ruido ε₂ del segundo canal', value: formatNumber(e2, 2) },
        { label: 'P(Z ≠ X)', value: formatNumber(flip, 3) },
        { label: 'I(X; Y)', value: bitsText(ixy, 3) },
        { label: 'I(X; Z)', value: bitsText(ixz, 3), color: DATA_COLORS.highlight },
        { label: 'Información perdida', value: bitsText(ixy - ixz, 3) },
      ]}
      legend={[{ label: 'Información mutua con X, en bits', color: DATA_COLORS.primary }]}
      description={description}
    >
      <FormulaLine
        tex={`X \\to Y \\to Z:\\quad I(X;Y) = ${formatNumber(ixy, 3)}\\ \\ge\\ I(X;Z) = 1 - H_b(${formatNumber(flip, 3)}) = ${bitsTex(ixz)}`}
      />
      <BarChart
        series={[{ values: [ixy, ixz], color: DATA_COLORS.primary }]}
        labels={['I(X; Y)', 'I(X; Z)']}
        yDomain={[0, 1]}
        annotations={[`${formatNumber(ixy, 3)} b`, `${formatNumber(ixz, 3)} b`]}
        label={description}
      />
    </VizFrame>
  );
}
