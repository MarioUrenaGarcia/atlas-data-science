import {
  bernoulli,
  beta,
  betaBinomial,
  binomial,
  cauchy,
  chiSquare,
  discreteUniform,
  exponential,
  fisherF,
  frechet,
  inverseGamma,
  kumaraswamy,
  levy,
  noncentralChiSquare,
  noncentralT,
  rice,
  skewNormal,
  stable,
  truncatedNormal,
  vonMises,
  gamma,
  geometric,
  gumbel,
  hypergeometric,
  laplace,
  logarithmic,
  logistic,
  lognormal,
  negativeBinomial,
  normal,
  pareto,
  poisson,
  rademacher,
  rayleigh,
  skellam,
  studentT,
  triangular,
  uniform,
  weibull,
  zeroInflatedPoisson,
  zipf,
  type Distribution,
} from '../../lib/distributions/index.ts';
import type { NumberParameter } from '../core/parameters.ts';
import type { DistributionId } from './distributionIds.ts';

export interface DistributionSpec {
  id: DistributionId;
  label: string;
  discrete: boolean;
  /** Slider definitions for the distribution's own parameters. */
  parameters: readonly NumberParameter[];
  create: (values: Record<string, number>) => Distribution;
  /** Plotting window wide enough for every value the sliders allow. */
  domain: [number, number];
  /** Parameters in LaTeX, for labels such as N(mu, sigma^2). */
  notation: (values: Record<string, number>) => string;
}

const num = (
  key: string,
  label: string,
  symbol: string,
  min: number,
  max: number,
  step: number,
  value: number,
): NumberParameter => ({ type: 'number', key, label, symbol, min, max, step, default: value });

function f(value: number | undefined, digits = 2): string {
  return Number((value ?? 0).toFixed(digits)).toString();
}

export const DISTRIBUTION_SPECS: Record<DistributionId, DistributionSpec> = {
  normal: {
    id: 'normal',
    label: 'Normal',
    discrete: false,
    parameters: [
      num('mu', 'Media', 'μ', -4, 4, 0.1, 0),
      num('sigma', 'Desviación estándar', 'σ', 0.2, 3, 0.05, 1),
    ],
    create: (v) => normal(v.mu, v.sigma),
    domain: [-8, 8],
    notation: (v) => `\\mathcal{N}(${f(v.mu)},\\ ${f((v.sigma ?? 1) ** 2)})`,
  },
  uniforme: {
    id: 'uniforme',
    label: 'Uniforme continua',
    discrete: false,
    parameters: [
      num('a', 'Extremo inferior', 'a', -5, 4, 0.1, 0),
      num('b', 'Extremo superior', 'b', -4, 5, 0.1, 1),
    ],
    create: (v) => uniform(v.a ?? 0, Math.max((v.a ?? 0) + 0.1, v.b ?? 1)),
    domain: [-6, 6],
    notation: (v) => `U(${f(v.a)},\\ ${f(v.b)})`,
  },
  exponencial: {
    id: 'exponencial',
    label: 'Exponencial',
    discrete: false,
    parameters: [num('lambda', 'Tasa', 'λ', 0.2, 5, 0.05, 1)],
    create: (v) => exponential(v.lambda),
    domain: [0, 8],
    notation: (v) => `\\operatorname{Exp}(${f(v.lambda)})`,
  },
  gamma: {
    id: 'gamma',
    label: 'Gamma',
    discrete: false,
    parameters: [
      num('alpha', 'Forma', 'α', 0.3, 12, 0.1, 2),
      num('beta', 'Tasa', 'β', 0.2, 4, 0.05, 1),
    ],
    create: (v) => gamma(v.alpha ?? 2, v.beta),
    domain: [0, 20],
    notation: (v) => `\\operatorname{Gamma}(${f(v.alpha)},\\ ${f(v.beta)})`,
  },
  erlang: {
    id: 'erlang',
    label: 'Erlang',
    discrete: false,
    parameters: [
      num('k', 'Número de etapas', 'k', 1, 15, 1, 3),
      num('lambda', 'Tasa', 'λ', 0.2, 4, 0.05, 1),
    ],
    create: (v) => ({ ...gamma(v.k ?? 3, v.lambda), name: 'Erlang' }),
    domain: [0, 20],
    notation: (v) => `\\operatorname{Erlang}(${f(v.k, 0)},\\ ${f(v.lambda)})`,
  },
  beta: {
    id: 'beta',
    label: 'Beta',
    discrete: false,
    parameters: [
      num('a', 'Forma a', 'a', 0.2, 10, 0.1, 2),
      num('b', 'Forma b', 'b', 0.2, 10, 0.1, 5),
    ],
    create: (v) => beta(v.a ?? 2, v.b ?? 5),
    domain: [0, 1],
    notation: (v) => `\\operatorname{Beta}(${f(v.a)},\\ ${f(v.b)})`,
  },
  'chi-cuadrada': {
    id: 'chi-cuadrada',
    label: 'Chi-cuadrada',
    discrete: false,
    parameters: [num('k', 'Grados de libertad', 'k', 1, 30, 1, 4)],
    create: (v) => chiSquare(v.k ?? 4),
    domain: [0, 50],
    notation: (v) => `\\chi^2_{${f(v.k, 0)}}`,
  },
  t: {
    id: 't',
    label: 't de Student',
    discrete: false,
    parameters: [num('nu', 'Grados de libertad', 'ν', 1, 60, 1, 5)],
    create: (v) => studentT(v.nu ?? 5),
    domain: [-6, 6],
    notation: (v) => `t_{${f(v.nu, 0)}}`,
  },
  f: {
    id: 'f',
    label: 'F de Snedecor',
    discrete: false,
    parameters: [
      num('d1', 'Grados de libertad del numerador', 'd₁', 1, 40, 1, 5),
      num('d2', 'Grados de libertad del denominador', 'd₂', 1, 60, 1, 20),
    ],
    create: (v) => fisherF(v.d1 ?? 5, v.d2 ?? 20),
    domain: [0, 5],
    notation: (v) => `F_{${f(v.d1, 0)},\\,${f(v.d2, 0)}}`,
  },
  lognormal: {
    id: 'lognormal',
    label: 'Lognormal',
    discrete: false,
    parameters: [
      num('mu', 'Media del logaritmo', 'μ', -1, 2, 0.05, 0),
      num('sigma', 'Desviación del logaritmo', 'σ', 0.1, 1.5, 0.05, 0.5),
    ],
    create: (v) => lognormal(v.mu, v.sigma),
    domain: [0, 12],
    notation: (v) => `\\operatorname{LogN}(${f(v.mu)},\\ ${f((v.sigma ?? 1) ** 2)})`,
  },
  weibull: {
    id: 'weibull',
    label: 'Weibull',
    discrete: false,
    parameters: [
      num('k', 'Forma', 'k', 0.3, 6, 0.05, 1.5),
      num('lambda', 'Escala', 'λ', 0.3, 4, 0.05, 1),
    ],
    create: (v) => weibull(v.k ?? 1.5, v.lambda),
    domain: [0, 8],
    notation: (v) => `\\operatorname{Weibull}(${f(v.k)},\\ ${f(v.lambda)})`,
  },
  cauchy: {
    id: 'cauchy',
    label: 'Cauchy',
    discrete: false,
    parameters: [
      num('x0', 'Localización', 'x₀', -3, 3, 0.1, 0),
      num('gamma', 'Escala', 'γ', 0.2, 3, 0.05, 1),
    ],
    create: (v) => cauchy(v.x0, v.gamma),
    domain: [-10, 10],
    notation: (v) => `\\operatorname{Cauchy}(${f(v.x0)},\\ ${f(v.gamma)})`,
  },
  laplace: {
    id: 'laplace',
    label: 'Laplace',
    discrete: false,
    parameters: [
      num('mu', 'Localización', 'μ', -3, 3, 0.1, 0),
      num('b', 'Escala', 'b', 0.2, 3, 0.05, 1),
    ],
    create: (v) => laplace(v.mu, v.b),
    domain: [-10, 10],
    notation: (v) => `\\operatorname{Laplace}(${f(v.mu)},\\ ${f(v.b)})`,
  },
  logistica: {
    id: 'logistica',
    label: 'Logística',
    discrete: false,
    parameters: [
      num('mu', 'Localización', 'μ', -3, 3, 0.1, 0),
      num('s', 'Escala', 's', 0.2, 3, 0.05, 1),
    ],
    create: (v) => logistic(v.mu, v.s),
    domain: [-10, 10],
    notation: (v) => `\\operatorname{Logística}(${f(v.mu)},\\ ${f(v.s)})`,
  },
  pareto: {
    id: 'pareto',
    label: 'Pareto',
    discrete: false,
    parameters: [
      num('xm', 'Mínimo', 'xₘ', 0.5, 3, 0.1, 1),
      num('alpha', 'Índice de cola', 'α', 0.5, 6, 0.05, 2),
    ],
    create: (v) => pareto(v.xm ?? 1, v.alpha ?? 2),
    domain: [0, 10],
    notation: (v) => `\\operatorname{Pareto}(${f(v.xm)},\\ ${f(v.alpha)})`,
  },
  triangular: {
    id: 'triangular',
    label: 'Triangular',
    discrete: false,
    parameters: [
      num('a', 'Mínimo', 'a', 0, 4, 0.1, 0),
      num('c', 'Moda', 'c', 0, 10, 0.1, 3),
      num('b', 'Máximo', 'b', 1, 10, 0.1, 8),
    ],
    create: (v) => {
      const a = v.a ?? 0;
      const b = Math.max(a + 0.2, v.b ?? 8);
      return triangular(a, Math.min(b, Math.max(a, v.c ?? 3)), b);
    },
    domain: [0, 10],
    notation: (v) => `\\operatorname{Tri}(${f(v.a)},\\ ${f(v.c)},\\ ${f(v.b)})`,
  },
  rayleigh: {
    id: 'rayleigh',
    label: 'Rayleigh',
    discrete: false,
    parameters: [num('sigma', 'Escala', 'σ', 0.2, 3, 0.05, 1)],
    create: (v) => rayleigh(v.sigma),
    domain: [0, 10],
    notation: (v) => `\\operatorname{Rayleigh}(${f(v.sigma)})`,
  },
  gumbel: {
    id: 'gumbel',
    label: 'Gumbel',
    discrete: false,
    parameters: [
      num('mu', 'Localización', 'μ', -3, 3, 0.1, 0),
      num('beta', 'Escala', 'β', 0.2, 3, 0.05, 1),
    ],
    create: (v) => gumbel(v.mu, v.beta),
    domain: [-6, 12],
    notation: (v) => `\\operatorname{Gumbel}(${f(v.mu)},\\ ${f(v.beta)})`,
  },
  bernoulli: {
    id: 'bernoulli',
    label: 'Bernoulli',
    discrete: true,
    parameters: [num('p', 'Probabilidad de éxito', 'p', 0, 1, 0.01, 0.3)],
    create: (v) => bernoulli(v.p ?? 0.3),
    domain: [-0.5, 1.5],
    notation: (v) => `\\operatorname{Bernoulli}(${f(v.p)})`,
  },
  binomial: {
    id: 'binomial',
    label: 'Binomial',
    discrete: true,
    parameters: [
      num('n', 'Número de ensayos', 'n', 1, 60, 1, 10),
      num('p', 'Probabilidad de éxito', 'p', 0, 1, 0.01, 0.5),
    ],
    create: (v) => binomial(v.n ?? 10, v.p ?? 0.5),
    domain: [-0.5, 60.5],
    notation: (v) => `\\operatorname{Bin}(${f(v.n, 0)},\\ ${f(v.p)})`,
  },
  geometrica: {
    id: 'geometrica',
    label: 'Geométrica',
    discrete: true,
    parameters: [num('p', 'Probabilidad de éxito', 'p', 0.05, 1, 0.01, 0.3)],
    create: (v) => geometric(v.p ?? 0.3),
    domain: [0.5, 30.5],
    notation: (v) => `\\operatorname{Geom}(${f(v.p)})`,
  },
  'binomial-negativa': {
    id: 'binomial-negativa',
    label: 'Binomial negativa',
    discrete: true,
    parameters: [
      num('r', 'Éxitos requeridos', 'r', 1, 20, 1, 3),
      num('p', 'Probabilidad de éxito', 'p', 0.05, 1, 0.01, 0.4),
    ],
    create: (v) => negativeBinomial(v.r ?? 3, v.p ?? 0.4),
    domain: [-0.5, 40.5],
    notation: (v) => `\\operatorname{BinNeg}(${f(v.r, 0)},\\ ${f(v.p)})`,
  },
  poisson: {
    id: 'poisson',
    label: 'Poisson',
    discrete: true,
    parameters: [num('lambda', 'Tasa', 'λ', 0.1, 25, 0.1, 3)],
    create: (v) => poisson(v.lambda ?? 3),
    domain: [-0.5, 40.5],
    notation: (v) => `\\operatorname{Poisson}(${f(v.lambda)})`,
  },
  hipergeometrica: {
    id: 'hipergeometrica',
    label: 'Hipergeométrica',
    discrete: true,
    parameters: [
      num('N', 'Tamaño de la población', 'N', 2, 100, 1, 50),
      num('K', 'Éxitos en la población', 'K', 0, 100, 1, 15),
      num('n', 'Tamaño de la muestra', 'n', 1, 100, 1, 10),
    ],
    create: (v) => {
      const N = v.N ?? 50;
      return hypergeometric(N, Math.min(N, v.K ?? 15), Math.min(N, v.n ?? 10));
    },
    domain: [-0.5, 40.5],
    notation: (v) => `\\operatorname{Hiper}(${f(v.N, 0)},\\ ${f(v.K, 0)},\\ ${f(v.n, 0)})`,
  },
  'uniforme-discreta': {
    id: 'uniforme-discreta',
    label: 'Uniforme discreta',
    discrete: true,
    parameters: [num('a', 'Mínimo', 'a', 0, 10, 1, 1), num('b', 'Máximo', 'b', 1, 20, 1, 6)],
    create: (v) => {
      const a = v.a ?? 1;
      return discreteUniform(a, Math.max(a, v.b ?? 6));
    },
    domain: [-0.5, 20.5],
    notation: (v) => `U\\{${f(v.a, 0)},\\dots,${f(v.b, 0)}\\}`,
  },
  'beta-binomial': {
    id: 'beta-binomial',
    label: 'Beta-binomial',
    discrete: true,
    parameters: [
      num('n', 'Número de ensayos', 'n', 1, 60, 1, 20),
      num('alpha', 'Forma α de la beta', 'α', 0.2, 20, 0.1, 2),
      num('beta', 'Forma β de la beta', 'β', 0.2, 20, 0.1, 2),
    ],
    create: (v) => betaBinomial(v.n ?? 20, v.alpha ?? 2, v.beta ?? 2),
    domain: [-0.5, 60.5],
    notation: (v) => `\\operatorname{BetaBin}(${f(v.n, 0)},\\ ${f(v.alpha)},\\ ${f(v.beta)})`,
  },
  zipf: {
    id: 'zipf',
    label: 'Zipf',
    discrete: true,
    parameters: [
      num('N', 'Número de rangos', 'N', 2, 100, 1, 30),
      num('s', 'Exponente', 's', 0, 3, 0.05, 1),
    ],
    create: (v) => zipf(v.N ?? 30, v.s ?? 1),
    domain: [0.5, 100.5],
    notation: (v) => `\\operatorname{Zipf}(${f(v.N, 0)},\\ ${f(v.s)})`,
  },
  logaritmica: {
    id: 'logaritmica',
    label: 'Logarítmica',
    discrete: true,
    parameters: [num('p', 'Parámetro', 'p', 0.05, 0.98, 0.01, 0.7)],
    create: (v) => logarithmic(v.p ?? 0.7),
    domain: [0.5, 40.5],
    notation: (v) => `\\operatorname{Log}(${f(v.p)})`,
  },
  'poisson-inflada': {
    id: 'poisson-inflada',
    label: 'Poisson inflada en ceros',
    discrete: true,
    parameters: [
      num('pi', 'Probabilidad de cero estructural', 'π', 0, 0.95, 0.01, 0.3),
      num('lambda', 'Tasa de la parte Poisson', 'λ', 0.1, 20, 0.1, 3),
    ],
    create: (v) => zeroInflatedPoisson(v.pi ?? 0.3, v.lambda ?? 3),
    domain: [-0.5, 35.5],
    notation: (v) => `\\operatorname{ZIP}(${f(v.pi)},\\ ${f(v.lambda)})`,
  },
  skellam: {
    id: 'skellam',
    label: 'Skellam',
    discrete: true,
    parameters: [
      num('mu1', 'Tasa del primer conteo', 'μ₁', 0.1, 15, 0.1, 1.6),
      num('mu2', 'Tasa del segundo conteo', 'μ₂', 0.1, 15, 0.1, 1.1),
    ],
    create: (v) => skellam(v.mu1 ?? 1.6, v.mu2 ?? 1.1),
    domain: [-25.5, 25.5],
    notation: (v) => `\\operatorname{Skellam}(${f(v.mu1)},\\ ${f(v.mu2)})`,
  },
  rademacher: {
    id: 'rademacher',
    label: 'Rademacher',
    discrete: true,
    parameters: [],
    create: () => rademacher(),
    domain: [-2.5, 2.5],
    notation: () => '\\operatorname{Rademacher}',
  },
  frechet: {
    id: 'frechet',
    label: 'Fréchet',
    discrete: false,
    parameters: [
      num('alpha', 'Forma', 'α', 0.5, 8, 0.05, 3),
      num('s', 'Escala', 's', 0.2, 4, 0.05, 1),
      num('m', 'Localización', 'm', -2, 4, 0.1, 0),
    ],
    create: (v) => frechet(v.alpha ?? 3, v.s ?? 1, v.m ?? 0),
    domain: [-2, 15],
    notation: (v) => `\\operatorname{Fréchet}(${f(v.alpha)},\\ ${f(v.s)},\\ ${f(v.m)})`,
  },
  rice: {
    id: 'rice',
    label: 'Rice',
    discrete: false,
    parameters: [
      num('nu', 'Distancia al origen', 'ν', 0, 8, 0.1, 2),
      num('sigma', 'Escala', 'σ', 0.2, 3, 0.05, 1),
    ],
    create: (v) => rice(v.nu ?? 2, v.sigma ?? 1),
    domain: [0, 16],
    notation: (v) => `\\operatorname{Rice}(${f(v.nu)},\\ ${f(v.sigma)})`,
  },
  'von-mises': {
    id: 'von-mises',
    label: 'Von Mises',
    discrete: false,
    parameters: [
      num('mu', 'Dirección media (radianes)', 'μ', -3.1, 3.1, 0.05, 0),
      num('kappa', 'Concentración', 'κ', 0, 20, 0.1, 2),
    ],
    create: (v) => vonMises(v.mu ?? 0, v.kappa ?? 2),
    domain: [-6.3, 6.3],
    notation: (v) => `\\operatorname{vM}(${f(v.mu)},\\ ${f(v.kappa)})`,
  },
  'normal-truncada': {
    id: 'normal-truncada',
    label: 'Normal truncada',
    discrete: false,
    parameters: [
      num('mu', 'Media de la normal original', 'μ', -4, 4, 0.1, 0),
      num('sigma', 'Desviación de la normal original', 'σ', 0.2, 3, 0.05, 1),
      num('a', 'Límite inferior', 'a', -6, 5.9, 0.1, -1),
      num('b', 'Límite superior', 'b', -5.9, 6, 0.1, 2),
    ],
    create: (v) => {
      const a = v.a ?? -1;
      const b = Math.max(a + 0.1, v.b ?? 2);
      return truncatedNormal(v.mu ?? 0, v.sigma ?? 1, a, b);
    },
    domain: [-6, 6],
    notation: (v) =>
      `\\mathcal{N}(${f(v.mu)},\\ ${f((v.sigma ?? 1) ** 2)})\\ \\text{en}\\ [${f(v.a)},\\ ${f(v.b)}]`,
  },
  'normal-asimetrica': {
    id: 'normal-asimetrica',
    label: 'Normal asimétrica',
    discrete: false,
    parameters: [
      num('xi', 'Localización', 'ξ', -3, 3, 0.1, 0),
      num('omega', 'Escala', 'ω', 0.2, 3, 0.05, 1),
      num('alpha', 'Forma (asimetría)', 'α', -10, 10, 0.1, 4),
    ],
    create: (v) => skewNormal(v.xi ?? 0, v.omega ?? 1, v.alpha ?? 4),
    domain: [-8, 8],
    notation: (v) => `\\operatorname{SN}(${f(v.xi)},\\ ${f(v.omega)},\\ ${f(v.alpha)})`,
  },
  'gamma-inversa': {
    id: 'gamma-inversa',
    label: 'Gamma inversa',
    discrete: false,
    parameters: [
      num('alpha', 'Forma', 'α', 0.5, 12, 0.1, 3),
      num('beta', 'Escala', 'β', 0.2, 10, 0.1, 2),
    ],
    create: (v) => inverseGamma(v.alpha ?? 3, v.beta ?? 2),
    domain: [0, 8],
    notation: (v) => `\\operatorname{Inv\\text{-}Gamma}(${f(v.alpha)},\\ ${f(v.beta)})`,
  },
  'chi-cuadrada-no-central': {
    id: 'chi-cuadrada-no-central',
    label: 'Chi-cuadrada no central',
    discrete: false,
    parameters: [
      num('k', 'Grados de libertad', 'k', 1, 30, 1, 4),
      num('lambda', 'Parámetro de no centralidad', 'λ', 0, 30, 0.1, 5),
    ],
    create: (v) => noncentralChiSquare(v.k ?? 4, v.lambda ?? 5),
    domain: [0, 80],
    notation: (v) => `\\chi^2_{${f(v.k, 0)}}(${f(v.lambda)})`,
  },
  't-no-central': {
    id: 't-no-central',
    label: 't no central',
    discrete: false,
    parameters: [
      num('nu', 'Grados de libertad', 'ν', 1, 60, 1, 8),
      num('mu', 'Parámetro de no centralidad', 'μ', -4, 6, 0.1, 2),
    ],
    create: (v) => noncentralT(v.nu ?? 8, v.mu ?? 2),
    domain: [-8, 14],
    notation: (v) => `t_{${f(v.nu, 0)}}(${f(v.mu)})`,
  },
  kumaraswamy: {
    id: 'kumaraswamy',
    label: 'Kumaraswamy',
    discrete: false,
    parameters: [
      num('a', 'Forma a', 'a', 0.2, 10, 0.1, 2),
      num('b', 'Forma b', 'b', 0.2, 10, 0.1, 5),
    ],
    create: (v) => kumaraswamy(v.a ?? 2, v.b ?? 5),
    domain: [0, 1],
    notation: (v) => `\\operatorname{Kum}(${f(v.a)},\\ ${f(v.b)})`,
  },
  levy: {
    id: 'levy',
    label: 'Lévy',
    discrete: false,
    parameters: [
      num('mu', 'Localización', 'μ', -2, 2, 0.1, 0),
      num('c', 'Escala', 'c', 0.1, 4, 0.05, 1),
    ],
    create: (v) => levy(v.mu ?? 0, v.c ?? 1),
    domain: [-2, 20],
    notation: (v) => `\\operatorname{Lévy}(${f(v.mu)},\\ ${f(v.c)})`,
  },
  estable: {
    id: 'estable',
    label: 'Estable',
    discrete: false,
    parameters: [
      num('alpha', 'Índice de estabilidad', 'α', 0.5, 2, 0.05, 1.5),
      num('beta', 'Asimetría', 'β', -1, 1, 0.05, 0),
      num('gamma', 'Escala', 'γ', 0.2, 3, 0.05, 1),
      num('delta', 'Localización', 'δ', -3, 3, 0.1, 0),
    ],
    create: (v) => stable(v.alpha ?? 1.5, v.beta ?? 0, v.gamma ?? 1, v.delta ?? 0),
    domain: [-12, 12],
    notation: (v) => `S(${f(v.alpha)},\\ ${f(v.beta)},\\ ${f(v.gamma)},\\ ${f(v.delta)})`,
  },
};

/** Parameter values for a distribution: defaults overridden by the given values, clamped to range. */
export function specValues(
  spec: DistributionSpec,
  overrides: Record<string, unknown> = {},
): Record<string, number> {
  return Object.fromEntries(
    spec.parameters.map((parameter) => {
      const raw = overrides[parameter.key];
      const value = typeof raw === 'number' && Number.isFinite(raw) ? raw : parameter.default;
      return [parameter.key, Math.min(parameter.max, Math.max(parameter.min, value))];
    }),
  );
}
