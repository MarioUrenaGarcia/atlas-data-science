import { useMemo, useState } from 'react';
import type { Point } from '../../../lib/optimization/index.ts';
import { optimizerPath, type PathMethod, type PathStep } from '../../../lib/optimization/paths.ts';
import { seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { num } from '../../core/plane/levels.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { FunctionMap } from './FunctionMap.tsx';
import styles from './OptimizerRace.module.css';
import { METHOD_NAMES, point, pointTex, USES_RATE, useFunctionChoice } from './shared.ts';

const ITERATIONS = 60;
const STEPS_PER_SECOND = 3;
const DOT_RADIUS = 5;

interface RaceViewProps {
  title: string;
  ids: readonly string[];
  methods: readonly PathMethod[];
  start: Point;
  rate: number;
}

const DIGITS = 3;

/**
 * Optimizers started from the same point on the same function, advancing one
 * iteration at a time. Their paths over the level curves show how each one
 * chooses its direction and its step.
 */
export function RaceView({ title, ids, methods, start, rate }: RaceViewProps) {
  const usesRate = methods.some((m) => USES_RATE.has(m) && m !== 'newton');
  const extra = useMemo(
    () =>
      usesRate
        ? [{ type: 'number' as const, key: 'tasa', label: 'Tasa de aprendizaje', symbol: 'η', min: 0.001, max: 1, step: 0.001, default: rate, digits: 3 }]
        : [],
    [usesRate, rate],
  );
  const { parameters, values, fn, start: x0 } = useFunctionChoice(ids, start, extra);
  const eta = usesRate ? Number(values.tasa) : rate;
  const paths = useMemo(
    () => methods.map((m) => optimizerPath(m, fn, x0, ITERATIONS, m === 'newton' ? 1 : eta)),
    // x0 is rebuilt every render; its coordinates are the real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [methods, fn, x0[0], x0[1], eta],
  );
  const longest = Math.max(...paths.map((p) => p.length - 1));
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(longest, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= longest,
  });
  const at = (path: PathStep[]) => path[Math.min(step, path.length - 1)] as PathStep;
  const single = methods.length === 1 ? methods[0] : null;
  const description =
    `${fn.label}, inicio ${point(x0)}. Iteración ${step}: ` +
    methods.map((m, i) => `${METHOD_NAMES[m]} en ${point(at(paths[i] ?? []).point)} con f = ${num(at(paths[i] ?? []).value, 4)}`).join('; ') +
    '.';

  let detail: string | null = null;
  if (single && paths[0]) {
    const path = paths[0];
    const k = Math.min(step, path.length - 1);
    const current = path[k] as PathStep;
    const next = path[k + 1];
    const g = fn.gradient(current.point);
    if (next) {
      if (single === 'gradiente') {
        detail = `\\mathbf{x}_{${k + 1}} = \\mathbf{x}_{${k}} - \\eta\\,\\nabla f(\\mathbf{x}_{${k}}) = ${pointTex(current.point)} - ${num(eta, 3)}${pointTex(g)} = ${pointTex(next.point)}`;
      } else if (single === 'newton') {
        detail = `\\mathbf{x}_{${k + 1}} = \\mathbf{x}_{${k}} - \\mathbf{H}^{-1}\\nabla f(\\mathbf{x}_{${k}}),\\quad \\nabla f = ${pointTex(g)},\\quad \\mathbf{x}_{${k + 1}} = ${pointTex(next.point)}`;
      } else if (next.alpha !== undefined) {
        const d: Point = [(next.point[0] - current.point[0]) / next.alpha, (next.point[1] - current.point[1]) / next.alpha];
        detail = `\\mathbf{x}_{${k + 1}} = \\mathbf{x}_{${k}} + \\alpha_{${k}}\\mathbf{d}_{${k}} = ${pointTex(current.point)} + ${num(next.alpha, 4)}${pointTex(d)} = ${pointTex(next.point)}`;
      }
    } else {
      detail = `\\mathbf{x}_{${k}} = ${pointTex(current.point)},\\quad \\lVert \\nabla f \\rVert = ${num(Math.hypot(g[0], g[1]), 6)}`;
    }
  }

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Iteración k', value: String(step) },
        ...methods.map((m, i) => ({
          label: `f(x_k), ${METHOD_NAMES[m]}`,
          value: num(at(paths[i] ?? []).value, 5),
          color: seriesColor(i),
        })),
      ]}
      legend={methods.map((m, i) => ({ label: METHOD_NAMES[m], color: seriesColor(i), shape: 'line' as const }))}
      description={description}
    >
      {methods.slice(0, 4).map((m, i) => {
        const s = at(paths[i] ?? []);
        return (
          <FormulaLine
            key={m}
            className={styles.formula}
            tex={`\\text{${METHOD_NAMES[m]}}:\\ \\mathbf{x}_{${Math.min(step, (paths[i]?.length ?? 1) - 1)}} = ${pointTex(s.point, DIGITS)},\\quad f = ${num(s.value, 5)}`}
          />
        );
      })}
      {detail && (
        <FormulaLine className={styles.formula} tex={detail} />
      )}
      <FunctionMap fn={fn} label={description}>
        {({ x, y }) => (
          <g aria-hidden="true">
            {fn.minima.map((m, i) => (
              <circle key={`m${i}`} cx={x(m[0])} cy={y(m[1])} r={DOT_RADIUS - 1} fill="none" stroke="var(--color-text)" strokeWidth={2} />
            ))}
            {paths.map((path, i) => {
              const shown = path.slice(0, step + 1);
              const tip = shown[shown.length - 1] as PathStep;
              return (
                <g key={i}>
                  <polyline points={shown.map((s) => `${x(s.point[0])},${y(s.point[1])}`).join(' ')} fill="none" stroke={seriesColor(i)} strokeWidth={2.5} />
                  {shown.map((s, j) => (
                    <circle key={j} cx={x(s.point[0])} cy={y(s.point[1])} r={2} fill={seriesColor(i)} />
                  ))}
                  <circle cx={x(tip.point[0])} cy={y(tip.point[1])} r={DOT_RADIUS} fill={seriesColor(i)} stroke="var(--color-surface)" strokeWidth={2} />
                </g>
              );
            })}
          </g>
        )}
      </FunctionMap>
    </VizFrame>
  );
}
