import type { VisualizationProps } from '../../types.ts';
import { ConditionalView } from './ConditionalView.tsx';
import { ConstructionView } from './ConstructionView.tsx';
import { DirichletView } from './DirichletView.tsx';
import { EllipseView } from './EllipseView.tsx';
import { LkjView } from './LkjView.tsx';
import { MahalanobisView } from './MahalanobisView.tsx';
import type { MultivariateConfig } from './schema.ts';
import { WishartView } from './WishartView.tsx';

/**
 * Multivariate distributions in two dimensions: normal and t contours,
 * the construction from standard normals, confidence ellipses, conditional
 * slices, Mahalanobis distance, the Dirichlet simplex, Wishart matrices
 * drawn as ellipses and LKJ correlation matrices.
 */
export default function MultivariateExplorer({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as MultivariateConfig;
  switch (config.modo) {
    case 'construccion':
      return <ConstructionView config={config} conceptId={conceptId} title={title} />;
    case 'condicional':
      return <ConditionalView config={config} title={title} />;
    case 'mahalanobis':
      return <MahalanobisView config={config} title={title} />;
    case 'dirichlet':
      return <DirichletView config={config} conceptId={conceptId} title={title} />;
    case 'wishart':
      return <WishartView config={config} conceptId={conceptId} title={title} />;
    case 'lkj':
      return <LkjView config={config} conceptId={conceptId} title={title} />;
    default:
      return <EllipseView config={config} conceptId={conceptId} title={title} />;
  }
}
