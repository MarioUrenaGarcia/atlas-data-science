import { defaultSeed } from '../../core/defaultSeed.ts';
import type { VisualizationProps } from '../../types.ts';
import { AnalyticsView } from './AnalyticsView.tsx';
import { CrispView } from './CrispView.tsx';
import { EquityView } from './EquityView.tsx';
import { FramingView } from './FramingView.tsx';
import { MetricsView } from './MetricsView.tsx';
import { PrivacyView } from './PrivacyView.tsx';
import { QuestionView } from './QuestionView.tsx';
import { ReproView } from './ReproView.tsx';
import type { DataProjectConfig } from './schema.ts';

const DEFAULT_PRICE = 60;
const DEFAULT_COST = 35;
const DEFAULT_RUNS = 12;

/** The life cycle of a data project: process, framing, metrics, kinds of analytics and responsible practice. */
export default function DataProjectViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as DataProjectConfig;
  switch (config.modo) {
    case 'crisp':
      return <CrispView title={title} caseId={config.caso} />;
    case 'planteamiento':
      return <FramingView title={title} caseId={config.caso} compare={config.comparar ?? false} />;
    case 'pregunta':
      return (
        <QuestionView title={title} caseId={config.caso} definition={config.definicion ?? 0} />
      );
    case 'metricas':
      return (
        <MetricsView
          title={title}
          caseId={config.caso}
          metric={config.metrica ?? 'exactitud'}
          {...(config.prevalencia === undefined ? {} : { prevalence: config.prevalencia })}
          {...(config.separacion === undefined ? {} : { separation: config.separacion })}
          threshold={config.umbral ?? 0.5}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'analitica':
      return (
        <AnalyticsView
          title={title}
          kind={config.tipo}
          price={config.precio ?? DEFAULT_PRICE}
          cost={config.costo ?? DEFAULT_COST}
        />
      );
    case 'reproducibilidad':
      return (
        <ReproView title={title} fixed={config.fijar} runs={config.corridas ?? DEFAULT_RUNS} />
      );
    case 'privacidad':
      return (
        <PrivacyView
          title={title}
          keys={config.claves ?? ['sex', 'age', 'postal']}
          postalDigits={config.digitosCp ?? 5}
          ageBand={config.bandaEdad ?? 1}
          records={config.registros ?? 30}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'equidad':
      return (
        <EquityView
          title={title}
          threshold={config.umbral ?? 0.5}
          rates={config.tasas ?? [0.3, 0.15]}
          perGroup={config.porGrupo ?? false}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
  }
}
