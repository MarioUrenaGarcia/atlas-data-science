import type { VisualizationProps } from '../../types.ts';
import { CoordinatesView } from './CoordinatesView.tsx';
import { CriticalView } from './CriticalView.tsx';
import { DirectionalView } from './DirectionalView.tsx';
import { DoubleIntegralView } from './DoubleIntegralView.tsx';
import { GaussianIntegralView } from './GaussianIntegralView.tsx';
import { GradientView } from './GradientView.tsx';
import { HessianView } from './HessianView.tsx';
import { JacobianView } from './JacobianView.tsx';
import { KktView } from './KktView.tsx';
import { LagrangeView } from './LagrangeView.tsx';
import { MatrixCalculusView } from './MatrixCalculusView.tsx';
import { PartialsView } from './PartialsView.tsx';
import type { SurfaceVizConfig } from './schema.ts';
import { SurfaceView } from './SurfaceView.tsx';
import { TangentView } from './TangentView.tsx';
import { TrajectoryView } from './TrajectoryView.tsx';

const SQUARE_AT: [number, number] = [0.4, 0.3];

/** Functions of two variables: surfaces, level curves, gradients, Jacobians and constrained optima. */
export default function SurfaceViz({ params, title }: VisualizationProps) {
  const config = params as unknown as SurfaceVizConfig;
  switch (config.modo) {
    case 'superficie':
      return <SurfaceView title={title} ids={config.campos} levels={false} />;
    case 'curvas':
      return <SurfaceView title={title} ids={config.campos} levels />;
    case 'parciales':
      return <PartialsView title={title} ids={config.campos} start={config.punto} />;
    case 'gradiente':
      return <GradientView title={title} ids={config.campos} start={config.punto} />;
    case 'direccional':
      return <DirectionalView title={title} ids={config.campos} start={config.punto} />;
    case 'tangente':
      return <TangentView title={title} ids={config.campos} start={config.punto} />;
    case 'hessiana':
      return <HessianView title={title} ids={config.campos} start={config.punto} />;
    case 'criticos':
      return <CriticalView title={title} ids={config.campos} />;
    case 'trayectoria':
      return <TrajectoryView title={title} ids={config.campos} curves={config.curvas} />;
    case 'jacobiana':
      return <JacobianView title={title} maps={config.mapas} at={config.punto ?? SQUARE_AT} />;
    case 'integral-doble':
      return <DoubleIntegralView title={title} cases={config.casos} />;
    case 'coordenadas':
      return (
        <CoordinatesView
          title={title}
          systems={config.sistemas}
          start={{
            radio: config.radio ?? 1.2,
            altura: config.altura ?? 0.9,
            polar: config.polar ?? 50,
            angulo: config.angulo ?? 30,
          }}
          autoplay={config.angulo === undefined}
        />
      );
    case 'gaussiana':
      return <GaussianIntegralView title={title} />;
    case 'matricial':
      return <MatrixCalculusView title={title} cases={config.casos} />;
    case 'lagrange':
      return <LagrangeView title={title} cases={config.casos} />;
    case 'kkt':
      return <KktView title={title} cases={config.casos} initial={config.objetivo} />;
  }
}
