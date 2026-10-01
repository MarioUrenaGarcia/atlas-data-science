import { logChoose, standardNormalCdf } from '../distributions/special.ts';
import type { Random } from '../random/index.ts';

/**
 * Sequences of random variables X_n with a limit X, used to compare the
 * modes of convergence. Each simulation returns the deviations X_n - X of a
 * single realization, so every sequence is drawn around zero.
 */
export const SEQUENCE_IDS = [
  'media-moneda',
  'ruido-decreciente',
  'maquina-de-escribir',
  'picos-independientes',
  'picos-cuadrado',
  'pico-creciente',
  'signo-alternante',
] as const;
export type SequenceId = (typeof SEQUENCE_IDS)[number];

export interface ConvergenceFlags {
  casiSegura: boolean;
  probabilidad: boolean;
  mediaCuadratica: boolean;
  distribucion: boolean;
}

export interface RandomSequence {
  label: string;
  /** Definition of X_n in LaTeX. */
  latex: string;
  /** The limit X in LaTeX. */
  limitLatex: string;
  /** Deviations X_n - X for n = 1..length; index i holds n = i + 1. */
  simulate: (random: Random, length: number) => Float64Array;
  /** Exact P(|X_n - X| > eps), when it has a closed form. */
  outside?: (n: number, eps: number) => number;
  /** P(sup_{m >= n} |X_m - X| > eps), the quantity that decides almost sure convergence. */
  tailSup?: (n: number, eps: number) => number;
  /** E[(X_n - X)^2]. */
  meanSquare?: (n: number) => number;
  converges: ConvergenceFlags;
}

/**
 * Block k of the typewriter sequence sweeps the unit interval with k pieces
 * of length 1/k. Returns the block and the position j in 0..k-1 of index n.
 */
export function typewriterIndex(n: number): { block: number; position: number } {
  let block = Math.floor((Math.sqrt(8 * n + 1) - 1) / 2);
  while ((block * (block + 1)) / 2 < n) block += 1;
  while (block > 1 && ((block - 1) * block) / 2 >= n) block -= 1;
  return { block, position: n - ((block - 1) * block) / 2 - 1 };
}

/** P(|K/n - 1/2| > eps) for K ~ Bin(n, 1/2), summed exactly in log space. */
export function coinMeanOutside(n: number, eps: number): number {
  let total = 0;
  for (let k = 0; k <= n; k += 1) {
    if (Math.abs(k / n - 0.5) > eps + 1e-12) total += Math.exp(logChoose(n, k) - n * Math.LN2);
  }
  return Math.min(1, total);
}

const normalTail = (z: number) => 2 * (1 - standardNormalCdf(z));

export const SEQUENCES: Record<SequenceId, RandomSequence> = {
  'media-moneda': {
    label: 'Proporción de caras en n volados',
    latex:
      'X_n = \\bar{X}_n = \\frac{1}{n}\\sum_{i=1}^n B_i,\\quad B_i \\sim \\operatorname{Bernoulli}(1/2)',
    limitLatex: 'X = \\tfrac{1}{2}',
    simulate: (random, length) => {
      const values = new Float64Array(length);
      let heads = 0;
      for (let i = 0; i < length; i += 1) {
        if (random.bernoulli(0.5)) heads += 1;
        values[i] = heads / (i + 1) - 0.5;
      }
      return values;
    },
    outside: coinMeanOutside,
    meanSquare: (n) => 1 / (4 * n),
    converges: { casiSegura: true, probabilidad: true, mediaCuadratica: true, distribucion: true },
  },
  'ruido-decreciente': {
    label: 'Medición con ruido que se reduce: X + Z/√n',
    latex:
      'X_n = X + \\frac{Z_n}{\\sqrt{n}},\\quad Z_n \\sim \\mathcal{N}(0, 1)\\ \\text{independientes}',
    limitLatex: 'X',
    simulate: (random, length) => {
      const values = new Float64Array(length);
      for (let i = 0; i < length; i += 1) values[i] = random.normal() / Math.sqrt(i + 1);
      return values;
    },
    outside: (n, eps) => normalTail(eps * Math.sqrt(n)),
    meanSquare: (n) => 1 / n,
    converges: { casiSegura: true, probabilidad: true, mediaCuadratica: true, distribucion: true },
  },
  'maquina-de-escribir': {
    label: 'Máquina de escribir: indicadoras que barren [0, 1]',
    latex:
      'X_n = \\mathbf{1}\\{U \\in [\\tfrac{j}{k}, \\tfrac{j+1}{k})\\},\\quad n = \\tfrac{k(k-1)}{2} + j + 1',
    limitLatex: 'X = 0',
    simulate: (random, length) => {
      const u = random.uniform();
      const values = new Float64Array(length);
      for (let i = 0; i < length; i += 1) {
        const { block, position } = typewriterIndex(i + 1);
        values[i] = u >= position / block && u < (position + 1) / block ? 1 : 0;
      }
      return values;
    },
    outside: (n, eps) => (eps < 1 ? 1 / typewriterIndex(n).block : 0),
    tailSup: (_n, eps) => (eps < 1 ? 1 : 0),
    meanSquare: (n) => 1 / typewriterIndex(n).block,
    converges: { casiSegura: false, probabilidad: true, mediaCuadratica: true, distribucion: true },
  },
  'picos-independientes': {
    label: 'Picos independientes con probabilidad 1/n',
    latex: 'X_n \\sim \\operatorname{Bernoulli}(1/n)\\ \\text{independientes}',
    limitLatex: 'X = 0',
    simulate: (random, length) => {
      const values = new Float64Array(length);
      for (let i = 0; i < length; i += 1) values[i] = random.bernoulli(1 / (i + 1)) ? 1 : 0;
      return values;
    },
    outside: (n, eps) => (eps < 1 ? 1 / n : 0),
    tailSup: (_n, eps) => (eps < 1 ? 1 : 0),
    meanSquare: (n) => 1 / n,
    converges: { casiSegura: false, probabilidad: true, mediaCuadratica: true, distribucion: true },
  },
  'picos-cuadrado': {
    label: 'Picos independientes con probabilidad 1/n²',
    latex: 'X_n \\sim \\operatorname{Bernoulli}(1/n^2)\\ \\text{independientes}',
    limitLatex: 'X = 0',
    simulate: (random, length) => {
      const values = new Float64Array(length);
      for (let i = 0; i < length; i += 1) values[i] = random.bernoulli(1 / (i + 1) ** 2) ? 1 : 0;
      return values;
    },
    outside: (n, eps) => (eps < 1 ? 1 / (n * n) : 0),
    // prod_{m >= n} (1 - 1/m^2) telescopes to (n - 1)/n for n >= 2.
    tailSup: (n, eps) => (eps < 1 ? (n <= 1 ? 1 : 1 / n) : 0),
    meanSquare: (n) => 1 / (n * n),
    converges: { casiSegura: true, probabilidad: true, mediaCuadratica: true, distribucion: true },
  },
  'pico-creciente': {
    label: 'Pico que crece: n · 1{U < 1/n}',
    latex: 'X_n = n\\,\\mathbf{1}\\{U < 1/n\\},\\quad U \\sim U(0, 1)',
    limitLatex: 'X = 0',
    simulate: (random, length) => {
      const u = random.uniform();
      const values = new Float64Array(length);
      for (let i = 0; i < length; i += 1) values[i] = u < 1 / (i + 1) ? i + 1 : 0;
      return values;
    },
    outside: (n, eps) => (eps < n ? 1 / n : 0),
    tailSup: (n) => 1 / n,
    meanSquare: (n) => n,
    converges: { casiSegura: true, probabilidad: true, mediaCuadratica: false, distribucion: true },
  },
  'signo-alternante': {
    label: 'Signo alternante: (-1)ⁿ Z',
    latex: 'X_n = (-1)^n Z,\\quad Z \\sim \\mathcal{N}(0, 1)',
    limitLatex: 'X = Z',
    simulate: (random, length) => {
      const z = random.normal();
      const values = new Float64Array(length);
      for (let i = 0; i < length; i += 1) values[i] = (i + 1) % 2 === 1 ? -2 * z : 0;
      return values;
    },
    outside: (n, eps) => (n % 2 === 1 ? normalTail(eps / 2) : 0),
    tailSup: (_n, eps) => normalTail(eps / 2),
    meanSquare: (n) => (n % 2 === 1 ? 4 : 0),
    converges: {
      casiSegura: false,
      probabilidad: false,
      mediaCuadratica: false,
      distribucion: true,
    },
  },
};
