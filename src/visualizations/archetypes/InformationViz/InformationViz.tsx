import type { VisualizationProps } from '../../types.ts';
import { AsymmetryView } from './AsymmetryView.tsx';
import { ChannelView } from './ChannelView.tsx';
import { DifferentialView } from './DifferentialView.tsx';
import { DivergenceView } from './DivergenceView.tsx';
import { EntropyView } from './EntropyView.tsx';
import { FDivergenceView } from './FDivergenceView.tsx';
import { HuffmanView } from './HuffmanView.tsx';
import { JointView } from './JointView.tsx';
import { MaxEntView } from './MaxEntView.tsx';
import { MdlView } from './MdlView.tsx';
import { PerplexityView } from './PerplexityView.tsx';
import type { InformationVizConfig } from './schema.ts';
import { SourceView } from './SourceView.tsx';
import { SurpriseView } from './SurpriseView.tsx';
import { WassersteinView } from './WassersteinView.tsx';

const DEFAULT_SEPARATION = 0;

/** Information theory: surprise, entropies, divergences, codes, channels, transport and description length. */
export default function InformationViz({ params, title }: VisualizationProps) {
  const config = params as unknown as InformationVizConfig;
  switch (config.modo) {
    case 'sorpresa':
      return <SurpriseView title={title} events={config.eventos} />;
    case 'entropia':
      return <EntropyView title={title} weights={config.p} labels={config.etiquetas} />;
    case 'conjunta':
      return (
        <JointView
          title={title}
          table={config.tabla}
          focus={config.enfoque ?? 'conjunta'}
          rows={config.filas}
          columns={config.columnas}
        />
      );
    case 'divergencia':
      return (
        <DivergenceView
          title={title}
          p={config.p}
          q={config.q}
          focus={config.enfoque ?? 'kl'}
          labels={config.etiquetas}
        />
      );
    case 'asimetria':
      return <AsymmetryView title={title} separation={config.separacion ?? DEFAULT_SEPARATION} />;
    case 'diferencial':
      return (
        <DifferentialView title={title} family={config.familia} parameter={config.parametro} />
      );
    case 'maxent':
      return <MaxEntView title={title} mean={config.media} />;
    case 'huffman':
      return <HuffmanView title={title} weights={config.p} labels={config.etiquetas} />;
    case 'fuente':
      return <SourceView title={title} p={config.p} block={config.bloque} />;
    case 'perplejidad':
      return <PerplexityView title={title} p={config.p} q={config.q} seed={config.semilla} />;
    case 'procesamiento':
      return <ChannelView title={title} noise1={config.ruido1} noise2={config.ruido2} />;
    case 'wasserstein':
      return <WassersteinView title={title} p={config.p} q={config.q} />;
    case 'divergencias-f':
      return <FDivergenceView title={title} p={config.p} q={config.q} f={config.f} />;
    case 'mdl':
      return <MdlView title={title} noise={config.ruido} seed={config.semilla} />;
  }
}
