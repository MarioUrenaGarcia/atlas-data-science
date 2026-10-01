import type { Random } from '../random/index.ts';

/**
 * Two dimensional populations for the multivariate central limit theorem.
 * Each has exact mean vector and covariance matrix, so the limiting normal
 * can be drawn without estimating anything.
 */
export const VECTOR_POPULATION_IDS = ['parabola', 'dado-par', 'exponenciales-acumuladas'] as const;
export type VectorPopulationId = (typeof VECTOR_POPULATION_IDS)[number];

export type Covariance = readonly [readonly [number, number], readonly [number, number]];

export interface VectorPopulation {
  label: string;
  latex: string;
  mean: readonly [number, number];
  covariance: Covariance;
  sample: (random: Random) => [number, number];
}

export const VECTOR_POPULATIONS: Record<VectorPopulationId, VectorPopulation> = {
  parabola: {
    label: 'Puntos sobre una parábola: (U, U²)',
    latex: '\\mathbf{X} = (U,\\ U^2),\\quad U \\sim U(-1, 1)',
    // Var U = 1/3, Cov(U, U^2) = E[U^3] = 0, Var U^2 = 1/5 - 1/9 = 4/45.
    mean: [0, 1 / 3],
    covariance: [
      [1 / 3, 0],
      [0, 4 / 45],
    ],
    sample: (random) => {
      const u = random.uniform(-1, 1);
      return [u, u * u];
    },
  },
  'dado-par': {
    label: 'Dado y su paridad: (D, 1{D par})',
    latex: '\\mathbf{X} = (D,\\ \\mathbf{1}\\{D \\text{ par}\\})',
    // Cov(D, 1{D even}) = E[D 1{D even}] - 3.5 * 0.5 = 2 - 1.75.
    mean: [3.5, 0.5],
    covariance: [
      [35 / 12, 0.25],
      [0.25, 0.25],
    ],
    sample: (random) => {
      const d = random.int(1, 6);
      return [d, d % 2 === 0 ? 1 : 0];
    },
  },
  'exponenciales-acumuladas': {
    label: 'Tiempos acumulados: (E₁, E₁ + E₂)',
    latex: '\\mathbf{X} = (E_1,\\ E_1 + E_2),\\quad E_j \\sim \\operatorname{Exp}(1)',
    mean: [1, 2],
    covariance: [
      [1, 1],
      [1, 2],
    ],
    sample: (random) => {
      const e1 = random.exponential(1);
      return [e1, e1 + random.exponential(1)];
    },
  },
};

/**
 * Semi-axes and angle of the ellipse {x : x^T S^-1 x = r^2} for a 2 x 2
 * covariance S, from its eigen decomposition.
 */
export function covarianceEllipse(
  covariance: Covariance,
  radius: number,
): { rx: number; ry: number; angle: number } {
  const [[a, b], [, d]] = covariance;
  const trace = a + d;
  const det = a * d - b * b;
  const disc = Math.sqrt(Math.max(0, (trace * trace) / 4 - det));
  const l1 = trace / 2 + disc;
  const l2 = trace / 2 - disc;
  const angle = Math.abs(b) < 1e-12 ? (a >= d ? 0 : Math.PI / 2) : Math.atan2(l1 - a, b);
  return {
    rx: radius * Math.sqrt(Math.max(0, l1)),
    ry: radius * Math.sqrt(Math.max(0, l2)),
    angle,
  };
}
