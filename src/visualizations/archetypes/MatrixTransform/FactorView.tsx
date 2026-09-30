import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { VectorArrow } from '../../core/svg/VectorArrow.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { factorize, factorStages, type FactorKind } from './factorizations.ts';
import { apply, blend, IDENTITY, matLatex, vecText, type Vec2 } from './matrix2.ts';
import styles from './MatrixTransform.module.css';
import { TransformedGrid } from './TransformedGrid.tsx';
import { useMatrixChoice, type NamedMatrix } from './useMatrixChoice.ts';

const FRAMES_PER_PHASE = 36;

const inner = ([a, b]: [Vec2, Vec2]) => a[0] * b[0] + a[1] * b[1];
/** Rounding noise of order 1e-16 is shown as the exact zero it stands for. */
const roundOff = (value: number) => (Math.abs(value) < 1e-9 ? 0 : value);
const PHASES = 3;
const FRAMES_PER_SECOND = 24;

const NAMES: Record<
  FactorKind,
  { directions: [string, string]; diagonal: string; values: string }
> = {
  svd: { directions: ['v₁', 'v₂'], diagonal: 'Σ', values: 'Valores singulares σ₁, σ₂' },
  diagonalizacion: { directions: ['v₁', 'v₂'], diagonal: 'D', values: 'Valores propios λ₁, λ₂' },
  espectral: { directions: ['q₁', 'q₂'], diagonal: 'Λ', values: 'Valores propios λ₁, λ₂' },
};

interface FactorViewProps {
  title: string;
  kind: FactorKind;
  matrices: readonly NamedMatrix[];
}

/**
 * A matrix split into three simple maps and applied one at a time: a change
 * of directions, a stretch along the axes and a change back. For the SVD the
 * outer factors are rotations and the stretch is by singular values; for a
 * diagonalization they are a change to the eigenvector basis and back; for a
 * symmetric matrix that basis is orthonormal.
 */
export function FactorView({ title, kind, matrices }: FactorViewProps) {
  const { parameters, values, matrix } = useMatrixChoice(matrices);
  const [frame, setFrame] = useState(0);
  const total = PHASES * FRAMES_PER_PHASE;
  const playback = usePlayback({
    step: () => setFrame((value) => Math.min(total, value + 1)),
    reset: () => setFrame(0),
    rate: FRAMES_PER_SECOND,
    done: frame >= total,
  });
  const result = factorize(matrix, kind);
  const names = NAMES[kind];
  const stages = result.ok ? factorStages(result.value) : [IDENTITY, matrix, matrix, matrix];
  const phase = Math.min(PHASES - 1, Math.floor(frame / FRAMES_PER_PHASE));
  const t = frame >= total ? 1 : (frame - phase * FRAMES_PER_PHASE) / FRAMES_PER_PHASE;
  const current = blend(stages[phase] ?? IDENTITY, stages[phase + 1] ?? IDENTITY, t);
  const shownPhase = frame === 0 ? 0 : frame >= total ? PHASES : phase + 1;
  const stageText = result.ok ? result.value.phases[shownPhase] : result.reason;
  const directions = result.ok ? result.value.directions : null;
  const diagonal = result.ok ? result.value.diagonal : null;
  const description = result.ok
    ? `${stageText} ${names.values}: ${formatNumber(diagonal?.[0] ?? 0, 3)} y ${formatNumber(diagonal?.[1] ?? 0, 3)}; ` +
      `${names.directions[0]} = ${vecText(directions?.[0] ?? [1, 0])}, ${names.directions[1]} = ${vecText(directions?.[1] ?? [0, 1])}.`
    : result.reason;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={
        result.ok
          ? [
              {
                label: names.values,
                value: `${formatNumber(result.value.diagonal[0], 3)} y ${formatNumber(result.value.diagonal[1], 3)}`,
              },
              {
                label: names.directions[0],
                value: vecText(result.value.directions[0]),
                color: DATA_COLORS.primary,
              },
              {
                label: names.directions[1],
                value: vecText(result.value.directions[1]),
                color: DATA_COLORS.secondary,
              },
              {
                label: `${names.directions[0]} · ${names.directions[1]}`,
                value: formatNumber(roundOff(inner(result.value.directions)), 3),
              },
            ]
          : [{ label: 'Factorización', value: 'no existe' }]
      }
      legend={[
        { label: 'Imagen del círculo unitario', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: `Imagen de ${names.directions[0]}`, color: DATA_COLORS.primary, shape: 'line' },
        { label: `Imagen de ${names.directions[1]}`, color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={
            result.ok
              ? `A = ${matLatex(matrix)} = ${result.value.latex},\\quad ${names.diagonal} = ${matLatex(result.value.middle)}`
              : `A = ${matLatex(matrix)}`
          }
        />
      </p>
      <p className={styles.stage}>{stageText}</p>
      <CartesianPlane extent={4.5} label={description} grid={false}>
        {(plane) => (
          <>
            <TransformedGrid
              plane={plane}
              matrix={current}
              showSquare={false}
              showCircle
              showBasis={false}
            />
            {directions && (
              <>
                <VectorArrow
                  plane={plane}
                  to={apply(current, directions[0])}
                  color={DATA_COLORS.primary}
                  label={names.directions[0]}
                  width={3}
                />
                <VectorArrow
                  plane={plane}
                  to={apply(current, directions[1])}
                  color={DATA_COLORS.secondary}
                  label={names.directions[1]}
                  width={3}
                />
              </>
            )}
          </>
        )}
      </CartesianPlane>
    </VizFrame>
  );
}
