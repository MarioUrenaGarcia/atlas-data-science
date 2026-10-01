import { useState } from 'react';
import { formatFraction } from '../../../lib/format/number.ts';
import { multiply, transpose, type Matrix } from '../../../lib/linalg/index.ts';
import { Latex } from '../../core/Latex.tsx';
import { MatrixDisplay } from '../../core/MatrixDisplay.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MatrixGrid.module.css';

const ENTRIES_PER_SECOND = 1.5;

const equal = (x: Matrix, y: Matrix) =>
  x.length === y.length &&
  x.every(
    (row, i) =>
      row.length === y[i]?.length &&
      row.every((value, j) => Math.abs(value - (y[i]?.[j] ?? NaN)) < 1e-9),
  );

interface TransposeViewProps {
  title: string;
  a: Matrix;
  b?: Matrix;
}

/**
 * The transpose moves entry (i, j) to position (j, i): rows become columns.
 * The entries are carried over one at a time; the diagonal stays in place,
 * and a matrix equal to its transpose is symmetric.
 */
export function TransposeView({ title, a, b }: TransposeViewProps) {
  const rows = a.length;
  const columns = a[0]?.length ?? 0;
  const total = rows * columns;
  const t = transpose(a);
  const [run, setRun] = useState(0);
  const [done, setDone] = useResettableState(`${run}`, () => 0);
  const playback = usePlayback({
    step: () => setDone((value) => Math.min(total, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: ENTRIES_PER_SECOND,
    done: done >= total,
  });
  const current = done - 1;
  const ci = current >= 0 ? Math.floor(current / columns) : -1;
  const cj = current >= 0 ? current % columns : -1;
  const shown = t.map((row, i) =>
    row.map((value, j) => (j * columns + i <= current ? value : Number.NaN)),
  );
  const symmetric = equal(a, t);
  const productCheck =
    b && (a[0]?.length ?? 0) === b.length
      ? { left: transpose(multiply(a, b)), right: multiply(transpose(b), t) }
      : null;
  const latex =
    current < 0
      ? '(\\mathbf{A}^\\top)_{ij} = a_{ji}'
      : `a_{${ci + 1}${cj + 1}} = ${formatFraction(a[ci]?.[cj] ?? 0)} \\ \\longrightarrow\\ (\\mathbf{A}^\\top)_{${cj + 1}${ci + 1}}`;
  const text =
    current < 0
      ? `A es de ${rows} por ${columns}, así que Aᵀ es de ${columns} por ${rows}.`
      : ci === cj
        ? 'Entrada de la diagonal: no cambia de lugar.'
        : `La entrada de la fila ${ci + 1} y columna ${cj + 1} pasa a la fila ${cj + 1} y columna ${ci + 1}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Tamaño de A', value: `${rows} por ${columns}` },
        { label: 'Tamaño de Aᵀ', value: `${columns} por ${rows}` },
        { label: '¿A = Aᵀ (simétrica)?', value: symmetric ? 'sí' : 'no' },
        ...(productCheck
          ? [
              {
                label: '¿(AB)ᵀ = BᵀAᵀ?',
                value: equal(productCheck.left, productCheck.right) ? 'sí' : 'no',
              },
            ]
          : []),
      ]}
      description={`${text} ${symmetric ? 'A es simétrica.' : ''}`}
      graphic="html"
    >
      <p className={styles.formula}>
        <Latex tex={latex} />
      </p>
      <p className={styles.text} aria-hidden="true">
        {text}
      </p>
      <div className={styles.matrices} role="region" aria-label="A y su transpuesta" tabIndex={0}>
        <MatrixDisplay
          name="A"
          label="Matriz A"
          matrix={a}
          cellState={(i, j) => (i === ci && j === cj ? 'active' : i === j ? 'pivot' : undefined)}
        />
        <MatrixDisplay
          name="Aᵀ"
          label="Transpuesta de A"
          matrix={shown}
          format={(value) => (Number.isNaN(value) ? '\u00a0' : formatFraction(value))}
          cellState={(i, j) => (i === cj && j === ci ? 'filled' : i === j ? 'pivot' : undefined)}
        />
      </div>
      {productCheck && done >= total && (
        <div
          className={styles.matrices}
          role="region"
          aria-label="Transpuesta de un producto"
          tabIndex={0}
        >
          <MatrixDisplay name="B" label="Matriz B" matrix={b ?? []} compact />
          <MatrixDisplay
            name="(AB)ᵀ"
            label="Transpuesta de AB"
            matrix={productCheck.left}
            compact
          />
          <MatrixDisplay
            name="BᵀAᵀ"
            label="B transpuesta por A transpuesta"
            matrix={productCheck.right}
            compact
          />
        </div>
      )}
    </VizFrame>
  );
}
