import { describe, expect, it } from 'vitest';
import {
  IMPROPER_CASES,
  LIMIT_CASES,
  PARTS_CASES,
  QUOTIENT_CASES,
  SUBSTITUTION_CASES,
} from '../../../src/lib/calculus/cases.ts';
import { derivative, integrate } from '../../../src/lib/calculus/index.ts';

const NEAR = 1e-6;

describe('limit cases', () => {
  for (const c of Object.values(LIMIT_CASES)) {
    it(`${c.id}: one-sided values approach the stated limits`, () => {
      const check = (limit: number, value: number) => {
        if (Number.isNaN(limit)) return;
        if (limit === Infinity) expect(value).toBeGreaterThan(1e5);
        else if (limit === -Infinity) expect(value).toBeLessThan(-1e5);
        else expect(value).toBeCloseTo(limit, 4);
      };
      check(c.left, c.f(c.point - NEAR));
      check(c.right, c.f(c.point + NEAR));
      if (!Number.isNaN(c.value)) expect(c.f(c.point)).toBeCloseTo(c.value, 10);
    });
  }
});

describe('quotient cases', () => {
  for (const c of Object.values(QUOTIENT_CASES)) {
    it(`${c.id}: is 0/0 and both quotients tend to the limit`, () => {
      expect(c.f(c.point)).toBeCloseTo(0, 10);
      expect(c.g(c.point)).toBeCloseTo(0, 10);
      const x = c.point + 1e-5;
      expect(c.f(x) / c.g(x)).toBeCloseTo(c.limit, 3);
      expect(c.df(x) / c.dg(x)).toBeCloseTo(c.limit, 3);
      expect(c.df(x)).toBeCloseTo(derivative(c.f, x), 5);
      expect(c.dg(x)).toBeCloseTo(derivative(c.g, x), 5);
    });
  }
});

describe('substitution cases', () => {
  for (const c of Object.values(SUBSTITUTION_CASES)) {
    it(`${c.id}: both integrals agree`, () => {
      expect(integrate(c.h, c.a, c.b)).toBeCloseTo(integrate(c.k, c.g(c.a), c.g(c.b)), 8);
    });
  }
});

describe('integration by parts cases', () => {
  for (const c of Object.values(PARTS_CASES)) {
    it(`${c.id}: the integral of u dv plus v du is the change of uv`, () => {
      const udv = integrate((t) => c.u(t) * c.dv(t), c.a, c.b);
      const vdu = integrate((t) => c.v(t) * c.du(t), c.a, c.b);
      const change = c.u(c.b) * c.v(c.b) - c.u(c.a) * c.v(c.a);
      expect(udv + vdu).toBeCloseTo(change, 8);
    });
  }
});

describe('improper cases', () => {
  for (const c of Object.values(IMPROPER_CASES)) {
    it(`${c.id}: antiderivative and value are consistent`, () => {
      expect(derivative(c.F, 2)).toBeCloseTo(c.f(2), 6);
      const partial = c.kind === 'infinito' ? c.F(1e8) - c.F(c.a) : c.F(c.a) - c.F(1e-12);
      if (Number.isFinite(c.value)) expect(partial).toBeCloseTo(c.value, 4);
      else expect(partial).toBeGreaterThan(15);
    });
  }
});
