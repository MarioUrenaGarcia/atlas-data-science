import type { VisualizationProps } from '../../types.ts';
import { AnagramView } from './AnagramView.tsx';
import { ArrangementsView } from './ArrangementsView.tsx';
import { CircularView } from './CircularView.tsx';
import { CombinationsView } from './CombinationsView.tsx';
import { GrowthView } from './GrowthView.tsx';
import type { CombinatoricsBoardConfig } from './schema.ts';
import { SlotsView } from './SlotsView.tsx';
import { StarsBarsView } from './StarsBarsView.tsx';
import { SumView } from './SumView.tsx';
import { TreeView } from './TreeView.tsx';

/** Counting by listing: objects placed into slots, grouped into classes and counted. */
export default function CombinatoricsBoard({ params, title }: VisualizationProps) {
  const config = params as unknown as CombinatoricsBoardConfig;
  switch (config.modo) {
    case 'suma':
      return <SumView title={title} categories={config.categorias} />;
    case 'arbol':
      return <TreeView title={title} stages={config.etapas} />;
    case 'ordenaciones':
      return (
        <ArrangementsView
          title={title}
          objects={config.objetos}
          k={config.k}
          repetition={config.repeticion ?? false}
          allowRepetition={config.permitirRepeticion ?? false}
        />
      );
    case 'crecimiento':
      return <GrowthView title={title} nMax={config.nMax ?? 25} />;
    case 'anagramas':
      return <AnagramView title={title} word={config.palabra} />;
    case 'circular':
      return <CircularView title={title} people={config.personas} />;
    case 'combinaciones':
      return <CombinationsView title={title} objects={config.objetos} k={config.k} />;
    case 'estrellas-y-barras':
      return <StarsBarsView title={title} types={config.tipos} k={config.k} />;
    case 'casillas':
      return <SlotsView title={title} scenarios={config.escenarios} />;
  }
}
