import { useState } from 'react';
import { integralRecurrence, naiveVariance, welfordVariance } from '../../../lib/numerics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { exact, sci } from './format.ts';
import styles from './NumericsLab.module.css';

const MAX_N = 20;
const MAX_OFFSET = 12;
const STEPS_PER_SECOND = 2;
const DOT_RADIUS = 4;
const VALUE_DOMAIN: [number, number] = [-0.4, 1];
const ERROR_DOMAIN: [number, number] = [-18, 4];
const SAMPLE = [4, 7, 13, 16];
const TRUE_VARIANCE = 30;
/** Floor for logarithms of errors that are exactly zero. */
const ZERO_ERROR = 1e-18;

interface StabilityViewProps {
  title: string;
  kind: 'recurrencia' | 'varianza';
  offset: number;
}

const log = (v: number) => Math.log10(Math.max(ZERO_ERROR, Math.abs(v)));

/**
 * Two ways of computing the same quantity, one stable and one not. In the
 * recurrence I_n = 1 - n I_(n-1) the forward direction multiplies the initial
 * rounding error by n!, while the backward direction divides it. In the
 * variance, the one-pass formula subtracts two huge similar numbers when the
 * data have a large offset, and Welford's update does not.
 */
export function StabilityView({ title, kind, offset }: StabilityViewProps) {
  const total = kind === 'recurrencia' ? MAX_N : MAX_OFFSET;
  const first = kind === 'recurrencia' ? 0 : Math.min(MAX_OFFSET, Math.round(offset));
  const [step, setStep] = useState(kind === 'recurrencia' ? 0 : first);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(total, value + 1)),
    reset: () => setStep(first),
    rate: STEPS_PER_SECOND,
    done: step >= total,
  });

  if (kind === 'recurrencia') {
    const forward = integralRecurrence(MAX_N, 'adelante');
    const backward = integralRecurrence(MAX_N, 'atras');
    const n = step;
    const f = forward[n] ?? 0;
    const g = backward[n] ?? 0;
    const shownForward = forward.slice(0, n + 1);
    const description =
      `Recurrencia I_n = 1 - n I_(n-1) en n = ${n}: hacia adelante da ${exact(f)} y hacia atrás ${exact(g)}. ` +
      `El error hacia adelante es ${sci(f - g)}, el error inicial multiplicado por ${n}!.`;
    return (
      <VizFrame
        title={title}
        playback={playback}
        readouts={[
          { label: 'n', value: String(n) },
          { label: 'Hacia adelante', value: exact(f), color: DATA_COLORS.quaternary },
          { label: 'Hacia atrás', value: exact(g), color: DATA_COLORS.primary },
          { label: 'Error hacia adelante', value: sci(f - g) },
          {
            label: 'Factor n!',
            value: sci(Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1)),
          },
        ]}
        legend={[
          { label: 'Hacia adelante, desde I₀', color: DATA_COLORS.quaternary, shape: 'circle' },
          { label: 'Hacia atrás, desde I₂₅ = 0', color: DATA_COLORS.primary, shape: 'circle' },
        ]}
        description={description}
      >
        <FormulaLine
          tex={`I_{${n}} = 1 - ${n} \\cdot I_{${Math.max(0, n - 1)}} = ${exact(f, true)}\\qquad\\text{frente a}\\qquad I_{${n}} = \\frac{1 - I_{${n + 1}}}{${n + 1}} = ${exact(g, true)}`}
        />
        <div className={styles.pair}>
          <div>
            <p className={styles.panelTitle}>Valores de I_n</p>
            <FunctionPlot
              xDomain={[0, MAX_N]}
              yDomain={VALUE_DOMAIN}
              xLabel="n"
              label={`Valores de la recurrencia. ${description}`}
              curves={[]}
            >
              {({ x, y }) => (
                <g aria-hidden="true">
                  {backward.map((v, i) => (
                    <circle
                      key={`b${i}`}
                      cx={x(i)}
                      cy={y(v)}
                      r={DOT_RADIUS}
                      fill={DATA_COLORS.primary}
                    />
                  ))}
                  {shownForward.map((v, i) => (
                    <circle
                      key={`f${i}`}
                      cx={x(i)}
                      cy={y(Math.max(VALUE_DOMAIN[0], Math.min(VALUE_DOMAIN[1], v)))}
                      r={DOT_RADIUS}
                      fill="none"
                      stroke={DATA_COLORS.quaternary}
                      strokeWidth={2}
                    />
                  ))}
                </g>
              )}
            </FunctionPlot>
          </div>
          <div>
            <p className={styles.panelTitle}>log₁₀ del error</p>
            <FunctionPlot
              xDomain={[0, MAX_N]}
              yDomain={ERROR_DOMAIN}
              xLabel="n"
              label={`Logaritmo del error de cada dirección. ${description}`}
              curves={[]}
            >
              {({ x, y }) => (
                <g aria-hidden="true">
                  {shownForward.map((v, i) => (
                    <circle
                      key={`e${i}`}
                      cx={x(i)}
                      cy={y(log(v - (backward[i] ?? 0)))}
                      r={DOT_RADIUS}
                      fill={DATA_COLORS.quaternary}
                    />
                  ))}
                </g>
              )}
            </FunctionPlot>
          </div>
        </div>
      </VizFrame>
    );
  }

  const d = step;
  const shift = 10 ** d;
  const data = SAMPLE.map((v) => v + shift);
  const naive = naiveVariance(data);
  const welford = welfordVariance(data);
  const history = Array.from({ length: d + 1 }, (_, k) => {
    const shifted = SAMPLE.map((v) => v + 10 ** k);
    return {
      k,
      naive: log((naiveVariance(shifted) - TRUE_VARIANCE) / TRUE_VARIANCE),
      welford: log((welfordVariance(shifted) - TRUE_VARIANCE) / TRUE_VARIANCE),
    };
  });
  const description = `Datos 4, 7, 13 y 16 más 10^${d}: la fórmula de un paso da ${exact(naive)} y Welford ${exact(welford)}; la varianza exacta es 30.`;
  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Desplazamiento', value: `10^${d}` },
        { label: 'Fórmula E[X²] - E[X]²', value: exact(naive), color: DATA_COLORS.quaternary },
        { label: 'Welford', value: exact(welford), color: DATA_COLORS.primary },
        { label: 'Varianza exacta', value: '30' },
      ]}
      legend={[
        { label: 'Fórmula de un paso', color: DATA_COLORS.quaternary, shape: 'circle' },
        { label: 'Welford', color: DATA_COLORS.primary, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`s^2 = \\frac{\\sum x_i^2 - (\\sum x_i)^2/n}{n - 1} = ${exact(naive, true)}\\qquad\\text{Welford:}\\ ${exact(welford, true)}\\qquad (x_i = \\{4, 7, 13, 16\\} + 10^{${d}})`}
      />
      <FunctionPlot
        xDomain={[0, MAX_OFFSET]}
        yDomain={ERROR_DOMAIN}
        xLabel="log₁₀ del desplazamiento"
        label={`Logaritmo del error relativo de cada fórmula. ${description}`}
        curves={[]}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {history.map((point) => (
              <g key={point.k}>
                <circle
                  cx={x(point.k)}
                  cy={y(Math.min(ERROR_DOMAIN[1], point.naive))}
                  r={DOT_RADIUS + 1}
                  fill={DATA_COLORS.quaternary}
                />
                <circle
                  cx={x(point.k)}
                  cy={y(point.welford)}
                  r={DOT_RADIUS}
                  fill={DATA_COLORS.primary}
                />
              </g>
            ))}
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
