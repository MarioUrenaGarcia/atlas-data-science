/**
 * Discrete random variables with finitely many values: probability mass
 * functions built from sample spaces, and the summaries computed from them
 * (cumulative distribution, quantiles, expectation, variance, moments,
 * shape measures and expectations of functions).
 */
import { experiment, type ExperimentId, type Outcome } from './sampleSpace.ts';

export interface FinitePmf {
  /** Distinct values in increasing order. */
  values: number[];
  /** Probability of each value, same order; they add up to one. */
  probs: number[];
}

/** Builds a PMF from value and probability lists, merging repeated values and normalizing. */
export function makePmf(values: readonly number[], probs: readonly number[]): FinitePmf {
  const totals = new Map<number, number>();
  values.forEach((value, index) =>
    totals.set(value, (totals.get(value) ?? 0) + (probs[index] ?? 0)),
  );
  const sortedValues = [...totals.keys()].sort((a, b) => a - b);
  const total = sortedValues.reduce((sum, value) => sum + (totals.get(value) ?? 0), 0);
  return {
    values: sortedValues,
    probs: sortedValues.map((value) => (total > 0 ? (totals.get(value) ?? 0) / total : 0)),
  };
}

export const VARIABLE_IDS = [
  'suma',
  'maximo',
  'minimo',
  'diferencia',
  'producto',
  'primero',
  'segundo',
  'numero-de-seises',
  'indicadora-dobles',
  'indicadora-suma-7',
  'valor',
  'cuadrado',
  'indicadora-par',
  'numero-de-caras',
  'indicadora-primera-cara',
  'ganancia-apuesta',
  'valor-carta',
  'indicadora-corazon',
] as const;
export type VariableId = (typeof VARIABLE_IDS)[number];

export interface VariableDefinition {
  id: VariableId;
  /** Spanish description, such as "la suma de los dos dados". */
  label: string;
  /** Symbolic name shown in formulas, such as "S". */
  symbol: string;
  map: (outcome: Outcome) => number;
}

const heads = (o: Outcome) => o.filter((value) => value === 0).length;

const DICE_VARIABLES: VariableDefinition[] = [
  {
    id: 'suma',
    label: 'la suma de los dados',
    symbol: 'S',
    map: (o) => o.reduce((a, b) => a + b, 0),
  },
  { id: 'maximo', label: 'el mayor de los dados', symbol: 'M', map: (o) => Math.max(...o) },
  { id: 'minimo', label: 'el menor de los dados', symbol: 'm', map: (o) => Math.min(...o) },
  {
    id: 'diferencia',
    label: 'la diferencia absoluta de los dados',
    symbol: 'D',
    map: (o) => Math.abs((o[0] ?? 0) - (o[1] ?? 0)),
  },
  {
    id: 'producto',
    label: 'el producto de los dados',
    symbol: 'P',
    map: (o) => o.reduce((a, b) => a * b, 1),
  },
  { id: 'primero', label: 'el valor del primer dado', symbol: 'X_1', map: (o) => o[0] ?? 0 },
  { id: 'segundo', label: 'el valor del segundo dado', symbol: 'X_2', map: (o) => o[1] ?? 0 },
  {
    id: 'numero-de-seises',
    label: 'el número de seises',
    symbol: 'N',
    map: (o) => o.filter((value) => value === 6).length,
  },
  {
    id: 'indicadora-dobles',
    label: 'la indicadora de dobles',
    symbol: 'I',
    map: (o) => (o[0] === o[1] ? 1 : 0),
  },
  {
    id: 'indicadora-suma-7',
    label: 'la indicadora de suma 7',
    symbol: 'I',
    map: (o) => (o.reduce((a, b) => a + b, 0) === 7 ? 1 : 0),
  },
];

const DIE_VARIABLES: VariableDefinition[] = [
  { id: 'valor', label: 'la cara que sale', symbol: 'X', map: (o) => o[0] ?? 0 },
  { id: 'cuadrado', label: 'el cuadrado de la cara', symbol: 'X^2', map: (o) => (o[0] ?? 0) ** 2 },
  {
    id: 'indicadora-par',
    label: 'la indicadora de cara par',
    symbol: 'I',
    map: (o) => ((o[0] ?? 0) % 2 === 0 ? 1 : 0),
  },
  {
    id: 'ganancia-apuesta',
    label: 'la ganancia de apostar 1 al 6 (paga 4)',
    symbol: 'G',
    map: (o) => (o[0] === 6 ? 4 : -1),
  },
];

const COIN_VARIABLES: VariableDefinition[] = [
  { id: 'numero-de-caras', label: 'el número de caras', symbol: 'X', map: heads },
  {
    id: 'indicadora-primera-cara',
    label: 'la indicadora de que la primera moneda cae cara',
    symbol: 'I',
    map: (o) => (o[0] === 0 ? 1 : 0),
  },
];

const CARD_VARIABLES: VariableDefinition[] = [
  {
    id: 'valor-carta',
    label: 'el valor de la carta (as = 1, J = 11, Q = 12, K = 13)',
    symbol: 'V',
    map: (o) => (o[1] ?? 0) + 1,
  },
  {
    id: 'indicadora-corazon',
    label: 'la indicadora de corazones',
    symbol: 'I',
    map: (o) => (o[0] === 0 ? 1 : 0),
  },
];

export function variablesFor(id: ExperimentId): VariableDefinition[] {
  if (id === 'dos-dados' || id === 'cuatro-dados') {
    return id === 'dos-dados'
      ? DICE_VARIABLES
      : DICE_VARIABLES.filter((variable) =>
          ['suma', 'maximo', 'minimo', 'numero-de-seises'].includes(variable.id),
        );
  }
  if (id === 'dado') return DIE_VARIABLES;
  if (id === 'carta') return CARD_VARIABLES;
  if (id === 'comite') return [];
  return COIN_VARIABLES;
}

export function findVariable(
  experimentId: ExperimentId,
  variableId: string,
): VariableDefinition | undefined {
  return variablesFor(experimentId).find((variable) => variable.id === variableId);
}

/** PMF of a variable defined on an equiprobable sample space. */
export function pmfOfVariable(
  experimentId: ExperimentId,
  map: (outcome: Outcome) => number,
): FinitePmf {
  const space = experiment(experimentId);
  const values = space.outcomes.map(map);
  return makePmf(
    values,
    values.map(() => 1),
  );
}

export function cdfAt(pmf: FinitePmf, x: number): number {
  return pmf.values.reduce(
    (sum, value, index) => (value <= x ? sum + (pmf.probs[index] ?? 0) : sum),
    0,
  );
}

/** Generalized inverse: the smallest value whose cumulative probability reaches p. */
export function quantileOf(pmf: FinitePmf, p: number): number {
  let cumulative = 0;
  for (let index = 0; index < pmf.values.length; index += 1) {
    cumulative += pmf.probs[index] ?? 0;
    if (cumulative >= p - 1e-12) return pmf.values[index] ?? 0;
  }
  return pmf.values.at(-1) ?? 0;
}

/** E[g(X)] by the law of the unconscious statistician. */
export function expectationOf(pmf: FinitePmf, g: (x: number) => number = (x) => x): number {
  return pmf.values.reduce((sum, value, index) => sum + g(value) * (pmf.probs[index] ?? 0), 0);
}

export function varianceOf(pmf: FinitePmf): number {
  const mean = expectationOf(pmf);
  return expectationOf(pmf, (x) => (x - mean) ** 2);
}

export function rawMoment(pmf: FinitePmf, k: number): number {
  return expectationOf(pmf, (x) => x ** k);
}

export function centralMoment(pmf: FinitePmf, k: number): number {
  const mean = expectationOf(pmf);
  return expectationOf(pmf, (x) => (x - mean) ** k);
}

/** Skewness E[(X - mu)^3] / sigma^3; zero for a degenerate variable. */
export function skewnessOf(pmf: FinitePmf): number {
  const sd = Math.sqrt(varianceOf(pmf));
  return sd > 0 ? centralMoment(pmf, 3) / sd ** 3 : 0;
}

/** Excess kurtosis E[(X - mu)^4] / sigma^4 - 3. */
export function excessKurtosisOf(pmf: FinitePmf): number {
  const variance = varianceOf(pmf);
  return variance > 0 ? centralMoment(pmf, 4) / variance ** 2 - 3 : 0;
}

/** Every median: values m with P(X <= m) >= 1/2 and P(X >= m) >= 1/2, returned as an interval. */
export function medianInterval(pmf: FinitePmf): [number, number] {
  const low = quantileOf(pmf, 0.5);
  const atLow = cdfAt(pmf, low);
  if (Math.abs(atLow - 0.5) > 1e-12) return [low, low];
  // When F(m) is exactly 1/2 every point up to the next value is a median.
  const next = pmf.values.find((value) => value > low) ?? low;
  return [low, next];
}

export function modesOf(pmf: FinitePmf): number[] {
  const top = Math.max(...pmf.probs);
  return pmf.values.filter((_, index) => Math.abs((pmf.probs[index] ?? 0) - top) < 1e-12);
}

/** Moment generating function M(t) = E[e^{tX}]. */
export function mgfOf(pmf: FinitePmf, t: number): number {
  return expectationOf(pmf, (x) => Math.exp(t * x));
}

/** Probability generating function G(s) = E[s^X], for nonnegative integer values. */
export function pgfOf(pmf: FinitePmf, s: number): number {
  return expectationOf(pmf, (x) => s ** x);
}

/** Characteristic function phi(t) = E[e^{itX}] as [real, imaginary] parts. */
export function characteristicOf(pmf: FinitePmf, t: number): [number, number] {
  return [expectationOf(pmf, (x) => Math.cos(t * x)), expectationOf(pmf, (x) => Math.sin(t * x))];
}

/** Cumulants of orders 1 to 4 from the raw moments m1..m4. */
export function cumulantsFromRawMoments(m: readonly number[]): [number, number, number, number] {
  const [m1 = 0, m2 = 0, m3 = 0, m4 = 0] = m;
  return [
    m1,
    m2 - m1 ** 2,
    m3 - 3 * m2 * m1 + 2 * m1 ** 3,
    m4 - 4 * m3 * m1 - 3 * m2 ** 2 + 12 * m2 * m1 ** 2 - 6 * m1 ** 4,
  ];
}

/** Pmf of aX + b. */
export function affinePmf(pmf: FinitePmf, a: number, b: number): FinitePmf {
  return makePmf(
    pmf.values.map((value) => a * value + b),
    pmf.probs,
  );
}
