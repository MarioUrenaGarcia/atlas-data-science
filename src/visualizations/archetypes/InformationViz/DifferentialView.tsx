import { useMemo, useState } from 'react';
import { DIFFERENTIAL_ENTROPY } from '../../../lib/information/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { bitsTex } from './units.ts';

export type DifferentialFamily = 'uniforme' | 'normal' | 'exponencial';

const STEPS = 24;
const STEPS_PER_SECOND = 3;
/** Range swept by the animation for the scale parameter of each family. */
const SWEEP: Readonly<Record<DifferentialFamily, [number, number]>> = {
  uniforme: [0.25, 4],
  normal: [0.15, 2],
  exponencial: [0.5, 4],
};
const X_RANGE: Readonly<Record<DifferentialFamily, [number, number]>> = {
  uniforme: [-0.5, 4.5],
  normal: [-5, 5],
  exponencial: [0, 5],
};
const Y_MAX = 4.2;

interface DifferentialViewProps {
  title: string;
  family: DifferentialFamily;
  parameter?: number;
}

const DENSITY: Readonly<Record<DifferentialFamily, (s: number) => (x: number) => number>> = {
  uniforme: (a) => (x) => (x >= 0 && x <= a ? 1 / a : 0),
  normal: (s) => (x) => Math.exp(-0.5 * (x / s) ** 2) / (s * Math.sqrt(2 * Math.PI)),
  exponencial: (r) => (x) => (x >= 0 ? r * Math.exp(-r * x) : 0),
};

const FORMULA: Readonly<Record<DifferentialFamily, (s: string) => string>> = {
  uniforme: (a) => `h(X) = \\log_2 a = \\log_2 ${a}`,
  normal: (s) =>
    `h(X) = \\tfrac{1}{2}\\log_2(2\\pi e\\,\\sigma^2) = \\tfrac{1}{2}\\log_2(2\\pi e \\cdot ${s}^2)`,
  exponencial: (r) => `h(X) = \\log_2\\frac{e}{\\lambda} = \\log_2\\frac{e}{${r}}`,
};

const PARAMETER_NAME: Readonly<Record<DifferentialFamily, string>> = {
  uniforme: 'Ancho a',
  normal: 'Desviación σ',
  exponencial: 'Tasa λ',
};

/**
 * Differential entropy of a continuous density. Unlike the discrete entropy it
 * can be negative: as the density concentrates, its height exceeds 1 and
 * h(X) drops below zero. The animation sweeps the scale parameter and the
 * header follows the closed form.
 */
export function DifferentialView({ title, family, parameter }: DifferentialViewProps) {
  const [lo, hi] = SWEEP[family];
  const start = parameter ?? lo;
  const first = Math.round(((Math.min(hi, Math.max(lo, start)) - lo) / (hi - lo)) * STEPS);
  const [step, setStep] = useState(first);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  const s = lo + ((hi - lo) * step) / STEPS;
  const density = useMemo(() => DENSITY[family](s), [family, s]);
  const h = DIFFERENTIAL_ENTROPY[family](s);
  const peak =
    family === 'normal' ? 1 / (s * Math.sqrt(2 * Math.PI)) : family === 'uniforme' ? 1 / s : s;
  const description =
    `${PARAMETER_NAME[family]} = ${formatNumber(s, 3)}: altura máxima de la densidad ${formatNumber(peak, 3)}, ` +
    `entropía diferencial ${formatNumber(h, 3)} bits${h < 0 ? ', negativa' : ''}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: PARAMETER_NAME[family], value: formatNumber(s, 3) },
        { label: 'Altura máxima de f', value: formatNumber(peak, 3) },
        {
          label: 'h(X) en bits',
          value: formatNumber(h, 3),
          color: h < 0 ? DATA_COLORS.highlight : undefined,
        },
      ]}
      legend={[
        { label: 'Densidad f(x)', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Altura 1', color: DATA_COLORS.muted, shape: 'dashed' },
      ]}
      description={description}
    >
      <FormulaLine tex={`${FORMULA[family](formatNumber(s, 3))} = ${bitsTex(h)}`} />
      <FunctionPlot
        xDomain={X_RANGE[family]}
        yDomain={[0, Y_MAX]}
        label={description}
        curves={[
          {
            f: density,
            color: DATA_COLORS.primary,
            width: 3,
            breaks: family === 'uniforme' ? [0, s] : family === 'exponencial' ? [0] : undefined,
          },
          { f: () => 1, color: DATA_COLORS.muted, width: 1.5, dashed: true },
        ]}
        background={({ x, y }) => {
          const [a, b] = X_RANGE[family];
          const n = 160;
          const points = Array.from({ length: n + 1 }, (_, i) => {
            const xi = a + ((b - a) * i) / n;
            return `${x(xi)},${y(Math.min(Y_MAX, density(xi)))}`;
          });
          return (
            <polygon
              points={`${x(a)},${y(0)} ${points.join(' ')} ${x(b)},${y(0)}`}
              fill={DATA_COLORS.primary}
              fillOpacity={0.18}
              aria-hidden="true"
            />
          );
        }}
      />
    </VizFrame>
  );
}
