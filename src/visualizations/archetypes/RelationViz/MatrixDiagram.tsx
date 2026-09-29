import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import type { RelationDiagramProps } from './diagramProps.ts';

/** Relation as a table: cell (a, b) is filled when a R b. */
export function MatrixDiagram({
  elements,
  matrix,
  filled,
  witnessCells,
  classOf,
  colorByClass,
  label,
}: RelationDiagramProps) {
  return (
    <ChartSvg
      label={label}
      aspect={0.62}
      minHeight={260}
      maxHeight={440}
      margins={{ top: 30, right: 12, bottom: 12, left: 40 }}
    >
      {(box) => {
        const size = Math.min(box.inner.width, box.inner.height) / elements.length;
        const left = box.inner.left + (box.inner.width - size * elements.length) / 2;
        return (
          <>
            <text x={left - 26} y={box.inner.top - 12} className={svgStyles.labelMuted}>
              a \ b
            </text>
            {elements.map((element, index) => (
              <g key={element} aria-hidden="true">
                <text
                  x={left + size * (index + 0.5)}
                  y={box.inner.top - 10}
                  textAnchor="middle"
                  className={svgStyles.label}
                >
                  {element}
                </text>
                <text
                  x={left - 10}
                  y={box.inner.top + size * (index + 0.5)}
                  textAnchor="end"
                  dy="0.35em"
                  className={svgStyles.label}
                >
                  {element}
                </text>
              </g>
            ))}
            {matrix.flatMap((row, i) =>
              row.map((related, j) => {
                const index = i * elements.length + j;
                const shown = index < filled;
                const classIndex = classOf.get(i);
                const fill =
                  colorByClass && related && classIndex !== undefined
                    ? seriesColor(classIndex)
                    : DATA_COLORS.primary;
                const witness = witnessCells.has(`${i},${j}`);
                return (
                  <rect
                    key={`${i}-${j}`}
                    x={left + size * j + 1}
                    y={box.inner.top + size * i + 1}
                    width={size - 2}
                    height={size - 2}
                    rx={3}
                    fill={shown && related ? fill : 'var(--color-surface-2)'}
                    fillOpacity={shown && related ? 0.75 : 1}
                    stroke={
                      witness
                        ? DATA_COLORS.secondary
                        : index === filled - 1
                          ? DATA_COLORS.text
                          : 'var(--color-border)'
                    }
                    strokeWidth={witness || index === filled - 1 ? 3 : 1}
                    aria-hidden="true"
                  />
                );
              }),
            )}
          </>
        );
      }}
    </ChartSvg>
  );
}
