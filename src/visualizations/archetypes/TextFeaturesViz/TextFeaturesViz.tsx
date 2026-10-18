import type { VisualizationProps } from '../../types.ts';
import { BowView } from './BowView.tsx';
import { NgramView } from './NgramView.tsx';
import type { TextFeaturesConfig } from './schema.ts';
import { TfidfView } from './TfidfView.tsx';

/** Text turned into numeric features: word counts, tf-idf weights and n-grams. */
export default function TextFeaturesViz({ params, title }: VisualizationProps) {
  const config = params as unknown as TextFeaturesConfig;
  switch (config.modo) {
    case 'bolsa':
      return (
        <BowView title={title} corpusId={config.corpus} removeStop={config.sinVacias ?? false} />
      );
    case 'tfidf':
      return <TfidfView title={title} corpusId={config.corpus} />;
    case 'ngramas':
      return <NgramView title={title} corpusId={config.corpus} n={config.n ?? 2} />;
  }
}
