import type { VisualizationProps } from '../../types.ts';
import { ReservoirView } from './ReservoirView.tsx';
import type { SamplingProcessConfig } from './schema.ts';
import { SnowballView } from './SnowballView.tsx';
import { SurvivalView } from './SurvivalView.tsx';

/** Sampling procedures that unfold over time: streams, referral chains and attrition. */
export default function SamplingProcess({ params, title, conceptId }: VisualizationProps) {
  const config = params as unknown as SamplingProcessConfig;
  switch (config.modo) {
    case 'reservorio':
      return <ReservoirView config={config} title={title} conceptId={conceptId} />;
    case 'bola-de-nieve':
      return <SnowballView config={config} title={title} conceptId={conceptId} />;
    case 'supervivencia':
      return <SurvivalView config={config} title={title} conceptId={conceptId} />;
  }
}
