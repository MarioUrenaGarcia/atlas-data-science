import { simulateMissing, type MissingPoint } from '../../../lib/dataprep/missing.ts';
import { Random } from '../../../lib/random/index.ts';
import type { MechanismId } from './schema.ts';

/** Shared scenario of the missing-data views: age (always observed) and monthly income. */
export const SCENARIO = {
  xName: 'Edad',
  xUnit: 'años',
  yName: 'Ingreso mensual',
  yUnit: 'miles de pesos',
  meanX: 40,
  sdX: 10,
  meanY: 18,
  sdY: 6,
  rho: 0.6,
};

export const MECHANISM_LABELS: Record<MechanismId, string> = {
  MCAR: 'MCAR: completamente al azar',
  MAR: 'MAR: depende de la edad (observada)',
  MNAR: 'MNAR: depende del propio ingreso',
};

export interface MissingDataSpec {
  mechanism: MechanismId;
  rate: number;
  strength: number;
  n: number;
  seed: number;
}

export function scenarioPoints(spec: MissingDataSpec): MissingPoint[] {
  return simulateMissing(
    {
      n: spec.n,
      rho: SCENARIO.rho,
      meanX: SCENARIO.meanX,
      sdX: SCENARIO.sdX,
      meanY: SCENARIO.meanY,
      sdY: SCENARIO.sdY,
      mechanism: spec.mechanism,
      rate: spec.rate,
      strength: spec.strength,
    },
    new Random(spec.seed),
  );
}

/** Padded domain of a list of values. */
export function padded(values: readonly number[], fraction = 0.08): [number, number] {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = (hi - lo || 1) * fraction;
  return [lo - pad, hi + pad];
}

/** Share of spending values deleted completely at random in the three-variable table. */
const SPENDING_MISSING = 0.15;

/**
 * Three-column table for chained equations: age (complete), income (missing
 * by the chosen mechanism) and spending, which depends on income and loses
 * some values at random.
 */
export function threeColumnTable(points: readonly MissingPoint[], seed: number): number[][] {
  const random = new Random(seed + 7);
  return points.map((p) => {
    const spending = 2 + 0.4 * p.y + random.normal(0, 1.5);
    return [
      p.x,
      p.missing ? Number.NaN : p.y,
      random.next() < SPENDING_MISSING ? Number.NaN : spending,
    ];
  });
}
