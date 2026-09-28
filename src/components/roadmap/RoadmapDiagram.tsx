import { select } from 'd3-selection';
import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom';
import { Maximize } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import type { AtlasData } from '../../content/loader.ts';
import { useProgress } from '../../store/progress.ts';
import { useResponsiveSize } from '../../visualizations/core/useResponsiveSize.ts';
import { Button } from '../ui/Button.tsx';
import { moduleColor } from '../ui/moduleColor.ts';
import { layoutRoadmap } from './layoutRoadmap.ts';
import styles from './RoadmapDiagram.module.css';

interface RoadmapDiagramProps {
  atlas: AtlasData;
  concepts: string[];
  target?: string;
}

const WIDE_LAYOUT_MIN_WIDTH = 900;
const MIN_HEIGHT = 360;
const MAX_HEIGHT = 720;
const LINE_HEIGHT = 17;

/** Smooth path through dagre's control points using quadratic segments between midpoints. */
function edgePath(points: { x: number; y: number }[]): string {
  const [first, ...rest] = points;
  if (!first) return '';
  if (rest.length === 0) return `M${first.x},${first.y}`;
  let path = `M${first.x},${first.y}`;
  for (let index = 0; index < rest.length - 1; index += 1) {
    const current = rest[index];
    const next = rest[index + 1];
    if (!current || !next) continue;
    path += ` Q${current.x},${current.y} ${(current.x + next.x) / 2},${(current.y + next.y) / 2}`;
  }
  const last = rest[rest.length - 1];
  if (last) path += ` L${last.x},${last.y}`;
  return path;
}

export default function RoadmapDiagram({ atlas, concepts, target }: RoadmapDiagramProps) {
  const [containerRef, size] = useResponsiveSize<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const navigate = useNavigate();
  const statuses = useProgress((state) => state.conceptos);
  const direction = size.width >= WIDE_LAYOUT_MIN_WIDTH ? 'LR' : 'TB';

  const layout = useMemo(
    () => layoutRoadmap(atlas, concepts, direction),
    [atlas, concepts, direction],
  );
  const height = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, layout.height));

  const fit = () => {
    const svg = svgRef.current;
    const behavior = zoomRef.current;
    if (!svg || !behavior || size.width === 0 || layout.width === 0) return;
    const scale = Math.min(1, size.width / layout.width, height / layout.height);
    const x = (size.width - layout.width * scale) / 2;
    const y = Math.max(0, (height - layout.height * scale) / 2);
    select(svg).call(behavior.transform, zoomIdentity.translate(x, y).scale(scale));
  };

  useEffect(() => {
    const svg = svgRef.current;
    const group = groupRef.current;
    if (!svg || !group) return;
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 2.5])
      .on('zoom', (event: { transform: { toString(): string } }) => {
        group.setAttribute('transform', event.transform.toString());
      });
    zoomRef.current = behavior;
    select(svg).call(behavior).on('dblclick.zoom', null);
    return () => {
      select(svg).on('.zoom', null);
    };
  }, []);

  // Refit whenever the layout or the available width changes.
  useEffect(fit, [layout, size.width, height]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <span className={styles.hint}>{strings.roadmap.zoomHint}</span>
        <Button size="small" variant="ghost" onClick={fit}>
          <Maximize size={14} aria-hidden="true" />
          {strings.map.resetView}
        </Button>
      </div>
      <div ref={containerRef} className={styles.canvas} style={{ height }}>
        <svg
          ref={svgRef}
          width={size.width}
          height={height}
          role="group"
          aria-label={strings.roadmap.diagramLabel}
          className={styles.svg}
        >
          <defs>
            <marker
              id="roadmap-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="var(--color-border-strong)" />
            </marker>
          </defs>
          <g ref={groupRef}>
            {layout.clusters.map((cluster) => (
              <g key={cluster.modulo} aria-hidden="true">
                <rect
                  x={cluster.x - cluster.width / 2}
                  y={cluster.y - cluster.height / 2}
                  width={cluster.width}
                  height={cluster.height}
                  rx={12}
                  className={styles.cluster}
                  style={{ stroke: moduleColor(cluster.modulo) }}
                />
                <text
                  x={cluster.x - cluster.width / 2 + 10}
                  y={cluster.y - cluster.height / 2 + 14}
                  className={styles.clusterLabel}
                  style={{ fill: moduleColor(cluster.modulo) }}
                >
                  {cluster.label}
                </text>
              </g>
            ))}
            {layout.edges.map((edge) => (
              <path
                key={`${edge.from}-${edge.to}`}
                d={edgePath(edge.points)}
                className={styles.edge}
                markerEnd="url(#roadmap-arrow)"
              />
            ))}
            {layout.nodes.map((node) => {
              const status = statuses[node.id];
              const classes = [
                styles.node,
                status === 'dominado' ? styles.mastered : '',
                status === 'visto' ? styles.seen : '',
                node.id === target ? styles.target : '',
              ].join(' ');
              const title = atlas.byId.get(node.id)?.titulo ?? node.id;
              const firstLineY = node.y - ((node.lines.length - 1) * LINE_HEIGHT) / 2;
              return (
                <a
                  key={node.id}
                  href={`${import.meta.env.BASE_URL}concepto/${node.id}`}
                  className={classes}
                  aria-label={title}
                  onClick={(event) => {
                    event.preventDefault();
                    navigate(`/concepto/${node.id}`);
                  }}
                >
                  <title>{title}</title>
                  <rect
                    x={node.x - node.width / 2}
                    y={node.y - node.height / 2}
                    width={node.width}
                    height={node.height}
                    rx={8}
                    style={{ ['--node-accent' as string]: moduleColor(node.modulo) }}
                  />
                  <text x={node.x} y={firstLineY} textAnchor="middle" dominantBaseline="middle">
                    {node.lines.map((line, index) => (
                      <tspan key={index} x={node.x} dy={index === 0 ? 0 : LINE_HEIGHT}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </a>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
