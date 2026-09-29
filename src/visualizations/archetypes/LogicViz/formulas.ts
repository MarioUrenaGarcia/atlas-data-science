import {
  and,
  iff,
  implies,
  not,
  or,
  variable,
  xor,
  type Formula,
} from '../../../lib/logic/index.ts';

const p = variable('p');
const q = variable('q');
const r = variable('r');

export const FORMULA_IDS = [
  'conjuncion',
  'implicacion',
  'contrapositiva',
  'reciproca',
  'modus-ponens',
  'modus-tollens',
  'silogismo',
  'de-morgan-y',
  'de-morgan-o',
  'distributiva',
  'contradiccion',
  'tercero-excluido',
  'xor-vs-o',
] as const;

export type FormulaId = (typeof FORMULA_IDS)[number];

export const FORMULAS: Record<FormulaId, { label: string; formula: Formula }> = {
  conjuncion: { label: 'Conjunción con negación', formula: and(p, not(q)) },
  implicacion: { label: 'Implicación', formula: implies(p, q) },
  contrapositiva: {
    label: 'Equivalencia con la contrapositiva',
    formula: iff(implies(p, q), implies(not(q), not(p))),
  },
  reciproca: { label: 'Equivalencia con la recíproca', formula: iff(implies(p, q), implies(q, p)) },
  'modus-ponens': { label: 'Modus ponens', formula: implies(and(implies(p, q), p), q) },
  'modus-tollens': { label: 'Modus tollens', formula: implies(and(implies(p, q), not(q)), not(p)) },
  silogismo: {
    label: 'Silogismo hipotético',
    formula: implies(and(implies(p, q), implies(q, r)), implies(p, r)),
  },
  'de-morgan-y': {
    label: 'De Morgan para la conjunción',
    formula: iff(not(and(p, q)), or(not(p), not(q))),
  },
  'de-morgan-o': {
    label: 'De Morgan para la disyunción',
    formula: iff(not(or(p, q)), and(not(p), not(q))),
  },
  distributiva: {
    label: 'Distributividad',
    formula: iff(and(p, or(q, r)), or(and(p, q), and(p, r))),
  },
  contradiccion: { label: 'Contradicción', formula: and(p, not(p)) },
  'tercero-excluido': { label: 'Tercero excluido', formula: or(p, not(p)) },
  'xor-vs-o': {
    label: 'Disyunción exclusiva frente a inclusiva',
    formula: iff(xor(p, q), or(p, q)),
  },
};
