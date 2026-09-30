import {
  bernoulli,
  betaBinomial,
  binomial,
  categorical,
  discreteUniform,
  geometric,
  hypergeometric,
  logarithmic,
  logarithmicMixingProbability,
  negativeBinomial,
  poisson,
  rademacher,
  rademacherSum,
  shifted,
  skellam,
  zeroInflatedPoisson,
  zipf,
  type DiscreteDistribution,
} from '../../../lib/distributions/index.ts';
import type { Random } from '../../../lib/random/index.ts';
import type { NumberParameter } from '../../core/parameters.ts';
import type { DistributionGenesisConfig, GenesisProcess } from './schema.ts';

export type GenesisEvent =
  | { kind: 'roll'; value: number }
  | { kind: 'trial'; success: boolean }
  | { kind: 'sign'; value: 1 | -1 }
  | { kind: 'bias'; p: number; u?: number }
  | { kind: 'gate'; structural: boolean }
  | { kind: 'draw'; ball: number; success: boolean }
  | { kind: 'arrival'; time: number; stream: 0 | 1 }
  | { kind: 'slot'; index: number }
  | { kind: 'spin'; category: number }
  | { kind: 'ball'; category: number }
  | { kind: 'pick'; rank: number }
  | { kind: 'end' };

export interface Experiment {
  events: GenesisEvent[];
  value: number;
  /** Category counts of a multinomial experiment. */
  counts?: number[];
  /** The value comes from the structural-zero branch of a mixture. */
  structural?: boolean;
}

export type StageKind =
  'die' | 'coins' | 'urn' | 'timeline' | 'spinner' | 'bins' | 'ranking' | 'signs';

export interface Category {
  label: string;
  probability: number;
}

/** Everything a process needs: slider values and the resolved options of the configuration. */
export interface GenesisSettings {
  process: GenesisProcess;
  values: Record<string, number>;
  replacement: boolean;
  countTrials: boolean;
  categories: Category[];
  /** Index of the category whose marginal count is plotted (multinomial). */
  focus: number;
  slots: number | null;
  success: string;
  failure: string;
  streams: [string, string];
  unit: string;
  rankLabels: readonly string[];
}

export interface ReferenceCurve {
  distribution: DiscreteDistribution;
  label: string;
}

interface ProcessSpec {
  stage: StageKind;
  /** Symbol and description of the recorded value. */
  symbol: string;
  describe: (settings: GenesisSettings) => string;
  parameters: (config: DistributionGenesisConfig) => NumberParameter[];
  simulate: (random: Random, settings: GenesisSettings) => Experiment;
  theory: (settings: GenesisSettings) => DiscreteDistribution;
  reference?: (settings: GenesisSettings) => ReferenceCurve | null;
  /** Whether the process offers a "count trials or failures" choice. */
  waiting?: 'first' | 'r';
}

/** Safety cap for waiting-time loops; with the slider ranges it is never reached in practice. */
const MAX_TRIALS = 4000;
const DEFAULT_CATEGORIES: Category[] = [
  { label: 'A', probability: 0.4 },
  { label: 'B', probability: 0.3 },
  { label: 'C', probability: 0.2 },
  { label: 'D', probability: 0.1 },
];

const num = (
  key: string,
  label: string,
  symbol: string,
  min: number,
  max: number,
  step: number,
  value: number,
): NumberParameter => ({ type: 'number', key, label, symbol, min, max, step, default: value });

function v(settings: GenesisSettings, key: string, fallback: number): number {
  const value = settings.values[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** Urn sizes are clamped so the successes and the sample always fit in the population. */
export function urnSizes(settings: GenesisSettings) {
  const population = Math.round(v(settings, 'N', 30));
  const marked = Math.min(population, Math.round(v(settings, 'K', 10)));
  const draws = Math.min(population, Math.round(v(settings, 'n', 8)));
  return { population, marked, draws };
}

export function dieRange(settings: GenesisSettings) {
  const low = Math.round(v(settings, 'a', 1));
  return { low, high: Math.max(low, Math.round(v(settings, 'b', 6))) };
}

/** Probabilities of the categories after normalizing the weight sliders. */
export function categoryProbabilities(settings: GenesisSettings): number[] {
  const weights = settings.categories.map((category, index) =>
    Math.max(0, v(settings, `w${index}`, category.probability)),
  );
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return total > 0
    ? weights.map((weight) => weight / total)
    : weights.map(() => 1 / weights.length);
}

export function slotProbability(settings: GenesisSettings): number {
  const slots = slotCount(settings);
  return slots ? Math.min(1, v(settings, 'lambda', 3) / slots) : 0;
}

export function slotCount(settings: GenesisSettings): number | null {
  return settings.slots === null ? null : Math.round(v(settings, 'm', settings.slots));
}

/** One weight slider per category; the weights are normalized into probabilities. */
function weightParameters(categories: readonly Category[]): NumberParameter[] {
  return categories.map((category, index) =>
    num(
      `w${index}`,
      `Peso de ${category.label}`,
      `w${index + 1}`,
      0,
      1,
      0.01,
      category.probability,
    ),
  );
}

function trials(random: Random, p: number, count: number): GenesisEvent[] {
  return Array.from({ length: count }, () => ({ kind: 'trial', success: random.bernoulli(p) }));
}

/** Trials until `target` successes; returns the events and the number of trials used. */
function trialsUntil(random: Random, p: number, target: number) {
  const events: GenesisEvent[] = [];
  let successes = 0;
  while (successes < target && events.length < MAX_TRIALS) {
    const success = random.bernoulli(p);
    if (success) successes += 1;
    events.push({ kind: 'trial', success });
  }
  return { events, count: events.length };
}

/** Arrival times of a Poisson process of the given rate on [0, 1). */
function arrivals(random: Random, rate: number, stream: 0 | 1): GenesisEvent[] {
  const events: GenesisEvent[] = [];
  let time = random.exponential(rate);
  while (time < 1 && events.length < MAX_TRIALS) {
    events.push({ kind: 'arrival', time, stream });
    time += random.exponential(rate);
  }
  return events;
}

const count = (events: readonly GenesisEvent[], success = true) =>
  events.filter((event) => event.kind === 'trial' && event.success === success).length;

const end: GenesisEvent = { kind: 'end' };

const PROCESS_SPECS: Record<GenesisProcess, ProcessSpec> = {
  dado: {
    stage: 'die',
    symbol: 'X',
    describe: () => 'valor obtenido',
    parameters: () => [
      num('a', 'Valor mínimo', 'a', 0, 10, 1, 1),
      num('b', 'Valor máximo', 'b', 1, 20, 1, 6),
    ],
    simulate: (random, settings) => {
      const { low, high } = dieRange(settings);
      const value = random.int(low, high);
      return { events: [{ kind: 'roll', value }, end], value };
    },
    theory: (settings) => {
      const { low, high } = dieRange(settings);
      return discreteUniform(low, high);
    },
  },
  moneda: {
    stage: 'coins',
    symbol: 'X',
    describe: (settings) => `1 si ocurre "${settings.success}", 0 si no`,
    parameters: () => [num('p', 'Probabilidad de éxito', 'p', 0, 1, 0.01, 0.3)],
    simulate: (random, settings) => {
      const success = random.bernoulli(v(settings, 'p', 0.3));
      return { events: [{ kind: 'trial', success }, end], value: success ? 1 : 0 };
    },
    theory: (settings) => bernoulli(v(settings, 'p', 0.3)),
  },
  ensayos: {
    stage: 'coins',
    symbol: 'X',
    describe: (settings) => `número de "${settings.success}" en n ensayos`,
    parameters: () => [
      num('n', 'Número de ensayos', 'n', 1, 40, 1, 10),
      num('p', 'Probabilidad de éxito', 'p', 0, 1, 0.01, 0.5),
    ],
    simulate: (random, settings) => {
      const events = trials(random, v(settings, 'p', 0.5), Math.round(v(settings, 'n', 10)));
      return { events: [...events, end], value: count(events) };
    },
    theory: (settings) => binomial(Math.round(v(settings, 'n', 10)), v(settings, 'p', 0.5)),
  },
  'primer-exito': {
    stage: 'coins',
    symbol: 'X',
    waiting: 'first',
    describe: (settings) =>
      settings.countTrials
        ? 'ensayos hasta el primer éxito, incluido'
        : 'fracasos antes del primer éxito',
    parameters: () => [num('p', 'Probabilidad de éxito', 'p', 0.05, 1, 0.01, 0.25)],
    simulate: (random, settings) => {
      const { events, count: used } = trialsUntil(random, v(settings, 'p', 0.25), 1);
      return { events: [...events, end], value: settings.countTrials ? used : used - 1 };
    },
    theory: (settings) => {
      const trialsDistribution = geometric(v(settings, 'p', 0.25));
      return settings.countTrials ? trialsDistribution : shifted(trialsDistribution, -1);
    },
  },
  'r-exitos': {
    stage: 'coins',
    symbol: 'X',
    waiting: 'r',
    describe: (settings) =>
      settings.countTrials ? 'ensayos hasta el r-ésimo éxito' : 'fracasos antes del r-ésimo éxito',
    parameters: () => [
      num('r', 'Éxitos requeridos', 'r', 1, 10, 1, 3),
      num('p', 'Probabilidad de éxito', 'p', 0.05, 1, 0.01, 0.4),
    ],
    simulate: (random, settings) => {
      const r = Math.round(v(settings, 'r', 3));
      const { events, count: used } = trialsUntil(random, v(settings, 'p', 0.4), r);
      return { events: [...events, end], value: settings.countTrials ? used : used - r };
    },
    theory: (settings) => {
      const r = Math.round(v(settings, 'r', 3));
      const failures = negativeBinomial(r, v(settings, 'p', 0.4));
      return settings.countTrials ? shifted(failures, r) : failures;
    },
  },
  urna: {
    stage: 'urn',
    symbol: 'X',
    describe: (settings) => `bolas "${settings.success}" en la muestra`,
    parameters: () => [
      num('N', 'Bolas en la urna', 'N', 2, 100, 1, 30),
      num('K', 'Bolas marcadas', 'K', 0, 100, 1, 10),
      num('n', 'Extracciones', 'n', 1, 100, 1, 8),
    ],
    simulate: (random, settings) => {
      const { population, marked, draws } = urnSizes(settings);
      const indices = Array.from({ length: population }, (_, index) => index);
      const balls = settings.replacement
        ? Array.from({ length: draws }, () => random.int(0, population - 1))
        : random.sample(indices, draws);
      const events: GenesisEvent[] = balls.map((ball) => ({
        kind: 'draw',
        ball,
        success: ball < marked,
      }));
      return { events: [...events, end], value: balls.filter((ball) => ball < marked).length };
    },
    theory: (settings) => {
      const { population, marked, draws } = urnSizes(settings);
      return settings.replacement
        ? binomial(draws, marked / population)
        : hypergeometric(population, marked, draws);
    },
    reference: (settings) => {
      const { population, marked, draws } = urnSizes(settings);
      return settings.replacement
        ? {
            distribution: hypergeometric(population, marked, draws),
            label: 'Sin reemplazo (hipergeométrica)',
          }
        : { distribution: binomial(draws, marked / population), label: 'Con reemplazo (binomial)' };
    },
  },
  llegadas: {
    stage: 'timeline',
    symbol: 'N',
    describe: (settings) => settings.unit,
    parameters: (config) => [
      num('lambda', 'Tasa de llegadas por intervalo', 'λ', 0.1, 15, 0.1, 3),
      ...(config.rendijas ? [num('m', 'Número de rendijas', 'm', 2, 200, 1, config.rendijas)] : []),
    ],
    simulate: (random, settings) => {
      const slots = slotCount(settings);
      if (slots) {
        const p = slotProbability(settings);
        const events: GenesisEvent[] = [];
        for (let index = 0; index < slots; index += 1) {
          if (random.bernoulli(p)) events.push({ kind: 'slot', index });
        }
        return { events: [...events, end], value: events.length };
      }
      const events = arrivals(random, v(settings, 'lambda', 3), 0);
      return { events: [...events, end], value: events.length };
    },
    theory: (settings) => {
      const slots = slotCount(settings);
      return slots ? binomial(slots, slotProbability(settings)) : poisson(v(settings, 'lambda', 3));
    },
    reference: (settings) =>
      slotCount(settings)
        ? { distribution: poisson(v(settings, 'lambda', 3)), label: 'Poisson con la misma tasa' }
        : null,
  },
  ruleta: {
    stage: 'spinner',
    symbol: 'X',
    describe: () => 'categoría obtenida',
    parameters: (config) => weightParameters(defaultCategories(config)),
    simulate: (random, settings) => {
      const category = random.categorical(categoryProbabilities(settings));
      return { events: [{ kind: 'spin', category }, end], value: category };
    },
    theory: (settings) => categorical(categoryProbabilities(settings)),
  },
  'bolas-en-cajas': {
    stage: 'bins',
    symbol: 'X',
    describe: (settings) => `bolas en la caja ${settings.categories[settings.focus]?.label ?? ''}`,
    parameters: (config) => [
      num('n', 'Número de bolas', 'n', 1, 30, 1, 8),
      ...weightParameters(defaultCategories(config)),
    ],
    simulate: (random, settings) => {
      const probabilities = categoryProbabilities(settings);
      const balls = Math.round(v(settings, 'n', 8));
      const counts = probabilities.map(() => 0);
      const events: GenesisEvent[] = [];
      for (let i = 0; i < balls; i += 1) {
        const category = random.categorical(probabilities);
        counts[category] = (counts[category] ?? 0) + 1;
        events.push({ kind: 'ball', category });
      }
      return { events: [...events, end], value: counts[settings.focus] ?? 0, counts };
    },
    theory: (settings) =>
      binomial(
        Math.round(v(settings, 'n', 8)),
        categoryProbabilities(settings)[settings.focus] ?? 0,
      ),
  },
  'beta-binomial': {
    stage: 'coins',
    symbol: 'X',
    describe: (settings) => `número de "${settings.success}" con p sorteada`,
    parameters: () => [
      num('n', 'Número de ensayos', 'n', 1, 40, 1, 12),
      num('alpha', 'Forma α de la beta', 'α', 0.2, 20, 0.1, 1.5),
      num('beta', 'Forma β de la beta', 'β', 0.2, 20, 0.1, 1.5),
    ],
    simulate: (random, settings) => {
      const p = random.beta(v(settings, 'alpha', 1.5), v(settings, 'beta', 1.5));
      const events = trials(random, p, Math.round(v(settings, 'n', 12)));
      return { events: [{ kind: 'bias', p }, ...events, end], value: count(events) };
    },
    theory: (settings) =>
      betaBinomial(
        Math.round(v(settings, 'n', 12)),
        v(settings, 'alpha', 1.5),
        v(settings, 'beta', 1.5),
      ),
    reference: (settings) => {
      const a = v(settings, 'alpha', 1.5);
      const p = a / (a + v(settings, 'beta', 1.5));
      return {
        distribution: binomial(Math.round(v(settings, 'n', 12)), p),
        label: 'Binomial con p fija igual a la media',
      };
    },
  },
  ranking: {
    stage: 'ranking',
    symbol: 'K',
    describe: () => 'rango del elemento elegido',
    parameters: () => [
      num('N', 'Número de rangos', 'N', 2, 100, 1, 30),
      num('s', 'Exponente', 's', 0, 3, 0.05, 1),
    ],
    simulate: (random, settings) => {
      const rank = zipf(Math.round(v(settings, 'N', 30)), v(settings, 's', 1)).sample(random);
      return { events: [{ kind: 'pick', rank }, end], value: rank };
    },
    theory: (settings) => zipf(Math.round(v(settings, 'N', 30)), v(settings, 's', 1)),
  },
  'mezcla-geometrica': {
    stage: 'coins',
    symbol: 'X',
    describe: () => 'ensayos hasta el primer éxito con probabilidad sorteada',
    parameters: () => [num('p', 'Parámetro', 'p', 0.05, 0.98, 0.01, 0.8)],
    simulate: (random, settings) => {
      const u = random.next();
      const s = logarithmicMixingProbability(v(settings, 'p', 0.8), u);
      const { events, count: used } = trialsUntil(random, s, 1);
      return { events: [{ kind: 'bias', p: s, u }, ...events, end], value: used };
    },
    theory: (settings) => logarithmic(v(settings, 'p', 0.8)),
  },
  'ceros-inflados': {
    stage: 'timeline',
    symbol: 'X',
    describe: (settings) => settings.unit,
    parameters: () => [
      num('pi', 'Probabilidad de cero estructural', 'π', 0, 0.95, 0.01, 0.35),
      num('lambda', 'Tasa de la parte Poisson', 'λ', 0.1, 15, 0.1, 3),
    ],
    simulate: (random, settings) => {
      const structural = random.bernoulli(v(settings, 'pi', 0.35));
      if (structural) return { events: [{ kind: 'gate', structural }, end], value: 0, structural };
      const events = arrivals(random, v(settings, 'lambda', 3), 0);
      return { events: [{ kind: 'gate', structural }, ...events, end], value: events.length };
    },
    theory: (settings) => zeroInflatedPoisson(v(settings, 'pi', 0.35), v(settings, 'lambda', 3)),
    reference: (settings) => {
      const mean = (1 - v(settings, 'pi', 0.35)) * v(settings, 'lambda', 3);
      return mean > 0 ? { distribution: poisson(mean), label: 'Poisson con la misma media' } : null;
    },
  },
  'diferencia-de-llegadas': {
    stage: 'timeline',
    symbol: 'X',
    describe: (settings) => `${settings.streams[0]} menos ${settings.streams[1]}`,
    parameters: () => [
      num('mu1', 'Tasa del primer flujo', 'μ₁', 0.1, 10, 0.1, 1.6),
      num('mu2', 'Tasa del segundo flujo', 'μ₂', 0.1, 10, 0.1, 1.1),
    ],
    simulate: (random, settings) => {
      const first = arrivals(random, v(settings, 'mu1', 1.6), 0);
      const second = arrivals(random, v(settings, 'mu2', 1.1), 1);
      const events = [...first, ...second].sort(
        (a, b) => (a.kind === 'arrival' ? a.time : 0) - (b.kind === 'arrival' ? b.time : 0),
      );
      return { events: [...events, end], value: first.length - second.length };
    },
    theory: (settings) => skellam(v(settings, 'mu1', 1.6), v(settings, 'mu2', 1.1)),
  },
  signos: {
    stage: 'signs',
    symbol: 'S',
    describe: () => 'suma de los signos',
    parameters: () => [num('n', 'Signos sumados', 'n', 1, 40, 1, 1)],
    simulate: (random, settings) => {
      const events: GenesisEvent[] = Array.from(
        { length: Math.round(v(settings, 'n', 1)) },
        () => ({
          kind: 'sign',
          value: random.bernoulli(0.5) ? 1 : -1,
        }),
      );
      const value = events.reduce(
        (sum, event) => sum + (event.kind === 'sign' ? event.value : 0),
        0,
      );
      return { events: [...events, end], value };
    },
    theory: (settings) => {
      const n = Math.round(v(settings, 'n', 1));
      return n === 1 ? rademacher() : rademacherSum(n);
    },
  },
};

export function processSpec(process: GenesisProcess): ProcessSpec {
  return PROCESS_SPECS[process];
}

export function defaultCategories(config: DistributionGenesisConfig): Category[] {
  const fallback =
    config.proceso === 'bolas-en-cajas' ? DEFAULT_CATEGORIES.slice(0, 3) : DEFAULT_CATEGORIES;
  return config.categorias
    ? config.categorias.map((category) => ({
        label: category.etiqueta,
        probability: category.probabilidad,
      }))
    : fallback;
}
