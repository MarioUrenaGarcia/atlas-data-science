import { describe, expect, it } from 'vitest';
import {
  paletteColor,
  toDeuteranopia,
  toGray,
} from '../../../src/visualizations/archetypes/ChartGallery/palettes.ts';

const parse = (c: string) => (/rgb\((\d+), ?(\d+), ?(\d+)\)/.exec(c) ?? []).slice(1).map(Number);

describe('chart palettes', () => {
  it('keeps neutral grays under the color blindness simulation', () => {
    const [r, g, b] = parse(toDeuteranopia('rgb(128, 128, 128)'));
    expect(Math.abs((r ?? 0) - 128)).toBeLessThanOrEqual(1);
    expect(Math.abs((g ?? 0) - 128)).toBeLessThanOrEqual(1);
    expect(Math.abs((b ?? 0) - 128)).toBeLessThanOrEqual(1);
  });

  it('makes saturated red and green much harder to tell apart', () => {
    const distance = (p: number[], q: number[]) => Math.hypot(...p.map((v, i) => v - (q[i] ?? 0)));
    const red = 'rgb(220, 40, 40)';
    const green = 'rgb(40, 160, 40)';
    const before = distance(parse(red), parse(green));
    const after = distance(parse(toDeuteranopia(red)), parse(toDeuteranopia(green)));
    expect(after).toBeLessThan(before / 2);
  });

  it('converts to gray with equal channels', () => {
    const [r, g, b] = parse(toGray('rgb(10, 200, 30)'));
    expect(r).toBe(g);
    expect(g).toBe(b);
  });

  it('the sequential palette darkens with the value', () => {
    const light = parse(toGray(paletteColor('secuencial', 0, 0, 10, 5)))[0] ?? 0;
    const dark = parse(toGray(paletteColor('secuencial', 10, 0, 10, 5)))[0] ?? 0;
    expect(dark).toBeLessThan(light);
  });
});
