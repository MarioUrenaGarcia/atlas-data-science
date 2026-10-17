import type { VisualizationProps } from '../../types.ts';
import { CopulaView } from './CopulaView.tsx';
import type { CopulaVizConfig } from './schema.ts';
import { SklarView } from './SklarView.tsx';
import { TailView } from './TailView.tsx';

/**
 * Copulas: the dependence between two variables separated from their
 * marginals. Simulated pairs on the unit square, Sklar's construction with
 * arbitrary marginals, and tail dependence in the corners.
 */
export default function CopulaViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as CopulaVizConfig;
  switch (config.modo) {
    case 'copula':
      return <CopulaView title={title} conceptId={conceptId} config={config} />;
    case 'sklar':
      return <SklarView title={title} conceptId={conceptId} config={config} />;
    case 'colas':
      return <TailView title={title} conceptId={conceptId} config={config} />;
  }
}
