import { defaultTickFormat } from './svg/tickFormat.ts';

interface LinearScale {
  (value: number): number;
  ticks: (count?: number) => number[];
  domain: () => number[];
}

export interface CanvasTheme {
  axis: string;
  grid: string;
  text: string;
  font: string;
}

/** Reads the chart theme colors once per draw; canvas cannot use CSS variables. */
export function canvasTheme(): CanvasTheme {
  const style = getComputedStyle(document.documentElement);
  return {
    axis: style.getPropertyValue('--data-axis').trim() || '#666',
    grid: style.getPropertyValue('--data-grid').trim() || '#ddd',
    text: style.getPropertyValue('--color-text-muted').trim() || '#555',
    font: '11px Inter, system-ui, sans-serif',
  };
}

/** Sizes the backing store for the device pixel ratio and returns a scaled context. */
export function prepareCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): CanvasRenderingContext2D | null {
  const ratio = window.devicePixelRatio || 1;
  const pixelWidth = Math.round(width * ratio);
  const pixelHeight = Math.round(height * ratio);
  if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
  if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);
  return context;
}

export function drawBottomAxis(
  context: CanvasRenderingContext2D,
  scale: LinearScale,
  y: number,
  theme: CanvasTheme,
  label?: string,
  ticks = 6,
): void {
  const [d0 = 0, d1 = 1] = scale.domain();
  context.strokeStyle = theme.axis;
  context.fillStyle = theme.text;
  context.font = theme.font;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(scale(d0), y + 0.5);
  context.lineTo(scale(d1), y + 0.5);
  context.stroke();
  context.textAlign = 'center';
  context.textBaseline = 'top';
  for (const value of scale.ticks(ticks)) {
    const x = Math.round(scale(value)) + 0.5;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, y + 5);
    context.stroke();
    context.fillText(defaultTickFormat(value), x, y + 8);
  }
  if (label) {
    context.font = `550 12px Inter, system-ui, sans-serif`;
    context.fillText(label, (scale(d0) + scale(d1)) / 2, y + 24);
  }
}

export function drawLeftAxis(
  context: CanvasRenderingContext2D,
  scale: LinearScale,
  x: number,
  gridWidth: number,
  theme: CanvasTheme,
  ticks = 5,
): void {
  const [d0 = 0, d1 = 1] = scale.domain();
  context.font = theme.font;
  context.textAlign = 'right';
  context.textBaseline = 'middle';
  for (const value of scale.ticks(ticks)) {
    const y = Math.round(scale(value)) + 0.5;
    context.strokeStyle = theme.grid;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + gridWidth, y);
    context.stroke();
    context.strokeStyle = theme.axis;
    context.beginPath();
    context.moveTo(x - 5, y);
    context.lineTo(x, y);
    context.stroke();
    context.fillStyle = theme.text;
    context.fillText(defaultTickFormat(value), x - 8, y);
  }
  context.strokeStyle = theme.axis;
  context.beginPath();
  context.moveTo(x + 0.5, scale(d0));
  context.lineTo(x + 0.5, scale(d1));
  context.stroke();
}
