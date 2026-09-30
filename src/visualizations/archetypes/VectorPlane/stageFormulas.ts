import { formatNumber } from '../../../lib/format/number.ts';
import type { Vec2 } from './schema.ts';
import { vecLatex } from './vectors.ts';

const n = (value: number, digits = 2) => formatNumber(value, digits);

/** Formula of the highlighted distance with the current numbers substituted. */
export function distanceFormula(
  metric: string,
  a: Vec2,
  b: Vec2,
  p: number,
  value: number,
): string {
  const dx = Math.abs(b[0] - a[0]);
  const dy = Math.abs(b[1] - a[1]);
  switch (metric) {
    case 'manhattan':
      return `d_1(A, B) = |a_1 - b_1| + |a_2 - b_2| = ${n(dx)} + ${n(dy)} = ${n(value, 3)}`;
    case 'euclidiana':
      return `d_2(A, B) = \\sqrt{(a_1 - b_1)^2 + (a_2 - b_2)^2} = \\sqrt{${n(dx)}^2 + ${n(dy)}^2} = ${n(value, 3)}`;
    case 'chebyshev':
      return `d_\\infty(A, B) = \\max(|a_1 - b_1|, |a_2 - b_2|) = \\max(${n(dx)}, ${n(dy)}) = ${n(value, 3)}`;
    default:
      return `d_{${n(p)}}(A, B) = \\left(${n(dx)}^{${n(p)}} + ${n(dy)}^{${n(p)}}\\right)^{1/${n(p)}} = ${n(value, 3)}`;
  }
}

/** Formula of the current Gram-Schmidt step with the current vectors. */
export function gramSchmidtFormula(
  step: number,
  v1: Vec2,
  v2: Vec2,
  q1: Vec2,
  shadow: number,
  w2: Vec2,
  q2: Vec2,
): string {
  switch (step) {
    case 0:
      return `\\mathbf{v}_1 = ${vecLatex(v1)},\\qquad \\mathbf{v}_2 = ${vecLatex(v2)}`;
    case 1:
      return `\\mathbf{q}_1 = \\frac{\\mathbf{v}_1}{\\lVert \\mathbf{v}_1 \\rVert} = \\frac{1}{${n(Math.hypot(v1[0], v1[1]), 3)}}${vecLatex(v1)} = ${vecLatex(q1, 3)}`;
    case 2:
      return `(\\mathbf{v}_2 \\cdot \\mathbf{q}_1)\\,\\mathbf{q}_1 = ${n(shadow, 3)}\\,${vecLatex(q1, 3)} = ${vecLatex([shadow * q1[0], shadow * q1[1]], 3)}`;
    case 3:
      return `\\mathbf{w}_2 = \\mathbf{v}_2 - (\\mathbf{v}_2 \\cdot \\mathbf{q}_1)\\,\\mathbf{q}_1 = ${vecLatex(w2, 3)}`;
    default:
      return `\\mathbf{q}_2 = \\frac{\\mathbf{w}_2}{\\lVert \\mathbf{w}_2 \\rVert} = ${vecLatex(q2, 3)},\\qquad \\mathbf{q}_1 \\cdot \\mathbf{q}_2 = 0`;
  }
}
