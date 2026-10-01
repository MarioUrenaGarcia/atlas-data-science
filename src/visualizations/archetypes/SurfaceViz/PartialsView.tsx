import { useMemo, useState } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { fieldRange, num } from './levels.ts';
import { SurfacePanel } from './SurfacePanel.tsx';
import styles from './SurfaceViz.module.css';
import { fieldName, useFieldChoice } from './useFieldChoice.ts';

const START: [number, number] = [0.6, -0.5];
const SLICE_SAMPLES = 60;
const SWEEP_STEPS = 80;
const STEPS_PER_SECOND = 12;
const DOT_RADIUS = 5;
const PANEL_ASPECT = 0.5;
/** Fraction of each slice covered by its tangent segment. */
const TANGENT_FRACTION = 0.2;

interface PartialsViewProps {
  title: string;
  ids: readonly string[];
}

/**
 * Partial derivatives as slopes of slices. Fixing y = y0 cuts the surface
 * along a curve in the x direction, whose slope is ∂f/∂x; fixing x = x0 cuts
 * it along y, with slope ∂f/∂y. With the animation, x0 sweeps the domain.
 */
export function PartialsView({ title, ids }: PartialsViewProps) {
  const { parameters, values, field, point } = useFieldChoice(ids, START);
  const range = useMemo(() => fieldRange(field.f, field.domain), [field]);
  const [sweep, setSweep] = useState<number | null>(null);
  const playback = usePlayback({
    step: () => setSweep((value) => ((value ?? 0) + 1) % (SWEEP_STEPS + 1)),
    reset: () => setSweep(null),
    rate: STEPS_PER_SECOND,
  });
  const [[x0, x1], [y0, y1]] = field.domain;
  const x = sweep === null ? point[0] : x0 + ((x1 - x0) * sweep) / SWEEP_STEPS;
  const y = point[1];
  const value = field.f(x, y);
  const [fx, fy] = field.grad(x, y);
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
        { label: '∂f/∂x', value: num(fx, 3), color: DATA_COLORS.secondary },
        { label: '∂f/∂y', value: num(fy, 3), color: DATA_COLORS.tertiary },
      ]}
      legend={[
        { label: 'Corte con y = y₀', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Corte con x = x₀', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Tangente del corte', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`f(x, y) = ${field.latex}`} />
      </p>
      <p className={styles.formula}>
        <Latex
          tex={`\\frac{\\partial f}{\\partial x}(${num(x, 2)}, ${num(y, 2)}) = ${num(fx, 3)},\\qquad \\frac{\\partial f}{\\partial y}(${num(x, 2)}, ${num(y, 2)}) = ${num(fy, 3)}`}
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
            ]}
          >
            {(s) => <circle aria-hidden="true" cx={s.x(x)} cy={s.y(value)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} />}
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
            ]}
          >
            {(s) => <circle aria-hidden="true" cx={s.x(y)} cy={s.y(value)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} />}
          </FunctionPlot>
        </div>
      </div>
    </VizFrame>
  );
}
