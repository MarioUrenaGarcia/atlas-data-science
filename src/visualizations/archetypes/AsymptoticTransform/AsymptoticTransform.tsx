import { defaultSeed } from '../../core/defaultSeed.ts';
import type { VisualizationProps } from '../../types.ts';
import { BivariateDeltaView } from './BivariateDeltaView.tsx';
import { DeltaView } from './DeltaView.tsx';
import { MappingView } from './MappingView.tsx';
import type { AsymptoticTransformConfig } from './schema.ts';
import { SlutskyView } from './SlutskyView.tsx';

const DEFAULT_N = 30;
const DEFAULT_N_MAX = 120;

/** Delta method, Slutsky's theorem and the continuous mapping theorem. */
export default function AsymptoticTransform({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as AsymptoticTransformConfig;
  switch (config.modo) {
    case 'delta':
      return (
        <DeltaView
          title={title}
          population={config.poblacion.distribucion}
          values={config.poblacion.valores}
          transform={config.transformacion}
          transforms={config.transformaciones ?? [config.transformacion]}
          n={config.n ?? DEFAULT_N}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'delta-multivariado':
      return (
        <BivariateDeltaView
          title={title}
          means={config.medias}
          sds={config.desviaciones}
          rho={config.correlacion ?? 0}
          transform={config.transformacion}
          transforms={config.transformaciones ?? [config.transformacion]}
          n={config.n ?? DEFAULT_N}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'slutsky':
      return (
        <SlutskyView
          title={title}
          variant={config.variante}
          population={config.poblacion?.distribucion ?? 'exponencial'}
          values={config.poblacion?.valores}
          n={config.n ?? DEFAULT_N}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'mapeo':
      return (
        <MappingView
          title={title}
          map={config.funcion}
          maps={config.funciones ?? [config.funcion]}
          nMax={config.nMaximo ?? DEFAULT_N_MAX}
        />
      );
  }
}
