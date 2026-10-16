import type { VisualizationProps } from '../../types.ts';
import { CharacteristicView } from './CharacteristicView.tsx';
import { MgfView } from './MgfView.tsx';
import { PgfView } from './PgfView.tsx';
import type { MomentFunctionVizConfig } from './schema.ts';

/**
 * Generating functions of a distribution: the moment generating function
 * and its Taylor polynomials, the cumulant generating function, the
 * characteristic function as a path in the complex plane and the
 * probability generating function as a power series.
 */
export default function MomentFunctionViz({ params, title }: VisualizationProps) {
  const config = params as unknown as MomentFunctionVizConfig;
  switch (config.modo) {
    case 'fgm':
      return <MgfView title={title} config={config} cumulants={false} />;
    case 'cumulantes':
      return <MgfView title={title} config={config} cumulants />;
    case 'caracteristica':
      return <CharacteristicView title={title} config={config} />;
    case 'fgp':
      return <PgfView title={title} config={config} />;
  }
}
