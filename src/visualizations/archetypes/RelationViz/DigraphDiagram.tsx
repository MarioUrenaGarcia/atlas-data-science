import { useId } from 'react';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import type { RelationDiagramProps } from './diagramProps.ts';

const NODE_RADIUS = 16;
const LOOP_RADIUS = 11;
/** Sideways bend of arrows, so a R b and b R a are drawn as two separate curves. */
const BEND = 0.18;

/**
 * Relation as a directed graph: an arrow from a to b when a R b, and a loop
 * when a R a. Symmetric relations show arrows in pairs, reflexive ones a loop
 * on every node, and equivalence classes appear as separate clusters of color.
 */
export function DigraphDiagram({
  elements,
  labels,
  matrix,
  filled,
  witnessCells,
  classOf,
  colorByClass,
  label,
}: RelationDiagramProps) {
  const id = useId().replace(/:/g, '');
  const n = elements.length;
  return (
    <ChartSvg
      label={label}
      aspect={0.62}
      minHeight={280}
      maxHeight={460}
      margins={{ top: 16, right: 16, bottom: 16, left: 16 }}
    >
      {(box) => {
        const cx = box.inner.left + box.inner.width / 2;
        const cy = box.inner.top + box.inner.height / 2;
        const radius =
          Math.min(box.inner.width, box.inner.height) / 2 - NODE_RADIUS - 2 * LOOP_RADIUS;
        const angleOf = (index: number) => -Math.PI / 2 + (2 * Math.PI * index) / n;
        const point = (index: number) => ({
          x: cx + radius * Math.cos(angleOf(index)),
          y: cy + radius * Math.sin(angleOf(index)),
        });
        const colorOf = (i: number, j: number) => {
          if (witnessCells.has(`${i},${j}`)) return DATA_COLORS.secondary;
          const classIndex = classOf.get(i);
          return colorByClass && classIndex !== undefined
            ? seriesColor(classIndex)
            : DATA_COLORS.primary;
        };
        const arrows = matrix.flatMap((row, i) =>
          row
            .map((related, j) => ({ i, j, related, index: i * n + j }))
            .filter((pair) => pair.related && pair.index < filled),
        );
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
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
              </marker>
            </defs>
            <g aria-hidden="true">
              {arrows.map(({ i, j, index }) => {
                const color = colorOf(i, j);
                const current = index === filled - 1;
                if (i === j) {
                  const angle = angleOf(i);
                  const distance = radius + NODE_RADIUS + LOOP_RADIUS - 4;
                  return (
                    <circle
                      key={`${i}-${j}`}
                      cx={cx + distance * Math.cos(angle)}
                      cy={cy + distance * Math.sin(angle)}
                      r={LOOP_RADIUS}
                      fill="none"
                      stroke={color}
                      strokeWidth={current ? 3.5 : 2}
                    />
                  );
                }
                const from = point(i);
                const to = point(j);
                const dx = to.x - from.x;
                const dy = to.y - from.y;
                const length = Math.hypot(dx, dy);
                const ux = dx / length;
                const uy = dy / length;
                const start = { x: from.x + ux * NODE_RADIUS, y: from.y + uy * NODE_RADIUS };
                const end = { x: to.x - ux * (NODE_RADIUS + 2), y: to.y - uy * (NODE_RADIUS + 2) };
                const control = {
                  x: (start.x + end.x) / 2 - uy * length * BEND,
                  y: (start.y + end.y) / 2 + ux * length * BEND,
                };
                return (
                  <path
                    key={`${i}-${j}`}
                    d={`M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={current ? 3.5 : 1.8}
                    strokeOpacity={current ? 1 : 0.8}
                    markerEnd={`url(#${id}-head)`}
                  />
                );
              })}
              {elements.map((element, index) => {
                const p = point(index);
                const classIndex = classOf.get(index);
                return (
                  <g key={labels[index] ?? element}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={NODE_RADIUS}
                      fill={
                        colorByClass && classIndex !== undefined
                          ? seriesColor(classIndex)
                          : 'var(--color-surface)'
                      }
                      fillOpacity={colorByClass ? 0.3 : 1}
                      stroke="var(--color-border-strong)"
                      strokeWidth={1.5}
                    />
                    <text
                      x={p.x}
                      y={p.y}
                      dy="0.35em"
                      textAnchor="middle"
                      className={svgStyles.label}
                      style={{ fontWeight: 700 }}
                    >
                      {labels[index] ?? element}
                    </text>
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
