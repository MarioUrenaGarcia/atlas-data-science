import { Random } from '../random/index.ts';

export interface SurvivalPanel {
  /** Return of each unit in each period; NaN after the unit closes. */
  returns: number[][];
  /** Accumulated value of each unit at the end of each period, starting from 1. */
  values: number[][];
  /** Period in which each unit closed, or null if it survived. */
  closed: (number | null)[];
}

export interface SurvivalSpec {
  units: number;
  periods: number;
  mean: number;
  dispersion: number;
  volatility: number;
  threshold: number;
}

/**
 * Units (funds, firms) with heterogeneous true mean returns and noisy
 * period returns. A unit closes and stops reporting when its accumulated
 * value drops below the threshold, which is how databases of survivors arise.
 */
export function simulateSurvival(spec: SurvivalSpec, random: Random): SurvivalPanel {
  const returns: number[][] = [];
  const values: number[][] = [];
  const closed: (number | null)[] = [];
  for (let u = 0; u < spec.units; u += 1) {
    const skill = random.normal(spec.mean, spec.dispersion);
    let value = 1;
    let closedAt: number | null = null;
    const r: number[] = [];
    const v: number[] = [];
    for (let t = 0; t < spec.periods; t += 1) {
      if (closedAt !== null) {
        r.push(Number.NaN);
        v.push(Number.NaN);
        continue;
      }
      const ret = Math.max(-0.95, random.normal(skill, spec.volatility));
      value *= 1 + ret;
      r.push(ret);
      v.push(value);
      if (value < spec.threshold) closedAt = t;
    }
    returns.push(r);
    values.push(v);
    closed.push(closedAt);
  }
  return { returns, values, closed };
}

/** Mean of the observed period returns up to period t, over all units or only those alive at t. */
export function meanReturn(panel: SurvivalPanel, t: number, survivorsOnly: boolean): number {
  let sum = 0;
  let count = 0;
  panel.returns.forEach((series, u) => {
    const closedAt = panel.closed[u];
    if (survivorsOnly && closedAt !== null && closedAt !== undefined && closedAt <= t) return;
    for (let s = 0; s <= t; s += 1) {
      const value = series[s];
      if (value === undefined || Number.isNaN(value)) continue;
      sum += value;
      count += 1;
    }
  });
  return count === 0 ? Number.NaN : sum / count;
}
