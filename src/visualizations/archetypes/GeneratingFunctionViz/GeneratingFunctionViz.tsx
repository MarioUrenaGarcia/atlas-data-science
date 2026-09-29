import type { VisualizationProps } from '../../types.ts';
import { ExponentialView } from './ExponentialView.tsx';
import { OrdinaryView } from './OrdinaryView.tsx';
import type { GeneratingFunctionVizConfig } from './schema.ts';

/** Counting sequences encoded as power series whose products combine choices. */
export default function GeneratingFunctionViz({ params, title }: VisualizationProps) {
  const config = params as unknown as GeneratingFunctionVizConfig;
  switch (config.modo) {
    case 'ordinaria':
      return (
        <OrdinaryView
          title={title}
          parts={config.partes}
          name={config.nombre ?? 'parte'}
          target={config.objetivo ?? 10}
          once={config.unaVez ?? false}
        />
      );
    case 'exponencial':
      return <ExponentialView title={title} letters={config.letras} n={config.n ?? 6} />;
  }
}
