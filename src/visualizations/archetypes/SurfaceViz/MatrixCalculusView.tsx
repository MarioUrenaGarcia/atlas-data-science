import { useMemo, useState } from 'react';
import { eigenSym2, type Point2 } from '../../../lib/multivariable/index.ts';
import {
  QUADRATIC_CASES,
  quadraticGradient,
  quadraticMinimum,
  quadraticValue,
  type QuadraticCase,
} from '../../../lib/multivariable/matrixCalculus.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Arrow } from '../../core/svg/Arrow.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { ContourMap } from './ContourMap.tsx';
import { num } from './levels.ts';
import styles from './SurfaceViz.module.css';

const ITERATIONS = 30;
const STEPS_PER_SECOND = 2.5;
/** Step size as a fraction of 2 / λmax, the largest stable step of gradient descent. */
const STEP_FRACTION = 0.45;
const ARROW_LENGTH = 0.5;
const DOT_RADIUS = 5;

interface MatrixCalculusViewProps {
  title: string;
  cases: readonly string[];
}

const vec = ([x, y]: Point2, digits = 3) => `\\begin{pmatrix} ${num(x, digits)} \\\\ ${num(y, digits)} \\end{pmatrix}`;
const mat = (m: [[number, number], [number, number]]) =>
  `\\begin{pmatrix} ${num(m[0][0], 2)} & ${num(m[0][1], 2)} \\\\ ${num(m[1][0], 2)} & ${num(m[1][1], 2)} \\end{pmatrix}`;

/**
 * Gradients of functions of a vector written with matrices. For
 * f(x) = 1/2 xᵀAx - bᵀx + c the gradient is Ax - b, so the minimum solves
 * Ax = b. Gradient descent follows -(Ax - b) step by step; in the
 * least-squares case the same formula gives the normal equations.
 */
export function MatrixCalculusView({ title, cases }: MatrixCalculusViewProps) {
  const definitions = useMemo(
    () =>
      cases.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'caso',
              label: 'Función cuadrática',
              options: cases.map((id) => ({ value: id, label: QUADRATIC_CASES[id]?.name ?? id })),
              default: cases[0] ?? 'redonda',
            },
          ]
        : [],
    [cases],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const id = cases.length > 1 ? String(values.caso) : (cases[0] ?? 'redonda');
  const q = QUADRATIC_CASES[id] ?? (QUADRATIC_CASES.redonda as QuadraticCase);
  const f = useMemo(() => (x: number, y: number) => quadraticValue(q, [x, y]), [q]);
  const minimum = quadraticMinimum(q);
  const path = useMemo(() => {
    const largest = eigenSym2(q.a).values[0];
    const rate = (STEP_FRACTION * 2) / largest;
    const list: Point2[] = [q.start];
    for (let k = 0; k < ITERATIONS; k += 1) {
      const p = list[k] as Point2;
      const [gx, gy] = quadraticGradient(q, p);
      list.push([p[0] - rate * gx, p[1] - rate * gy]);
    }
    return list;
  }, [q]);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(ITERATIONS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= ITERATIONS,
  });
  const current = path[step] ?? q.start;
  const gradient = quadraticGradient(q, current);
  const size = Math.hypot(gradient[0], gradient[1]);
  const isLeastSquares = Boolean(q.data);
  const variable = isLeastSquares ? '\\boldsymbol{\\beta}' : '\\mathbf{x}';
  const description =
    `${q.name}. Iteración ${step}: punto (${num(current[0], 3)}, ${num(current[1], 3)}), gradiente Ax - b = (${num(gradient[0], 3)}, ${num(gradient[1], 3)}). ` +
    `El mínimo, solución de Ax = b, está en (${num(minimum[0], 3)}, ${num(minimum[1], 3)}).`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={definitions.length > 0 ? { ...parameters, values } : undefined}
      readouts={[
        { label: 'Iteración k', value: String(step) },
        { label: isLeastSquares ? 'β actual (β₀, β₁)' : 'x actual', value: `(${num(current[0], 3)}, ${num(current[1], 3)})` },
        { label: 'f en el punto', value: num(f(current[0], current[1]), 4) },
        { label: '‖Ax - b‖', value: num(size, 4), color: DATA_COLORS.secondary },
        { label: 'Mínimo A⁻¹b', value: `(${num(minimum[0], 3)}, ${num(minimum[1], 3)})`, color: DATA_COLORS.tertiary },
      ]}
      legend={[
        { label: 'Descenso por el gradiente', color: DATA_COLORS.highlight, shape: 'line' },
        { label: '-∇f en el punto', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Mínimo', color: DATA_COLORS.tertiary, shape: 'circle' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={
            isLeastSquares
              ? `f(\\boldsymbol{\\beta}) = \\lVert \\mathbf{X}\\boldsymbol{\\beta} - \\mathbf{y} \\rVert^2,\\qquad \\nabla f = 2\\mathbf{X}^\\top\\mathbf{X}\\boldsymbol{\\beta} - 2\\mathbf{X}^\\top\\mathbf{y} = \\mathbf{A}\\boldsymbol{\\beta} - \\mathbf{b},\\quad \\mathbf{A} = ${mat(q.a)},\\ \\mathbf{b} = ${vec(q.b, 0)}`
              : `f(\\mathbf{x}) = \\tfrac{1}{2}\\mathbf{x}^\\top \\mathbf{A}\\mathbf{x} - \\mathbf{b}^\\top \\mathbf{x},\\qquad \\nabla f = \\mathbf{A}\\mathbf{x} - \\mathbf{b},\\quad \\mathbf{A} = ${mat(q.a)},\\ \\mathbf{b} = ${vec(q.b, 0)}`
          }
        />
      </p>
      <p className={styles.formula}>
        <Latex
          tex={`k = ${step}:\\quad \\nabla f(${variable}_{${step}}) = ${mat(q.a)}${vec(current)} - ${vec(q.b, 0)} = ${vec(gradient)}`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Curvas de nivel y descenso por el gradiente</p>
          <ContourMap f={f} domain={q.domain} highlight={f(current[0], current[1])} label={description}>
            {({ x, y, unit }) => (
              <g aria-hidden="true">
                <polyline points={path.slice(0, step + 1).map(([px, py]) => `${x(px)},${y(py)}`).join(' ')} fill="none" stroke={DATA_COLORS.highlight} strokeWidth={2.5} />
                {size > 1e-9 && (
                  <Arrow
                    x1={x(current[0])}
                    y1={y(current[1])}
                    x2={x(current[0]) - (gradient[0] / size) * ARROW_LENGTH * unit}
                    y2={y(current[1]) + (gradient[1] / size) * ARROW_LENGTH * unit}
                    color={DATA_COLORS.secondary}
                    width={2.5}
                  />
                )}
                <circle cx={x(minimum[0])} cy={y(minimum[1])} r={DOT_RADIUS} fill={DATA_COLORS.tertiary} />
                <circle cx={x(current[0])} cy={y(current[1])} r={DOT_RADIUS} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
              </g>
            )}
          </ContourMap>
        </div>
        {q.data && (
          <div>
            <p className={styles.panelTitle}>Datos y recta β₀ + β₁t de la iteración actual</p>
            <FunctionPlot
              xDomain={[-3, 3]}
              yDomain={[0, 10]}
              xLabel="t, horas de estudio respecto al promedio de 3"
              label={`Recta ajustada a los datos. ${description}`}
              aspect={0.75}
              curves={[
                { f: (t) => current[0] + current[1] * t, color: DATA_COLORS.highlight, width: 2.5 },
                { f: (t) => minimum[0] + minimum[1] * t, color: DATA_COLORS.tertiary, width: 1.5, dashed: true },
              ]}
            >
              {(s) =>
                q.data?.x.map(([, t], index) => (
                  <circle key={index} aria-hidden="true" cx={s.x(t)} cy={s.y(q.data?.y[index] ?? 0)} r={DOT_RADIUS} fill={DATA_COLORS.primary} />
                ))
              }
            </FunctionPlot>
          </div>
        )}
      </div>
    </VizFrame>
  );
}
