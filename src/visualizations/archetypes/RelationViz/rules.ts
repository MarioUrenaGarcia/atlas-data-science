export const RELATION_RULES = [
  'congruencia',
  'misma-paridad',
  'menor-o-igual',
  'menor',
  'divide',
  'cercania',
  'misma-hora',
  'menos-de-40-minutos',
  'subconjunto',
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
  'misma-hora': {
    label: () => 'a y b ocurren dentro de la misma hora del reloj',
    latex: () => '\\lfloor a / 60 \\rfloor = \\lfloor b / 60 \\rfloor',
    test: (a, b) => Math.floor(a / 60) === Math.floor(b / 60),
  },
  'menos-de-40-minutos': {
    label: () => 'a y b difieren en menos de 40 minutos',
    latex: () => '|a - b| < 40',
    test: (a, b) => Math.abs(a - b) < 40,
  },
  subconjunto: {
    // Element e stands for the subset whose bits are those of e - 1, so 1 is the empty set.
    label: () => 'el subconjunto a está contenido en el subconjunto b',
    latex: () => 'a \\subseteq b',
    test: (a, b) => ((a - 1) & ~(b - 1)) === 0,
  },
};
