export const PREDICATE_IDS = [
  'par',
  'impar',
  'primo',
  'cuadrado',
  'menor-que',
  'divisible-entre-3',
  'positivo',
] as const;

export type PredicateId = (typeof PREDICATE_IDS)[number];

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false;
  return true;
}

export const PREDICATES: Record<
  PredicateId,
  {
    label: (k: number) => string;
    latex: (k: number) => string;
    test: (x: number, k: number) => boolean;
  }
> = {
  par: { label: () => 'x es par', latex: () => 'x \\text{ es par}', test: (x) => x % 2 === 0 },
  impar: {
    label: () => 'x es impar',
    latex: () => 'x \\text{ es impar}',
    test: (x) => Math.abs(x % 2) === 1,
  },
  primo: { label: () => 'x es primo', latex: () => 'x \\text{ es primo}', test: (x) => isPrime(x) },
  cuadrado: {
    label: () => 'x es un cuadrado perfecto',
    latex: () => 'x \\text{ es un cuadrado perfecto}',
    test: (x) => x >= 0 && Number.isInteger(Math.sqrt(x)),
  },
  'menor-que': { label: (k) => `x < ${k}`, latex: (k) => `x < ${k}`, test: (x, k) => x < k },
  'divisible-entre-3': {
    label: () => 'x es múltiplo de 3',
    latex: () => '3 \\mid x',
    test: (x) => x % 3 === 0,
  },
  positivo: { label: () => 'x > 0', latex: () => 'x > 0', test: (x) => x > 0 },
};
