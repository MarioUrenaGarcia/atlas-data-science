import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { DraggableVector } from '../../core/svg/DraggableVector.tsx';
import { VectorArrow } from '../../core/svg/VectorArrow.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { Vec2 } from './schema.ts';
import { useVectors } from './useVectors.ts';
import { add, cross, scale, vecLatex, vecText } from './vectors.ts';
import styles from './VectorPlane.module.css';

/** Largest |a| + |b| of the integer combinations drawn as dots. */
const MAX_RING = 8;
const RINGS_PER_SECOND = 1.5;
const DEPENDENT_TOLERANCE = 1e-9;

interface CombinationViewProps {
  title: string;
  v1: Vec2;
  v2: Vec2;
  coefficients: [number, number];
}

/**
 * Linear combinations a v1 + b v2. The sliders build one combination tip to
 * tail, and the animation adds the integer combinations ring by ring: with
 * independent vectors they spread over the whole plane, and with dependent
 * ones they stay on a single line, the span.
 */
export function CombinationView({ title, v1, v2, coefficients }: CombinationViewProps) {
  const initial = useMemo(() => [v1, v2], [v1, v2]);
  const { vectors, set, reset } = useVectors(initial);
  const [p = v1, q = v2] = vectors;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'a',
        label: 'Coeficiente de v₁',
        symbol: 'a',
        min: -3,
        max: 3,
        step: 0.25,
        default: coefficients[0],
        digits: 2,
      },
      {
        type: 'number' as const,
        key: 'b',
        label: 'Coeficiente de v₂',
        symbol: 'b',
        min: -3,
        max: 3,
        step: 0.25,
        default: coefficients[1],
        digits: 2,
      },
    ],
    [coefficients],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const a = Number(values.a);
  const b = Number(values.b);
  const [ring, setRing] = useState(0);
  const playback = usePlayback({
    step: () => setRing((value) => Math.min(MAX_RING, value + 1)),
    reset: () => {
      setRing(0);
      reset();
    },
    rate: RINGS_PER_SECOND,
    done: ring >= MAX_RING,
  });
  const partA = scale(p, a);
  const result = add(partA, scale(q, b));
  const determinant = cross(p, q);
  const independent = Math.abs(determinant) > DEPENDENT_TOLERANCE;
  const lattice: Vec2[] = [];
  for (let i = -MAX_RING; i <= MAX_RING; i += 1) {
    for (let j = -MAX_RING; j <= MAX_RING; j += 1) {
      if (Math.abs(i) + Math.abs(j) <= ring) lattice.push(add(scale(p, i), scale(q, j)));
    }
  }
  const spanText = independent
    ? 'todo el plano'
    : p[0] === 0 && p[1] === 0 && q[0] === 0 && q[1] === 0
      ? 'solo el origen'
      : 'una recta';
  const description =
    `v₁ = ${vecText(p)}, v₂ = ${vecText(q)}. La combinación ${formatNumber(a, 2)} v₁ + ${formatNumber(b, 2)} v₂ = ${vecText(result)}. ` +
    `Los vectores son ${independent ? 'independientes' : 'dependientes'} y generan ${spanText}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'a v₁ + b v₂', value: vecText(result), color: DATA_COLORS.highlight },
        { label: 'Determinante de (v₁ v₂)', value: formatNumber(determinant, 3) },
        { label: 'Independientes', value: independent ? 'sí' : 'no', color: DATA_COLORS.primary },
        { label: 'Espacio generado', value: spanText, color: DATA_COLORS.tertiary },
      ]}
      legend={[
        {
          label: 'Combinaciones con coeficientes enteros',
          color: DATA_COLORS.tertiary,
          shape: 'circle',
        },
        { label: 'Combinación elegida', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`${formatNumber(a, 2)}\\,${vecLatex(p)} + ${formatNumber(b, 2)}\\,${vecLatex(q)} = ${vecLatex(result)}`}
        />
      </p>
      <CartesianPlane extent={7} label={description} interactive>
        {(plane) => (
          <>
            {!independent &&
              (p[0] !== 0 || p[1] !== 0 || q[0] !== 0 || q[1] !== 0) &&
              (() => {
                const direction = p[0] !== 0 || p[1] !== 0 ? p : q;
                const far = 40;
                return (
                  <line
                    x1={plane.x(-direction[0] * far)}
                    y1={plane.y(-direction[1] * far)}
                    x2={plane.x(direction[0] * far)}
                    y2={plane.y(direction[1] * far)}
                    stroke={DATA_COLORS.tertiary}
                    strokeWidth={6}
                    strokeOpacity={0.25}
                    aria-hidden="true"
                  />
                );
              })()}
            <g aria-hidden="true">
              {lattice.map((point, index) => (
                <circle
                  key={index}
                  cx={plane.x(point[0])}
                  cy={plane.y(point[1])}
                  r={3.5}
                  fill={DATA_COLORS.tertiary}
                  fillOpacity={0.7}
                />
              ))}
            </g>
            <VectorArrow plane={plane} to={partA} color={DATA_COLORS.primary} dashed />
            <VectorArrow
              plane={plane}
              from={partA}
              to={result}
              color={DATA_COLORS.secondary}
              dashed
            />
            <VectorArrow
              plane={plane}
              to={result}
              color={DATA_COLORS.highlight}
              label="a v₁ + b v₂"
              width={3}
            />
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
