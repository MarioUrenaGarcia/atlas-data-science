import type { VisualizationProps } from '../../types.ts';
import { AutodiffView } from './AutodiffView.tsx';
import { FloatView } from './FloatView.tsx';
import { InterpolationView } from './InterpolationView.tsx';
import { IterativeView } from './IterativeView.tsx';
import { LogSumExpView } from './LogSumExpView.tsx';
import { OdeView } from './OdeView.tsx';
import { QuadratureView } from './QuadratureView.tsx';
import type { NumericsLabConfig } from './schema.ts';
import { SplineView } from './SplineView.tsx';
import { StabilityView } from './StabilityView.tsx';
import { StepErrorView } from './StepErrorView.tsx';

const DEFAULT_NODES = 5;
const DEFAULT_STEP_EXPONENT = -1;

/** Numerical analysis: floating point, errors, stability, interpolation, quadrature, autodiff, iterations and ODEs. */
export default function NumericsLab({ params, title }: VisualizationProps) {
  const config = params as unknown as NumericsLabConfig;
  switch (config.modo) {
    case 'flotante':
      return <FloatView title={title} value={config.valor} format={config.formato ?? 'float64'} />;
    case 'error-paso':
      return (
        <StepErrorView
          title={title}
          id={config.funcion}
          x0={config.x0}
          scheme={config.esquema ?? 'adelante'}
          initialExponent={config.paso ?? DEFAULT_STEP_EXPONENT}
        />
      );
    case 'estabilidad':
      return <StabilityView title={title} kind={config.caso} offset={config.desplazamiento ?? 0} />;
    case 'logsumexp':
      return <LogSumExpView title={title} values={config.valores} />;
    case 'interpolacion':
      return (
        <InterpolationView
          title={title}
          id={config.funcion}
          nodes={config.nodos ?? 'equiespaciados'}
          n={config.n ?? DEFAULT_NODES}
        />
      );
    case 'spline':
      return (
        <SplineView title={title} points={config.puntos} polynomial={config.polinomio ?? false} />
      );
    case 'cuadratura':
      return (
        <QuadratureView
          title={title}
          id={config.funcion}
          interval={config.intervalo}
          rules={config.reglas}
        />
      );
    case 'autodiff':
      return (
        <AutodiffView
          title={title}
          x1={config.x1}
          x2={config.x2}
          direction={config.sentido ?? 'reverse'}
        />
      );
    case 'iterativo':
      return (
        <IterativeView
          title={title}
          matrix={config.matriz}
          b={config.b}
          start={config.inicio ?? [0, 0]}
          methods={config.metodos}
        />
      );
    case 'edo':
      return <OdeView title={title} id={config.ecuacion} h={config.h} methods={config.metodos} />;
  }
}
