import { defaultSeed } from '../../core/defaultSeed.ts';
import type { VisualizationProps } from '../../types.ts';
import { BerryEsseenView } from './BerryEsseenView.tsx';
import { ClassicView } from './ClassicView.tsx';
import { ConvolutionView } from './ConvolutionView.tsx';
import { FailureView } from './FailureView.tsx';
import { MultivariateView } from './MultivariateView.tsx';
import type { CentralLimitConfig } from './schema.ts';
import { TriangularView } from './TriangularView.tsx';

const DEFAULT_N = 10;
const DEFAULT_N_MAX = 40;
const DEFAULT_EPSILON = 0.2;
const DEFAULT_TRIANGULAR_N = 30;

/** Central limit theorems: classical, exact convolutions, rates, triangular arrays, vectors and failures. */
export default function CentralLimit({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as CentralLimitConfig;
  switch (config.modo) {
    case 'clasico':
      return (
        <ClassicView
          title={title}
          population={config.poblacion}
          populations={config.poblaciones ?? [config.poblacion]}
          n={config.n ?? DEFAULT_N}
          exact={config.exacta ?? true}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'convolucion':
      return (
        <ConvolutionView
          title={title}
          population={config.poblacion}
          populations={config.poblaciones ?? [config.poblacion]}
          nMax={config.nMaximo ?? DEFAULT_N_MAX}
        />
      );
    case 'berry-esseen':
      return (
        <BerryEsseenView
          title={title}
          population={config.poblacion}
          populations={config.poblaciones ?? [config.poblacion]}
          nMax={config.nMaximo ?? DEFAULT_N_MAX}
        />
      );
    case 'lyapunov':
    case 'lindeberg':
      return (
        <TriangularView
          key={config.modo}
          title={title}
          lindebergMode={config.modo === 'lindeberg'}
          scenario={config.escenario}
          scenarios={config.escenarios ?? [config.escenario]}
          n={config.n ?? DEFAULT_TRIANGULAR_N}
          epsilon={config.epsilon ?? DEFAULT_EPSILON}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'multivariado':
      return (
        <MultivariateView
          title={title}
          population={config.poblacion}
          populations={config.poblaciones ?? [config.poblacion]}
          n={config.n ?? DEFAULT_N}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'falla':
      return (
        <FailureView
          title={title}
          population={config.poblacion}
          populations={config.poblaciones ?? [config.poblacion]}
          n={config.n ?? DEFAULT_N}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
  }
}
