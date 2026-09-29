import { describe, expect, it } from 'vitest';
import {
  bell,
  bellTriangle,
  canonicalRotation,
  catalan,
  characteristicRoots,
  choose,
  circularPermutations,
  combinations,
  conjugatePartition,
  derangements,
  distinctPermutations,
  estimateCount,
  hasAdjacentOnes,
  dyckPaths,
  dyckWord,
  exponentialProduct,
  factorial,
  fallingFactorial,
  fixedPoints,
  inclusionExclusion,
  integerPartitions,
  linearRecurrence,
  multinomial,
  multisetCount,
  multisets,
  ordinaryProducts,
  partitionCount,
  pascalRows,
  permutations,
  polygonTriangulations,
  polynomialProduct,
  secondOrderClosedForm,
  setPartitions,
  stirling2,
  stringsWithoutAdjacentOnes,
  subsetsWithSumAtMost,
  words,
} from '../../../src/lib/combinatorics/index.ts';

describe('conteos básicos', () => {
  it('factorial y factorial descendente', () => {
    expect([0, 1, 5, 10].map(factorial)).toEqual([1, 1, 120, 3628800]);
    expect(factorial(-1)).toBeNaN();
    expect(fallingFactorial(10, 3)).toBe(720);
    expect(fallingFactorial(4, 5)).toBe(0);
  });

  it('multinomial, multiconjuntos y permutaciones circulares', () => {
    // MISSISSIPPI: 1 M, 4 I, 4 S, 2 P.
    expect(multinomial([1, 4, 4, 2])).toBe(34650);
    expect(multinomial([2, 1, 1])).toBe(12);
    expect(multisetCount(3, 5)).toBe(21);
    expect(multisetCount(0, 0)).toBe(1);
    expect(circularPermutations(5)).toBe(24);
  });

  it('desarreglos y su proporción cercana a 1/e', () => {
    expect([0, 1, 2, 3, 4, 5, 6].map(derangements)).toEqual([1, 0, 1, 2, 9, 44, 265]);
    expect(derangements(12) / factorial(12)).toBeCloseTo(Math.exp(-1), 8);
  });

  it('Stirling de segunda especie, Bell y Catalan', () => {
    expect(stirling2(5, 2)).toBe(15);
    expect(stirling2(6, 3)).toBe(90);
    expect(stirling2(4, 0)).toBe(0);
    expect([0, 1, 2, 3, 4, 5, 6].map(bell)).toEqual([1, 1, 2, 5, 15, 52, 203]);
    expect(bellTriangle(3)).toEqual([[1], [1, 2], [2, 3, 5]]);
    expect([0, 1, 2, 3, 4, 5].map(catalan)).toEqual([1, 1, 2, 5, 14, 42]);
    let total = 0;
    for (let k = 0; k <= 6; k += 1) total += stirling2(6, k);
    expect(total).toBe(bell(6));
  });

  it('particiones de enteros', () => {
    expect([0, 1, 4, 5, 10].map(partitionCount)).toEqual([1, 1, 5, 7, 42]);
  });

  it('triángulo de Pascal coincide con los coeficientes binomiales', () => {
    const rows = pascalRows(8);
    rows.forEach((row, n) => row.forEach((value, k) => expect(value).toBe(choose(n, k))));
    expect(rows[8]?.reduce((a, b) => a + b, 0)).toBe(256);
  });

  it('inclusión y exclusión con múltiplos de 2, 3 y 5 hasta 100', () => {
    const divisors = [2, 3, 5];
    const union = inclusionExclusion(3, (mask) => {
      let product = 1;
      divisors.forEach((d, bit) => {
        if ((mask >> bit) & 1) product *= d;
      });
      return Math.floor(100 / product);
    });
    let direct = 0;
    for (let x = 1; x <= 100; x += 1) if (divisors.some((d) => x % d === 0)) direct += 1;
    expect(union).toBe(direct);
    expect(union).toBe(74);
  });
});

describe('enumeraciones', () => {
  it('tamaños coinciden con las fórmulas', () => {
    expect(permutations(4)).toHaveLength(24);
    expect(permutations(5, 2)).toHaveLength(20);
    expect(words(3, 2)).toHaveLength(9);
    expect(combinations(6, 3)).toHaveLength(20);
    expect(multisets(3, 4)).toHaveLength(multisetCount(3, 4));
    expect(setPartitions(5)).toHaveLength(52);
    expect(setPartitions(0)).toEqual([[]]);
    expect(integerPartitions(6)).toHaveLength(11);
    expect(dyckPaths(4)).toHaveLength(14);
  });

  it('las palabras con repetición se listan en orden lexicográfico', () => {
    expect(words(2, 2)).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });

  it('anagramas sin repetidos', () => {
    const anagrams = distinctPermutations(['o', 's', 'o']).map((word) => word.join(''));
    expect(anagrams).toEqual(['oos', 'oso', 'soo']);
    expect(distinctPermutations([...'banana'])).toHaveLength(multinomial([3, 2, 1]));
  });

  it('bloques de cada partición de conjunto son disjuntos y cubren todo', () => {
    for (const partition of setPartitions(4)) {
      const elements = partition.flat().sort((a, b) => a - b);
      expect(elements).toEqual([0, 1, 2, 3]);
      expect(partition.every((block) => block.length > 0)).toBe(true);
    }
  });

  it('particiones conjugadas y caminos de Dyck', () => {
    expect(conjugatePartition([4, 2, 1])).toEqual([3, 2, 1, 1]);
    expect(conjugatePartition(conjugatePartition([5, 3, 3, 1]))).toEqual([5, 3, 3, 1]);
    for (const path of dyckPaths(3)) {
      let height = 0;
      for (const step of path) {
        height += step;
        expect(height).toBeGreaterThanOrEqual(0);
      }
      expect(height).toBe(0);
    }
  });

  it('rotación canónica y puntos fijos', () => {
    expect(canonicalRotation([2, 3, 0, 1])).toEqual([0, 1, 2, 3]);
    expect(fixedPoints([0, 2, 1, 3])).toBe(2);
    const circular = new Set(permutations(4).map((p) => canonicalRotation(p).join()));
    expect(circular.size).toBe(circularPermutations(4));
  });
});

describe('funciones generadoras y recurrencias', () => {
  it('producto de polinomios', () => {
    expect(polynomialProduct([1, 1], [1, 1])).toEqual([1, 2, 1]);
    expect(polynomialProduct([1, 2, 3], [1, 1], 2)).toEqual([1, 3, 5]);
  });

  it('cambio de monedas con piezas de 1, 2 y 5', () => {
    const steps = ordinaryProducts([1, 2, 5], 10);
    expect(steps[0]?.[10]).toBe(1);
    expect(steps[1]?.[10]).toBe(6);
    expect(steps[2]?.[10]).toBe(10);
    const parts = ordinaryProducts([1, 2, 3, 4, 5, 6, 7], 7).at(-1);
    expect(parts?.[7]).toBe(partitionCount(7));
  });

  it('producto exponencial cuenta estructuras etiquetadas', () => {
    // Splitting n labelled items into a chosen subset and its complement: 2^n.
    const ones = Array.from({ length: 7 }, () => 1);
    expect(exponentialProduct(ones, ones, 6)).toEqual([1, 2, 4, 8, 16, 32, 64]);
    // Derangements times sets gives all permutations: sum C(n, k) D_k = n!.
    const der = Array.from({ length: 7 }, (_, n) => derangements(n));
    expect(exponentialProduct(der, ones, 6)).toEqual([0, 1, 2, 3, 4, 5, 6].map(factorial));
  });

  it('recurrencias lineales y forma cerrada', () => {
    const fibonacci = linearRecurrence([1, 1], [0, 1], 12);
    expect(fibonacci).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]);
    const closed = secondOrderClosedForm(1, 1, 0, 1);
    fibonacci.forEach((value, n) => expect(closed(n)).toBeCloseTo(value, 6));
    const [r1, r2] = characteristicRoots(1, 1);
    expect(r1.re).toBeCloseTo((1 + Math.sqrt(5)) / 2, 12);
    expect(r2.re).toBeCloseTo((1 - Math.sqrt(5)) / 2, 12);
  });

  it('forma cerrada con raíz doble y con raíces complejas', () => {
    const double = linearRecurrence([4, -4], [1, 4], 10);
    const doubleClosed = secondOrderClosedForm(4, -4, 1, 4);
    double.forEach((value, n) => expect(doubleClosed(n)).toBeCloseTo(value, 6));
    const rotation = linearRecurrence([1, -1], [1, 2], 12);
    const rotationClosed = secondOrderClosedForm(1, -1, 1, 2);
    rotation.forEach((value, n) => expect(rotationClosed(n)).toBeCloseTo(value, 6));
    expect(characteristicRoots(1, -1)[0].im).toBeCloseTo(Math.sqrt(3) / 2, 12);
  });
});

describe('objetos de Catalan', () => {
  it('triangulaciones de polígonos y palabras de paréntesis', () => {
    expect([3, 4, 5, 6, 7].map((vertices) => polygonTriangulations(vertices).length)).toEqual([
      1, 2, 5, 14, 42,
    ]);
    for (const triangulation of polygonTriangulations(6)) expect(triangulation).toHaveLength(3);
    expect(dyckPaths(2).map(dyckWord)).toEqual(['(())', '()()']);
  });
});

describe('conteo aproximado', () => {
  it('conteos exactos de referencia', () => {
    expect([1, 2, 3, 4, 10].map(stringsWithoutAdjacentOnes)).toEqual([2, 3, 5, 8, 144]);
    const brute = words(2, 10).filter((bits) => !hasAdjacentOnes(bits)).length;
    expect(brute).toBe(144);
    // Subsets of {1, 2, 3} with sum at most 3: {}, {1}, {2}, {3}, {1, 2}.
    expect(subsetsWithSumAtMost(3, 3)).toBe(5);
    expect(subsetsWithSumAtMost(10, 55)).toBe(1024);
  });

  it('estimación con intervalo', () => {
    const result = estimateCount(250, 1000, 4096);
    expect(result.estimate).toBe(1024);
    expect(result.low).toBeLessThan(1024);
    expect(result.high).toBeGreaterThan(1024);
    expect(estimateCount(0, 0, 100)).toEqual({ estimate: 0, low: 0, high: 100 });
  });
});
