import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { VectorArrow } from '../../core/svg/VectorArrow.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { apply, eigen, eigenText, matLatex, vecText, type Vec2 } from './matrix2.ts';
import styles from './MatrixTransform.module.css';
import { useMatrixChoice, type NamedMatrix } from './useMatrixChoice.ts';

const MAX_ITERATIONS = 30;
const ITERATIONS_PER_SECOND = 2;
const FAR = 40;
const TRAIL = 6;

interface PowerViewProps {
  title: string;
  matrices: readonly NamedMatrix[];
  /** Angle in degrees of the starting vector. */
  startAngle: number;
}

/**
 * Power method: multiply by A and normalize, again and again. The component
 * along the dominant eigenvector grows by |λ₁| each time and the others by
 * smaller factors, so the direction converges at the rate |λ₂ / λ₁|.
 */
export function PowerView({ title, matrices, startAngle }: PowerViewProps) {
  const { parameters, values, matrix } = useMatrixChoice(matrices);
  const [iteration, setIteration] = useState(0);
  const playback = usePlayback({
    step: () => setIteration((value) => Math.min(MAX_ITERATIONS, value + 1)),
    reset: () => setIteration(0),
    rate: ITERATIONS_PER_SECOND,
    done: iteration >= MAX_ITERATIONS,
  });
  const iterates = useMemo(() => {
    const radians = (startAngle * Math.PI) / 180;
    const list: Vec2[] = [[Math.cos(radians), Math.sin(radians)]];
    for (let k = 0; k < MAX_ITERATIONS; k += 1) {
      const previous = list[k] ?? [1, 0];
      const next = apply(matrix, previous);
      const length = Math.hypot(next[0], next[1]);
      list.push(length > 1e-12 ? [next[0] / length, next[1] / length] : previous);
    }
    return list;
  }, [matrix, startAngle]);
  const current = iterates[iteration] ?? [1, 0];
  const image = apply(matrix, current);
  const rayleigh = current[0] * image[0] + current[1] * image[1];
  const { real, imaginary, vectors } = eigen(matrix);
  const dominantIndex = Math.abs(real[0]) >= Math.abs(real[1]) ? 0 : 1;
  const dominant = vectors?.[dominantIndex];
  const ratio =
    imaginary[0] === 0 && real[dominantIndex] !== 0
      ? Math.abs(real[1 - dominantIndex] ?? 0) / Math.abs(real[dominantIndex] ?? 1)
      : NaN;
  const error = dominant
    ? Math.abs(current[0] * (dominant[1] ?? 0) - current[1] * (dominant[0] ?? 0))
    : NaN;
  const description =
    `Iteración ${iteration}: x = ${vecText(current, 3)}, estimación de λ₁ = ${formatNumber(rayleigh, 4)}. ` +
    `Valores propios: ${eigenText(matrix)}.` +
    (Number.isFinite(ratio)
      ? ` El error se multiplica por ${formatNumber(ratio, 3)} en cada paso.`
      : ' Sin valor propio dominante real, el método no converge.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Iteración k', value: String(iteration) },
        { label: 'xₖ (normalizado)', value: vecText(current, 3), color: DATA_COLORS.highlight },
        { label: 'Estimación de λ₁ (cociente de Rayleigh)', value: formatNumber(rayleigh, 4) },
        { label: 'Valores propios exactos', value: eigenText(matrix) },
        {
          label: 'Seno del ángulo con v₁',
          value: Number.isFinite(error) ? formatNumber(error, 4) : 'no aplica',
        },
        {
          label: 'Razón |λ₂ / λ₁|',
          value: Number.isFinite(ratio) ? formatNumber(ratio, 3) : 'no aplica',
        },
      ]}
      legend={[
        { label: 'Iterado actual', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Iterados anteriores', color: DATA_COLORS.muted, shape: 'line' },
        { label: 'Dirección propia dominante', color: DATA_COLORS.quaternary, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`A = ${matLatex(matrix)},\\qquad \\mathbf{x}_{k+1} = \\frac{A\\mathbf{x}_k}{\\lVert A\\mathbf{x}_k \\rVert}`}
        />
      </p>
      <CartesianPlane extent={1.8} label={description}>
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
              {dominant && (
                <line
                  x1={plane.x(-(dominant[0] ?? 0) * FAR)}
                  y1={plane.y(-(dominant[1] ?? 0) * FAR)}
                  x2={plane.x((dominant[0] ?? 0) * FAR)}
                  y2={plane.y((dominant[1] ?? 0) * FAR)}
                  stroke={DATA_COLORS.quaternary}
                  strokeWidth={2}
                  strokeDasharray="8 5"
                />
              )}
            </g>
            {iterates.slice(Math.max(0, iteration - TRAIL), iteration).map((vector, index) => (
              <VectorArrow
                key={index}
                plane={plane}
                to={vector}
                color={DATA_COLORS.muted}
                width={1.5}
              />
            ))}
            <VectorArrow
              plane={plane}
              to={current}
              color={DATA_COLORS.highlight}
              label={`x${toSubscript(iteration)}`}
              width={3.5}
            />
          </>
        )}
      </CartesianPlane>
    </VizFrame>
  );
}

const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉';
const toSubscript = (value: number) =>
  String(value)
    .split('')
    .map((digit) => SUBSCRIPTS[Number(digit)] ?? digit)
    .join('');
