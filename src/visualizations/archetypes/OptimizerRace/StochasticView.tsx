import { useMemo, useState } from 'react';
import {
  leastSquaresLine,
  lineData,
  meanSquaredError,
  stochasticGradientPath,
} from '../../../lib/optimization/extras.ts';
import type { Point } from '../../../lib/optimization/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { ContourMap } from '../../core/plane/ContourMap.tsx';
import { num } from '../../core/plane/levels.ts';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './OptimizerRace.module.css';

const DATA_SIZE = 40;
const INTERCEPT = 1;
const SLOPE = 2;
const NOISE = 0.8;
const ITERATIONS = 120;
const STEPS_PER_SECOND = 8;
const START: Point = [-2, -1];
const DOT_RADIUS = 4;

interface StochasticViewProps {
  title: string;
  batch: number;
  rate: number;
  seed: number;
}

/**
 * Stochastic gradient descent fitting a line by least squares. Each step uses
 * the gradient of a small random batch instead of all the data: the path
 * zigzags around the full-gradient path but each step costs far less, and
 * with a constant rate it keeps fluctuating near the minimum.
 */
export function StochasticView({ title, batch, rate, seed: initialSeed }: StochasticViewProps) {
  const definitions = useMemo(
    () => [
      { type: 'number' as const, key: 'lote', label: 'Tamaño del lote', symbol: 'b', min: 1, max: DATA_SIZE, step: 1, default: batch },
      { type: 'number' as const, key: 'tasa', label: 'Tasa de aprendizaje', symbol: 'η', min: 0.005, max: 0.3, step: 0.005, default: rate, digits: 3 },
    ],
    [batch, rate],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const b = Number(values.lote);
  const eta = Number(values.tasa);
  const seed = useSeed(initialSeed);
  const data = useMemo(() => lineData(DATA_SIZE, INTERCEPT, SLOPE, NOISE, seed.seed), [seed.seed]);
  const solution = useMemo(() => leastSquaresLine(data), [data]);
  const sgd = useMemo(() => stochasticGradientPath(data, START, { batch: b, rate: eta, iterations: ITERATIONS, seed: seed.seed + 1 }), [data, b, eta, seed.seed]);
  const full = useMemo(() => stochasticGradientPath(data, START, { batch: DATA_SIZE, rate: eta, iterations: ITERATIONS }), [data, eta]);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(ITERATIONS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= ITERATIONS,
  });
  const loss = useMemo(() => (x: number, y: number) => meanSquaredError(data, [x, y]), [data]);
  const current = sgd[step] ?? START;
  const reference = full[step] ?? START;
  const domain: [[number, number], [number, number]] = [
    [solution[0] - 3.5, solution[0] + 2],
    [solution[1] - 3.5, solution[1] + 2],
  ];
  const description =
    `Ajuste de una recta a ${DATA_SIZE} datos. Iteración ${step}: el descenso estocástico con lotes de ${b} está en ` +
    `(${num(current[0], 3)}, ${num(current[1], 3)}) con error ${num(loss(current[0], current[1]), 4)}; el descenso completo, en ` +
    `(${num(reference[0], 3)}, ${num(reference[1], 3)}) con error ${num(loss(reference[0], reference[1]), 4)}. El mínimo es (${num(solution[0], 3)}, ${num(solution[1], 3)}).`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Iteración k', value: String(step) },
        { label: 'Error, estocástico', value: num(loss(current[0], current[1]), 4), color: DATA_COLORS.highlight },
        { label: 'Error, gradiente completo', value: num(loss(reference[0], reference[1]), 4), color: DATA_COLORS.secondary },
        { label: 'Error mínimo', value: num(loss(solution[0], solution[1]), 4), color: DATA_COLORS.tertiary },
        { label: 'Datos usados por paso', value: `${b} de ${DATA_SIZE}` },
      ]}
      legend={[
        { label: `Descenso estocástico, lotes de ${b}`, color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Descenso con el gradiente completo', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Mínimo de mínimos cuadrados', color: DATA_COLORS.tertiary, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`\\boldsymbol{\\beta}_{k+1} = \\boldsymbol{\\beta}_k - \\eta\\,\\frac{1}{${b}}\\sum_{i \\in B_k} \\nabla \\ell_i(\\boldsymbol{\\beta}_k),\\qquad |B_k| = ${b},\\ \\eta = ${num(eta, 3)}`}
      />
      <FormulaLine
        tex={`k = ${step}:\\quad \\boldsymbol{\\beta}_k = (${num(current[0], 3)}, ${num(current[1], 3)}),\\quad \\text{error} = ${num(loss(current[0], current[1]), 4)},\\quad \\text{mínimo} = ${num(loss(solution[0], solution[1]), 4)}`}
      />
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Error cuadrático medio según (β₀, β₁)</p>
          <ContourMap f={loss} domain={domain} label={description}>
            {({ x, y }) => (
              <g aria-hidden="true">
                <polyline points={full.slice(0, step + 1).map((p) => `${x(p[0])},${y(p[1])}`).join(' ')} fill="none" stroke={DATA_COLORS.secondary} strokeWidth={2} />
                <polyline points={sgd.slice(0, step + 1).map((p) => `${x(p[0])},${y(p[1])}`).join(' ')} fill="none" stroke={DATA_COLORS.highlight} strokeWidth={1.5} />
                <circle cx={x(solution[0])} cy={y(solution[1])} r={DOT_RADIUS + 1} fill={DATA_COLORS.tertiary} />
                <circle cx={x(current[0])} cy={y(current[1])} r={DOT_RADIUS + 1} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
              </g>
            )}
          </ContourMap>
        </div>
        <div>
          <p className={styles.panelTitle}>Datos y recta del paso actual</p>
          <FunctionPlot
            xDomain={[-2.2, 2.2]}
            xLabel="t"
            label={`Datos y recta ajustada. ${description}`}
            aspect={0.8}
            curves={[
              { f: (t) => current[0] + current[1] * t, color: DATA_COLORS.highlight, width: 2.5 },
              { f: (t) => solution[0] + solution[1] * t, color: DATA_COLORS.tertiary, width: 1.5, dashed: true },
            ]}
          >
            {(s) => data.map((p, i) => <circle key={i} aria-hidden="true" cx={s.x(p.t)} cy={s.y(p.y)} r={3} fill={DATA_COLORS.primary} />)}
          </FunctionPlot>
        </div>
      </div>
    </VizFrame>
  );
}
