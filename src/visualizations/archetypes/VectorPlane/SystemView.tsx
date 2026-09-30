import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { VectorArrow } from '../../core/svg/VectorArrow.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { Vec2 } from './schema.ts';
import { cross, scale, vecText } from './vectors.ts';
import styles from './VectorPlane.module.css';

type Equation = [number, number, number];

type View = 'filas' | 'columnas';
const VIEWS = [
  { value: 'filas', label: 'Rectas (filas)' },
  { value: 'columnas', label: 'Combinación de columnas' },
] as const;
const TOLERANCE = 1e-9;
const FRAMES = 30;
const FRAMES_PER_SECOND = 20;
const FAR = 40;

interface SystemViewProps {
  title: string;
  systems: readonly { nombre: string; ecuaciones: [Equation, Equation] }[];
}

const signed = (value: number, symbol: string, first: boolean) => {
  const text = `${formatNumber(Math.abs(value), 2)}${symbol}`;
  if (first) return value < 0 ? `-${text}` : text;
  return value < 0 ? `- ${text}` : `+ ${text}`;
};

/**
 * A system of two linear equations in two unknowns, seen two ways. As rows,
 * each equation is a line and the solutions are the common points: one,
 * none (parallel lines) or infinitely many (the same line). As columns, the
 * solution gives the coefficients that combine the columns into the right-hand side.
 */
export function SystemView({ title, systems }: SystemViewProps) {
  const [view, setView] = useState<View>('filas');
  const definitions = useMemo(
    () =>
      systems.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'sistema',
              label: 'Sistema',
              options: systems.map((item, index) => ({ value: String(index), label: item.nombre })),
              default: '0',
            },
          ]
        : [],
    [systems],
  );
  const parameters = useParameters(definitions);
  const chosen =
    systems.length > 1 ? Number((parameters.values as Record<string, string>).sistema) : 0;
  const system = systems[chosen] ?? systems[0];
  const [frame, setFrame] = useState(0);
  const playback = usePlayback({
    step: () => setFrame((value) => Math.min(FRAMES, value + 1)),
    reset: () => setFrame(0),
    rate: FRAMES_PER_SECOND,
    done: frame >= FRAMES,
  });
  if (!system) return null;
  const [[a, b, c], [d, e, f]] = system.ecuaciones;
  const det = a * e - b * d;
  const unique = Math.abs(det) > TOLERANCE;
  const solution: Vec2 | null = unique ? [(c * e - b * f) / det, (a * f - c * d) / det] : null;
  const consistent =
    unique ||
    (Math.abs(cross([a, c], [d, f])) < TOLERANCE && Math.abs(cross([b, c], [e, f])) < TOLERANCE);
  const kind = unique
    ? 'una solución'
    : consistent
      ? 'infinitas soluciones (misma recta)'
      : 'ninguna solución (rectas paralelas)';
  const description = `${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}y = ${c}; ${d}x ${e >= 0 ? '+' : '-'} ${Math.abs(e)}y = ${f}. Determinante ${formatNumber(det, 3)}: ${kind}${solution ? `, x = ${formatNumber(solution[0], 3)}, y = ${formatNumber(solution[1], 3)}` : ''}.`;
  const t = frame / FRAMES;

  const linePoints = (p: number, q: number, r: number): [Vec2, Vec2] => {
    if (Math.abs(q) > TOLERANCE)
      return [
        [-FAR, (r + p * FAR) / q],
        [FAR, (r - p * FAR) / q],
      ];
    return [
      [r / p, -FAR],
      [r / p, FAR],
    ];
  };

  return (
    <VizFrame
      title={title}
      playback={playback}
      views={{ options: VIEWS, value: view, onChange: (next) => setView(next as View) }}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'Determinante', value: formatNumber(det, 3) },
        { label: 'Tipo de sistema', value: kind, color: DATA_COLORS.highlight },
        { label: 'Solución', value: solution ? vecText(solution, 3) : kind },
      ]}
      legend={
        view === 'filas'
          ? [
              { label: 'Primera ecuación', color: DATA_COLORS.primary, shape: 'line' },
              { label: 'Segunda ecuación', color: DATA_COLORS.secondary, shape: 'line' },
            ]
          : [
              { label: 'x · columna 1', color: DATA_COLORS.primary, shape: 'line' },
              { label: 'y · columna 2', color: DATA_COLORS.secondary, shape: 'line' },
              { label: 'Lado derecho', color: DATA_COLORS.highlight, shape: 'line' },
            ]
      }
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\begin{cases} ${signed(a, 'x', true)} ${signed(b, 'y', false)} = ${formatNumber(c, 2)} \\\\ ${signed(d, 'x', true)} ${signed(e, 'y', false)} = ${formatNumber(f, 2)} \\end{cases}`}
        />
      </p>
      <CartesianPlane extent={7} label={description}>
        {(plane) => {
          if (view === 'filas') {
            const [p1, p2] = linePoints(a, b, c);
            const [q1, q2] = linePoints(d, e, f);
            const growth = (from: Vec2, to: Vec2): Vec2 => [
              from[0] + (to[0] - from[0]) * t,
              from[1] + (to[1] - from[1]) * t,
            ];
            const end1 = growth(p1, p2);
            const end2 = growth(q2, q1);
            return (
              <g aria-hidden="true">
                <line
                  x1={plane.x(p1[0])}
                  y1={plane.y(p1[1])}
                  x2={plane.x(end1[0])}
                  y2={plane.y(end1[1])}
                  stroke={DATA_COLORS.primary}
                  strokeWidth={3}
                />
                <line
                  x1={plane.x(q2[0])}
                  y1={plane.y(q2[1])}
                  x2={plane.x(end2[0])}
                  y2={plane.y(end2[1])}
                  stroke={DATA_COLORS.secondary}
                  strokeWidth={3}
                  strokeDasharray={consistent && !unique ? '8 6' : undefined}
                />
                {solution && frame >= FRAMES && (
                  <circle
                    cx={plane.x(solution[0])}
                    cy={plane.y(solution[1])}
                    r={7}
                    fill={DATA_COLORS.highlight}
                    stroke="var(--color-text)"
                  />
                )}
              </g>
            );
          }
          const column1: Vec2 = [a, d];
          const column2: Vec2 = [b, e];
          const right: Vec2 = [c, f];
          const part1 = solution ? scale(column1, solution[0] * t) : column1;
          const part2 = solution ? scale(column2, solution[1] * t) : column2;
          return (
            <>
              <VectorArrow
                plane={plane}
                to={column1}
                color={DATA_COLORS.primary}
                label="col 1"
                dashed
              />
              <VectorArrow
                plane={plane}
                to={column2}
                color={DATA_COLORS.secondary}
                label="col 2"
                dashed
              />
              <VectorArrow
                plane={plane}
                to={right}
                color={DATA_COLORS.highlight}
                label="lado derecho"
                width={3}
              />
              {solution && (
                <>
                  <VectorArrow plane={plane} to={part1} color={DATA_COLORS.primary} width={3} />
                  <VectorArrow
                    plane={plane}
                    from={part1}
                    to={[part1[0] + part2[0], part1[1] + part2[1]]}
                    color={DATA_COLORS.secondary}
                    width={3}
                  />
                </>
              )}
            </>
          );
        }}
      </CartesianPlane>
    </VizFrame>
  );
}
