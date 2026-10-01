import { useMemo, useState } from 'react';
import type { Point2 } from '../../../lib/multivariable/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { ContourMap } from '../../core/plane/ContourMap.tsx';
import { fieldRange, num } from '../../core/plane/levels.ts';
import { SurfacePanel } from './SurfacePanel.tsx';
import styles from './SurfaceViz.module.css';
import { fieldName, useFieldChoice } from './useFieldChoice.ts';

const START: Point2 = [0.5, 0.5];
/** Probe distances h = H0 * RATIO^k: the probe halves its distance every few steps. */
const H0 = 1.2;
const RATIO = 0.8;
const STEPS = 24;
const STEPS_PER_SECOND = 2.5;
/** Half side of the drawn tangent patch, as a fraction of the domain width. */
const PATCH = 0.22;
/** Direction of approach of the probe. */
const DIRECTION: Point2 = [Math.cos(0.6), Math.sin(0.6)];
const DOT_RADIUS = 5;

interface TangentViewProps {
  title: string;
  ids: readonly string[];
  /** Initial point; the sliders start here. */
  start?: Point2;
}

/**
 * The tangent plane as the best linear approximation. A probe approaches the
 * point; the gap between the surface and the plane at the probe shrinks faster
 * than the distance h, so the ratio error / h tends to 0. That is what makes
 * the plane tangent and not just any plane through the point.
 */
export function TangentView({ title, ids, start }: TangentViewProps) {
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
  const [[x0, x1]] = field.domain;
  const [a, b] = point;
  const f0 = field.f(a, b);
  const [fx, fy] = field.grad(a, b);
  const plane = (x: number, y: number) => f0 + fx * (x - a) + fy * (y - b);
  const h = H0 * RATIO ** step;
  const probe: Point2 = [a + h * DIRECTION[0], b + h * DIRECTION[1]];
  const actual = field.f(probe[0], probe[1]);
  const linear = plane(probe[0], probe[1]);
  const error = Math.abs(actual - linear);
  const ratio = error / h;
  const description =
    `${fieldName(field.id)} en (${num(a, 2)}, ${num(b, 2)}): plano tangente L(x, y) = ${num(f0, 3)} + ${num(fx, 3)}(x - ${num(a, 2)}) + ${num(fy, 3)}(y - ${num(b, 2)}). ` +
    `A distancia h = ${num(h, 4)} el error es ${num(error, 5)} y el cociente error / h es ${num(ratio, 4)}.`;
  const half = PATCH * (x1 - x0);
  const corners: Point2[] = [
    [a - half, b - half],
    [a + half, b - half],
    [a + half, b + half],
    [a - half, b + half],
  ];

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Distancia h', value: num(h, 4) },
        { label: 'f en la sonda', value: num(actual, 5), color: DATA_COLORS.primary },
        { label: 'L en la sonda', value: num(linear, 5), color: DATA_COLORS.secondary },
        { label: 'Error |f - L|', value: num(error, 5) },
        { label: 'Error / h', value: num(ratio, 4), color: DATA_COLORS.highlight },
      ]}
      legend={[
        { label: 'Plano tangente', color: DATA_COLORS.secondary },
        { label: 'Punto de tangencia', color: DATA_COLORS.highlight, shape: 'circle' },
        { label: 'Sonda que se acerca', color: DATA_COLORS.tertiary, shape: 'circle' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`L(x, y) = ${num(f0, 3)} + (${num(fx, 3)})(x - ${num(a, 2)}) + (${num(fy, 3)})(y - ${num(b, 2)})`}
        />
      </p>
      <p className={styles.formula}>
        <Latex
          tex={`h = ${num(h, 4)}:\\quad \\lvert f - L \\rvert = ${num(error, 5)},\\qquad \\frac{\\lvert f - L \\rvert}{h} = ${num(ratio, 4)}`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>La superficie y su plano tangente</p>
          <SurfacePanel f={field.f} domain={field.domain} range={range} label={`Superficie con plano tangente. ${description}`}>
            {({ screen, at }) => {
              const polygon = corners.map(([x, y]) => screen.at(at(x, y, plane(x, y)))).map((p) => `${p.x},${p.y}`).join(' ');
              const touch = screen.at(at(a, b, f0));
              const onSurface = screen.at(at(probe[0], probe[1], actual));
              const onPlane = screen.at(at(probe[0], probe[1], linear));
              return (
                <g aria-hidden="true">
                  <polygon points={polygon} fill={DATA_COLORS.secondary} fillOpacity={0.35} stroke={DATA_COLORS.secondary} strokeWidth={2} />
                  <line x1={onSurface.x} y1={onSurface.y} x2={onPlane.x} y2={onPlane.y} stroke={DATA_COLORS.text} strokeWidth={2} />
                  <circle cx={onSurface.x} cy={onSurface.y} r={DOT_RADIUS - 1} fill={DATA_COLORS.tertiary} />
                  <circle cx={touch.x} cy={touch.y} r={DOT_RADIUS} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
                </g>
              );
            }}
          </SurfacePanel>
        </div>
        <div>
          <p className={styles.panelTitle}>La sonda se acerca al punto en el plano xy</p>
          <ContourMap f={field.f} domain={field.domain} range={range} highlight={f0} label={`Curvas de nivel con la sonda. ${description}`}>
            {({ x, y }) => (
              <g aria-hidden="true">
                <line x1={x(a)} y1={y(b)} x2={x(a + H0 * DIRECTION[0])} y2={y(b + H0 * DIRECTION[1])} stroke={DATA_COLORS.tertiary} strokeDasharray="4 4" />
                <circle cx={x(probe[0])} cy={y(probe[1])} r={DOT_RADIUS} fill={DATA_COLORS.tertiary} />
                <circle cx={x(a)} cy={y(b)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
              </g>
            )}
          </ContourMap>
        </div>
      </div>
    </VizFrame>
  );
}
