import { useState } from 'react';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataTypesViz.module.css';
import { TIDY_CASES, type Cell, type Table, type TidyCaseId } from './tidyCases.ts';

const MOVES_PER_SECOND = 1.2;

function hasCell(cells: readonly Cell[], row: number, column: number): boolean {
  return cells.some(([r, c]) => r === row && c === column);
}

interface GridProps {
  table: Table;
  label: string;
  active: readonly Cell[];
  revealed?: readonly Cell[];
}

function Grid({ table, label, active, revealed }: GridProps) {
  return (
    <div className={styles.tableScroll} role="region" aria-label={label} tabIndex={0}>
      <table className={styles.table}>
        <thead>
          <tr>
            {table.headers.map((header, c) => (
              <th
                key={header}
                scope="col"
                className={hasCell(active, -1, c) ? styles.cellHighlight : undefined}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, r) => (
            <tr key={r}>
              {row.map((value, c) => (
                <td key={c} className={hasCell(active, r, c) ? styles.cellHighlight : undefined}>
                  {!revealed || hasCell(revealed, r, c) ? value : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * An untidy table is rewritten cell by cell into tidy form: one column per
 * variable, one row per unit of observation and one value per cell.
 */
export function TidyView({ title, caseId }: { title: string; caseId: TidyCaseId }) {
  const item = TIDY_CASES[caseId];
  const [moves, setMoves] = useState(0);
  const playback = usePlayback({
    step: () => setMoves((value) => Math.min(item.steps.length, value + 1)),
    reset: () => setMoves(0),
    rate: MOVES_PER_SECOND,
    done: moves >= item.steps.length,
  });
  const current = moves > 0 ? item.steps[moves - 1] : undefined;
  const revealed = item.steps.slice(0, moves).flatMap((step) => step.target);
  const done = moves >= item.steps.length;
  const description =
    `${item.name}. ${item.problem} ` +
    `Se han movido ${moves} de ${item.steps.length} valores a la tabla ordenada, cuya unidad de observación es ${item.unit}.` +
    (done
      ? ` La tabla ordenada tiene ${item.target.rows.length} filas y ${item.target.headers.length} columnas.`
      : '');

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      readouts={[
        { label: 'Valores movidos', value: `${moves} de ${item.steps.length}` },
        {
          label: 'Tamaño original',
          value: `${item.source.rows.length} × ${item.source.headers.length}`,
        },
        {
          label: 'Tamaño ordenado',
          value: `${item.target.rows.length} × ${item.target.headers.length}`,
        },
        { label: 'Unidad de observación', value: item.unit },
      ]}
      description={description}
    >
      <p className={styles.stage}>
        {done
          ? `Cada fila es una observación (${item.unit}), cada columna una variable (${item.target.headers.join(', ')}) y cada celda un valor.`
          : item.problem}
      </p>
      <div className={styles.pair}>
        <div>
          <h4 className={styles.panelTitle}>Tabla original</h4>
          <Grid table={item.source} label="Tabla original" active={current?.source ?? []} />
        </div>
        <div>
          <h4 className={styles.panelTitle}>Datos ordenados</h4>
          <Grid
            table={item.target}
            label="Datos ordenados"
            active={current?.target ?? []}
            revealed={revealed}
          />
        </div>
      </div>
    </VizFrame>
  );
}
