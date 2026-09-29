import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import type { RelationDiagramProps } from './diagramProps.ts';

/**
 * Relation as a subset of the plane: the point (a, b) is drawn when a R b.
 * The diagonal a = b marks reflexivity, and a symmetric relation is a picture
 * that is its own mirror image across that diagonal.
 */
export function PlaneDiagram({
  elements,
  matrix,
  filled,
  witnessCells,
  classOf,
  colorByClass,
  label,
}: RelationDiagramProps) {
  const n = elements.length;
  return (
    <ChartSvg
      label={label}
      aspect={0.62}
      minHeight={280}
      maxHeight={460}
      margins={{ top: 12, right: 16, bottom: 36, left: 44 }}
    >
      {(box) => {
        const size = Math.min(box.inner.width, box.inner.height) / n;
        const left = box.inner.left + (box.inner.width - size * n) / 2;
        const bottom = box.inner.top + size * n;
        const px = (index: number) => left + size * (index + 0.5);
        const py = (index: number) => bottom - size * (index + 0.5);
        return (
          <g aria-hidden="true">
            <rect
              x={left}
              y={box.inner.top}
              width={size * n}
              height={size * n}
              fill="none"
              stroke="var(--color-border)"
            />
            {elements.map((element, index) => (
              <g key={element}>
                <line
                  x1={px(index)}
                  x2={px(index)}
                  y1={box.inner.top}
                  y2={bottom}
                  stroke="var(--data-grid)"
                />
                <line
                  x1={left}
                  x2={left + size * n}
                  y1={py(index)}
                  y2={py(index)}
                  stroke="var(--data-grid)"
                />
                <text x={px(index)} y={bottom + 16} textAnchor="middle" className={svgStyles.label}>
                  {element}
                </text>
                <text
                  x={left - 10}
                  y={py(index)}
                  dy="0.35em"
                  textAnchor="end"
                  className={svgStyles.label}
                >
                  {element}
                </text>
              </g>
            ))}
            <text
              x={left + size * n}
              y={bottom + 32}
              textAnchor="end"
              className={svgStyles.labelMuted}
            >
              a
            </text>
            <text x={left - 30} y={box.inner.top + 10} className={svgStyles.labelMuted}>
              b
            </text>
            <line
              x1={left}
              y1={bottom}
              x2={left + size * n}
              y2={box.inner.top}
              stroke={DATA_COLORS.muted}
              strokeDasharray="5 4"
            />
            {matrix.flatMap((row, i) =>
              row.map((related, j) => {
                const index = i * n + j;
                if (!related || index >= filled) return null;
                const classIndex = classOf.get(i);
                const witness = witnessCells.has(`${i},${j}`);
                const color = witness
                  ? DATA_COLORS.secondary
                  : colorByClass && classIndex !== undefined
                    ? seriesColor(classIndex)
                    : DATA_COLORS.primary;
                return (
                  <circle
                    key={`${i}-${j}`}
                    cx={px(i)}
                    cy={py(j)}
                    r={Math.min(9, size * 0.3)}
                    fill={color}
                    stroke={index === filled - 1 ? DATA_COLORS.text : 'none'}
                    strokeWidth={2}
                  />
                );
              }),
            )}
          </g>
        );
      }}
    </ChartSvg>
  );
}
