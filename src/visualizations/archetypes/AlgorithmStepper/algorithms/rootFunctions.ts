export interface RootFunction {
  id: string;
  label: string;
  f: (x: number) => number;
  derivative: (x: number) => number;
  window: [number, number];
}

/** Test functions for root-finding algorithms, each with a known derivative. */
export const ROOT_FUNCTIONS: Record<string, RootFunction> = {
  cubica: {
    id: 'cubica',
    label: 'f(x) = x³ - x - 2',
    f: (x) => x ** 3 - x - 2,
    derivative: (x) => 3 * x * x - 1,
    window: [-1, 3],
  },
  coseno: {
    id: 'coseno',
    label: 'f(x) = cos x - x',
    f: (x) => Math.cos(x) - x,
    derivative: (x) => -Math.sin(x) - 1,
    window: [-1, 2],
  },
  exponencial: {
    id: 'exponencial',
    label: 'f(x) = eˣ - 3',
    f: (x) => Math.exp(x) - 3,
    derivative: (x) => Math.exp(x),
    window: [-1, 2.5],
  },
  arcotangente: {
    id: 'arcotangente',
    label: 'f(x) = arctan x',
    f: (x) => Math.atan(x),
    derivative: (x) => 1 / (1 + x * x),
    window: [-4, 4],
  },
};

export const ROOT_FUNCTION_OPTIONS = Object.values(ROOT_FUNCTIONS).map((fn) => ({
  value: fn.id,
  label: fn.label,
}));
