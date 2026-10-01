import { defaultSeed } from '../../core/defaultSeed.ts';
import type { VisualizationProps } from '../../types.ts';
import { IteratedLogView } from './IteratedLogView.tsx';
import { LargeDeviationsView } from './LargeDeviationsView.tsx';
import { MeansView } from './MeansView.tsx';
import type { LargeNumbersConfig } from './schema.ts';

const DEFAULT_EPSILON = 0.1;
const DEFAULT_PATHS = 60;
const DEFAULT_HORIZON = 1000;
const DEFAULT_WALKS = 20;
const DEFAULT_WALK_LENGTH = 20000;
const DEFAULT_N_MAX = 150;

/** Laws of large numbers, the law of the iterated logarithm and large deviations. */
export default function LargeNumbers({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as LargeNumbersConfig;
  switch (config.modo) {
    case 'debil':
    case 'fuerte':
      return (
        <MeansView
          key={config.modo}
          title={title}
          strong={config.modo === 'fuerte'}
          population={config.poblacion}
          populations={config.poblaciones ?? [config.poblacion]}
          epsilon={config.epsilon ?? DEFAULT_EPSILON}
          count={config.trayectorias ?? DEFAULT_PATHS}
          horizon={config.horizonte ?? DEFAULT_HORIZON}
          logX={config.escalaLog ?? false}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'logaritmo-iterado':
      return (
        <IteratedLogView
          title={title}
          count={config.trayectorias ?? DEFAULT_WALKS}
          horizon={config.horizonte ?? DEFAULT_WALK_LENGTH}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'grandes-desviaciones':
      return (
        <LargeDeviationsView
          title={title}
          population={config.poblacion}
          populations={config.poblaciones ?? [config.poblacion]}
          a={config.a}
          nMax={config.nMaximo ?? DEFAULT_N_MAX}
        />
      );
  }
}
