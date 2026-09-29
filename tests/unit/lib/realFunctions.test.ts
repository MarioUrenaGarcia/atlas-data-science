import { describe, expect, it } from 'vitest';
import { analyzeFunction, preimages, REAL_FUNCTIONS } from '../../../src/lib/sets/realFunctions.ts';

describe('analyzeFunction', () => {
  it('x² en [-2, 2] hacia [0, 4] es suprayectiva pero no inyectiva', () => {
    const result = analyzeFunction(REAL_FUNCTIONS.cuadrado, [-2, 2], [0, 4]);
    expect(result.intoCodomain).toBe(true);
    expect(result.injective).toBe(false);
    expect(result.surjective).toBe(true);
    const [x1, x2] = result.collision ?? [0, 0];
    expect(x1 * x1).toBeCloseTo(x2 * x2, 6);
    expect(x1).not.toBeCloseTo(x2, 3);
  });

  it('x² en [0, 2] hacia [0, 4] es biyectiva', () => {
    const result = analyzeFunction(REAL_FUNCTIONS.cuadrado, [0, 2], [0, 4]);
    expect(result.injective && result.surjective).toBe(true);
  });

  it('eˣ en [-2, 2] hacia [-1, 8] es inyectiva y no suprayectiva', () => {
    const result = analyzeFunction(REAL_FUNCTIONS.exponencial, [-2, 2], [-1, 8]);
    expect(result.injective).toBe(true);
    expect(result.surjective).toBe(false);
    expect(result.missed).toBeLessThan(Math.exp(-2));
  });

  it('detecta cuando la gráfica sale del codominio', () => {
    expect(analyzeFunction(REAL_FUNCTIONS.cubo, [-2, 2], [-1, 1]).intoCodomain).toBe(false);
  });

  it('la parte entera no es inyectiva ni suprayectiva sobre un intervalo', () => {
    const result = analyzeFunction(REAL_FUNCTIONS['parte-entera'], [0, 3], [0, 3]);
    expect(result.injective).toBe(false);
    expect(result.surjective).toBe(false);
  });
});

describe('preimages', () => {
  it('encuentra las soluciones de f(x) = c', () => {
    const roots = preimages(REAL_FUNCTIONS.cuadrado.f, [-2, 2], 1);
    expect(roots).toHaveLength(2);
    expect(roots[0]).toBeCloseTo(-1, 8);
    expect(roots[1]).toBeCloseTo(1, 8);
    expect(preimages(REAL_FUNCTIONS.cubica.f, [-2.5, 2.5], 0)).toHaveLength(3);
    expect(preimages(REAL_FUNCTIONS.cuadrado.f, [-2, 2], -1)).toHaveLength(0);
  });
});
