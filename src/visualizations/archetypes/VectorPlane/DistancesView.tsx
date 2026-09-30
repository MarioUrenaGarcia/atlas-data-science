import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { DraggablePoint } from '../../core/svg/DraggablePoint.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { ballPath } from './balls.ts';
import type { Vec2 } from './schema.ts';
import { useVectors } from './useVectors.ts';
import { pNorm, sub, vecText } from './vectors.ts';
import { distanceFormula } from './stageFormulas.ts';
import styles from './VectorPlane.module.css';

const METRICS = [
  { key: 'manhattan', p: 1, label: 'Manhattan' },
  { key: 'euclidiana', p: 2, label: 'Euclidiana' },
  { key: 'chebyshev', p: Infinity, label: 'Chebyshev' },
  { key: 'minkowski', p: 0, label: 'Minkowski' },
] as const;
const METRICS_PER_SECOND = 0.5;
const SNAP = 0.25;

interface DistancesViewProps {
  title: string;
  a: Vec2;
  b: Vec2;
  p: number;
}

/**
 * Distances between two points: walking along the grid (Manhattan), in a
 * straight line (Euclidean) or counting only the largest coordinate change
 * (Chebyshev). Around A, the curve of points at the same distance as B has
 * the shape of the ball of each metric.
 */
export function DistancesView({ title, a, b, p }: DistancesViewProps) {
  const initial = useMemo(() => [a, b], [a, b]);
  const { vectors, set, reset } = useVectors(initial);
  const [pa = a, pb = b] = vectors;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'p',
        label: 'Exponente de Minkowski',
        symbol: 'p',
        min: 1,
        max: 10,
        step: 0.25,
        default: p,
        digits: 2,
      },
    ],
    [p],
  );
  const parameters = useParameters(definitions);
  const pMinkowski = Number((parameters.values as Record<string, number>).p);
  const [index, setIndex] = useState(0);
  const playback = usePlayback({
    step: () => setIndex((value) => (value + 1) % METRICS.length),
    reset: () => {
      setIndex(0);
      reset();
    },
    rate: METRICS_PER_SECOND,
  });
  const difference = sub(pb, pa);
  const exponent = (metric: (typeof METRICS)[number]) =>
    metric.key === 'minkowski' ? pMinkowski : metric.p;
  const distances = METRICS.map((metric) => pNorm(difference, exponent(metric)));
  const active = METRICS[index] ?? METRICS[0];
  const description =
    `A = ${vecText(pa)}, B = ${vecText(pb)}. ` +
    METRICS.map(
      (metric, position) => `${metric.label}: ${formatNumber(distances[position] ?? 0, 3)}`,
    ).join('; ') +
    `, con p = ${formatNumber(pMinkowski, 2)} para Minkowski.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={METRICS.map((metric, position) => ({
        label:
          metric.key === 'minkowski'
            ? `Minkowski (p = ${formatNumber(pMinkowski, 2)})`
            : metric.label,
        value: formatNumber(distances[position] ?? 0, 3),
        color: seriesColor(position),
      }))}
      legend={METRICS.map((metric, position) => ({
        label: metric.label,
        color: seriesColor(position),
        shape: 'line' as const,
      }))}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={distanceFormula(active.key, pa, pb, pMinkowski, distances[index] ?? 0)} />
      </p>
      <p className={styles.stage}>Resaltada: distancia {active.label}.</p>
      <CartesianPlane extent={6} label={description} interactive>
        {(plane) => {
          const highlight = (position: number) => (METRICS[position] === active ? 1 : 0.35);
          const corner: Vec2 = [pb[0], pa[1]];
          const bigger = Math.abs(difference[0]) >= Math.abs(difference[1]) ? 0 : 1;
          return (
            <>
              <g aria-hidden="true">
                {METRICS.map((metric, position) => (
                  <polyline
                    key={metric.key}
                    points={ballPath(plane, exponent(metric), distances[position] ?? 0)
                      .split(' ')
                      .map((pair) => {
                        const [px = 0, py = 0] = pair.split(',').map(Number);
                        return `${px + plane.x(pa[0]) - plane.x(0)},${py + plane.y(pa[1]) - plane.y(0)}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke={seriesColor(position)}
                    strokeWidth={METRICS[position] === active ? 2.5 : 1.2}
                    strokeOpacity={highlight(position)}
                  />
                ))}
                <polyline
                  points={`${plane.x(pa[0])},${plane.y(pa[1])} ${plane.x(corner[0])},${plane.y(corner[1])} ${plane.x(pb[0])},${plane.y(pb[1])}`}
                  fill="none"
                  stroke={seriesColor(0)}
                  strokeWidth={4}
                  strokeOpacity={highlight(0)}
                />
                <line
                  x1={plane.x(pa[0])}
                  y1={plane.y(pa[1])}
                  x2={plane.x(pb[0])}
                  y2={plane.y(pb[1])}
                  stroke={seriesColor(1)}
                  strokeWidth={4}
                  strokeOpacity={highlight(1)}
                />
                {bigger === 0 ? (
                  <line
                    x1={plane.x(pa[0])}
                    y1={plane.y(pa[1]) + 6}
                    x2={plane.x(pb[0])}
                    y2={plane.y(pa[1]) + 6}
                    stroke={seriesColor(2)}
                    strokeWidth={4}
                    strokeOpacity={highlight(2)}
                  />
                ) : (
                  <line
                    x1={plane.x(pb[0]) + 6}
                    y1={plane.y(pa[1])}
                    x2={plane.x(pb[0]) + 6}
                    y2={plane.y(pb[1])}
                    stroke={seriesColor(2)}
                    strokeWidth={4}
                    strokeOpacity={highlight(2)}
                  />
                )}
                <text
                  x={plane.x(pa[0]) - 10}
                  y={plane.y(pa[1]) + 18}
                  className={svgStyles.label}
                  style={{ fontWeight: 700 }}
                >
                  A
                </text>
                <text
                  x={plane.x(pb[0]) + 10}
                  y={plane.y(pb[1]) - 10}
                  className={svgStyles.label}
                  style={{ fontWeight: 700 }}
                >
                  B
                </text>
              </g>
              {[pa, pb].map((point, position) => (
                <DraggablePoint
                  key={position}
                  x={plane.x(point[0])}
                  y={plane.y(point[1])}
                  color={DATA_COLORS.primary}
                  label={position === 0 ? 'Punto A' : 'Punto B'}
                  valueText={vecText(point)}
                  step={plane.unit * SNAP}
                  onDrag={(px, py) =>
                    set(position, [
                      Math.round(plane.x.invert(px) / SNAP) * SNAP,
                      Math.round(plane.y.invert(py) / SNAP) * SNAP,
                    ])
                  }
                />
              ))}
            </>
          );
        }}
      </CartesianPlane>
    </VizFrame>
  );
}
