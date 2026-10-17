import type { VisualizationProps } from '../../types.ts';
import { CompoundView } from './CompoundView.tsx';
import { ConjugateView } from './ConjugateView.tsx';
import { ContinuityView } from './ContinuityView.tsx';
import { EmpiricalView } from './EmpiricalView.tsx';
import { ExponentialView } from './ExponentialView.tsx';
import { LocationScaleView } from './LocationScaleView.tsx';
import { MixtureView } from './MixtureView.tsx';
import type { FamilyLabConfig } from './schema.ts';
import { SubGaussianView } from './SubGaussianView.tsx';
import { SufficiencyView } from './SufficiencyView.tsx';
import { TailsView } from './TailsView.tsx';

/**
 * Structures that group and connect distributions: exponential families,
 * sufficiency, location and scale, conjugate updates, mixtures, compound
 * sums, the continuity correction, heavy and sub-Gaussian tails and the
 * empirical distribution.
 */
export default function FamilyLab({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as FamilyLabConfig;
  switch (config.modo) {
    case 'exponencial':
      return <ExponentialView config={config} title={title} />;
    case 'suficiencia':
      return <SufficiencyView config={config} title={title} />;
    case 'localizacion-escala':
      return <LocationScaleView config={config} title={title} />;
    case 'conjugada':
      return <ConjugateView config={config} conceptId={conceptId} title={title} />;
    case 'mezcla':
      return <MixtureView config={config} conceptId={conceptId} title={title} />;
    case 'compuesta':
      return <CompoundView config={config} conceptId={conceptId} title={title} />;
    case 'continuidad':
      return <ContinuityView config={config} title={title} />;
    case 'colas':
      return <TailsView config={config} title={title} />;
    case 'subgaussiana':
      return <SubGaussianView config={config} title={title} />;
    case 'empirica':
      return <EmpiricalView config={config} conceptId={conceptId} title={title} />;
  }
}
