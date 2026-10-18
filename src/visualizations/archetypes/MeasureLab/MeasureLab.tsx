import type { VisualizationProps } from '../../types.ts';
import { AlmostSureView } from './AlmostSureView.tsx';
import { CantorView } from './CantorView.tsx';
import { ContinuityView } from './ContinuityView.tsx';
import { CoverView } from './CoverView.tsx';
import { FubiniView } from './FubiniView.tsx';
import { LpView } from './LpView.tsx';
import { PreimageView } from './PreimageView.tsx';
import { RadonView } from './RadonView.tsx';
import type { MeasureLabConfig } from './schema.ts';
import { SequenceView } from './SequenceView.tsx';
import { SigmaView } from './SigmaView.tsx';
import { SimpleView } from './SimpleView.tsx';

/** Measure theory: sigma-algebras, Lebesgue measure, null sets, integration, convergence, densities, products and Lp. */
export default function MeasureLab({ params, title }: VisualizationProps) {
  const config = params as unknown as MeasureLabConfig;
  switch (config.modo) {
    case 'sigma':
      return (
        <SigmaView
          title={title}
          points={config.puntos}
          generators={config.generadores}
          labels={config.etiquetas}
        />
      );
    case 'cantor':
      return <CantorView title={title} level={config.nivel} />;
    case 'cubrimiento':
      return <CoverView title={title} epsilon={config.epsilon} count={config.cantidad} />;
    case 'continuidad':
      return <ContinuityView title={title} direction={config.sentido} />;
    case 'preimagen':
      return <PreimageView title={title} id={config.funcion} interval={config.intervalo} />;
    case 'casi-seguro':
      return <AlmostSureView title={title} id={config.funcion} points={config.puntos} />;
    case 'simple':
      return (
        <SimpleView
          title={title}
          id={config.funcion}
          focus={config.enfoque ?? 'lebesgue'}
          n={config.n}
        />
      );
    case 'sucesion':
      return <SequenceView title={title} kind={config.caso} focus={config.enfoque ?? 'limite'} />;
    case 'radon':
      return <RadonView title={title} density={config.densidad} />;
    case 'fubini':
      return <FubiniView title={title} kind={config.caso} />;
    case 'lp':
      return <LpView title={title} p={config.p} view={config.vista ?? 'bola'} />;
  }
}
