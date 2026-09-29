import { describe, expect, it } from 'vitest';
import {
  and,
  assignments,
  classify,
  evaluate,
  iff,
  implies,
  not,
  or,
  subformulas,
  toLatex,
  variable,
  variables,
} from '../../../src/lib/logic/index.ts';

const p = variable('p');
const q = variable('q');

describe('propositional logic', () => {
  it('evaluates the implication truth table', () => {
    const formula = implies(p, q);
    expect(assignments(['p', 'q']).map((row) => evaluate(formula, row))).toEqual([
      true,
      false,
      true,
      true,
    ]);
  });

  it('classifies tautologies, contradictions and contingencies', () => {
    expect(classify(iff(not(and(p, q)), or(not(p), not(q))))).toBe('tautologia');
    expect(classify(and(p, not(p)))).toBe('contradiccion');
    expect(classify(iff(implies(p, q), implies(q, p)))).toBe('contingencia');
    expect(classify(implies(and(implies(p, q), not(q)), not(p)))).toBe('tautologia');
  });

  it('lists variables and subformulas and renders LaTeX', () => {
    const formula = implies(and(p, not(q)), p);
    expect(variables(formula)).toEqual(['p', 'q']);
    expect(subformulas(formula).map((node) => toLatex(node))).toEqual([
      '\\lnot q',
      'p \\land \\lnot q',
      '(p \\land \\lnot q) \\rightarrow p',
    ]);
  });
});
