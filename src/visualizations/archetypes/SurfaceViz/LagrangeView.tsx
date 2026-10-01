import { useMemo, useState } from 'react';
import { LAGRANGE_CASES, lagrangePoints, type LagrangeCase } from '../../../lib/multivariable/constraints.ts';
import { FIELDS, type Field2 } from '../../../lib/multivariable/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Arrow } from '../../core/svg/Arrow.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { ContourMap } from './ContourMap.tsx';
import { fieldRange, num } from './levels.ts';
import styles from './SurfaceViz.module.css';

const STEPS = 160;
const STEPS_PER_SECOND = 10;
const SAMPLES = 200;
const ARROW_LENGTH = 0.5;
const DOT_RADIUS = 5;
/** Below this value of the cross product the gradients are drawn as parallel. */
const PARALLEL = 0.02;
const CASE_NAMES: Record<string, string> = {
  'suma-circulo': 'x + y sobre el círculo unitario',
  'paraboloide-recta': 'x² + y² sobre la recta x + y = 1',
  'producto-elipse': 'xy sobre una elipse',
};

interface LagrangeViewProps {
  title: string;
  cases: readonly string[];
}

/**
 * Optimization on a curve. A point runs along the constraint g = 0 over the
 * level curves of f. Where f along the curve has a maximum or a minimum, the
 * level curve of f touches the constraint without crossing it, and the two
 * gradients become parallel: ∇f = λ∇g.
 */
export function LagrangeView({ title, cases }: LagrangeViewProps) {
  const definitions = useMemo(
    () =>
      cases.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'caso',
              label: 'Problema',
              options: cases.map((id) => ({ value: id, label: CASE_NAMES[id] ?? id })),
              default: cases[0] ?? 'suma-circulo',
            },
          ]
        : [],
    [cases],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const id = cases.length > 1 ? String(values.caso) : (cases[0] ?? 'suma-circulo');
  const problem = LAGRANGE_CASES[id] ?? (LAGRANGE_CASES['suma-circulo'] as LagrangeCase);
  const field = FIELDS[problem.fieldId] ?? (FIELDS.suma as Field2);
  const range = useMemo(() => fieldRange(field.f, field.domain), [field]);
  const optima = useMemo(() => lagrangePoints(problem), [problem]);
  const [t0, t1] = problem.tRange;
  const curve = useMemo(
    () => Array.from({ length: SAMPLES + 1 }, (_, i) => problem.curve(t0 + ((t1 - t0) * i) / SAMPLES)),
    [problem, t0, t1],
  );
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => (value + 1) % (STEPS + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
  });
  const t = t0 + ((t1 - t0) * step) / STEPS;
  const [x, y] = problem.curve(t);
  const [fx, fy] = field.grad(x, y);
  const [gx, gy] = problem.gradG(x, y);
  const fNorm = Math.hypot(fx, fy);
  const gNorm = Math.hypot(gx, gy);
  // Sine of the angle between the gradients: zero exactly when they are parallel.
  const cross = fNorm > 0 && gNorm > 0 ? (fx * gy - fy * gx) / (fNorm * gNorm) : 0;
  const lambda = (fx * gx + fy * gy) / (gNorm * gNorm);
  const parallel = Math.abs(cross) < PARALLEL;
  const along = (s: number) => field.f(...problem.curve(s));
  const best = optima.reduce((top, p) => (p.value > top.value ? p : top), optima[0] ?? { t: 0, point: [0, 0] as [number, number], value: 0, lambda: 0 });
  const description =
    `${CASE_NAMES[id] ?? id}. En t = ${num(t, 2)} el punto (${num(x, 2)}, ${num(y, 2)}) da f = ${num(field.f(x, y), 3)}; ` +
    `el seno del ángulo entre ∇f y ∇g es ${num(cross, 3)}. Hay ${optima.length} puntos con ∇f = λ∇g; el mayor valor es ${num(best.value, 3)} con λ = ${num(best.lambda, 3)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={definitions.length > 0 ? { ...parameters, values } : undefined}
      readouts={[
        { label: 'Punto sobre la restricción', value: `(${num(x, 2)}, ${num(y, 2)})` },
        { label: 'f en el punto', value: num(field.f(x, y), 3) },
        { label: '∇f', value: `(${num(fx, 2)}, ${num(fy, 2)})`, color: DATA_COLORS.secondary },
        { label: '∇g', value: `(${num(gx, 2)}, ${num(gy, 2)})`, color: DATA_COLORS.tertiary },
        { label: 'Seno del ángulo entre ambos', value: num(cross, 3), color: DATA_COLORS.highlight },
      ]}
      legend={[
        { label: 'Restricción g = 0', color: DATA_COLORS.quaternary, shape: 'line' },
        { label: '∇f', color: DATA_COLORS.secondary, shape: 'line' },
        { label: '∇g', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Puntos con ∇f = λ∇g', color: DATA_COLORS.text, shape: 'circle' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`\\text{optimizar } f(x, y) = ${field.latex}\\ \\text{ sujeto a }\\ ${problem.constraintLatex}`} />
      </p>
      <p className={styles.formula}>
        <Latex
          tex={
            parallel
              ? `\\nabla f = ${vecTex(fx, fy)} = ${num(lambda, 3)}\\,${vecTex(gx, gy)} = \\lambda\\,\\nabla g,\\quad \\lambda = ${num(lambda, 3)}`
              : `\\nabla f = ${vecTex(fx, fy)},\\quad \\nabla g = ${vecTex(gx, gy)}:\\ \\text{no son paralelos, } f \\text{ todavía cambia a lo largo de la curva}`
          }
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>La restricción sobre las curvas de nivel de f</p>
          <ContourMap f={field.f} domain={field.domain} range={range} highlight={field.f(x, y)} label={description}>
            {({ x: sx, y: sy, unit }) => (
              <g aria-hidden="true">
                <polyline points={curve.map(([px, py]) => `${sx(px)},${sy(py)}`).join(' ')} fill="none" stroke={DATA_COLORS.quaternary} strokeWidth={3} />
                {optima.map(({ point }, index) => (
                  <circle key={index} cx={sx(point[0])} cy={sy(point[1])} r={DOT_RADIUS} fill={DATA_COLORS.text} />
                ))}
                {fNorm > 0 && (
                  <Arrow x1={sx(x)} y1={sy(y)} x2={sx(x) + (fx / fNorm) * ARROW_LENGTH * unit} y2={sy(y) - (fy / fNorm) * ARROW_LENGTH * unit} color={DATA_COLORS.secondary} width={2.5} />
                )}
                {gNorm > 0 && (
                  <Arrow x1={sx(x)} y1={sy(y)} x2={sx(x) + (gx / gNorm) * ARROW_LENGTH * unit} y2={sy(y) - (gy / gNorm) * ARROW_LENGTH * unit} color={DATA_COLORS.tertiary} width={2.5} dashed />
                )}
                <circle cx={sx(x)} cy={sy(y)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
              </g>
            )}
          </ContourMap>
        </div>
        <div>
          <p className={styles.panelTitle}>f a lo largo de la restricción</p>
          <FunctionPlot
            xDomain={[t0, t1]}
            xLabel="t, posición sobre la curva"
            label={`Valor de f sobre la restricción. ${description}`}
            aspect={0.75}
            curves={[{ f: along, color: DATA_COLORS.primary, width: 3 }]}
          >
            {(s) => (
              <g aria-hidden="true">
                {optima.map(({ t: ot, value }, index) => (
                  <circle key={index} cx={s.x(ot)} cy={s.y(value)} r={DOT_RADIUS} fill={DATA_COLORS.text} />
                ))}
                <circle cx={s.x(t)} cy={s.y(along(t))} r={DOT_RADIUS} fill={DATA_COLORS.highlight} />
              </g>
            )}
          </FunctionPlot>
        </div>
      </div>
    </VizFrame>
  );
}

function vecTex(a: number, b: number): string {
  return `\\begin{pmatrix} ${num(a, 3)} \\\\ ${num(b, 3)} \\end{pmatrix}`;
}
