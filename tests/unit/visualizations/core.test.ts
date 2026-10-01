import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadVisualizationCatalog } from '../../../scripts/content/visualizations.ts';
import { exponential, normal, poisson } from '../../../src/lib/distributions/index.ts';
import { formatNumber } from '../../../src/lib/format/number.ts';
import { CATALOG_EXAMPLES } from '../../../src/visualizations/catalog/examples.ts';
import {
  coerceValue,
  defaultValues,
  defineParameters,
  initialValues,
  normalizeNumber,
} from '../../../src/visualizations/core/parameters.ts';
import { plotWindow } from '../../../src/visualizations/shared/plotWindow.ts';

const DEFINITIONS = defineParameters([
  { type: 'number', key: 'n', label: 'n', min: 1, max: 100, step: 1, default: 10 },
  { type: 'number', key: 'p', label: 'p', min: 0, max: 1, step: 0.01, default: 0.5 },
  {
    type: 'select',
    key: 'modo',
    label: 'Modo',
    options: [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ],
    default: 'a',
  },
  { type: 'toggle', key: 'teoria', label: 'Teoría', default: true },
] as const);

describe('parameter definitions', () => {
  it('builds defaults and applies valid overrides only', () => {
    expect(defaultValues(DEFINITIONS)).toEqual({ n: 10, p: 0.5, modo: 'a', teoria: true });
    expect(initialValues(DEFINITIONS, { n: 250, p: '0.333', modo: 'z', teoria: 'false' })).toEqual({
      n: 100,
      p: 0.33,
      modo: 'a',
      teoria: false,
    });
  });

  it('clamps and snaps numbers without floating point noise', () => {
    const p = DEFINITIONS[1];
    expect(normalizeNumber(p, 0.30000000000000004)).toBe(0.3);
    expect(normalizeNumber(p, -1)).toBe(0);
    expect(coerceValue(p, 'abc')).toBeUndefined();
  });
});

describe('plotWindow', () => {
  it('covers the bulk of the distribution inside the limits', () => {
    const [lo, hi] = plotWindow([normal(0, 1)], [-8, 8], false);
    expect(lo).toBeLessThanOrEqual(-2.8);
    expect(hi).toBeGreaterThanOrEqual(2.8);
    expect(hi).toBeLessThan(6);
    const [e0] = plotWindow([exponential(1)], [0, 8], false);
    expect(e0).toBe(0);
    const [p0, p1] = plotWindow([poisson(3)], [-0.5, 40.5], true);
    expect(p0).toBe(-0.5);
    expect(Number.isInteger(p1 - 0.5)).toBe(true);
  });
});

describe('number formatting', () => {
  it('uses a decimal point and groups thousands only beyond five digits', () => {
    expect(formatNumber(1234.5678, 2)).toBe('1234.57');
    expect(formatNumber(1234567, 0)).toBe('1,234,567');
    expect(formatNumber(-0.5, 3)).toBe('-0.500');
    expect(formatNumber(Number.NaN)).toBe('no definido');
  });
});

describe('catalog examples', () => {
  it('match the parameter schema of their visualization', async () => {
    const catalog = await loadVisualizationCatalog(
      join(import.meta.dirname, '..', '..', '..', 'src', 'visualizations'),
    );
    for (const example of CATALOG_EXAMPLES) {
      const entry = catalog.get(example.component);
      expect(entry, example.component).toBeDefined();
      const result = entry?.schema?.safeParse(example.params);
      expect(result?.success, `${example.component}: ${example.title}`).toBe(true);
    }
    // Loading every visualization schema takes several seconds when the suite runs in parallel.
  }, 30_000);
});
