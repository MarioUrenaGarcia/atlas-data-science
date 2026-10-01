import { useMemo, useState } from 'react';
import type { Point2 } from '../../../lib/multivariable/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { fieldRange, num } from './levels.ts';
import { SurfacePanel } from './SurfacePanel.tsx';
import styles from './SurfaceViz.module.css';
import { fieldName, useFieldChoice } from './useFieldChoice.ts';

const START: Point2 = [0.6, -0.5];
const SLICE_SAMPLES = 60;
/** Secant steps h = H_FRACTION * width * RATIO^k, k = 0, ..., STEPS. */
const H_FRACTION = 0.3;
const RATIO = 0.75;
const STEPS = 16;
const STEPS_PER_SECOND = 2;
const DOT_RADIUS = 5;
const PANEL_ASPECT = 0.5;
/** Fraction of each slice covered by its tangent segment. */
const TANGENT_FRACTION = 0.2;

interface PartialsViewProps {
  title: string;
  ids: readonly string[];
  /** Initial point; the sliders start here. */
  start?: Point2;
}

/**
 * Partial derivatives as slopes of slices. Fixing y = y0 cuts the surface
 * along a curve in the x direction, whose slope is ∂f/∂x; fixing x = x0 cuts
 * it along y, with slope ∂f/∂y. The animation shrinks a step h on each slice:
 * the secant slopes, the quotients of the definition, approach the partials.
 */
export function PartialsView({ title, ids, start }: PartialsViewProps) {
  const [sx, sy] = start ?? START;
  const initial = useMemo((): Point2 => [sx, sy], [sx, sy]);
  const { parameters, values, field, point } = useFieldChoice(ids, initial);
  const range = useMemo(() => fieldRange(field.f, field.domain), [field]);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  const [[x0, x1], [y0, y1]] = field.domain;
  const [x, y] = point;
  const value = field.f(x, y);
  const [fx, fy] = field.grad(x, y);
  const hx = H_FRACTION * (x1 - x0) * RATIO ** step;
  const hy = H_FRACTION * (y1 - y0) * RATIO ** step;
  const qx = (field.f(x + hx, y) - value) / hx;
  const qy = (field.f(x, y + hy) - value) / hy;
  const description =
    `f(x, y) = ${fieldName(field.id)} en (${num(x, 2)}, ${num(y, 2)}): ` +
    `∂f/∂x = ${num(fx, 3)} es la pendiente del corte con y fijo y ∂f/∂y = ${num(fy, 3)} la del corte con x fijo.`;
  const sliceX = (t: number) => field.f(t, y);
  const sliceY = (t: number) => field.f(x, t);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: '(x₀, y₀)', value: `(${num(x, 2)}, ${num(y, 2)})` },
        { label: 'f(x₀, y₀)', value: num(value, 3) },
        { label: 'Paso h en x', value: num(hx, 4) },
        { label: 'Cociente en x', value: num(qx, 4) },
        { label: '∂f/∂x', value: num(fx, 3), color: DATA_COLORS.secondary },
        { label: 'Cociente en y', value: num(qy, 4) },
        { label: '∂f/∂y', value: num(fy, 3), color: DATA_COLORS.tertiary },
      ]}
      legend={[
        { label: 'Corte con y = y₀', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Corte con x = x₀', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Secante con paso h', color: DATA_COLORS.text, shape: 'line' },
        { label: 'Tangente del corte', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`f(x, y) = ${field.latex}`} />
      </p>
      <p className={styles.formula}>
        <Latex
          tex={`\\frac{f(x_0 + h, y_0) - f(x_0, y_0)}{h} = ${num(qx, 4)} \\to \\frac{\\partial f}{\\partial x}(${num(x, 2)}, ${num(y, 2)}) = ${num(fx, 3)}`}
        />
      </p>
      <p className={styles.formula}>
        <Latex
          tex={`\\frac{f(x_0, y_0 + h) - f(x_0, y_0)}{h} = ${num(qy, 4)} \\to \\frac{\\partial f}{\\partial y}(${num(x, 2)}, ${num(y, 2)}) = ${num(fy, 3)}`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Los dos cortes sobre la superficie</p>
          <SurfacePanel f={field.f} domain={field.domain} range={range} label={`Superficie con sus cortes. ${description}`}>
            {({ screen, at }) => {
              const line = (points: [number, number][]) => points.map(([u, v]) => screen.at(at(u, v, field.f(u, v)))).map((p) => `${p.x},${p.y}`).join(' ');
              const alongX = Array.from({ length: SLICE_SAMPLES + 1 }, (_, i) => [x0 + ((x1 - x0) * i) / SLICE_SAMPLES, y] as [number, number]);
              const alongY = Array.from({ length: SLICE_SAMPLES + 1 }, (_, i) => [x, y0 + ((y1 - y0) * i) / SLICE_SAMPLES] as [number, number]);
              const p = screen.at(at(x, y, value));
              return (
                <g aria-hidden="true">
                  <polyline points={line(alongX)} fill="none" stroke={DATA_COLORS.secondary} strokeWidth={3} />
                  <polyline points={line(alongY)} fill="none" stroke={DATA_COLORS.tertiary} strokeWidth={3} />
                  <circle cx={p.x} cy={p.y} r={DOT_RADIUS} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
                </g>
              );
            }}
          </SurfacePanel>
        </div>
        <div>
          <p className={styles.panelTitle}>Corte con y = {num(y, 2)}: pendiente ∂f/∂x</p>
          <FunctionPlot
            xDomain={[x0, x1]}
            label={`Corte en la dirección x. ${description}`}
            aspect={PANEL_ASPECT}
            minHeight={170}
            curves={[
              { f: sliceX, color: DATA_COLORS.secondary, width: 3 },
              { f: (t) => value + fx * (t - x), color: DATA_COLORS.highlight, width: 2, from: x - (x1 - x0) * TANGENT_FRACTION, to: x + (x1 - x0) * TANGENT_FRACTION },
              { f: (t) => value + qx * (t - x), color: DATA_COLORS.text, width: 1.5, dashed: true, from: x - (x1 - x0) * TANGENT_FRACTION, to: x + hx + (x1 - x0) * TANGENT_FRACTION },
            ]}
          >
            {(s) => (
              <g aria-hidden="true">
                <circle cx={s.x(x + hx)} cy={s.y(field.f(x + hx, y))} r={DOT_RADIUS - 1} fill={DATA_COLORS.text} />
                <circle cx={s.x(x)} cy={s.y(value)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} />
              </g>
            )}
          </FunctionPlot>
          <p className={styles.panelTitle}>Corte con x = {num(x, 2)}: pendiente ∂f/∂y</p>
          <FunctionPlot
            xDomain={[y0, y1]}
            xLabel="y"
            label={`Corte en la dirección y. ${description}`}
            aspect={PANEL_ASPECT}
            minHeight={170}
            curves={[
              { f: sliceY, color: DATA_COLORS.tertiary, width: 3 },
              { f: (t) => value + fy * (t - y), color: DATA_COLORS.highlight, width: 2, from: y - (y1 - y0) * TANGENT_FRACTION, to: y + (y1 - y0) * TANGENT_FRACTION },
              { f: (t) => value + qy * (t - y), color: DATA_COLORS.text, width: 1.5, dashed: true, from: y - (y1 - y0) * TANGENT_FRACTION, to: y + hy + (y1 - y0) * TANGENT_FRACTION },
            ]}
          >
            {(s) => (
              <g aria-hidden="true">
                <circle cx={s.x(y + hy)} cy={s.y(field.f(x, y + hy))} r={DOT_RADIUS - 1} fill={DATA_COLORS.text} />
                <circle cx={s.x(y)} cy={s.y(value)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} />
              </g>
            )}
          </FunctionPlot>
        </div>
      </div>
    </VizFrame>
  );
}
