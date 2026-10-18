import { defaultSeed } from '../../core/defaultSeed.ts';
import type { VisualizationProps } from '../../types.ts';
import { AggregationView } from './AggregationView.tsx';
import { BinningView } from './BinningView.tsx';
import { CyclicView } from './CyclicView.tsx';
import { DateView } from './DateView.tsx';
import { EmbeddingView } from './EmbeddingView.tsx';
import { FrequencyView } from './FrequencyView.tsx';
import { HashView } from './HashView.tsx';
import { InteractionView } from './InteractionView.tsx';
import { NormView } from './NormView.tsx';
import { OneHotView } from './OneHotView.tsx';
import { OrdinalView } from './OrdinalView.tsx';
import { PolynomialView } from './PolynomialView.tsx';
import { ScaleView } from './ScaleView.tsx';
import type { FeatureEngineeringConfig } from './schema.ts';
import { TargetView } from './TargetView.tsx';

/** Feature engineering: scaling, encoding categories, building new variables from old ones. */
export default function FeatureEngineeringViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as FeatureEngineeringConfig;
  const seed = defaultSeed(conceptId, 'semilla' in config ? config.semilla : undefined);
  switch (config.modo) {
    case 'escalamiento':
      return (
        <ScaleView
          title={title}
          method={config.metodo}
          caseId={config.caso}
          outlier={config.atipico ?? false}
        />
      );
    case 'norma':
      return <NormView title={title} caseId={config.caso} p={config.p ?? '2'} />;
    case 'discretizacion':
      return (
        <BinningView
          title={title}
          method={config.metodo}
          bins={config.intervalos ?? 5}
          seed={seed}
        />
      );
    case 'onehot':
      return (
        <OneHotView
          title={title}
          caseId={config.caso}
          dropFirst={config.eliminarPrimera ?? false}
        />
      );
    case 'ordinal':
      return <OrdinalView title={title} caseId={config.caso} order={config.orden ?? 'natural'} />;
    case 'objetivo':
      return (
        <TargetView
          title={title}
          caseId={config.caso}
          m={config.m ?? 10}
          outOfFold={config.fueraDePliegue ?? false}
          seed={seed}
        />
      );
    case 'frecuencia':
      return <FrequencyView title={title} caseId={config.caso} seed={seed} />;
    case 'hashing':
      return (
        <HashView
          title={title}
          caseId={config.caso}
          buckets={config.cubetas ?? 16}
          signed={config.signo ?? false}
        />
      );
    case 'embedding':
      return <EmbeddingView title={title} steps={config.pasos ?? 300} seed={seed} />;
    case 'interaccion':
      return (
        <InteractionView
          title={title}
          withInteraction={config.conInteraccion ?? false}
          effect={config.efecto ?? 2}
          seed={seed}
        />
      );
    case 'polinomial':
      return (
        <PolynomialView title={title} degree={config.grado ?? 6} n={config.n ?? 20} seed={seed} />
      );
    case 'fecha':
      return <DateView title={title} caseId={config.caso} />;
    case 'ciclica':
      return (
        <CyclicView
          title={title}
          period={config.periodo ?? 'horas'}
          a={config.a ?? 23}
          b={config.b ?? 0}
        />
      );
    case 'agregacion':
      return <AggregationView title={title} statistic={config.estadistico ?? 'suma'} seed={seed} />;
  }
}
