import type { VisualizationProps } from '../../types.ts';
import { ClassificationView } from './ClassificationView.tsx';
import { InverseView } from './InverseView.tsx';
import type { FunctionGraphConfig } from './schema.ts';
import { VerticalLineView } from './VerticalLineView.tsx';

/** Real functions drawn as graphs: line tests, image, codomain and inverse. */
export default function FunctionGraph({ params, title }: VisualizationProps) {
  const config = params as unknown as FunctionGraphConfig;
  switch (config.modo) {
    case 'clasificacion':
      return <ClassificationView title={title} functions={config.funciones} />;
    case 'inversa':
      return <InverseView title={title} functions={config.funciones} />;
    case 'vertical':
      return <VerticalLineView title={title} curves={config.curvas} />;
  }
}
