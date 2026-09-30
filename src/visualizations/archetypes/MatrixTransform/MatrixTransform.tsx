import type { VisualizationProps } from '../../types.ts';
import { CharacteristicView } from './CharacteristicView.tsx';
import { EigenView } from './EigenView.tsx';
import { FactorView } from './FactorView.tsx';
import { PowerView } from './PowerView.tsx';
import { PseudoView } from './PseudoView.tsx';
import { QuadraticView } from './QuadraticView.tsx';
import type { MatrixTransformConfig } from './schema.ts';
import { SequenceView } from './SequenceView.tsx';
import { StretchView } from './StretchView.tsx';
import { SubspacesView } from './SubspacesView.tsx';
import { TransformView } from './TransformView.tsx';

const DEFAULT_START_ANGLE = 100;

/** A 2x2 matrix seen as a map of the plane: grids, areas, eigenvectors and decompositions. */
export default function MatrixTransform({ params, title }: VisualizationProps) {
  const config = params as unknown as MatrixTransformConfig;
  switch (config.modo) {
    case 'transformacion':
      return (
        <TransformView
          title={title}
          matrices={config.matrices}
          showCircle={config.circulo ?? false}
          showEigen={config.propios ?? false}
        />
      );
    case 'composicion':
      return <SequenceView title={title} mode="composicion" pairs={config.pares} />;
    case 'inversa':
      return <SequenceView title={title} mode="inversa" pairs={config.pares} />;
    case 'propios':
      return <EigenView title={title} matrices={config.matrices} />;
    case 'svd':
    case 'diagonalizacion':
    case 'espectral':
      return <FactorView title={title} kind={config.modo} matrices={config.matrices} />;
    case 'caracteristico':
      return <CharacteristicView title={title} matrices={config.matrices} />;
    case 'subespacios':
      return <SubspacesView title={title} matrices={config.matrices} />;
    case 'pseudoinversa':
      return <PseudoView title={title} matrices={config.matrices} />;
    case 'estiramiento':
      return <StretchView title={title} matrices={config.matrices} />;
    case 'forma-cuadratica':
      return <QuadraticView title={title} matrices={config.matrices} />;
    case 'potencia':
      return (
        <PowerView
          title={title}
          matrices={config.matrices}
          startAngle={config.anguloInicial ?? DEFAULT_START_ANGLE}
        />
      );
  }
}
