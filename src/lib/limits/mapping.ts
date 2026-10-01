import { logChoose, standardNormalCdf } from '../distributions/special.ts';

/**
 * Continuous mapping theorem: if X_n converges in distribution to X and g is
 * continuous at every point where X puts mass, then g(X_n) converges in
 * distribution to g(X). Here X_n is a standardized binomial, whose exact law
 * is available for every n, and X is the standard normal.
 */
export const MAP_IDS = [
  'cuadrado',
  'valor-absoluto',
  'exponencial',
  'signo',
  'indicadora-en-cero',
] as const;
export type MapId = (typeof MAP_IDS)[number];

export interface Atom {
  x: number;
  p: number;
}

export interface ContinuousMap {
  label: string;
  /** g(x) in LaTeX with the argument written as #. */
  latex: string;
  g: (x: number) => number;
  /** Law of g(Z) for Z ~ N(0, 1): a density, or atoms when it is discrete. */
  limit: { density: (y: number) => number } | { atoms: Atom[] };
  /** P(g(Z) <= y). */
  limitCdf: (y: number) => number;
  limitLatex: string;
  /** Plotting window for g(X_n). */
  domain: [number, number];
  /** Whether g is continuous everywhere. */
  continuous: boolean;
  /** When the sequence used is the constant 1/n instead of the standardized binomial. */
  constantSequence?: boolean;
}

const phi = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

export const MAPS: Record<MapId, ContinuousMap> = {
  cuadrado: {
    label: 'Cuadrado: g(x) = x²',
    latex: '#^2',
    g: (x) => x * x,
    limit: { density: (y) => (y > 0 ? Math.exp(-y / 2) / Math.sqrt(2 * Math.PI * y) : 0) },
    limitCdf: (y) => (y > 0 ? 2 * standardNormalCdf(Math.sqrt(y)) - 1 : 0),
    limitLatex: 'Z^2 \\sim \\chi^2_1',
    domain: [0, 6],
    continuous: true,
  },
  'valor-absoluto': {
    label: 'Valor absoluto: g(x) = |x|',
    latex: '|#|',
    g: Math.abs,
    limit: { density: (y) => (y >= 0 ? 2 * phi(y) : 0) },
    limitCdf: (y) => (y > 0 ? 2 * standardNormalCdf(y) - 1 : 0),
    limitLatex: '|Z| \\sim \\text{seminormal}',
    domain: [0, 3.5],
    continuous: true,
  },
  exponencial: {
    label: 'Exponencial: g(x) = eˣ',
    latex: 'e^{#}',
    g: Math.exp,
    limit: { density: (y) => (y > 0 ? phi(Math.log(y)) / y : 0) },
    limitCdf: (y) => (y > 0 ? standardNormalCdf(Math.log(y)) : 0),
    limitLatex: 'e^{Z} \\sim \\operatorname{LogN}(0, 1)',
    domain: [0, 6],
    continuous: true,
  },
  signo: {
    label: 'Indicadora de positivo: g(x) = 1{x > 0}',
    latex: '\\mathbf{1}\\{# > 0\\}',
    g: (x) => (x > 0 ? 1 : 0),
    limit: {
      atoms: [
        { x: 0, p: 0.5 },
        { x: 1, p: 0.5 },
      ],
    },
    limitCdf: (y) => (y < 0 ? 0 : y < 1 ? 0.5 : 1),
    limitLatex: '\\mathbf{1}\\{Z > 0\\} \\sim \\operatorname{Bernoulli}(1/2)',
    domain: [-0.5, 1.5],
    continuous: false,
  },
  'indicadora-en-cero': {
    label: 'Indicadora de positivo aplicada a Xₙ = 1/n',
    latex: '\\mathbf{1}\\{# > 0\\}',
    g: (x) => (x > 0 ? 1 : 0),
    limit: { atoms: [{ x: 0, p: 1 }] },
    limitCdf: (y) => (y < 0 ? 0 : 1),
    limitLatex: 'g(0) = 0',
    domain: [-0.5, 1.5],
    continuous: false,
    constantSequence: true,
  },
};

/** Exact law of X_n = (B - n/2) / sqrt(n/4) with B ~ Bin(n, 1/2). */
export function standardizedBinomialAtoms(n: number): Atom[] {
  const scale = Math.sqrt(n / 4);
  return Array.from({ length: n + 1 }, (_, k) => ({
    x: (k - n / 2) / scale,
    p: Math.exp(logChoose(n, k) - n * Math.LN2),
  }));
}

/** Law of X_n for a map: the standardized binomial, or the constant 1/n. */
export function sequenceAtoms(map: ContinuousMap, n: number): Atom[] {
  return map.constantSequence ? [{ x: 1 / n, p: 1 }] : standardizedBinomialAtoms(n);
}

/** Pushes atoms through g, merging values that coincide. */
export function mapAtoms(atoms: readonly Atom[], g: (x: number) => number): Atom[] {
  const merged = new Map<number, number>();
  for (const { x, p } of atoms) {
    const y = Number(g(x).toPrecision(12));
    merged.set(y, (merged.get(y) ?? 0) + p);
  }
  return [...merged.entries()].map(([x, p]) => ({ x, p })).sort((a, b) => a.x - b.x);
}

/** P(Y <= y) for a discrete law given by atoms. */
export function atomsCdf(atoms: readonly Atom[], y: number): number {
  return atoms.reduce((total, atom) => (atom.x <= y ? total + atom.p : total), 0);
}
