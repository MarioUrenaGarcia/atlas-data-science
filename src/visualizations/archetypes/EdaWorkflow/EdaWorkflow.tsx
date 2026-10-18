import type { VisualizationProps } from '../../types.ts';
import { BivariateView } from './BivariateView.tsx';
import { MultivariateView } from './MultivariateView.tsx';
import type { EdaConfig } from './schema.ts';
import { TourView } from './TourView.tsx';
import { UnivariateView } from './UnivariateView.tsx';

/** Exploratory analysis of a home sales data set: a guided tour and views by number of variables. */
export default function EdaWorkflow({ params, title }: VisualizationProps) {
  const config = params as unknown as EdaConfig;
  switch (config.modo) {
    case 'recorrido':
      return <TourView title={title} />;
    case 'univariado':
      return (
        <UnivariateView
          title={title}
          variable={config.variable ?? 'precio'}
          log={config.escalaLog ?? false}
        />
      );
    case 'bivariado':
      return (
        <BivariateView
          title={title}
          pair={config.par ?? 'superficie-precio'}
          excludeErrors={config.excluirErrores ?? false}
          log={config.escalaLog ?? false}
        />
      );
    case 'multivariado':
      return <MultivariateView title={title} view={config.vista ?? 'color'} />;
  }
}
