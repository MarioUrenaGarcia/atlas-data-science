import { useMemo, useState } from 'react';
import type { Point } from '../../../lib/optimization/index.ts';
import { optimizerPath, type PathStep } from '../../../lib/optimization/paths.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { num } from '../../core/plane/levels.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { FunctionMap } from './FunctionMap.tsx';
import { useFunctionChoice } from './shared.ts';

const GRID = 4;
const ITERATIONS = 300;
/** Iterations advanced per animation frame. */
const PER_FRAME = 10;
const FRAMES = ITERATIONS / PER_FRAME;
const STEPS_PER_SECOND = 4;
/** Points per side of the grid where the largest curvature is searched. */
const CURVATURE_GRID = 25;
/** Fraction of the window kept free at each border when placing the starts. */
const MARGIN = 0.12;
const SAME_POINT = 0.05;

interface StartsViewProps {
  title: string;
  ids: readonly string[];
}

/**
 * Gradient descent from a grid of starting points, with the fixed rate
 * 1/λmax, where λmax is the largest curvature in the window, so no path
 * overshoots its basin. On a
 * convex function every path ends at the same minimum; on a function with
 * several local minima the end point depends on where the search begins.
 */
export function StartsView({ title, ids }: StartsViewProps) {
  const { parameters, values, fn } = useFunctionChoice(ids, null);
  const starts = useMemo(() => {
    const list: Point[] = [];
    const { x: [x0, x1], y: [y0, y1] } = fn.domain;
    for (let i = 0; i < GRID; i += 1) {
      for (let j = 0; j < GRID; j += 1) {
        const tx = MARGIN + ((1 - 2 * MARGIN) * i) / (GRID - 1);
        const ty = MARGIN + ((1 - 2 * MARGIN) * j) / (GRID - 1);
        list.push([x0 + tx * (x1 - x0), y0 + ty * (y1 - y0)]);
      }
    }
    return list;
  }, [fn]);
  const rate = useMemo(() => {
    let largest = 0;
    const { x: [x0, x1], y: [y0, y1] } = fn.domain;
    for (let i = 0; i <= CURVATURE_GRID; i += 1) {
      for (let j = 0; j <= CURVATURE_GRID; j += 1) {
        const [[a, b], [, d]] = fn.hessian([x0 + ((x1 - x0) * i) / CURVATURE_GRID, y0 + ((y1 - y0) * j) / CURVATURE_GRID]);
        largest = Math.max(largest, (a + d) / 2 + Math.hypot((a - d) / 2, b));
      }
    }
    return 1 / largest;
  }, [fn]);
  const paths = useMemo(() => starts.map((s) => optimizerPath('gradiente', fn, s, ITERATIONS, rate)), [starts, fn, rate]);
  const [frame, setFrame] = useState(0);
  const playback = usePlayback({
    step: () => setFrame((value) => Math.min(FRAMES, value + 1)),
    reset: () => setFrame(0),
    rate: STEPS_PER_SECOND,
    done: frame >= FRAMES,
  });
  const step = frame * PER_FRAME;
  // Group the final points: each distinct end point gets its own color.
  const ends = paths.map((p) => (p[p.length - 1] as PathStep).point);
  const groups: Point[] = [];
  const groupOf = ends.map((e) => {
    let index = groups.findIndex((g) => Math.hypot(g[0] - e[0], g[1] - e[1]) < SAME_POINT);
    if (index < 0) {
      groups.push(e);
      index = groups.length - 1;
    }
    return index;
  });
  const finished = frame >= FRAMES;
  const description =
    `${fn.label}: ${starts.length} puntos de partida en rejilla, descenso de gradiente con tasa ${num(rate, 4)}. ` +
    (finished
      ? `Los caminos terminan en ${groups.length} ${groups.length === 1 ? 'punto' : 'puntos distintos'}: ${groups.map((g) => `(${num(g[0], 2)}, ${num(g[1], 2)}) con f = ${num(fn.f(g), 3)}`).join('; ')}.`
      : `Iteración ${step}.`);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={ids.length > 1 ? { ...parameters, values: values as Record<string, unknown> } : undefined}
      readouts={[
        { label: 'Iteración k', value: String(step) },
        { label: 'Puntos de partida', value: String(starts.length) },
        { label: 'Tasa η = 1/λmax', value: num(rate, 4) },
        { label: 'Puntos finales distintos', value: finished ? String(groups.length) : 'en curso' },
        ...groups.slice(0, 4).map((g, i) => ({
          label: `Final ${i + 1}: f`,
          value: `${num(fn.f(g), 3)} (${groupOf.filter((k) => k === i).length} caminos)`,
          color: seriesColor(i),
        })),
      ]}
      legend={[
        { label: 'Punto de partida', color: DATA_COLORS.muted, shape: 'circle' },
        { label: 'Camino coloreado según su punto final', color: seriesColor(0), shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`\\mathbf{x}_{k+1} = \\mathbf{x}_k - ${num(rate, 4)}\\,\\nabla f(\\mathbf{x}_k),\\quad k = ${step}:\\quad \\text{${finished ? `${groups.length} punto${groups.length === 1 ? '' : 's'} final${groups.length === 1 ? '' : 'es'} para ${starts.length} inicios` : 'los caminos avanzan'}}`}
      />
      <FunctionMap fn={fn} label={description}>
        {({ x, y }) => (
          <g aria-hidden="true">
            {paths.map((path, i) => {
              const shown = path.slice(0, step + 1);
              const tip = shown[shown.length - 1] as PathStep;
              const color = seriesColor(groupOf[i] ?? 0);
              const first = path[0] as PathStep;
              return (
                <g key={i}>
                  <circle cx={x(first.point[0])} cy={y(first.point[1])} r={3} fill={DATA_COLORS.muted} />
                  <polyline points={shown.map((s) => `${x(s.point[0])},${y(s.point[1])}`).join(' ')} fill="none" stroke={color} strokeWidth={2} />
                  <circle cx={x(tip.point[0])} cy={y(tip.point[1])} r={4} fill={color} stroke="var(--color-surface)" strokeWidth={1.5} />
                </g>
              );
            })}
          </g>
        )}
      </FunctionMap>
    </VizFrame>
  );
}
