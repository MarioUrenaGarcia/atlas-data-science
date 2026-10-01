import { useMemo, useState } from 'react';
import type { Point2 } from '../../../lib/multivariable/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Arrow } from '../../core/svg/Arrow.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { ContourMap } from './ContourMap.tsx';
import { fieldRange, num } from './levels.ts';
import styles from './SurfaceViz.module.css';
import { fieldName, useFieldChoice } from './useFieldChoice.ts';

const START: Point2 = [-1.2, 1];
const FIELD_GRID = 9;
/** Longest arrow of the field, as a fraction of a grid cell. */
const FIELD_LENGTH = 0.8;
const MAIN_ARROW = 0.5;
const ASCENT_STEPS = 60;
const STEPS_PER_SECOND = 10;
/** Step of the ascent path, as a fraction of the domain width per unit of gradient. */
const ASCENT_RATE = 0.02;
const DOT_RADIUS = 5;

interface GradientViewProps {
  title: string;
  ids: readonly string[];
  /** Initial point; the sliders start here. */
  start?: Point2;
}

/**
 * The gradient field over the level curves. Every arrow points uphill in the
 * steepest direction and crosses the level curves at right angles; its length
 * is the steepness. The animation climbs from the chosen point by following
 * the gradient, a path that always cuts the curves perpendicularly.
 */
export function GradientView({ title, ids, start }: GradientViewProps) {
  const [sx, sy] = start ?? START;
  const initial = useMemo((): Point2 => [sx, sy], [sx, sy]);
  const { parameters, values, field, point } = useFieldChoice(ids, initial);
  const range = useMemo(() => fieldRange(field.f, field.domain), [field]);
  const [[x0, x1], [y0, y1]] = field.domain;
  const [steps, setSteps] = useState(0);
  const playback = usePlayback({
    step: () => setSteps((value) => Math.min(ASCENT_STEPS, value + 1)),
    reset: () => setSteps(0),
    rate: STEPS_PER_SECOND,
    done: steps >= ASCENT_STEPS,
  });
  const path = useMemo(() => {
    const list: Point2[] = [point];
    const width = x1 - x0;
    for (let k = 0; k < ASCENT_STEPS; k += 1) {
      const [px, py] = list[k] as Point2;
      const [gx, gy] = field.grad(px, py);
      const next: Point2 = [px + ASCENT_RATE * width * gx, py + ASCENT_RATE * width * gy];
      if (!Number.isFinite(next[0]) || next[0] < x0 || next[0] > x1 || next[1] < y0 || next[1] > y1) break;
      list.push(next);
    }
    return list;
  }, [field, point, x0, x1, y0, y1]);
  const current = path[Math.min(steps, path.length - 1)] ?? point;
  const [px, py] = field.grad(point[0], point[1]);
  const [gx, gy] = field.grad(current[0], current[1]);
  const size = Math.hypot(gx, gy);
  const maxSize = useMemo(() => {
    let largest = 0;
    for (let i = 0; i < FIELD_GRID; i += 1) {
      for (let j = 0; j < FIELD_GRID; j += 1) {
        const [ax, ay] = field.grad(x0 + ((i + 0.5) * (x1 - x0)) / FIELD_GRID, y0 + ((j + 0.5) * (y1 - y0)) / FIELD_GRID);
        largest = Math.max(largest, Math.hypot(ax, ay));
      }
    }
    return largest || 1;
  }, [field, x0, x1, y0, y1]);
  const description =
    `f(x, y) = ${fieldName(field.id)}. En (${num(current[0], 2)}, ${num(current[1], 2)}) el gradiente es (${num(gx, 3)}, ${num(gy, 3)}), ` +
    `de longitud ${num(size, 3)}: apunta hacia donde f sube más rápido y es perpendicular a la curva de nivel.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Punto', value: `(${num(current[0], 2)}, ${num(current[1], 2)})` },
        { label: 'f en el punto', value: num(field.f(current[0], current[1]), 3) },
        { label: '∇f = (∂f/∂x, ∂f/∂y)', value: `(${num(gx, 3)}, ${num(gy, 3)})`, color: DATA_COLORS.secondary },
        { label: '|∇f|, pendiente máxima', value: num(size, 3) },
        { label: 'Pasos de ascenso', value: String(Math.min(steps, path.length - 1)) },
      ]}
      legend={[
        { label: 'Campo de gradientes', color: DATA_COLORS.muted, shape: 'line' },
        { label: '∇f en el punto', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Camino de ascenso', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`\\nabla f(${num(point[0], 2)}, ${num(point[1], 2)}) = \\begin{pmatrix} ${num(px, 3)} \\\\ ${num(py, 3)} \\end{pmatrix},\\qquad \\lVert \\nabla f \\rVert = ${num(Math.hypot(px, py), 3)}`} />
      </p>
      <p className={styles.formula}>
        <Latex tex={`\\text{Paso ${Math.min(steps, path.length - 1)} del ascenso: } \\nabla f(${num(current[0], 2)}, ${num(current[1], 2)}) = \\begin{pmatrix} ${num(gx, 3)} \\\\ ${num(gy, 3)} \\end{pmatrix}`} />
      </p>
      <p className={styles.formula}>
        <Latex tex={`f(x, y) = ${field.latex}`} />
      </p>
      <ContourMap f={field.f} domain={field.domain} range={range} highlight={field.f(current[0], current[1])} label={description}>
        {({ x, y, unit }) => {
          const cell = ((x1 - x0) / FIELD_GRID) * unit;
          return (
            <g aria-hidden="true">
              {Array.from({ length: FIELD_GRID * FIELD_GRID }, (_, k) => {
                const px = x0 + (((k % FIELD_GRID) + 0.5) * (x1 - x0)) / FIELD_GRID;
                const py = y0 + ((Math.floor(k / FIELD_GRID) + 0.5) * (y1 - y0)) / FIELD_GRID;
                const [ax, ay] = field.grad(px, py);
                const length = (Math.hypot(ax, ay) / maxSize) * FIELD_LENGTH * cell;
                const norm = Math.hypot(ax, ay) || 1;
                if (length < 2) return null;
                return (
                  <Arrow key={k} x1={x(px)} y1={y(py)} x2={x(px) + (ax / norm) * length} y2={y(py) - (ay / norm) * length} color={DATA_COLORS.muted} width={1.3} />
                );
              })}
              <polyline points={path.slice(0, Math.min(steps, path.length - 1) + 1).map(([px, py]) => `${x(px)},${y(py)}`).join(' ')} fill="none" stroke={DATA_COLORS.highlight} strokeWidth={2.5} />
              {size > 1e-9 && (
                <Arrow
                  x1={x(current[0])}
                  y1={y(current[1])}
                  x2={x(current[0]) + (gx / size) * MAIN_ARROW * unit}
                  y2={y(current[1]) - (gy / size) * MAIN_ARROW * unit}
                  color={DATA_COLORS.secondary}
                  width={3}
                />
              )}
              <circle cx={x(current[0])} cy={y(current[1])} r={DOT_RADIUS} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
            </g>
          );
        }}
      </ContourMap>
    </VizFrame>
  );
}
