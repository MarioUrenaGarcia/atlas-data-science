import { useState } from 'react';
import {
  cosineSimilarity,
  countMatrix,
  ngrams,
  tokenize,
  vocabulary,
} from '../../../lib/dataprep/text.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CORPORA } from './corpora.ts';
import { heatStyle } from './heat.ts';
import type { CorpusId } from './schema.ts';
import styles from './TextFeaturesViz.module.css';

const WINDOWS_PER_SECOND = 2.5;

/**
 * A window of n words slides over each document; every position produces
 * one n-gram. Bigrams keep a little of the word order that the bag of words
 * loses, such as "no es" before "bueno".
 */
export function NgramView({
  title,
  corpusId,
  n,
}: {
  title: string;
  corpusId: CorpusId;
  n: number;
}) {
  const corpus = CORPORA[corpusId];
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'n',
      label: 'Longitud del n-grama',
      min: 1,
      max: 3,
      step: 1,
      default: n,
      symbol: 'n',
    },
  ];
  const parameters = useParameters(definitions);
  const size = Number(parameters.values.n);
  const tokens = corpus.documents.map((d) => tokenize(d));
  const grams = tokens.map((t) => ngrams(t, size));
  const vocab = vocabulary(grams);
  const counts = countMatrix(grams, vocab);
  const unigramCounts = countMatrix(tokens, vocabulary(tokens));
  const flat = grams.flatMap((g, d) => g.map((_, k) => ({ d, k })));
  const total = flat.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${corpusId}|${size}|${run}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: WINDOWS_PER_SECOND,
    done: shown >= total,
  });
  const current = shown > 0 ? flat[shown - 1] : undefined;
  const partial = countMatrix(
    grams.map((g, d) =>
      g.filter((_, k) => flat.slice(0, shown).some((f) => f.d === d && f.k === k)),
    ),
    vocab,
  );
  const max = Math.max(1, ...counts.flat());
  const sim = cosineSimilarity(counts[0] ?? [], counts[1] ?? []);
  const simUni = cosineSimilarity(unigramCounts[0] ?? [], unigramCounts[1] ?? []);
  const gram = current ? (grams[current.d]?.[current.k] ?? '') : '';
  const header = current
    ? `\\text{doc } ${current.d + 1},\\ \\text{posición } ${current.k + 1}:\\ \\text{"${gram}"}`
    : `\\text{un documento de } L \\text{ palabras tiene } L - n + 1 \\text{ n-gramas}`;
  const description =
    `${corpus.name} con n-gramas de longitud ${size}: ${vocab.length} n-gramas distintos. ` +
    `Similitud coseno de los documentos 1 y 2: ${formatNumber(simUni, 3)} con palabras sueltas y ${formatNumber(sim, 3)} con n-gramas de longitud ${size}.`;

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Ventanas recorridas', value: `${shown} de ${total}` },
        { label: 'N-gramas distintos', value: String(vocab.length), color: DATA_COLORS.highlight },
        { label: 'Similitud docs 1 y 2, palabras sueltas', value: formatNumber(simUni, 3) },
        { label: `Similitud docs 1 y 2, n = ${size}`, value: formatNumber(sim, 3) },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {tokens.map((t, d) => (
        <p key={d} className={styles.doc}>
          <span className={styles.docLabel}>Doc {d + 1}</span>
          {t.map((w, k) => {
            const inWindow = current?.d === d && k >= current.k && k < current.k + size;
            return (
              <span key={k} className={`${styles.tokenChip} ${inWindow ? styles.tokenNew : ''}`}>
                {w}
              </span>
            );
          })}
        </p>
      ))}
      <div
        className={styles.tableScroll}
        role="region"
        aria-label="Conteos de n-gramas"
        tabIndex={0}
      >
        <table className={styles.table}>
          <caption className="visually-hidden">Conteo de cada n-grama por documento</caption>
          <thead>
            <tr>
              <th scope="col">Documento</th>
              {vocab.map((g) => (
                <th key={g} scope="col" className={g === gram ? styles.ok : undefined}>
                  {g}
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
