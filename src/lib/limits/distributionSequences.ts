import { binomial, gamma, poisson, studentT } from '../distributions/index.ts';
import { standardNormalCdf } from '../distributions/special.ts';

/**
 * Sequences of distribution functions F_n with a limit F, used to show
 * convergence in distribution: F_n(x) must approach F(x) at every point
 * where F is continuous.
 */
export const DISTRIBUTION_SEQUENCE_IDS = [
  'maximo-uniformes',
  'binomial-poisson',
  't-normal',
  'media-exponencial',
  'uniforme-discreta',
  'punto-1-n',
] as const;
export type DistributionSequenceId = (typeof DISTRIBUTION_SEQUENCE_IDS)[number];

export interface DistributionSequence {
  label: string;
  /** Law of X_n in LaTeX. */
  latex: string;
  /** Law of the limit X in LaTeX. */
  limitLatex: string;
  cdf: (n: number, x: number) => number;
  limitCdf: (x: number) => number;
  domain: [number, number];
  /** Smallest n for which the sequence is defined. */
  minN: number;
  /** Points where the limit F jumps; convergence is not required there. */
  jumps: readonly number[];
  /** Whether F_n has jumps, so it is drawn as a step function. */
  discrete: boolean;
}

const POISSON_RATE = 3;

export const DISTRIBUTION_SEQUENCES: Record<DistributionSequenceId, DistributionSequence> = {
  'maximo-uniformes': {
    label: 'Brecha del máximo: n(1 - máx Uᵢ)',
    latex: 'X_n = n\\,(1 - \\max_{i \\le n} U_i),\\quad U_i \\sim U(0, 1)',
    limitLatex: 'X \\sim \\operatorname{Exp}(1)',
    cdf: (n, x) => (x <= 0 ? 0 : x >= n ? 1 : 1 - (1 - x / n) ** n),
    limitCdf: (x) => (x <= 0 ? 0 : 1 - Math.exp(-x)),
    domain: [-0.5, 5],
    minN: 1,
    jumps: [],
    discrete: false,
  },
  'binomial-poisson': {
    label: 'Binomial con p = 3/n hacia Poisson(3)',
    latex: `X_n \\sim \\operatorname{Bin}(n,\\ ${POISSON_RATE}/n)`,
    limitLatex: `X \\sim \\operatorname{Poisson}(${POISSON_RATE})`,
    cdf: (n, x) => (x < 0 ? 0 : binomial(n, POISSON_RATE / n).cdf(Math.floor(x))),
    limitCdf: (x) => (x < 0 ? 0 : poisson(POISSON_RATE).cdf(Math.floor(x))),
    domain: [-0.5, 10.5],
    minN: POISSON_RATE,
    jumps: Array.from({ length: 11 }, (_, k) => k),
    discrete: true,
  },
  't-normal': {
    label: 't de Student con n grados de libertad hacia la normal',
    latex: 'X_n \\sim t_n',
    limitLatex: 'X \\sim \\mathcal{N}(0, 1)',
    cdf: (n, x) => studentT(n).cdf(x),
    limitCdf: standardNormalCdf,
    domain: [-4, 4],
    minN: 1,
    jumps: [],
    discrete: false,
  },
  'media-exponencial': {
    label: 'Media estandarizada de n exponenciales',
    latex: 'X_n = \\sqrt{n}\\,(\\bar{E}_n - 1),\\quad E_i \\sim \\operatorname{Exp}(1)',
    limitLatex: 'X \\sim \\mathcal{N}(0, 1)',
    // The sum of n Exp(1) variables is Gamma(n, 1).
    cdf: (n, x) => gamma(n, 1).cdf(n + x * Math.sqrt(n)),
    limitCdf: standardNormalCdf,
    domain: [-4, 4],
    minN: 1,
    jumps: [],
    discrete: false,
  },
  'uniforme-discreta': {
    label: 'Uniforme en {1/n, 2/n, ..., 1} hacia U(0, 1)',
    latex: 'X_n \\sim U\\{\\tfrac{1}{n}, \\tfrac{2}{n}, \\dots, 1\\}',
    limitLatex: 'X \\sim U(0, 1)',
    cdf: (n, x) => (x < 0 ? 0 : x >= 1 ? 1 : Math.floor(n * x + 1e-9) / n),
    limitCdf: (x) => Math.min(1, Math.max(0, x)),
    domain: [-0.2, 1.2],
    minN: 1,
    jumps: [],
    discrete: true,
  },
  'punto-1-n': {
    label: 'Constante 1/n hacia la constante 0',
    latex: 'X_n = \\tfrac{1}{n}\\ \\text{con probabilidad 1}',
    limitLatex: 'X = 0',
    cdf: (n, x) => (x >= 1 / n ? 1 : 0),
    limitCdf: (x) => (x >= 0 ? 1 : 0),
    domain: [-0.5, 1.2],
    minN: 1,
    jumps: [0],
    discrete: true,
  },
};

/**
 * Largest |F_n(x) - F(x)| over a grid of the plotting window, skipping grid
 * points within `gap` of a jump of F, where convergence is not required.
 */
export function maxCdfDistance(
  sequence: DistributionSequence,
  n: number,
  points = 800,
  gap = 1e-6,
): { distance: number; at: number } {
  const [lo, hi] = sequence.domain;
  let distance = 0;
  let at = lo;
  for (let i = 0; i <= points; i += 1) {
    const x = lo + ((hi - lo) * i) / points;
    if (sequence.jumps.some((jump) => Math.abs(x - jump) < gap)) continue;
    const d = Math.abs(sequence.cdf(n, x) - sequence.limitCdf(x));
    if (d > distance) {
      distance = d;
      at = x;
    }
  }
  return { distance, at };
}
