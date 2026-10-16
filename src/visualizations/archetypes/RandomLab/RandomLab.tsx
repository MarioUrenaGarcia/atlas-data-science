import type { VisualizationProps } from '../../types.ts';
import { AliasView } from './AliasView.tsx';
import { BoxMullerView } from './BoxMullerView.tsx';
import { CycleView } from './CycleView.tsx';
import { LowDiscrepancyView } from './LowDiscrepancyView.tsx';
import { PairsView } from './PairsView.tsx';
import { PolarView } from './PolarView.tsx';
import { RejectionView } from './RejectionView.tsx';
import type { RandomLabConfig } from './schema.ts';
import { SeedView } from './SeedView.tsx';
import { TestsView } from './TestsView.tsx';
import { ZigguratView } from './ZigguratView.tsx';

/**
 * How a computer produces numbers that behave as random and turns them
 * into other distributions: generator cycles, pairs and triples, seeds,
 * randomness tests, Box-Muller, the polar method, rejection sampling, the
 * ziggurat, the alias method and low-discrepancy sequences.
 */
export default function RandomLab({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as RandomLabConfig;
  switch (config.modo) {
    case 'ciclo':
      return <CycleView config={config} title={title} />;
    case 'pares':
      return <PairsView config={config} title={title} />;
    case 'semilla':
      return <SeedView config={config} title={title} />;
    case 'pruebas':
      return <TestsView config={config} title={title} />;
    case 'box-muller':
      return <BoxMullerView config={config} conceptId={conceptId} title={title} />;
    case 'polar':
      return <PolarView config={config} conceptId={conceptId} title={title} />;
    case 'aceptacion-rechazo':
      return <RejectionView config={config} conceptId={conceptId} title={title} />;
    case 'ziggurat':
      return <ZigguratView config={config} conceptId={conceptId} title={title} />;
    case 'alias':
      return <AliasView config={config} conceptId={conceptId} title={title} />;
    case 'baja-discrepancia':
      return <LowDiscrepancyView config={config} title={title} />;
  }
}
