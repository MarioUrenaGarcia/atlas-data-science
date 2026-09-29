import type { VisualizationProps } from '../../types.ts';
import { CompositionView } from './CompositionView.tsx';
import { MappingView } from './MappingView.tsx';
import type { FunctionMappingConfig } from './schema.ts';

/** Functions between finite sets drawn as arrow diagrams. */
export default function FunctionMapping({ params, title }: VisualizationProps) {
  const config = params as unknown as FunctionMappingConfig;
  if (config.modo === 'composicion') {
    return (
      <CompositionView
        title={title}
        a={config.a}
        b={config.b}
        c={config.c}
        f={config.f}
        g={config.g}
      />
    );
  }
  return <MappingView title={title} examples={config.ejemplos} mode={config.modo} />;
}
