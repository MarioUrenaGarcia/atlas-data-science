import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { DraggablePoint } from '../../core/svg/DraggablePoint.tsx';
import { DraggableVector } from '../../core/svg/DraggableVector.tsx';
import { VectorArrow } from '../../core/svg/VectorArrow.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { Vec2 } from './schema.ts';
import { useVectors } from './useVectors.ts';
import { add, cross, scale, vecLatex, vecText } from './vectors.ts';
import styles from './VectorPlane.module.css';

const FRAMES = 40;
const FRAMES_PER_SECOND = 20;
const GRID_LINES = 12;
const SNAP = 0.25;

interface BasisChangeViewProps {
  title: string;
  b1: Vec2;
  b2: Vec2;
  point: Vec2;
}

/**
 * The same point described in two bases. The standard grid bends into the
 * grid of the new basis, whose lines are the integer multiples of b1 and b2;
 * the new coordinates say how many steps along b1 and along b2 reach the point.
 */
export function BasisChangeView({ title, b1, b2, point }: BasisChangeViewProps) {
  const initial = useMemo(() => [b1, b2, point], [b1, b2, point]);
  const { vectors, set, reset } = useVectors(initial);
  const [e1 = b1, e2 = b2, x = point] = vectors;
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
  const det = cross(e1, e2);
  const valid = Math.abs(det) > 1e-9;
  // Coordinates in the new basis solve c1 b1 + c2 b2 = x (Cramer's rule).
  const c1 = valid ? cross(x, e2) / det : 0;
  const c2 = valid ? cross(e1, x) / det : 0;
  const t = frame / FRAMES;
  const blend = (standard: Vec2, target: Vec2): Vec2 =>
    add(scale(standard, 1 - t), scale(target, t));
  const g1 = blend([1, 0], e1);
  const g2 = blend([0, 1], e2);
  const description = valid
    ? `En la base estándar el punto es ${vecText(x)}; en la base b₁ = ${vecText(e1)}, b₂ = ${vecText(e2)} sus coordenadas son ${vecText([c1, c2])}.`
    : 'b₁ y b₂ son paralelos: no forman una base del plano.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Coordenadas estándar', value: vecText(x) },
        {
          label: 'Coordenadas en la base nueva',
          value: valid ? vecText([c1, c2]) : 'no es base',
          color: DATA_COLORS.highlight,
        },
        { label: 'Determinante de (b₁ b₂)', value: formatNumber(det, 3) },
      ]}
      legend={[
        { label: 'Rejilla de la base nueva', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'c₁ b₁ + c₂ b₂', color: DATA_COLORS.highlight, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`x = c_1 b_1 + c_2 b_2,\\qquad [x]_B = ${valid ? vecLatex([c1, c2]) : '\\text{no definido}'}`}
        />
      </p>
      <CartesianPlane extent={6} label={description} interactive grid={false}>
        {(plane) => (
          <>
            <g aria-hidden="true">
              {Array.from({ length: 2 * GRID_LINES + 1 }, (_, index) => index - GRID_LINES).map(
                (k) => (
                  <g key={k}>
                    <line
                      x1={plane.x(g1[0] * k - g2[0] * GRID_LINES)}
                      y1={plane.y(g1[1] * k - g2[1] * GRID_LINES)}
                      x2={plane.x(g1[0] * k + g2[0] * GRID_LINES)}
                      y2={plane.y(g1[1] * k + g2[1] * GRID_LINES)}
                      stroke={DATA_COLORS.primary}
                      strokeOpacity={0.25}
                    />
                    <line
                      x1={plane.x(g2[0] * k - g1[0] * GRID_LINES)}
                      y1={plane.y(g2[1] * k - g1[1] * GRID_LINES)}
                      x2={plane.x(g2[0] * k + g1[0] * GRID_LINES)}
                      y2={plane.y(g2[1] * k + g1[1] * GRID_LINES)}
                      stroke={DATA_COLORS.secondary}
                      strokeOpacity={0.25}
                    />
                  </g>
                ),
              )}
            </g>
            {valid && frame >= FRAMES && (
              <>
                <VectorArrow
                  plane={plane}
                  to={scale(e1, c1)}
                  color={DATA_COLORS.highlight}
                  dashed
                />
                <VectorArrow
                  plane={plane}
                  from={scale(e1, c1)}
                  to={x}
                  color={DATA_COLORS.highlight}
                  dashed
                />
              </>
            )}
            <DraggableVector
              plane={plane}
              value={e1}
              onChange={(value) => set(0, value)}
              color={DATA_COLORS.primary}
              label="b₁"
              handleLabel="Punta de b₁"
            />
            <DraggableVector
              plane={plane}
              value={e2}
              onChange={(value) => set(1, value)}
              color={DATA_COLORS.secondary}
              label="b₂"
              handleLabel="Punta de b₂"
            />
            <DraggablePoint
              x={plane.x(x[0])}
              y={plane.y(x[1])}
              color={DATA_COLORS.text}
              label="Punto x"
              valueText={vecText(x)}
              step={plane.unit * SNAP}
              onDrag={(px, py) =>
                set(2, [
                  Math.round(plane.x.invert(px) / SNAP) * SNAP,
                  Math.round(plane.y.invert(py) / SNAP) * SNAP,
                ])
              }
            />
          </>
        )}
      </CartesianPlane>
    </VizFrame>
  );
}
