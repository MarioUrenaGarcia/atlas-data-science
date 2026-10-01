import { useMemo, useState } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './LogicViz.module.css';

const STEPS_PER_SECOND = 1.5;

export interface QuantifierOrderExample {
  nombre: string;
  /** Elements of the outer domain, one row each. */
  filas: readonly string[];
  /** Elements of the inner domain, one column each. */
  columnas: readonly string[];
  /** Pairs [row, column] where the relation R(x, y) holds. */
  pares: readonly (readonly [number, number])[];
  relacion: string;
}

interface QuantifierOrderViewProps {
  title: string;
  examples: readonly QuantifierOrderExample[];
}

/**
 * The relation R(x, y) as a table. "For every x there is a y" asks that every
 * row contain a mark, each row may use its own column; "there is a y for every
 * x" asks for a single column marked in every row. The animation first checks
 * the rows one by one and then the columns.
 */
export function QuantifierOrderView({ title, examples }: QuantifierOrderViewProps) {
  const definitions = useMemo(
    () =>
      examples.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'ejemplo',
              label: 'Relación',
              options: examples.map((example, index) => ({ value: String(index), label: example.nombre })),
              default: '0',
            },
          ]
        : [],
    [examples],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const example = examples[Number(values.ejemplo ?? 0)] ?? (examples[0] as QuantifierOrderExample);
  const rows = example.filas.length;
  const columns = example.columnas.length;
  const holds = (i: number, j: number) => example.pares.some(([a, b]) => a === i && b === j);
  const rowOk = example.filas.map((_, i) => example.columnas.some((_, j) => holds(i, j)));
  const columnOk = example.columnas.map((_, j) => example.filas.every((_, i) => holds(i, j)));
  const total = rows + columns;
  const [run, setRun] = useState(0);
  const [step, update] = useResettableState<number>(`${example.nombre}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STEPS_PER_SECOND,
    done: step >= total,
  });

  const rowsChecked = Math.min(step, rows);
  const columnsChecked = Math.max(0, step - rows);
  const inRows = step > 0 && step <= rows;
  const activeRow = inRows ? step - 1 : -1;
  const activeColumn = step > rows ? step - rows - 1 : -1;
  const failedRow = rowOk.findIndex((ok, i) => i < rowsChecked && !ok);
  const forAllExists = failedRow >= 0 ? false : rowsChecked >= rows ? true : null;
  const fullColumn = columnOk.findIndex((ok, j) => j < columnsChecked && ok);
  const existsForAll = fullColumn >= 0 ? true : columnsChecked >= columns ? false : null;
  const verdict = (value: boolean | null) =>
    value === null ? 'sin decidir' : value ? 'verdadera' : 'falsa';

  const R = example.relacion;
  const stageTex = inRows
    ? `x = \\text{${example.filas[activeRow]}}:\\ \\exists y\\ ${R}(x, y)\\ \\text{es ${rowOk[activeRow] ? 'verdadera' : 'falsa'}}`
    : activeColumn >= 0
      ? `y = \\text{${example.columnas[activeColumn]}}:\\ \\forall x\\ ${R}(x, y)\\ \\text{es ${columnOk[activeColumn] ? 'verdadera' : 'falsa'}}`
      : step >= total
        ? `\\forall x\\, \\exists y\\ ${R}(x, y)\\ \\text{es ${verdict(forAllExists)}};\\quad \\exists y\\, \\forall x\\ ${R}(x, y)\\ \\text{es ${verdict(existsForAll)}}`
        : `\\forall x\\, \\exists y\\ ${R}(x, y) \\quad\\text{frente a}\\quad \\exists y\\, \\forall x\\ ${R}(x, y)`;
  const description =
    `${example.nombre}. Para todo x existe y: ${verdict(forAllExists)}. Existe y para todo x: ${verdict(existsForAll)}. ` +
    `Filas revisadas: ${rowsChecked} de ${rows}; columnas revisadas: ${columnsChecked} de ${columns}.`;

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      parameters={definitions.length > 0 ? { ...parameters, values } : undefined}
      readouts={[
        { label: `∀x ∃y ${R}(x, y)`, value: verdict(forAllExists) },
        { label: `∃y ∀x ${R}(x, y)`, value: verdict(existsForAll) },
        { label: 'Filas con alguna marca', value: `${rowOk.filter(Boolean).length} de ${rows}` },
        { label: 'Columnas completas', value: `${columnOk.filter(Boolean).length} de ${columns}` },
      ]}
      legend={[
        { label: `${R}(x, y) se cumple`, color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Fila o columna en revisión', color: 'var(--color-accent-soft)' },
      ]}
      description={description}
    >
      <p className={styles.note}>
        <Latex tex={stageTex} />
      </p>
      <div className={styles.tableScroll} role="region" aria-label={`Tabla de la relación ${example.relacion}`} tabIndex={0}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">
                <span className="visually-hidden">x frente a y</span>
              </th>
              {example.columnas.map((name, j) => (
                <th
                  key={name}
                  scope="col"
                  className={j === activeColumn ? styles.activeColumn : undefined}
                >
                  {name}
                  {j < columnsChecked && (
                    <span className={`${columnOk[j] ? styles.true : styles.false} ${styles.verdictTag}`}>{columnOk[j] ? 'V' : 'F'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {example.filas.map((name, i) => (
              <tr key={name} className={i === activeRow ? styles.activeRow : undefined}>
                <th scope="row">
                  {name}{' '}
                  {i < rowsChecked && (
                    <span className={`${rowOk[i] ? styles.true : styles.false} ${styles.verdictTag}`}>{rowOk[i] ? 'V' : 'F'}</span>
                  )}
                </th>
                {example.columnas.map((column, j) => (
                  <td key={column} className={j === activeColumn ? styles.activeColumn : undefined}>
                    {holds(i, j) ? <><span className={styles.mark} aria-hidden="true" /><span className="visually-hidden">sí</span></> : <span className="visually-hidden">no</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VizFrame>
  );
}
