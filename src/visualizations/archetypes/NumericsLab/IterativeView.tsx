import { useMemo, useState } from 'react';
import {
  iterationRadius,
  iterativeSolve,
  type IterativeMethod,
} from '../../../lib/numerics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { EqualPlane } from '../../core/plane/EqualPlane.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { exact, sci } from './format.ts';

const ITERATIONS = 25;
const STEPS_PER_SECOND = 2;
const DOT_RADIUS = 4;
/** Half width of the window around the solution and the start. */
const MIN_HALF_WIDTH = 2;
const PADDING = 1.2;

const INFO: Record<IterativeMethod, { name: string; color: string }> = {
  jacobi: { name: 'Jacobi', color: DATA_COLORS.secondary },
  'gauss-seidel': { name: 'Gauss-Seidel', color: DATA_COLORS.quaternary },
};

type Pair = [number, number];

interface IterativeViewProps {
  title: string;
  matrix: [Pair, Pair];
  b: Pair;
  start: Pair;
  methods: readonly IterativeMethod[];
}

/**
 * Jacobi and Gauss-Seidel on a 2 by 2 system. Each equation is a line; Jacobi
 * updates both coordinates from the previous point, Gauss-Seidel uses the new
 * x at once to update y, which in a 2 by 2 system squares the contraction per
 * sweep. Convergence depends on the spectral radius of the iteration matrix.
 */
export function IterativeView({ title, matrix, b, start, methods }: IterativeViewProps) {
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(ITERATIONS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= ITERATIONS,
  });
  const [[a11, a12], [a21, a22]] = matrix;
  const det = a11 * a22 - a12 * a21;
  const solution: Pair = [(b[0] * a22 - a12 * b[1]) / det, (a11 * b[1] - a21 * b[0]) / det];
  const paths = useMemo(
    () => methods.map((method) => iterativeSolve(matrix, b, start, method, ITERATIONS)),
    [methods, matrix, b, start],
  );
  const half = Math.max(
    MIN_HALF_WIDTH,
    Math.abs(start[0] - solution[0]) * PADDING,
    Math.abs(start[1] - solution[1]) * PADDING,
  );
  const domain: [[number, number], [number, number]] = [
    [solution[0] - half, solution[0] + half],
    [solution[1] - half, solution[1] + half],
  ];
  const current = paths.map((path) => path[Math.min(step, path.length - 1)] ?? start);
  const errors = current.map((p) =>
    Math.hypot((p[0] ?? 0) - solution[0], (p[1] ?? 0) - solution[1]),
  );
  const dominant = Math.abs(a11) > Math.abs(a12) && Math.abs(a22) > Math.abs(a21);
  const description =
    `Sistema ${a11}x + ${a12}y = ${b[0]}, ${a21}x + ${a22}y = ${b[1]} con solución (${exact(solution[0])}, ${exact(solution[1])}). ` +
    methods
      .map(
        (m, i) =>
          `${INFO[m].name}: iteración ${step}, error ${sci(errors[i] ?? 0)}, radio espectral ${sci(iterationRadius(matrix, m))}`,
      )
      .join('. ') +
    '.';
  const line = (row: Pair, rhs: number, xs: [number, number]) => {
    const [p, q] = row;
    if (Math.abs(q) > 1e-12) return xs.map((x) => [x, (rhs - p * x) / q] as Pair);
    return [[rhs / p, domain[1][0]] as Pair, [rhs / p, domain[1][1]] as Pair];
  };

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Iteración k', value: String(step) },
        ...methods.map((m, i) => ({
          label: `Error de ${INFO[m].name}`,
          value: sci(errors[i] ?? 0),
          color: INFO[m].color,
        })),
        ...methods.map((m) => ({
          label: `Radio espectral de ${INFO[m].name}`,
          value: sci(iterationRadius(matrix, m)),
        })),
        { label: 'Diagonal dominante', value: dominant ? 'sí' : 'no' },
      ]}
      legend={[
        { label: 'Ecuaciones', color: DATA_COLORS.muted, shape: 'line' },
        ...methods.map((m) => ({
          label: INFO[m].name,
          color: INFO[m].color,
          shape: 'line' as const,
        })),
        { label: 'Solución', color: DATA_COLORS.text, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`\\begin{cases} ${a11}x + ${a12}y = ${b[0]} \\\\ ${a21}x + ${a22}y = ${b[1]} \\end{cases}\\qquad ${methods
          .map(
            (m, i) =>
              `\\text{${INFO[m].name}:}\\ \\mathbf{x}_{${step}} = (${sci(current[i]?.[0] ?? 0, true)}, ${sci(current[i]?.[1] ?? 0, true)})`,
          )
          .join(',\\quad ')}`}
      />
      <EqualPlane domain={domain} label={description}>
        {({ x, y }) => (
          <g aria-hidden="true">
            {[0, 1].map((r) => {
              const pts = line(matrix[r] ?? [1, 0], b[r] ?? 0, domain[0]);
              return (
                <line
                  key={r}
                  x1={x(pts[0]?.[0] ?? 0)}
                  y1={y(pts[0]?.[1] ?? 0)}
                  x2={x(pts[1]?.[0] ?? 0)}
                  y2={y(pts[1]?.[1] ?? 0)}
                  stroke={DATA_COLORS.muted}
                  strokeWidth={2}
                />
              );
            })}
            {paths.map((path, i) => {
              const method = methods[i] ?? 'jacobi';
              const shown = path.slice(0, step + 1);
              return (
                <g key={method}>
                  <polyline
                    points={shown.map((p) => `${x(p[0] ?? 0)},${y(p[1] ?? 0)}`).join(' ')}
                    fill="none"
                    stroke={INFO[method].color}
                    strokeWidth={2}
                  />
                  {shown.map((p, k) => (
                    <circle
                      key={k}
                      cx={x(p[0] ?? 0)}
                      cy={y(p[1] ?? 0)}
                      r={DOT_RADIUS}
                      fill={INFO[method].color}
                    />
                  ))}
                </g>
              );
            })}
            <circle
              cx={x(solution[0])}
              cy={y(solution[1])}
              r={DOT_RADIUS + 2}
              fill="none"
              stroke={DATA_COLORS.text}
              strokeWidth={2}
            />
          </g>
        )}
      </EqualPlane>
    </VizFrame>
  );
}
