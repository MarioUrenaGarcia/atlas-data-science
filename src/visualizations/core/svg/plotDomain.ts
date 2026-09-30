import { sampleSegments } from '../../../lib/calculus/catalog.ts';
import type { RealFunction } from '../../../lib/calculus/index.ts';

const SAMPLES = 400;
/** Robust range: ignore the most extreme values so poles do not flatten the rest. */
const LOW_QUANTILE = 0.03;
const HIGH_QUANTILE = 0.97;
const PADDING = 0.12;

export interface PlotCurve {
  f: RealFunction;
  color: string;
  width?: number;
  dashed?: boolean;
  /** Restricts the curve to part of the x domain. */
  from?: number;
  to?: number;
  /** x values where the curve jumps; the plot leaves a gap there instead of a vertical segment. */
  breaks?: readonly number[];
}

/** Gap left on each side of a break, as a fraction of the plotted width. */
const BREAK_GAP = 1e-6;

/** Polylines of a curve, cut at its declared breaks and wherever it is undefined or jumps. */
export function curveSegments(
  curve: PlotCurve,
  xDomain: [number, number],
  samples: number,
  jump: number,
): { x: number; y: number }[][] {
  const a = curve.from ?? xDomain[0];
  const b = curve.to ?? xDomain[1];
  const gap = (b - a) * BREAK_GAP;
  const cuts = [...(curve.breaks ?? [])].filter((c) => c > a && c < b).sort((p, q) => p - q);
  const edges = [a, ...cuts, b];
  const pieces: { x: number; y: number }[][] = [];
  for (let i = 0; i < edges.length - 1; i += 1) {
    const lo = (edges[i] ?? a) + (i > 0 ? gap : 0);
    const hi = (edges[i + 1] ?? b) - (i < edges.length - 2 ? gap : 0);
    const share = Math.max(8, Math.round((samples * (hi - lo)) / (b - a || 1)));
    pieces.push(...sampleSegments(curve.f, lo, hi, share, jump));
  }
  return pieces;
}

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const index = Math.min(sorted.length - 1, Math.max(0, Math.round(q * (sorted.length - 1))));
  return sorted[index] ?? 0;
}

/** Vertical range that shows the curves and the x axis, ignoring spikes near poles. */
export function autoYDomain(
  curves: readonly PlotCurve[],
  xDomain: [number, number],
): [number, number] {
  const values: number[] = [];
  for (const curve of curves) {
    const a = curve.from ?? xDomain[0];
    const b = curve.to ?? xDomain[1];
    for (let i = 0; i <= SAMPLES; i += 1) {
      const y = curve.f(a + ((b - a) * i) / SAMPLES);
      if (Number.isFinite(y)) values.push(y);
    }
  }
  values.sort((p, q) => p - q);
  const lo = Math.min(0, quantile(values, LOW_QUANTILE));
  const hi = Math.max(0, quantile(values, HIGH_QUANTILE));
  const span = hi - lo || 1;
  return [lo - PADDING * span, hi + PADDING * span];
}
