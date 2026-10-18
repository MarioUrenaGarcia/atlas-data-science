import { describe, expect, it } from 'vitest';
import { simpson } from '../../../src/lib/calculus/index.ts';
import { normal } from '../../../src/lib/distributions/index.ts';
import {
  bernoulliLogLikelihood,
  compoundPoissonMoments,
  conjugateMean,
  conjugateUpdate,
  continuityCorrection,
  EXPONENTIAL_FAMILIES,
  mixtureDensity,
  mixtureMoments,
  sampleCompoundPoisson,
  sampleMixture,
  subGaussianBound,
} from '../../../src/lib/distributions/families.ts';
import { Random } from '../../../src/lib/random/index.ts';

const derivative = (f: (x: number) => number, x: number, h = 1e-4) =>
  (f(x + h) - f(x - h)) / (2 * h);

describe('familia exponencial', () => {
  for (const family of Object.values(EXPONENTIAL_FAMILIES)) {
    it(`A'(η) es la media y A''(η) la varianza en ${family.label}`, () => {
      const eta = (family.etaRange[0] + family.etaRange[1]) / 2;
      expect(derivative(family.logPartition, eta)).toBeCloseTo(family.mean(eta), 5);
      expect(derivative((e) => derivative(family.logPartition, e), eta, 1e-3)).toBeCloseTo(
        family.variance(eta),
        3,
      );
    });

    it(`la densidad suma uno en ${family.label}`, () => {
      const eta = family.etaRange[0] * 0.3 + family.etaRange[1] * 0.7;
      let total: number;
      if (family.discrete) {
        total = 0;
        for (let k = 0; k <= 200; k += 1) total += family.density(k, eta);
      } else {
        total = simpson((x) => family.density(x, eta), family.id === 'normal' ? -30 : 0, 60, 6000);
      }
      expect(total).toBeCloseTo(1, 6);
    });
  }

  it('reproduce los parámetros usuales', () => {
    expect(EXPONENTIAL_FAMILIES.bernoulli.usual(0).value).toBeCloseTo(0.5, 12);
    expect(EXPONENTIAL_FAMILIES.poisson.usual(Math.log(4)).value).toBeCloseTo(4, 12);
    expect(EXPONENTIAL_FAMILIES.exponencial.usual(-2).value).toBe(2);
  });
});

describe('suficiencia', () => {
  it('la verosimilitud de Bernoulli solo depende del número de éxitos', () => {
    const a = [1, 0, 0, 1, 1, 0, 0, 0];
    const b = [0, 0, 0, 0, 0, 1, 1, 1];
    for (const p of [0.2, 0.5, 0.8]) {
      expect(bernoulliLogLikelihood(a, p)).toBeCloseTo(bernoulliLogLikelihood(b, p), 12);
    }
  });
});

describe('conjugación', () => {
  it('actualiza beta con ensayos de Bernoulli', () => {
    const posterior = conjugateUpdate('beta-bernoulli', { a: 2, b: 2 }, [1, 1, 0, 1]);
    expect(posterior).toEqual({ a: 5, b: 3 });
    expect(conjugateMean('beta-bernoulli', posterior)).toBeCloseTo(0.625, 12);
  });

  it('actualiza gamma con conteos de Poisson', () => {
    expect(conjugateUpdate('gamma-poisson', { a: 3, b: 1 }, [2, 4, 3])).toEqual({ a: 12, b: 4 });
  });

  it('combina precisiones en el modelo normal', () => {
    const posterior = conjugateUpdate('normal-normal', { a: 0, b: 4 }, [2, 2, 2, 2], 1);
    // Precision 1/4 + 4 = 4.25; mean (0 + 8) / 4.25.
    expect(posterior.b).toBeCloseTo(1 / 4.25, 12);
    expect(posterior.a).toBeCloseTo(8 / 4.25, 12);
  });
});

describe('mezclas', () => {
  const components = [
    { weight: 0.3, mean: -2, sd: 1 },
    { weight: 0.7, mean: 1, sd: 0.5 },
  ];

  it('tiene densidad que integra uno', () => {
    expect(simpson((x) => mixtureDensity(components, x), -12, 12, 4000)).toBeCloseTo(1, 8);
  });

  it('descompone la varianza en dentro y entre componentes', () => {
    const m = mixtureMoments(components);
    expect(m.mean).toBeCloseTo(0.3 * -2 + 0.7 * 1, 12);
    expect(m.within).toBeCloseTo(0.3 + 0.7 * 0.25, 12);
    expect(m.between).toBeCloseTo(0.3 * (-2 - 0.1) ** 2 + 0.7 * (1 - 0.1) ** 2, 12);
    const random = new Random(4);
    const draws = Array.from({ length: 40000 }, () => sampleMixture(random, components).value);
    const mean = draws.reduce((s, x) => s + x, 0) / draws.length;
    const variance = draws.reduce((s, x) => s + (x - mean) ** 2, 0) / draws.length;
    expect(mean).toBeCloseTo(m.mean, 1);
    expect(variance).toBeCloseTo(m.variance, 1);
  });
});

describe('Poisson compuesta', () => {
  it('reproduce media, varianza y la masa en cero', () => {
    const moments = compoundPoissonMoments(3, 2, 0.5);
    expect(moments.mean).toBeCloseTo(12, 12);
    expect(moments.variance).toBeCloseTo(3 * 24, 12);
    const random = new Random(8);
    const draws = Array.from({ length: 40000 }, () => sampleCompoundPoisson(random, 3, 2, 0.5));
    const mean = draws.reduce((s, d) => s + d.total, 0) / draws.length;
    const zeros = draws.filter((d) => d.count === 0).length / draws.length;
    expect(mean).toBeCloseTo(12, 0);
    expect(zeros).toBeCloseTo(Math.exp(-3), 2);
  });
});

describe('corrección por continuidad', () => {
  it('mejora la aproximación normal de la binomial', () => {
    const c = continuityCorrection(20, 0.5, 8, 12);
    expect(c.exact).toBeCloseTo(0.7368, 4);
    expect(Math.abs(c.corrected - c.exact)).toBeLessThan(Math.abs(c.plain - c.exact));
  });
});

describe('subgaussianas', () => {
  it('acota la cola de la normal', () => {
    for (const t of [0.5, 1, 2, 3]) {
      const tail = 2 * (1 - normal(0, 1).cdf(t));
      expect(subGaussianBound(t, 1)).toBeGreaterThanOrEqual(tail);
    }
    expect(subGaussianBound(0, 1)).toBe(1);
  });
});
