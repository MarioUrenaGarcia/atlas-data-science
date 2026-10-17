import type { VisualizationProps } from '../../types.ts';
import { DeffView } from './DeffView.tsx';
import { FpcView } from './FpcView.tsx';
import { MarginView } from './MarginView.tsx';
import type { PrecisionPlannerConfig } from './schema.ts';
import { SizeView } from './SizeView.tsx';

/** Precision of survey estimates: margins of error, sample sizes and corrections. */
export default function PrecisionPlanner({ params, title, conceptId }: VisualizationProps) {
  const config = params as unknown as PrecisionPlannerConfig;
  switch (config.modo) {
    case 'tamano':
      return <SizeView config={config} title={title} />;
    case 'margen':
      return <MarginView config={config} title={title} conceptId={conceptId} />;
    case 'fpc':
      return <FpcView config={config} title={title} />;
    case 'deff':
      return <DeffView config={config} title={title} />;
  }
}
