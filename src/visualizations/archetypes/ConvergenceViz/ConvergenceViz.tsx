import { defaultSeed } from '../../core/defaultSeed.ts';
import type { VisualizationProps } from '../../types.ts';
import { DistributionModeView } from './DistributionModeView.tsx';
import { PathModeView } from './PathModeView.tsx';
import { RelationsView } from './RelationsView.tsx';
import type { ConvergenceVizConfig } from './schema.ts';

const DEFAULT_EPSILON = 0.1;
const DEFAULT_PATHS = 100;
const DEFAULT_HORIZON = 300;
const DEFAULT_N_MAX = 60;

/** Modes of convergence of random sequences and the implications between them. */
export default function ConvergenceViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as ConvergenceVizConfig;
  switch (config.modo) {
    case 'probabilidad':
    case 'casi-segura':
    case 'media-cuadratica':
      return (
        <PathModeView
          key={config.modo}
          title={title}
          mode={config.modo}
          sequence={config.sucesion}
          sequences={config.sucesiones ?? [config.sucesion]}
          epsilon={config.epsilon ?? DEFAULT_EPSILON}
          count={config.trayectorias ?? DEFAULT_PATHS}
          horizon={config.horizonte ?? DEFAULT_HORIZON}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'distribucion':
      return (
        <DistributionModeView
          title={title}
          sequence={config.sucesion}
          sequences={config.sucesiones ?? [config.sucesion]}
          n={config.n ?? 1}
          nMax={config.nMaximo ?? DEFAULT_N_MAX}
          x0={config.x0}
        />
      );
    case 'relaciones':
      return (
        <RelationsView
          title={title}
          sequence={config.sucesion}
          sequences={config.sucesiones ?? [config.sucesion]}
          seed={defaultSeed(conceptId)}
        />
      );
  }
}
