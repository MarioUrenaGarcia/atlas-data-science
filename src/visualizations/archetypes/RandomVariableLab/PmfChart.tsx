import { scaleLinear, type ScaleLinear } from 'd3-scale';
import type { ReactNode } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { DraggablePoint } from '../../core/svg/DraggablePoint.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import type { VariableSource } from './source.ts';

export interface Marker {
  x: number;
  label: string;
  color: string;
  dashed?: boolean;
}

export interface Band {
  from: number;
  to: number;
  color: string;
  label?: string;
}

export interface ChartScales {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
  top: number;
  bottom: number;
}

interface PmfChartProps {
  source: VariableSource;
  /** Probabilities to draw instead of the source ones, for edited distributions. */
  probs?: readonly number[];
  label: string;
  color?: (index: number) => string;
  opacity?: (index: number) => number;
  markers?: readonly Marker[];
  bands?: readonly Band[];
  /** Called with the new probability when a bar is dragged; discrete sources only. */
  onEdit?: (index: number, probability: number) => void;
  domain?: [number, number];
  yLabel?: string;
  yMax?: number;
  aspect?: number;
  overlay?: (scales: ChartScales) => ReactNode;
  showValues?: boolean;
}

const DISCRETE_BAR = 0.7;
const LABEL_LIMIT = 16;

/**
 * Probability mass function as bars, or a density drawn as adjacent cells
 * when the source approximates a continuous distribution. Markers draw
 * vertical lines (mean, median, quantiles) and bands shade intervals.
 */
export function PmfChart({
  source,
  probs,
  label,
  color = () => DATA_COLORS.primary,
  opacity = () => 0.75,
  markers = [],
  bands = [],
  onEdit,
  domain,
  yLabel,
  yMax,
  aspect = 0.42,
  overlay,
  showValues = true,
}: PmfChartProps) {
  const p = probs ?? source.pmf.probs;
  const heights = p.map((value) => (source.continuous ? value / source.cell : value));
  const top = yMax ?? Math.max(0.05, ...heights) * 1.15;
  const [d0, d1] = domain ?? source.domain;
  const editable = Boolean(onEdit) && !source.continuous;
  return (
    <ChartSvg label={label} aspect={aspect} minHeight={200} maxHeight={330} interactive={editable}>
      {(box) => {
        const x = scaleLinear()
          .domain([d0, d1])
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLinear()
          .domain([0, top])
          .range([box.inner.top + box.inner.height, box.inner.top]);
        const unit = Math.abs(x(1) - x(0));
        const barWidth = source.continuous
          ? Math.abs(x(source.cell) - x(0)) + 0.5
          : Math.min(48, Math.max(3, unit * DISCRETE_BAR));
        const bottom = box.inner.top + box.inner.height;
        const fewValues = source.pmf.values.length <= LABEL_LIMIT && !source.continuous;
        return (
          <>
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              ticks={4}
              label={yLabel ?? (source.continuous ? 'densidad' : 'probabilidad')}
            />
            <Axis
              scale={x}
              orientation="bottom"
              position={bottom}
              ticks={fewValues ? Math.min(13, source.pmf.values.length) : 6}
              tickValues={
                fewValues && source.pmf.values.length <= 13 ? source.pmf.values : undefined
              }
              label={source.symbol.replace(/[_^{}]/g, '')}
            />
            <g aria-hidden="true">
              {bands.map((band, index) => (
                <rect
                  key={`b${index}`}
                  x={x(band.from)}
                  y={box.inner.top}
                  width={Math.max(0, x(band.to) - x(band.from))}
                  height={box.inner.height}
                  fill={band.color}
                  fillOpacity={0.12}
                />
              ))}
              {source.pmf.values.map((value, index) => {
                // Cells beyond the window (far tails of continuous sources) are not drawn.
                if (value < d0 || value > d1) return null;
                const h = heights[index] ?? 0;
                return (
                  <g key={index}>
                    <rect
                      x={x(value) - barWidth / 2}
                      y={y(h)}
                      width={barWidth}
                      height={Math.max(0, bottom - y(h))}
                      fill={color(index)}
                      fillOpacity={opacity(index)}
                    />
                    {showValues && fewValues && (
                      <text
                        x={x(value)}
                        y={y(h) - (editable ? 14 : 5)}
                        textAnchor="middle"
                        className={svgStyles.label}
                        style={{ fontSize: 10 }}
                      >
                        {formatNumber(p[index] ?? 0, 3)}
                      </text>
                    )}
                  </g>
                );
              })}
              {markers.map((marker, index) => (
                <g key={`m${index}`}>
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
                    y={box.inner.top + 12 + index * 14}
                    className={svgStyles.label}
                    style={{ fill: marker.color, fontWeight: 700 }}
                  >
                    {marker.label}
                  </text>
                </g>
              ))}
            </g>
            {overlay?.({ x, y, top: box.inner.top, bottom })}
            {editable &&
              source.pmf.values.map((value, index) => (
                <DraggablePoint
                  key={`d${index}`}
                  x={x(value)}
                  y={y(heights[index] ?? 0)}
                  radius={5}
                  axis="y"
                  color={color(index)}
                  label={`Probabilidad del valor ${formatNumber(value, 2)}`}
                  valueText={formatNumber(p[index] ?? 0, 3)}
                  onDrag={(_, py) => onEdit?.(index, Math.min(top, Math.max(0, y.invert(py))))}
                />
              ))}
          </>
        );
      }}
    </ChartSvg>
  );
}
