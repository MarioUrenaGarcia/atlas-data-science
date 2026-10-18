import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MeasureLab.module.css';

const MAX_N = 7;
const STEPS_PER_SECOND = 0.8;

export type FubiniCase = 'contraejemplo' | 'absoluta' | 'continua';

interface FubiniViewProps {
  title: string;
  kind: FubiniCase;
}

/** Entry a(i, j), with i and j starting at 1; for the continuous case, the mass of a grid cell of side 1/n. */
function entry(kind: FubiniCase, i: number, j: number, n: number): number {
  if (kind === 'absoluta') return 2 ** -(i + j);
  if (kind === 'continua') {
    const x = (i - 0.5) / n;
    const y = (j - 0.5) / n;
    return (x * y * y) / (n * n);
  }
  return j === i ? 1 : j === i + 1 ? -1 : 0;
}

/** Complete sum of row i over all j. */
function rowSum(kind: FubiniCase, i: number, n: number): number {
  if (kind === 'absoluta') return 2 ** -i;
  if (kind === 'continua')
    return Array.from({ length: n }, (_, j) => entry(kind, i, j + 1, n)).reduce((a, b) => a + b, 0);
  return 0;
}

/** Complete sum of column j over all i. */
function columnSum(kind: FubiniCase, j: number, n: number): number {
  if (kind === 'absoluta') return 2 ** -j;
  if (kind === 'continua')
    return Array.from({ length: n }, (_, i) => entry(kind, i + 1, j, n)).reduce((a, b) => a + b, 0);
  return j === 1 ? 1 : 0;
}

/**
 * Iterated sums as integrals against a product measure. In the discrete cases
 * the table is the corner of an infinite array and the margins hold the
 * complete sums of each row and column; in the continuous case it is the whole
 * grid of cell masses of x y^2 on the unit square. When the absolute values
 * have a finite total, both orders agree (Fubini); in the classic
 * counterexample every row adds to 0 but the columns add to 1.
 */
export function FubiniView({ title, kind }: FubiniViewProps) {
  const [n, setN] = useState(2);
  const playback = usePlayback({
    step: () => setN((value) => Math.min(MAX_N, value + 1)),
    reset: () => setN(2),
    rate: STEPS_PER_SECOND,
    done: n >= MAX_N,
  });
  const continuous = kind === 'continua';
  const index = Array.from({ length: n }, (_, i) => i + 1);
  const rows = index.map((i) => rowSum(kind, i, n));
  const columns = index.map((j) => columnSum(kind, j, n));
  const byRows = kind === 'contraejemplo' ? 0 : continuous ? rows.reduce((a, b) => a + b, 0) : 1;
  const byColumns = continuous ? columns.reduce((a, b) => a + b, 0) : 1;
  const cornerAbs = index.reduce(
    (s, i) => s + index.reduce((t, j) => t + Math.abs(entry(kind, i, j, n)), 0),
    0,
  );
  const show = (v: number) => (Number.isInteger(v) ? String(v) : formatNumber(v, 4));
  const description =
    kind === 'absoluta'
      ? 'Arreglo a(i, j) = 2^-(i+j): cada fila i suma 2^-i y cada columna j suma 2^-j; sumar primero por filas o primero por columnas da 1.'
      : continuous
        ? `Rejilla de ${n} por ${n} celdas sobre el cuadrado unitario con la masa de x y² en cada celda: por filas y por columnas el total es ${formatNumber(byRows, 4)}, cerca de 1/6.`
        : `Arreglo con 1 en la diagonal y -1 justo a la derecha: cada fila suma 0, la primera columna suma 1 y las demás 0. ` +
          `Por filas el total es 0 y por columnas es 1; la suma de valores absolutos de la esquina de ${n} por ${n} ya es ${2 * n - 1}.`;
  const header =
    kind === 'absoluta'
      ? `\\sum_i \\sum_j 2^{-(i+j)} = \\sum_i 2^{-i} = 1 = \\sum_j \\sum_i 2^{-(i+j)},\\qquad \\sum_{i,j} |a_{ij}| = 1 < \\infty`
      : continuous
        ? `\\sum_i \\sum_j f(x_i, y_j)\\,\\Delta^2 = ${formatNumber(byRows, 4)} = \\sum_j \\sum_i f(x_i, y_j)\\,\\Delta^2 \\;\\to\\; \\int_0^1\\!\\!\\int_0^1 x y^2\\,dy\\,dx = \\tfrac{1}{6}`
        : `\\sum_i \\underbrace{\\sum_j a_{ij}}_{0} = 0 \\;\\ne\\; 1 = \\sum_j \\underbrace{\\sum_i a_{ij}}_{1,\\,0,\\,0,\\,\\dots},\\qquad \\sum_{i,j} |a_{ij}| = \\infty`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: continuous ? 'Rejilla' : 'Esquina mostrada', value: `${n} × ${n}` },
        { label: 'Suma por filas', value: show(byRows), color: DATA_COLORS.primary },
        { label: 'Suma por columnas', value: show(byColumns), color: DATA_COLORS.secondary },
        {
          label: continuous ? 'Σ |masa| de la rejilla' : 'Σ |a(i, j)| en la esquina',
          value: show(cornerAbs),
          color: DATA_COLORS.highlight,
        },
        ...(continuous
          ? []
          : [{ label: 'Σ |a(i, j)| total', value: kind === 'absoluta' ? '1' : 'infinita' }]),
      ]}
      legend={[{ label: 'Suma completa de la fila o la columna', color: DATA_COLORS.highlight }]}
      description={description}
      graphic="html"
    >
      <FormulaLine tex={header} />
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{continuous ? 'x \\ y' : 'i \\ j'}</th>
              {index.map((j) => (
                <th key={j}>{continuous ? formatNumber((j - 0.5) / n, 3) : j}</th>
              ))}
              {!continuous && <th>...</th>}
              <th className={styles.sum}>fila</th>
            </tr>
          </thead>
          <tbody>
            {index.map((i) => (
              <tr key={i}>
                <th>{continuous ? formatNumber((i - 0.5) / n, 3) : i}</th>
                {index.map((j) => (
                  <td key={j}>{show(entry(kind, i, j, n))}</td>
                ))}
                {!continuous && <td>{kind === 'absoluta' ? '...' : i === n ? '-1' : '0'}</td>}
                <td className={styles.sum}>{show(rows[i - 1] ?? 0)}</td>
              </tr>
            ))}
            {!continuous && (
              <tr>
                <th>...</th>
                {index.map((j) => (
                  <td key={j}>...</td>
                ))}
                <td />
                <td className={styles.sum}>...</td>
              </tr>
            )}
            <tr>
              <th className={styles.sum}>columna</th>
              {index.map((j) => (
                <td key={j} className={styles.sum}>
                  {show(columns[j - 1] ?? 0)}
                </td>
              ))}
              {!continuous && <td className={styles.sum}>...</td>}
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </VizFrame>
  );
}
