import type { VisualizationProps } from '../../types.ts';
import { PlaneProjectionView } from './PlaneProjectionView.tsx';
import type { Space3DConfig } from './schema.ts';
import { SpanView } from './SpanView.tsx';

/** Vectors, spans and projections in three-dimensional space, seen from a camera that turns. */
export default function Space3D({ params, title }: VisualizationProps) {
  const config = params as unknown as Space3DConfig;
  switch (config.modo) {
    case 'generado':
      return <SpanView title={title} sets={config.conjuntos} />;
    case 'proyeccion':
      return <PlaneProjectionView title={title} a1={config.a1} a2={config.a2} b={config.b} />;
  }
}
