/**
 * Propositional formulas as small syntax trees, with evaluation, the list of
 * subformulas in evaluation order and LaTeX rendering.
 */

export type Connective = 'no' | 'y' | 'o' | 'implica' | 'bicondicional' | 'xor';

export type Formula =
  | { type: 'variable'; name: string }
  | { type: 'no'; operand: Formula }
  | { type: 'y' | 'o' | 'implica' | 'bicondicional' | 'xor'; left: Formula; right: Formula };

export const variable = (name: string): Formula => ({ type: 'variable', name });
export const not = (operand: Formula): Formula => ({ type: 'no', operand });
export const and = (left: Formula, right: Formula): Formula => ({ type: 'y', left, right });
export const or = (left: Formula, right: Formula): Formula => ({ type: 'o', left, right });
export const implies = (left: Formula, right: Formula): Formula => ({
  type: 'implica',
  left,
  right,
});
export const iff = (left: Formula, right: Formula): Formula => ({
  type: 'bicondicional',
  left,
  right,
});
export const xor = (left: Formula, right: Formula): Formula => ({ type: 'xor', left, right });

export type Assignment = Record<string, boolean>;

export function applyConnective(
  connective: Exclude<Connective, 'no'>,
  a: boolean,
  b: boolean,
): boolean {
  switch (connective) {
    case 'y':
      return a && b;
    case 'o':
      return a || b;
    case 'implica':
      return !a || b;
    case 'bicondicional':
      return a === b;
    case 'xor':
      return a !== b;
  }
}

export function evaluate(formula: Formula, assignment: Assignment): boolean {
  switch (formula.type) {
    case 'variable':
      return assignment[formula.name] ?? false;
    case 'no':
      return !evaluate(formula.operand, assignment);
    default:
      return applyConnective(
        formula.type,
        evaluate(formula.left, assignment),
        evaluate(formula.right, assignment),
      );
  }
}

const LATEX_SYMBOL: Record<Exclude<Connective, 'no'>, string> = {
  y: '\\land',
  o: '\\lor',
  implica: '\\rightarrow',
  bicondicional: '\\leftrightarrow',
  xor: '\\oplus',
};

export function toLatex(formula: Formula, top = true): string {
  switch (formula.type) {
    case 'variable':
      return formula.name;
    case 'no':
      return `\\lnot ${toLatex(formula.operand, false)}`;
    default: {
      const body = `${toLatex(formula.left, false)} ${LATEX_SYMBOL[formula.type]} ${toLatex(formula.right, false)}`;
      return top ? body : `(${body})`;
    }
  }
}

/** Variables in alphabetical order. */
export function variables(formula: Formula): string[] {
  const names = new Set<string>();
  const walk = (node: Formula) => {
    if (node.type === 'variable') names.add(node.name);
    else if (node.type === 'no') walk(node.operand);
    else {
      walk(node.left);
      walk(node.right);
    }
  };
  walk(formula);
  return [...names].sort();
}

/** Compound subformulas from innermost to outermost; the last one is the formula itself. */
export function subformulas(formula: Formula): Formula[] {
  const result: Formula[] = [];
  const seen = new Set<string>();
  const walk = (node: Formula) => {
    if (node.type === 'variable') return;
    if (node.type === 'no') walk(node.operand);
    else {
      walk(node.left);
      walk(node.right);
    }
    const key = toLatex(node);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(node);
    }
  };
  walk(formula);
  return result;
}

/** Rows of the truth table in the conventional order (all true first). */
export function assignments(names: readonly string[]): Assignment[] {
  const rows: Assignment[] = [];
  const count = 2 ** names.length;
  for (let index = 0; index < count; index += 1) {
    const row: Assignment = {};
    names.forEach((name, position) => {
      row[name] = ((index >> (names.length - 1 - position)) & 1) === 0;
    });
    rows.push(row);
  }
  return rows;
}

export type Classification = 'tautologia' | 'contradiccion' | 'contingencia';

export function classify(formula: Formula): Classification {
  const values = assignments(variables(formula)).map((row) => evaluate(formula, row));
  if (values.every(Boolean)) return 'tautologia';
  if (values.every((value) => !value)) return 'contradiccion';
  return 'contingencia';
}
