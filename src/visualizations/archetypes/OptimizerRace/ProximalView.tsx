import { useMemo, useState } from 'react';
import { lassoObjective, proximalGradient, type LassoProblem } from '../../../lib/optimization/extras.ts';
import type { Point } from '../../../lib/optimization/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { ContourMap } from '../../core/plane/ContourMap.tsx';
import { num } from '../../core/plane/levels.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './OptimizerRace.module.css';
import { item } from './shared.ts';

const ITERATIONS = 25;
/** Each iteration has two frames: the gradient step and the proximal step. */
const FRAMES = 2 * ITERATIONS;
const FRAMES_PER_SECOND = 2.5;
const DOT_RADIUS = 5;
const DOMAIN: [[number, number], [number, number]] = [
  [-1, 3],
  [-1.5, 2],
];

interface ProximalViewProps {
  title: string;
  matrix: [[number, number], [number, number]];
  center: Point;
  lambda: number;
  start: Point;
}

/**
 * Proximal gradient (ISTA) on a lasso problem: a gradient step on the smooth
 * part, then soft thresholding, the proximal map of λ|·|₁, which shrinks each
 * coordinate toward 0 and sets it exactly to 0 when it is small. That is how
 * the method finds sparse solutions that ordinary gradient descent only
 * approaches.
 */
export function ProximalView({ title, matrix, center, lambda, start }: ProximalViewProps) {
  const definitions = useMemo(
    () => [{ type: 'number' as const, key: 'lambda', label: 'Penalización', symbol: 'λ', min: 0, max: 5, step: 0.05, default: lambda, digits: 2 }],
    [lambda],
  );
  const parameters = useParameters(definitions);
  const lam = Number((parameters.values as Record<string, number>).lambda);
  const problem: LassoProblem = useMemo(() => ({ a: matrix, b: center, lambda: lam }), [matrix, center, lam]);
  const steps = useMemo(() => proximalGradient(problem, start, ITERATIONS), [problem, start]);
  const f = useMemo(() => (x: number, y: number) => lassoObjective(problem, [x, y]), [problem]);
  const [frame, setFrame] = useState(0);
  const playback = usePlayback({
    step: () => setFrame((value) => Math.min(FRAMES, value + 1)),
    reset: () => setFrame(0),
    rate: FRAMES_PER_SECOND,
    done: frame >= FRAMES,
  });
  const k = Math.floor(frame / 2);
  const halfway = frame % 2 === 1;
  const previous = item(steps, k).point;
  const next = item(steps, Math.min(k + 1, ITERATIONS));
  const shown: Point = halfway ? next.gradientPoint : previous;
  const [[a, c], [, d]] = matrix;
  const largest = (a + d) / 2 + Math.hypot((a - d) / 2, c);
  const t = 1 / largest;
  const zeros = [shown[0] === 0, shown[1] === 0];
  const description =
    `Lasso con λ = ${num(lam, 2)}. Iteración ${k}${halfway ? ', después del paso de gradiente' : ''}: ` +
    `β = (${num(shown[0], 4)}, ${num(shown[1], 4)}), objetivo ${num(f(shown[0], shown[1]), 4)}` +
    (zeros.some(Boolean) ? `; ${zeros[0] && zeros[1] ? 'ambos coeficientes valen' : `el coeficiente ${zeros[0] ? 1 : 2} vale`} exactamente 0.` : '.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'Iteración k', value: String(k) },
        { label: 'β actual', value: `(${num(shown[0], 4)}, ${num(shown[1], 4)})`, color: DATA_COLORS.highlight },
        { label: 'Objetivo', value: num(f(shown[0], shown[1]), 4) },
        { label: 'Paso t = 1/L', value: num(t, 3) },
        { label: 'Umbral tλ', value: num(t * lam, 3) },
      ]}
      legend={[
        { label: 'Paso de gradiente', color: DATA_COLORS.secondary, shape: 'circle' },
        { label: 'Después del umbral suave', color: DATA_COLORS.highlight, shape: 'circle' },
        { label: 'Mínimo sin penalización', color: DATA_COLORS.text, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine
        className={styles.formula}
        tex={`\\min_{\\boldsymbol{\\beta}}\\ \\tfrac{1}{2}(\\boldsymbol{\\beta} - \\mathbf{b})^\\top \\mathbf{A}(\\boldsymbol{\\beta} - \\mathbf{b}) + ${num(lam, 2)}\\lVert \\boldsymbol{\\beta} \\rVert_1,\\qquad \\mathbf{b} = (${num(center[0], 2)}, ${num(center[1], 2)})`}
      />
      <FormulaLine
        className={styles.formula}
        tex={
          halfway
            ? `\\mathbf{z} = \\boldsymbol{\\beta}_{${k}} - t\\,\\nabla g(\\boldsymbol{\\beta}_{${k}}) = (${num(next.gradientPoint[0], 4)}, ${num(next.gradientPoint[1], 4)})`
            : k === 0
              ? `\\boldsymbol{\\beta}_0 = (${num(previous[0], 4)}, ${num(previous[1], 4)})`
              : `\\boldsymbol{\\beta}_{${k}} = S_{t\\lambda}(\\mathbf{z}) = (\\operatorname{sign}(z_i)\\max(|z_i| - ${num(t * lam, 3)}, 0))_i = (${num(previous[0], 4)}, ${num(previous[1], 4)})`
        }
      />
      <ContourMap f={f} domain={DOMAIN} highlight={f(shown[0], shown[1])} label={description}>
        {({ x, y }) => (
          <g aria-hidden="true">
            <line x1={x(DOMAIN[0][0])} y1={y(0)} x2={x(DOMAIN[0][1])} y2={y(0)} stroke={zeros[1] ? DATA_COLORS.highlight : DATA_COLORS.grid} strokeWidth={zeros[1] ? 2.5 : 1} />
            <line x1={x(0)} y1={y(DOMAIN[1][0])} x2={x(0)} y2={y(DOMAIN[1][1])} stroke={zeros[0] ? DATA_COLORS.highlight : DATA_COLORS.grid} strokeWidth={zeros[0] ? 2.5 : 1} />
            <polyline points={steps.slice(0, k + 1).map((s) => `${x(s.point[0])},${y(s.point[1])}`).join(' ')} fill="none" stroke={DATA_COLORS.highlight} strokeWidth={2} />
            {halfway && (
              <>
                <line x1={x(previous[0])} y1={y(previous[1])} x2={x(next.gradientPoint[0])} y2={y(next.gradientPoint[1])} stroke={DATA_COLORS.secondary} strokeDasharray="4 3" />
                <circle cx={x(next.gradientPoint[0])} cy={y(next.gradientPoint[1])} r={DOT_RADIUS} fill={DATA_COLORS.secondary} />
              </>
            )}
            <circle cx={x(center[0])} cy={y(center[1])} r={DOT_RADIUS - 1} fill="none" stroke={DATA_COLORS.text} strokeWidth={2} />
            <circle cx={x(previous[0])} cy={y(previous[1])} r={DOT_RADIUS} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
          </g>
        )}
      </ContourMap>
    </VizFrame>
  );
}
