import { PROBLEMS } from '../../../lib/inference/estimators.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import type { VisualizationProps } from '../../types.ts';
import { CompareView } from './CompareView.tsx';
import { ConsistencyView } from './ConsistencyView.tsx';
import { DartboardView } from './DartboardView.tsx';
import type { EstimatorLabConfig } from './schema.ts';
import { TradeoffView } from './TradeoffView.tsx';

const DEFAULT_THETA = 2;

/** Properties of point estimators: bias and variance as darts, comparisons, consistency and the bias-variance trade-off. */
export default function EstimatorLab({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as EstimatorLabConfig;
  const seed = useSeed(defaultSeed(conceptId, 'semilla' in config ? config.semilla : undefined));
  switch (config.modo) {
    case 'diana':
      return (
        <DartboardView
          title={title}
          bias={config.sesgo ?? 0.6}
          spread={config.dispersion ?? 0.5}
          four={config.cuatro ?? false}
          seed={seed}
        />
      );
    case 'comparar': {
      const problem = PROBLEMS[config.problema];
      return (
        <CompareView
          title={title}
          problem={problem}
          estimatorIds={config.estimadores ?? problem.estimators.map((e) => e.id)}
          n={config.n ?? 10}
          theta={config.theta ?? DEFAULT_THETA}
          seed={seed}
        />
      );
    }
    case 'consistencia': {
      const problem = PROBLEMS[config.problema];
      return (
        <ConsistencyView
          title={title}
          problem={problem}
          estimatorIds={config.estimadores ?? problem.estimators.slice(0, 2).map((e) => e.id)}
          nMax={config.nMaximo ?? 500}
          epsilon={config.epsilon ?? 0.2}
          theta={config.theta ?? DEFAULT_THETA}
          seed={seed}
        />
      );
    }
    case 'compromiso':
      return (
        <TradeoffView
          title={title}
          n={config.n ?? 5}
          theta={config.theta ?? 1}
          sigma={config.sigma ?? 3}
        />
      );
  }
}
