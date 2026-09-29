import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { NOTATIONS, type NotationId } from './catalog.ts';
import styles from './SequenceSeries.module.css';

const TERMS_PER_SECOND = 1.5;

interface NotationViewProps {
  title: string;
  expression: NotationId;
  expressions: readonly NotationId[];
  n: number;
}

function termValueLatex(value: number): string {
  return Number.isInteger(value) ? String(value) : formatNumber(value, 3);
}

/** The index i runs from 1 to n; each value of the general term is written out and accumulated. */
export function NotationView({ title, expression, expressions, n }: NotationViewProps) {
  const definitions = useMemo(
    () => [
      ...(expressions.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'expresion',
              label: 'Expresión',
              options: expressions.map((id) => ({ value: id, label: NOTATIONS[id].label })),
              default: expression,
            },
          ]
        : []),
      {
        type: 'number' as const,
        key: 'n',
        label: 'Límite superior',
        symbol: 'n',
        min: 1,
        max: 12,
        step: 1,
        default: n,
      },
    ],
    [expressions, expression, n],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (expressions.length > 1 ? String(values.expresion) : expression) as NotationId;
  const upper = Number(values.n);
  const definition = NOTATIONS[selected];
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${selected}|${upper}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(upper, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: TERMS_PER_SECOND,
    done: shown >= upper,
  });
  const isSum = definition.kind === 'suma';
  const terms = Array.from({ length: shown }, (_, index) => definition.term(index + 1));
  const accumulated = terms.reduce(
    (total, term) => (isSum ? total + term : total * term),
    isSum ? 0 : 1,
  );
  const operator = isSum ? '\\sum' : '\\prod';
  const joiner = isSum ? ' + ' : ' \\cdot ';
  const expansion = shown === 0 ? (isSum ? '0' : '1') : terms.map(termValueLatex).join(joiner);
  const closed = definition.closedForm ? definition.closedForm(upper) : null;
  const complete = shown >= upper;
  const description =
    `${definition.label} con i de 1 a ${upper}. Se han escrito ${shown} términos: ${terms.map((term) => formatNumber(term, 3)).join(isSum ? ' más ' : ' por ')}. ` +
    `Valor acumulado ${formatNumber(accumulated, 4)}.` +
    (complete && definition.closedLatex ? ` Coincide con la fórmula cerrada.` : '');

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Índice i', value: shown === 0 ? 'sin empezar' : String(shown) },
        {
          label: 'Término actual',
          value: shown === 0 ? 'ninguno' : formatNumber(terms[shown - 1] ?? 0, 4),
        },
        {
          label: isSum ? 'Suma acumulada' : 'Producto acumulado',
          value: formatNumber(accumulated, 4),
          color: DATA_COLORS.primary,
        },
        ...(closed !== null
          ? [
              {
                label: 'Fórmula cerrada',
                value: formatNumber(closed, 4),
                color: DATA_COLORS.secondary,
              },
            ]
          : []),
      ]}
      description={description}
    >
      <div className={styles.notationBlock}>
        <Latex tex={`${operator}_{i=1}^{${upper}} ${definition.termLatex}`} display />
        <div className={styles.indexRow} aria-hidden="true">
          {Array.from({ length: upper }, (_, index) => (
            <span
              key={index}
              className={
                index < shown ? `${styles.indexChip} ${styles.indexDone}` : styles.indexChip
              }
            >
              i = {index + 1}
            </span>
          ))}
        </div>
        <Latex
          tex={`= ${expansion}${complete ? '' : isSum ? ' + \\cdots' : ' \\cdot \\cdots'}`}
          display
        />
        <Latex tex={`= ${termValueLatex(accumulated)}`} display />
        {complete && definition.closedLatex && (
          <p className={styles.closed}>
            <Latex
              tex={`${operator}_{i=1}^{n} ${definition.termLatex} = ${definition.closedLatex}`}
            />
            {closed !== null && (
              <>
                {' '}
                , con n = {upper}: {formatNumber(closed, 4)}
              </>
            )}
          </p>
        )}
      </div>
    </VizFrame>
  );
}
