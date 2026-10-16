import { describe, expect, it } from 'vitest';
import {
  bestIndex,
  QUESTION_CASES,
} from '../../../src/visualizations/archetypes/DataProjectViz/questionCases.ts';
import { parametersSchema } from '../../../src/visualizations/archetypes/DataProjectViz/schema.ts';

describe('DataProjectViz question cases', () => {
  it('risk adjustment reverses the hospital ranking', () => {
    const [crude, adjusted] = QUESTION_CASES.hospitales.definitions;
    expect(crude && bestIndex(crude)).toBe(0);
    expect(adjusted && bestIndex(adjusted)).toBe(3);
    expect(adjusted?.values[0]).toBeCloseTo(7.67, 2);
    expect(adjusted?.values[3]).toBeCloseTo(5.29, 2);
  });

  it('each definition of the best branch crowns a different branch', () => {
    const winners = QUESTION_CASES.sucursales.definitions.map((d) => bestIndex(d));
    expect(new Set(winners).size).toBe(4);
  });

  it('validates parameters', () => {
    expect(parametersSchema.safeParse({ modo: 'crisp', caso: 'abandono' }).success).toBe(true);
    expect(parametersSchema.safeParse({ modo: 'crisp', caso: 'otro' }).success).toBe(false);
  });
});
