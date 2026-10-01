import { useState } from 'react';
import { formatFraction } from '../../../lib/format/number.ts';
import { kronecker, type Matrix } from '../../../lib/linalg/index.ts';
import { Latex } from '../../core/Latex.tsx';
import { MatrixDisplay } from '../../core/MatrixDisplay.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MatrixGrid.module.css';

const BLOCKS_PER_SECOND = 1;

interface KroneckerViewProps {
  title: string;
  a: Matrix;
  b: Matrix;
}

/**
 * A ⊗ B replaces each entry a_ij of A by the whole block a_ij B. The blocks
 * appear one at a time, so the result is read as a copy of B scaled by every
 * entry of A, with size (p r) by (q s).
 */
export function KroneckerView({ title, a, b }: KroneckerViewProps) {
  const p = a.length;
  const q = a[0]?.length ?? 0;
  const r = b.length;
  const s = b[0]?.length ?? 0;
  const product = kronecker(a, b);
  const total = p * q;
  const [run, setRun] = useState(0);
  const [done, setDone] = useResettableState(`${run}`, () => 0);
  const playback = usePlayback({
    step: () => setDone((value) => Math.min(total, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: BLOCKS_PER_SECOND,
    done: done >= total,
  });
  const current = done - 1;
  const bi = current >= 0 ? Math.floor(current / q) : -1;
  const bj = current >= 0 ? current % q : -1;
  const blockIndex = (i: number, j: number) => Math.floor(i / r) * q + Math.floor(j / s);
  const shown = product.map((row, i) =>
    row.map((value, j) => (blockIndex(i, j) <= current ? value : Number.NaN)),
  );
  const latex =
    current < 0
      ? '\\mathbf{A} \\otimes \\mathbf{B} = \\begin{pmatrix} a_{11}\\mathbf{B} & \\cdots & a_{1q}\\mathbf{B} \\\\ \\vdots & & \\vdots \\\\ a_{p1}\\mathbf{B} & \\cdots & a_{pq}\\mathbf{B} \\end{pmatrix}'
      : `\\text{bloque } (${bi + 1}, ${bj + 1}) = a_{${bi + 1}${bj + 1}}\\,\\mathbf{B} = ${formatFraction(a[bi]?.[bj] ?? 0)}\\,\\mathbf{B}`;
  const text =
    current < 0
      ? `A es de ${p} por ${q} y B de ${r} por ${s}: el producto de Kronecker es de ${p * r} por ${q * s}.`
      : `El bloque en la posición (${bi + 1}, ${bj + 1}) es B multiplicada por la entrada correspondiente de A.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Tamaño de A ⊗ B', value: `${p * r} por ${q * s}` },
        { label: 'Bloques colocados', value: `${Math.max(0, done)} de ${total}` },
      ]}
      description={text}
      graphic="html"
    >
      <p className={styles.formula}>
        <Latex tex={latex} />
      </p>
      <p className={styles.text} aria-hidden="true">
        {text}
      </p>
      <div
        className={styles.matrices}
        role="region"
        aria-label="Producto de Kronecker"
        tabIndex={0}
      >
        <MatrixDisplay
          name="A"
          label="Matriz A"
          matrix={a}
          cellState={(i, j) => (i === bi && j === bj ? 'active' : undefined)}
        />
        <MatrixDisplay
          name="B"
          label="Matriz B"
          matrix={b}
          cellState={() => (current >= 0 ? 'changed' : undefined)}
        />
        <MatrixDisplay
          name="A ⊗ B"
          label="Producto de Kronecker de A y B"
          matrix={shown}
          compact
          format={(value) => (Number.isNaN(value) ? '\u00a0' : formatFraction(value))}
          cellState={(i, j) =>
            blockIndex(i, j) === current
              ? 'filled'
              : (Math.floor(i / r) + Math.floor(j / s)) % 2 === 0
                ? 'changed'
                : undefined
          }
        />
      </div>
    </VizFrame>
  );
}
