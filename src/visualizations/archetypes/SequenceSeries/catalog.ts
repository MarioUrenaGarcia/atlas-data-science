export interface SequenceDefinition {
  label: string;
  latex: string;
  term: (n: number) => number;
  /** Limit when the sequence converges, null otherwise. */
  limit: number | null;
}

export const SEQUENCE_IDS = [
  'inverso',
  'alternante-decreciente',
  'euler',
  'cociente',
  'seno-entre-n',
  'oscilante',
  'raiz-enesima',
  'lineal',
] as const;
export type SequenceId = (typeof SEQUENCE_IDS)[number];

export const SEQUENCES: Record<SequenceId, SequenceDefinition> = {
  inverso: { label: 'a_n = 1/n', latex: 'a_n = \\frac{1}{n}', term: (n) => 1 / n, limit: 0 },
  'alternante-decreciente': {
    label: 'a_n = (-1)^n / n',
    latex: 'a_n = \\frac{(-1)^n}{n}',
    term: (n) => (-1) ** n / n,
    limit: 0,
  },
  euler: {
    label: 'a_n = (1 + 1/n)^n',
    latex: 'a_n = \\left(1 + \\frac{1}{n}\\right)^n',
    term: (n) => (1 + 1 / n) ** n,
    limit: Math.E,
  },
  cociente: {
    label: 'a_n = n / (n + 1)',
    latex: 'a_n = \\frac{n}{n+1}',
    term: (n) => n / (n + 1),
    limit: 1,
  },
  'seno-entre-n': {
    label: 'a_n = sen(n) / n',
    latex: 'a_n = \\frac{\\operatorname{sen} n}{n}',
    term: (n) => Math.sin(n) / n,
    limit: 0,
  },
  oscilante: { label: 'a_n = (-1)^n', latex: 'a_n = (-1)^n', term: (n) => (-1) ** n, limit: null },
  'raiz-enesima': {
    label: 'a_n = n^(1/n)',
    latex: 'a_n = n^{1/n}',
    term: (n) => n ** (1 / n),
    limit: 1,
  },
  lineal: { label: 'a_n = n / 10', latex: 'a_n = \\frac{n}{10}', term: (n) => n / 10, limit: null },
};

export interface SeriesDefinition {
  label: string;
  latex: string;
  term: (n: number) => number;
  /** Sum when the series converges, null when it diverges. */
  sum: number | null;
}

export const SERIES_IDS = [
  'armonica',
  'basilea',
  'armonica-alternada',
  'geometrica-mitad',
  'factorial',
  'grandi',
  'telescopica',
] as const;
export type SeriesId = (typeof SERIES_IDS)[number];

export const SERIES: Record<SeriesId, SeriesDefinition> = {
  armonica: {
    label: 'Armónica: suma de 1/n',
    latex: '\\sum_{n=1}^{\\infty} \\frac{1}{n}',
    term: (n) => 1 / n,
    sum: null,
  },
  basilea: {
    label: 'Suma de 1/n²',
    latex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2}',
    term: (n) => 1 / (n * n),
    sum: (Math.PI * Math.PI) / 6,
  },
  'armonica-alternada': {
    label: 'Armónica alternada',
    latex: '\\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n}',
    term: (n) => (-1) ** (n + 1) / n,
    sum: Math.LN2,
  },
  'geometrica-mitad': {
    label: 'Geométrica de razón 1/2',
    latex: '\\sum_{n=1}^{\\infty} \\frac{1}{2^n}',
    term: (n) => 0.5 ** n,
    sum: 1,
  },
  factorial: {
    label: 'Suma de 1/n!',
    latex: '\\sum_{n=1}^{\\infty} \\frac{1}{n!}',
    term: (n) => {
      let product = 1;
      for (let i = 2; i <= n; i += 1) product *= i;
      return 1 / product;
    },
    sum: Math.E - 1,
  },
  grandi: {
    label: 'Serie de Grandi: 1 - 1 + 1 - ...',
    latex: '\\sum_{n=1}^{\\infty} (-1)^{n+1}',
    term: (n) => (-1) ** (n + 1),
    sum: null,
  },
  telescopica: {
    label: 'Telescópica: suma de 1/(n(n + 1))',
    latex: '\\sum_{n=1}^{\\infty} \\frac{1}{n(n+1)}',
    term: (n) => 1 / (n * (n + 1)),
    sum: 1,
  },
};

export interface SetDefinition {
  label: string;
  latex: string;
  element: (n: number) => number;
  supremum: number;
  infimum: number;
  hasMaximum: boolean;
  hasMinimum: boolean;
}

export const SUP_SET_IDS = [
  'uno-menos-inverso',
  'alternante',
  'cociente',
  'raices-de-dos',
] as const;
export type SupSetId = (typeof SUP_SET_IDS)[number];

/** Decimal truncations of the square root of two: rationals whose supremum is irrational. */
function truncatedRoot(n: number): number {
  const scale = 10 ** Math.min(n, 12);
  return Math.floor(Math.SQRT2 * scale) / scale;
}

export const SUP_SETS: Record<SupSetId, SetDefinition> = {
  'uno-menos-inverso': {
    label: 'S = {1 - 1/n}',
    latex: 'S = \\{1 - \\tfrac{1}{n} : n \\in \\mathbb{N}\\}',
    element: (n) => 1 - 1 / n,
    supremum: 1,
    infimum: 0,
    hasMaximum: false,
    hasMinimum: true,
  },
  alternante: {
    label: 'S = {(-1)^n / n}',
    latex: 'S = \\{\\tfrac{(-1)^n}{n} : n \\in \\mathbb{N}\\}',
    element: (n) => (-1) ** n / n,
    supremum: 0.5,
    infimum: -1,
    hasMaximum: true,
    hasMinimum: true,
  },
  cociente: {
    label: 'S = {n / (n + 1)}',
    latex: 'S = \\{\\tfrac{n}{n+1} : n \\in \\mathbb{N}\\}',
    element: (n) => n / (n + 1),
    supremum: 1,
    infimum: 0.5,
    hasMaximum: false,
    hasMinimum: true,
  },
  'raices-de-dos': {
    label: 'Truncamientos decimales de la raíz de 2',
    latex: 'S = \\{1.4,\\ 1.41,\\ 1.414,\\ \\dots\\}',
    element: truncatedRoot,
    supremum: Math.SQRT2,
    infimum: 1.4,
    hasMaximum: false,
    hasMinimum: true,
  },
};

export interface NotationDefinition {
  label: string;
  kind: 'suma' | 'producto';
  /** LaTeX of the general term in i. */
  termLatex: string;
  term: (i: number) => number;
  closedForm: ((n: number) => number) | null;
  closedLatex: string | null;
}

export const NOTATION_IDS = [
  'naturales',
  'cuadrados',
  'impares',
  'factorial',
  'telescopico',
] as const;
export type NotationId = (typeof NOTATION_IDS)[number];

export const NOTATIONS: Record<NotationId, NotationDefinition> = {
  naturales: {
    label: 'Suma de los primeros naturales',
    kind: 'suma',
    termLatex: 'i',
    term: (i) => i,
    closedForm: (n) => (n * (n + 1)) / 2,
    closedLatex: '\\frac{n(n+1)}{2}',
  },
  cuadrados: {
    label: 'Suma de cuadrados',
    kind: 'suma',
    termLatex: 'i^2',
    term: (i) => i * i,
    closedForm: (n) => (n * (n + 1) * (2 * n + 1)) / 6,
    closedLatex: '\\frac{n(n+1)(2n+1)}{6}',
  },
  impares: {
    label: 'Suma de impares',
    kind: 'suma',
    termLatex: '(2i - 1)',
    term: (i) => 2 * i - 1,
    closedForm: (n) => n * n,
    closedLatex: 'n^2',
  },
  factorial: {
    label: 'Producto de los primeros naturales',
    kind: 'producto',
    termLatex: 'i',
    term: (i) => i,
    closedForm: null,
    closedLatex: 'n!',
  },
  telescopico: {
    label: 'Producto telescópico',
    kind: 'producto',
    termLatex: '\\left(1 + \\frac{1}{i}\\right)',
    term: (i) => 1 + 1 / i,
    closedForm: (n) => n + 1,
    closedLatex: 'n + 1',
  },
};
