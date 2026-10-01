import { useMemo, useState } from 'react';
import { projectionDual } from '../../../lib/optimization/linear.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { EqualPlane } from '../../core/plane/EqualPlane.tsx';
import { num } from '../../core/plane/levels.ts';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './OptimizerRace.module.css';

const STEPS = 60;
const STEPS_PER_SECOND = 8;
const PLANE: [[number, number], [number, number]] = [
  [-1, 3],
  [-1, 3],
];
const DOT_RADIUS = 5;

interface DualityViewProps {
  title: string;
  target: [number, number];
  normal: [number, number];
  bound: number;
}

/**
 * Lagrange duality for projecting a point t onto the half-plane aᵀx <= c.
 * For each multiplier μ >= 0 the Lagrangian is minimized without the
 * constraint, at x(μ) = t - μa; its value is the dual function g(μ), a lower
 * bound of the primal optimum. Its maximum touches the optimum: strong
 * duality, with x(μ*) on the boundary.
 */
export function DualityView({ title, target, normal, bound }: DualityViewProps) {
  const definitions = useMemo(
    () => [
      { type: 'number' as const, key: 'tx', label: 'Punto objetivo, coordenada x', symbol: 't₁', min: -0.5, max: 2.5, step: 0.05, default: target[0], digits: 2 },
      { type: 'number' as const, key: 'ty', label: 'Punto objetivo, coordenada y', symbol: 't₂', min: -0.5, max: 2.5, step: 0.05, default: target[1], digits: 2 },
    ],
    [target],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const t: [number, number] = [Number(values.tx), Number(values.ty)];
  const { g, muStar, primal, dualOptimum } = projectionDual(t, normal, bound);
  const muMax = Math.max(1, 2 * muStar + 0.5);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  const mu = (muMax * step) / STEPS;
  const xMu: [number, number] = [t[0] - mu * normal[0], t[1] - mu * normal[1]];
  const constraint = normal[0] * xMu[0] + normal[1] * xMu[1] - bound;
  const description =
    `Proyección de t = (${num(t[0], 2)}, ${num(t[1], 2)}) sobre ${num(normal[0], 2)}x + ${num(normal[1], 2)}y ≤ ${num(bound, 2)}. ` +
    `Con μ = ${num(mu, 3)}, el mínimo del lagrangiano es x(μ) = (${num(xMu[0], 3)}, ${num(xMu[1], 3)}) y g(μ) = ${num(g(mu), 4)}, ` +
    `por debajo del óptimo primal ${num(primal, 4)}. El máximo dual, ${num(dualOptimum, 4)}, se alcanza en μ* = ${num(muStar, 3)}.`;
  const [[x0, x1]] = PLANE;
  const lineAt = (x: number) => (bound - normal[0] * x) / normal[1];

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'μ', value: num(mu, 3), color: DATA_COLORS.highlight },
        { label: 'g(μ), cota inferior', value: num(g(mu), 4), color: DATA_COLORS.secondary },
        { label: 'p*, óptimo primal', value: num(primal, 4), color: DATA_COLORS.tertiary },
        { label: 'μ* y g(μ*)', value: `${num(muStar, 3)} y ${num(dualOptimum, 4)}` },
        { label: 'aᵀx(μ) - c', value: num(constraint, 3) },
      ]}
      legend={[
        { label: 'Región factible', color: DATA_COLORS.primary },
        { label: 'x(μ), mínimo del lagrangiano', color: DATA_COLORS.highlight, shape: 'circle' },
        { label: 'Función dual g(μ)', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Óptimo primal p*', color: DATA_COLORS.tertiary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine
        className={styles.formula}
        tex={`g(\\mu) = \\min_{\\mathbf{x}}\\ \\tfrac{1}{2}\\lVert \\mathbf{x} - \\mathbf{t} \\rVert^2 + \\mu(\\mathbf{a}^\\top\\mathbf{x} - c) = \\mu(\\mathbf{a}^\\top\\mathbf{t} - c) - \\tfrac{\\mu^2}{2}\\lVert \\mathbf{a} \\rVert^2`}
      />
      <FormulaLine
        className={styles.formula}
        tex={`\\mu = ${num(mu, 3)}:\\quad g(\\mu) = ${num(g(mu), 4)}\\ \\le\\ p^* = ${num(primal, 4)},\\qquad \\max_{\\mu \\ge 0} g = g(${num(muStar, 3)}) = ${num(dualOptimum, 4)}`}
      />
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>El mínimo del lagrangiano se acerca a la frontera</p>
          <EqualPlane domain={PLANE} label={description}>
            {({ x, y }) => {
              const corner = (px: number) => `${x(px)},${y(lineAt(px))}`;
              return (
                <g aria-hidden="true">
                  <polygon
                    points={`${corner(x0)} ${corner(x1)} ${x(x1)},${y(-1)} ${x(x0)},${y(-1)}`}
                    fill={DATA_COLORS.primary}
                    fillOpacity={0.18}
                  />
                  <line x1={x(x0)} y1={y(lineAt(x0))} x2={x(x1)} y2={y(lineAt(x1))} stroke={DATA_COLORS.primary} strokeWidth={2} />
                  <line x1={x(t[0])} y1={y(t[1])} x2={x(xMu[0])} y2={y(xMu[1])} stroke={DATA_COLORS.text} strokeDasharray="4 4" />
                  <circle cx={x(t[0])} cy={y(t[1])} r={DOT_RADIUS} fill={DATA_COLORS.secondary} />
                  <circle cx={x(xMu[0])} cy={y(xMu[1])} r={DOT_RADIUS} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
                </g>
              );
            }}
          </EqualPlane>
        </div>
        <div>
          <p className={styles.panelTitle}>La función dual queda por debajo del óptimo primal</p>
          <FunctionPlot
            xDomain={[0, muMax]}
            xLabel="μ, multiplicador"
            label={`Función dual. ${description}`}
            aspect={0.8}
            curves={[
              { f: g, color: DATA_COLORS.secondary, width: 3 },
              { f: () => primal, color: DATA_COLORS.tertiary, width: 2, dashed: true },
            ]}
          >
            {(s) => <circle aria-hidden="true" cx={s.x(mu)} cy={s.y(g(mu))} r={DOT_RADIUS} fill={DATA_COLORS.highlight} />}
          </FunctionPlot>
        </div>
      </div>
    </VizFrame>
  );
}
