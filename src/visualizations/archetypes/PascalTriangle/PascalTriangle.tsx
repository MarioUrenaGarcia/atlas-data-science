import type { VisualizationProps } from '../../types.ts';
import { BinomialView } from './BinomialView.tsx';
import { IdentitiesView } from './IdentitiesView.tsx';
import { LatticePathsView } from './LatticePathsView.tsx';
import { MultinomialView } from './MultinomialView.tsx';
import type { PascalTriangleConfig } from './schema.ts';
import { TriangleView } from './TriangleView.tsx';

/** Binomial and multinomial coefficients: the triangle, grid paths, identities and expansions. */
export default function PascalTriangle({ params, title }: VisualizationProps) {
  const config = params as unknown as PascalTriangleConfig;
  switch (config.modo) {
    case 'triangulo':
      return <TriangleView title={title} rows={config.filas ?? 8} modulus={config.modulo} />;
    case 'caminos':
      return <LatticePathsView title={title} right={config.derecha} up={config.arriba} />;
    case 'identidades':
      return (
        <IdentitiesView
          title={title}
          identity={config.identidad}
          identities={config.identidades ?? [config.identidad]}
          n={config.n ?? 5}
          k={config.k ?? 2}
          groups={config.grupos ?? [3, 4]}
        />
      );
    case 'binomio':
      return <BinomialView title={title} n={config.n} a={config.a ?? 1} b={config.b ?? 1} />;
    case 'multinomial':
      return <MultinomialView title={title} n={config.n} />;
  }
}
