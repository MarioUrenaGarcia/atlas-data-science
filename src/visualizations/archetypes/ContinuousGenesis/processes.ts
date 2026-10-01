import {
  beta,
  cauchy,
  chiSquare,
  fisherF,
  frechet,
  gamma,
  gumbel,
  inverseGamma,
  invertMonotone,
  irwinHall,
  kumaraswamy,
  laplace,
  levy,
  logistic,
  lognormal,
  noncentralChiSquare,
  noncentralT,
  normal,
  pareto,
  rice,
  simpsonIntegral,
  skewNormal,
  stable,
  stableTailConstant,
  studentT,
  truncatedNormal,
  uniform,
  vonMises,
  weibull,
  type ContinuousDistribution,
} from '../../../lib/distributions/index.ts';
import type { Random } from '../../../lib/random/index.ts';
import type { NumberParameter } from '../../core/parameters.ts';
import type { ContinuousGenesisConfig, ContinuousProcess } from './schema.ts';

export type Tone = 'normal' | 'rejected' | 'chosen' | 'result';

export type ContinuousEvent =
  | { kind: 'draw'; row: number; value: number; tone: Tone }
  | { kind: 'arrival'; time: number }
  | { kind: 'point'; x: number; y: number }
  | { kind: 'angle'; theta: number }
  | { kind: 'end' };

export interface ContinuousExperiment {
  events: ContinuousEvent[];
  value: number;
}

export type ContinuousStageKind = 'rows' | 'timeline' | 'plane' | 'lighthouse' | 'circle';

export interface Row {
  label: string;
  domain: [number, number];
}

export interface ContinuousSettings {
  process: ContinuousProcess;
  values: Record<string, number>;
  unit: string;
}

export interface ReferenceCurve {
  distribution: ContinuousDistribution;
  label: string;
}

interface ProcessSpec {
  stage: ContinuousStageKind;
  symbol: string;
  describe: (settings: ContinuousSettings) => string;
  parameters: () => NumberParameter[];
  rows?: (settings: ContinuousSettings) => Row[];
  simulate: (random: Random, settings: ContinuousSettings) => ContinuousExperiment;
  theory: (settings: ContinuousSettings) => ContinuousDistribution;
  reference?: (settings: ContinuousSettings) => ReferenceCurve | null;
  /** Histogram window for laws whose quantiles are too spread to choose one automatically. */
  window?: (settings: ContinuousSettings) => [number, number];
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

export function value(settings: ContinuousSettings, key: string, fallback: number): number {
  const raw = settings.values[key];
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : fallback;
}

const int = (settings: ContinuousSettings, key: string, fallback: number) =>
  Math.max(1, Math.round(value(settings, key, fallback)));

const end: ContinuousEvent = { kind: 'end' };
const draw = (row: number, x: number, tone: Tone = 'normal'): ContinuousEvent => ({
  kind: 'draw',
  row,
  value: x,
  tone,
});

/**
 * Distribution given by its cdf and density on an interval, with numerical
 * moments and quantile. Used for exact finite-n laws of extremes and sums.
 */
function numericDistribution(
  name: string,
  support: [number, number],
  pdf: (x: number) => number,
  cdf: (x: number) => number,
  sample: (random: Random) => number,
): ContinuousDistribution {
  // A tiny offset keeps densities that diverge at a finite endpoint out of the quadrature.
  const lo = Number.isFinite(support[0]) ? support[0] + 1e-9 : invertMonotone(cdf, 1e-7, -1e6, 1e6);
  const hi = Number.isFinite(support[1])
    ? support[1] - 1e-9
    : invertMonotone(cdf, 1 - 1e-7, lo, 1e6);
  const mean = simpsonIntegral((x) => x * pdf(x), lo, hi, 2000);
  const second = simpsonIntegral((x) => (x - mean) ** 2 * pdf(x), lo, hi, 2000);
  return {
    kind: 'continuous',
    name,
    mean,
    variance: second,
    support,
    pdf: (x) => (x < support[0] || x > support[1] ? 0 : pdf(x)),
    cdf: (x) => (x <= support[0] ? 0 : x >= support[1] ? 1 : cdf(x)),
    quantile: (p) => invertMonotone(cdf, p, lo, hi, 1e-10),
    sample,
  };
}

/** Symmetric power-law step with P(|X| > x) = x^(-alpha) for x >= 1. */
function heavyStep(random: Random, alpha: number): number {
  const size = (1 - random.next()) ** (-1 / alpha);
  return random.next() < 0.5 ? -size : size;
}

const SPECS: Record<ContinuousProcess, ProcessSpec> = {
  'punto-uniforme': {
    stage: 'rows',
    symbol: 'X',
    describe: () => 'posición del punto',
    parameters: () => [
      num('a', 'Extremo izquierdo', 'a', -5, 4, 0.1, 0),
      num('b', 'Extremo derecho', 'b', -4, 10, 0.1, 10),
    ],
    rows: (s) => {
      const a = value(s, 'a', 0);
      return [{ label: 'X', domain: [a, Math.max(a + 0.1, value(s, 'b', 10))] }];
    },
    simulate: (random, s) => {
      const a = value(s, 'a', 0);
      const x = random.uniform(a, Math.max(a + 0.1, value(s, 'b', 10)));
      return { events: [draw(0, x, 'result'), end], value: x };
    },
    theory: (s) => {
      const a = value(s, 'a', 0);
      return uniform(a, Math.max(a + 0.1, value(s, 'b', 10)));
    },
  },
  'suma-uniformes': {
    stage: 'rows',
    symbol: 'S',
    describe: () => 'suma de n uniformes en [0, 1]',
    parameters: () => [num('n', 'Uniformes sumadas', 'n', 1, 12, 1, 12)],
    rows: (s) => [
      { label: 'U_i', domain: [0, 1] },
      { label: 'S', domain: [0, int(s, 'n', 12)] },
    ],
    simulate: (random, s) => {
      const n = int(s, 'n', 12);
      const events: ContinuousEvent[] = [];
      let total = 0;
      for (let i = 0; i < n; i += 1) {
        const u = random.next();
        total += u;
        events.push(draw(0, u), draw(1, total, i === n - 1 ? 'result' : 'chosen'));
      }
      return { events: [...events, end], value: total };
    },
    theory: (s) => irwinHall(int(s, 'n', 12)),
    reference: (s) => {
      const n = int(s, 'n', 12);
      return n > 1
        ? {
            distribution: normal(n / 2, Math.sqrt(n / 12)),
            label: 'Normal de la misma media y varianza',
          }
        : null;
    },
  },
  llegadas: {
    stage: 'timeline',
    symbol: 'T',
    describe: (s) =>
      int(s, 'k', 1) === 1 ? 'tiempo hasta la primera llegada' : 'tiempo hasta la llegada k',
    parameters: () => [
      num('lambda', 'Tasa de llegadas', 'λ', 0.2, 5, 0.05, 1),
      num('k', 'Llegada esperada', 'k', 1, 15, 1, 1),
    ],
    simulate: (random, s) => {
      const k = int(s, 'k', 1);
      const rate = value(s, 'lambda', 1);
      const events: ContinuousEvent[] = [];
      let time = 0;
      for (let i = 0; i < k; i += 1) {
        time += random.exponential(rate);
        events.push({ kind: 'arrival', time });
      }
      return { events: [...events, end], value: time };
    },
    theory: (s) => {
      const k = int(s, 'k', 1);
      const d = gamma(k, value(s, 'lambda', 1));
      return { ...d, name: k === 1 ? 'Exponencial' : 'Erlang' };
    },
  },
  'suma-cuadrados': {
    stage: 'rows',
    symbol: 'Q',
    describe: () => 'suma de cuadrados de normales',
    parameters: () => [
      num('k', 'Normales sumadas', 'k', 1, 12, 1, 3),
      num('m', 'Media de cada normal', 'm', 0, 3, 0.05, 0),
    ],
    rows: (s) => {
      const k = int(s, 'k', 3);
      const m = value(s, 'm', 0);
      return [
        { label: 'Z_i', domain: [m - 4, m + 4] },
        {
          label: 'Q',
          domain: [0, Math.max(10, k * (1 + m * m) + 6 * Math.sqrt(2 * k * (1 + 2 * m * m)))],
        },
      ];
    },
    simulate: (random, s) => {
      const k = int(s, 'k', 3);
      const m = value(s, 'm', 0);
      const events: ContinuousEvent[] = [];
      let total = 0;
      for (let i = 0; i < k; i += 1) {
        const z = random.normal(m, 1);
        total += z * z;
        events.push(draw(0, z), draw(1, total, i === k - 1 ? 'result' : 'chosen'));
      }
      return { events: [...events, end], value: total };
    },
    theory: (s) => {
      const k = int(s, 'k', 3);
      const m = value(s, 'm', 0);
      return m === 0 ? chiSquare(k) : noncentralChiSquare(k, k * m * m);
    },
    reference: (s) =>
      value(s, 'm', 0) > 0
        ? { distribution: chiSquare(int(s, 'k', 3)), label: 'Chi-cuadrada central' }
        : null,
  },
  'cociente-t': {
    stage: 'rows',
    symbol: 'T',
    describe: () => 'normal dividida entre la raíz de una chi-cuadrada sobre sus grados',
    parameters: () => [
      num('nu', 'Grados de libertad', 'ν', 1, 30, 1, 3),
      num('mu', 'Desplazamiento del numerador', 'μ', 0, 4, 0.05, 0),
    ],
    rows: (s) => [
      { label: 'Z', domain: [value(s, 'mu', 0) - 4, value(s, 'mu', 0) + 4] },
      { label: 'V/ν', domain: [0, 3] },
      { label: 'T', domain: [value(s, 'mu', 0) - 8, value(s, 'mu', 0) + 8] },
    ],
    simulate: (random, s) => {
      const nu = int(s, 'nu', 3);
      const z = random.normal(value(s, 'mu', 0), 1);
      const v = random.chiSquare(nu) / nu;
      const t = z / Math.sqrt(v);
      return { events: [draw(0, z), draw(1, v), draw(2, t, 'result'), end], value: t };
    },
    theory: (s) =>
      value(s, 'mu', 0) === 0
        ? studentT(int(s, 'nu', 3))
        : noncentralT(int(s, 'nu', 3), value(s, 'mu', 0)),
    reference: (s) => ({
      distribution: normal(value(s, 'mu', 0), 1),
      label: 'Normal del numerador',
    }),
  },
  'cociente-f': {
    stage: 'rows',
    symbol: 'F',
    describe: () => 'cociente de chi-cuadradas divididas entre sus grados',
    parameters: () => [
      num('d1', 'Grados del numerador', 'd₁', 1, 30, 1, 5),
      num('d2', 'Grados del denominador', 'd₂', 1, 60, 1, 20),
    ],
    rows: () => [
      { label: 'V₁/d₁', domain: [0, 4] },
      { label: 'V₂/d₂', domain: [0, 4] },
      { label: 'F', domain: [0, 6] },
    ],
    simulate: (random, s) => {
      const d1 = int(s, 'd1', 5);
      const d2 = int(s, 'd2', 20);
      const a = random.chiSquare(d1) / d1;
      const b = random.chiSquare(d2) / d2;
      return { events: [draw(0, a), draw(1, b), draw(2, a / b, 'result'), end], value: a / b };
    },
    theory: (s) => fisherF(int(s, 'd1', 5), int(s, 'd2', 20)),
  },
  producto: {
    stage: 'rows',
    symbol: 'X',
    describe: () => 'producto de factores aleatorios positivos',
    parameters: () => [
      num('n', 'Factores multiplicados', 'n', 1, 30, 1, 12),
      num('mu', 'Media del logaritmo', 'μ', -1, 2, 0.05, 0.5),
      num('sigma', 'Desviación del logaritmo', 'σ', 0.1, 1.2, 0.05, 0.5),
    ],
    rows: (s) => {
      const mu = value(s, 'mu', 0.5);
      const sigma = value(s, 'sigma', 0.5);
      return [
        {
          label: 'factor',
          domain: [0, Math.exp(mu / int(s, 'n', 12) + (4 * sigma) / Math.sqrt(int(s, 'n', 12)))],
        },
        { label: 'X', domain: [0, Math.exp(mu + 3 * sigma)] },
      ];
    },
    simulate: (random, s) => {
      const n = int(s, 'n', 12);
      const mu = value(s, 'mu', 0.5);
      const sigma = value(s, 'sigma', 0.5);
      const events: ContinuousEvent[] = [];
      let product = 1;
      for (let i = 0; i < n; i += 1) {
        const factor = Math.exp(random.normal(mu / n, sigma / Math.sqrt(n)));
        product *= factor;
        events.push(draw(0, factor), draw(1, product, i === n - 1 ? 'result' : 'chosen'));
      }
      return { events: [...events, end], value: product };
    },
    theory: (s) => lognormal(value(s, 'mu', 0.5), value(s, 'sigma', 0.5)),
  },
  maximo: {
    stage: 'rows',
    symbol: 'M',
    describe: () => 'máximo de n exponenciales menos log n',
    parameters: () => [num('n', 'Valores comparados', 'n', 1, 50, 1, 20)],
    rows: (s) => [
      { label: 'E_i', domain: [0, Math.log(int(s, 'n', 20)) + 6] },
      { label: 'M', domain: [-3, 7] },
    ],
    simulate: (random, s) => {
      const n = int(s, 'n', 20);
      const draws = Array.from({ length: n }, () => random.exponential(1));
      const best = Math.max(...draws);
      const events: ContinuousEvent[] = draws.map((x) =>
        draw(0, x, x === best ? 'chosen' : 'normal'),
      );
      const m = best - Math.log(n);
      return { events: [...events, draw(1, m, 'result'), end], value: m };
    },
    theory: (s) => {
      const n = int(s, 'n', 20);
      const shift = Math.log(n);
      return numericDistribution(
        n === 1 ? 'Exponencial desplazada' : 'Máximo de exponenciales',
        [-shift, Number.POSITIVE_INFINITY],
        (x) => Math.exp(-x) * (1 - Math.exp(-x) / n) ** (n - 1),
        (x) => (1 - Math.exp(-x) / n) ** n,
        (random) => Math.max(...Array.from({ length: n }, () => random.exponential(1))) - shift,
      );
    },
    reference: () => ({ distribution: gumbel(0, 1), label: 'Gumbel límite' }),
  },
  minimo: {
    stage: 'rows',
    symbol: 'W',
    describe: () => 'resistencia del eslabón más débil, reescalada',
    parameters: () => [
      num('n', 'Eslabones', 'n', 1, 50, 1, 20),
      num('k', 'Forma de la cola inferior', 'k', 0.5, 5, 0.1, 2),
    ],
    rows: () => [
      { label: 'R_i', domain: [0, 1] },
      { label: 'W', domain: [0, 3] },
    ],
    simulate: (random, s) => {
      const n = int(s, 'n', 20);
      const k = value(s, 'k', 2);
      const draws = Array.from({ length: n }, () => random.next() ** (1 / k));
      const weakest = Math.min(...draws);
      const events: ContinuousEvent[] = draws.map((x) =>
        draw(0, x, x === weakest ? 'chosen' : 'normal'),
      );
      const w = weakest * n ** (1 / k);
      return { events: [...events, draw(1, w, 'result'), end], value: w };
    },
    theory: (s) => {
      const n = int(s, 'n', 20);
      const k = value(s, 'k', 2);
      const top = n ** (1 / k);
      return numericDistribution(
        'Mínimo reescalado',
        [0, top],
        (x) => k * x ** (k - 1) * (1 - x ** k / n) ** (n - 1),
        (x) => 1 - (1 - x ** k / n) ** n,
        (random) => Math.min(...Array.from({ length: n }, () => random.next() ** (1 / k))) * top,
      );
    },
    reference: (s) => ({ distribution: weibull(value(s, 'k', 2), 1), label: 'Weibull límite' }),
  },
  'maximo-pareto': {
    stage: 'rows',
    symbol: 'M',
    describe: () => 'máximo de n valores de cola pesada, reescalado',
    parameters: () => [
      num('n', 'Valores comparados', 'n', 1, 50, 1, 20),
      num('alpha', 'Índice de cola', 'α', 1, 6, 0.1, 3),
    ],
    rows: (s) => [
      { label: 'X_i', domain: [1, 1 + 4 * int(s, 'n', 20) ** (1 / value(s, 'alpha', 3))] },
      { label: 'M', domain: [0, 5] },
    ],
    simulate: (random, s) => {
      const n = int(s, 'n', 20);
      const alpha = value(s, 'alpha', 3);
      const draws = Array.from({ length: n }, () => (1 - random.next()) ** (-1 / alpha));
      const best = Math.max(...draws);
      const events: ContinuousEvent[] = draws.map((x) =>
        draw(0, x, x === best ? 'chosen' : 'normal'),
      );
      const m = best / n ** (1 / alpha);
      return { events: [...events, draw(1, m, 'result'), end], value: m };
    },
    theory: (s) => {
      const n = int(s, 'n', 20);
      const alpha = value(s, 'alpha', 3);
      const scale = n ** (1 / alpha);
      return numericDistribution(
        'Máximo reescalado',
        [1 / scale, Number.POSITIVE_INFINITY],
        (x) => alpha * x ** (-alpha - 1) * (1 - x ** -alpha / n) ** (n - 1),
        (x) => (1 - x ** -alpha / n) ** n,
        (random) =>
          Math.max(...Array.from({ length: n }, () => (1 - random.next()) ** (-1 / alpha))) / scale,
      );
    },
    reference: (s) => ({
      distribution: frechet(value(s, 'alpha', 3), 1, 0),
      label: 'Fréchet límite',
    }),
  },
  distancia: {
    stage: 'plane',
    symbol: 'R',
    describe: () => 'distancia del punto al origen',
    parameters: () => [
      num('nu', 'Distancia del centro al origen', 'ν', 0, 6, 0.1, 0),
      num('sigma', 'Dispersión por eje', 'σ', 0.3, 3, 0.05, 1),
    ],
    simulate: (random, s) => {
      const x = random.normal(value(s, 'nu', 0), value(s, 'sigma', 1));
      const y = random.normal(0, value(s, 'sigma', 1));
      return { events: [{ kind: 'point', x, y }, end], value: Math.hypot(x, y) };
    },
    theory: (s) => {
      const d = rice(value(s, 'nu', 0), value(s, 'sigma', 1));
      return value(s, 'nu', 0) === 0 ? { ...d, name: 'Rayleigh' } : d;
    },
  },
  faro: {
    stage: 'lighthouse',
    symbol: 'X',
    describe: () => 'punto donde el haz toca la costa',
    parameters: () => [
      num('x0', 'Posición del faro', 'x₀', -3, 3, 0.1, 0),
      num('gamma', 'Distancia a la costa', 'γ', 0.2, 3, 0.05, 1),
    ],
    simulate: (random, s) => {
      const theta = random.uniform(-Math.PI / 2, Math.PI / 2);
      const x = value(s, 'x0', 0) + value(s, 'gamma', 1) * Math.tan(theta);
      return { events: [{ kind: 'angle', theta }, end], value: x };
    },
    theory: (s) => cauchy(value(s, 'x0', 0), value(s, 'gamma', 1)),
    reference: (s) => ({
      distribution: normal(value(s, 'x0', 0), value(s, 'gamma', 1) * 1.4826),
      label: 'Normal con la misma mediana y cuartiles',
    }),
  },
  'diferencia-exponenciales': {
    stage: 'rows',
    symbol: 'X',
    describe: () => 'diferencia de dos tiempos exponenciales',
    parameters: () => [
      num('mu', 'Localización', 'μ', -3, 3, 0.1, 0),
      num('b', 'Escala', 'b', 0.2, 3, 0.05, 1),
    ],
    rows: (s) => [
      { label: 'E₁', domain: [0, 6 * value(s, 'b', 1)] },
      { label: 'E₂', domain: [0, 6 * value(s, 'b', 1)] },
      {
        label: 'X',
        domain: [
          value(s, 'mu', 0) - 7 * value(s, 'b', 1),
          value(s, 'mu', 0) + 7 * value(s, 'b', 1),
        ],
      },
    ],
    simulate: (random, s) => {
      const b = value(s, 'b', 1);
      const e1 = random.exponential(1 / b);
      const e2 = random.exponential(1 / b);
      const x = value(s, 'mu', 0) + e1 - e2;
      return { events: [draw(0, e1), draw(1, e2), draw(2, x, 'result'), end], value: x };
    },
    theory: (s) => laplace(value(s, 'mu', 0), value(s, 'b', 1)),
    reference: (s) => ({
      distribution: normal(value(s, 'mu', 0), Math.SQRT2 * value(s, 'b', 1)),
      label: 'Normal de la misma varianza',
    }),
  },
  'estadistico-de-orden': {
    stage: 'rows',
    symbol: 'U_{(k)}',
    describe: () => 'k-ésimo menor de n uniformes',
    parameters: () => [
      num('n', 'Uniformes', 'n', 1, 15, 1, 5),
      num('k', 'Posición', 'k', 1, 15, 1, 2),
    ],
    rows: () => [
      { label: 'U_i', domain: [0, 1] },
      { label: 'U_(k)', domain: [0, 1] },
    ],
    simulate: (random, s) => {
      const n = int(s, 'n', 5);
      const k = Math.min(n, int(s, 'k', 2));
      const draws = Array.from({ length: n }, () => random.next());
      const sorted = [...draws].sort((a, b) => a - b);
      const target = sorted[k - 1] ?? 0;
      const events: ContinuousEvent[] = draws.map((x) =>
        draw(0, x, x === target ? 'chosen' : 'normal'),
      );
      return { events: [...events, draw(1, target, 'result'), end], value: target };
    },
    theory: (s) => {
      const n = int(s, 'n', 5);
      const k = Math.min(n, int(s, 'k', 2));
      return beta(k, n - k + 1);
    },
  },
  'log-momios': {
    stage: 'rows',
    symbol: 'X',
    describe: () => 'logaritmo de los momios de una uniforme',
    parameters: () => [
      num('mu', 'Localización', 'μ', -3, 3, 0.1, 0),
      num('s', 'Escala', 's', 0.2, 3, 0.05, 1),
    ],
    rows: (s) => [
      { label: 'U', domain: [0, 1] },
      {
        label: 'X',
        domain: [
          value(s, 'mu', 0) - 8 * value(s, 's', 1),
          value(s, 'mu', 0) + 8 * value(s, 's', 1),
        ],
      },
    ],
    simulate: (random, s) => {
      const u = random.next();
      const x = value(s, 'mu', 0) + value(s, 's', 1) * Math.log(u / (1 - u));
      return { events: [draw(0, u), draw(1, x, 'result'), end], value: x };
    },
    theory: (s) => logistic(value(s, 'mu', 0), value(s, 's', 1)),
    reference: (s) => ({
      distribution: normal(value(s, 'mu', 0), (value(s, 's', 1) * Math.PI) / Math.sqrt(3)),
      label: 'Normal de la misma varianza',
    }),
  },
  'potencia-de-uniforme': {
    stage: 'rows',
    symbol: 'X',
    describe: () => 'mínimo dividido entre una potencia de una uniforme',
    parameters: () => [
      num('xm', 'Valor mínimo', 'xₘ', 0.5, 3, 0.1, 1),
      num('alpha', 'Índice de cola', 'α', 0.5, 6, 0.05, 1.5),
    ],
    rows: (s) => [
      { label: 'U', domain: [0, 1] },
      { label: 'X', domain: [0, value(s, 'xm', 1) * 12] },
    ],
    simulate: (random, s) => {
      const u = 1 - random.next();
      const x = value(s, 'xm', 1) * u ** (-1 / value(s, 'alpha', 1.5));
      return { events: [draw(0, u), draw(1, x, 'result'), end], value: x };
    },
    theory: (s) => pareto(value(s, 'xm', 1), value(s, 'alpha', 1.5)),
  },
  'minimo-de-maximos': {
    stage: 'rows',
    symbol: 'X',
    describe: () => 'menor de b máximos de a uniformes',
    parameters: () => [
      num('a', 'Uniformes por grupo (máximo)', 'a', 1, 6, 1, 2),
      num('b', 'Grupos (mínimo)', 'b', 1, 6, 1, 3),
    ],
    rows: () => [
      { label: 'U', domain: [0, 1] },
      { label: 'máx', domain: [0, 1] },
      { label: 'X', domain: [0, 1] },
    ],
    simulate: (random, s) => {
      const a = int(s, 'a', 2);
      const b = int(s, 'b', 3);
      const events: ContinuousEvent[] = [];
      const maxima: number[] = [];
      for (let g = 0; g < b; g += 1) {
        const group = Array.from({ length: a }, () => random.next());
        const top = Math.max(...group);
        group.forEach((u) => events.push(draw(0, u, u === top ? 'chosen' : 'normal')));
        maxima.push(top);
        events.push(draw(1, top));
      }
      const x = Math.min(...maxima);
      return { events: [...events, draw(2, x, 'result'), end], value: x };
    },
    theory: (s) => kumaraswamy(int(s, 'a', 2), int(s, 'b', 3)),
  },
  truncamiento: {
    stage: 'rows',
    symbol: 'X',
    describe: () => 'normal aceptada dentro del intervalo',
    parameters: () => [
      num('mu', 'Media de la normal', 'μ', -3, 3, 0.1, 0),
      num('sigma', 'Desviación de la normal', 'σ', 0.3, 3, 0.05, 1),
      num('a', 'Límite inferior', 'a', -5, 4.9, 0.1, 0),
      num('b', 'Límite superior', 'b', -4.9, 5, 0.1, 5),
    ],
    rows: (s) => [
      {
        label: 'Z',
        domain: [
          value(s, 'mu', 0) - 4 * value(s, 'sigma', 1),
          value(s, 'mu', 0) + 4 * value(s, 'sigma', 1),
        ],
      },
    ],
    simulate: (random, s) => {
      const mu = value(s, 'mu', 0);
      const sigma = value(s, 'sigma', 1);
      const a = value(s, 'a', 0);
      const b = Math.max(a + 0.1, value(s, 'b', 5));
      const events: ContinuousEvent[] = [];
      for (let i = 0; i < 2000; i += 1) {
        const z = random.normal(mu, sigma);
        if (z >= a && z <= b) return { events: [...events, draw(0, z, 'result'), end], value: z };
        events.push(draw(0, z, 'rejected'));
      }
      const fallback = truncatedNormal(mu, sigma, a, b).sample(random);
      return { events: [...events, draw(0, fallback, 'result'), end], value: fallback };
    },
    theory: (s) => {
      const a = value(s, 'a', 0);
      return truncatedNormal(
        value(s, 'mu', 0),
        value(s, 'sigma', 1),
        a,
        Math.max(a + 0.1, value(s, 'b', 5)),
      );
    },
    reference: (s) => ({
      distribution: normal(value(s, 'mu', 0), value(s, 'sigma', 1)),
      label: 'Normal original',
    }),
  },
  seleccion: {
    stage: 'rows',
    symbol: 'X',
    describe: () => 'normal conservada o reflejada según un umbral',
    parameters: () => [num('alpha', 'Forma (asimetría)', 'α', -8, 8, 0.1, 3)],
    rows: () => [
      { label: 'Z₁', domain: [-4, 4] },
      { label: 'Z₀', domain: [-4, 4] },
      { label: 'X', domain: [-4, 4] },
    ],
    simulate: (random, s) => {
      const alpha = value(s, 'alpha', 3);
      const z1 = random.normal();
      const z0 = random.normal();
      const keep = z0 <= alpha * z1;
      const x = keep ? z1 : -z1;
      return {
        events: [draw(0, z1), draw(1, z0, keep ? 'chosen' : 'rejected'), draw(2, x, 'result'), end],
        value: x,
      };
    },
    theory: (s) => skewNormal(0, 1, value(s, 'alpha', 3)),
    reference: () => ({ distribution: normal(0, 1), label: 'Normal estándar' }),
  },
  'inverso-gamma': {
    stage: 'rows',
    symbol: 'X',
    describe: () => 'inverso de una gamma',
    parameters: () => [
      num('alpha', 'Forma', 'α', 0.5, 12, 0.1, 3),
      num('beta', 'Escala', 'β', 0.2, 10, 0.1, 2),
    ],
    rows: (s) => [
      {
        label: 'G',
        domain: [
          0,
          (value(s, 'alpha', 3) + 5 * Math.sqrt(value(s, 'alpha', 3))) / value(s, 'beta', 2),
        ],
      },
      {
        label: 'X = 1/G',
        domain: [0, inverseGamma(value(s, 'alpha', 3), value(s, 'beta', 2)).quantile(0.98)],
      },
    ],
    simulate: (random, s) => {
      const g = random.gamma(value(s, 'alpha', 3), value(s, 'beta', 2));
      return { events: [draw(0, g), draw(1, 1 / g, 'result'), end], value: 1 / g };
    },
    theory: (s) => inverseGamma(value(s, 'alpha', 3), value(s, 'beta', 2)),
  },
  'inverso-cuadrado': {
    stage: 'rows',
    symbol: 'X',
    describe: () => 'escala dividida entre el cuadrado de una normal',
    parameters: () => [
      num('mu', 'Localización', 'μ', -2, 2, 0.1, 0),
      num('c', 'Escala', 'c', 0.1, 4, 0.05, 1),
    ],
    rows: (s) => [
      { label: 'Z', domain: [-4, 4] },
      { label: 'X', domain: [value(s, 'mu', 0), value(s, 'mu', 0) + 25 * value(s, 'c', 1)] },
    ],
    simulate: (random, s) => {
      const z = random.normal();
      const x = value(s, 'mu', 0) + value(s, 'c', 1) / (z * z);
      return { events: [draw(0, z), draw(1, x, 'result'), end], value: x };
    },
    theory: (s) => levy(value(s, 'mu', 0), value(s, 'c', 1)),
    window: (s) => [value(s, 'mu', 0), value(s, 'mu', 0) + 20 * value(s, 'c', 1)],
  },
  direccion: {
    stage: 'circle',
    symbol: 'Θ',
    describe: () => 'dirección en radianes',
    parameters: () => [
      num('mu', 'Dirección media (radianes)', 'μ', -3.1, 3.1, 0.05, 0),
      num('kappa', 'Concentración', 'κ', 0, 20, 0.1, 2),
    ],
    simulate: (random, s) => {
      const theta = vonMises(value(s, 'mu', 0), value(s, 'kappa', 2)).sample(random);
      return { events: [{ kind: 'angle', theta }, end], value: theta };
    },
    theory: (s) => vonMises(value(s, 'mu', 0), value(s, 'kappa', 2)),
  },
  'suma-colas-pesadas': {
    stage: 'rows',
    symbol: 'S',
    describe: () => 'suma de pasos de cola pesada dividida entre n^(1/α)',
    parameters: () => [
      num('alpha', 'Índice de estabilidad', 'α', 0.6, 1.9, 0.05, 1.5),
      num('n', 'Pasos sumados', 'n', 1, 50, 1, 30),
    ],
    rows: () => [
      { label: 'pasos', domain: [-10, 10] },
      { label: 'S', domain: [-10, 10] },
    ],
    simulate: (random, s) => {
      const alpha = value(s, 'alpha', 1.5);
      const n = int(s, 'n', 30);
      const norm = n ** (1 / alpha);
      const events: ContinuousEvent[] = [];
      let total = 0;
      for (let i = 0; i < n; i += 1) {
        const step = heavyStep(random, alpha);
        total += step;
        events.push(draw(0, step), draw(1, total / norm, i === n - 1 ? 'result' : 'chosen'));
      }
      return { events: [...events, end], value: total / norm };
    },
    theory: (s) => {
      const alpha = value(s, 'alpha', 1.5);
      return stable(alpha, 0, stableTailConstant(alpha) ** (-1 / alpha), 0);
    },
  },
};

export function processSpec(process: ContinuousProcess): ProcessSpec {
  return SPECS[process];
}

export function defaultUnit(config: ContinuousGenesisConfig): string {
  return config.unidad ?? '';
}
