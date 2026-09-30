import type { VisualizationProps } from '../../types.ts';
import { AccumulationView } from './AccumulationView.tsx';
import { AreaView } from './AreaView.tsx';
import { BetaView } from './BetaView.tsx';
import { ChainView } from './ChainView.tsx';
import { ConvexityView } from './ConvexityView.tsx';
import { DerivativeView } from './DerivativeView.tsx';
import { ExponentialView } from './ExponentialView.tsx';
import { GammaView } from './GammaView.tsx';
import { ImproperView } from './ImproperView.tsx';
import { IndicatorView } from './IndicatorView.tsx';
import { LHopitalView } from './LHopitalView.tsx';
import { LimitView } from './LimitView.tsx';
import { PartsView } from './PartsView.tsx';
import { RiemannView } from './RiemannView.tsx';
import type { CalculusVizConfig } from './schema.ts';
import { SecantView } from './SecantView.tsx';
import { StirlingView } from './StirlingView.tsx';
import { SubstitutionView } from './SubstitutionView.tsx';
import { TaylorView } from './TaylorView.tsx';
import { TransformView } from './TransformView.tsx';

const IDENTITY_TRANSFORM: [number, number, number, number] = [1, 1, 0, 0];
const DEFAULT_H = 1.5;
const DEFAULT_TAYLOR_ORDER = 8;
const DEFAULT_BASE = 2;

/** Functions of one variable: limits, derivatives, integrals and special functions. */
export default function CalculusViz({ params, title }: VisualizationProps) {
  const config = params as unknown as CalculusVizConfig;
  switch (config.modo) {
    case 'transformaciones':
      return (
        <TransformView
          title={title}
          ids={config.funciones}
          initial={config.valores ?? IDENTITY_TRANSFORM}
        />
      );
    case 'limite':
      return <LimitView title={title} cases={config.casos} epsilon={config.epsilon ?? false} />;
    case 'secante':
      return (
        <SecantView title={title} id={config.funcion} x0={config.x0} h0={config.h ?? DEFAULT_H} />
      );
    case 'derivadas':
      return (
        <DerivativeView
          title={title}
          ids={config.funciones}
          order={config.orden ?? 1}
          critical={config.criticos ?? false}
        />
      );
    case 'cadena':
      return (
        <ChainView
          title={title}
          outerId={config.exterior}
          innerId={config.interior}
          x0={config.x0}
        />
      );
    case 'convexidad':
      return (
        <ConvexityView title={title} ids={config.funciones} chord={config.cuerda ?? [-1, 1.5]} />
      );
    case 'lhopital':
      return <LHopitalView title={title} cases={config.casos} />;
    case 'exponencial':
      return <ExponentialView title={title} base={config.base ?? DEFAULT_BASE} />;
    case 'taylor':
      return (
        <TaylorView
          title={title}
          ids={config.funciones}
          x0={config.x0 ?? 0}
          maxOrder={config.orden ?? DEFAULT_TAYLOR_ORDER}
        />
      );
    case 'riemann':
      return (
        <RiemannView
          title={title}
          id={config.funcion}
          interval={config.intervalo}
          rule={config.regla ?? 'izquierda'}
        />
      );
    case 'area':
      return <AreaView title={title} id={config.funcion} interval={config.intervalo} />;
    case 'acumulada':
      return (
        <AccumulationView
          title={title}
          id={config.funcion}
          from={config.desde}
          to={config.hasta}
          scale={config.escala ?? 1}
          name={config.nombre ?? 'F'}
        />
      );
    case 'sustitucion':
      return <SubstitutionView title={title} cases={config.casos} />;
    case 'partes':
      return <PartsView title={title} cases={config.casos} />;
    case 'impropia':
      return <ImproperView title={title} cases={config.casos} />;
    case 'gamma':
      return <GammaView title={title} x={config.x ?? 2.5} />;
    case 'beta':
      return <BetaView title={title} a={config.a ?? 2} b={config.b ?? 3} />;
    case 'stirling':
      return <StirlingView title={title} n={config.n ?? 10} />;
    case 'indicadora':
      return <IndicatorView title={title} intervals={config.intervalos} />;
  }
}
