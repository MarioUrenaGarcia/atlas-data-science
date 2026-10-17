import type { VisualizationProps } from '../../types.ts';
import { ExtremesView } from './ExtremesView.tsx';
import { OrderView } from './OrderView.tsx';
import type { OrderStatsVizConfig } from './schema.ts';

/**
 * Order statistics of independent samples: the k-th smallest value with its
 * exact density, and the maximum and minimum with their distribution
 * functions F^n and 1 - (1 - F)^n.
 */
export default function OrderStatsViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as OrderStatsVizConfig;
  return config.modo === 'extremos' ? (
    <ExtremesView title={title} conceptId={conceptId} config={config} />
  ) : (
    <OrderView title={title} conceptId={conceptId} config={config} />
  );
}
