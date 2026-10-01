/**
 * Finite sample spaces of classic experiments (coins, dice, cards) with a
 * catalog of named events. Outcomes are tuples of small integers so they can
 * be enumerated, laid out on a grid and tested by plain predicates.
 */

export type Outcome = readonly number[];

export const EXPERIMENT_IDS = [
  'moneda',
  'dado',
  'dos-monedas',
  'tres-monedas',
  'cuatro-monedas',
  'dos-dados',
  'cuatro-dados',
  'carta',
] as const;
export type ExperimentId = (typeof EXPERIMENT_IDS)[number];

export interface EventDefinition {
  id: string;
  /** Plain Spanish description, such as "la suma es 7". */
  label: string;
  test: (outcome: Outcome) => boolean;
}

export interface Experiment {
  id: ExperimentId;
  label: string;
  outcomes: Outcome[];
  /** Short text drawn inside the outcome cell. */
  format: (outcome: Outcome) => string;
  /** Grid position used to draw the sample space. */
  cell: (outcome: Outcome) => { row: number; col: number };
  rows: number;
  cols: number;
  rowLabels: string[];
  colLabels: string[];
  /** Caption of the grid axes, such as "primer dado" and "segundo dado". */
  rowTitle: string;
  colTitle: string;
  events: EventDefinition[];
}

const COIN = ['C', 'X'] as const;
const SUITS = ['corazones', 'diamantes', 'tréboles', 'espadas'] as const;
const SUIT_SHORT = ['Co', 'Di', 'Tr', 'Es'] as const;
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

/** Every tuple with `length` entries taken from 0..size-1, in lexicographic order. */
function tuples(size: number, length: number): number[][] {
  let result: number[][] = [[]];
  for (let position = 0; position < length; position += 1) {
    result = result.flatMap((prefix) =>
      Array.from({ length: size }, (_, value) => [...prefix, value]),
    );
  }
  return result;
}

const sum = (outcome: Outcome) => outcome.reduce((total, value) => total + value, 0);
const heads = (outcome: Outcome) => outcome.filter((value) => value === 0).length;
const coinText = (outcome: Outcome) => outcome.map((value) => COIN[value] ?? '?').join('');

/** Index of dice outcomes is face - 1; faces are stored as 1..6 directly. */
function diceOutcomes(count: number): number[][] {
  return tuples(6, count).map((tuple) => tuple.map((value) => value + 1));
}

function coinEvents(count: number): EventDefinition[] {
  const events: EventDefinition[] = [
    { id: 'primera-cara', label: 'la primera moneda cae cara', test: (o) => o[0] === 0 },
    { id: 'al-menos-una-cara', label: 'sale al menos una cara', test: (o) => heads(o) >= 1 },
    { id: 'ninguna-cara', label: 'no sale ninguna cara', test: (o) => heads(o) === 0 },
    {
      id: 'todas-iguales',
      label: 'todas las monedas coinciden',
      test: (o) => o.every((value) => value === o[0]),
    },
  ];
  if (count >= 2) {
    events.push(
      { id: 'segunda-cara', label: 'la segunda moneda cae cara', test: (o) => o[1] === 0 },
      {
        id: 'exactamente-una-cara',
        label: 'sale exactamente una cara',
        test: (o) => heads(o) === 1,
      },
      {
        id: 'exactamente-dos-caras',
        label: 'salen exactamente dos caras',
        test: (o) => heads(o) === 2,
      },
      {
        id: 'mas-caras',
        label: 'salen más caras que cruces',
        test: (o) => heads(o) > o.length - heads(o),
      },
      {
        id: 'cara-seguida',
        label: 'aparecen dos caras seguidas',
        test: (o) => o.some((value, index) => value === 0 && o[index + 1] === 0),
      },
    );
  }
  return events;
}

const DIE_EVENTS: EventDefinition[] = [
  { id: 'par', label: 'sale un número par', test: (o) => (o[0] ?? 0) % 2 === 0 },
  { id: 'impar', label: 'sale un número impar', test: (o) => (o[0] ?? 0) % 2 === 1 },
  { id: 'mayor-que-4', label: 'sale más de 4', test: (o) => (o[0] ?? 0) > 4 },
  { id: 'menor-que-3', label: 'sale menos de 3', test: (o) => (o[0] ?? 0) < 3 },
  { id: 'primo', label: 'sale un número primo', test: (o) => [2, 3, 5].includes(o[0] ?? 0) },
  { id: 'seis', label: 'sale 6', test: (o) => o[0] === 6 },
  { id: 'uno', label: 'sale 1', test: (o) => o[0] === 1 },
  { id: 'a-lo-mas-4', label: 'sale 4 o menos', test: (o) => (o[0] ?? 0) <= 4 },
];

const TWO_DICE_EVENTS: EventDefinition[] = [
  { id: 'suma-7', label: 'la suma es 7', test: (o) => sum(o) === 7 },
  { id: 'suma-8', label: 'la suma es 8', test: (o) => sum(o) === 8 },
  { id: 'suma-mayor-9', label: 'la suma es 10 o más', test: (o) => sum(o) >= 10 },
  { id: 'suma-menor-5', label: 'la suma es 4 o menos', test: (o) => sum(o) <= 4 },
  { id: 'suma-par', label: 'la suma es par', test: (o) => sum(o) % 2 === 0 },
  { id: 'suma-2', label: 'la suma es 2', test: (o) => sum(o) === 2 },
  { id: 'dobles', label: 'los dos dados coinciden', test: (o) => o[0] === o[1] },
  { id: 'al-menos-un-seis', label: 'sale al menos un 6', test: (o) => o.includes(6) },
  { id: 'ningun-seis', label: 'no sale ningún 6', test: (o) => !o.includes(6) },
  { id: 'primero-6', label: 'el primer dado es 6', test: (o) => o[0] === 6 },
  { id: 'primero-par', label: 'el primer dado es par', test: (o) => (o[0] ?? 0) % 2 === 0 },
  { id: 'segundo-par', label: 'el segundo dado es par', test: (o) => (o[1] ?? 0) % 2 === 0 },
  {
    id: 'primero-mayor',
    label: 'el primer dado supera al segundo',
    test: (o) => (o[0] ?? 0) > (o[1] ?? 0),
  },
  {
    id: 'diferencia-1',
    label: 'los dados difieren en 1',
    test: (o) => Math.abs((o[0] ?? 0) - (o[1] ?? 0)) === 1,
  },
  { id: 'maximo-4', label: 'el mayor de los dos es a lo más 4', test: (o) => Math.max(...o) <= 4 },
];

const FOUR_DICE_EVENTS: EventDefinition[] = [
  { id: 'al-menos-un-seis', label: 'sale al menos un 6', test: (o) => o.includes(6) },
  { id: 'ningun-seis', label: 'no sale ningún 6', test: (o) => !o.includes(6) },
  { id: 'suma-mayor-17', label: 'la suma es 18 o más', test: (o) => sum(o) >= 18 },
  {
    id: 'todos-distintos',
    label: 'los cuatro dados son distintos',
    test: (o) => new Set(o).size === o.length,
  },
  { id: 'suma-14', label: 'la suma es 14', test: (o) => sum(o) === 14 },
];

const rankOf = (o: Outcome) => (o[1] ?? 0) + 1;
const suitOf = (o: Outcome) => o[0] ?? 0;

const CARD_EVENTS: EventDefinition[] = [
  { id: 'corazon', label: 'la carta es de corazones', test: (o) => suitOf(o) === 0 },
  { id: 'roja', label: 'la carta es roja', test: (o) => suitOf(o) <= 1 },
  { id: 'negra', label: 'la carta es negra', test: (o) => suitOf(o) >= 2 },
  { id: 'as', label: 'la carta es un as', test: (o) => rankOf(o) === 1 },
  { id: 'rey', label: 'la carta es un rey', test: (o) => rankOf(o) === 13 },
  { id: 'figura', label: 'la carta es una figura (J, Q, K)', test: (o) => rankOf(o) >= 11 },
  {
    id: 'numero-par',
    label: 'la carta es un número par',
    test: (o) => rankOf(o) <= 10 && rankOf(o) % 2 === 0,
  },
  { id: 'trebol', label: 'la carta es de tréboles', test: (o) => suitOf(o) === 2 },
];

function coinExperiment(id: ExperimentId, count: number, label: string): Experiment {
  const rowCoins = Math.floor(count / 2);
  const colCoins = count - rowCoins;
  const outcomes = tuples(2, count);
  const index = (values: Outcome) => values.reduce((total, value) => total * 2 + value, 0);
  const labels = (length: number) => tuples(2, length).map(coinText);
  return {
    id,
    label,
    outcomes,
    format: coinText,
    cell: (o) => ({ row: index(o.slice(0, rowCoins)), col: index(o.slice(rowCoins)) }),
    rows: 2 ** rowCoins,
    cols: 2 ** colCoins,
    rowLabels: rowCoins === 0 ? [''] : labels(rowCoins),
    colLabels: labels(colCoins),
    rowTitle: rowCoins === 0 ? '' : rowCoins === 1 ? 'primera moneda' : 'primeras monedas',
    colTitle: rowCoins === 0 ? 'resultado' : 'resto de las monedas',
    events: coinEvents(count),
  };
}

const FACES = ['1', '2', '3', '4', '5', '6'];

function buildExperiment(id: ExperimentId): Experiment {
  switch (id) {
    case 'moneda':
      return coinExperiment(id, 1, 'Lanzar una moneda');
    case 'dos-monedas':
      return coinExperiment(id, 2, 'Lanzar dos monedas');
    case 'tres-monedas':
      return coinExperiment(id, 3, 'Lanzar tres monedas');
    case 'cuatro-monedas':
      return coinExperiment(id, 4, 'Lanzar cuatro monedas');
    case 'dado':
      return {
        id,
        label: 'Lanzar un dado',
        outcomes: diceOutcomes(1),
        format: (o) => String(o[0]),
        cell: (o) => ({ row: 0, col: (o[0] ?? 1) - 1 }),
        rows: 1,
        cols: 6,
        rowLabels: [''],
        colLabels: FACES,
        rowTitle: '',
        colTitle: 'cara del dado',
        events: DIE_EVENTS,
      };
    case 'dos-dados':
      return {
        id,
        label: 'Lanzar dos dados',
        outcomes: diceOutcomes(2),
        format: (o) => `${o[0]},${o[1]}`,
        cell: (o) => ({ row: (o[0] ?? 1) - 1, col: (o[1] ?? 1) - 1 }),
        rows: 6,
        cols: 6,
        rowLabels: FACES,
        colLabels: FACES,
        rowTitle: 'primer dado',
        colTitle: 'segundo dado',
        events: TWO_DICE_EVENTS,
      };
    case 'cuatro-dados':
      return {
        id,
        label: 'Lanzar cuatro dados',
        outcomes: diceOutcomes(4),
        format: (o) => o.join(''),
        cell: (o) => ({
          row: ((o[0] ?? 1) - 1) * 6 + (o[1] ?? 1) - 1,
          col: ((o[2] ?? 1) - 1) * 6 + (o[3] ?? 1) - 1,
        }),
        rows: 36,
        cols: 36,
        rowLabels: FACES.flatMap((a) => FACES.map((b) => `${a}${b}`)),
        colLabels: FACES.flatMap((a) => FACES.map((b) => `${a}${b}`)),
        rowTitle: 'dados 1 y 2',
        colTitle: 'dados 3 y 4',
        events: FOUR_DICE_EVENTS,
      };
    case 'carta':
      return {
        id,
        label: 'Sacar una carta de una baraja inglesa',
        outcomes: tuples(4, 1).flatMap((suit) => RANKS.map((_, rank) => [suit[0] ?? 0, rank])),
        format: (o) => RANKS[o[1] ?? 0] ?? '?',
        cell: (o) => ({ row: o[0] ?? 0, col: o[1] ?? 0 }),
        rows: 4,
        cols: 13,
        rowLabels: [...SUIT_SHORT],
        colLabels: [...RANKS],
        rowTitle: 'palo',
        colTitle: 'valor',
        events: CARD_EVENTS,
      };
  }
}

const cache = new Map<ExperimentId, Experiment>();

export function experiment(id: ExperimentId): Experiment {
  let found = cache.get(id);
  if (!found) {
    found = buildExperiment(id);
    cache.set(id, found);
  }
  return found;
}

export function findEvent(
  experimentId: ExperimentId,
  eventId: string,
): EventDefinition | undefined {
  return experiment(experimentId).events.find((event) => event.id === eventId);
}

/** Readable name of a card outcome, such as "as de corazones". */
export function cardName(outcome: Outcome): string {
  const names = ['as', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jota', 'reina', 'rey'];
  return `${names[outcome[1] ?? 0]} de ${SUITS[outcome[0] ?? 0]}`;
}

export const EVENT_OPERATIONS = [
  'A',
  'B',
  'union',
  'interseccion',
  'complemento',
  'diferencia',
  'diferencia-simetrica',
] as const;
export type EventOperation = (typeof EVENT_OPERATIONS)[number];

/** Membership test of the event built from A and B by the given operation. */
export function combineEvents(
  operation: EventOperation,
  a: (outcome: Outcome) => boolean,
  b: (outcome: Outcome) => boolean,
): (outcome: Outcome) => boolean {
  switch (operation) {
    case 'A':
      return a;
    case 'B':
      return b;
    case 'union':
      return (o) => a(o) || b(o);
    case 'interseccion':
      return (o) => a(o) && b(o);
    case 'complemento':
      return (o) => !a(o);
    case 'diferencia':
      return (o) => a(o) && !b(o);
    case 'diferencia-simetrica':
      return (o) => a(o) !== b(o);
  }
}

export const OPERATION_LATEX: Record<EventOperation, string> = {
  A: 'A',
  B: 'B',
  union: 'A \\cup B',
  interseccion: 'A \\cap B',
  complemento: 'A^{c}',
  diferencia: 'A \\setminus B',
  'diferencia-simetrica': 'A \\,\\triangle\\, B',
};

/**
 * Probability of an event under outcome weights; with no weights every
 * outcome is equally likely. Weights need not be normalized: they are
 * divided by their total so the result always satisfies the axioms.
 */
export function eventProbability(
  outcomes: readonly Outcome[],
  test: (outcome: Outcome) => boolean,
  weights?: readonly number[],
): number {
  if (!weights) return outcomes.filter(test).length / outcomes.length;
  const total = weights.reduce((acc, value) => acc + value, 0);
  if (total <= 0) return 0;
  return (
    outcomes.reduce((acc, outcome, index) => acc + (test(outcome) ? (weights[index] ?? 0) : 0), 0) /
    total
  );
}

/**
 * Normal approximation band for a relative frequency after `trials` trials
 * when the true probability is `p`: p plus or minus z standard errors.
 */
export function frequencyBand(p: number, trials: number, z = 1.96): { low: number; high: number } {
  if (trials <= 0) return { low: 0, high: 1 };
  const margin = z * Math.sqrt((p * (1 - p)) / trials);
  return { low: Math.max(0, p - margin), high: Math.min(1, p + margin) };
}
