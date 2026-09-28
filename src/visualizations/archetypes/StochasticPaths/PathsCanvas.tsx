import { scaleLinear } from 'd3-scale';
import { useEffect, useMemo, useRef } from 'react';
import { density, type Distribution } from '../../../lib/distributions/index.ts';
import { canvasTheme, drawBottomAxis, drawLeftAxis, prepareCanvas } from '../../core/canvas.ts';
import { resolveColor, SERIES_COLORS } from '../../core/colors.ts';
import { useResponsiveSize } from '../../core/useResponsiveSize.ts';
import { useThemeColors } from '../../../components/graph/useThemeColors.ts';

interface PathsCanvasProps {
  paths: readonly Float64Array[];
  horizon: number;
  revealed: number;
  sliceIndex: number;
  marginal: Distribution | null;
  discrete: boolean;
  yDomain: [number, number];
  label: string;
}

const MARGIN = { top: 14, right: 16, bottom: 44, left: 52 };
const SIDE_PANEL = 0.24;
const HIGHLIGHTED = 3;
const BINS = 30;

/**
 * Trajectories on the left and the cross-section at the chosen time on the
 * right, drawn on a canvas because hundreds of long paths would make an SVG
 * too heavy.
 */
export function PathsCanvas({
  paths,
  horizon,
  revealed,
  sliceIndex,
  marginal,
  discrete,
  yDomain,
  label,
}: PathsCanvasProps) {
  const [containerRef, size] = useResponsiveSize<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeColors();
  const width = size.width;
  const height = Math.round(Math.max(280, Math.min(480, width * 0.55)));
  const steps = (paths[0]?.length ?? 1) - 1;
  const slice = useMemo(
    () => paths.map((path) => path[Math.min(sliceIndex, revealed)] ?? 0),
    [paths, sliceIndex, revealed],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0) return;
    const context = prepareCanvas(canvas, width, height);
    if (!context) return;
    const colors = canvasTheme();
    const plotWidth = (width - MARGIN.left - MARGIN.right) * (1 - SIDE_PANEL);
    const sideLeft = MARGIN.left + plotWidth + 12;
    const sideWidth = width - MARGIN.right - sideLeft;
    const x = scaleLinear()
      .domain([0, horizon])
      .range([MARGIN.left, MARGIN.left + plotWidth]);
    const y = scaleLinear()
      .domain(yDomain)
      .range([height - MARGIN.bottom, MARGIN.top]);

    drawLeftAxis(context, y, MARGIN.left, plotWidth, colors);
    drawBottomAxis(context, x, height - MARGIN.bottom, colors, 'Tiempo t');

    context.save();
    context.beginPath();
    context.rect(MARGIN.left, MARGIN.top, plotWidth, height - MARGIN.top - MARGIN.bottom);
    context.clip();
    const background = resolveColor('var(--data-neutral)');
    const drawPath = (path: Float64Array, color: string, lineWidth: number, alpha: number) => {
      context.strokeStyle = color;
      context.globalAlpha = alpha;
      context.lineWidth = lineWidth;
      context.beginPath();
      for (let i = 0; i <= Math.min(revealed, steps); i += 1) {
        const px = x((horizon * i) / steps);
        const py = y(path[i] ?? 0);
        if (i === 0) context.moveTo(px, py);
        else if (discrete) {
          context.lineTo(px, y(path[i - 1] ?? 0));
          context.lineTo(px, py);
        } else context.lineTo(px, py);
      }
      context.stroke();
    };
    const faded = Math.max(0.06, Math.min(0.35, 6 / paths.length));
    paths.forEach((path, index) => {
      if (index >= HIGHLIGHTED) drawPath(path, background, 1, faded);
    });
    paths
      .slice(0, HIGHLIGHTED)
      .forEach((path, index) =>
        drawPath(path, resolveColor(SERIES_COLORS[index] ?? 'var(--data-1)'), 1.8, 0.95),
      );
    context.restore();
    context.globalAlpha = 1;

    // Time slice.
    const sliceTime = (horizon * Math.min(sliceIndex, steps)) / steps;
    context.strokeStyle = resolveColor('var(--data-2)');
    context.setLineDash([5, 4]);
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(x(sliceTime), MARGIN.top);
    context.lineTo(x(sliceTime), height - MARGIN.bottom);
    context.stroke();
    context.setLineDash([]);

    // Side histogram of X(t) at the slice, drawn horizontally.
    if (sliceIndex <= revealed && sideWidth > 20) {
      const [lo = 0, hi = 1] = yDomain;
      const binHeight = (hi - lo) / BINS;
      const counts = new Array<number>(BINS).fill(0);
      for (const value of slice) {
        if (value < lo || value > hi) continue;
        const index = Math.min(BINS - 1, Math.floor((value - lo) / binHeight));
        counts[index] = (counts[index] ?? 0) + 1;
      }
      const densities = counts.map((count) => count / (slice.length * binHeight));
      const curve: [number, number][] = [];
      if (marginal) {
        for (let i = 0; i <= 120; i += 1) {
          const value = lo + ((hi - lo) * i) / 120;
          curve.push([
            value,
            discrete ? density(marginal, Math.round(value)) : density(marginal, value),
          ]);
        }
      }
      const maxDensity = Math.max(
        1e-9,
        ...densities,
        ...curve.map(([, d]) => (Number.isFinite(d) ? d : 0)),
      );
      const w = (value: number) => (value / maxDensity) * sideWidth;
      context.fillStyle = resolveColor('var(--data-2)');
      context.globalAlpha = 0.55;
      densities.forEach((value, index) => {
        const top = y(lo + (index + 1) * binHeight);
        const bottom = y(lo + index * binHeight);
        context.fillRect(sideLeft, top, w(value), Math.max(1, bottom - top - 1));
      });
      context.globalAlpha = 1;
      if (curve.length > 0 && !discrete) {
        context.strokeStyle = resolveColor('var(--data-1)');
        context.lineWidth = 2;
        context.beginPath();
        curve.forEach(([value, d], index) => {
          const px = sideLeft + w(Number.isFinite(d) ? d : 0);
          const py = y(value);
          if (index === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        });
        context.stroke();
      }
      context.fillStyle = colors.text;
      context.font = colors.font;
      context.textAlign = 'left';
      context.textBaseline = 'top';
      context.fillText(`X(t) en t = ${sliceTime.toFixed(2)}`, sideLeft, height - MARGIN.bottom + 8);
    }
  }, [
    width,
    height,
    paths,
    horizon,
    revealed,
    steps,
    sliceIndex,
    slice,
    marginal,
    discrete,
    yDomain,
    theme,
  ]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <canvas ref={canvasRef} data-viz="" role="img" aria-label={label} />
    </div>
  );
}
