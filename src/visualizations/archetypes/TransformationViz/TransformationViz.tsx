import type { VisualizationProps } from '../../types.ts';
import { CdfMethodView } from './CdfMethodView.tsx';
import { JacobianView } from './JacobianView.tsx';
import { QuantileMapView } from './QuantileMapView.tsx';
import type { TransformationVizConfig } from './schema.ts';

/**
 * Transformations of a continuous random variable: the CDF method, the
 * change of variables formula with its Jacobian, the probability integral
 * transform and inverse transform sampling.
 */
export default function TransformationViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as TransformationVizConfig;
  switch (config.modo) {
    case 'cdf':
      return <CdfMethodView title={title} config={config} />;
    case 'jacobiano':
      return <JacobianView title={title} conceptId={conceptId} config={config} />;
    case 'integral-probabilidad':
      return (
        <QuantileMapView title={title} conceptId={conceptId} config={config} inverse={false} />
      );
    case 'transformada-inversa':
      return <QuantileMapView title={title} conceptId={conceptId} config={config} inverse />;
  }
}
