import { describe, expect, it } from 'vitest';
import {
  checkStatements,
  SCALE_CASES,
} from '../../../src/visualizations/archetypes/DataTypesViz/scales.ts';
import { STRUCTURE_CASES } from '../../../src/visualizations/archetypes/DataTypesViz/structureCases.ts';
import { TIDY_CASES } from '../../../src/visualizations/archetypes/DataTypesViz/tidyCases.ts';

describe('DataTypesViz cases', () => {
  it('each scale preserves exactly the operations it allows', () => {
    const preserved = (variable: keyof typeof SCALE_CASES) =>
      checkStatements(SCALE_CASES[variable]).map((check) => check.preserved);
    expect(preserved('colores')).toEqual([true, false, false, false]);
    expect(preserved('satisfaccion')).toEqual([true, true, false, false]);
    expect(preserved('temperatura')).toEqual([true, true, true, false]);
    expect(preserved('peso')).toEqual([true, true, true, true]);
  });

  it('structure fragments appear in their sources', () => {
    for (const item of Object.values(STRUCTURE_CASES)) {
      const json = item.jsonLines.join('\n');
      for (const field of item.fields) {
        if (field.json) expect(json).toContain(field.json);
        if (field.text) expect(item.text).toContain(field.text);
      }
    }
  });

  it('tidy moves reveal every target cell once', () => {
    for (const item of Object.values(TIDY_CASES)) {
      const cells = item.steps.flatMap((step) => step.target.map(([r, c]) => `${r},${c}`));
      const total = item.target.rows.length * item.target.headers.length;
      expect(new Set(cells).size).toBe(total);
    }
  });
});
