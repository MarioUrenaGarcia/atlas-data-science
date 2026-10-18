import { useMemo, useState } from 'react';
import { NUMERIC_FUNCTIONS } from '../../../lib/numerics/functions.ts';
import {
  chebyshevNodes,
  equispacedNodes,
  lagrangeInterpolant,
  maxError,
} from '../../../lib/numerics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { autoYDomain } from '../../core/svg/plotDomain.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { sci } from './format.ts';

const MIN_NODES = 2;
const MAX_NODES = 20;
const STEPS_PER_SECOND = 1.2;
const DOT_RADIUS = 5;
/** Vertical room around the function, so a wild interpolant stays readable. */
const Y_PADDING = 1;

interface InterpolationViewProps {
  title: string;
  id: string;
  nodes: 'equiespaciados' | 'chebyshev';
  n: number;
}

/**
 * The polynomial of degree n - 1 through n points of f. The animation adds
 * nodes one at a time. With equally spaced nodes on the Runge function the
 * interpolant oscillates more and more near the ends; with Chebyshev nodes,
 * clustered at the ends, the error shrinks.
 */
export function InterpolationView({ title, id, nodes, n }: InterpolationViewProps) {
  const fn = NUMERIC_FUNCTIONS[id] ?? NUMERIC_FUNCTIONS.runge;
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'nodos',
        label: 'Nodos',
        options: [
          { value: 'equiespaciados', label: 'Igualmente espaciados' },
          { value: 'chebyshev', label: 'De Chebyshev' },
        ],
        default: nodes,
      },
    ],
    [nodes],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, unknown>;
  const kind = String(values.nodos) as 'equiespaciados' | 'chebyshev';
  const target = Math.min(MAX_NODES, Math.max(MIN_NODES, n));
  const [count, setCount] = useState(target);
  const playback = usePlayback({
    step: () => setCount((value) => Math.min(MAX_NODES, value + 1)),
    reset: () => setCount(MIN_NODES),
    rate: STEPS_PER_SECOND,
    done: count >= MAX_NODES,
  });
  if (!fn) return null;
  const [a, b] = fn.domain;
  const xs = kind === 'chebyshev' ? chebyshevNodes(count, a, b) : equispacedNodes(count, a, b);
  const ys = xs.map(fn.f);
  const p = lagrangeInterpolant(xs, ys);
  const error = maxError(fn.f, p, a, b);
  const [y0, y1] = autoYDomain([{ f: fn.f, color: '' }], [a, b]);
  const description =
    `Polinomio de grado ${count - 1} por ${count} nodos ${kind === 'chebyshev' ? 'de Chebyshev' : 'igualmente espaciados'} de ${id}: ` +
    `error máximo ${sci(error)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Nodos n', value: String(count) },
        { label: 'Grado del polinomio', value: String(count - 1) },
        { label: 'Error máximo', value: sci(error), color: DATA_COLORS.highlight },
      ]}
      legend={[
        { label: 'f(x)', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Polinomio interpolante', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Nodos', color: DATA_COLORS.text, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`p_{${count - 1}}(x) = \\sum_{i=1}^{${count}} f(x_i)\\,\\ell_i(x),\\qquad f(x) = ${fn.latex},\\qquad \\max_{x} |f(x) - p_{${count - 1}}(x)| = ${sci(error, true)}`}
      />
      <FunctionPlot
        xDomain={[a, b]}
        yDomain={[y0 - Y_PADDING, y1 + Y_PADDING]}
        label={description}
        curves={[
          { f: fn.f, color: DATA_COLORS.primary, width: 3 },
          { f: p, color: DATA_COLORS.secondary, width: 2.5 },
        ]}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {xs.map((xi, i) => (
              <circle
                key={i}
                cx={x(xi)}
                cy={y(ys[i] ?? 0)}
                r={DOT_RADIUS}
                fill="var(--color-surface)"
                stroke={DATA_COLORS.text}
                strokeWidth={2}
              />
            ))}
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
