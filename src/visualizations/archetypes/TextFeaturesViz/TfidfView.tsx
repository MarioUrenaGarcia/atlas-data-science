import { useState } from 'react';
import {
  countMatrix,
  cosineSimilarity,
  documentFrequency,
  tfidf,
  tokenize,
  vocabulary,
} from '../../../lib/dataprep/text.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CORPORA } from './corpora.ts';
import { heatStyle } from './heat.ts';
import type { CorpusId } from './schema.ts';
import styles from './TextFeaturesViz.module.css';

const STAGES = [
  'Conteos',
  'Frecuencia relativa en el documento (tf)',
  'Frecuencia inversa en documentos (idf)',
  'Pesos tf-idf',
];
const STAGES_PER_SECOND = 0.5;

/**
 * Counts become tf-idf weights in three steps: divide by the document length,
 * compute how rare each term is across documents, and multiply. Words that
 * appear in every document end with weight zero.
 */
export function TfidfView({ title, corpusId }: { title: string; corpusId: CorpusId }) {
  const corpus = CORPORA[corpusId];
  const docs = corpus.documents.map((d) => tokenize(d));
  const vocab = vocabulary(docs);
  const counts = countMatrix(docs, vocab);
  const df = documentFrequency(counts);
  const { tf, idf, weights } = tfidf(counts);
  const total = STAGES.length - 1;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [stage, update] = useResettableState<number>(`${corpusId}|${run}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STAGES_PER_SECOND,
    done: stage >= total,
  });
  const matrix = stage === 0 ? counts : stage === 1 || stage === 2 ? tf : weights;
  const max = Math.max(1e-9, ...matrix.flat());
  const rarest = vocab[idf.indexOf(Math.max(...idf))] ?? '';
  const zeroIdf = vocab.filter((_, j) => (idf[j] ?? 0) === 0);
  const N = docs.length;
  const j0 = vocab.indexOf(rarest);
  const len0 = (counts[0] ?? []).reduce((a, b) => a + b, 0);
  const f = (v: number) => formatNumber(v, 3);
  const headers = [
    `x_{dt} = \\text{conteo de } t \\text{ en } d`,
    `\\mathrm{tf}_{dt} = \\frac{x_{dt}}{\\sum_{t'} x_{dt'}},\\quad \\text{doc 1 tiene } ${len0} \\text{ palabras}`,
    `\\mathrm{idf}_t = \\log\\frac{N}{\\mathrm{df}_t}:\\quad \\mathrm{idf}_{\\text{${rarest}}} = \\log\\frac{${N}}{${df[j0] ?? 0}} = ${f(idf[j0] ?? 0)}`,
    `w_{dt} = \\mathrm{tf}_{dt} \\cdot \\mathrm{idf}_t`,
  ];
  const sim = cosineSimilarity(weights[0] ?? [], weights[1] ?? []);
  const simCounts = cosineSimilarity(counts[0] ?? [], counts[1] ?? []);
  const description =
    `${corpus.name}. Etapa: ${STAGES[stage]}. Términos que aparecen en todos los documentos, con peso cero: ${zeroIdf.length === 0 ? 'ninguno' : zeroIdf.join(', ')}. ` +
    `Similitud coseno de los documentos 1 y 2: ${f(simCounts)} con conteos y ${f(sim)} con tf-idf.`;

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      readouts={[
        { label: 'Etapa', value: STAGES[stage] ?? '' },
        {
          label: 'Términos con idf igual a 0',
          value: zeroIdf.length === 0 ? 'ninguno' : zeroIdf.join(', '),
          color: DATA_COLORS.highlight,
        },
        { label: 'Similitud docs 1 y 2 con conteos', value: f(simCounts) },
        { label: 'Similitud docs 1 y 2 con tf-idf', value: f(sim) },
      ]}
      description={description}
      dataTable={{
        caption: 'Frecuencia en documentos e idf por término',
        columns: ['Término', 'Documentos que lo contienen', 'idf'],
        rows: vocab.map((t, j) => [t, df[j] ?? 0, f(idf[j] ?? 0)]),
      }}
    >
      <FormulaLine tex={headers[stage] ?? ''} />
      {corpus.documents.map((d, i) => (
        <p key={i} className={styles.doc}>
          <span className={styles.docLabel}>Doc {i + 1}</span>
          {d}
        </p>
      ))}
      <div
        className={styles.tableScroll}
        role="region"
        aria-label="Pesos por documento y término"
        tabIndex={0}
      >
        <table className={styles.table}>
          <caption className="visually-hidden">{STAGES[stage]}</caption>
          <thead>
            <tr>
              <th scope="col">Documento</th>
              {vocab.map((t) => (
                <th key={t} scope="col">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, d) => (
              <tr key={d}>
                <th scope="row">Doc {d + 1}</th>
                {row.map((v, j) => (
                  <td key={j} className={styles.heat} style={heatStyle(v, max)}>
                    {stage === 0 ? v : formatNumber(v, 2)}
                  </td>
                ))}
              </tr>
            ))}
            {stage >= 2 && (
              <tr className={styles.activeRow}>
                <th scope="row">idf</th>
                {idf.map((v, j) => (
                  <td key={j} className={styles.heat}>
                    {formatNumber(v, 2)}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </VizFrame>
  );
}
