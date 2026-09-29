import type { VisualizationProps } from '../../types.ts';
import { BlockBarView } from './BlockBarView.tsx';
import { NumberLineView } from './NumberLineView.tsx';
import { PartitionView } from './PartitionView.tsx';
import { PowerSetView } from './PowerSetView.tsx';
import { ProductView } from './ProductView.tsx';
import type { SetStructuresConfig } from './schema.ts';
import { SetBuilderView } from './SetBuilderView.tsx';

/** Constructions on finite sets: set-builder notation, products, power sets and partitions. */
export default function SetStructures({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as SetStructuresConfig;
  switch (config.modo) {
    case 'notacion':
      return (
        <SetBuilderView
          title={title}
          universe={config.universo}
          predicate={config.predicado}
          predicates={config.predicados ?? [config.predicado]}
          k={config.k ?? 10}
        />
      );
    case 'producto':
      return (
        <ProductView title={title} a={config.a} b={config.b} names={config.nombres ?? ['A', 'B']} />
      );
    case 'potencia':
      return <PowerSetView title={title} elements={config.elementos} />;
    case 'particion':
      return (
        <PartitionView
          title={title}
          conceptId={conceptId}
          elements={config.elementos}
          modulus={config.modulo ?? 3}
          seed={config.semilla}
        />
      );
    case 'recta':
      return (
        <NumberLineView
          title={title}
          values={config.valores}
          sets={config.conjuntos}
          unit={config.unidad}
        />
      );
    case 'reparto':
      return <BlockBarView title={title} universe={config.universo} blocks={config.bloques} />;
  }
}
