import { scaleLinear, type ScaleLinear } from 'd3-scale';
import { useId, type ReactNode } from 'react';
import type { Point2 } from '../../../lib/multivariable/index.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';

const MIN_HEIGHT = 240;
const MAX_HEIGHT = 440;
const MARGINS = { top: 10, right: 12, bottom: 34, left: 40 };

export interface MapScales {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
  /** Pixels per unit, the same on both axes. */
  unit: number;
}

export interface PlaneBox extends MapScales {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface EqualPlaneProps {
  domain: [Point2, Point2];
  label: string;
  xLabel?: string;
  yLabel?: string;
  interactive?: boolean;
  /** Drawn under the children, clipped to the domain. */
  background?: (box: PlaneBox) => ReactNode;
  children?: (scales: MapScales) => ReactNode;
}

/**
 * A plane with the same scale on both axes, so angles, circles and areas are
 * drawn without distortion. Everything inside is clipped to the domain.
 */
export function EqualPlane({
  domain,
  label,
  xLabel = 'x',
  yLabel = 'y',
  interactive = false,
  background,
  children,
}: EqualPlaneProps) {
  const clipId = `plane-${useId().replace(/:/g, '')}`;
  const [[x0, x1], [y0, y1]] = domain;
  return (
    <ChartSvg
      label={label}
      interactive={interactive}
      aspect={(y1 - y0) / (x1 - x0)}
      minHeight={MIN_HEIGHT}
      maxHeight={MAX_HEIGHT}
      margins={MARGINS}
    >
      {(box) => {
        // Fit the domain inside the box with one scale and center it.
        const unit = Math.min(box.inner.width / (x1 - x0), box.inner.height / (y1 - y0));
        const width = unit * (x1 - x0);
        const height = unit * (y1 - y0);
        const left = box.inner.left + (box.inner.width - width) / 2;
        const top = box.inner.top + (box.inner.height - height) / 2;
        const x = scaleLinear()
          .domain([x0, x1])
          .range([left, left + width]);
        const y = scaleLinear()
          .domain([y0, y1])
          .range([top + height, top]);
        return (
          <>
            <Axis scale={x} orientation="bottom" position={top + height} ticks={6} label={xLabel} />
            <Axis scale={y} orientation="left" position={left} ticks={5} label={yLabel} />
            <clipPath id={clipId}>
              <rect x={left} y={top} width={width} height={height} />
            </clipPath>
            <g clipPath={`url(#${clipId})`}>
              {background?.({ x, y, unit, left, top, width, height })}
              {children?.({ x, y, unit })}
            </g>
          </>
        );
      }}
    </ChartSvg>
  );
}
