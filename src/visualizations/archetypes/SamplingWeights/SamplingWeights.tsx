import type { VisualizationProps } from '../../types.ts';
import { AllocationView } from './AllocationView.tsx';
import { HorvitzThompsonView } from './HorvitzThompsonView.tsx';
import { PostStratView } from './PostStratView.tsx';
import { RakingView } from './RakingView.tsx';
import type { SamplingWeightsConfig } from './schema.ts';

/** Allocation of a stratified sample and the weights that turn a sample into population estimates. */
export default function SamplingWeights({ params, title, conceptId }: VisualizationProps) {
  const config = params as unknown as SamplingWeightsConfig;
  switch (config.modo) {
    case 'asignacion':
      return <AllocationView config={config} title={title} />;
    case 'postestratificacion':
      return <PostStratView config={config} title={title} />;
    case 'raking':
      return <RakingView config={config} title={title} />;
    case 'horvitz-thompson':
      return <HorvitzThompsonView config={config} title={title} conceptId={conceptId} />;
  }
}
