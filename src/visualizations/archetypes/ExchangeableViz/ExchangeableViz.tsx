import type { VisualizationProps } from '../../types.ts';
import { DeFinettiView } from './DeFinettiView.tsx';
import { PolyaView } from './PolyaView.tsx';
import type { ExchangeableVizConfig } from './schema.ts';

/**
 * Exchangeable sequences: Pólya urns whose proportions settle at random
 * limits, and de Finetti's representation of the urn as a beta mixture of
 * independent Bernoulli trials.
 */
export default function ExchangeableViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as ExchangeableVizConfig;
  return config.modo === 'de-finetti' ? (
    <DeFinettiView title={title} conceptId={conceptId} config={config} />
  ) : (
    <PolyaView title={title} conceptId={conceptId} config={config} />
  );
}
