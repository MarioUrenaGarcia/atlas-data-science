import { scaleLog } from 'd3-scale';
import { useEffect, useRef } from 'react';
import { useThemeColors } from '../../../components/graph/useThemeColors.ts';
import { canvasTheme, drawBottomAxis, prepareCanvas } from '../../core/canvas.ts';
import { resolveColor } from '../../core/colors.ts';
import { useResponsiveSize } from '../../core/useResponsiveSize.ts';

interface EventRasterProps {
  /** Per run, the 0-based indices where the event occurred. */
  runs: readonly (readonly number[])[];
  length: number;
  revealed: number;
  label: string;
}

const MARGIN = { top: 8, right: 16, bottom: 44, left: 52 };
const ROW_HEIGHT = 9;
const TICK_WIDTH = 2;

/**
 * One row per independent run and one tick per occurrence of A_n, on a
 * logarithmic n axis so that late occurrences remain visible. The last
 * occurrence of each run is drawn in the highlight color.
 */
export function EventRaster({ runs, length, revealed, label }: EventRasterProps) {
  const [containerRef, size] = useResponsiveSize<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeColors();
  const width = size.width;
  const height = MARGIN.top + MARGIN.bottom + runs.length * ROW_HEIGHT;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0) return;
    const context = prepareCanvas(canvas, width, height);
    if (!context) return;
    const colors = canvasTheme();
    const x = scaleLog()
      .domain([1, Math.max(2, length)])
      .range([MARGIN.left, width - MARGIN.right]);
    const powers = Array.from({ length: Math.floor(Math.log10(length)) + 1 }, (_, k) => 10 ** k);
    drawBottomAxis(context, x, height - MARGIN.bottom, colors, 'n', 6, powers);
    const normal = resolveColor('var(--data-1)');
    const last = resolveColor('var(--data-5)');
    const grid = resolveColor('var(--data-grid)');
    runs.forEach((hits, row) => {
      const y = MARGIN.top + row * ROW_HEIGHT;
      context.fillStyle = grid;
      context.fillRect(MARGIN.left, y + ROW_HEIGHT / 2, width - MARGIN.left - MARGIN.right, 1);
      const visible = hits.filter((index) => index < revealed);
      visible.forEach((index, k) => {
        context.fillStyle = k === visible.length - 1 ? last : normal;
        context.fillRect(x(index + 1) - TICK_WIDTH / 2, y + 1, TICK_WIDTH, ROW_HEIGHT - 2);
      });
    });
    context.strokeStyle = resolveColor('var(--data-2)');
    context.setLineDash([4, 3]);
    context.beginPath();
    context.moveTo(x(Math.max(1, revealed)), MARGIN.top);
    context.lineTo(x(Math.max(1, revealed)), height - MARGIN.bottom);
    context.stroke();
    context.setLineDash([]);
  }, [width, height, runs, length, revealed, theme]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <canvas ref={canvasRef} data-viz="" role="img" aria-label={label} />
    </div>
  );
}
