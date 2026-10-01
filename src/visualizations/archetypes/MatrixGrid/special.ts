import { formatFraction } from '../../../lib/format/number.ts';
import {
  determinant,
  identity,
  multiply,
  transpose,
  type Matrix,
} from '../../../lib/linalg/index.ts';
import type { SpecialKind } from './schema.ts';

export interface SpecialExample {
  label: string;
  matrix: Matrix;
  /** Defining property in LaTeX. */
  latex: string;
  /** What the pattern means, in words. */
  text: string;
  /** A second matrix that shows the property at work. */
  check: { name: string; matrix: Matrix; text: string };
  /** Entries forced to zero by the kind. */
  forcedZero: (i: number, j: number) => boolean;
}

const DIAGONAL_VALUES = [2, -1, 3, 0.5, 4];
const COS = 0.6;
const SIN = 0.8;

const build = (n: number, entry: (i: number, j: number) => number): Matrix =>
  Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => entry(i, j)));

const column = (n: number): Matrix => Array.from({ length: n }, (_, i) => [i + 1]);

function orthogonal(n: number): Matrix {
  // A rotation of the first two coordinates by the angle with cosine 0.6, and a swap of the next two.
  return build(n, (i, j) => {
    if (i < 2 && j < 2) return i === j ? COS : i === 0 ? -SIN : SIN;
    if (n >= 4 && i >= 2 && i < 4 && j >= 2 && j < 4) return i === j ? 0 : 1;
    return i === j ? 1 : 0;
  });
}

export function specialExample(kind: SpecialKind, n: number): SpecialExample {
  switch (kind) {
    case 'identidad': {
      const matrix = identity(n);
      return {
        label: 'Identidad',
        matrix,
        latex: '\\mathbf{I}\\,\\mathbf{x} = \\mathbf{x},\\quad \\mathbf{A}\\mathbf{I} = \\mathbf{I}\\mathbf{A} = \\mathbf{A}',
        text: 'Unos en la diagonal y ceros fuera: deja todo vector igual.',
        check: {
          name: 'I x',
          matrix: multiply(matrix, column(n)),
          text: 'I por (1, 2, ...) devuelve el mismo vector.',
        },
        forcedZero: (i, j) => i !== j,
      };
    }
    case 'diagonal': {
      const matrix = build(n, (i, j) => (i === j ? (DIAGONAL_VALUES[i] ?? 1) : 0));
      return {
        label: 'Diagonal',
        matrix,
        latex: 'd_{ij} = 0 \\text{ si } i \\neq j,\\quad (\\mathbf{D}\\mathbf{x})_i = d_{ii}\\,x_i',
        text: 'Solo la diagonal puede ser distinta de cero: cada coordenada se multiplica por su propio factor.',
        check: {
          name: 'D x',
          matrix: multiply(matrix, column(n)),
          text: 'D por (1, 2, ...) escala cada coordenada por separado.',
        },
        forcedZero: (i, j) => i !== j,
      };
    }
    case 'triangular-superior': {
      const matrix = build(n, (i, j) => (j >= i ? ((i + 2 * j) % 5) + 1 : 0));
      return {
        label: 'Triangular superior',
        matrix,
        latex: `u_{ij} = 0 \\text{ si } i > j,\\quad \\det \\mathbf{U} = \\prod_i u_{ii} = ${formatFraction(determinant(matrix))}`,
        text: 'Ceros debajo de la diagonal. El determinante es el producto de la diagonal.',
        check: {
          name: 'Uᵀ',
          matrix: transpose(matrix),
          text: 'Su transpuesta es triangular inferior.',
        },
        forcedZero: (i, j) => i > j,
      };
    }
    case 'triangular-inferior': {
      const matrix = build(n, (i, j) => (j <= i ? ((2 * i + j) % 5) + 1 : 0));
      return {
        label: 'Triangular inferior',
        matrix,
        latex: `\\ell_{ij} = 0 \\text{ si } i < j,\\quad \\det \\mathbf{L} = \\prod_i \\ell_{ii} = ${formatFraction(determinant(matrix))}`,
        text: 'Ceros encima de la diagonal. Un sistema L x = b se resuelve de arriba hacia abajo.',
        check: {
          name: 'L L',
          matrix: multiply(matrix, matrix),
          text: 'El producto de triangulares inferiores sigue siendo triangular inferior.',
        },
        forcedZero: (i, j) => i < j,
      };
    }
    case 'simetrica': {
      const matrix = build(n, (i, j) => (i === j ? n + i : ((i + j) % 3) + 1));
      return {
        label: 'Simétrica',
        matrix,
        latex: '\\mathbf{A}^\\top = \\mathbf{A},\\quad a_{ij} = a_{ji}',
        text: 'Es su propio espejo respecto a la diagonal.',
        check: { name: 'Aᵀ', matrix: transpose(matrix), text: 'La transpuesta coincide con A.' },
        forcedZero: () => false,
      };
    }
    case 'antisimetrica': {
      const matrix = build(n, (i, j) => j - i);
      return {
        label: 'Antisimétrica',
        matrix,
        latex: '\\mathbf{A}^\\top = -\\mathbf{A},\\quad a_{ii} = 0',
        text: 'El espejo respecto a la diagonal cambia el signo, así que la diagonal es cero.',
        check: { name: 'Aᵀ', matrix: transpose(matrix), text: 'La transpuesta es -A.' },
        forcedZero: (i, j) => i === j,
      };
    }
    case 'ortogonal': {
      const matrix = orthogonal(n);
      return {
        label: 'Ortogonal',
        matrix,
        latex:
          '\\mathbf{Q}^\\top \\mathbf{Q} = \\mathbf{I},\\quad \\mathbf{Q}^{-1} = \\mathbf{Q}^\\top,\\quad \\lVert \\mathbf{Q}\\mathbf{x} \\rVert = \\lVert \\mathbf{x} \\rVert',
        text: 'Sus columnas son unitarias y perpendiculares entre sí: rota o refleja sin cambiar longitudes.',
        check: {
          name: 'QᵀQ',
          matrix: multiply(transpose(matrix), matrix),
          text: 'QᵀQ es la identidad.',
        },
        forcedZero: () => false,
      };
    }
    case 'permutacion': {
      const matrix = build(n, (i, j) => (j === (i + 1) % n ? 1 : 0));
      return {
        label: 'Permutación',
        matrix,
        latex:
          '\\mathbf{P}\\mathbf{x} \\text{ reordena las entradas de } \\mathbf{x},\\quad \\mathbf{P}^{-1} = \\mathbf{P}^\\top',
        text: 'Un solo 1 en cada fila y en cada columna: reordena las coordenadas.',
        check: {
          name: 'P x',
          matrix: multiply(matrix, column(n)),
          text: 'P por (1, 2, ...) devuelve las mismas entradas en otro orden.',
        },
        forcedZero: () => false,
      };
    }
  }
}
