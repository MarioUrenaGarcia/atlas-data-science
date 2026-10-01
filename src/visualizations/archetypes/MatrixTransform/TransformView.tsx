import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import {
  blend,
  determinant,
  eigen,
  eigenText,
  IDENTITY,
  matLatex,
  svd2,
  trace,
  vecText,
} from './matrix2.ts';
import styles from './MatrixTransform.module.css';
import { TransformedGrid } from './TransformedGrid.tsx';
import { useMatrixChoice, type NamedMatrix } from './useMatrixChoice.ts';

const FRAMES = 50;
const FRAMES_PER_SECOND = 25;
const FAR = 40;

interface TransformViewProps {
  title: string;
  matrices: readonly NamedMatrix[];
  showCircle: boolean;
  showEigen: boolean;
}

/**
 * A 2x2 matrix acting on the whole plane. The grid moves from the identity
 * to its image: the columns of A are where e1 and e2 land, the unit square
 * becomes a parallelogram of area |det A| (flipped when det A < 0), and the
 * eigenvector lines are the directions the map only stretches.
 */
export function TransformView({ title, matrices, showCircle, showEigen }: TransformViewProps) {
  const { parameters, values, matrix } = useMatrixChoice(matrices);
  const [frame, setFrame] = useState(0);
  const playback = usePlayback({
    step: () => setFrame((value) => Math.min(FRAMES, value + 1)),
    reset: () => setFrame(0),
    rate: FRAMES_PER_SECOND,
    done: frame >= FRAMES,
  });
  const t = frame / FRAMES;
  const current = blend(IDENTITY, matrix, t);
  const det = determinant(matrix);
  const decomposition = svd2(matrix);
  const { real, imaginary, vectors } = eigen(matrix);
  const condition =
    decomposition.sigma[1] > 1e-12 ? decomposition.sigma[0] / decomposition.sigma[1] : Infinity;
  const frobenius = Math.hypot(matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1]);
  const description =
    `A = ${matLatex(matrix).replace(/\\\\|\\begin\{pmatrix\}|\\end\{pmatrix\}|&/g, ' ')}. Columnas: A e₁ = ${vecText([matrix[0][0], matrix[1][0]])}, A e₂ = ${vecText([matrix[0][1], matrix[1][1]])}. ` +
    `Determinante ${formatNumber(det, 3)}, traza ${formatNumber(trace(matrix), 3)}, valores propios ${eigenText(matrix)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        {
          label: 'A e₁ (columna 1)',
          value: vecText([matrix[0][0], matrix[1][0]]),
          color: DATA_COLORS.primary,
        },
        {
          label: 'A e₂ (columna 2)',
          value: vecText([matrix[0][1], matrix[1][1]]),
          color: DATA_COLORS.secondary,
        },
        {
          label: 'det A (área con signo)',
          value: formatNumber(det, 3),
          color: det >= 0 ? DATA_COLORS.highlight : DATA_COLORS.negative,
        },
        { label: 'Traza', value: formatNumber(trace(matrix), 3) },
        { label: 'Valores propios', value: eigenText(matrix) },
        {
          label: 'Valores singulares',
          value: `${formatNumber(decomposition.sigma[0], 3)} y ${formatNumber(decomposition.sigma[1], 3)}`,
        },
        {
          label: 'Norma espectral / Frobenius',
          value: `${formatNumber(decomposition.sigma[0], 3)} / ${formatNumber(frobenius, 3)}`,
        },
        {
          label: 'Número de condición',
          value: Number.isFinite(condition) ? formatNumber(condition, 3) : 'infinito (singular)',
        },
      ]}
      legend={[
        { label: 'Imagen de las verticales', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Imagen de las horizontales', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Imagen del cuadrado unitario', color: DATA_COLORS.highlight },
        ...(showCircle
          ? [
              {
                label: 'Imagen del círculo unitario',
                color: DATA_COLORS.tertiary,
                shape: 'line' as const,
              },
            ]
          : []),
        ...(showEigen && imaginary[0] === 0
          ? [
              {
                label: 'Rectas de vectores propios',
                color: DATA_COLORS.quaternary,
                shape: 'dashed' as const,
              },
            ]
          : []),
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`\\mathbf{A} = ${matLatex(matrix)},\\qquad \\det \\mathbf{A} = ${formatNumber(det, 3)}`} />
      </p>
      <CartesianPlane extent={5} label={description} grid={false}>
        {(plane) => (
          <>
            <TransformedGrid plane={plane} matrix={current} showCircle={showCircle} />
            {showEigen && vectors && frame >= FRAMES && (
              <g aria-hidden="true">
                {vectors.map((vector, index) => (
                  <line
                    key={index}
                    x1={plane.x(-(vector[0] ?? 0) * FAR)}
                    y1={plane.y(-(vector[1] ?? 0) * FAR)}
                    x2={plane.x((vector[0] ?? 0) * FAR)}
                    y2={plane.y((vector[1] ?? 0) * FAR)}
                    stroke={DATA_COLORS.quaternary}
                    strokeWidth={2.5}
                    strokeDasharray="8 5"
                  />
                ))}
              </g>
            )}
            {showEigen && imaginary[0] === 0 && frame >= FRAMES && (
              <text
                x={plane.x(plane.xDomain[0]) + 8}
                y={plane.y(plane.yDomain[1]) + 16}
                className={styles.svgNote}
              >
                λ = {formatNumber(real[0], 2)}, {formatNumber(real[1], 2)}
              </text>
            )}
          </>
        )}
      </CartesianPlane>
    </VizFrame>
  );
}
