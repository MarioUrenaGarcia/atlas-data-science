import { useMemo, useState } from 'react';
import { choose, combinations } from '../../../lib/combinatorics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './PascalTriangle.module.css';

const MIN_PATHS_PER_SECOND = 1.5;
const TARGET_SECONDS = 25;

interface LatticePathsViewProps {
  title: string;
  right: number;
  up: number;
}

/** Word of R and U steps for a path whose up steps sit at the given positions. */
function stepsOf(ups: readonly number[], length: number): string[] {
  return Array.from({ length }, (_, index) => (ups.includes(index) ? 'U' : 'R'));
}

/**
 * Monotone paths on a grid: a path with a steps to the right and b steps up
 * is fixed by choosing which of its a + b steps go up, so there are
 * C(a + b, b) of them. Each grid point shows how many paths reach it, the sum
 * of the counts to its left and below, which rebuilds Pascal's triangle.
 */
export function LatticePathsView({ title, right, up }: LatticePathsViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'a',
        label: 'Pasos a la derecha',
        symbol: 'a',
        min: 1,
        max: 6,
        step: 1,
        default: right,
      },
      {
        type: 'number' as const,
        key: 'b',
        label: 'Pasos hacia arriba',
        symbol: 'b',
        min: 1,
        max: 6,
        step: 1,
        default: up,
      },
    ],
    [right, up],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const a = Number(values.a);
  const b = Number(values.b);
  const length = a + b;
  const paths = useMemo(() => combinations(length, b), [length, b]);
  const total = paths.length;
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${a}|${b}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    stepMany: (count) => update((value) => Math.min(total, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: Math.max(MIN_PATHS_PER_SECOND, total / TARGET_SECONDS),
    done: shown >= total,
  });
  const current = shown > 0 ? paths[shown - 1] : undefined;
  const word = current ? stepsOf(current, length).join('') : '';
  const description =
    `Caminos de ${a} pasos a la derecha y ${b} hacia arriba: se eligen las ${b} posiciones de subida entre ${length}, C(${length}, ${b}) = ${total}. ` +
    (current ? `Camino ${shown}: ${word}.` : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Pasos totales', value: `${a} + ${b} = ${length}` },
        { label: 'Caminos', value: `C(${length}, ${b}) = ${total}`, color: DATA_COLORS.primary },
        { label: 'Camino actual', value: word || 'ninguno', color: DATA_COLORS.highlight },
        { label: 'Dibujados', value: `${shown} de ${total}` },
      ]}
      legend={[
        { label: 'Camino actual', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Caminos anteriores', color: DATA_COLORS.primary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\#\\text{caminos} = \\binom{a + b}{b} = \\binom{${length}}{${b}} = ${total}`}
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0.62}
        minHeight={260}
        maxHeight={460}
        margins={{ top: 20, right: 30, bottom: 30, left: 30 }}
      >
        {(box) => {
          const cell = Math.min(box.inner.width / a, box.inner.height / b);
          const left = box.inner.left + (box.inner.width - cell * a) / 2;
          const bottom = box.inner.top + box.inner.height - (box.inner.height - cell * b) / 2;
          const point = (x: number, y: number) => ({ x: left + x * cell, y: bottom - y * cell });
          const polyline = (ups: readonly number[]) => {
            let x = 0;
            let y = 0;
            const coordinates = [point(0, 0)];
            stepsOf(ups, length).forEach((step) => {
              if (step === 'U') y += 1;
              else x += 1;
              coordinates.push(point(x, y));
            });
            return coordinates.map((p) => `${p.x},${p.y}`).join(' ');
          };
          return (
            <g aria-hidden="true">
              {Array.from({ length: a + 1 }, (_, x) => (
                <line
                  key={`v${x}`}
                  x1={point(x, 0).x}
                  x2={point(x, b).x}
                  y1={point(x, 0).y}
                  y2={point(x, b).y}
                  stroke="var(--color-border)"
                />
              ))}
              {Array.from({ length: b + 1 }, (_, y) => (
                <line
                  key={`h${y}`}
                  x1={point(0, y).x}
                  x2={point(a, y).x}
                  y1={point(0, y).y}
                  y2={point(a, y).y}
                  stroke="var(--color-border)"
                />
              ))}
              {paths.slice(0, Math.max(0, shown - 1)).map((ups, index) => (
                <polyline
                  key={index}
                  points={polyline(ups)}
                  fill="none"
                  stroke={DATA_COLORS.primary}
                  strokeOpacity={0.18}
                  strokeWidth={3}
                />
              ))}
              {current && (
                <polyline
                  points={polyline(current)}
                  fill="none"
                  stroke={DATA_COLORS.highlight}
                  strokeWidth={5}
                  strokeLinejoin="round"
                />
              )}
              {Array.from({ length: a + 1 }, (_, x) =>
                Array.from({ length: b + 1 }, (_, y) => {
                  const p = point(x, y);
                  return (
                    <g key={`p${x}-${y}`}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={11}
                        fill="var(--color-surface)"
                        stroke="var(--color-border-strong)"
                      />
                      <text
                        x={p.x}
                        y={p.y}
                        dy="0.35em"
                        textAnchor="middle"
                        className={svgStyles.label}
                        style={{ fontSize: 10 }}
                      >
                        {choose(x + y, y)}
                      </text>
                    </g>
                  );
                }),
              )}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
