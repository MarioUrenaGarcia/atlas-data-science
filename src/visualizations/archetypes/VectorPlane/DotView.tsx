import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { DraggableVector } from '../../core/svg/DraggableVector.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { VectorArrow } from '../../core/svg/VectorArrow.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { Vec2 } from './schema.ts';
import { useVectors } from './useVectors.ts';
import { angleDegrees, dot, length, scale, vecText } from './vectors.ts';
import styles from './VectorPlane.module.css';

/** Rotation of v in each animation step, in degrees. */
const TURN = 10;
const TURNS_PER_SECOND = 3;
const ARC_RADIUS = 0.8;
const ORTHOGONAL_TOLERANCE = 1e-9;

interface DotViewProps {
  title: string;
  u: Vec2;
  v: Vec2;
}

function rotate(vector: Vec2, degrees: number): Vec2 {
  const angle = (degrees * Math.PI) / 180;
  return [
    vector[0] * Math.cos(angle) - vector[1] * Math.sin(angle),
    vector[0] * Math.sin(angle) + vector[1] * Math.cos(angle),
  ];
}

/**
 * Dot product as length of u times the signed length of the shadow of v on u.
 * The animation turns v around the origin: the product is positive while the
 * angle is acute, zero at a right angle and negative when it is obtuse.
 */
export function DotView({ title, u, v }: DotViewProps) {
  const initial = useMemo(() => [u, v], [u, v]);
  const { vectors, set, reset } = useVectors(initial);
  const [a = u, base = v] = vectors;
  const [turn, setTurn] = useState(0);
  const playback = usePlayback({
    step: () => setTurn((value) => (value + TURN) % 360),
    reset: () => {
      setTurn(0);
      reset();
    },
    rate: TURNS_PER_SECOND,
    autoplay: false,
  });
  const b = rotate(base, turn);
  const product = dot(a, b);
  const lengthA = length(a);
  const lengthB = length(b);
  const cosine = lengthA === 0 || lengthB === 0 ? 0 : product / (lengthA * lengthB);
  const angle = lengthA === 0 || lengthB === 0 ? 0 : angleDegrees(a, b);
  const foot = lengthA === 0 ? a : scale(a, product / (lengthA * lengthA));
  const kind =
    Math.abs(product) < ORTHOGONAL_TOLERANCE
      ? 'ortogonales (ángulo recto)'
      : product > 0
        ? 'ángulo agudo'
        : 'ángulo obtuso';
  const color =
    Math.abs(product) < ORTHOGONAL_TOLERANCE
      ? DATA_COLORS.muted
      : product > 0
        ? DATA_COLORS.tertiary
        : DATA_COLORS.negative;
  const description =
    `u = ${vecText(a)}, v = ${vecText(b)}. Producto punto ${formatNumber(product, 3)}, ángulo ${formatNumber(angle, 1)} grados, ` +
    `similitud coseno ${formatNumber(cosine, 3)}: ${kind}.`;
  const startAngle = Math.atan2(a[1], a[0]);
  const endAngle = Math.atan2(b[1], b[0]);
  let sweep = endAngle - startAngle;
  if (sweep > Math.PI) sweep -= 2 * Math.PI;
  if (sweep < -Math.PI) sweep += 2 * Math.PI;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'u · v', value: formatNumber(product, 3), color },
        {
          label: '‖u‖ ‖v‖ cos θ',
          value: `${formatNumber(lengthA, 2)} · ${formatNumber(lengthB, 2)} · ${formatNumber(cosine, 3)}`,
        },
        { label: 'Ángulo θ', value: `${formatNumber(angle, 1)} grados` },
        { label: 'Similitud coseno', value: formatNumber(cosine, 3) },
        { label: 'Relación', value: kind },
      ]}
      legend={[
        { label: 'Sombra de v sobre la recta de u', color, shape: 'line' },
        { label: 'Perpendicular a u', color: DATA_COLORS.muted, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`u \\cdot v = u_1 v_1 + u_2 v_2 = ${formatNumber(a[0], 2)}\\cdot${formatNumber(b[0], 2)} + ${formatNumber(a[1], 2)}\\cdot${formatNumber(b[1], 2)} = ${formatNumber(product, 3)}`}
        />
      </p>
      <CartesianPlane extent={6} label={description} interactive>
        {(plane) => {
          const arcPoint = (angleValue: number) => [
            plane.x(ARC_RADIUS * Math.cos(angleValue)),
            plane.y(ARC_RADIUS * Math.sin(angleValue)),
          ];
          const steps = 24;
          const arc = Array.from({ length: steps + 1 }, (_, index) =>
            arcPoint(startAngle + (sweep * index) / steps),
          );
          return (
            <>
              <g aria-hidden="true">
                <line
                  x1={plane.x(-a[0] * 20)}
                  y1={plane.y(-a[1] * 20)}
                  x2={plane.x(a[0] * 20)}
                  y2={plane.y(a[1] * 20)}
                  stroke="var(--color-border)"
                  strokeDasharray="3 4"
                />
                <line
                  x1={plane.x(b[0])}
                  y1={plane.y(b[1])}
                  x2={plane.x(foot[0])}
                  y2={plane.y(foot[1])}
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="5 4"
                />
                <line
                  x1={plane.x(0)}
                  y1={plane.y(0)}
                  x2={plane.x(foot[0])}
                  y2={plane.y(foot[1])}
                  stroke={color}
                  strokeWidth={7}
                  strokeOpacity={0.45}
                  strokeLinecap="round"
                />
                <polyline
                  points={arc.map(([px, py]) => `${px},${py}`).join(' ')}
                  fill="none"
                  stroke={DATA_COLORS.highlight}
                  strokeWidth={2}
                />
                <text
                  x={arcPoint(startAngle + sweep / 2)[0]}
                  y={arcPoint(startAngle + sweep / 2)[1]}
                  dy="-0.4em"
                  textAnchor="middle"
                  className={svgStyles.label}
                >
                  θ
                </text>
              </g>
              <DraggableVector
                plane={plane}
                value={a}
                onChange={(value) => set(0, value)}
                color={DATA_COLORS.primary}
                label="u"
                handleLabel="Punta del vector u"
              />
              {turn === 0 ? (
                <DraggableVector
                  plane={plane}
                  value={b}
                  onChange={(value) => set(1, value)}
                  color={DATA_COLORS.secondary}
                  label="v"
                  handleLabel="Punta del vector v"
                />
              ) : (
                <VectorArrow plane={plane} to={b} color={DATA_COLORS.secondary} label="v" />
              )}
            </>
          );
        }}
      </CartesianPlane>
    </VizFrame>
  );
}
