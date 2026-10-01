import type { VisualizationProps } from '../../types.ts';
import { BetsView } from './BetsView.tsx';
import { ConditionalView } from './ConditionalView.tsx';
import { EventsView } from './EventsView.tsx';
import { FrequencyView } from './FrequencyView.tsx';
import { MeasureView } from './MeasureView.tsx';
import type { SampleSpaceLabConfig } from './schema.ts';
import { UnionView } from './UnionView.tsx';

/**
 * Finite probability spaces of coins, dice and cards: events as sets of
 * outcomes, the addition rule, relative frequencies of repeated trials,
 * probability assignments checked against the axioms and degrees of belief
 * as betting prices.
 */
export default function SampleSpaceLab({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as SampleSpaceLabConfig;
  switch (config.modo) {
    case 'eventos':
      return <EventsView title={title} config={config} />;
    case 'union':
      return <UnionView title={title} config={config} />;
    case 'frecuencia':
      return <FrequencyView title={title} conceptId={conceptId} config={config} />;
    case 'medida':
      return <MeasureView title={title} config={config} />;
    case 'apuestas':
      return <BetsView title={title} config={config} />;
    case 'condicional':
      return <ConditionalView title={title} config={config} />;
  }
}
