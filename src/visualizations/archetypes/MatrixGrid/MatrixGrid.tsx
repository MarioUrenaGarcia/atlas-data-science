import type { VisualizationProps } from '../../types.ts';
import { KroneckerView } from './KroneckerView.tsx';
import { LowRankView } from './LowRankView.tsx';
import { OperationsView } from './OperationsView.tsx';
import { SPECIAL_KINDS, type MatrixGridConfig } from './schema.ts';
import { SparseView } from './SparseView.tsx';
import { SpecialView } from './SpecialView.tsx';
import { TensorView } from './TensorView.tsx';
import { TraceView } from './TraceView.tsx';
import { TransposeView } from './TransposeView.tsx';

const DEFAULT_SCALAR = 2;
const DEFAULT_SPECIAL_SIZE = 3;

/** Matrices read entry by entry: operations, patterns, block structures and images. */
export default function MatrixGrid({ params, title, conceptId }: VisualizationProps) {
  const config = params as unknown as MatrixGridConfig;
  switch (config.modo) {
    case 'operaciones':
      return (
        <OperationsView
          title={title}
          a={config.a}
          b={config.b}
          scalar={config.escalar ?? DEFAULT_SCALAR}
          initialView={config.vista ?? 'producto'}
        />
      );
    case 'transpuesta':
      return <TransposeView title={title} a={config.a} b={config.b} />;
    case 'especiales':
      return (
        <SpecialView
          title={title}
          kinds={config.tipos ?? SPECIAL_KINDS}
          size={config.n ?? DEFAULT_SPECIAL_SIZE}
        />
      );
    case 'traza':
      return <TraceView title={title} a={config.a} b={config.b} />;
    case 'kronecker':
      return <KroneckerView title={title} a={config.a} b={config.b} />;
    case 'dispersa':
      return (
        <SparseView
          title={title}
          conceptId={conceptId}
          initialPattern={config.patron ?? 'tridiagonal'}
        />
      );
    case 'tensor':
      return <TensorView title={title} shape={config.forma ?? [3, 4, 5]} />;
    case 'bajo-rango':
      return <LowRankView title={title} initialImage={config.imagen ?? 'figura'} />;
  }
}
