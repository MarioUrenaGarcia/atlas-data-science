import { defaultSeed } from '../../core/defaultSeed.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import type { VisualizationProps } from '../../types.ts';
import { CochranView } from './CochranView.tsx';
import { PivotView } from './PivotView.tsx';
import type { SamplingLabConfig } from './schema.ts';
import { StandardErrorView } from './StandardErrorView.tsx';

const DEFAULT_N_MAX = 200;
const DEFAULT_N = 10;

/** Experiments on sampling distributions: standard error against n, Cochran's theorem and pivots. */
export default function SamplingLab({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as SamplingLabConfig;
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  switch (config.modo) {
    case 'error-estandar':
      return (
        <StandardErrorView
          title={title}
          population={config.poblacion}
          nMax={config.nMaximo ?? DEFAULT_N_MAX}
          seed={seed}
        />
      );
    case 'cochran':
      return (
        <CochranView
          title={title}
          population={config.poblacion}
          n={config.n ?? DEFAULT_N}
          seed={seed}
        />
      );
    case 'pivote':
      return (
        <PivotView
          title={title}
          population={config.poblacion}
          n={config.n ?? DEFAULT_N}
          mu={config.media ?? 0}
          sigma={config.desviacion ?? 1}
          seed={seed}
        />
      );
  }
}
