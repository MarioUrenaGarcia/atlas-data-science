import type { VisualizationProps } from '../../types.ts';
import { ConditionalView } from './ConditionalView.tsx';
import { CovarianceMatrixView } from './CovarianceMatrixView.tsx';
import { CovarianceView } from './CovarianceView.tsx';
import { IndependenceView } from './IndependenceView.tsx';
import { JointCdfView } from './JointCdfView.tsx';
import { MarginalsView } from './MarginalsView.tsx';
import type { JointDistribution2DConfig } from './schema.ts';
import { SumView } from './SumView.tsx';
import { TotalLawView } from './TotalLawView.tsx';

/**
 * Joint distributions of two random variables, as tables or discretized
 * densities: the joint distribution function, marginals, conditionals and
 * conditional expectation, the laws of total expectation and variance,
 * independence as factorization, covariance as a signed sum, the
 * distribution of the sum, and the covariance matrix of the bivariate normal.
 */
export default function JointDistribution2D({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as JointDistribution2DConfig;
  switch (config.modo) {
    case 'conjunta':
      return <JointCdfView title={title} config={config} />;
    case 'marginales':
      return <MarginalsView title={title} config={config} />;
    case 'condicional':
      return <ConditionalView title={title} config={config} regression={false} />;
    case 'esperanza-condicional':
      return <ConditionalView title={title} config={config} regression />;
    case 'esperanza-total':
      return <TotalLawView title={title} config={config} variance={false} />;
    case 'varianza-total':
      return <TotalLawView title={title} config={config} variance />;
    case 'independencia':
      return <IndependenceView title={title} config={config} />;
    case 'covarianza':
      return <CovarianceView title={title} config={config} />;
    case 'suma':
      return <SumView title={title} config={config} />;
    case 'matriz-covarianza':
      return <CovarianceMatrixView title={title} conceptId={conceptId} config={config} />;
  }
}
