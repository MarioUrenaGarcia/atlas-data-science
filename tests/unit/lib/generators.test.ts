import { describe, expect, it } from 'vitest';
import {
  aliasDraw,
  aliasTable,
  boxMuller,
  buildZiggurat,
  frequencyTest,
  halton2,
  hullDobell,
  LinearCongruential,
  lcgPeriod,
  marsagliaPolar,
  MersenneTwister,
  radicalInverse,
  randu,
  rejectionStep,
  runsUpDown,
  serialCorrelation,
  starDiscrepancy,
} from '../../../src/lib/random/generators.ts';

describe('generador congruencial lineal', () => {
  it('reproduce la recurrencia', () => {
    const g = new LinearCongruential(5, 3, 16, 7);
    expect([g.nextInt(), g.nextInt(), g.nextInt()]).toEqual([6, 1, 8]);
  });

  it('alcanza periodo completo cuando se cumplen las condiciones de Hull y Dobell', () => {
    expect(hullDobell(5, 3, 16)).toBe(true);
    expect(lcgPeriod(5, 3, 16, 7)).toBe(16);
    expect(hullDobell(6, 3, 16)).toBe(false);
    expect(lcgPeriod(6, 3, 16, 7)).toBeLessThan(16);
  });

  it('pone las ternas de RANDU en planos: 9u - 6v + w es entero', () => {
    const g = randu(1);
    for (let i = 0; i < 50; i += 1) {
      const [u, v, w] = [g.next(), g.next(), g.next()];
      const combination = 9 * u - 6 * v + w;
      expect(Math.abs(combination - Math.round(combination))).toBeLessThan(1e-6);
    }
  });
});

describe('Mersenne Twister', () => {
  it('coincide con la referencia de MT19937 para la semilla 5489', () => {
    const mt = new MersenneTwister(5489);
    expect(mt.nextInt()).toBe(3499211612);
    expect(mt.nextInt()).toBe(581869302);
  });

  it('tiene media cercana a 1/2', () => {
    const mt = new MersenneTwister(42);
    let sum = 0;
    for (let i = 0; i < 100000; i += 1) sum += mt.next();
    expect(sum / 100000).toBeCloseTo(0.5, 2);
  });
});

describe('pruebas de aleatoriedad', () => {
  it('calcula la ji cuadrada de frecuencias', () => {
    const test = frequencyTest([0.1, 0.1, 0.6, 0.9], 2);
    expect(test.counts).toEqual([2, 2]);
    expect(test.statistic).toBe(0);
    expect(test.degrees).toBe(1);
  });

  it('cuenta corridas ascendentes y descendentes', () => {
    expect(runsUpDown([1, 2, 3, 2, 1, 4]).runs).toBe(3);
  });

  it('detecta correlación serial en una secuencia ordenada', () => {
    const sorted = Array.from({ length: 100 }, (_, i) => i / 100);
    expect(serialCorrelation(sorted)).toBeGreaterThan(0.9);
    const mt = new MersenneTwister(3);
    const random = Array.from({ length: 5000 }, () => mt.next());
    expect(Math.abs(serialCorrelation(random))).toBeLessThan(0.05);
  });
});

describe('transformaciones a normales', () => {
  it('Box-Muller produce normales con media 0 y varianza 1', () => {
    const mt = new MersenneTwister(7);
    const z: number[] = [];
    for (let i = 0; i < 20000; i += 1) z.push(...boxMuller(1 - mt.next(), mt.next()));
    const mean = z.reduce((s, x) => s + x, 0) / z.length;
    const variance = z.reduce((s, x) => s + x * x, 0) / z.length;
    expect(mean).toBeCloseTo(0, 1);
    expect(variance).toBeCloseTo(1, 1);
  });

  it('el método polar rechaza puntos fuera del círculo y acepta cerca de π/4', () => {
    expect(marsagliaPolar(0.9, 0.9)).toBeNull();
    const mt = new MersenneTwister(9);
    let accepted = 0;
    for (let i = 0; i < 40000; i += 1)
      if (marsagliaPolar(2 * mt.next() - 1, 2 * mt.next() - 1)) accepted += 1;
    expect(accepted / 40000).toBeCloseTo(Math.PI / 4, 2);
  });
});

describe('aceptación y rechazo', () => {
  it('acepta con probabilidad 1/M', () => {
    const target = (x: number) => (x >= 0 && x <= 1 ? 6 * x * (1 - x) : 0);
    const proposal = () => 1;
    const mt = new MersenneTwister(11);
    let accepted = 0;
    for (let i = 0; i < 40000; i += 1) {
      if (rejectionStep(mt.next(), mt.next(), target, proposal, 1.5).accepted) accepted += 1;
    }
    expect(accepted / 40000).toBeCloseTo(1 / 1.5, 2);
  });
});

describe('ziggurat', () => {
  it('reproduce el borde conocido con 128 capas', () => {
    expect(buildZiggurat(128).edges[0]).toBeCloseTo(3.442619855899, 5);
  });

  it('tiene bordes decrecientes que terminan en cero', () => {
    const z = buildZiggurat(8);
    for (let i = 1; i < z.edges.length; i += 1) {
      expect(z.edges[i]).toBeLessThan(z.edges[i - 1] ?? Infinity);
    }
    expect(z.edges[z.edges.length - 1]).toBe(0);
  });
});

describe('método del alias', () => {
  it('reproduce las probabilidades', () => {
    const weights = [0.1, 0.5, 0.15, 0.25];
    const table = aliasTable(weights);
    // Exact probability of each outcome from the table.
    const k = weights.length;
    const exact = new Array<number>(k).fill(0);
    table.probability.forEach((p, column) => {
      exact[column] = (exact[column] ?? 0) + p / k;
      const other = table.alias[column] ?? column;
      exact[other] = (exact[other] ?? 0) + (1 - p) / k;
    });
    exact.forEach((p, i) => expect(p).toBeCloseTo(weights[i] ?? 0, 12));
    expect(aliasDraw(table, 0.999999)).toBeGreaterThanOrEqual(0);
  });
});

describe('baja discrepancia', () => {
  it('calcula el inverso radical', () => {
    expect([1, 2, 3, 4].map((i) => radicalInverse(i, 2))).toEqual([0.5, 0.25, 0.75, 0.125]);
    expect(halton2(1)).toEqual([0.5, 1 / 3]);
  });

  it('Halton tiene menos discrepancia que puntos pseudoaleatorios', () => {
    const halton = Array.from({ length: 256 }, (_, i) => halton2(i + 1));
    const mt = new MersenneTwister(5);
    const random = Array.from({ length: 256 }, () => [mt.next(), mt.next()] as [number, number]);
    expect(starDiscrepancy(halton)).toBeLessThan(starDiscrepancy(random));
  });
});
