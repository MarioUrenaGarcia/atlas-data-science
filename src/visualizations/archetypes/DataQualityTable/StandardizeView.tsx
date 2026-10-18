import { useState } from 'react';
import { distinctValues, standardize } from '../../../lib/dataprep/quality.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { HBars } from '../../shared/HBars.tsx';
import styles from './Quality.module.css';
import type { StandardizeCaseId } from './schema.ts';
import { CLEANING_STEPS, STANDARDIZE_CASES, STEP_NAMES } from './tableCases.ts';

const STEPS_PER_SECOND = 0.6;
const ALL_STEPS = [...CLEANING_STEPS, 'diccionario'] as const;

/**
 * A free-text column is cleaned one step at a time; after each step the
 * values that became identical merge, and the bars show how many distinct
 * categories remain and how many records each one has.
 */
export function StandardizeView({
  title,
  caseId,
  steps,
}: {
  title: string;
  caseId: StandardizeCaseId;
  steps: number;
}) {
  const item = STANDARDIZE_CASES[caseId];
  const total = Math.min(steps, ALL_STEPS.length);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [applied, update] = useResettableState<number>(`${caseId}|${total}|${run}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: applied >= total,
  });
  const active = ALL_STEPS.slice(0, applied);
  const cleaning = active.filter((s) => s !== 'diccionario') as (typeof CLEANING_STEPS)[number][];
  const dictionary = active.includes('diccionario') ? item.dictionary : {};
  const current = item.values.map((v) => standardize(v, cleaning, dictionary));
  const counts = new Map<string, number>();
  current.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const before = distinctValues(item.values);
  const after = counts.size;
  const lastStep = active[active.length - 1];
  const header = `\\text{categorías distintas: } ${before} \\to ${after}`;
  const description =
    `${item.name}. Pasos aplicados: ${active.length === 0 ? 'ninguno' : active.map((s) => STEP_NAMES[s].toLowerCase()).join(', ')}. ` +
    `Categorías distintas: ${after} de ${before} originales. ` +
    sorted.map(([v, c]) => `"${v}": ${c}`).join(', ') +
    '.';

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      readouts={[
        { label: 'Categorías originales', value: String(before) },
        { label: 'Categorías actuales', value: String(after), color: DATA_COLORS.highlight },
        { label: 'Registros', value: String(item.values.length) },
        { label: 'Último paso', value: lastStep ? STEP_NAMES[lastStep] : 'ninguno' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ul className={styles.steps} aria-label="Pasos de estandarización">
        {ALL_STEPS.slice(0, total).map((s, i) => (
          <li
            key={s}
            className={`${styles.chip} ${i < applied - 1 ? styles.chipDone : ''} ${i === applied - 1 ? styles.chipActive : ''}`}
          >
            {i + 1}. {STEP_NAMES[s]}
          </li>
        ))}
      </ul>
      <div className={styles.pair}>
        <div
          className={styles.tableScroll}
          role="region"
          aria-label={`Valores de ${item.column}`}
          tabIndex={0}
        >
          <table className={styles.table}>
            <caption className="visually-hidden">{item.name}</caption>
            <thead>
              <tr>
                <th scope="col">{item.column} original</th>
                <th scope="col">Valor estandarizado</th>
              </tr>
            </thead>
            <tbody>
              {item.values.map((v, i) => (
                <tr key={i}>
                  <td className={`${styles.mono} ${styles.pre}`}>{`"${v}"`}</td>
                  <td
                    className={`${styles.mono} ${styles.pre} ${current[i] !== v ? styles.ok : ''}`}
                  >{`"${current[i] ?? ''}"`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <HBars
          labels={sorted.map(([v]) => (v.trim() === '' ? '(vacío)' : v.trim()))}
          values={sorted.map(([, c]) => c)}
          highlight={-1}
          axisLabel="Registros por categoría"
          decimals={0}
          label={description}
        />
      </div>
    </VizFrame>
  );
}
