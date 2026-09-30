import { formatNumber } from '../../../lib/format/number.ts';
import {
  determinant,
  eigen,
  inverse,
  multiply,
  svd2,
  transpose,
  type Mat2,
  type Vec2,
} from './matrix2.ts';

export type FactorKind = 'svd' | 'diagonalizacion' | 'espectral';

/** A = right · middle · left, applied to the plane from the left factor outward. */
export interface Factorization {
  left: Mat2;
  middle: Mat2;
  right: Mat2;
  /** Directions that the left factor sends to the axes (columns of V or of P). */
  directions: [Vec2, Vec2];
  diagonal: [number, number];
  latex: string;
  phases: [string, string, string, string];
}

/** Why a matrix has no factorization of the requested kind, or null when it has one. */
export type FactorResult = { ok: true; value: Factorization } | { ok: false; reason: string };

const SYMMETRY_TOLERANCE = 1e-9;
const DEFECTIVE_TOLERANCE = 1e-9;

const diag = (a: number, b: number): Mat2 => [
  [a, 0],
  [0, b],
];

export function factorize(matrix: Mat2, kind: FactorKind): FactorResult {
  if (kind === 'svd') {
    const { u, sigma, v } = svd2(matrix);
    return {
      ok: true,
      value: {
        left: transpose(v),
        middle: diag(sigma[0], sigma[1]),
        right: u,
        directions: [
          [v[0][0], v[1][0]],
          [v[0][1], v[1][1]],
        ],
        diagonal: sigma,
        latex: 'U\\,\\Sigma\\,V^\\top',
        phases: [
          'Inicio: el círculo unitario y las direcciones v₁ y v₂.',
          'Paso 1, Vᵀ: una rotación (o reflexión) lleva v₁ y v₂ a los ejes.',
          'Paso 2, Σ: se estira cada eje por su valor singular.',
          'Paso 3, U: otra rotación coloca la elipse en su lugar. El resultado es A.',
        ],
      },
    };
  }
  if (kind === 'espectral' && Math.abs(matrix[0][1] - matrix[1][0]) > SYMMETRY_TOLERANCE) {
    return { ok: false, reason: 'A no es simétrica: el teorema espectral no aplica.' };
  }
  const { real, imaginary, vectors } = eigen(matrix);
  if (imaginary[0] !== 0 || !vectors) {
    return {
      ok: false,
      reason: 'Los valores propios son complejos: A no es diagonalizable sobre los reales.',
    };
  }
  const [v1, v2] = vectors;
  const p: Mat2 = [
    [v1?.[0] ?? 1, v2?.[0] ?? 0],
    [v1?.[1] ?? 0, v2?.[1] ?? 1],
  ];
  const pInverse = inverse(p);
  if (!pInverse || Math.abs(determinant(p)) < DEFECTIVE_TOLERANCE) {
    return {
      ok: false,
      reason: `El valor propio ${formatNumber(real[0], 3)} se repite con una sola dirección propia: A no es diagonalizable.`,
    };
  }
  const spectral = kind === 'espectral';
  return {
    ok: true,
    value: {
      left: spectral ? transpose(p) : pInverse,
      middle: diag(real[0], real[1]),
      right: p,
      directions: [
        [p[0][0], p[1][0]],
        [p[0][1], p[1][1]],
      ],
      diagonal: [real[0], real[1]],
      latex: spectral ? 'Q\\,\\Lambda\\,Q^\\top' : 'P\\,D\\,P^{-1}',
      phases: spectral
        ? [
            'Inicio: los vectores propios q₁ y q₂, perpendiculares entre sí.',
            'Paso 1, Qᵀ: una rotación lleva q₁ y q₂ a los ejes.',
            'Paso 2, Λ: cada eje se multiplica por su valor propio.',
            'Paso 3, Q: la rotación inversa devuelve los ejes a q₁ y q₂. El resultado es A.',
          ]
        : [
            'Inicio: los vectores propios v₁ y v₂ forman una base.',
            'Paso 1, P⁻¹: se pasa a coordenadas en la base de vectores propios.',
            'Paso 2, D: en esa base, A solo multiplica cada coordenada por su valor propio.',
            'Paso 3, P: se regresa a la base estándar. El resultado es A.',
          ],
    },
  };
}

/** Stage matrices I, L, M L and R M L for the animation. */
export function factorStages(f: Factorization): Mat2[] {
  const ml = multiply(f.middle, f.left);
  return [
    [
      [1, 0],
      [0, 1],
    ],
    f.left,
    ml,
    multiply(f.right, ml),
  ];
}
