import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { ballPath } from './balls.ts';
import { DraggableVector } from '../../core/svg/DraggableVector.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { Vec2 } from './schema.ts';
import { useVectors } from './useVectors.ts';
import { pNorm, vecText } from './vectors.ts';
import styles from './VectorPlane.module.css';

/** Values of p visited by the animation; the last one stands for infinity. */
const P_VALUES = [1, 1.25, 1.5, 2, 3, 4, 6, 10, Infinity] as const;
const P_PER_SECOND = 1;

const pText = (p: number) => (Number.isFinite(p) ? formatNumber(p, 2) : '∞');

interface NormsViewProps {
  title: string;
  point: Vec2;
  p: number;
}

/**
 * The same vector measured with different norms. Each curve is the set of
 * vectors with the same norm as x, so x lies on all of them; the animation
 * morphs the ball from the diamond of p = 1 through the circle of p = 2 to
 * the square of p = infinity.
 */
export function NormsView({ title, point, p }: NormsViewProps) {
  const initial = useMemo(() => [point], [point]);
  const { vectors, set, reset } = useVectors(initial);
  const [x = point] = vectors;
  const startIndex = Math.max(
    0,
    P_VALUES.findIndex((value) => value >= p),
  );
  const [index, setIndex] = useState(startIndex);
  const playback = usePlayback({
    step: () => setIndex((value) => (value + 1) % P_VALUES.length),
    reset: () => {
      setIndex(startIndex);
      reset();
    },
    rate: P_PER_SECOND,
  });
  const current = P_VALUES[index] ?? 2;
  const norms = [1, 2, Infinity].map((value) => pNorm(x, value));
  const description =
    `x = ${vecText(x)}. Norma 1: ${formatNumber(norms[0] ?? 0, 3)}, norma 2: ${formatNumber(norms[1] ?? 0, 3)}, ` +
    `norma infinito: ${formatNumber(norms[2] ?? 0, 3)}; con p = ${pText(current)} vale ${formatNumber(pNorm(x, current), 3)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        {
          label: '‖x‖₁ = |x₁| + |x₂|',
          value: formatNumber(norms[0] ?? 0, 3),
          color: seriesColor(0),
        },
        {
          label: '‖x‖₂ = raíz de x₁² + x₂²',
          value: formatNumber(norms[1] ?? 0, 3),
          color: seriesColor(1),
        },
        { label: '‖x‖∞ = máx |xᵢ|', value: formatNumber(norms[2] ?? 0, 3), color: seriesColor(2) },
        {
          label: `‖x‖ con p = ${pText(current)}`,
          value: formatNumber(pNorm(x, current), 3),
          color: DATA_COLORS.highlight,
        },
      ]}
      legend={[
        { label: 'Vectores con la misma norma 1', color: seriesColor(0), shape: 'line' },
        { label: 'Misma norma 2', color: seriesColor(1), shape: 'line' },
        { label: 'Misma norma infinito', color: seriesColor(2), shape: 'line' },
        {
          label: `Bola unitaria con p = ${pText(current)}`,
          color: DATA_COLORS.highlight,
          shape: 'line',
        },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\|x\\|_p = \\left(|x_1|^p + |x_2|^p\\right)^{1/p},\\qquad p = ${Number.isFinite(current) ? formatNumber(current, 2) : '\\infty'}`}
        />
      </p>
      <CartesianPlane extent={6} label={description} interactive>
        {(plane) => (
          <>
            <g aria-hidden="true">
              {[1, 2, Infinity].map((value, position) => (
                <polyline
                  key={value}
                  points={ballPath(plane, value, pNorm(x, value))}
                  fill="none"
                  stroke={seriesColor(position)}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />
              ))}
              <polyline
                points={ballPath(plane, current, 1)}
                fill={DATA_COLORS.highlight}
                fillOpacity={0.2}
                stroke={DATA_COLORS.highlight}
                strokeWidth={2.5}
              />
            </g>
            <DraggableVector
              plane={plane}
              value={x}
              onChange={(value) => set(0, value)}
              color={DATA_COLORS.primary}
              label="x"
              handleLabel="Punta del vector x"
            />
          </>
        )}
      </CartesianPlane>
    </VizFrame>
  );
}
