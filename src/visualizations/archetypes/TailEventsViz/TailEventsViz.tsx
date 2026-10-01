import { defaultSeed } from '../../core/defaultSeed.ts';
import type { VisualizationProps } from '../../types.ts';
import { BorelCantelliView } from './BorelCantelliView.tsx';
import type { TailEventsVizConfig } from './schema.ts';
import { ZeroOneView } from './ZeroOneView.tsx';

const DEFAULT_HORIZON = 10000;
const DEFAULT_SERIES_HORIZON = 5000;

/** Events that happen infinitely often and tail events. */
export default function TailEventsViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as TailEventsVizConfig;
  switch (config.modo) {
    case 'borel-cantelli':
      return (
        <BorelCantelliView
          title={title}
          dependent={config.dependientes ?? false}
          exponent={config.exponente ?? 1.5}
          scale={config.constante ?? 1}
          horizon={config.horizonte ?? DEFAULT_HORIZON}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'cero-uno':
      return (
        <ZeroOneView
          title={title}
          exponent={config.exponente ?? 0.8}
          horizon={config.horizonte ?? DEFAULT_SERIES_HORIZON}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
  }
}
