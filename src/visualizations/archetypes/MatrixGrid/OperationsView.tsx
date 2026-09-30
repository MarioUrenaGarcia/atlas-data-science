import { useMemo, useState } from 'react';
import { formatFraction } from '../../../lib/format/number.ts';
import { add, multiply, scale, type Matrix } from '../../../lib/linalg/index.ts';
import { Latex } from '../../core/Latex.tsx';
import { MatrixDisplay } from '../../core/MatrixDisplay.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MatrixGrid.module.css';

type Operation = 'suma' | 'escalar' | 'producto';

const ENTRIES_PER_SECOND = 1;
const VIEWS = [
  { value: 'suma', label: 'Suma' },
  { value: 'escalar', label: 'Por escalar' },
  { value: 'producto', label: 'Producto' },
] as const;

const term = (a: number, b: number) => `(${formatFraction(a)})(${formatFraction(b)})`;

interface OperationsViewProps {
  title: string;
  a: Matrix;
  b: Matrix;
  scalar: number;
  initialView: Operation;
}

/**
 * Matrix operations entry by entry. Sum and scalar multiple act on each
 * position separately; in the product, entry (i, j) is the dot product of
 * row i of A with column j of B, which is why the inner sizes must agree.
 */
export function OperationsView({ title, a, b, scalar, initialView }: OperationsViewProps) {
  const [view, setView] = useState<Operation>(initialView);
  const definitions = useMemo(
    () =>
      view === 'escalar'
        ? [
            {
              type: 'number' as const,
              key: 'c',
              label: 'Escalar',
              symbol: 'c',
              min: -5,
              max: 5,
              step: 0.5,
              default: scalar,
              digits: 1,
            },
          ]
        : [],
    [view, scalar],
  );
  const parameters = useParameters(definitions);
  const c = Number((parameters.values as Record<string, number>).c ?? scalar);
  const sameShape = a.length === b.length && a[0]?.length === b[0]?.length;
  const conformable = (a[0]?.length ?? 0) === b.length;
  const result =
    view === 'suma'
      ? sameShape
        ? add(a, b)
        : null
      : view === 'escalar'
        ? scale(a, c)
        : conformable
          ? multiply(a, b)
          : null;
  const rows = result?.length ?? 0;
  const columns = result?.[0]?.length ?? 0;
  const total = rows * columns;
  const [run, setRun] = useState(0);
  const [done, setDone] = useResettableState(`${view}|${run}|${c}`, () => 0);
  const playback = usePlayback({
    step: () => setDone((value) => Math.min(total, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: ENTRIES_PER_SECOND,
    done: done >= total,
  });
  const current = Math.min(done, total) - 1;
  const ci = current >= 0 ? Math.floor(current / columns) : -1;
  const cj = current >= 0 ? current % columns : -1;
  const inner = a[0]?.length ?? 0;

  let latex: string;
  let text: string;
  if (!result) {
    latex =
      view === 'suma'
        ? '\\text{tamaños distintos}'
        : `\\text{columnas de }A = ${inner} \\neq ${b.length} = \\text{filas de }B`;
    text =
      view === 'suma'
        ? 'Solo se suman matrices del mismo tamaño.'
        : 'El producto AB solo existe cuando A tiene tantas columnas como filas tiene B.';
  } else if (current < 0) {
    latex =
      view === 'suma'
        ? '(A + B)_{ij} = a_{ij} + b_{ij}'
        : view === 'escalar'
          ? '(cA)_{ij} = c\\,a_{ij}'
          : `(AB)_{ij} = \\sum_{k=1}^{${inner}} a_{ik}\\,b_{kj}`;
    text = 'Cada paso calcula una entrada del resultado.';
  } else {
    const value = result[ci]?.[cj] ?? 0;
    const position = `${ci + 1}${cj + 1}`;
    if (view === 'suma') {
      latex = `c_{${position}} = ${formatFraction(a[ci]?.[cj] ?? 0)} + ${formatFraction(b[ci]?.[cj] ?? 0)} = ${formatFraction(value)}`;
      text = `Se suman las entradas en la posición (${ci + 1}, ${cj + 1}) de A y de B.`;
    } else if (view === 'escalar') {
      latex = `c_{${position}} = ${formatFraction(c)} \\cdot ${formatFraction(a[ci]?.[cj] ?? 0)} = ${formatFraction(value)}`;
      text = `La entrada (${ci + 1}, ${cj + 1}) de A se multiplica por c.`;
    } else {
      const terms = Array.from({ length: inner }, (_, k) =>
        term(a[ci]?.[k] ?? 0, b[k]?.[cj] ?? 0),
      ).join(' + ');
      latex = `c_{${position}} = ${terms} = ${formatFraction(value)}`;
      text = `Fila ${ci + 1} de A por columna ${cj + 1} de B: se multiplican entrada por entrada y se suman.`;
    }
  }
  const shown = result?.map((row, i) =>
    row.map((value, j) => (i * columns + j <= current ? value : Number.NaN)),
  );
  const description = `${text} ${result ? `Resultado de ${rows} por ${columns}.` : ''}`;
  const productCell = (i: number, j: number) =>
    view === 'producto'
      ? i === ci
        ? 'active'
        : undefined
      : i === ci && j === cj
        ? 'active'
        : undefined;
  const productCellB = (i: number, j: number) =>
    view === 'producto'
      ? j === cj
        ? 'active'
        : undefined
      : i === ci && j === cj
        ? 'active'
        : undefined;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={
        view === 'escalar'
          ? { ...parameters, values: parameters.values as Record<string, unknown> }
          : undefined
      }
      views={{ options: VIEWS, value: view, onChange: (value) => setView(value as Operation) }}
      readouts={[
        { label: 'Tamaño de A', value: `${a.length} por ${inner}` },
        { label: 'Tamaño de B', value: `${b.length} por ${b[0]?.length ?? 0}` },
        { label: 'Tamaño del resultado', value: result ? `${rows} por ${columns}` : 'no definido' },
        {
          label: 'Entradas calculadas',
          value: `${Math.max(0, Math.min(done, total))} de ${total}`,
        },
      ]}
      description={description}
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
        aria-label="Matrices de la operación"
        tabIndex={0}
      >
        {view === 'escalar' && <span className={styles.operator}>{formatFraction(c)} ·</span>}
        <MatrixDisplay name="A" label="Matriz A" matrix={a} cellState={productCell} />
        {view !== 'escalar' && (
          <>
            <span className={styles.operator} aria-hidden="true">
              {view === 'suma' ? '+' : '·'}
            </span>
            <MatrixDisplay name="B" label="Matriz B" matrix={b} cellState={productCellB} />
          </>
        )}
        {shown && (
          <>
            <span className={styles.operator} aria-hidden="true">
              =
            </span>
            <MatrixDisplay
              label="Resultado"
              matrix={shown}
              format={(value) => (Number.isNaN(value) ? '\u00a0' : formatFraction(value))}
              cellState={(i, j) => (i === ci && j === cj ? 'filled' : undefined)}
            />
          </>
        )}
      </div>
    </VizFrame>
  );
}
