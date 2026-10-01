import type { VisualizationProps } from '../../types.ts';
import { ConnectivesView } from './ConnectivesView.tsx';
import { QuantifierOrderView } from './QuantifierOrderView.tsx';
import { QuantifierView } from './QuantifierView.tsx';
import type { LogicVizConfig } from './schema.ts';
import { TruthTableView } from './TruthTableView.tsx';

/** Propositional logic: connectives on concrete statements, truth tables and quantifiers. */
export default function LogicViz({ params, title }: VisualizationProps) {
  const config = params as unknown as LogicVizConfig;
  switch (config.modo) {
    case 'conectivos':
      return (
        <ConnectivesView title={title} statements={config.enunciados} initial={config.inicial} />
      );
    case 'tabla':
      return (
        <TruthTableView
          title={title}
          formula={config.formula}
          formulas={config.formulas ?? [config.formula]}
        />
      );
    case 'cuantificadores':
      return (
        <QuantifierView
          title={title}
          predicate={config.predicado}
          predicates={config.predicados ?? [config.predicado]}
          start={config.inicio ?? 1}
          size={config.tamano ?? 20}
          k={config.k ?? 10}
          fixedDomain={config.dominio}
        />
      );
    case 'orden-cuantificadores':
      return <QuantifierOrderView title={title} examples={config.ejemplos} />;
  }
}
