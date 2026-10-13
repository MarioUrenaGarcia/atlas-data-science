import type { ContinuousDistribution } from '../../../lib/distributions/index.ts';
import { transformOf, type Transform } from '../../../lib/probability/transform.ts';
import { DISTRIBUTION_SPECS, specValues } from '../../shared/distributionSpecs.ts';
import { plotWindow } from '../../shared/plotWindow.ts';
import type { TransformationVizConfig } from './schema.ts';

export interface TransformationSetup {
  x: ContinuousDistribution;
  /** LaTeX notation of the distribution of X, such as N(0, 1). */
  notation: string;
  label: string;
  xDomain: [number, number];
  transform: Transform;
  /** Window for Y = g(X) that holds almost all of its probability. */
  yDomain: [number, number];
}

const SCAN = 400;
const EDGE = 0.002;

/**
 * Resolves the distribution of X and the transformation. The window for Y is
 * found by mapping the bulk of X (between its 0.2 % and 99.8 % quantiles)
 * through g, so heavy tails of Y do not flatten the plots.
 */
export function setupTransformation(config: TransformationVizConfig): TransformationSetup {
  const spec = DISTRIBUTION_SPECS[config.distribucion ?? 'normal'];
  const values = specValues(spec, config.parametros);
  const created = spec.create(values);
  // Discrete targets are not used by these views; a standard normal stands in for safety.
  const x: ContinuousDistribution =
    created.kind === 'continuous'
      ? created
      : (DISTRIBUTION_SPECS.normal.create({}) as ContinuousDistribution);
  const xDomain = plotWindow([x], spec.domain, false);
  const transform = transformOf(config.transformacion ?? 'cuadrado', config.a ?? 2, config.b ?? 1);
  const lo = x.quantile(EDGE);
  const hi = x.quantile(1 - EDGE);
  let yLo = Infinity;
  let yHi = -Infinity;
  for (let i = 0; i <= SCAN; i += 1) {
    const value = transform.g(lo + ((hi - lo) * i) / SCAN);
    if (!Number.isFinite(value)) continue;
    yLo = Math.min(yLo, value);
    yHi = Math.max(yHi, value);
  }
  const pad = (yHi - yLo) * 0.04;
  return {
    x,
    notation: spec.notation(values),
    label: spec.label,
    xDomain,
    transform,
    yDomain: [yLo - pad, yHi + pad],
  };
}
