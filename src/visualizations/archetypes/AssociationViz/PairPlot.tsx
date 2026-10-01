import { scaleLinear, type ScaleLinear } from 'd3-scale';
import type { ReactNode } from 'react';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';

export interface PairScales {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface PairPlotProps {
  xDomain: [number, number];
  yDomain: [number, number];
  xLabel: string;
  yLabel: string;
  label: string;
  interactive?: boolean;
  aspect?: number;
  children: (scales: PairScales) => ReactNode;
}

/** Scatter plot frame with axes; children draw the marks with the scales. */
export function PairPlot({
  xDomain,
  yDomain,
  xLabel,
  yLabel,
  label,
  interactive = false,
  aspect = 0.62,
  children,
}: PairPlotProps) {
  return (
    <ChartSvg
      label={label}
      interactive={interactive}
      aspect={aspect}
      minHeight={260}
      maxHeight={460}
      margins={{ top: 16, right: 20, bottom: 46, left: 58 }}
    >
      {(box) => {
        const left = box.inner.left;
        const right = box.inner.left + box.inner.width;
        const top = box.inner.top;
        const bottom = box.inner.top + box.inner.height;
        const x = scaleLinear().domain(xDomain).range([left, right]);
        const y = scaleLinear().domain(yDomain).range([bottom, top]);
        return (
          <g>
            <Axis
              scale={y}
              orientation="left"
              position={left}
              gridLength={box.inner.width}
              ticks={6}
              label={yLabel}
            />
            <Axis scale={x} orientation="bottom" position={bottom} ticks={7} label={xLabel} />
            {children({ x, y, left, right, top, bottom })}
          </g>
        );
      }}
    </ChartSvg>
  );
}
