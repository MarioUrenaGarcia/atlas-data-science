import { DATA_COLORS } from '../../core/colors.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import type { RelationDiagramProps } from './diagramProps.ts';

const NODE_RADIUS = 17;

interface HasseDiagramProps extends RelationDiagramProps {
  /** The relation is reflexive, antisymmetric and transitive. */
  isOrder: boolean;
}

/**
 * Hasse diagram of a partial order: each element is drawn above the ones
 * below it in the order, and only the covering pairs are joined (a < b with
 * nothing in between). Loops and pairs implied by transitivity are left out,
 * so a chain looks like a line and incomparable elements sit side by side.
 */
export function HasseDiagram({
  elements,
  labels,
  matrix,
  filled,
  label,
  isOrder,
}: HasseDiagramProps) {
  const n = elements.length;
  const below = (a: number, b: number) => a !== b && Boolean(matrix[a]?.[b]);
  const covers: [number, number][] = [];
  for (let a = 0; a < n; a += 1) {
    for (let b = 0; b < n; b += 1) {
      if (!below(a, b)) continue;
      const between = Array.from({ length: n }, (_, c) => c).some(
        (c) => below(a, c) && below(c, b),
      );
      if (!between) covers.push([a, b]);
    }
  }
  // Level of an element: length of the longest chain that ends in it.
  const level = Array.from({ length: n }, () => 0);
  for (let pass = 0; pass < n; pass += 1) {
    for (const [a, b] of covers) level[b] = Math.max(level[b] ?? 0, (level[a] ?? 0) + 1);
  }
  const levels = Math.max(0, ...level) + 1;
  const byLevel = Array.from({ length: levels }, (_, value) =>
    level.map((l, index) => (l === value ? index : -1)).filter((index) => index >= 0),
  );
  const shownPairs = Math.min(covers.length, Math.ceil((filled / (n * n)) * covers.length));

  return (
    <ChartSvg
      label={label}
      aspect={0.62}
      minHeight={280}
      maxHeight={460}
      margins={{ top: 24, right: 24, bottom: 24, left: 24 }}
    >
      {(box) => {
        if (!isOrder) {
          return (
            <text
              x={box.inner.left + box.inner.width / 2}
              y={box.inner.top + box.inner.height / 2}
              textAnchor="middle"
              className={svgStyles.labelMuted}
            >
              Esta relación no es un orden parcial: no tiene diagrama de Hasse.
            </text>
          );
        }
        const position = (index: number) => {
          const row = level[index] ?? 0;
          const members = byLevel[row] ?? [];
          const slot = members.indexOf(index);
          return {
            x: box.inner.left + (box.inner.width * (slot + 0.5)) / members.length,
            y:
              box.inner.top +
              box.inner.height -
              (levels === 1 ? box.inner.height / 2 : (box.inner.height * row) / (levels - 1)),
          };
        };
        return (
          <g aria-hidden="true">
            {covers.slice(0, shownPairs).map(([a, b]) => {
              const from = position(a);
              const to = position(b);
              return (
                <line
                  key={`${a}-${b}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={DATA_COLORS.primary}
                  strokeWidth={2.5}
                />
              );
            })}
            {elements.map((element, index) => {
              const p = position(index);
              return (
                <g key={element}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={NODE_RADIUS}
                    fill="var(--color-surface)"
                    stroke={DATA_COLORS.primary}
                    strokeWidth={2}
                  />
                  <text
                    x={p.x}
                    y={p.y}
                    dy="0.35em"
                    textAnchor="middle"
                    className={svgStyles.label}
                    style={{ fontWeight: 700, fontSize: 11 }}
                  >
                    {labels[index] ?? element}
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
