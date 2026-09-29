import { scaleLinear } from 'd3-scale';
import { useId } from 'react';
import type { LinearFit } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { DraggablePoint } from '../../core/svg/DraggablePoint.tsx';
import { WINDOW, type Point } from './presets.ts';

export type ClickMode = 'mover' | 'agregar' | 'quitar';

interface ScatterChartProps {
  points: readonly Point[];
  fit: LinearFit | null;
  showLine: boolean;
  showResiduals: boolean;
  showSquares: boolean;
  showMeans: boolean;
  means: { x: number; y: number } | null;
  labels: { x: string; y: string };
  mode: ClickMode;
  label: string;
  onMove: (index: number, point: Point) => void;
  onAdd: (point: Point) => void;
  onRemove: (index: number) => void;
}

export function ScatterChart({
  points,
  fit,
  showLine,
  showResiduals,
  showSquares,
  showMeans,
  means,
  labels,
  mode,
  label,
  onMove,
  onAdd,
  onRemove,
}: ScatterChartProps) {
  const clipId = `recorte-${useId().replace(/:/g, '')}`;
  return (
    <ChartSvg
      interactive
      label={label}
      aspect={0.72}
      minHeight={280}
      maxHeight={560}
      margins={{ left: 56, bottom: 46 }}
    >
      {(box) => {
        const x = scaleLinear()
          .domain([WINDOW.min, WINDOW.max])
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLinear()
          .domain([WINDOW.min, WINDOW.max])
          .range([box.inner.top + box.inner.height, box.inner.top]);
        const clampData = (value: number) => Math.min(WINDOW.max, Math.max(WINDOW.min, value));
        const predict = (value: number) => (fit ? fit.intercept + fit.slope * value : 0);
        return (
          <>
            <defs>
              <clipPath id={clipId}>
                <rect
                  x={box.inner.left}
                  y={box.inner.top}
                  width={box.inner.width}
                  height={box.inner.height}
                />
              </clipPath>
            </defs>
            <rect
              x={box.inner.left}
              y={box.inner.top}
              width={box.inner.width}
              height={box.inner.height}
              fill="transparent"
              style={{ cursor: mode === 'agregar' ? 'crosshair' : 'default' }}
              onClick={(event) => {
                if (mode !== 'agregar') return;
                const svg = event.currentTarget.ownerSVGElement;
                const rect = svg?.getBoundingClientRect();
                if (!rect) return;
                onAdd({
                  x: clampData(x.invert(event.clientX - rect.left)),
                  y: clampData(y.invert(event.clientY - rect.top)),
                });
              }}
            />
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              ticks={5}
              label={labels.y}
            />
            <Axis
              scale={x}
              orientation="bottom"
              position={box.inner.top + box.inner.height}
              ticks={5}
              label={labels.x}
            />

            {showMeans && means && (
              <g aria-hidden="true" stroke={DATA_COLORS.muted} strokeDasharray="4 4">
                <line
                  x1={x(means.x)}
                  x2={x(means.x)}
                  y1={box.inner.top}
                  y2={box.inner.top + box.inner.height}
                />
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(means.y)}
                  y2={y(means.y)}
                />
              </g>
            )}

            {fit && showSquares && (
              <g aria-hidden="true">
                {points.map((point, index) => {
                  const residual = point.y - predict(point.x);
                  const side = Math.abs(y(point.y) - y(predict(point.x)));
                  const left = residual > 0 ? x(point.x) : x(point.x) - side;
                  return (
                    <rect
                      key={index}
                      x={left}
                      y={Math.min(y(point.y), y(predict(point.x)))}
                      width={side}
                      height={side}
                      fill={DATA_COLORS.highlight}
                      fillOpacity={0.18}
                      stroke={DATA_COLORS.highlight}
                      strokeOpacity={0.5}
                    />
                  );
                })}
              </g>
            )}

            {fit && showResiduals && (
              <g aria-hidden="true" stroke={DATA_COLORS.secondary} strokeWidth={1.5}>
                {points.map((point, index) => (
                  <line
                    key={index}
                    x1={x(point.x)}
                    x2={x(point.x)}
                    y1={y(point.y)}
                    y2={y(predict(point.x))}
                  />
                ))}
              </g>
            )}

            {fit && showLine && (
              <line
                x1={x(WINDOW.min)}
                x2={x(WINDOW.max)}
                y1={y(predict(WINDOW.min))}
                y2={y(predict(WINDOW.max))}
                stroke={DATA_COLORS.primary}
                strokeWidth={2.5}
                aria-hidden="true"
                clipPath={`url(#${clipId})`}
              />
            )}

            {points.map((point, index) =>
              mode === 'quitar' ? (
                <circle
                  key={index}
                  cx={x(point.x)}
                  cy={y(point.y)}
                  r={8}
                  fill={DATA_COLORS.tertiary}
                  style={{ cursor: 'pointer' }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Quitar el punto (${point.x.toFixed(1)}, ${point.y.toFixed(1)})`}
                  onClick={() => onRemove(index)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onRemove(index);
                    }
                  }}
                />
              ) : (
                <DraggablePoint
                  key={index}
                  x={x(point.x)}
                  y={y(point.y)}
                  radius={6}
                  color={DATA_COLORS.tertiary}
                  label={`Punto ${index + 1}`}
                  valueText={`x = ${point.x.toFixed(2)}, y = ${point.y.toFixed(2)}`}
                  onDrag={(px, py) =>
                    onMove(index, { x: clampData(x.invert(px)), y: clampData(y.invert(py)) })
                  }
                />
              ),
            )}
          </>
        );
      }}
    </ChartSvg>
  );
}
