import { useMemo, useState } from 'react';
import type { Point } from '../../../lib/optimization/index.ts';
import { optimizerPath, type PathStep } from '../../../lib/optimization/paths.ts';
import { seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { num } from '../../core/plane/levels.ts';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { FunctionMap } from './FunctionMap.tsx';
import styles from './OptimizerRace.module.css';
import { knownMinimum, point, useFunctionChoice } from './shared.ts';

const ITERATIONS = 40;
const STEPS_PER_SECOND = 3;
const DOT_RADIUS = 5;
/** Plotted range of log10(f - f*): from 1e-8 to 1e4. */
const LOG_RANGE: [number, number] = [-8, 4];

interface RateViewProps {
  title: string;
  ids: readonly string[];
  rates: readonly number[];
  start: Point;
}

/** Largest eigenvalue of a symmetric 2 by 2 matrix. */
function largestEigenvalue([[a, b], [, d]]: [[number, number], [number, number]]): number {
  return (a + d) / 2 + Math.hypot((a - d) / 2, b);
}

/**
 * Gradient descent with several learning rates on the same function. A small
 * rate creeps, a well chosen one converges fast and one above 2/λmax, where
 * λmax is the largest curvature, overshoots more every step and diverges.
 */
export function RateView({ title, ids, rates, start }: RateViewProps) {
  const { parameters, values, fn, start: x0 } = useFunctionChoice(ids, start);
  const paths = useMemo(
    () => rates.map((r) => optimizerPath('gradiente', fn, x0, ITERATIONS, r)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rates, fn, x0[0], x0[1]],
  );
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(ITERATIONS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= ITERATIONS,
  });
  const fStar = knownMinimum(fn) ?? 0;
  const lambdaMax = fn.minima[0] ? largestEigenvalue(fn.hessian(fn.minima[0])) : null;
  const at = (path: PathStep[]) => path[Math.min(step, path.length - 1)] as PathStep;
  const gap = (s: PathStep) => Math.max(s.value - fStar, 0);
  const logGap = (s: PathStep) => Math.min(LOG_RANGE[1], Math.max(LOG_RANGE[0], Math.log10(gap(s) || 1e-300)));
  const curve = (path: PathStep[]) => (k: number) => {
    const shown = Math.min(Math.floor(k), step, path.length - 1);
    return logGap(path[Math.max(0, shown)] as PathStep);
  };
  const description =
    `${fn.label} desde ${point(x0)}, iteración ${step}. ` +
    rates.map((r, i) => `Con η = ${r}, f(x_k) - f* = ${num(gap(at(paths[i] ?? [])), 6)}`).join('; ') +
    (lambdaMax ? `. El umbral de estabilidad es 2/λmax = ${num(2 / lambdaMax, 3)}.` : '.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Iteración k', value: String(step) },
        ...(lambdaMax ? [{ label: '2/λmax', value: num(2 / lambdaMax, 3) }] : []),
        ...rates.map((r, i) => ({ label: `f(x_k) - f*, η = ${r}`, value: num(gap(at(paths[i] ?? [])), 6), color: seriesColor(i) })),
      ]}
      legend={rates.map((r, i) => ({ label: `η = ${r}`, color: seriesColor(i), shape: 'line' as const }))}
      description={description}
    >
      <FormulaLine className={styles.formula} tex={`\\mathbf{x}_{k+1} = \\mathbf{x}_k - \\eta\\,\\nabla f(\\mathbf{x}_k),\\qquad k = ${step}${lambdaMax ? `,\\qquad \\eta < \\tfrac{2}{\\lambda_{\\max}} = ${num(2 / lambdaMax, 3)}` : ''}`} />
      <FormulaLine
        className={styles.formula}
        tex={rates.map((r, i) => `\\eta = ${r}:\\ f(\\mathbf{x}_{${step}}) - f^* = ${num(gap(at(paths[i] ?? [])), 5)}`).join(',\\quad ')}
      />
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Caminos sobre las curvas de nivel</p>
          <FunctionMap fn={fn} label={description}>
            {({ x, y }) => (
              <g aria-hidden="true">
                {paths.map((path, i) => {
                  const shown = path.slice(0, step + 1);
                  const tip = shown[shown.length - 1] as PathStep;
                  return (
                    <g key={i}>
                      <polyline points={shown.map((s) => `${x(s.point[0])},${y(s.point[1])}`).join(' ')} fill="none" stroke={seriesColor(i)} strokeWidth={2} />
                      <circle cx={x(tip.point[0])} cy={y(tip.point[1])} r={DOT_RADIUS} fill={seriesColor(i)} stroke="var(--color-surface)" strokeWidth={2} />
                    </g>
                  );
                })}
              </g>
            )}
          </FunctionMap>
        </div>
        <div>
          <p className={styles.panelTitle}>Distancia al mínimo en escala logarítmica, log₁₀(f - f*)</p>
          <FunctionPlot
            xDomain={[0, ITERATIONS]}
            yDomain={LOG_RANGE}
            xLabel="iteración k"
            label={`Error según la iteración. ${description}`}
            aspect={0.8}
            curves={paths.map((path, i) => ({ f: curve(path), color: seriesColor(i), width: 2.5, to: Math.max(0.001, Math.min(step, path.length - 1)) }))}
          />
        </div>
      </div>
    </VizFrame>
  );
}
