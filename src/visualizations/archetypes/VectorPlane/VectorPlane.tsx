import type { VisualizationProps } from '../../types.ts';
import { BasisChangeView } from './BasisChangeView.tsx';
import { ClosureView } from './ClosureView.tsx';
import { CombinationView } from './CombinationView.tsx';
import { DistancesView } from './DistancesView.tsx';
import { DotView } from './DotView.tsx';
import { GramSchmidtView } from './GramSchmidtView.tsx';
import { NormsView } from './NormsView.tsx';
import { OperationsView } from './OperationsView.tsx';
import { ProjectionView } from './ProjectionView.tsx';
import type { VectorPlaneConfig } from './schema.ts';
import { SystemView } from './SystemView.tsx';

/** Vectors in the plane that can be dragged: operations, spans, lengths, angles and bases. */
export default function VectorPlane({ params, title }: VisualizationProps) {
  const config = params as unknown as VectorPlaneConfig;
  switch (config.modo) {
    case 'cerradura':
      return (
        <ClosureView
          title={title}
          subsets={config.conjuntos}
          u={config.u ?? [1, 2]}
          v={config.v ?? [-0.5, -1]}
        />
      );
    case 'operaciones':
      return (
        <OperationsView title={title} u={config.u} v={config.v} scalar={config.escalar ?? 2} />
      );
    case 'combinacion':
      return (
        <CombinationView
          title={title}
          v1={config.v1}
          v2={config.v2}
          coefficients={config.coeficientes ?? [1, 1]}
        />
      );
    case 'producto-punto':
      return <DotView title={title} u={config.u} v={config.v} />;
    case 'normas':
      return <NormsView title={title} point={config.punto} p={config.p ?? 2} />;
    case 'distancias':
      return <DistancesView title={title} a={config.a} b={config.b} p={config.p ?? 3} />;
    case 'proyeccion':
      return <ProjectionView title={title} a={config.a} b={config.b} />;
    case 'gram-schmidt':
      return <GramSchmidtView title={title} v1={config.v1} v2={config.v2} />;
    case 'cambio-base':
      return <BasisChangeView title={title} b1={config.b1} b2={config.b2} point={config.punto} />;
    case 'sistema':
      return (
        <SystemView
          title={title}
          systems={config.alternativas ?? [{ nombre: 'Sistema', ecuaciones: config.ecuaciones }]}
        />
      );
  }
}
