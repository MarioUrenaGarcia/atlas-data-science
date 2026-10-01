import { defaultSeed } from '../../core/defaultSeed.ts';
import type { VisualizationProps } from '../../types.ts';
import { DonskerEmpiricalView } from './DonskerEmpiricalView.tsx';
import { DonskerWalkView } from './DonskerWalkView.tsx';
import { GlivenkoView } from './GlivenkoView.tsx';
import type { EmpiricalProcessVizConfig } from './schema.ts';

const DEFAULT_HORIZON = 2000;
const DEFAULT_LEVEL = 3;
const DEFAULT_N = 100;

/** Empirical distribution functions, random walks and their functional limits. */
export default function EmpiricalProcessViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as EmpiricalProcessVizConfig;
  switch (config.modo) {
    case 'glivenko-cantelli':
      return (
        <GlivenkoView
          title={title}
          population={config.poblacion.distribucion}
          populations={config.poblaciones ?? [config.poblacion.distribucion]}
          values={config.poblacion.valores}
          horizon={config.horizonte ?? DEFAULT_HORIZON}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'donsker-caminata':
      return (
        <DonskerWalkView
          title={title}
          level={config.nivel ?? DEFAULT_LEVEL}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'donsker-empirico':
      return (
        <DonskerEmpiricalView
          title={title}
          n={config.n ?? DEFAULT_N}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
  }
}
