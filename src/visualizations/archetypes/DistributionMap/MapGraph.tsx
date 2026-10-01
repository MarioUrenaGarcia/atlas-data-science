import type { KeyboardEvent } from 'react';
import { seriesColor } from '../../core/colors.ts';
import styles from './DistributionMap.module.css';
import { KIND_LABELS, KINDS, NODES, type Relation, type RelationKind } from './relations.ts';

const WIDTH = 1000;
const HEIGHT = 640;
const NODE_WIDTH = 166;
const NODE_HEIGHT = 40;
/** Room below the drawing for the color legend. */
const LEGEND_Y = 618;

const kindColor = (kind: RelationKind) => seriesColor(KINDS.indexOf(kind));

interface MapGraphProps {
  relations: readonly Relation[];
  selected: string;
  onSelect: (id: string) => void;
  label: string;
}

/** Point where the segment from the center (x, y) toward (tx, ty) leaves the node box. */
function boxExit(x: number, y: number, tx: number, ty: number): [number, number] {
  const dx = tx - x;
  const dy = ty - y;
  const scale = Math.min(
    dx === 0 ? Infinity : NODE_WIDTH / 2 / Math.abs(dx),
    dy === 0 ? Infinity : NODE_HEIGHT / 2 / Math.abs(dy),
  );
  return [x + dx * scale, y + dy * scale];
}

/**
 * Drawing of the distributions as boxes joined by colored lines, one color
 * per kind of relation. Each line is a button that selects its relation.
 */
export function MapGraph({ relations, selected, onSelect, label }: MapGraphProps) {
  const active = relations.find((relation) => relation.id === selected);
  const highlighted = new Set(active ? [active.from, active.to] : []);
  const used = new Set(relations.flatMap((relation) => [relation.from, relation.to]));
  const onKey = (event: KeyboardEvent<SVGGElement>, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(id);
    }
  };

  return (
    <svg
      className={styles.graph}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="group"
      aria-label={label}
    >
      <defs>
        {KINDS.map((kind) => (
          <marker
            key={kind}
            id={`map-arrow-${kind}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={kindColor(kind)} />
          </marker>
        ))}
      </defs>
      {relations.map((relation) => {
        const from = NODES.find((node) => node.id === relation.from);
        const to = NODES.find((node) => node.id === relation.to);
        if (!from || !to) return null;
        const [x1, y1] = boxExit(from.x, from.y, to.x, to.y);
        const [x2, y2] = boxExit(to.x, to.y, from.x, from.y);
        const isActive = relation.id === selected;
        return (
          <g
            key={relation.id}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            aria-label={`${relation.title}, ${KIND_LABELS[relation.kind].toLowerCase()}`}
            className={styles.edge}
            onClick={() => onSelect(relation.id)}
            onKeyDown={(event) => onKey(event, relation.id)}
          >
            {/* A wide transparent stroke makes the thin line easy to hit. */}
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={18} />
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={kindColor(relation.kind)}
              strokeWidth={isActive ? 5 : 2.5}
              strokeOpacity={active && !isActive ? 0.45 : 1}
              markerEnd={`url(#map-arrow-${relation.kind})`}
            />
          </g>
        );
      })}
      <g aria-hidden="true">
        {NODES.filter((node) => used.has(node.id)).map((node) => (
          <g key={node.id}>
            <rect
              x={node.x - NODE_WIDTH / 2}
              y={node.y - NODE_HEIGHT / 2}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              rx={8}
              className={highlighted.has(node.id) ? styles.nodeActive : styles.node}
            />
            <text
              x={node.x}
              y={node.y}
              dy="0.35em"
              textAnchor="middle"
              className={styles.nodeLabel}
            >
              {node.label}
            </text>
          </g>
        ))}
        {KINDS.map((kind, index) => (
          <g key={kind} transform={`translate(${30 + index * 230}, ${LEGEND_Y})`}>
            <line x1={0} y1={0} x2={34} y2={0} stroke={kindColor(kind)} strokeWidth={4} />
            <text x={44} y={0} dy="0.35em" className={styles.legend}>
              {KIND_LABELS[kind]}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
