import { defaultSeed } from '../../core/defaultSeed.ts';
import type { VisualizationProps } from '../../types.ts';
import { ConfounderView } from './ConfounderView.tsx';
import { ContingencyView } from './ContingencyView.tsx';
import { CorrelationView } from './CorrelationView.tsx';
import { MatrixView } from './MatrixView.tsx';
import { MicView } from './MicView.tsx';
import type { AssociationVizConfig } from './schema.ts';
import { SpuriousView } from './SpuriousView.tsx';

/** Association between two variables: coefficients, pitfalls and tables. */
export default function AssociationViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as AssociationVizConfig;
  const seed = defaultSeed(conceptId, 'semilla' in config ? config.semilla : undefined);
  switch (config.modo) {
    case 'correlacion':
      return (
        <CorrelationView
          title={title}
          measure={config.medida}
          readouts={config.lecturas ?? [config.medida]}
          {...(config.puntos ? { points: config.puntos } : {})}
          {...(config.generador ? { generator: config.generador } : {})}
          names={config.nombres}
          line={config.recta ?? false}
          decimals={config.decimales ?? 1}
          seed={seed}
        />
      );
    case 'confusor':
      return (
        <ConfounderView
          title={title}
          view={config.vista}
          names={config.nombres}
          levels={config.niveles}
          n={config.n}
          effectX={config.efectoX}
          effectY={config.efectoY}
          direct={config.directo ?? 0}
          {...(config.ruido === undefined ? {} : { noise: config.ruido })}
          {...(config.origen ? { origin: config.origen } : {})}
          seed={seed}
        />
      );
    case 'espuria':
      return (
        <SpuriousView
          title={title}
          names={config.nombres}
          steps={config.pasos}
          drift={config.deriva ?? [0, 0]}
          differencesFirst={config.diferencias ?? false}
          seed={seed}
        />
      );
    case 'matriz':
      return <MatrixView title={title} variables={config.variables} />;
    case 'contingencia':
      return (
        <ContingencyView
          title={title}
          focus={config.enfoque}
          rows={config.filas}
          columns={config.columnas}
          counts={config.conteos}
        />
      );
    case 'mic':
      return (
        <MicView
          title={title}
          {...(config.puntos ? { points: config.puntos } : {})}
          {...(config.generador ? { generator: config.generador } : {})}
          names={config.nombres}
          seed={seed}
        />
      );
  }
}
