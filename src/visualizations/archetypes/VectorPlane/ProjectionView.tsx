import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { DraggableVector } from '../../core/svg/DraggableVector.tsx';
import { VectorArrow } from '../../core/svg/VectorArrow.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { Vec2 } from './schema.ts';
import { useVectors } from './useVectors.ts';
import { add, dot, length, roundOff, scale, sub, vecText } from './vectors.ts';
import styles from './VectorPlane.module.css';

const FRAMES = 30;
const FRAMES_PER_SECOND = 20;
const RIGHT_ANGLE = 0.3;

interface ProjectionViewProps {
  title: string;
  a: Vec2;
  b: Vec2;
}

/**
 * Orthogonal projection of b onto the line spanned by a. The tip of b falls
 * perpendicularly onto the line; what remains, the residual b - p, is
 * orthogonal to a, and p is the point of the line closest to b.
 */
export function ProjectionView({ title, a, b }: ProjectionViewProps) {
  const initial = useMemo(() => [a, b], [a, b]);
  const { vectors, set, reset } = useVectors(initial);
  const [u = a, w = b] = vectors;
  const [frame, setFrame] = useState(0);
  const playback = usePlayback({
    step: () => setFrame((value) => Math.min(FRAMES, value + 1)),
    reset: () => {
      setFrame(0);
      reset();
    },
    rate: FRAMES_PER_SECOND,
    done: frame >= FRAMES,
  });
  const squared = dot(u, u);
  const coefficient = squared === 0 ? 0 : dot(u, w) / squared;
  const projection = scale(u, coefficient);
  const residual = sub(w, projection);
  const t = frame / FRAMES;
  const falling = add(w, scale(sub(projection, w), t));
  const description =
    `a = ${vecText(u)}, b = ${vecText(w)}. Proyección p = ${vecText(projection)}, coeficiente ${formatNumber(coefficient, 3)}; ` +
    `residuo b - p = ${vecText(residual)}, con a · (b - p) = ${formatNumber(roundOff(dot(u, residual)), 6)}.`;
  const unitA = length(u) === 0 ? ([0, 0] as Vec2) : scale(u, 1 / length(u));
  const unitR = length(residual) === 0 ? ([0, 0] as Vec2) : scale(residual, 1 / length(residual));

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Coeficiente (a · b)/(a · a)', value: formatNumber(coefficient, 3) },
        { label: 'Proyección p', value: vecText(projection), color: DATA_COLORS.highlight },
        { label: 'Residuo b - p', value: vecText(residual), color: DATA_COLORS.negative },
        { label: 'a · (b - p)', value: formatNumber(roundOff(dot(u, residual)), 6) },
        { label: 'Distancia de b a la recta', value: formatNumber(length(residual), 3) },
      ]}
      legend={[
        { label: 'Recta generada por a', color: DATA_COLORS.muted, shape: 'dashed' },
        { label: 'Proyección', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Residuo', color: DATA_COLORS.negative, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`p = \\frac{a \\cdot b}{a \\cdot a}\\,a = ${formatNumber(coefficient, 3)}\\,a`}
        />
      </p>
      <CartesianPlane extent={6} label={description} interactive>
        {(plane) => {
          const corner = add(
            add(projection, scale(unitA, -RIGHT_ANGLE * Math.sign(coefficient || 1))),
            scale(unitR, RIGHT_ANGLE),
          );
          const cornerA = add(projection, scale(unitA, -RIGHT_ANGLE * Math.sign(coefficient || 1)));
          const cornerR = add(projection, scale(unitR, RIGHT_ANGLE));
          return (
            <>
              <g aria-hidden="true">
                <line
                  x1={plane.x(-u[0] * 20)}
                  y1={plane.y(-u[1] * 20)}
                  x2={plane.x(u[0] * 20)}
                  y2={plane.y(u[1] * 20)}
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="6 5"
                />
                <line
                  x1={plane.x(w[0])}
                  y1={plane.y(w[1])}
                  x2={plane.x(falling[0])}
                  y2={plane.y(falling[1])}
                  stroke={DATA_COLORS.negative}
                  strokeWidth={2.5}
                  strokeDasharray={frame >= FRAMES ? undefined : '4 3'}
                />
                <circle
                  cx={plane.x(falling[0])}
                  cy={plane.y(falling[1])}
                  r={5}
                  fill={DATA_COLORS.highlight}
                />
                {frame >= FRAMES && length(residual) > 0 && (
                  <polyline
                    points={`${plane.x(cornerA[0])},${plane.y(cornerA[1])} ${plane.x(corner[0])},${plane.y(corner[1])} ${plane.x(cornerR[0])},${plane.y(cornerR[1])}`}
                    fill="none"
                    stroke="var(--color-text)"
                  />
                )}
              </g>
              {frame >= FRAMES && (
                <VectorArrow
                  plane={plane}
                  to={projection}
                  color={DATA_COLORS.highlight}
                  label="p"
                  width={4}
                />
              )}
              <DraggableVector
                plane={plane}
                value={u}
                onChange={(value) => set(0, value)}
                color={DATA_COLORS.primary}
                label="a"
                handleLabel="Punta del vector a"
              />
              <DraggableVector
                plane={plane}
                value={w}
                onChange={(value) => set(1, value)}
                color={DATA_COLORS.secondary}
                label="b"
                handleLabel="Punta del vector b"
              />
            </>
          );
        }}
      </CartesianPlane>
    </VizFrame>
  );
}
