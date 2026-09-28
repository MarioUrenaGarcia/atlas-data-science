import { quadtree, type Quadtree } from 'd3-quadtree';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import { Maximize, Minus, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { strings } from '../../app/strings.ts';
import type { AtlasData } from '../../content/loader.ts';
import type { ConceptNode, MapLayoutData } from '../../content/types.ts';
import type { ConceptStatus } from '../../store/progress.ts';
import { useResponsiveSize } from '../../visualizations/core/useResponsiveSize.ts';
import { Button } from '../ui/Button.tsx';
import styles from './KnowledgeMap.module.css';
import { useThemeColors } from './useThemeColors.ts';

export type MapView = 'conceptos' | 'modulos';

interface KnowledgeMapProps {
  atlas: AtlasData;
  layout: MapLayoutData;
  statuses: Record<string, ConceptStatus>;
  isVisible: (node: ConceptNode) => boolean;
  view: MapView;
  selected: string | null;
  focusModule: number | null;
  onSelect: (id: string | null) => void;
  onModuleSelect: (numero: number) => void;
}

interface PlacedNode {
  node: ConceptNode;
  x: number;
  y: number;
  r: number;
}

const HEIGHT_RATIO = 0.68;
const MIN_HEIGHT = 380;
const MAX_HEIGHT = 760;
const LABEL_ZOOM = 1.7;
const HIT_SLOP_PX = 6;
const FADED_ALPHA = 0.12;

function nodeRadius(node: ConceptNode): number {
  return 3 + Math.sqrt(node.descendientes) * 0.9;
}

export function KnowledgeMap({
  atlas,
  layout,
  statuses,
  isVisible,
  view,
  selected,
  focusModule,
  onSelect,
  onModuleSelect,
}: KnowledgeMapProps) {
  const [containerRef, size] = useResponsiveSize<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transformRef = useRef<ZoomTransform>(zoomIdentity);
  const zoomRef = useRef<ZoomBehavior<HTMLCanvasElement, unknown> | null>(null);
  const frame = useRef<number | null>(null);
  const [hovered, setHovered] = useState<{ id: string; x: number; y: number } | null>(null);
  const colors = useThemeColors();
  const height = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, size.width * HEIGHT_RATIO));

  const placed = useMemo<PlacedNode[]>(
    () =>
      atlas.nodes.flatMap((node) => {
        const position = layout.positions[node.id];
        return position ? [{ node, x: position[0], y: position[1], r: nodeRadius(node) }] : [];
      }),
    [atlas.nodes, layout.positions],
  );
  const byId = useMemo(() => new Map(placed.map((item) => [item.node.id, item])), [placed]);
  const tree = useMemo<Quadtree<PlacedNode>>(
    () =>
      quadtree<PlacedNode>()
        .x((item) => item.x)
        .y((item) => item.y)
        .addAll(placed),
    [placed],
  );

  const bounds = useMemo(() => {
    if (placed.length === 0) return { minX: -100, minY: -100, maxX: 100, maxY: 100 };
    return placed.reduce(
      (box, item) => ({
        minX: Math.min(box.minX, item.x - item.r),
        minY: Math.min(box.minY, item.y - item.r),
        maxX: Math.max(box.maxX, item.x + item.r),
        maxY: Math.max(box.maxY, item.y + item.r),
      }),
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
    );
  }, [placed]);

  const focusId = hovered?.id ?? selected;
  const highlight = useMemo(() => {
    if (!focusId) return null;
    const node = atlas.byId.get(focusId);
    if (!node) return null;
    return new Set([focusId, ...node.prerrequisitos, ...node.dependientes]);
  }, [focusId, atlas.byId]);

  const draw = useCallback(() => {
    frame.current = null;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || size.width === 0) return;
    const ratio = window.devicePixelRatio || 1;
    const { x, y, k } = transformRef.current;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(ratio * k, 0, 0, ratio * k, ratio * x, ratio * y);

    if (view === 'modulos') {
      for (const module of layout.modules) {
        if (module.count === 0) continue;
        const color = colors.modules[module.numero] ?? colors.accent;
        context.globalAlpha = 0.18;
        context.fillStyle = color;
        context.beginPath();
        context.arc(module.x, module.y, module.radius, 0, 2 * Math.PI);
        context.fill();
        context.globalAlpha = 1;
        context.lineWidth = 2 / k;
        context.strokeStyle = color;
        context.stroke();
        const title = atlas.moduleByNumber.get(module.numero)?.titulo ?? '';
        context.fillStyle = colors.text;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = `600 ${15 / k}px Inter, sans-serif`;
        context.fillText(title, module.x, module.y - 9 / k);
        context.font = `${12 / k}px Inter, sans-serif`;
        context.fillStyle = colors.textMuted;
        context.fillText(strings.modules.conceptCount(module.count), module.x, module.y + 10 / k);
      }
      return;
    }

    // Edges first, faded; highlighted edges are redrawn on top.
    context.lineWidth = 0.8 / k;
    context.strokeStyle = colors.border;
    context.globalAlpha = highlight ? 0.06 : 0.22;
    context.beginPath();
    for (const item of placed) {
      if (!isVisible(item.node)) continue;
      for (const prerequisite of item.node.prerrequisitos) {
        const source = byId.get(prerequisite);
        if (!source || !isVisible(source.node)) continue;
        context.moveTo(source.x, source.y);
        context.lineTo(item.x, item.y);
      }
    }
    context.stroke();

    if (highlight && focusId) {
      const focus = byId.get(focusId);
      if (focus) {
        context.globalAlpha = 0.9;
        context.lineWidth = 1.6 / k;
        for (const prerequisite of focus.node.prerrequisitos) {
          const source = byId.get(prerequisite);
          if (!source) continue;
          context.strokeStyle = colors.accent;
          context.beginPath();
          context.moveTo(source.x, source.y);
          context.lineTo(focus.x, focus.y);
          context.stroke();
        }
        for (const dependent of focus.node.dependientes) {
          const target = byId.get(dependent);
          if (!target) continue;
          context.strokeStyle = colors.success;
          context.beginPath();
          context.moveTo(focus.x, focus.y);
          context.lineTo(target.x, target.y);
          context.stroke();
        }
      }
    }

    for (const item of placed) {
      const visible = isVisible(item.node);
      const emphasized = highlight ? highlight.has(item.node.id) : visible;
      context.globalAlpha = emphasized ? 1 : FADED_ALPHA;
      context.fillStyle = colors.modules[item.node.modulo] ?? colors.accent;
      context.beginPath();
      context.arc(item.x, item.y, item.r, 0, 2 * Math.PI);
      context.fill();
      const status = statuses[item.node.id];
      if (status) {
        context.lineWidth = 2 / k;
        context.strokeStyle = status === 'dominado' ? colors.success : colors.accent;
        context.stroke();
      }
      if (item.node.id === selected) {
        context.lineWidth = 3 / k;
        context.strokeStyle = colors.text;
        context.beginPath();
        context.arc(item.x, item.y, item.r + 3 / k, 0, 2 * Math.PI);
        context.stroke();
      }
    }

    // Labels: every visible node when zoomed in, otherwise only highlighted ones.
    context.globalAlpha = 1;
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.font = `${12 / k}px Inter, sans-serif`;
    context.lineWidth = 3 / k;
    context.strokeStyle = colors.background;
    context.fillStyle = colors.text;
    for (const item of placed) {
      const show = highlight
        ? highlight.has(item.node.id)
        : k >= LABEL_ZOOM && isVisible(item.node);
      if (!show) continue;
      const label = item.node.titulo;
      context.strokeText(label, item.x, item.y + item.r + 2 / k);
      context.fillText(label, item.x, item.y + item.r + 2 / k);
    }
  }, [
    size.width,
    view,
    layout.modules,
    colors,
    atlas.moduleByNumber,
    highlight,
    focusId,
    placed,
    byId,
    isVisible,
    statuses,
    selected,
  ]);

  const requestDraw = useCallback(() => {
    if (frame.current === null) frame.current = requestAnimationFrame(draw);
  }, [draw]);

  useEffect(() => {
    requestDraw();
  }, [requestDraw]);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const fitTo = useCallback(
    (box: { minX: number; minY: number; maxX: number; maxY: number }) => {
      const canvas = canvasRef.current;
      const behavior = zoomRef.current;
      if (!canvas || !behavior || size.width === 0) return;
      const padding = 24;
      const scale = Math.min(
        (size.width - 2 * padding) / Math.max(1, box.maxX - box.minX),
        (height - 2 * padding) / Math.max(1, box.maxY - box.minY),
      );
      const transform = zoomIdentity
        .translate(size.width / 2, height / 2)
        .scale(scale)
        .translate(-(box.minX + box.maxX) / 2, -(box.minY + box.maxY) / 2);
      select(canvas).call(behavior.transform, transform);
    },
    [size.width, height],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const behavior = zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.05, 12])
      .on('zoom', (event: { transform: ZoomTransform }) => {
        transformRef.current = event.transform;
        setHovered(null);
        requestDraw();
      });
    zoomRef.current = behavior;
    select(canvas).call(behavior).on('dblclick.zoom', null);
    return () => {
      select(canvas).on('.zoom', null);
    };
  }, [requestDraw]);

  // Fit the whole map once the canvas has a size.
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current || size.width === 0) return;
    fitted.current = true;
    fitTo(bounds);
  }, [size.width, bounds, fitTo]);

  useEffect(() => {
    if (focusModule === null) return;
    const module = layout.modules.find((candidate) => candidate.numero === focusModule);
    if (!module || module.count === 0) return;
    fitTo({
      minX: module.x - module.radius,
      maxX: module.x + module.radius,
      minY: module.y - module.radius,
      maxY: module.y + module.radius,
    });
  }, [focusModule, layout.modules, fitTo]);

  const locate = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const [x, y] = transformRef.current.invert([clientX - rect.left, clientY - rect.top]);
    return { x, y, screenX: clientX - rect.left, screenY: clientY - rect.top };
  };

  const hitModule = (x: number, y: number) =>
    layout.modules.find(
      (module) => module.count > 0 && Math.hypot(module.x - x, module.y - y) <= module.radius,
    );

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === 'touch') return;
    const point = locate(event.clientX, event.clientY);
    if (!point) return;
    if (view === 'modulos') {
      event.currentTarget.style.cursor = hitModule(point.x, point.y) ? 'pointer' : 'grab';
      return;
    }
    const k = transformRef.current.k;
    const found = tree.find(point.x, point.y, 20 / k + HIT_SLOP_PX / k);
    const hit =
      found && Math.hypot(found.x - point.x, found.y - point.y) <= found.r + HIT_SLOP_PX / k
        ? found
        : null;
    event.currentTarget.style.cursor = hit ? 'pointer' : 'grab';
    setHovered((previous) => {
      if (!hit) return null;
      if (previous?.id === hit.node.id) return previous;
      return { id: hit.node.id, x: point.screenX, y: point.screenY };
    });
  };

  const onClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const point = locate(event.clientX, event.clientY);
    if (!point) return;
    if (view === 'modulos') {
      const module = hitModule(point.x, point.y);
      if (module) onModuleSelect(module.numero);
      return;
    }
    const k = transformRef.current.k;
    const found = tree.find(point.x, point.y, 20 / k + HIT_SLOP_PX / k);
    const hit =
      found && Math.hypot(found.x - point.x, found.y - point.y) <= found.r + HIT_SLOP_PX / k
        ? found
        : null;
    onSelect(hit ? hit.node.id : null);
  };

  const zoomBy = (factor: number) => {
    const canvas = canvasRef.current;
    const behavior = zoomRef.current;
    if (canvas && behavior) select(canvas).call(behavior.scaleBy, factor);
  };

  const ratio = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  const hoveredNode = hovered ? atlas.byId.get(hovered.id) : undefined;

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.stage} style={{ height }}>
        <canvas
          ref={canvasRef}
          width={Math.round(size.width * ratio)}
          height={Math.round(height * ratio)}
          style={{ width: size.width, height }}
          className={styles.canvas}
          role="img"
          aria-label={strings.map.canvasLabel}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setHovered(null)}
          onClick={onClick}
        />
        {hoveredNode && hovered && (
          <div
            className={styles.tooltip}
            style={{ left: hovered.x, top: hovered.y }}
            aria-hidden="true"
          >
            {hoveredNode.titulo}
          </div>
        )}
        <div className={styles.zoomControls}>
          <Button
            size="small"
            iconOnly
            aria-label={strings.map.zoomIn}
            title={strings.map.zoomIn}
            onClick={() => zoomBy(1.5)}
          >
            <Plus size={16} aria-hidden="true" />
          </Button>
          <Button
            size="small"
            iconOnly
            aria-label={strings.map.zoomOut}
            title={strings.map.zoomOut}
            onClick={() => zoomBy(1 / 1.5)}
          >
            <Minus size={16} aria-hidden="true" />
          </Button>
          <Button
            size="small"
            iconOnly
            aria-label={strings.map.resetView}
            title={strings.map.resetView}
            onClick={() => fitTo(bounds)}
          >
            <Maximize size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
