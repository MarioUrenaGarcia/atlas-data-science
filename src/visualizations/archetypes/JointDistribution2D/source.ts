import {
  discretizeDensity,
  jointFromExperiment,
  jointModel,
  makeJoint,
  type BivariateNormalParameters,
  type JointPmf,
} from '../../../lib/probability/joint.ts';
import { findVariable } from '../../../lib/probability/randomVariable.ts';
import type { JointDistribution2DConfig } from './schema.ts';

/** Cells per axis when a joint density is discretized for drawing and summing. */
export const DENSITY_GRID = 60;

export interface JointSource {
  joint: JointPmf;
  /** True when the table approximates a joint density on a grid of cells. */
  continuous: boolean;
  /** Width of the cells along each axis (1 for discrete tables). */
  cellX: number;
  cellY: number;
  labelX: string;
  labelY: string;
  symbolX: string;
  symbolY: string;
  /** Plotting windows; for discrete tables they extend half a step beyond the values. */
  xDomain: [number, number];
  yDomain: [number, number];
  /** LaTeX of the model density, for continuous sources. */
  tex?: string;
}

/** Normal parameters from the configuration, with an optional override of the correlation and spreads. */
export function normalParameters(
  config: JointDistribution2DConfig,
  override: Partial<BivariateNormalParameters> = {},
): BivariateNormalParameters {
  const p = config.parametros ?? {};
  return {
    muX: override.muX ?? p.muX ?? 0,
    muY: override.muY ?? p.muY ?? 0,
    sigmaX: override.sigmaX ?? p.sigmaX ?? 1,
    sigmaY: override.sigmaY ?? p.sigmaY ?? 1,
    rho: override.rho ?? p.rho ?? 0.6,
  };
}

function discreteDomain(values: readonly number[]): [number, number] {
  const sorted = [...values].sort((a, b) => a - b);
  const steps = sorted.slice(1).map((value, i) => value - (sorted[i] ?? value));
  const step = steps.length > 0 ? Math.min(...steps) : 1;
  return [(sorted[0] ?? 0) - step / 2, (sorted.at(-1) ?? 0) + step / 2];
}

/** Resolves the configured source into a joint table with labels, symbols and windows. */
export function resolveJoint(
  config: JointDistribution2DConfig,
  override: Partial<BivariateNormalParameters> = {},
): JointSource {
  if (config.experimento) {
    const vx = findVariable(config.experimento, config.variable ?? 'primero');
    const vy = findVariable(config.experimento, config.segunda ?? 'segundo');
    const joint = jointFromExperiment(
      config.experimento,
      vx?.map ?? (() => 0),
      vy?.map ?? (() => 0),
    );
    const sameSymbol = vx?.symbol === vy?.symbol;
    return {
      joint,
      continuous: false,
      cellX: 1,
      cellY: 1,
      labelX: vx?.label ?? 'X',
      labelY: vy?.label ?? 'Y',
      symbolX: sameSymbol ? `${vx?.symbol ?? 'X'}_1` : (vx?.symbol ?? 'X'),
      symbolY: sameSymbol ? `${vy?.symbol ?? 'Y'}_2` : (vy?.symbol ?? 'Y'),
      xDomain: discreteDomain(joint.xs),
      yDomain: discreteDomain(joint.ys),
    };
  }
  if (config.probabilidades && config.valoresX && config.valoresY) {
    const joint = makeJoint(config.valoresX, config.valoresY, config.probabilidades);
    return {
      joint,
      continuous: false,
      cellX: 1,
      cellY: 1,
      labelX: config.nombreX ?? 'X',
      labelY: config.nombreY ?? 'Y',
      symbolX: config.simboloX ?? 'X',
      symbolY: config.simboloY ?? 'Y',
      xDomain: discreteDomain(joint.xs),
      yDomain: discreteDomain(joint.ys),
    };
  }
  const model = jointModel(
    config.modelo ?? 'normal-bivariada',
    normalParameters(config, override),
    config.parametros?.lambda ?? 1,
  );
  const joint = discretizeDensity(model.density, model.xWindow, model.yWindow, DENSITY_GRID);
  return {
    joint,
    continuous: true,
    cellX: (model.xWindow[1] - model.xWindow[0]) / DENSITY_GRID,
    cellY: (model.yWindow[1] - model.yWindow[0]) / DENSITY_GRID,
    labelX: config.nombreX ?? 'X',
    labelY: config.nombreY ?? 'Y',
    symbolX: config.simboloX ?? 'X',
    symbolY: config.simboloY ?? 'Y',
    xDomain: model.xWindow,
    yDomain: model.yWindow,
    tex: model.tex,
  };
}

/** Index of the value of a sorted list closest to the target. */
export function nearestIndex(values: readonly number[], target: number): number {
  let best = 0;
  values.forEach((value, i) => {
    if (Math.abs(value - target) < Math.abs((values[best] ?? 0) - target)) best = i;
  });
  return best;
}
