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
import { dot, length, roundOff, scale, sub, vecText } from './vectors.ts';
import styles from './VectorPlane.module.css';

const STEPS = [
  'Se parte de dos vectores independientes v₁ y v₂.',
  'Paso 1: q₁ = v₁ / ‖v₁‖, el vector v₁ reducido a longitud 1.',
  'Paso 2: se calcula la sombra de v₂ sobre q₁, (v₂ · q₁) q₁.',
  'Paso 3: w₂ = v₂ menos esa sombra; lo que queda es ortogonal a q₁.',
  'Paso 4: q₂ = w₂ / ‖w₂‖. Los vectores q₁ y q₂ son ortonormales y generan lo mismo que v₁ y v₂.',
] as const;
const STEPS_PER_SECOND = 0.4;

interface GramSchmidtViewProps {
  title: string;
  v1: Vec2;
  v2: Vec2;
}

/** The Gram-Schmidt process in the plane, one operation per step. */
export function GramSchmidtView({ title, v1, v2 }: GramSchmidtViewProps) {
  const initial = useMemo(() => [v1, v2], [v1, v2]);
  const { vectors, set, reset } = useVectors(initial);
  const [p = v1, q = v2] = vectors;
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS.length - 1, value + 1)),
    reset: () => {
      setStep(0);
      reset();
    },
    rate: STEPS_PER_SECOND,
    done: step >= STEPS.length - 1,
  });
  const q1 = length(p) === 0 ? ([0, 0] as Vec2) : scale(p, 1 / length(p));
  const shadow = scale(q1, dot(q, q1));
  const w2 = sub(q, shadow);
  const q2 = length(w2) === 0 ? ([0, 0] as Vec2) : scale(w2, 1 / length(w2));
  const description = `${STEPS[step]} q₁ = ${vecText(q1, 3)}, w₂ = ${vecText(w2)}, q₂ = ${vecText(q2, 3)}; q₁ · q₂ = ${formatNumber(roundOff(dot(q1, q2)), 6)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'q₁', value: vecText(q1, 3), color: DATA_COLORS.tertiary },
        { label: 'v₂ · q₁', value: formatNumber(dot(q, q1), 3) },
        { label: 'w₂', value: vecText(w2), color: DATA_COLORS.quaternary },
        { label: 'q₂', value: vecText(q2, 3), color: DATA_COLORS.highlight },
        { label: 'q₁ · q₂', value: formatNumber(roundOff(dot(q1, q2)), 6) },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex="q_1 = \frac{v_1}{\|v_1\|},\qquad w_2 = v_2 - (v_2 \cdot q_1)\,q_1,\qquad q_2 = \frac{w_2}{\|w_2\|}" />
      </p>
      <p className={styles.stage}>{STEPS[step]}</p>
      <CartesianPlane extent={5} label={description} interactive>
        {(plane) => (
          <>
            {step >= 1 && (
              <VectorArrow
                plane={plane}
                to={q1}
                color={DATA_COLORS.tertiary}
                label="q₁"
                width={4}
              />
            )}
            {step >= 2 && (
              <VectorArrow plane={plane} to={shadow} color={DATA_COLORS.muted} dashed />
            )}
            {step >= 2 && step < 4 && (
              <line
                x1={plane.x(q[0])}
                y1={plane.y(q[1])}
                x2={plane.x(shadow[0])}
                y2={plane.y(shadow[1])}
                stroke={DATA_COLORS.muted}
                strokeDasharray="4 3"
                aria-hidden="true"
              />
            )}
            {step >= 3 && (
              <VectorArrow
                plane={plane}
                to={w2}
                color={DATA_COLORS.quaternary}
                label="w₂"
                width={3}
              />
            )}
            {step >= 4 && (
              <VectorArrow
                plane={plane}
                to={q2}
                color={DATA_COLORS.highlight}
                label="q₂"
                width={4}
              />
            )}
            <DraggableVector
              plane={plane}
              value={p}
              onChange={(value) => set(0, value)}
              color={DATA_COLORS.primary}
              label="v₁"
              handleLabel="Punta de v₁"
            />
            <DraggableVector
              plane={plane}
              value={q}
              onChange={(value) => set(1, value)}
              color={DATA_COLORS.secondary}
              label="v₂"
              handleLabel="Punta de v₂"
            />
          </>
        )}
      </CartesianPlane>
    </VizFrame>
  );
}
