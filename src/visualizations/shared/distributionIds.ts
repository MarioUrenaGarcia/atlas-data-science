/**
 * Identifiers of the distributions available to the visualizations. Kept in a
 * plain module so parameter schemas can import it from Node without React.
 */
export const DISTRIBUTION_IDS = [
  'normal',
  'uniforme',
  'exponencial',
  'gamma',
  'erlang',
  'beta',
  'chi-cuadrada',
  't',
  'f',
  'lognormal',
  'weibull',
  'cauchy',
  'laplace',
  'logistica',
  'pareto',
  'triangular',
  'rayleigh',
  'gumbel',
  'bernoulli',
  'binomial',
  'geometrica',
  'binomial-negativa',
  'poisson',
  'hipergeometrica',
  'uniforme-discreta',
  'beta-binomial',
  'zipf',
  'logaritmica',
  'poisson-inflada',
  'skellam',
  'rademacher',
] as const;

export type DistributionId = (typeof DISTRIBUTION_IDS)[number];
