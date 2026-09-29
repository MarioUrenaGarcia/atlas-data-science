import type { VisualizationProps } from '../../types.ts';
import { BellView } from './BellView.tsx';
import type { SetPartitionsVizConfig } from './schema.ts';
import { StirlingView } from './StirlingView.tsx';

/** Partitions of a finite set into blocks, counted by Stirling and Bell numbers. */
export default function SetPartitionsViz({ params, title }: VisualizationProps) {
  const config = params as unknown as SetPartitionsVizConfig;
  switch (config.modo) {
    case 'bell':
      return <BellView title={title} n={config.n ?? 4} />;
    case 'stirling':
      return <StirlingView title={title} n={config.n ?? 5} k={config.k ?? 2} />;
  }
}
