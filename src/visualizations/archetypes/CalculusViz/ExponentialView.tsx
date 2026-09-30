import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';

const DOMAIN: [number, number] = [-3, 4];
const RANGE: [number, number] = [-3, 4];
const SWEEP_STEPS = 140;
const STEPS_PER_SECOND = 18;
const DOT_RADIUS = 5;
const TANGENT_HALF = 1.2;

interface ExponentialViewProps {
  title: string;
  base: number;
}

/**
 * b^x and its inverse log_b x, reflections of each other across y = x. A
 * point sweeps along b^x with its tangent: the slope is always ln b times the
 * height, so only for b = e does the slope equal the value of the function.
 */
export function ExponentialView({ title, base }: ExponentialViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'b',
        label: 'Base',
        symbol: 'b',
        min: 1.2,
        max: 5,
        step: 0.01,
        default: base,
        digits: 3,
      },
    ],
    [base],
  );
  const parameters = useParameters(definitions);
  const b = Number((parameters.values as Record<string, number>).b);
  const lnB = Math.log(b);
  const [step, setStep] = useState(SWEEP_STEPS / 3);
  const playback = usePlayback({
    step: () => setStep((value) => (value + 1) % (SWEEP_STEPS + 1)),
    reset: () => setStep(SWEEP_STEPS / 3),
    rate: STEPS_PER_SECOND,
  });
  const x0 = DOMAIN[0] + ((DOMAIN[1] - DOMAIN[0]) * step) / SWEEP_STEPS;
  const y0 = b ** x0;
  const slope = lnB * y0;
  const description =
    `Base b = ${formatNumber(b, 3)}, log b = ${formatNumber(lnB, 4)}. En x = ${formatNumber(x0, 2)}: b^x = ${formatNumber(y0, 3)} y la pendiente es ${formatNumber(slope, 3)}, ` +
    `es decir, ${formatNumber(lnB, 3)} veces la altura. Con b = e ≈ 2.718 la pendiente coincide con la altura.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'b', value: formatNumber(b, 3) },
        { label: 'log b', value: formatNumber(lnB, 4) },
        { label: 'x', value: formatNumber(x0, 2) },
        { label: 'b^x (altura)', value: formatNumber(y0, 3), color: DATA_COLORS.primary },
        {
          label: 'Pendiente de la tangente',
          value: formatNumber(slope, 3),
          color: DATA_COLORS.highlight,
        },
        { label: 'Pendiente / altura', value: formatNumber(lnB, 4) },
      ]}
      legend={[
        { label: 'y = b^x', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'y = log_b x', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'y = x (espejo)', color: DATA_COLORS.muted, shape: 'dashed' },
        { label: 'y = e^x', color: DATA_COLORS.tertiary, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\frac{d}{dx}\\,b^{x} = (\\log b)\\,b^{x}:\\quad ${formatNumber(slope, 3)} = ${formatNumber(lnB, 3)} \\times ${formatNumber(y0, 3)},\\qquad \\log_b x = \\frac{\\log x}{\\log b}`}
        />
      </p>
      <FunctionPlot
        xDomain={DOMAIN}
        yDomain={RANGE}
        label={description}
        aspect={0.8}
        curves={[
          { f: (x) => x, color: DATA_COLORS.muted, dashed: true, width: 1.5 },
          { f: Math.exp, color: DATA_COLORS.tertiary, dashed: true, width: 2 },
          { f: (x) => b ** x, color: DATA_COLORS.primary, width: 3 },
          {
            f: (x) => (x > 0 ? Math.log(x) / lnB : NaN),
            color: DATA_COLORS.secondary,
            width: 3,
            from: 0.001,
          },
          {
            f: (x) => y0 + slope * (x - x0),
            color: DATA_COLORS.highlight,
            width: 2,
            from: x0 - TANGENT_HALF,
            to: x0 + TANGENT_HALF,
          },
        ]}
      >
        {(s) => (
          <g aria-hidden="true">
            <circle cx={s.x(x0)} cy={s.y(y0)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} />
            <circle cx={s.x(y0)} cy={s.y(x0)} r={DOT_RADIUS} fill={DATA_COLORS.secondary} />
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
