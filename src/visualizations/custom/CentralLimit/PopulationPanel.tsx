import { scaleLinear } from 'd3-scale';
import type { CltPopulation } from '../../../lib/limits/clt.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';

interface PopulationPanelProps {
  population: CltPopulation;
  label: string;
  /** Values of the last sample, drawn as ticks under the axis. */
  sample?: readonly number[];
}

const STEM_WIDTH = 3;
const SAMPLE_TICK = 8;
const MAX_TICKS = 80;

/** Small plot of the population: stems for lattice laws, a density curve otherwise. */
export function PopulationPanel({ population, label, sample = [] }: PopulationPanelProps) {
  const { start, step, masses } = population.masses;
  const points = Array.from(masses, (mass, i) => ({ x: start + i * step, y: mass }));
  const lo = start - (population.lattice ? step * 0.6 : step / 2);
  const hi = start + (masses.length - 1) * step + (population.lattice ? step * 0.6 : step / 2);
  const heights = population.lattice ? points.map((p) => p.y) : points.map((p) => p.y / step);
  const top = Math.max(...heights) * 1.12;
  return (
    <ChartSvg
      label={label}
      aspect={0.22}
      minHeight={120}
      maxHeight={170}
      margins={{ top: 8, bottom: 30 }}
    >
      {(box) => {
        const x = scaleLinear()
          .domain([lo, hi])
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLinear()
          .domain([0, top])
          .range([box.inner.top + box.inner.height, box.inner.top]);
        const base = box.inner.top + box.inner.height;
        return (
          <>
            <Axis scale={x} orientation="bottom" position={base} ticks={6} />
            {population.lattice ? (
              <g aria-hidden="true">
                {points.map((p) =>
                  p.y > 0 ? (
                    <g key={p.x}>
                      <line
                        x1={x(p.x)}
                        x2={x(p.x)}
                        y1={base}
                        y2={y(p.y)}
                        stroke={DATA_COLORS.primary}
                        strokeWidth={STEM_WIDTH}
                      />
                      <circle cx={x(p.x)} cy={y(p.y)} r={4} fill={DATA_COLORS.primary} />
                    </g>
                  ) : null,
                )}
              </g>
            ) : (
              <CurvePath
                points={points.map((p) => ({ x: p.x, y: p.y / step }))}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.primary}
                fill
                fillOpacity={0.18}
                animate={false}
              />
            )}
            <g aria-hidden="true">
              {sample.slice(0, MAX_TICKS).map((value, i) => (
                <line
                  key={i}
                  x1={x(Math.min(hi, Math.max(lo, value)))}
                  x2={x(Math.min(hi, Math.max(lo, value)))}
                  y1={base - SAMPLE_TICK}
                  y2={base}
                  stroke={DATA_COLORS.highlight}
                  strokeWidth={2}
                />
              ))}
            </g>
          </>
        );
      }}
    </ChartSvg>
  );
}
