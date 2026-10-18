import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataProjectViz.module.css';
import { HBars } from '../../shared/HBars.tsx';
import { bestIndex, QUESTION_CASES } from './questionCases.ts';
import type { QuestionCaseId } from './schema.ts';

const STEPS_PER_SECOND = 0.8;

/**
 * A business question is refined into an analytic one piece by piece. The
 * bars show that the vague question has no single answer: each operational
 * definition of "best" crowns a different entity.
 */
export function QuestionView({
  title,
  caseId,
  definition,
}: {
  title: string;
  caseId: QuestionCaseId;
  definition: number;
}) {
  const item = QUESTION_CASES[caseId];
  const total = item.refinements.length;
  const definitions: ParameterDefinition[] = [
    {
      type: 'select',
      key: 'definicion',
      label: 'Definición operativa de "mejor"',
      options: item.definitions.map((d, i) => ({
        value: String(i),
        label: i === item.analytic ? `${d.label} (pregunta analítica)` : d.label,
      })),
      default: String(Math.min(definition, item.definitions.length - 1)),
    },
  ];
  const parameters = useParameters(definitions);
  const selected = Number(parameters.values.definicion);
  const current = item.definitions[selected] ?? item.definitions[0];
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState(`${caseId}|${run}`, () => (reducedMotion ? total : 0));
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: shown >= total,
  });
  if (!current) return null;
  const best = bestIndex(current);
  const winners = new Set(item.definitions.map((d) => bestIndex(d)));
  const unit = current.unit;
  const description =
    `Pregunta de negocio: ${item.business} ` +
    (shown > 0
      ? `Pregunta analítica en construcción: ${item.refinements
          .slice(0, shown)
          .map((r) => r.fragment)
          .join(' ')} `
      : '') +
    `Con la definición "${current.label}", la mejor es ${item.entities[best] ?? ''} ` +
    `(${formatNumber(current.values[best] ?? 0, current.decimals)} ${unit}).`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Refinamientos', value: `${shown} de ${total}` },
        {
          label: 'Mejor según esta definición',
          value: item.entities[best] ?? '',
          color: DATA_COLORS.highlight,
        },
        { label: 'Ganadores distintos entre definiciones', value: String(winners.size) },
      ]}
      description={description}
      dataTable={{
        caption: 'Valor de cada unidad bajo cada definición',
        columns: ['Unidad', ...item.definitions.map((d) => `${d.label} (${d.unit})`)],
        rows: item.entities.map((name, i) => [
          name,
          ...item.definitions.map((d) => formatNumber(d.values[i] ?? 0, d.decimals)),
        ]),
      }}
    >
      <p className={styles.request}>Pregunta de negocio: {item.business}</p>
      <ul className={styles.steps} aria-label="Preguntas para precisar">
        {item.refinements.map((r, i) => (
          <li
            key={r.prompt}
            className={`${styles.stepChip} ${i < shown ? styles.stepChipDone : ''}`}
          >
            {r.prompt}
          </li>
        ))}
      </ul>
      <p className={styles.sentence} aria-live="off">
        {shown === 0 ? (
          <span className={styles.piece}>La pregunta todavía admite muchas respuestas.</span>
        ) : (
          item.refinements.slice(0, shown).map((r, i) => (
            <span key={r.prompt}>
              <span
                className={`${styles.piece} ${i === shown - 1 ? styles.pieceNew : styles.pieceOld}`}
              >
                {r.fragment}
              </span>{' '}
            </span>
          ))
        )}
      </p>
      <HBars
        labels={item.entities}
        values={current.values}
        highlight={best}
        axisLabel={`${current.label} (${current.unit})`}
        decimals={current.decimals}
        label={description}
      />
    </VizFrame>
  );
}
