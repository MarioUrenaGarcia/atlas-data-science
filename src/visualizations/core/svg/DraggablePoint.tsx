import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import styles from './svg.module.css';

interface DraggablePointProps {
  x: number;
  y: number;
  radius?: number;
  color: string;
  label: string;
  /** Value announced to assistive technology, such as "x = 2.4, y = 1.1". */
  valueText: string;
  /** Receives the pointer position in SVG pixel coordinates. */
  onDrag: (x: number, y: number) => void;
  /** Keyboard nudges in pixels; arrows move by `step`, Shift+arrows by 5 steps. */
  step?: number;
  /** Restricts dragging to one axis. */
  axis?: 'x' | 'y' | 'both';
  onDragEnd?: () => void;
}

/**
 * A point that can be moved with the pointer (mouse, pen or touch) and with
 * the keyboard. Pointer capture keeps the drag alive outside the circle.
 */
export function DraggablePoint({
  x,
  y,
  radius = 7,
  color,
  label,
  valueText,
  onDrag,
  step = 4,
  axis = 'both',
  onDragEnd,
}: DraggablePointProps) {
  const dragging = useRef(false);

  const toSvg = (event: PointerEvent<SVGGElement>): [number, number] | null => {
    const svg = (event.currentTarget as SVGGElement).ownerSVGElement;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(matrix.inverse());
    return [local.x, local.y];
  };

  const move = (event: PointerEvent<SVGGElement>) => {
    if (!dragging.current) return;
    const position = toSvg(event);
    if (!position) return;
    onDrag(axis === 'y' ? x : position[0], axis === 'x' ? y : position[1]);
  };

  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    const amount = event.shiftKey ? step * 5 : step;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-amount, 0],
      ArrowRight: [amount, 0],
      ArrowUp: [0, -amount],
      ArrowDown: [0, amount],
    };
    const delta = moves[event.key];
    if (!delta) return;
    event.preventDefault();
    event.stopPropagation();
    onDrag(axis === 'y' ? x : x + delta[0], axis === 'x' ? y : y + delta[1]);
  };

  return (
    <g
      className={styles.handle}
      tabIndex={0}
      role="slider"
      aria-label={label}
      aria-valuetext={valueText}
      onKeyDown={onKeyDown}
      onPointerDown={(event) => {
        event.stopPropagation();
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={move}
      onPointerUp={(event) => {
        dragging.current = false;
        event.currentTarget.releasePointerCapture(event.pointerId);
        onDragEnd?.();
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      {/* A larger transparent target makes touch dragging practical. */}
      <circle cx={x} cy={y} r={Math.max(18, radius + 8)} fill="transparent" />
      <circle cx={x} cy={y} r={radius} fill={color} stroke="var(--color-surface)" strokeWidth={2} />
      <circle cx={x} cy={y} r={radius + 4} className={styles.handleRing} />
    </g>
  );
}
