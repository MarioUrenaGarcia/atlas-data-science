/** Lowercase words, without punctuation, optionally without stop words. */
export function tokenize(text: string, stopWords: ReadonlySet<string> = new Set()): string[] {
  return text
    .toLowerCase()
    .replace(/[.,;:!?¡¿"()]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0 && !stopWords.has(w));
}

/** Contiguous sequences of n tokens, joined by spaces. */
export function ngrams(tokens: readonly string[], n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i + n <= tokens.length; i += 1) out.push(tokens.slice(i, i + n).join(' '));
  return out;
}

/** Vocabulary in order of first appearance. */
export function vocabulary(documents: readonly (readonly string[])[]): string[] {
  const seen = new Set<string>();
  const vocab: string[] = [];
  for (const doc of documents) {
    for (const t of doc) {
      if (!seen.has(t)) {
        seen.add(t);
        vocab.push(t);
      }
    }
  }
  return vocab;
}

/** Document-term count matrix: one row per document, one column per vocabulary term. */
export function countMatrix(
  documents: readonly (readonly string[])[],
  vocab: readonly string[],
): number[][] {
  return documents.map((doc) => vocab.map((t) => doc.filter((w) => w === t).length));
}

/** Number of documents that contain each term. */
export function documentFrequency(counts: readonly (readonly number[])[]): number[] {
  const columns = counts[0]?.length ?? 0;
  return Array.from(
    { length: columns },
    (_, j) => counts.filter((row) => (row[j] ?? 0) > 0).length,
  );
}

/** Inverse document frequency log(N / df); terms present in every document get 0. */
export function inverseDocumentFrequency(df: readonly number[], documents: number): number[] {
  return df.map((d) => (d === 0 ? 0 : Math.log(documents / d)));
}

/** tf-idf weights with tf = count / document length. */
export function tfidf(counts: readonly (readonly number[])[]): {
  tf: number[][];
  idf: number[];
  weights: number[][];
} {
  const idf = inverseDocumentFrequency(documentFrequency(counts), counts.length);
  const tf = counts.map((row) => {
    const total = row.reduce((a, b) => a + b, 0) || 1;
    return row.map((c) => c / total);
  });
  const weights = tf.map((row) => row.map((v, j) => v * (idf[j] ?? 0)));
  return { tf, idf, weights };
}

/** Cosine similarity of two vectors; 0 when either is all zeros. */
export function cosineSimilarity(a: readonly number[], b: readonly number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  a.forEach((v, i) => {
    const w = b[i] ?? 0;
    dot += v * w;
    na += v * v;
    nb += w * w;
  });
  return na === 0 || nb === 0 ? 0 : dot / Math.sqrt(na * nb);
}
