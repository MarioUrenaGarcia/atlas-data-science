import { useMemo, useState } from 'react';
import { betaFunction, gammaFunction } from '../../../lib/distributions/special.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';
import { areaPoints } from './shading.ts';

const FILL_STEPS = 50;
const STEPS_PER_SECOND = 15;
const EDGE = 1e-4;
const Y_CAP = 4;

interface BetaViewProps {
  title: string;
  a: number;
  b: number;
}

/**
 * The beta function as the area under t^(a - 1) (1 - t)^(b - 1) on [0, 1],
 * filled from left to right. The exponents decide where the curve piles up,
 * and the total always equals Γ(a) Γ(b) / Γ(a + b).
 */
export function BetaView({ title, a: a0, b: b0 }: BetaViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'a',
        label: 'Primer exponente',
        symbol: 'a',
        min: 0.3,
        max: 6,
        step: 0.1,
        default: a0,
        digits: 1,
      },
      {
        type: 'number' as const,
        key: 'b',
        label: 'Segundo exponente',
        symbol: 'b',
        min: 0.3,
        max: 6,
        step: 0.1,
        default: b0,
        digits: 1,
      },
    ],
    [a0, b0],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const a = Number(values.a);
  const b = Number(values.b);
  const [step, setStep] = useState(FILL_STEPS);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(FILL_STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= FILL_STEPS,
  });
  const integrand = (t: number) => t ** (a - 1) * (1 - t) ** (b - 1);
  const total = betaFunction(a, b);
  const viaGamma = (gammaFunction(a) * gammaFunction(b)) / gammaFunction(a + b);
  const end = EDGE + ((1 - 2 * EDGE) * step) / FILL_STEPS;
  const peak = Math.max(...Array.from({ length: 99 }, (_, i) => integrand((i + 1) / 100)));
  const description =
    `B(${formatNumber(a, 1)}, ${formatNumber(b, 1)}) = ${formatNumber(total, 5)}, el área bajo t^(a - 1) (1 - t)^(b - 1) en [0, 1]; ` +
    `coincide con Γ(a) Γ(b) / Γ(a + b) = ${formatNumber(viaGamma, 5)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'B(a, b), área total', value: formatNumber(total, 5), color: DATA_COLORS.primary },
        { label: 'Γ(a) Γ(b) / Γ(a + b)', value: formatNumber(viaGamma, 5) },
        { label: 'B(b, a) (simetría)', value: formatNumber(betaFunction(b, a), 5) },
        { label: 'Área rellenada hasta t', value: formatNumber(end, 2) },
      ]}
      legend={[{ label: 'Integrando y su área', color: DATA_COLORS.primary }]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`B(${formatNumber(a, 1)}, ${formatNumber(b, 1)}) = \\int_0^1 t^{${formatNumber(a - 1, 1)}}(1 - t)^{${formatNumber(b - 1, 1)}}\\,dt = \\frac{\\Gamma(${formatNumber(a, 1)})\\,\\Gamma(${formatNumber(b, 1)})}{\\Gamma(${formatNumber(a + b, 1)})} = ${formatNumber(total, 5)}`}
        />
      </p>
      <FunctionPlot
        xDomain={[0, 1]}
        yDomain={[0, Math.min(Y_CAP, Math.max(1.1, peak * 1.15))]}
        label={description}
        xLabel="t"
        curves={[{ f: integrand, color: DATA_COLORS.primary, width: 3, from: EDGE, to: 1 - EDGE }]}
        background={({ x, y }) => (
          <polygon
            aria-hidden="true"
            points={areaPoints((t) => Math.min(integrand(t), Y_CAP * 3), EDGE, end, x, y, 1)}
            fill={DATA_COLORS.primary}
            fillOpacity={0.3}
          />
        )}
      />
    </VizFrame>
  );
}
