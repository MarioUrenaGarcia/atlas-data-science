import type { VisualizationProps } from '../../types.ts';
import { ConcentrationView } from './ConcentrationView.tsx';
import { HolderView } from './HolderView.tsx';
import { JensenView } from './JensenView.tsx';
import { McDiarmidView } from './McDiarmidView.tsx';
import { MeasureConcentrationView } from './MeasureConcentrationView.tsx';
import type { InequalityBoundConfig } from './schema.ts';
import { TailBoundView } from './TailBoundView.tsx';
import { UnionView } from './UnionView.tsx';

/**
 * Probability inequalities against the quantities they bound: moment tail
 * bounds, exponential concentration of averages, Jensen's inequality, the
 * Cauchy and Schwarz and Hölder inequalities, the union bound, bounded
 * differences and the concentration of measure in high dimension.
 */
export default function InequalityBound({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as InequalityBoundConfig;
  switch (config.modo) {
    case 'cola':
      return <TailBoundView title={title} config={config} />;
    case 'concentracion':
      return <ConcentrationView title={title} config={config} />;
    case 'jensen':
      return <JensenView title={title} config={config} />;
    case 'holder':
      return <HolderView title={title} config={config} />;
    case 'union':
      return <UnionView title={title} config={config} />;
    case 'mcdiarmid':
      return <McDiarmidView title={title} conceptId={conceptId} config={config} />;
    case 'medida':
      return <MeasureConcentrationView title={title} conceptId={conceptId} config={config} />;
  }
}
