export const RELATION_RULES = [
  'congruencia',
  'misma-paridad',
  'menor-o-igual',
  'menor',
  'divide',
  'cercania',
] as const;

export type RelationRule = (typeof RELATION_RULES)[number];

export const RULES: Record<
  RelationRule,
  {
    label: (k: number) => string;
    latex: (k: number) => string;
    test: (a: number, b: number, k: number) => boolean;
  }
> = {
  congruencia: {
    label: (k) => `a y b dejan el mismo residuo al dividir entre ${k}`,
    latex: (k) => `a \\equiv b \\pmod{${k}}`,
    test: (a, b, k) => (a - b) % k === 0,
  },
  'misma-paridad': {
    label: () => 'a y b tienen la misma paridad',
    latex: () => 'a + b \\text{ es par}',
    test: (a, b) => (a + b) % 2 === 0,
  },
  'menor-o-igual': {
    label: () => 'a es menor o igual que b',
    latex: () => 'a \\le b',
    test: (a, b) => a <= b,
  },
  menor: { label: () => 'a es menor que b', latex: () => 'a < b', test: (a, b) => a < b },
  divide: { label: () => 'a divide a b', latex: () => 'a \\mid b', test: (a, b) => b % a === 0 },
  cercania: {
    label: (k) => `a y b están a distancia de a lo más ${k}`,
    latex: (k) => `|a - b| \\le ${k}`,
    test: (a, b, k) => Math.abs(a - b) <= k,
  },
};
