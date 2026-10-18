import { scaleLinear } from 'd3-scale';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';

const STRIP_HEIGHT = 92;
const POINT_RADIUS = 7;

interface SampleStripProps {
  /** The current sample, sorted. */
  values: readonly number[];
  domain: [number, number];
  /** Color of the point of each rank (1-based). */
  color: (rank: number) => string;
  label: string;
}

/**
 * The latest sample on a number line, sorted, with each point labeled by its
 * rank: the k-th point from the left is the k-th order statistic.
 */
export function SampleStrip({ values, domain, color, label }: SampleStripProps) {
  return (
    <ChartSvg
      label={label}
      aspect={0.12}
      minHeight={STRIP_HEIGHT}
      maxHeight={STRIP_HEIGHT}
      margins={{ top: 22, right: 20, bottom: 32, left: 52 }}
    >
      {(box) => {
        const x = scaleLinear()
          .domain(domain)
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const mid = box.inner.top + box.inner.height / 2;
        const showRanks = values.length <= 12;
        return (
          <>
            <Axis
              scale={x}
              orientation="bottom"
              position={box.inner.top + box.inner.height}
              ticks={6}
            />
            <g aria-hidden="true">
              <line
                x1={box.inner.left}
                x2={box.inner.left + box.inner.width}
                y1={mid}
                y2={mid}
                stroke={DATA_COLORS.grid}
              />
              {values.map((value, i) => {
                if (value < domain[0] || value > domain[1]) return null;
                return (
                  <g key={i}>
                    <circle
                      cx={x(value)}
                      cy={mid}
                      r={POINT_RADIUS}
                      fill={color(i + 1)}
                      fillOpacity={0.85}
                    />
                    {showRanks && (
                      <text
                        x={x(value)}
                        y={mid - POINT_RADIUS - 4}
                        textAnchor="middle"
                        fontSize={10}
                        fill={DATA_COLORS.text}
                      >
                        {i + 1}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </>
        );
      }}
    </ChartSvg>
  );
}
