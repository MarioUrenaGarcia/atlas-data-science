import { useId } from 'react';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { containedSet, placeElements, regionAnchors, vennLayout } from './geometry.ts';

interface VennDiagramProps {
  labels: readonly string[];
  elements: readonly number[];
  /** Membership mask of each element (bit i for set i). */
  masks: readonly number[];
  /** Regions (by mask) to shade; the universe outside every set is mask 0. */
  shaded: ReadonlySet<number>;
  shadeColor?: string;
  /** Elements already examined, with their verdict; others are drawn faded. */
  highlighted?: ReadonlyMap<number, boolean>;
  current?: number | null;
  label: string;
  title?: string;
  compact?: boolean;
  onRegionClick?: (mask: number) => void;
  /** Text drawn at the center of each region inside the circles, by mask. */
  regionText?: ReadonlyMap<number, string>;
  showElements?: boolean;
}

/**
 * Venn diagram where any union of regions can be shaded. Each region is the
 * intersection of the circles it belongs to minus the circles it avoids,
 * built from nested clip paths and masks.
 */
export function VennDiagram({
  labels,
  elements,
  masks,
  shaded,
  shadeColor = DATA_COLORS.highlight,
  highlighted,
  current = null,
  label,
  title,
  compact = false,
  onRegionClick,
  regionText,
  showElements = true,
}: VennDiagramProps) {
  const id = useId().replace(/:/g, '');
  const count = labels.length;
  return (
    <ChartSvg
      label={label}
      aspect={compact ? 0.75 : 0.58}
      minHeight={compact ? 190 : 240}
      maxHeight={compact ? 300 : 420}
      margins={{ top: 0, right: 0, bottom: 0, left: 0 }}
    >
      {(box) => {
        const layout = vennLayout(box.width, box.height, count, count === 2 ? containedSet(masks) : null);
        const spacing = Math.max(22, Math.min(34, box.width / 22));
        const positions = placeElements(layout, masks, spacing);
        const regions = Array.from({ length: 2 ** count }, (_, mask) => mask);
        const regionShape = (
          mask: number,
          fill: string,
          opacity: number,
          key: string,
          interactive: boolean,
        ) => {
          let node = (
            <rect
              x={layout.frame.x}
              y={layout.frame.y}
              width={layout.frame.width}
              height={layout.frame.height}
              fill={fill}
              fillOpacity={opacity}
              style={interactive ? { cursor: 'pointer' } : undefined}
              onClick={interactive && onRegionClick ? () => onRegionClick(mask) : undefined}
            />
          );
          layout.circles.forEach((_, index) => {
            const included = (mask >> index) & 1;
            node = included ? (
              <g clipPath={`url(#${id}-c${index})`}>{node}</g>
            ) : (
              <g mask={`url(#${id}-m${index})`}>{node}</g>
            );
          });
          return <g key={key}>{node}</g>;
        };
        return (
          <>
            <defs>
              {layout.circles.map((circle, index) => (
                <clipPath key={`c${index}`} id={`${id}-c${index}`}>
                  <circle cx={circle.cx} cy={circle.cy} r={circle.r} />
                </clipPath>
              ))}
              {layout.circles.map((circle, index) => (
                <mask key={`m${index}`} id={`${id}-m${index}`} maskUnits="userSpaceOnUse">
                  <rect x={0} y={0} width={box.width} height={box.height} fill="white" />
                  <circle cx={circle.cx} cy={circle.cy} r={circle.r} fill="black" />
                </mask>
              ))}
            </defs>
            <rect
              x={layout.frame.x}
              y={layout.frame.y}
              width={layout.frame.width}
              height={layout.frame.height}
              rx={8}
              fill="var(--color-surface)"
              stroke="var(--color-border-strong)"
              aria-hidden="true"
            />
            {regions.map((mask) =>
              regionShape(
                mask,
                shadeColor,
                shaded.has(mask) ? 0.45 : 0,
                `r${mask}`,
                Boolean(onRegionClick),
              ),
            )}
            {layout.circles.map((circle, index) => (
              <g key={index} aria-hidden="true" pointerEvents="none">
                <circle
                  cx={circle.cx}
                  cy={circle.cy}
                  r={circle.r}
                  fill="none"
                  stroke={seriesColor(index)}
                  strokeWidth={2.5}
                />
                <text
                  x={circle.cx + (index === 0 ? -circle.r * 0.7 : index === 1 ? circle.r * 0.7 : 0)}
                  y={index === 2 ? circle.cy + circle.r + 14 : circle.cy - circle.r - 6}
                  textAnchor="middle"
                  className={svgStyles.label}
                  style={{ fontWeight: 700, fill: seriesColor(index) }}
                >
                  {labels[index]}
                </text>
              </g>
            ))}
            <text
              x={layout.frame.x + 10}
              y={layout.frame.y + 18}
              className={svgStyles.labelMuted}
              aria-hidden="true"
            >
              {title ?? 'U'}
            </text>
            <g aria-hidden="true" pointerEvents="none" display={showElements ? undefined : 'none'}>
              {elements.map((element, index) => {
                const position = positions[index];
                if (!position) return null;
                const verdict = highlighted?.get(element);
                const examined = verdict !== undefined;
                return (
                  <g key={element}>
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r={spacing * 0.38}
                      fill={
                        examined
                          ? verdict
                            ? DATA_COLORS.tertiary
                            : 'var(--color-surface-3)'
                          : 'var(--color-surface-2)'
                      }
                      stroke={element === current ? DATA_COLORS.text : 'var(--color-border-strong)'}
                      strokeWidth={element === current ? 2.5 : 1}
                    />
                    <text
                      x={position.x}
                      y={position.y}
                      textAnchor="middle"
                      dy="0.35em"
                      className={svgStyles.label}
                      style={{ fontSize: 11 }}
                    >
                      {element}
                    </text>
                  </g>
                );
              })}
            </g>
            {regionText && (
              <g aria-hidden="true" pointerEvents="none">
                {[...regionAnchors(layout)].map(([mask, point]) => (
                  <text
                    key={mask}
                    x={point.x}
                    y={point.y}
                    textAnchor="middle"
                    dy="0.35em"
                    className={svgStyles.label}
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      paintOrder: 'stroke',
                      stroke: 'var(--color-surface)',
                      strokeWidth: 5,
                    }}
                  >
                    {regionText.get(mask) ?? ''}
                  </text>
                ))}
              </g>
            )}
          </>
        );
      }}
    </ChartSvg>
  );
}
