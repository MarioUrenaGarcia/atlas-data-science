import { scaleLinear, scaleLog } from 'd3-scale';
import { useEffect, useMemo, useRef } from 'react';
import { useThemeColors } from '../../components/graph/useThemeColors.ts';
import { canvasTheme, drawBottomAxis, drawLeftAxis, prepareCanvas } from '../core/canvas.ts';
import { resolveColor } from '../core/colors.ts';
import { useResponsiveSize } from '../core/useResponsiveSize.ts';

/** Curves y = lower(n) and y = upper(n) drawn behind the paths, such as a tolerance band. */
export interface Envelope {
  lower: (n: number) => number;
  upper: (n: number) => number;
  color: string;
  /** Fills the region between the curves instead of drawing two lines. */
  fill?: boolean;
  dashed?: boolean;
}

export interface TrajectoryCanvasProps {
  /** Each path holds the values for n = 1..N at indices 0..N-1. */
  paths: readonly Float64Array[];
  /** Number of leading values of every path that are visible. */
  revealed: number;
  yDomain: [number, number];
  label: string;
  xLabel?: string;
  logX?: boolean;
  envelopes?: readonly Envelope[];
  /** Per path, an index 0..N-1 to mark with a dot, or null. */
  markers?: readonly (number | null)[];
  /** Per path, whether it is drawn in the alert color. */
  alert?: readonly boolean[];
  /** How many leading paths are drawn in series colors. */
  highlighted?: number;
  /** Draws paths as isolated points instead of joined lines, for 0/1 sequences. */
  points?: boolean;
  aspect?: number;
  /** Maps the indices linearly onto this interval of the x axis, for paths indexed by time. Envelopes are not drawn in this mode. */
  xRange?: [number, number];
}

const MARGIN = { top: 12, right: 16, bottom: 44, left: 52 };
const MIN_HEIGHT = 240;
const MAX_HEIGHT = 420;
const MARKER_RADIUS = 3.5;
/** Colors of the highlighted paths; the second data color is left for bands. */
const PATH_COLORS = ['var(--data-1)', 'var(--data-3)', 'var(--data-4)'] as const;

/**
 * Many realizations of a sequence of random variables drawn on a canvas,
 * with optional bands. The x axis is the index n, linear or logarithmic.
 */
export function TrajectoryCanvas({
  paths,
  revealed,
  yDomain,
  label,
  xLabel = 'n',
  logX = false,
  envelopes = [],
  markers,
  alert,
  highlighted = 3,
  points = false,
  aspect = 0.5,
  xRange,
}: TrajectoryCanvasProps) {
  const [containerRef, size] = useResponsiveSize<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeColors();
  const width = size.width;
  const height = Math.round(Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, width * aspect)));
  const length = paths[0]?.length ?? 0;
  const plotWidth = Math.max(10, width - MARGIN.left - MARGIN.right);

  // Indices drawn for each path: all of them when they fit, otherwise an even
  // (or geometric, on a log axis) subsample of about two per pixel.
  const indices = useMemo(() => {
    const budget = Math.max(50, Math.round(plotWidth * 2));
    if (length <= budget) return Array.from({ length }, (_, i) => i);
    const result = new Set<number>();
    for (let k = 0; k <= budget; k += 1) {
      const t = k / budget;
      result.add(
        logX ? Math.round(Math.exp(t * Math.log(length)) - 1) : Math.round(t * (length - 1)),
      );
    }
    return [...result].sort((a, b) => a - b);
  }, [length, plotWidth, logX]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || length === 0) return;
    const context = prepareCanvas(canvas, width, height);
    if (!context) return;
    const colors = canvasTheme();
    const x = logX
      ? scaleLog()
          .domain([1, Math.max(2, length)])
          .range([MARGIN.left, MARGIN.left + plotWidth])
      : scaleLinear()
          .domain([1, Math.max(2, length)])
          .range([MARGIN.left, MARGIN.left + plotWidth]);
    const y = scaleLinear()
      .domain(yDomain)
      .range([height - MARGIN.bottom, MARGIN.top]);
    drawLeftAxis(context, y, MARGIN.left, plotWidth, colors);
    const powers = logX
      ? Array.from({ length: Math.floor(Math.log10(Math.max(2, length))) + 1 }, (_, k) => 10 ** k)
      : undefined;
    const timeScale = xRange
      ? scaleLinear()
          .domain(xRange)
          .range([MARGIN.left, MARGIN.left + plotWidth])
      : null;
    drawBottomAxis(context, timeScale ?? x, height - MARGIN.bottom, colors, xLabel, 6, powers);
    const position = (i: number) =>
      timeScale && xRange
        ? timeScale(xRange[0] + ((xRange[1] - xRange[0]) * i) / Math.max(1, length - 1))
        : x(i + 1);

    context.save();
    context.beginPath();
    context.rect(MARGIN.left, MARGIN.top, plotWidth, height - MARGIN.top - MARGIN.bottom);
    context.clip();

    const envelopeSteps = Math.min(400, Math.max(2, length));
    for (const envelope of xRange ? [] : envelopes) {
      const ns = Array.from({ length: envelopeSteps + 1 }, (_, k) =>
        logX
          ? Math.exp((k / envelopeSteps) * Math.log(length))
          : 1 + ((length - 1) * k) / envelopeSteps,
      ).filter((n) => Number.isFinite(envelope.upper(n)) && Number.isFinite(envelope.lower(n)));
      const color = resolveColor(envelope.color);
      if (envelope.fill) {
        context.fillStyle = color;
        context.globalAlpha = 0.16;
        context.beginPath();
        ns.forEach((n, k) => {
          if (k === 0) context.moveTo(x(n), y(envelope.upper(n)));
          else context.lineTo(x(n), y(envelope.upper(n)));
        });
        [...ns].reverse().forEach((n) => context.lineTo(x(n), y(envelope.lower(n))));
        context.closePath();
        context.fill();
        context.globalAlpha = 1;
      }
      context.strokeStyle = color;
      context.lineWidth = 1.5;
      context.setLineDash(envelope.dashed ? [6, 4] : []);
      for (const edge of [envelope.lower, envelope.upper]) {
        context.beginPath();
        ns.forEach((n, k) => {
          if (k === 0) context.moveTo(x(n), y(edge(n)));
          else context.lineTo(x(n), y(edge(n)));
        });
        context.stroke();
      }
      context.setLineDash([]);
    }

    const visible = indices.filter((i) => i < revealed);
    const faded = Math.max(0.08, Math.min(0.4, 8 / Math.max(1, paths.length)));
    const neutral = resolveColor('var(--data-neutral)');
    const alertColor = resolveColor('var(--data-5)');
    const draw = (path: Float64Array, color: string, lineWidth: number, alpha: number) => {
      context.globalAlpha = alpha;
      if (points) {
        context.fillStyle = color;
        for (const i of visible) {
          const value = path[i] ?? 0;
          context.beginPath();
          context.arc(position(i), y(value), value === 0 ? 1.2 : lineWidth + 1, 0, 2 * Math.PI);
          context.fill();
        }
      } else {
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.beginPath();
        visible.forEach((i, k) => {
          const px = position(i);
          const py = y(path[i] ?? 0);
          if (k === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        });
        context.stroke();
      }
    };
    paths.forEach((path, index) => {
      if (index < highlighted) return;
      draw(path, alert?.[index] ? alertColor : neutral, 1, alert?.[index] ? 0.55 : faded);
    });
    paths.slice(0, highlighted).forEach((path, index) => {
      draw(
        path,
        resolveColor(PATH_COLORS[index % PATH_COLORS.length] ?? 'var(--data-1)'),
        1.8,
        0.95,
      );
    });
    context.globalAlpha = 1;

    if (markers) {
      context.fillStyle = alertColor;
      context.strokeStyle = resolveColor('var(--color-bg)');
      context.lineWidth = 1;
      markers.forEach((marker, index) => {
        if (marker === null || marker === undefined || marker >= revealed) return;
        const path = paths[index];
        if (!path) return;
        context.beginPath();
        context.arc(position(marker), y(path[marker] ?? 0), MARKER_RADIUS, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
      });
    }
    context.restore();
  }, [
    width,
    height,
    plotWidth,
    length,
    paths,
    revealed,
    yDomain,
    xLabel,
    logX,
    envelopes,
    markers,
    alert,
    highlighted,
    points,
    indices,
    theme,
    xRange,
  ]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <canvas ref={canvasRef} data-viz="" role="img" aria-label={label} />
    </div>
  );
}
