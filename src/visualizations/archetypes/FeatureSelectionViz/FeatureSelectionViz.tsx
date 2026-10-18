import { defaultSeed } from '../../core/defaultSeed.ts';
import type { VisualizationProps } from '../../types.ts';
import { CurseView } from './CurseView.tsx';
import { EmbeddedView } from './EmbeddedView.tsx';
import { FilterView } from './FilterView.tsx';
import { MiView } from './MiView.tsx';
import { RfeView } from './RfeView.tsx';
import type { FeatureSelectionConfig } from './schema.ts';
import { WrapperView } from './WrapperView.tsx';

/** High dimension and the methods that choose which variables to keep. */
export default function FeatureSelectionViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as FeatureSelectionConfig;
  const seed = defaultSeed(conceptId, config.semilla);
  switch (config.modo) {
    case 'dimensionalidad':
      return <CurseView title={title} maxDimensions={config.dimensiones ?? 1000} seed={seed} />;
    case 'filtro':
      return <FilterView title={title} k={config.k ?? 3} seed={seed} />;
    case 'envoltura':
      return <WrapperView title={title} seed={seed} />;
    case 'embebida':
      return <EmbeddedView title={title} seed={seed} />;
    case 'informacion':
      return <MiView title={title} variable={config.variable ?? 3} seed={seed} />;
    case 'rfe':
      return <RfeView title={title} seed={seed} />;
  }
}
