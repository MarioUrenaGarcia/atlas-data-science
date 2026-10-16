import type { VisualizationProps } from '../../types.ts';
import { CumulativeView } from './CumulativeView.tsx';
import { ExpectationView } from './ExpectationView.tsx';
import { LinearityView } from './LinearityView.tsx';
import { LotusView } from './LotusView.tsx';
import { MappingView } from './MappingView.tsx';
import { MixedView } from './MixedView.tsx';
import type { RandomVariableLabConfig } from './schema.ts';
import { ShapeView } from './ShapeView.tsx';
import { VarianceView } from './VarianceView.tsx';

/**
 * Random variables and their summaries: the map from outcomes to numbers,
 * the distribution function and quantiles, expectation as a balance point,
 * variance as expected squared distance, expectations of functions (LOTUS),
 * moments and shape, the linearity of expectation, and mixed distributions
 * with point masses and a density.
 */
export default function RandomVariableLab({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as RandomVariableLabConfig;
  switch (config.modo) {
    case 'mapeo':
      return <MappingView title={title} config={config} />;
    case 'acumulada':
      return <CumulativeView title={title} config={config} />;
    case 'esperanza':
      return <ExpectationView title={title} config={config} />;
    case 'varianza':
      return <VarianceView title={title} config={config} />;
    case 'lotus':
      return <LotusView title={title} config={config} />;
    case 'forma':
      return <ShapeView title={title} config={config} />;
    case 'linealidad':
      return <LinearityView title={title} conceptId={conceptId} config={config} />;
    case 'mixta':
      return <MixedView title={title} config={config} />;
  }
}
