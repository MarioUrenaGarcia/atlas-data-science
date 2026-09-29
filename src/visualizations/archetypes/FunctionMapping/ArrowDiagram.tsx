import { useId } from 'react';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';

export interface DiagramArrow {
  /** Column of the source set. */
  column: number;
  from: number;
  to: number;
  color?: string;
  dashed?: boolean;
  /** Fraction of the arrow drawn, for animated tracing. */
  progress?: number;
}

export interface NodeMark {
  column: number;
  index: number;
  color: string;
}

interface ArrowDiagramProps {
  columns: readonly { name: string; items: readonly string[] }[];
  arrows: readonly DiagramArrow[];
  marks?: readonly NodeMark[];
  selected?: { column: number; index: number } | null;
  label: string;
  onNodeClick?: (column: number, index: number) => void;
}

const NODE_RADIUS = 17;

/** Sets drawn as vertical ovals with their elements, joined by arrows between neighbouring columns. */
export function ArrowDiagram({
  columns,
  arrows,
  marks = [],
  selected = null,
  label,
  onNodeClick,
}: ArrowDiagramProps) {
  const id = useId().replace(/:/g, '');
  return (
    <ChartSvg
      interactive
      label={label}
      aspect={0.55}
      minHeight={260}
      maxHeight={420}
      margins={{ top: 30, right: 16, bottom: 12, left: 16 }}
    >
      {(box) => {
        const columnX = (column: number) =>
          box.inner.left + (box.inner.width * (column + 0.5)) / columns.length;
        const nodeY = (column: number, index: number) => {
          const count = columns[column]?.items.length ?? 1;
          const spacing = Math.min(46, box.inner.height / (count + 0.5));
          return box.inner.top + box.inner.height / 2 + (index - (count - 1) / 2) * spacing;
        };
        return (
          <>
            <defs>
              <marker
                id={`${id}-head`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
              </marker>
            </defs>
            {columns.map((column, c) => {
              const count = column.items.length;
              const spacing = Math.min(46, box.inner.height / (count + 0.5));
              const height = count * spacing + 20;
              return (
                <g key={column.name} aria-hidden="true">
                  <ellipse
                    cx={columnX(c)}
                    cy={box.inner.top + box.inner.height / 2}
                    rx={NODE_RADIUS + 18}
                    ry={height / 2}
                    fill={seriesColor(c)}
                    fillOpacity={0.07}
                    stroke={seriesColor(c)}
                    strokeWidth={2}
                  />
                  <text
                    x={columnX(c)}
                    y={box.inner.top - 10}
                    textAnchor="middle"
                    className={svgStyles.label}
                    style={{ fontWeight: 700, fill: seriesColor(c) }}
                  >
                    {column.name}
                  </text>
                </g>
              );
            })}
            {arrows.map((arrow, index) => {
              const x1 = columnX(arrow.column) + NODE_RADIUS;
              const y1 = nodeY(arrow.column, arrow.from);
              const x2Full = columnX(arrow.column + 1) - NODE_RADIUS - 2;
              const y2Full = nodeY(arrow.column + 1, arrow.to);
              const t = arrow.progress ?? 1;
              const x2 = x1 + (x2Full - x1) * t;
              const y2 = y1 + (y2Full - y1) * t;
              return (
                <line
                  key={`${arrow.column}-${arrow.from}-${arrow.to}-${index}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={arrow.color ?? DATA_COLORS.muted}
                  strokeWidth={2}
                  strokeDasharray={arrow.dashed ? '6 4' : undefined}
                  markerEnd={t >= 1 ? `url(#${id}-head)` : undefined}
                  aria-hidden="true"
                />
              );
            })}
            {columns.map((column, c) =>
              column.items.map((item, index) => {
                const mark = marks.find(
                  (candidate) => candidate.column === c && candidate.index === index,
                );
                const isSelected = selected?.column === c && selected.index === index;
                const interactive = Boolean(onNodeClick);
                return (
                  <g
                    key={`${c}-${item}`}
                    role={interactive ? 'button' : undefined}
                    tabIndex={interactive ? 0 : undefined}
                    aria-label={interactive ? `${column.name}: ${item}` : undefined}
                    aria-pressed={interactive ? isSelected : undefined}
                    style={interactive ? { cursor: 'pointer' } : undefined}
                    onClick={interactive ? () => onNodeClick?.(c, index) : undefined}
                    onKeyDown={
                      interactive
                        ? (event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              onNodeClick?.(c, index);
                            }
                          }
                        : undefined
                    }
                  >
                    <circle
                      cx={columnX(c)}
                      cy={nodeY(c, index)}
                      r={NODE_RADIUS}
                      fill={mark ? mark.color : 'var(--color-surface)'}
                      fillOpacity={mark ? 0.35 : 1}
                      stroke={isSelected ? DATA_COLORS.text : seriesColor(c)}
                      strokeWidth={isSelected ? 3 : 1.5}
                    />
                    <text
                      x={columnX(c)}
                      y={nodeY(c, index)}
                      textAnchor="middle"
                      dy="0.35em"
                      className={svgStyles.label}
                    >
                      {item}
                    </text>
                  </g>
                );
              }),
            )}
          </>
        );
      }}
    </ChartSvg>
  );
}
