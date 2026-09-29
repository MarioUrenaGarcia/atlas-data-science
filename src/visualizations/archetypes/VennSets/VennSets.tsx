import type { VisualizationProps } from '../../types.ts';
import { CountsView } from './CountsView.tsx';
import { DeMorganView } from './DeMorganView.tsx';
import { InclusionExclusionView } from './InclusionExclusionView.tsx';
import { OperationsView } from './OperationsView.tsx';
import { RegionsView } from './RegionsView.tsx';
import type { VennSetsConfig } from './schema.ts';

/** Finite sets drawn as Venn diagrams with their elements placed in each region. */
export default function VennSets({ params, title }: VisualizationProps) {
  const config = params as unknown as VennSetsConfig;
  if (config.modo === 'conteos') return <CountsView title={title} config={config} />;
  switch (config.modo) {
    case 'operaciones':
      return (
        <OperationsView
          title={title}
          universe={config.universo}
          sets={config.conjuntos}
          operation={config.operacion ?? 'union'}
          operations={config.operaciones ?? [config.operacion ?? 'union']}
        />
      );
    case 'de-morgan':
      return (
        <DeMorganView
          title={title}
          universe={config.universo}
          sets={config.conjuntos}
          law={config.ley ?? 'union'}
        />
      );
    case 'regiones':
      return <RegionsView title={title} universe={config.universo} sets={config.conjuntos} />;
    case 'inclusion-exclusion':
      return (
        <InclusionExclusionView title={title} universe={config.universo} sets={config.conjuntos} />
      );
  }
}
