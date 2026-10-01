import { describe, expect, it } from 'vitest';
import {
  conditionalNormal,
  covariance2,
  dirichletMoments,
  dirichletPdf,
  ellipsePoints,
  inverseWishartMean,
  lkjMarginalPdf,
  lkjMarginalShape,
  mahalanobis2,
  mvnPdf,
  mvtPdf,
  normalEllipseLevel,
  principalAxes,
  sampleCovariance,
  sampleDirichlet,
  sampleInverseWishart,
  sampleLkj,
  sampleMvn,
  sampleMvt,
  sampleWishart,
  wishartMean,
} from '../../../src/lib/distributions/multivariate.ts';
import { Random } from '../../../src/lib/random/index.ts';
import { simpson } from '../../../src/lib/calculus/index.ts';

const SIGMA = covariance2(2, 1, 0.6);
const MU = [1, -1];

describe('normal multivariada', () => {
  it('evalúa la densidad estándar en el origen', () => {
    expect(mvnPdf([0, 0], [0, 0], covariance2(1, 1, 0))).toBeCloseTo(1 / (2 * Math.PI), 10);
  });

  it('calcula la distancia de Mahalanobis', () => {
    // With rho = 0.6, sigma1 = 2, sigma2 = 1: Sigma^{-1} = [[0.390625, -0.46875], [-0.46875, 1.5625]].
    expect(mahalanobis2([3, 0], MU, SIGMA)).toBeCloseTo(
      4 * 0.390625 - 2 * 2 * 0.46875 + 1.5625,
      10,
    );
  });

  it('reproduce media y covarianza en muestras grandes', () => {
    const random = new Random(11);
    const points = Array.from({ length: 40000 }, () => sampleMvn(random, MU, SIGMA));
    const mean = [0, 1].map((i) => points.reduce((s, p) => s + (p[i] ?? 0), 0) / points.length);
    expect(mean[0]).toBeCloseTo(1, 1);
    expect(mean[1]).toBeCloseTo(-1, 1);
    const cov = sampleCovariance(points);
    expect(cov[0]?.[0]).toBeCloseTo(4, 1);
    expect(cov[0]?.[1]).toBeCloseTo(1.2, 1);
    expect(cov[1]?.[1]).toBeCloseTo(1, 1);
  });

  it('cubre la probabilidad q con la elipse de nivel -2 log(1 - q)', () => {
    const random = new Random(5);
    const c = normalEllipseLevel(0.9);
    let inside = 0;
    for (let i = 0; i < 20000; i += 1) {
      if (mahalanobis2(sampleMvn(random, MU, SIGMA), MU, SIGMA) <= c) inside += 1;
    }
    expect(inside / 20000).toBeCloseTo(0.9, 2);
  });

  it('traza la elipse sobre la curva de nivel', () => {
    for (const point of ellipsePoints(MU, SIGMA, 2.5, 24)) {
      expect(mahalanobis2(point, MU, SIGMA)).toBeCloseTo(2.5, 8);
    }
  });

  it('obtiene ejes principales ortonormales', () => {
    const { values, vectors } = principalAxes(SIGMA);
    expect(values[0] + values[1]).toBeCloseTo(5, 10);
    expect(values[0] * values[1]).toBeCloseTo(4 - 1.44, 10);
    const [v1, v2] = vectors;
    expect((v1[0] ?? 0) * (v2[0] ?? 0) + (v1[1] ?? 0) * (v2[1] ?? 0)).toBeCloseTo(0, 10);
    // Sigma v1 = lambda1 v1.
    const s = SIGMA;
    expect((s[0]?.[0] ?? 0) * (v1[0] ?? 0) + (s[0]?.[1] ?? 0) * (v1[1] ?? 0)).toBeCloseTo(
      values[0] * (v1[0] ?? 0),
      10,
    );
  });

  it('da la condicional de X2 dado X1', () => {
    const conditional = conditionalNormal(MU, SIGMA, 3);
    expect(conditional.mean).toBeCloseTo(-1 + (1.2 / 4) * 2, 10);
    expect(conditional.variance).toBeCloseTo(1 - 0.36, 10);
  });
});

describe('t multivariada', () => {
  it('evalúa la densidad en el centro', () => {
    const sigma = covariance2(1, 1, 0.3);
    // Gamma(3) / (Gamma(2) nu pi sqrt(det)) with nu = 4 and det = 0.91.
    expect(mvtPdf([0, 0], [0, 0], sigma, 4)).toBeCloseTo(2 / (4 * Math.PI * Math.sqrt(0.91)), 10);
  });

  it('integra uno en coordenadas polares', () => {
    const identity = covariance2(1, 1, 0);
    const radial = (r: number) => 2 * Math.PI * r * mvtPdf([r, 0], [0, 0], identity, 4);
    expect(simpson(radial, 0, 400, 20000)).toBeCloseTo(1, 3);
  });

  it('tiene covarianza nu/(nu - 2) Sigma', () => {
    const random = new Random(3);
    const points = Array.from({ length: 60000 }, () => sampleMvt(random, [0, 0], SIGMA, 6));
    const cov = sampleCovariance(points);
    expect(cov[0]?.[0]).toBeCloseTo(4 * 1.5, 0);
    expect((cov[0]?.[1] ?? 0) / 1.5).toBeCloseTo(1.2, 0);
  });
});

describe('Dirichlet', () => {
  it('es uniforme en el símplex con parámetros 1', () => {
    expect(dirichletPdf([0.2, 0.3, 0.5], [1, 1, 1])).toBeCloseTo(2, 10);
  });

  it('reproduce media y varianza', () => {
    const alpha = [2, 3, 5];
    const random = new Random(7);
    const draws = Array.from({ length: 30000 }, () => sampleDirichlet(random, alpha));
    const { mean, variance } = dirichletMoments(alpha);
    expect(mean).toEqual([0.2, 0.3, 0.5]);
    expect(variance[0]).toBeCloseTo((0.2 * 0.8) / 11, 10);
    const m0 = draws.reduce((s, d) => s + (d[0] ?? 0), 0) / draws.length;
    expect(m0).toBeCloseTo(0.2, 2);
    for (const d of draws.slice(0, 50)) expect(d.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
  });
});

describe('Wishart', () => {
  it('tiene media nu V', () => {
    const random = new Random(9);
    const total = [
      [0, 0],
      [0, 0],
    ];
    const n = 5000;
    for (let i = 0; i < n; i += 1) {
      const w = sampleWishart(random, 5, SIGMA);
      for (let r = 0; r < 2; r += 1)
        for (let c = 0; c < 2; c += 1) {
          const row = total[r];
          if (row) row[c] = (row[c] ?? 0) + (w[r]?.[c] ?? 0) / n;
        }
    }
    const mean = wishartMean(5, SIGMA);
    expect(total[0]?.[0]).toBeCloseTo(mean[0]?.[0] ?? 0, 0);
    expect(total[0]?.[1]).toBeCloseTo(mean[0]?.[1] ?? 0, 0);
  });

  it('tiene media Psi/(nu - d - 1) en la inversa', () => {
    const random = new Random(13);
    const psi = covariance2(1, 1, 0.5);
    let sum = 0;
    const n = 20000;
    for (let i = 0; i < n; i += 1) sum += (sampleInverseWishart(random, 8, psi)[0]?.[0] ?? 0) / n;
    expect(sum).toBeCloseTo(1 / 5, 1);
    expect(inverseWishartMean(3, psi)).toBeNull();
  });
});

describe('LKJ', () => {
  it('produce matrices de correlación válidas', () => {
    const random = new Random(17);
    for (let i = 0; i < 200; i += 1) {
      const r = sampleLkj(random, 4, 1.5);
      for (let j = 0; j < 4; j += 1) expect(r[j]?.[j]).toBe(1);
      expect(r[0]?.[2]).toBe(r[2]?.[0]);
      // Positive definite: the C-vine construction always yields one.
      const { values } = principalAxes([
        [1, r[1]?.[3] ?? 0],
        [r[1]?.[3] ?? 0, 1],
      ]);
      expect(values[1]).toBeGreaterThan(0);
    }
  });

  it('tiene marginal Beta(b, b) en (-1, 1) con b = eta - 1 + d/2', () => {
    expect(lkjMarginalShape(3, 2)).toBe(2.5);
    expect(simpson((r) => lkjMarginalPdf(r, 3, 2), -1, 1, 400)).toBeCloseTo(1, 4);
    const random = new Random(19);
    const values = Array.from({ length: 20000 }, () => sampleLkj(random, 3, 2)[1]?.[2] ?? 0);
    const variance = values.reduce((s, v) => s + v * v, 0) / values.length;
    // Var of 2B - 1 with B ~ Beta(b, b) is 1/(2b + 1).
    expect(variance).toBeCloseTo(1 / 6, 2);
  });
});
