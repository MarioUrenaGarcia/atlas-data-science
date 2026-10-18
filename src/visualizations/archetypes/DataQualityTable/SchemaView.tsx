import { useState } from 'react';
import { checkCell, describeRule } from '../../../lib/dataprep/quality.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './Quality.module.css';
import type { SchemaCaseId } from './schema.ts';
import { SCHEMA_CASES } from './tableCases.ts';

const ROWS_PER_SECOND = 0.9;

/**
 * Each row of a table is checked against a declared schema: required
 * fields, types, ranges, formats and allowed values. Failing cells are
 * marked with the rule they break.
 */
export function SchemaView({
  title,
  caseId,
  typesOnly,
}: {
  title: string;
  caseId: SchemaCaseId;
  typesOnly: boolean;
}) {
  const base = SCHEMA_CASES[caseId];
  const item = typesOnly
    ? {
        ...base,
        fields: base.fields.map((f) => ({
          ...f,
          rules: f.rules.filter((r) => r.kind === 'requerido' || r.kind === 'entero'),
        })),
      }
    : base;
  const total = item.rows.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [checked, update] = useResettableState<number>(`${caseId}|${run}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: ROWS_PER_SECOND,
    done: checked >= total,
  });
  const results = item.rows.map((row) =>
    row.map((value, c) => checkCell(value, item.fields[c] ?? { name: '', rules: [] })),
  );
  const done = results.slice(0, checked);
  const invalidRows = done.filter((row) => row.some((cell) => cell.length > 0)).length;
  const violations = done.flat().reduce((acc, cell) => acc + cell.length, 0);
  const currentIndex = checked - 1;
  const current = results[currentIndex];
  const currentNotes = current
    ? current.flatMap((cell, c) =>
        cell.map((rule) => `${item.fields[c]?.name ?? ''}: debe ser ${describeRule(rule)}`),
      )
    : [];
  const header = current
    ? currentNotes.length === 0
      ? `\\text{fila } ${checked}: \\text{ cumple las ${item.fields.reduce((a, f) => a + f.rules.length, 0)} reglas}`
      : `\\text{fila } ${checked}: ${currentNotes.length}\\ \\text{violación${currentNotes.length > 1 ? 'es' : ''}}`
    : `\\text{filas válidas} = ${total - invalidRows} \\text{ de } ${total}`;
  const description =
    `${item.name}. Filas revisadas: ${checked} de ${total}; filas con violaciones: ${invalidRows}; violaciones: ${violations}. ` +
    (currentNotes.length > 0 ? `Fila ${checked}: ${currentNotes.join('; ')}.` : '');

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      readouts={[
        { label: 'Filas revisadas', value: `${checked} de ${total}` },
        {
          label: 'Filas válidas',
          value: String(checked - invalidRows),
          color: DATA_COLORS.positive,
        },
        { label: 'Filas con violaciones', value: String(invalidRows), color: DATA_COLORS.negative },
        { label: 'Violaciones', value: String(violations) },
      ]}
      description={description}
      dataTable={{
        caption: 'Esquema declarado',
        columns: ['Campo', 'Reglas'],
        rows: item.fields.map((f) => [f.name, f.rules.map(describeRule).join('; ')]),
      }}
    >
      <FormulaLine tex={header} />
      <div className={styles.tableScroll} role="region" aria-label={item.name} tabIndex={0}>
        <table className={styles.table}>
          <caption className="visually-hidden">{item.name}</caption>
          <thead>
            <tr>
              {item.fields.map((f) => (
                <th key={f.name} scope="col">
                  {f.name}
                  <span className={styles.empty} style={{ display: 'block', fontWeight: 400 }}>
                    {f.rules.map(describeRule).join(', ')}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {item.rows.map((row, r) => (
              <tr key={r} className={r === currentIndex ? styles.activeRow : undefined}>
                {row.map((value, c) => {
                  const failed = r < checked && (results[r]?.[c]?.length ?? 0) > 0;
                  const passed = r < checked && !failed;
                  return (
                    <td
                      key={c}
                      className={`${styles.mono} ${failed ? styles.bad : ''} ${passed ? styles.ok : ''} ${value === '' ? styles.empty : ''}`}
                    >
                      {value === '' ? 'vacío' : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className={styles.notes}>
        {currentNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </VizFrame>
  );
}
