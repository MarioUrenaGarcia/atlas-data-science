import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { HBars } from '../../shared/HBars.tsx';
import styles from './Quality.module.css';
import { QUALITY_DIMENSIONS, type DimensionCaseId, type QualityDimension } from './schema.ts';
import {
  DIMENSION_CASES,
  DIMENSION_NAMES,
  DIMENSION_QUESTIONS,
  DIMENSION_UNIT,
  type DimensionCase,
} from './tableCases.ts';

const DIMENSIONS_PER_SECOND = 0.6;

/** Share of units (cells or rows) without an issue of the given dimension. */
function dimensionScore(
  item: DimensionCase,
  dimension: QualityDimension,
): { affected: number; total: number } {
  const issues = item.issues.filter((issue) => issue.dimension === dimension);
  if (DIMENSION_UNIT[dimension] === 'filas') {
    return { affected: new Set(issues.map((i) => i.row)).size, total: item.rows.length };
  }
  return {
    affected: new Set(issues.map((i) => `${i.row}|${i.column}`)).size,
    total: item.rows.length * item.checkedColumns,
  };
}

/**
 * A small table audited one quality dimension at a time: the cells or rows
 * that fail the current dimension are highlighted and each dimension gets a
 * score, the share of units that pass it.
 */
export function DimensionsView({
  title,
  caseId,
  focus,
}: {
  title: string;
  caseId: DimensionCaseId;
  focus?: QualityDimension;
}) {
  const item = DIMENSION_CASES[caseId];
  const dimensions: readonly QualityDimension[] = focus ? [focus] : QUALITY_DIMENSIONS;
  const total = dimensions.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${caseId}|${focus ?? ''}|${run}`, () =>
    reducedMotion ? total : 1,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: DIMENSIONS_PER_SECOND,
    done: shown >= total,
  });
  const audited = dimensions.slice(0, shown);
  const current = audited[audited.length - 1] ?? dimensions[0] ?? 'completitud';
  const marked = item.issues.filter((issue) => audited.includes(issue.dimension));
  const active = item.issues.filter((issue) => issue.dimension === current);
  const isCell = (list: typeof marked, r: number, c: number) =>
    list.some((i) => i.row === r && (i.column === c || i.column === -1));
  const scores = audited.map((d) => {
    const s = dimensionScore(item, d);
    return 1 - s.affected / s.total;
  });
  const cur = dimensionScore(item, current);
  const header = `\\text{${DIMENSION_NAMES[current]}} = 1 - \\frac{${cur.affected}}{${cur.total}\\ \\text{${DIMENSION_UNIT[current]}}} = ${formatNumber(1 - cur.affected / cur.total, 3)}`;
  const description =
    `${item.name}. Dimensión revisada: ${DIMENSION_NAMES[current]}. ${DIMENSION_QUESTIONS[current]} ` +
    `${cur.affected} de ${cur.total} ${DIMENSION_UNIT[current]} con problema. ` +
    active.map((i) => `Fila ${i.row + 1}: ${i.note}.`).join(' ');

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      readouts={audited.map((d, i) => ({
        label: DIMENSION_NAMES[d],
        value: formatNumber(scores[i] ?? 0, 3),
        ...(d === current ? { color: DATA_COLORS.highlight } : {}),
      }))}
      description={description}
      dataTable={{
        caption: 'Problemas detectados',
        columns: ['Fila', 'Dimensión', 'Problema'],
        rows: item.issues.map((i) => [i.row + 1, DIMENSION_NAMES[i.dimension], i.note]),
      }}
    >
      <FormulaLine tex={header} />
      <p className={styles.stage}>
        <strong>{DIMENSION_NAMES[current]}.</strong> {DIMENSION_QUESTIONS[current]}
      </p>
      <div className={styles.tableScroll} role="region" aria-label={item.name} tabIndex={0}>
        <table className={styles.table}>
          <caption className="visually-hidden">{item.name}</caption>
          <thead>
            <tr>
              {item.columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {item.rows.map((row, r) => (
              <tr key={r}>
                {row.map((value, c) => {
                  const classes = [
                    styles.mono,
                    isCell(marked, r, c) ? styles.bad : '',
                    isCell(active, r, c) ? styles.active : '',
                    value === '' ? styles.empty : '',
                  ].join(' ');
                  return (
                    <td key={c} className={classes}>
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
        {active.map((i) => (
          <li key={`${i.row}-${i.column}-${i.note}`}>
            Fila {i.row + 1}: {i.note}.
          </li>
        ))}
      </ul>
      <HBars
        labels={audited.map((d) => DIMENSION_NAMES[d])}
        values={scores}
        highlight={audited.length - 1}
        axisLabel="Proporción de unidades sin problema"
        decimals={2}
        domain={[0, 1]}
        label={`Puntajes por dimensión: ${audited.map((d, i) => `${DIMENSION_NAMES[d]} ${formatNumber(scores[i] ?? 0, 2)}`).join(', ')}`}
      />
    </VizFrame>
  );
}
