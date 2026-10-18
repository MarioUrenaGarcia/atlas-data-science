import { describe, expect, it } from 'vitest';
import {
  atoms,
  cantorIntervals,
  counterexampleArray,
  dyadicRatios,
  enumerateRationals,
  functionLpNorm,
  generateSigmaAlgebra,
  integrate,
  isSigmaAlgebra,
  iteratedSums,
  layerCakeIntegral,
  lpNorm,
  lpUnitCirclePoint,
  MEASURE_FUNCTIONS,
  members,
  rationalCover,
  regionWhere,
  SEQUENCES,
  simpleApproximation,
  totalLength,
} from '../../../src/lib/measure/index.ts';

describe('sigma-algebras on a finite set', () => {
  it('closes {a} and {a, b} into the eight unions of three atoms', () => {
    const rounds = generateSigmaAlgebra(4, [0b0001, 0b0011]);
    const sets = rounds.at(-1)?.sets ?? [];
    expect(sets).toHaveLength(8);
    expect(isSigmaAlgebra(4, sets)).toBe(true);
    expect(atoms(sets).map((a) => members(a, 4))).toEqual([[0], [1], [2, 3]]);
  });
  it('detects a family that is not closed under complements', () => {
    expect(isSigmaAlgebra(3, [0, 0b001, 0b111])).toBe(false);
  });
});

describe('Lebesgue measure', () => {
  it('the Cantor construction keeps 2^k intervals of total length (2/3)^k', () => {
    const level = cantorIntervals(5);
    expect(level).toHaveLength(32);
    expect(totalLength(level)).toBeCloseTo((2 / 3) ** 5, 12);
  });
  it('lists each rational once and covers them with total length below epsilon', () => {
    const values = enumerateRationals(11).map((r) => `${r.p}/${r.q}`);
    expect(values).toEqual([
      '0/1',
      '1/1',
      '1/2',
      '1/3',
      '2/3',
      '1/4',
      '3/4',
      '1/5',
      '2/5',
      '3/5',
      '4/5',
    ]);
    const cover = rationalCover(30, 0.1);
    expect(cover.reduce((s, c) => s + c.length, 0)).toBeLessThan(0.1);
  });
  it('finds the intervals where a condition holds', () => {
    const pieces = regionWhere((x) => x > 0.25 && x < 0.5, 0, 1, 1000);
    expect(pieces).toHaveLength(1);
    expect(pieces[0]?.[0]).toBeCloseTo(0.25, 2);
    expect(pieces[0]?.[1]).toBeCloseTo(0.5, 2);
  });
});

describe('integration', () => {
  it('simple functions increase to the integral from below', () => {
    const f = MEASURE_FUNCTIONS.cuadrado.f;
    const values = [1, 2, 3, 6].map((n) => integrate(simpleApproximation(f, n), 0, 1));
    for (let i = 1; i < values.length; i += 1)
      expect(values[i]).toBeGreaterThanOrEqual(values[i - 1] ?? 0);
    expect(values.at(-1)).toBeLessThan(1 / 3);
    expect(1 / 3 - (values.at(-1) ?? 0)).toBeLessThan(2 ** -6);
  });
  it('the layer-cake integral agrees with the Riemann integral', () => {
    expect(layerCakeIntegral(MEASURE_FUNCTIONS.raiz.f, 0, 1, 1)).toBeCloseTo(2 / 3, 3);
  });
  it('the catalog integrals are exact', () => {
    for (const { f, integral } of Object.values(MEASURE_FUNCTIONS))
      expect(integrate(f, 0, 1)).toBeCloseTo(integral, 4);
  });
  it('the closed-form integrals of the sequences match numerical ones', () => {
    for (const sequence of Object.values(SEQUENCES)) {
      for (const n of [1, 3, 7])
        expect(integrate(sequence.term(n), 0, 1, 200000)).toBeCloseTo(sequence.integral(n), 2);
    }
  });
});

describe('Radon-Nikodym and Fubini', () => {
  it('dyadic ratios of nu(I) / mu(I) for the density 2x are the cell midpoints doubled', () => {
    const cells = dyadicRatios((x) => 2 * x, 3);
    cells.forEach((c) => expect(c.ratio).toBeCloseTo(c.a + c.b, 8));
  });
  it('the counterexample has rows summing to 0 and a first column summing to 1', () => {
    const { rows, columns } = iteratedSums(counterexampleArray(5));
    expect(rows.every((r) => r === 0)).toBe(true);
    expect(columns[0]).toBe(1);
    expect(columns.slice(1, 5).every((c) => c === 0)).toBe(true);
  });
});

describe('Lp norms', () => {
  it('vector norms decrease with p', () => {
    expect(lpNorm([3, 4], 1)).toBe(7);
    expect(lpNorm([3, 4], 2)).toBe(5);
    expect(lpNorm([3, 4], Infinity)).toBe(4);
  });
  it('points of the unit sphere have norm 1', () => {
    for (const p of [1, 1.5, 2, 4, Infinity])
      expect(lpNorm(lpUnitCirclePoint(0.7, p), p)).toBeCloseTo(1, 12);
  });
  it('the norm of x on [0, 1] is (1/(p + 1))^(1/p)', () => {
    expect(functionLpNorm((x) => x, 0, 1, 2)).toBeCloseTo(Math.sqrt(1 / 3), 5);
  });
});
