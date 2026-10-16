import {
  makePmf,
  findVariable,
  pmfOfVariable,
  rawMoment,
  variablesFor,
  type FinitePmf,
} from '../../../lib/probability/randomVariable.ts';
import type { Distribution } from '../../../lib/distributions/index.ts';
import { DISTRIBUTION_SPECS, specValues } from '../../shared/distributionSpecs.ts';
import { plotWindow } from '../../shared/plotWindow.ts';
import type { RandomVariableLabConfig } from './schema.ts';

/** Number of cells used to approximate a continuous distribution by a fine discrete one. */
const CONTINUOUS_CELLS = 160;
/** Tail probability left out of the grid on each side. */
const TAIL = 1e-7;
/** Upper bound on extra cells per tail, for heavy-tailed distributions. */
const MAX_TAIL_CELLS = 4000;

export interface VariableSource {
  pmf: FinitePmf;
  /** Spanish description of the variable. */
  label: string;
  /** Symbol used in formulas. */
  symbol: string;
  /** True when the pmf approximates a density on a fine grid. */
  continuous: boolean;
  /** Width of each cell for continuous sources; densities are probs / width. */
  cell: number;
  domain: [number, number];
  /** The exact distribution when the source is a catalog distribution, for exact cdf, quantiles and moments. */
  exact?: Distribution;
}

/**
 * Selector over the variables of the configured experiment, restricted to
 * `variables` when given. Empty when the source is not an experiment or only
 * one variable is offered.
 */
export function variableSelect(config: RandomVariableLabConfig, always = false) {
  if (!config.experimento) return [];
  const allowed =
    config.variables ?? variablesFor(config.experimento).map((variable) => variable.id);
  const options = variablesFor(config.experimento)
    .filter((variable) => allowed.includes(variable.id))
    .map((variable) => ({ value: variable.id, label: variable.label }));
  if (options.length < 2 && !always) return [];
  return [
    {
      type: 'select' as const,
      key: 'variable',
      label: 'Variable aleatoria',
      options,
      default: config.variable ?? options[0]?.value ?? '',
    },
  ];
}

/** Step for sliders over a continuous window: about 1/100 of its width, rounded to 1, 2 or 5 times a power of ten. */
export function niceStep(width: number): number {
  const raw = width / 100;
  const power = 10 ** Math.floor(Math.log10(raw));
  const scaled = raw / power;
  return (scaled < 1.5 ? 1 : scaled < 3.5 ? 2 : 5) * power;
}

/**
 * Resolves the configured source into a finite pmf. Continuous distributions
 * are replaced by the probabilities of a fine grid of cells, which keeps
 * every summary (mean, variance, moments) within a small fraction of the
 * exact value while letting the same views handle both kinds.
 */
export function resolveSource(
  config: RandomVariableLabConfig,
  variableId?: string,
): VariableSource {
  if (config.experimento) {
    const variable = findVariable(config.experimento, variableId ?? config.variable ?? '');
    const pmf = variable ? pmfOfVariable(config.experimento, variable.map) : makePmf([0], [1]);
    const lo = pmf.values[0] ?? 0;
    const hi = pmf.values.at(-1) ?? 0;
    return {
      pmf,
      label: variable?.label ?? '',
      symbol: variable?.symbol ?? 'X',
      continuous: false,
      cell: 1,
      domain: [lo - 0.5, hi + 0.5],
    };
  }
  if (config.valores) {
    const pmf = makePmf(config.valores, config.probabilidades ?? config.valores.map(() => 1));
    const lo = pmf.values[0] ?? 0;
    const hi = pmf.values.at(-1) ?? 0;
    const pad = Math.max(0.5, (hi - lo) * 0.05);
    return {
      pmf,
      label: config.nombre ?? 'la variable',
      symbol: config.simbolo ?? 'X',
      continuous: false,
      cell: 1,
      domain: [lo - pad, hi + pad],
    };
  }
  const spec = DISTRIBUTION_SPECS[config.distribucion ?? 'normal'];
  const distribution = spec.create(specValues(spec, config.parametros));
  const domain = plotWindow([distribution], spec.domain, spec.discrete);
  if (distribution.kind === 'discrete') {
    const values: number[] = [];
    for (let k = Math.ceil(domain[0]); k <= Math.floor(domain[1]); k += 1) values.push(k);
    return {
      pmf: makePmf(
        values,
        values.map((k) => distribution.pmf(k)),
      ),
      label: config.nombre ?? spec.label,
      symbol: config.simbolo ?? 'X',
      continuous: false,
      cell: 1,
      domain,
      exact: distribution,
    };
  }
  const width = (domain[1] - domain[0]) / CONTINUOUS_CELLS;
  // The grid extends into the far tails so that moments of high order are accurate; cells
  // outside the plotting window are not drawn but still count in every summary.
  const [s0, s1] = distribution.support;
  const tailLo = Math.max(Number.isFinite(s0) ? s0 : -Infinity, distribution.quantile(TAIL));
  const tailHi = Math.min(Number.isFinite(s1) ? s1 : Infinity, distribution.quantile(1 - TAIL));
  const before = Math.min(MAX_TAIL_CELLS, Math.max(0, Math.ceil((domain[0] - tailLo) / width)));
  const after = Math.min(MAX_TAIL_CELLS, Math.max(0, Math.ceil((tailHi - domain[1]) / width)));
  const start = domain[0] - before * width;
  const values = Array.from(
    { length: before + CONTINUOUS_CELLS + after },
    (_, i) => start + (i + 0.5) * width,
  );
  const probs = values.map(
    (x) => distribution.cdf(x + width / 2) - distribution.cdf(x - width / 2),
  );
  return {
    pmf: makePmf(values, probs),
    label: config.nombre ?? spec.label,
    symbol: config.simbolo ?? 'X',
    continuous: true,
    cell: width,
    domain,
    exact: distribution,
  };
}

const SIMPSON_INTERVALS = 6000;
const MOMENT_TAIL = 1e-10;

/**
 * Raw moments of orders 1 to n. For continuous catalog distributions they
 * are integrated from the exact density with Simpson's rule over the bulk of
 * the distribution, which is far more accurate than the plotting grid.
 */
export function momentsOf(source: VariableSource, n: number): number[] {
  const exact = source.exact;
  if (!exact || exact.kind !== 'continuous') {
    return Array.from({ length: n }, (_, i) => rawMoment(source.pmf, i + 1));
  }
  const [s0, s1] = exact.support;
  const lo = Math.max(s0, exact.quantile(MOMENT_TAIL));
  const hi = Math.min(s1, exact.quantile(1 - MOMENT_TAIL));
  const h = (hi - lo) / SIMPSON_INTERVALS;
  const totals = Array<number>(n).fill(0);
  for (let i = 0; i <= SIMPSON_INTERVALS; i += 1) {
    const x = lo + i * h;
    const weight = i === 0 || i === SIMPSON_INTERVALS ? 1 : i % 2 === 1 ? 4 : 2;
    const density = exact.pdf(x);
    if (!Number.isFinite(density)) continue;
    let power = 1;
    for (let k = 0; k < n; k += 1) {
      power *= x;
      totals[k] = (totals[k] ?? 0) + weight * power * density;
    }
  }
  return totals.map((total) => (total * h) / 3);
}

/** Central moment of order k from the raw moments m1..mk, by the binomial expansion of (X - m1)^k. */
export function centralFromRaw(raw: readonly number[], k: number): number {
  const m1 = raw[0] ?? 0;
  let total = 0;
  let binomial = 1;
  for (let j = 0; j <= k; j += 1) {
    const mj = j === 0 ? 1 : (raw[j - 1] ?? 0);
    total += binomial * mj * (-m1) ** (k - j);
    binomial = (binomial * (k - j)) / (j + 1);
  }
  return total;
}

/** Relative size below which a computed value is floating point noise around an exact zero. */
const ZERO_TOLERANCE = 1e-9;

/**
 * Replaces rounding noise by an exact zero, so symmetric distributions show a skewness of 0
 * instead of something like 6e-16. `scale` is the size of the terms that cancelled and
 * `tolerance` the relative accuracy of the computation that produced the value.
 */
export function snapZero(value: number, scale = 1, tolerance = ZERO_TOLERANCE): number {
  return Math.abs(value) < tolerance * Math.max(1, Math.abs(scale)) ? 0 : value;
}
