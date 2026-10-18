import { useState } from 'react';
import { categoriesOf, oneHot } from '../../../lib/dataprep/features.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './FeatureEngineeringViz.module.css';
import type { OneHotCaseId } from './schema.ts';

const ROWS_PER_SECOND = 1.5;

const CASES: Record<OneHotCaseId, { column: string; values: readonly string[] }> = {
  ciudades: {
    column: 'Ciudad',
    values: ['Mérida', 'Puebla', 'León', 'Mérida', 'Toluca', 'León', 'Puebla', 'Mérida'],
  },
  pagos: {
    column: 'Forma de pago',
    values: ['Efectivo', 'Tarjeta', 'Transferencia', 'Tarjeta', 'Vales', 'Efectivo', 'Tarjeta'],
  },
};

/**
 * A categorical column becomes one 0/1 column per category, filled row by
 * row. Each row has exactly one 1; with all columns kept, they always add up
 * to 1, which duplicates the intercept of a linear model.
 */
export function OneHotView({
  title,
  caseId,
  dropFirst,
}: {
  title: string;
  caseId: OneHotCaseId;
  dropFirst: boolean;
}) {
  const item = CASES[caseId];
  const definitions: ParameterDefinition[] = [
    {
      type: 'toggle',
      key: 'eliminar',
      label: 'Eliminar la primera categoría (referencia)',
      default: dropFirst,
    },
  ];
  const parameters = useParameters(definitions);
  const drop = Boolean(parameters.values.eliminar);
  const categories = categoriesOf(item.values);
  const used = drop ? categories.slice(1) : categories;
  const matrix = oneHot(item.values, categories, drop);
  const total = item.values.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${caseId}|${drop}|${run}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: ROWS_PER_SECOND,
    done: shown >= total,
  });
  const current = shown > 0 ? shown - 1 : -1;
  const row = current >= 0 ? (matrix[current] ?? []) : [];
  const cells = total * used.length;
  const zeros = matrix.flat().filter((v) => v === 0).length;
  const header =
    current >= 0
      ? `\\text{${item.values[current] ?? ''}} \\mapsto (${row.join(',\\ ')})`
      : `x \\mapsto (\\mathbf{1}\\{x = c_1\\}, \\dots, \\mathbf{1}\\{x = c_K\\})`;
  const description =
    `${item.column} con ${categories.length} categorías codificada en ${used.length} columnas binarias` +
    (drop ? `; ${categories[0]} queda como referencia, representada por una fila de ceros.` : '.') +
    ` Proporción de ceros: ${formatNumber(zeros / cells, 2)}.`;

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Categorías', value: String(categories.length) },
        { label: 'Columnas generadas', value: String(used.length), color: DATA_COLORS.highlight },
        { label: 'Proporción de ceros', value: formatNumber(zeros / cells, 2) },
        { label: 'Referencia', value: drop ? (categories[0] ?? '') : 'ninguna' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div
        className={styles.tableScroll}
        role="region"
        aria-label="Codificación one-hot"
        tabIndex={0}
      >
        <table className={styles.table}>
          <caption className="visually-hidden">{description}</caption>
          <thead>
            <tr>
              <th scope="col">{item.column}</th>
              {used.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
              <th scope="col">Suma de la fila</th>
            </tr>
          </thead>
          <tbody>
            {item.values.map((v, i) => (
              <tr key={i} className={i === current ? styles.activeRow : undefined}>
                <td>{v}</td>
                {used.map((c, j) => {
                  const bit = matrix[i]?.[j] ?? 0;
                  return (
                    <td
                      key={c}
                      className={`${styles.bit} ${i < shown && bit === 1 ? styles.bitOn : ''}`}
                    >
                      {i < shown ? bit : ''}
                    </td>
                  );
                })}
                <td className={styles.mono}>
                  {i < shown ? (matrix[i] ?? []).reduce((a, b) => a + b, 0) : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VizFrame>
  );
}
