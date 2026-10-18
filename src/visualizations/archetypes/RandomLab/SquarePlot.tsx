import { scaleLinear, type ScaleLinear } from 'd3-scale';
import type { ReactNode } from 'react';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';

export interface SquareScales {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
  size: number;
}

interface SquarePlotProps {
  domain: [number, number];
  label: string;
  xLabel: string;
  yLabel: string;
  maxHeight?: number;
  children: (scales: SquareScales) => ReactNode;
}

/** A square plotting area with equal scales on both axes, for points in a square. */
export function SquarePlot({
  domain,
  label,
  xLabel,
  yLabel,
  maxHeight = 460,
  children,
}: SquarePlotProps) {
  return (
    <ChartSvg label={label} aspect={1} maxHeight={maxHeight}>
      {(box) => {
        const size = Math.min(box.inner.width, box.inner.height);
        const left = box.inner.left + (box.inner.width - size) / 2;
        const top = box.inner.top;
        const x = scaleLinear()
          .domain(domain)
          .range([left, left + size]);
        const y = scaleLinear()
          .domain(domain)
          .range([top + size, top]);
        return (
          <>
            <Axis scale={x} orientation="bottom" position={top + size} ticks={5} label={xLabel} />
            <Axis scale={y} orientation="left" position={left} ticks={5} label={yLabel} />
            <rect
              x={left}
              y={top}
              width={size}
              height={size}
              fill="none"
              stroke="var(--color-border-strong)"
              aria-hidden="true"
            />
            {children({ x, y, size })}
          </>
        );
      }}
    </ChartSvg>
  );
}
