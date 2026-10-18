import { useState } from 'react';
import { cosineSimilarity, countMatrix, tokenize, vocabulary } from '../../../lib/dataprep/text.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CORPORA, STOP_WORDS } from './corpora.ts';
import { heatStyle } from './heat.ts';
import type { CorpusId } from './schema.ts';
import styles from './TextFeaturesViz.module.css';

const TOKENS_PER_SECOND = 3;

/**
 * Each document is split into words and every word adds one to its cell in
 * the document-term matrix. The order of the words is lost: only how many
 * times each one appears remains.
 */
export function BowView({
  title,
  corpusId,
  removeStop,
}: {
  title: string;
  corpusId: CorpusId;
  removeStop: boolean;
}) {
  const corpus = CORPORA[corpusId];
  const definitions: ParameterDefinition[] = [
    {
      type: 'toggle',
      key: 'vacias',
      label: 'Quitar palabras vacías (el, la, y, de...)',
      default: removeStop,
    },
  ];
  const parameters = useParameters(definitions);
  const stop = Boolean(parameters.values.vacias);
  const raw = corpus.documents.map((d) => tokenize(d));
  const docs = corpus.documents.map((d) => tokenize(d, stop ? STOP_WORDS : new Set()));
  const vocab = vocabulary(docs);
  const full = countMatrix(docs, vocab);
  const flat = docs.flatMap((doc, d) => doc.map((w) => ({ d, w })));
  const total = flat.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${corpusId}|${stop}|${run}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: TOKENS_PER_SECOND,
    done: shown >= total,
  });
  const partial = countMatrix(
    docs.map((_, d) =>
      flat
        .slice(0, shown)
        .filter((t) => t.d === d)
        .map((t) => t.w),
    ),
    vocab,
  );
  const current = shown > 0 ? flat[shown - 1] : undefined;
  const max = Math.max(1, ...full.flat());
  const zeros = full.flat().filter((v) => v === 0).length;
  const sim = cosineSimilarity(full[0] ?? [], full[1] ?? []);
  const header = current
    ? `\\text{doc } ${current.d + 1}:\\ \\text{"${current.w}"} \\Rightarrow x_{${current.d + 1},\\,\\text{${current.w}}} = ${partial[current.d]?.[vocab.indexOf(current.w)] ?? 0}`
    : `x_{dt} = \\text{veces que aparece el término } t \\text{ en el documento } d`;
  const description =
    `${corpus.name}: ${docs.length} documentos, vocabulario de ${vocab.length} términos${stop ? ' sin palabras vacías' : ''}. ` +
    `${shown} de ${total} palabras contadas. Proporción de ceros en la matriz: ${formatNumber(zeros / (docs.length * vocab.length), 2)}. ` +
    `Similitud coseno entre los documentos 1 y 2: ${formatNumber(sim, 3)}.`;

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Palabras contadas', value: `${shown} de ${total}` },
        {
          label: 'Tamaño del vocabulario',
          value: String(vocab.length),
          color: DATA_COLORS.highlight,
        },
        {
          label: 'Proporción de ceros',
          value: formatNumber(zeros / (docs.length * vocab.length), 2),
        },
        { label: 'Similitud coseno, documentos 1 y 2', value: formatNumber(sim, 3) },
      ]}
      description={description}
      dataTable={{
        caption: 'Similitud coseno entre documentos',
        columns: ['Documento', ...docs.map((_, i) => `Doc ${i + 1}`)],
        rows: full.map((row, i) => [
          `Doc ${i + 1}`,
          ...full.map((other) => formatNumber(cosineSimilarity(row, other), 3)),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      {corpus.documents.map((_, d) => (
        <p key={d} className={styles.doc}>
          <span className={styles.docLabel}>Doc {d + 1}</span>
          {(raw[d] ?? []).map((w, k) => (
            <span
              key={k}
              className={`${styles.tokenChip} ${stop && STOP_WORDS.has(w) ? styles.tokenStop : ''} ${current?.d === d && current.w === w ? styles.tokenNew : ''}`}
            >
              {w}
            </span>
          ))}
        </p>
      ))}
      <div
        className={styles.tableScroll}
        role="region"
        aria-label="Matriz documento término"
        tabIndex={0}
      >
        <table className={styles.table}>
          <caption className="visually-hidden">Matriz documento término</caption>
          <thead>
            <tr>
              <th scope="col">Documento</th>
              {vocab.map((t) => (
                <th key={t} scope="col" className={current?.w === t ? styles.ok : undefined}>
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {partial.map((row, d) => (
              <tr key={d}>
                <th scope="row">Doc {d + 1}</th>
                {row.map((v, j) => (
                  <td key={j} className={styles.heat} style={heatStyle(v, max)}>
                    {v}
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
