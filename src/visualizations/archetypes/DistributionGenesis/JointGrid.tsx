import { scaleLinear } from 'd3-scale';
import { multinomialPmf } from '../../../lib/distributions/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import svgStyles from '../../core/svg/svg.module.css';
import type { StageBox } from './stage.ts';

interface JointGridProps {
  box: StageBox;
  n: number;
  /** Probabilities of the two plotted categories and of all the others together. */
  probabilities: [number, number, number];
  vectors: readonly (readonly number[])[];
  labels: [string, string];
  latest: readonly number[] | null;
}

const MARGIN = { left: 50, right: 16, top: 10, bottom: 36 };

/**
 * Joint counts of the first two categories. Only the triangle x1 + x2 <= n is
 * possible; circles show the theoretical probability and the fill shows how
 * often each pair appeared.
 */
export function JointGrid({ box, n, probabilities, vectors, labels, latest }: JointGridProps) {
  const inner = {
    left: box.x + MARGIN.left,
    top: box.y + MARGIN.top,
    width: Math.max(10, box.width - MARGIN.left - MARGIN.right),
    height: Math.max(10, box.height - MARGIN.top - MARGIN.bottom),
  };
  const side = Math.min(inner.width, inner.height);
  const left = inner.left + (inner.width - side) / 2;
  const cell = side / (n + 1);
  const x = scaleLinear()
    .domain([-0.5, n + 0.5])
    .range([left, left + side]);
  const y = scaleLinear()
    .domain([-0.5, n + 0.5])
    .range([inner.top + side, inner.top]);
  const counts = new Map<string, number>();
  for (const vector of vectors) {
    const key = `${vector[0] ?? 0},${vector[1] ?? 0}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const total = vectors.length;
  let peak = 0;
  for (let a = 0; a <= n; a += 1)
    for (let b = 0; a + b <= n; b += 1)
      peak = Math.max(peak, multinomialPmf([a, b, n - a - b], probabilities));
  const ticks = Array.from({ length: n + 1 }, (_, i) => i).filter(
    (i) => n <= 12 || i % Math.ceil(n / 12) === 0,
  );

  return (
    <g>
      <g aria-hidden="true">
        {Array.from({ length: n + 1 }, (_, a) =>
          Array.from({ length: n + 1 - a }, (_, b) => {
            const mass = multinomialPmf([a, b, n - a - b], probabilities);
            const frequency = total > 0 ? (counts.get(`${a},${b}`) ?? 0) / total : 0;
            const current = latest !== null && latest[0] === a && latest[1] === b;
            return (
              <g key={`${a}-${b}`}>
                <rect
                  x={x(a) - cell / 2 + 0.5}
                  y={y(b) - cell / 2 + 0.5}
                  width={cell - 1}
                  height={cell - 1}
                  fill={DATA_COLORS.light}
                  fillOpacity={peak > 0 ? Math.min(1, frequency / peak) * 0.9 : 0}
                  stroke={current ? DATA_COLORS.highlight : 'var(--data-grid)'}
                  strokeWidth={current ? 2 : 1}
                />
                {mass > 0 && (
                  <circle
                    cx={x(a)}
                    cy={y(b)}
                    r={Math.max(0.8, Math.sqrt(mass / peak) * cell * 0.42)}
                    fill="none"
                    stroke={DATA_COLORS.primary}
                    strokeWidth={1.5}
                  />
                )}
              </g>
            );
          }),
        )}
      </g>
      <g className={svgStyles.axis} aria-hidden="true">
        {ticks.map((i) => (
          <g key={`x${i}`}>
            <text
              x={x(i)}
              y={inner.top + side + 16}
              textAnchor="middle"
              className={svgStyles.tickLabel}
            >
              {i}
            </text>
            <text x={left - 8} y={y(i) + 4} textAnchor="end" className={svgStyles.tickLabel}>
              {i}
            </text>
          </g>
        ))}
        <text
          x={left + side / 2}
          y={inner.top + side + 32}
          textAnchor="middle"
          className={svgStyles.axisLabel}
        >
          {`bolas en ${labels[0]}`}
        </text>
        <text
          transform={`translate(${left - 34},${inner.top + side / 2}) rotate(-90)`}
          textAnchor="middle"
          className={svgStyles.axisLabel}
        >
          {`bolas en ${labels[1]}`}
        </text>
      </g>
    </g>
  );
}
