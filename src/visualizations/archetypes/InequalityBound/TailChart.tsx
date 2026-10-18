import { scaleLinear } from 'd3-scale';
import type { Distribution } from '../../../lib/distributions/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';

const CURVE_POINTS = 240;
const BAR_SHARE = 0.7;

export interface TailMarker {
  x: number;
  label: string;
  color: string;
  dashed?: boolean;
}

interface TailChartProps {
  distribution: Distribution;
  domain: [number, number];
  /** Values that belong to the shaded event. */
  inEvent: (x: number) => boolean;
  markers: readonly TailMarker[];
  label: string;
  xLabel: string;
}

/**
 * A distribution (density curve or probability bars) with the event of a
 * tail bound shaded, such as X >= a or |X - mu| >= k sigma, and vertical
 * markers for the mean and the thresholds.
 */
export function TailChart({
  distribution,
  domain,
  inEvent,
  markers,
  label,
  xLabel,
}: TailChartProps) {
  const [d0, d1] = domain;
  const discrete = distribution.kind === 'discrete';
  const xs = Array.from(
    { length: CURVE_POINTS + 1 },
    (_, i) => d0 + ((d1 - d0) * i) / CURVE_POINTS,
  );
  const values = discrete
    ? Array.from({ length: Math.floor(d1) - Math.ceil(d0) + 1 }, (_, i) => Math.ceil(d0) + i)
    : [];
  const height = (x: number) =>
    distribution.kind === 'discrete' ? distribution.pmf(x) : distribution.pdf(x);
  const top =
    Math.max(0.02, ...(discrete ? values.map(height) : xs.map(height)).filter(Number.isFinite)) *
    1.15;
  return (
    <ChartSvg label={label} aspect={0.4} minHeight={220} maxHeight={320}>
      {(box) => {
        const x = scaleLinear()
          .domain(domain)
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLinear()
          .domain([0, Math.min(top, 50)])
          .range([box.inner.top + box.inner.height, box.inner.top]);
        const bottom = box.inner.top + box.inner.height;
        const barWidth = Math.max(2, Math.abs(x(1) - x(0)) * BAR_SHARE);
        // The shaded event is drawn as maximal runs of grid points inside it.
        const runs: { x: number; y: number }[][] = [];
        if (!discrete) {
          let current: { x: number; y: number }[] = [];
          for (const value of xs) {
            if (inEvent(value)) current.push({ x: value, y: Math.min(height(value), top) });
            else if (current.length > 0) {
              runs.push(current);
              current = [];
            }
          }
          if (current.length > 0) runs.push(current);
        }
        return (
          <>
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              ticks={4}
              label={discrete ? 'probabilidad' : 'densidad'}
            />
            <Axis scale={x} orientation="bottom" position={bottom} ticks={6} label={xLabel} />
            {discrete ? (
              <g aria-hidden="true">
                {values.map((value) => (
                  <rect
                    key={value}
                    x={x(value) - barWidth / 2}
                    y={y(height(value))}
                    width={barWidth}
                    height={Math.max(0, bottom - y(height(value)))}
                    fill={inEvent(value) ? DATA_COLORS.highlight : DATA_COLORS.neutral}
                    fillOpacity={inEvent(value) ? 0.85 : 0.5}
                  />
                ))}
              </g>
            ) : (
              <>
                {runs.map((run, k) =>
                  run.length > 1 ? (
                    <CurvePath
                      key={k}
                      points={run}
                      xScale={x}
                      yScale={y}
                      color={DATA_COLORS.highlight}
                      fill
                      fillOpacity={0.5}
                      width={0}
                      animate={false}
                    />
                  ) : null,
                )}
                <CurvePath
                  points={xs.map((value) => ({ x: value, y: Math.min(height(value), top) }))}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.text}
                  width={2}
                  animate={false}
                />
              </>
            )}
            <g aria-hidden="true">
              {markers.map((marker, k) => (
                <g key={k}>
                  <line
                    x1={x(marker.x)}
                    x2={x(marker.x)}
                    y1={box.inner.top}
                    y2={bottom}
                    stroke={marker.color}
                    strokeWidth={2}
                    strokeDasharray={marker.dashed ? '5 4' : undefined}
                  />
                  <text
                    x={x(marker.x) + 4}
                    y={box.inner.top + 12 + k * 14}
                    fontSize={11}
                    fontWeight={700}
                    fill={marker.color}
                  >
                    {marker.label}
                  </text>
                </g>
              ))}
            </g>
          </>
        );
      }}
    </ChartSvg>
  );
}
