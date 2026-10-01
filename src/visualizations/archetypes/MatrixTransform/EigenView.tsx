import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { VectorArrow } from '../../core/svg/VectorArrow.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { apply, eigen, eigenText, matLatex, svd2, vecText, type Vec2 } from './matrix2.ts';
import styles from './MatrixTransform.module.css';
import { useMatrixChoice, type NamedMatrix } from './useMatrixChoice.ts';

const STEPS_PER_TURN = 180;
const STEPS_PER_SECOND = 30;
const TRACE_SAMPLES = 120;
/** The plane shows the image of the unit circle with some margin, but never less than this. */
const MIN_EXTENT = 1.6;
const EXTENT_MARGIN = 1.25;
/**
 * v moves in steps of 360 / STEPS_PER_TURN degrees, so it always passes within
 * half a step of each eigen direction; that is the tolerance for "parallel".
 */
const PARALLEL_TOLERANCE = Math.sin((Math.PI / STEPS_PER_TURN) * 1.01);

interface EigenViewProps {
  title: string;
  matrices: readonly NamedMatrix[];
}

/**
 * A unit vector v turns around the circle while Av is drawn next to it.
 * Most of the time Av points somewhere else; at the eigenvector directions
 * the two arrows line up and the ratio of their lengths is the eigenvalue.
 * The curve traced by Av is the image of the unit circle.
 */
export function EigenView({ title, matrices }: EigenViewProps) {
  const { parameters, values, matrix } = useMatrixChoice(matrices);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => (value + 1) % STEPS_PER_TURN),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
  });
  const angle = (2 * Math.PI * step) / STEPS_PER_TURN;
  const v: Vec2 = [Math.cos(angle), Math.sin(angle)];
  const image = apply(matrix, v);
  const { real, imaginary, vectors } = eigen(matrix);
  const matchIndex =
    vectors?.findIndex(
      (e) => Math.abs(v[0] * (e[1] ?? 0) - v[1] * (e[0] ?? 0)) < PARALLEL_TOLERANCE,
    ) ?? -1;
  const parallel = matchIndex >= 0;
  const ratio = matchIndex >= 0 ? (real[matchIndex] ?? 0) : v[0] * image[0] + v[1] * image[1];
  const extent = Math.max(MIN_EXTENT, svd2(matrix).sigma[0] * EXTENT_MARGIN);
  const traceCurve = Array.from({ length: TRACE_SAMPLES + 1 }, (_, index) => {
    const theta = (2 * Math.PI * index) / TRACE_SAMPLES;
    return apply(matrix, [Math.cos(theta), Math.sin(theta)]);
  });
  const description =
    `v = ${vecText(v)}, A v = ${vecText(image)}. ` +
    (parallel
      ? `v es vector propio: A v = ${formatNumber(ratio, 2)} v.`
      : 'A v no es paralelo a v.') +
    ` Valores propios de A: ${eigenText(matrix)}.` +
    (imaginary[0] !== 0 ? ' Son complejos: ninguna dirección real se conserva.' : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Ángulo de v', value: `${formatNumber((angle * 180) / Math.PI, 0)}°` },
        { label: 'v', value: vecText(v), color: DATA_COLORS.primary },
        {
          label: 'A v',
          value: vecText(image),
          color: parallel ? DATA_COLORS.highlight : DATA_COLORS.secondary,
        },
        { label: '¿Paralelos?', value: parallel ? `sí, λ ≈ ${formatNumber(ratio, 2)}` : 'no' },
        { label: 'Valores propios', value: eigenText(matrix) },
      ]}
      legend={[
        { label: 'v (unitario)', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'A v', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'A v paralelo a v', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Recorrido de A v', color: DATA_COLORS.tertiary, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`\\mathbf{A} = ${matLatex(matrix)},\\qquad \\mathbf{A}\\mathbf{v} = \\lambda \\mathbf{v}`} />
      </p>
      <CartesianPlane extent={extent} label={description}>
        {(plane) => (
          <>
            <g aria-hidden="true">
              <circle
                cx={plane.x(0)}
                cy={plane.y(0)}
                r={plane.unit}
                fill="none"
                stroke={DATA_COLORS.muted}
                strokeDasharray="3 4"
              />
              <polyline
                points={traceCurve.map((p) => `${plane.x(p[0])},${plane.y(p[1])}`).join(' ')}
                fill="none"
                stroke={DATA_COLORS.tertiary}
                strokeWidth={2}
                strokeDasharray="6 4"
              />
            </g>
            <VectorArrow
              plane={plane}
              to={image}
              color={parallel ? DATA_COLORS.highlight : DATA_COLORS.secondary}
              label="A v"
              width={parallel ? 4 : 3}
            />
            <VectorArrow plane={plane} to={v} color={DATA_COLORS.primary} label="v" width={3} />
          </>
        )}
      </CartesianPlane>
    </VizFrame>
  );
}
