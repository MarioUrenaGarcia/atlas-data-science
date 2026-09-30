import { useRef, useState } from 'react';
import type { Camera } from './projection.ts';

/** Degrees of rotation per pixel of pointer movement. */
const DRAG_SENSITIVITY = 0.5;
const MIN_ELEVATION = -80;
const MAX_ELEVATION = 80;

/**
 * Camera angles that can be changed by dragging the scene. The same angles are
 * exposed as sliders by the view, so the rotation also works from the keyboard.
 */
export function useCameraDrag(camera: Camera, setCamera: (camera: Camera) => void) {
  const start = useRef<{ x: number; y: number; camera: Camera } | null>(null);
  const [dragging, setDragging] = useState(false);
  const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    start.current = { x: event.clientX, y: event.clientY, camera };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };
  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const origin = start.current;
    if (!origin) return;
    setCamera({
      azimuth:
        (((origin.camera.azimuth + (event.clientX - origin.x) * DRAG_SENSITIVITY) % 360) + 360) %
        360,
      elevation: Math.max(
        MIN_ELEVATION,
        Math.min(
          MAX_ELEVATION,
          origin.camera.elevation + (event.clientY - origin.y) * DRAG_SENSITIVITY,
        ),
      ),
    });
  };
  const onPointerUp = () => {
    start.current = null;
    setDragging(false);
  };
  return { onPointerDown, onPointerMove, onPointerUp, dragging };
}
