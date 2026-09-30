import { useMemo, useState } from 'react';
import { logGamma } from '../../../lib/distributions/special.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';

const N_MAX = 60;
const STEPS_PER_SECOND = 3;
const DOT_RADIUS = 4;
const PANEL_ASPECT = 0.42;

const logFactorial = (n: number) => logGamma(n + 1);
const logStirling = (n: number) => 0.5 * Math.log(2 * Math.PI * n) + n * (Math.log(n) - 1);

/** Scientific notation for huge values given through their natural logarithm. */
function fromLog(logValue: number): string {
  const log10 = logValue / Math.LN10;
  const exponent = Math.floor(log10);
  const mantissa = 10 ** (log10 - exponent);
  return exponent < 6
    ? formatNumber(Math.exp(logValue), 2)
    : `${formatNumber(mantissa, 4)} × 10^${exponent}`;
}

interface StirlingViewProps {
  title: string;
  n: number;
}

/**
 * Stirling's approximation n! ≈ sqrt(2πn) (n/e)^n. The factorials and the
 * approximation are compared on a logarithmic scale, and the ratio between
 * them approaches 1 while the absolute difference keeps growing.
 */
export function StirlingView({ title, n: initial }: StirlingViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'n',
        label: 'n',
        min: 1,
        max: N_MAX,
        step: 1,
        default: initial,
        digits: 0,
      },
    ],
    [initial],
  );
  const parameters = useParameters(definitions);
  const slider = Number((parameters.values as Record<string, number>).n);
  const [sweep, setSweep] = useState<number | null>(null);
  const playback = usePlayback({
    step: () => setSweep((value) => Math.min(N_MAX, (value ?? 0) + 1)),
    reset: () => setSweep(null),
    rate: STEPS_PER_SECOND,
    done: sweep !== null && sweep >= N_MAX,
  });
  const n = sweep ?? slider;
  const exact = logFactorial(n);
  const approx = logStirling(n);
  const ratio = Math.exp(exact - approx);
  const description =
    `n = ${n}: n! = ${fromLog(exact)} y la aproximación de Stirling da ${fromLog(approx)}. ` +
    `El cociente es ${formatNumber(ratio, 6)}, cercano a 1 + 1/(12n) = ${formatNumber(1 + 1 / (12 * n), 6)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'n', value: String(n) },
        { label: 'n!', value: fromLog(exact), color: DATA_COLORS.primary },
        { label: 'Stirling', value: fromLog(approx), color: DATA_COLORS.secondary },
        { label: 'Cociente n! / Stirling', value: formatNumber(ratio, 6) },
        { label: 'Error relativo', value: `${formatNumber((ratio - 1) * 100, 3)} %` },
      ]}
      legend={[
        { label: 'log n!', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'log de la aproximación', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Cociente', color: DATA_COLORS.tertiary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`${n}! \\approx \\sqrt{2\\pi \\cdot ${n}}\\,\\Big(\\frac{${n}}{e}\\Big)^{${n}},\\qquad \\frac{${n}!}{\\text{Stirling}} = ${formatNumber(ratio, 6)}`}
        />
      </p>
      <p className={styles.panelTitle}>Logaritmo natural de n! y de la aproximación</p>
      <FunctionPlot
        xDomain={[0, N_MAX + 1]}
        yDomain={[-1, logFactorial(N_MAX) * 1.05]}
        label={description}
        aspect={PANEL_ASPECT}
        minHeight={180}
        xLabel="n"
        curves={[{ f: logStirling, color: DATA_COLORS.secondary, width: 2.5, from: 0.5 }]}
      >
        {(s) => (
          <g aria-hidden="true">
            {Array.from({ length: N_MAX }, (_, i) => i + 1).map((k) => (
              <circle
                key={k}
                cx={s.x(k)}
                cy={s.y(logFactorial(k))}
                r={k === n ? DOT_RADIUS + 2 : DOT_RADIUS - 1}
                fill={k === n ? DATA_COLORS.highlight : DATA_COLORS.primary}
              />
            ))}
          </g>
        )}
      </FunctionPlot>
      <p className={styles.panelTitle}>Cociente n! / aproximación</p>
      <FunctionPlot
        xDomain={[0, N_MAX + 1]}
        yDomain={[0.99, 1.09]}
        label={`Cociente entre el factorial y la aproximación. ${description}`}
        aspect={PANEL_ASPECT}
        minHeight={180}
        xLabel="n"
        curves={[
          {
            f: (k) => Math.exp(logFactorial(k) - logStirling(k)),
            color: DATA_COLORS.tertiary,
            width: 2.5,
            from: 1,
          },
        ]}
      >
        {(s) => (
          <g aria-hidden="true">
            <line
              x1={s.box.inner.left}
              x2={s.box.inner.left + s.box.inner.width}
              y1={s.y(1)}
              y2={s.y(1)}
              stroke={DATA_COLORS.muted}
              strokeDasharray="4 4"
            />
            <circle cx={s.x(n)} cy={s.y(ratio)} r={DOT_RADIUS + 1} fill={DATA_COLORS.highlight} />
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
