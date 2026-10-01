import { useMemo, useState } from 'react';
import { chainDerivative, CURVES, type Curve2 } from '../../../lib/multivariable/curves.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Arrow } from '../../core/svg/Arrow.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { ContourMap } from '../../core/plane/ContourMap.tsx';
import { fieldRange, num } from '../../core/plane/levels.ts';
import styles from './SurfaceViz.module.css';
import { fieldName, useFieldChoice } from './useFieldChoice.ts';

const STEPS = 120;
const STEPS_PER_SECOND = 12;
const SAMPLES = 160;
/** Length of the drawn arrows, as a fraction of the domain width per unit of vector. */
const ARROW_SCALE = 0.18;
const TANGENT_SPAN = 0.12;
const DOT_RADIUS = 5;
const CURVE_NAMES: Record<string, string> = {
  circulo: 'Círculo de radio 1.2',
  recta: 'Recta',
  espiral: 'Espiral',
};

interface TrajectoryViewProps {
  title: string;
  ids: readonly string[];
  curves: readonly string[];
}

/**
 * The chain rule for f(r(t)). A point travels along a curve over the level
 * curves of f; at each instant the rate of change of f is the dot product of
 * the gradient with the velocity. It is zero where the curve runs along a
 * level curve and largest where it climbs straight up the gradient.
 */
export function TrajectoryView({ title, ids, curves }: TrajectoryViewProps) {
  const extra = useMemo(
    () =>
      curves.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'curva',
              label: 'Trayectoria',
              options: curves.map((id) => ({ value: id, label: CURVE_NAMES[id] ?? id })),
              default: curves[0] ?? 'circulo',
            },
          ]
        : [],
    [curves],
  );
  const { parameters, values, field } = useFieldChoice(ids, null, extra);
  const curveId = curves.length > 1 ? String(values.curva) : (curves[0] ?? 'circulo');
  const curve = CURVES[curveId] ?? (CURVES.circulo as Curve2);
  const range = useMemo(() => fieldRange(field.f, field.domain), [field]);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => (value + 1) % (STEPS + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
  });
  const [t0, t1] = curve.tRange;
  const t = t0 + ((t1 - t0) * step) / STEPS;
  const [x, y] = curve.r(t);
  const [gx, gy] = field.grad(x, y);
  const [vx, vy] = curve.velocity(t);
  const rate = chainDerivative(field.grad, curve, t);
  const g = (s: number) => field.f(...curve.r(s));
  const value = g(t);
  const [[x0, x1]] = field.domain;
  const span = TANGENT_SPAN * (t1 - t0);
  const path = useMemo(
    () => Array.from({ length: SAMPLES + 1 }, (_, i) => curve.r(t0 + ((t1 - t0) * i) / SAMPLES)),
    [curve, t0, t1],
  );
  const description =
    `${fieldName(field.id)} a lo largo de ${CURVE_NAMES[curveId] ?? curveId}. En t = ${num(t, 2)} el punto es (${num(x, 2)}, ${num(y, 2)}), ` +
    `el gradiente (${num(gx, 3)}, ${num(gy, 3)}) y la velocidad (${num(vx, 3)}, ${num(vy, 3)}); su producto punto, ${num(rate, 3)}, es la derivada de f(r(t)).`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 't', value: num(t, 2) },
        { label: 'f(r(t))', value: num(value, 3) },
        { label: '∇f', value: `(${num(gx, 3)}, ${num(gy, 3)})`, color: DATA_COLORS.secondary },
        { label: "r'(t)", value: `(${num(vx, 3)}, ${num(vy, 3)})`, color: DATA_COLORS.tertiary },
        { label: "d/dt f(r(t)) = ∇f · r'", value: num(rate, 3), color: DATA_COLORS.highlight },
      ]}
      legend={[
        { label: 'Trayectoria', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Gradiente', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Velocidad', color: DATA_COLORS.tertiary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`f(x, y) = ${field.latex},\\qquad ${curve.latex}`} />
      </p>
      <p className={styles.formula}>
        <Latex
          tex={`\\frac{d}{dt} f(\\mathbf{r}(t)) \\Big|_{t = ${num(t, 2)}} = \\nabla f \\cdot \\mathbf{r}'(t) = (${num(gx, 2)})(${num(vx, 2)}) + (${num(gy, 2)})(${num(vy, 2)}) = ${num(rate, 3)}`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>La trayectoria sobre las curvas de nivel</p>
          <ContourMap f={field.f} domain={field.domain} range={range} highlight={value} label={description}>
            {({ x: sx, y: sy }) => {
              const scale = ARROW_SCALE * (x1 - x0);
              return (
                <g aria-hidden="true">
                  <polyline points={path.map(([px, py]) => `${sx(px)},${sy(py)}`).join(' ')} fill="none" stroke={DATA_COLORS.highlight} strokeWidth={2.5} />
                  <Arrow x1={sx(x)} y1={sy(y)} x2={sx(x + gx * scale)} y2={sy(y + gy * scale)} color={DATA_COLORS.secondary} width={2.5} />
                  <Arrow x1={sx(x)} y1={sy(y)} x2={sx(x + vx * scale)} y2={sy(y + vy * scale)} color={DATA_COLORS.tertiary} width={2.5} />
                  <circle cx={sx(x)} cy={sy(y)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
                </g>
              );
            }}
          </ContourMap>
        </div>
        <div>
          <p className={styles.panelTitle}>f(r(t)) y su recta tangente</p>
          <FunctionPlot
            xDomain={[t0, t1]}
            xLabel="t"
            label={`Valor de f a lo largo de la trayectoria. ${description}`}
            aspect={0.75}
            curves={[
              { f: g, color: DATA_COLORS.primary, width: 3 },
              { f: (s) => value + rate * (s - t), color: DATA_COLORS.highlight, width: 2, from: t - span, to: t + span },
            ]}
          >
            {(s) => <circle aria-hidden="true" cx={s.x(t)} cy={s.y(value)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} />}
          </FunctionPlot>
        </div>
      </div>
    </VizFrame>
  );
}
