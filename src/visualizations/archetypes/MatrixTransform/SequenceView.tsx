import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import {
  blend,
  determinant,
  IDENTITY,
  inverse,
  matLatex,
  matText,
  multiply,
  type Mat2,
} from './matrix2.ts';
import styles from './MatrixTransform.module.css';
import { TransformedGrid } from './TransformedGrid.tsx';

const FRAMES_PER_PHASE = 40;
const FRAMES_PER_SECOND = 25;

export interface MatrixPair {
  nombre: string;
  primera: Mat2;
  segunda?: Mat2;
}

interface SequenceViewProps {
  title: string;
  mode: 'composicion' | 'inversa';
  pairs: readonly MatrixPair[];
}

/**
 * Two linear maps applied one after the other. In composition mode the plane
 * is moved by the first matrix and then by the second, which together act as
 * the product (second times first). In inverse mode the second map is the
 * inverse, which brings every point back; a singular matrix flattens the
 * plane and no matrix can undo it.
 */
export function SequenceView({ title, mode, pairs }: SequenceViewProps) {
  const definitions = useMemo(
    () => [
      ...(pairs.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'par',
              label: 'Caso',
              options: pairs.map((pair, index) => ({ value: String(index), label: pair.nombre })),
              default: '0',
            },
          ]
        : []),
      ...(mode === 'composicion'
        ? [
            {
              type: 'toggle' as const,
              key: 'invertirOrden',
              label: 'Aplicar primero la segunda',
              default: false,
            },
          ]
        : []),
    ],
    [pairs, mode],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string | boolean>;
  const pair = pairs[pairs.length > 1 ? Number(values.par) : 0] ?? pairs[0];
  const swapped = mode === 'composicion' && Boolean(values.invertirOrden);
  const [frame, setFrame] = useState(0);
  const playback = usePlayback({
    step: () => setFrame((value) => Math.min(2 * FRAMES_PER_PHASE, value + 1)),
    reset: () => setFrame(0),
    rate: FRAMES_PER_SECOND,
    done: frame >= 2 * FRAMES_PER_PHASE,
  });
  if (!pair) return null;
  const a = pair.primera;
  const inv = inverse(a);
  const b = mode === 'inversa' ? inv : (pair.segunda ?? IDENTITY);
  const first = swapped && b ? b : a;
  const second = swapped ? a : b;
  const phase1 = Math.min(1, frame / FRAMES_PER_PHASE);
  const phase2 = Math.max(0, (frame - FRAMES_PER_PHASE) / FRAMES_PER_PHASE);
  const product = second ? multiply(second, first) : null;
  const current =
    phase2 === 0 || !product ? blend(IDENTITY, first, phase1) : blend(first, product, phase2);
  const singular = mode === 'inversa' && !inv;
  const firstName = swapped ? 'B' : 'A';
  const gridName =
    phase2 === 0 || singular ? firstName : mode === 'inversa' ? 'A⁻¹A' : swapped ? 'AB' : 'BA';
  const description =
    mode === 'inversa'
      ? singular
        ? `det A = ${formatNumber(determinant(a), 3)}: A aplasta el plano sobre una recta y no tiene inversa.`
        : `A = ${matText(a)}, A⁻¹ = ${matText(inv ?? IDENTITY)}; aplicar A y después A⁻¹ devuelve cada punto a su lugar.`
      : `Primera = ${matText(first)}, segunda = ${matText(second ?? IDENTITY)}. El resultado es la matriz producto ${matText(product ?? IDENTITY)}, distinta en general si se cambia el orden.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={
        mode === 'inversa'
          ? [
              { label: 'det A', value: formatNumber(determinant(a), 3) },
              {
                label: 'A⁻¹',
                value: inv ? matText(inv, 3) : 'no existe',
                color: DATA_COLORS.highlight,
              },
              { label: 'A⁻¹ A', value: inv ? matText(multiply(inv, a), 3) : 'no existe' },
            ]
          : [
              { label: 'Primera matriz', value: matText(first) },
              { label: 'Segunda matriz', value: matText(second ?? IDENTITY) },
              {
                label: 'Producto (segunda por primera)',
                value: matText(product ?? IDENTITY),
                color: DATA_COLORS.highlight,
              },
              {
                label: 'Producto en el otro orden',
                value: matText(multiply(first, second ?? IDENTITY)),
              },
            ]
      }
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={
            frame <= FRAMES_PER_PHASE
              ? `\\text{Fase 1: } ${mode === 'inversa' || !swapped ? 'A' : 'B'} = ${matLatex(first)}`
              : mode === 'inversa'
                ? inv
                  ? `\\text{Fase 2: } A^{-1} = ${matLatex(inv, 3)},\\quad A^{-1}A = I`
                  : `\\det A = 0 \\ \\Rightarrow\\ A^{-1} \\text{ no existe}`
                : `\\text{Fase 2: } ${swapped ? 'A' : 'B'} = ${matLatex(second ?? IDENTITY)},\\quad ${swapped ? 'A' : 'B'}\\,${swapped ? 'B' : 'A'} = ${matLatex(product ?? IDENTITY)}`
          }
        />
      </p>
      <p className={styles.stage}>
        {frame <= FRAMES_PER_PHASE
          ? mode === 'inversa'
            ? 'Fase 1: se aplica A.'
            : 'Fase 1: se aplica la primera matriz.'
          : mode === 'inversa'
            ? singular
              ? 'Fase 2: no existe una matriz que deshaga el aplastamiento.'
              : 'Fase 2: se aplica A⁻¹ y todo regresa a su lugar.'
            : 'Fase 2: se aplica la segunda matriz sobre el resultado.'}
      </p>
      <CartesianPlane extent={5} label={description} grid={false}>
        {(plane) => (
          <TransformedGrid
            plane={plane}
            matrix={singular && phase2 > 0 ? a : current}
            name={gridName}
          />
        )}
      </CartesianPlane>
    </VizFrame>
  );
}
