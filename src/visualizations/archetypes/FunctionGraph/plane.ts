import { scaleLinear, type ScaleLinear } from 'd3-scale';
import type { ChartBox } from '../../core/svg/chartBox.ts';

export interface Plane {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
}

/** Share of the window added around the content so curves do not touch the border. */
const PADDING = 0.08;

/** Interval that contains the given values and the origin, with a margin. */
export function viewInterval(values: readonly number[]): [number, number] {
  const finite = values.filter(Number.isFinite);
  const low = Math.min(0, ...finite);
  const high = Math.max(0, ...finite);
  const pad = Math.max(0.5, (high - low) * PADDING);
  return [low - pad, high + pad];
}

/**
 * Linear scales for a Cartesian plane. With `equal`, one unit has the same
 * length on both axes, which keeps reflections and circles undistorted.
 */
export function planeScales(
  box: ChartBox,
  xDomain: [number, number],
  yDomain: [number, number],
  equal = false,
): Plane {
  const { left, top, width, height } = box.inner;
  if (!equal) {
    return {
      x: scaleLinear()
        .domain(xDomain)
        .range([left, left + width]),
      y: scaleLinear()
        .domain(yDomain)
        .range([top + height, top]),
    };
  }
  const unit = Math.min(width / (xDomain[1] - xDomain[0]), height / (yDomain[1] - yDomain[0]));
  const xCenter = (xDomain[0] + xDomain[1]) / 2;
  const yCenter = (yDomain[0] + yDomain[1]) / 2;
  const halfWidth = width / unit / 2;
  const halfHeight = height / unit / 2;
  return {
    x: scaleLinear()
      .domain([xCenter - halfWidth, xCenter + halfWidth])
      .range([left, left + width]),
    y: scaleLinear()
      .domain([yCenter - halfHeight, yCenter + halfHeight])
      .range([top + height, top]),
  };
}
