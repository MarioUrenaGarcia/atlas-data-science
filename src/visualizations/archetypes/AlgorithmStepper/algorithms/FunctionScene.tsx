import { scaleLinear } from 'd3-scale';
import type { ReactNode } from 'react';
import { sampleFunction } from '../../../../lib/calculus/index.ts';
import { DATA_COLORS } from '../../../core/colors.ts';
import { Axis } from '../../../core/svg/Axis.tsx';
import { ChartSvg } from '../../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../../core/svg/CurvePath.tsx';
import type { RootFunction } from './rootFunctions.ts';

export interface FunctionScales {
  x: (value: number) => number;
  y: (value: number) => number;
  top: number;
  bottom: number;
}

interface FunctionSceneProps {
  fn: RootFunction;
  label: string;
  /** Draws algorithm-specific marks on top of the function. */
  children: (scales: FunctionScales) => ReactNode;
}

/** Plot of a real function with the x axis at y = 0, shared by root-finding algorithms. */
export function FunctionScene({ fn, label, children }: FunctionSceneProps) {
  const [lo, hi] = fn.window;
  const points = sampleFunction(fn.f, lo, hi, 300);
  const values = points.map((point) => point.y);
  const yLo = Math.min(-0.5, ...values);
  const yHi = Math.max(0.5, ...values);
  return (
    <ChartSvg label={label} aspect={0.55} minHeight={240} maxHeight={420}>
      {(box) => {
        const x = scaleLinear()
          .domain([lo, hi])
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLinear()
          .domain([yLo, yHi])
          .nice()
          .range([box.inner.top + box.inner.height, box.inner.top]);
        return (
          <>
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              ticks={5}
            />
            <Axis
              scale={x}
              orientation="bottom"
              position={box.inner.top + box.inner.height}
              ticks={8}
              label="x"
            />
            <line
              x1={box.inner.left}
              x2={box.inner.left + box.inner.width}
              y1={y(0)}
              y2={y(0)}
              stroke={DATA_COLORS.muted}
              strokeWidth={1.2}
            />
            <CurvePath
              points={points}
              xScale={x}
              yScale={y}
              color={DATA_COLORS.primary}
              width={2.5}
              animate={false}
            />
            {children({ x, y, top: box.inner.top, bottom: box.inner.top + box.inner.height })}
          </>
        );
      }}
    </ChartSvg>
  );
}
