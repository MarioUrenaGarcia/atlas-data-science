import { useMemo, useState } from 'react';
import { feasiblePolygon, KKT_CASES, projectOntoPolygon, type KktCase } from '../../../lib/multivariable/constraints.ts';
import type { Point2 } from '../../../lib/multivariable/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Arrow } from '../../core/svg/Arrow.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { EqualPlane } from '../../core/plane/EqualPlane.tsx';
import { num } from '../../core/plane/levels.ts';
import styles from './SurfaceViz.module.css';

const STEPS = 120;
const STEPS_PER_SECOND = 8;
const DOT_RADIUS = 5;
/** Length of the drawn constraint normals, scaled by their multipliers. */
const NORMAL_SCALE = 0.25;
const CASE_NAMES: Record<string, string> = {
  triangulo: 'Triángulo con tres restricciones',
  semiplano: 'Semiplano con una restricción',
};

interface KktViewProps {
  title: string;
  cases: readonly string[];
  /** Target shown before the animation starts moving it along its path. */
  initial?: Point2;
}

/**
 * The Karush-Kuhn-Tucker conditions for the closest feasible point to a
 * target that moves around the region. Inside the region no constraint is
 * active and every multiplier is zero; outside, the solution sits on an edge
 * or a corner, the active constraints get positive multipliers and
 * -∇f = Σ μᵢ aᵢ balances the pull of the target.
 */
export function KktView({ title, cases, initial }: KktViewProps) {
  const definitions = useMemo(
    () =>
      cases.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'caso',
              label: 'Región factible',
              options: cases.map((id) => ({ value: id, label: CASE_NAMES[id] ?? id })),
              default: cases[0] ?? 'triangulo',
            },
          ]
        : [],
    [cases],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const id = cases.length > 1 ? String(values.caso) : (cases[0] ?? 'triangulo');
  const problem = KKT_CASES[id] ?? (KKT_CASES.triangulo as KktCase);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => (value + 1) % STEPS),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    // A figure that fixes a target opens on it; the reader starts the motion.
    autoplay: initial === undefined,
  });
  const target = step === 0 && initial ? initial : problem.path((2 * Math.PI * step) / STEPS);
  const solution = projectOntoPolygon(target, problem.planes);
    const region = useMemo(() => feasiblePolygon(problem.planes, problem.domain), [problem]);
  const [px, py] = solution.point;
  const grad: Point2 = [2 * (px - target[0]), 2 * (py - target[1])];
  const activeText = solution.active.length === 0 ? '\\text{ninguna}' : solution.active.map((i) => problem.planes[i]?.label ?? '').join(',\\ ');
  const activeSum =
    solution.active.length === 0
      ? '\\mathbf{0}'
      : solution.active
          .map((i) => `${num(solution.multipliers[i] ?? 0, 3)}${vecTex(problem.planes[i]?.a ?? [0, 0])}`)
          .join(' + ');
  const description =
    `${CASE_NAMES[id] ?? id}. Objetivo (${num(target[0], 2)}, ${num(target[1], 2)}); el punto factible más cercano es (${num(px, 3)}, ${num(py, 3)}). ` +
    `Restricciones activas: ${solution.active.length}. Multiplicadores: ${solution.multipliers.map((m) => num(m, 3)).join(', ')}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={definitions.length > 0 ? { ...parameters, values } : undefined}
      readouts={[
        { label: 'Objetivo t', value: `(${num(target[0], 2)}, ${num(target[1], 2)})`, color: DATA_COLORS.secondary },
        { label: 'Solución x*', value: `(${num(px, 3)}, ${num(py, 3)})`, color: DATA_COLORS.highlight },
        { label: 'Restricciones activas', value: String(solution.active.length) },
        ...problem.planes.map((_, index) => ({
          label: `μ${index + 1}`,
          value: num(solution.multipliers[index] ?? 0, 3),
        })),
      ]}
      legend={[
        { label: 'Región factible', color: DATA_COLORS.primary },
        { label: 'Objetivo', color: DATA_COLORS.secondary, shape: 'circle' },
        { label: 'Punto factible más cercano', color: DATA_COLORS.highlight, shape: 'circle' },
        { label: 'μᵢ aᵢ de las restricciones activas', color: DATA_COLORS.tertiary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\min\\ \\lVert \\mathbf{x} - \\mathbf{t} \\rVert^2 \\ \\text{ sujeto a }\\ ${problem.planes.map((plane) => plane.label).join(',\\ ')}`}
        />
      </p>
      <p className={styles.formula}>
        <Latex
          tex={`-\\nabla f(\\mathbf{x}^*) = ${vecTex([-grad[0], -grad[1]])} = \\sum_i \\mu_i \\mathbf{a}_i = ${activeSum},\\qquad \\mu_i \\ge 0`}
        />
      </p>
      <p className={styles.formula}>
        <Latex tex={`\\text{Restricciones activas: } ${activeText}`} />
      </p>
      <EqualPlane domain={problem.domain} label={description}>
        {({ x, y, unit }) => {
          return (
            <g aria-hidden="true">
              <polygon
                points={region.map(([rx, ry]) => `${x(rx)},${y(ry)}`).join(' ')}
                fill={DATA_COLORS.primary}
                fillOpacity={0.25}
                stroke={DATA_COLORS.primary}
                strokeWidth={2}
              />
              <line x1={x(target[0])} y1={y(target[1])} x2={x(px)} y2={y(py)} stroke={DATA_COLORS.text} strokeDasharray="4 4" />
              {solution.active.map((index) => {
                const plane = problem.planes[index];
                const mu = solution.multipliers[index] ?? 0;
                if (!plane || mu <= 0) return null;
                const length = Math.hypot(plane.a[0], plane.a[1]) || 1;
                return (
                  <Arrow
                    key={index}
                    x1={x(px)}
                    y1={y(py)}
                    x2={x(px) + (plane.a[0] / length) * mu * NORMAL_SCALE * unit}
                    y2={y(py) - (plane.a[1] / length) * mu * NORMAL_SCALE * unit}
                    color={DATA_COLORS.tertiary}
                    width={2.5}
                  />
                );
              })}
              <circle cx={x(target[0])} cy={y(target[1])} r={DOT_RADIUS} fill={DATA_COLORS.secondary} />
              <circle cx={x(px)} cy={y(py)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
            </g>
          );
        }}
      </EqualPlane>
    </VizFrame>
  );
}

function vecTex([a, b]: Point2): string {
  return `\\begin{pmatrix} ${num(a, 3)} \\\\ ${num(b, 3)} \\end{pmatrix}`;
}
