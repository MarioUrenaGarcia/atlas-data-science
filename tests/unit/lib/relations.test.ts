import { describe, expect, it } from 'vitest';
import {
  antisymmetric,
  equivalenceClasses,
  reflexive,
  relationMatrix,
  symmetric,
  transitive,
} from '../../../src/lib/sets/relations.ts';

const ELEMENTS = [1, 2, 3, 4, 5, 6];

describe('relations', () => {
  it('recognizes congruence modulo 3 as an equivalence with three classes', () => {
    const matrix = relationMatrix(ELEMENTS, (a, b) => (a - b) % 3 === 0);
    expect(reflexive(matrix).holds && symmetric(matrix).holds && transitive(matrix).holds).toBe(
      true,
    );
    expect(equivalenceClasses(matrix)).toEqual([
      [0, 3],
      [1, 4],
      [2, 5],
    ]);
  });

  it('finds counterexamples', () => {
    const lessThan = relationMatrix(ELEMENTS, (a, b) => a < b);
    expect(reflexive(lessThan).witness).toEqual([0]);
    expect(symmetric(lessThan).witness).toEqual([0, 1]);
    expect(antisymmetric(lessThan).holds).toBe(true);
    const close = relationMatrix(ELEMENTS, (a, b) => Math.abs(a - b) <= 1);
    expect(transitive(close).holds).toBe(false);
    expect(transitive(close).witness).toEqual([0, 1, 2]);
  });
});
