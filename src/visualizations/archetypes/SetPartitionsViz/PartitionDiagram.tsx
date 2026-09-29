import { seriesColor } from '../../core/colors.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';

const NODE_RADIUS = 15;
const CIRCLE_SHARE = 0.36;

interface PartitionDiagramProps {
  n: number;
  /** Blocks of the partition, as lists of elements 0..n-1. */
  blocks: readonly (readonly number[])[];
  /** Element drawn with an outline, such as the last one added. */
  marked?: number;
  label: string;
}

/**
 * Elements placed around a circle; each block is drawn as a shaded polygon
 * through its members, in the color of the block.
 */
export function PartitionDiagram({ n, blocks, marked, label }: PartitionDiagramProps) {
  return (
    <ChartSvg
      label={label}
      aspect={0.45}
      minHeight={210}
      maxHeight={300}
      margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
    >
      {(box) => {
        const cx = box.inner.left + box.inner.width / 2;
        const cy = box.inner.top + box.inner.height / 2;
        const radius = Math.min(box.inner.width, box.inner.height) * CIRCLE_SHARE;
        const point = (element: number) => {
          const angle = -Math.PI / 2 + (2 * Math.PI * element) / n;
          return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
        };
        const blockOf = new Map<number, number>();
        blocks.forEach((block, index) => block.forEach((element) => blockOf.set(element, index)));
        return (
          <g aria-hidden="true">
            {blocks.map((block, index) => {
              const color = seriesColor(index);
              if (block.length === 1) return null;
              const points = block.map(point);
              return (
                <polygon
                  key={index}
                  points={points.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill={color}
                  fillOpacity={0.25}
                  stroke={color}
                  strokeWidth={NODE_RADIUS * 1.6}
                  strokeOpacity={0.25}
                  strokeLinejoin="round"
                />
              );
            })}
            {Array.from({ length: n }, (_, element) => {
              const p = point(element);
              const block = blockOf.get(element);
              const color = block === undefined ? 'var(--color-border-strong)' : seriesColor(block);
              return (
                <g key={element}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={NODE_RADIUS}
                    fill={block === undefined ? 'var(--color-surface)' : color}
                    fillOpacity={block === undefined ? 1 : 0.35}
                    stroke={element === marked ? 'var(--color-text)' : color}
                    strokeWidth={element === marked ? 3 : 2}
                  />
                  <text
                    x={p.x}
                    y={p.y}
                    dy="0.35em"
                    textAnchor="middle"
                    className={svgStyles.label}
                    style={{ fontWeight: 700 }}
                  >
                    {element + 1}
                  </text>
                </g>
              );
            })}
          </g>
        );
      }}
    </ChartSvg>
  );
}
