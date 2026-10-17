import { defaultSeed } from '../../core/defaultSeed.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import type { VisualizationProps } from '../../types.ts';
import { AncillaryView } from './AncillaryView.tsx';
import { CompletenessView } from './CompletenessView.tsx';
import { FactorizationView } from './FactorizationView.tsx';
import { RaoBlackwellView } from './RaoBlackwellView.tsx';
import type { SufficiencyLabConfig } from './schema.ts';
import { SequencesView } from './SequencesView.tsx';

/** Sufficiency and its consequences: grouping of samples, factorized likelihoods, Rao-Blackwell, completeness and Basu. */
export default function SufficiencyLab({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as SufficiencyLabConfig;
  const seed = useSeed(defaultSeed(conceptId, 'semilla' in config ? config.semilla : undefined));
  switch (config.modo) {
    case 'suficiencia':
      return (
        <SequencesView title={title} n={config.n ?? 4} partition={config.particion ?? 'suma'} />
      );
    case 'factorizacion':
      return (
        <FactorizationView
          title={title}
          samples={config.muestras}
          sigma={config.sigma ?? 1}
          model={config.modelo ?? 'normal'}
        />
      );
    case 'rao-blackwell':
      return (
        <RaoBlackwellView
          title={title}
          lambda={config.lambda ?? 1.5}
          n={config.n ?? 10}
          seed={seed}
        />
      );
    case 'completitud':
      return <CompletenessView title={title} g={config.g ?? [1, -1, 1, -1]} />;
    case 'ancilar':
      return (
        <AncillaryView title={title} n={config.n ?? 5} sigma={config.sigma ?? 1} seed={seed} />
      );
  }
}
