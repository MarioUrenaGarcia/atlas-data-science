import { quadtree, type Quadtree } from 'd3-quadtree';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import { Maximize, Minus, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { strings } from '../../app/strings.ts';
import type { AtlasData } from '../../content/loader.ts';
import type { ConceptNode, MapLayoutData } from '../../content/types.ts';
import { moduleLinks, moduleRing, type ModuleBubble } from '../../lib/graph/moduleRing.ts';
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
const FIT_PADDING = 24;
const MODULE_LABEL_GAP = 8;
const MODULE_LABEL_LINE = 17;
const MODULE_LABEL_LINES = 3;
const MODULE_SIDE_ROOM = 40;

type Box = { minX: number; minY: number; maxX: number; maxY: number };

type Hovered = { id?: string; module?: number; x: number; y: number };

/** Splits a title into lines that fit `maxWidth` with the current canvas font. */
function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

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
  const [hovered, setHovered] = useState<Hovered | null>(null);
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

  // Module view: one bubble per module sized by its visible concepts, linked by
  // the number of prerequisites that cross from one module to another.
  const visibleNodes = useMemo(() => atlas.nodes.filter(isVisible), [atlas.nodes, isVisible]);
  const bubbles = useMemo(
    () =>
      moduleRing(
        atlas.modules.map((module) => ({
          numero: module.numero,
          count: visibleNodes.filter((node) => node.modulo === module.numero).length,
        })),
      ),
    [atlas.modules, visibleNodes],
  );
  const links = useMemo(() => {
    const visibleIds = new Set(visibleNodes.map((node) => node.id));
    return moduleLinks(visibleNodes, (id) =>
      visibleIds.has(id) ? atlas.byId.get(id)?.modulo : undefined,
    );
  }, [visibleNodes, atlas.byId]);
  const bubbleByNumber = useMemo(
    () => new Map(bubbles.map((bubble) => [bubble.numero, bubble])),
    [bubbles],
  );
  const maxLinkWeight = useMemo(() => Math.max(1, ...links.map((link) => link.weight)), [links]);
  const bubbleBounds = useMemo<Box>(() => {
    if (bubbles.length === 0) return { minX: -100, minY: -100, maxX: 100, maxY: 100 };
    // Titles are drawn under each bubble, so the box leaves room for them.
    const labelRoom = MODULE_LABEL_GAP + MODULE_LABEL_LINES * MODULE_LABEL_LINE;
    return {
      minX: Math.min(...bubbles.map((bubble) => bubble.x - bubble.r - MODULE_SIDE_ROOM)),
      maxX: Math.max(...bubbles.map((bubble) => bubble.x + bubble.r + MODULE_SIDE_ROOM)),
      minY: Math.min(...bubbles.map((bubble) => bubble.y - bubble.r)),
      maxY: Math.max(...bubbles.map((bubble) => bubble.y + bubble.r + labelRoom)),
    };
  }, [bubbles]);

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
      const active = hovered?.module ?? null;
      const linked = (a: number, b: number) =>
        links.some(
          (link) =>
            (link.source === a && link.target === b) || (link.source === b && link.target === a),
        );
      context.lineCap = 'round';
      for (const link of links) {
        const source = bubbleByNumber.get(link.source);
        const target = bubbleByNumber.get(link.target);
        if (!source || !target) continue;
        const touches = active !== null && (link.source === active || link.target === active);
        context.globalAlpha = active === null ? 0.35 : touches ? 0.85 : 0.08;
        context.strokeStyle = touches
          ? (colors.modules[link.source] ?? colors.accent)
          : colors.border;
        context.lineWidth = 1.5 + 9 * Math.sqrt(link.weight / maxLinkWeight);
        context.beginPath();
        context.moveTo(source.x, source.y);
        context.lineTo(target.x, target.y);
        context.stroke();
      }
      for (const bubble of bubbles) {
        const color = colors.modules[bubble.numero] ?? colors.accent;
        const isActive = active === bubble.numero;
        const faded = active !== null && !isActive && !linked(active, bubble.numero);
        context.globalAlpha = 1;
        context.fillStyle = colors.surface;
        context.beginPath();
        context.arc(bubble.x, bubble.y, bubble.r, 0, 2 * Math.PI);
        context.fill();
        context.globalAlpha = faded ? 0.08 : isActive ? 0.4 : 0.22;
        context.fillStyle = color;
        context.fill();
        context.globalAlpha = faded ? 0.35 : 1;
        context.lineWidth = isActive ? 4 : 2.5;
        context.strokeStyle = color;
        context.stroke();

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = colors.text;
        context.font = `700 ${Math.max(16, bubble.r * 0.42)}px Inter, sans-serif`;
        context.fillText(String(bubble.numero), bubble.x, bubble.y - bubble.r * 0.12);
        context.font = `${Math.max(11, bubble.r * 0.15)}px Inter, sans-serif`;
        context.fillStyle = colors.textMuted;
        context.fillText(
          strings.modules.conceptCount(bubble.count),
          bubble.x,
          bubble.y + bubble.r * 0.32,
        );

        const title = atlas.moduleByNumber.get(bubble.numero)?.titulo ?? '';
        context.font = '600 14px Inter, sans-serif';
        context.textBaseline = 'top';
        context.fillStyle = colors.text;
        context.strokeStyle = colors.background;
        context.lineWidth = 4;
        context.lineJoin = 'round';
        const lines = wrapText(context, title, Math.max(150, bubble.r * 2.2));
        lines.slice(0, MODULE_LABEL_LINES).forEach((line, index) => {
          const y = bubble.y + bubble.r + MODULE_LABEL_GAP + index * MODULE_LABEL_LINE;
          context.strokeText(line, bubble.x, y);
          context.fillText(line, bubble.x, y);
        });
      }
      context.globalAlpha = 1;
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
    hovered,
    links,
    bubbles,
    bubbleByNumber,
    maxLinkWeight,
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

  // The queued frame always runs the latest draw: when several renders happen
  // before the next frame (for example, the first measurement of the width),
  // a frame bound to an older closure would paint with stale dimensions.
  const drawRef = useRef(draw);
  const requestDraw = useCallback(() => {
    if (frame.current === null) frame.current = requestAnimationFrame(() => drawRef.current());
  }, []);

  useEffect(() => {
    drawRef.current = draw;
    requestDraw();
  }, [draw, requestDraw]);

  // The pending id must be cleared on cleanup: a stale id would make
  // requestDraw believe a frame is still queued and the map would stop drawing.
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    },
    [],
  );

  const fitTo = useCallback(
    (box: Box) => {
      const canvas = canvasRef.current;
      const behavior = zoomRef.current;
      if (!canvas || !behavior || size.width === 0) return;
      const padding = FIT_PADDING;
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

  // Both views use different coordinates, so the frame is fitted again when
  // the canvas first gets a size, when the view changes and when a module is
  // opened from the module view. Filter changes keep the user's framing.
  const viewBounds = view === 'modulos' ? bubbleBounds : bounds;
  const fittedKey = useRef<string | null>(null);
  useEffect(() => {
    if (size.width === 0) return;
    const key = `${view}:${focusModule ?? ''}`;
    if (fittedKey.current === key) return;
    fittedKey.current = key;
    const module =
      view === 'conceptos' && focusModule !== null
        ? layout.modules.find((candidate) => candidate.numero === focusModule)
        : undefined;
    if (module && module.count > 0) {
      fitTo({
        minX: module.x - module.radius,
        maxX: module.x + module.radius,
        minY: module.y - module.radius,
        maxY: module.y + module.radius,
      });
    } else {
      fitTo(viewBounds);
    }
  }, [size.width, view, focusModule, layout.modules, viewBounds, fitTo]);

  const locate = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const [x, y] = transformRef.current.invert([clientX - rect.left, clientY - rect.top]);
    return { x, y, screenX: clientX - rect.left, screenY: clientY - rect.top };
  };

  const hitModule = (x: number, y: number): ModuleBubble | undefined =>
    bubbles.find((bubble) => Math.hypot(bubble.x - x, bubble.y - y) <= bubble.r);

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === 'touch') return;
    const point = locate(event.clientX, event.clientY);
    if (!point) return;
    if (view === 'modulos') {
      const module = hitModule(point.x, point.y);
      event.currentTarget.style.cursor = module ? 'pointer' : 'grab';
      setHovered((previous) => {
        if (!module) return null;
        if (previous?.module === module.numero) return previous;
        return { module: module.numero, x: point.screenX, y: point.screenY };
      });
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
  const hoveredNode = hovered?.id ? atlas.byId.get(hovered.id) : undefined;
  const hoveredModule =
    hovered?.module !== undefined ? atlas.moduleByNumber.get(hovered.module) : undefined;
  const tooltip = hoveredNode?.titulo ?? hoveredModule?.titulo;

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
        {tooltip && hovered && (
          <div
            className={styles.tooltip}
            style={{ left: hovered.x, top: hovered.y }}
            aria-hidden="true"
          >
            {tooltip}
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
            onClick={() => fitTo(viewBounds)}
          >
            <Maximize size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
