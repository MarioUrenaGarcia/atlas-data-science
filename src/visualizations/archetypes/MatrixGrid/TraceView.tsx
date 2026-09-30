import { useState } from 'react';
import { formatFraction, formatNumber } from '../../../lib/format/number.ts';
import {
  eigen2x2,
  eigenSymmetric,
  multiply,
  trace,
  type Matrix,
} from '../../../lib/linalg/index.ts';
import { Latex } from '../../core/Latex.tsx';
import { MatrixDisplay } from '../../core/MatrixDisplay.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MatrixGrid.module.css';

const STEPS_PER_SECOND = 1;

const isSymmetric = (m: Matrix) =>
  m.every((row, i) => row.every((value, j) => Math.abs(value - (m[j]?.[i] ?? NaN)) < 1e-12));

/** Sum of the eigenvalues when they can be computed in closed form or by the symmetric solver. */
function eigenvalueSum(m: Matrix): number | null {
  if (m.length === 2) {
    const { real } = eigen2x2(m);
    return real[0] + real[1];
  }
  if (isSymmetric(m)) return eigenSymmetric(m).values.reduce((total, value) => total + value, 0);
  return null;
}

interface TraceViewProps {
  title: string;
  a: Matrix;
  b: Matrix;
}

/**
 * The trace adds the diagonal. The sum is built one entry at a time, then AB
 * and BA are compared: different matrices with the same diagonal sum, which
 * is the cyclic property tr(AB) = tr(BA).
 */
export function TraceView({ title, a, b }: TraceViewProps) {
  const n = a.length;
  const [run, setRun] = useState(0);
  const [step, setStep] = useResettableState(`${run}`, () => 0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(n + 1, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STEPS_PER_SECOND,
    done: step >= n + 1,
  });
  const partial = a.slice(0, Math.min(step, n)).reduce((total, row, i) => total + (row[i] ?? 0), 0);
  const ab = multiply(a, b);
  const ba = multiply(b, a);
  const eigenSum = eigenvalueSum(a);
  const summed = a
    .slice(0, Math.min(step, n))
    .map((row, i) => formatFraction(row[i] ?? 0))
    .join(' + ');
  const latex =
    step === 0
      ? `\\operatorname{tr}(A) = \\sum_{i=1}^{${n}} a_{ii}`
      : step <= n
        ? `\\operatorname{tr}(A) = ${summed.replace(/\+ -/g, '- ')}${step < n ? ' + \\cdots' : ''} = ${formatFraction(partial)}`
        : `\\operatorname{tr}(AB) = ${formatFraction(trace(ab))} = \\operatorname{tr}(BA)`;
  const text =
    step <= n
      ? 'Se suman las entradas de la diagonal; el resto de la matriz no interviene.'
      : 'AB y BA son matrices distintas, pero sus diagonales suman lo mismo.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'tr(A)', value: formatFraction(trace(a)) },
        { label: 'tr(B)', value: formatFraction(trace(b)) },
        { label: 'tr(A + B)', value: formatFraction(trace(a) + trace(b)) },
        { label: 'tr(AB)', value: formatFraction(trace(ab)) },
        { label: 'tr(BA)', value: formatFraction(trace(ba)) },
        ...(eigenSum !== null
          ? [{ label: 'Suma de valores propios de A', value: formatNumber(eigenSum, 3) }]
          : []),
      ]}
      description={`${text} tr(A) = ${formatFraction(trace(a))}, tr(AB) = tr(BA) = ${formatFraction(trace(ab))}.`}
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
        aria-label="Matrices y sus diagonales"
        tabIndex={0}
      >
        {step <= n ? (
          <>
            <MatrixDisplay
              name="A"
              label="Matriz A"
              matrix={a}
              cellState={(i, j) => (i === j ? (i < step ? 'filled' : 'pivot') : 'muted')}
            />
            <MatrixDisplay
              name="B"
              label="Matriz B"
              matrix={b}
              cellState={(i, j) => (i === j ? 'pivot' : undefined)}
            />
          </>
        ) : (
          <>
            <MatrixDisplay
              name="AB"
              label="Producto AB"
              matrix={ab}
              cellState={(i, j) => (i === j ? 'filled' : 'muted')}
            />
            <MatrixDisplay
              name="BA"
              label="Producto BA"
              matrix={ba}
              cellState={(i, j) => (i === j ? 'filled' : 'muted')}
            />
          </>
        )}
      </div>
    </VizFrame>
  );
}
