import { describe, expect, it } from 'vitest';
import { CURVES, CURVE_IDS, chainDerivative } from '../../../src/lib/multivariable/curves.ts';
import { FIELDS } from '../../../src/lib/multivariable/index.ts';

const H = 1e-6;

describe('curves', () => {
  it('have velocities that match a numerical derivative', () => {
    for (const id of CURVE_IDS) {
      const curve = CURVES[id];
      if (!curve) throw new Error(id);
      const t = (curve.tRange[0] + curve.tRange[1]) / 3;
      const [ax, ay] = curve.r(t - H);
      const [bx, by] = curve.r(t + H);
      const [vx, vy] = curve.velocity(t);
      expect((bx - ax) / (2 * H)).toBeCloseTo(vx, 6);
      expect((by - ay) / (2 * H)).toBeCloseTo(vy, 6);
    }
  });

  it('computes the chain rule as the derivative of f along the curve', () => {
    const field = FIELDS['dos-colinas'];
    const curve = CURVES.espiral;
    if (!field || !curve) throw new Error('missing');
    const g = (t: number) => field.f(...curve.r(t));
    const t = 2.3;
    expect(chainDerivative(field.grad, curve, t)).toBeCloseTo((g(t + H) - g(t - H)) / (2 * H), 6);
  });

  it('gives zero along a level curve: x^2 + y^2 on a circle', () => {
    const field = FIELDS.paraboloide;
    const curve = CURVES.circulo;
    if (!field || !curve) throw new Error('missing');
    expect(chainDerivative(field.grad, curve, 1.1)).toBeCloseTo(0, 12);
  });
});
