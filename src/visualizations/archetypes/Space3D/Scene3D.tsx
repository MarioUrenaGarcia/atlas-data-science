import type { ReactNode } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import svgStyles from '../../core/svg/svg.module.css';
import { useResponsiveSize } from '../../core/useResponsiveSize.ts';
import { project, type Camera, type Vec3 } from './projection.ts';
import styles from './Space3D.module.css';
import { useCameraDrag } from './useCamera.ts';

const ASPECT = 0.75;
const MIN_HEIGHT = 260;
const MAX_HEIGHT = 440;
const GRID_STEP = 1;
const AXIS_LABEL_OFFSET = 0.35;

export interface Screen {
  /** Screen position of a point in scene units. */
  at: (point: Vec3) => { x: number; y: number; depth: number };
  unit: number;
}

interface Scene3DProps {
  camera: Camera;
  setCamera: (camera: Camera) => void;
  /** Half the length of the drawn axes, in scene units. */
  extent: number;
  label: string;
  children: (screen: Screen) => ReactNode;
}

/**
 * Three-dimensional scene drawn in SVG with an orthographic camera: the xy
 * grid, the three axes and whatever the children draw. Dragging turns the
 * camera; the view also offers sliders for the same angles.
 */
export function Scene3D({ camera, setCamera, extent, label, children }: Scene3DProps) {
  const [ref, size] = useResponsiveSize<HTMLDivElement>();
  const drag = useCameraDrag(camera, setCamera);
  const width = Math.max(0, size.width);
  const height = Math.round(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, width * ASPECT)));
  const unit = Math.min(width, height) / (2.6 * extent);
  const at = (point: Vec3) => {
    const p = project(point, camera);
    return { x: width / 2 + p.x * unit, y: height / 2 - p.y * unit, depth: p.depth };
  };
  const ticks = Array.from(
    { length: 2 * Math.floor(extent / GRID_STEP) + 1 },
    (_, i) => (i - Math.floor(extent / GRID_STEP)) * GRID_STEP,
  );
  const axes: { end: Vec3; name: string }[] = [
    { end: [extent, 0, 0], name: 'x' },
    { end: [0, extent, 0], name: 'y' },
    { end: [0, 0, extent], name: 'z' },
  ];
  return (
    <div ref={ref} className={`${styles.scene} ${drag.dragging ? styles.dragging : ''}`}>
      {width > 0 && (
        <svg
          data-viz=""
          width={width}
          height={height}
          role="img"
          aria-label={label}
          onPointerDown={drag.onPointerDown}
          onPointerMove={drag.onPointerMove}
          onPointerUp={drag.onPointerUp}
          onPointerCancel={drag.onPointerUp}
        >
          <g aria-hidden="true">
            {ticks.map((t) => {
              const a = at([t, -extent, 0]);
              const b = at([t, extent, 0]);
              const c = at([-extent, t, 0]);
              const d = at([extent, t, 0]);
              return (
                <g key={t}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={DATA_COLORS.grid} />
                  <line x1={c.x} y1={c.y} x2={d.x} y2={d.y} stroke={DATA_COLORS.grid} />
                </g>
              );
            })}
            {axes.map(({ end, name }) => {
              const o = at([0, 0, 0]);
              const e = at(end);
              const back = at([-end[0], -end[1], -end[2]]);
              const tip = at([
                end[0] * (1 + AXIS_LABEL_OFFSET / extent),
                end[1] * (1 + AXIS_LABEL_OFFSET / extent),
                end[2] * (1 + AXIS_LABEL_OFFSET / extent),
              ]);
              return (
                <g key={name}>
                  <line
                    x1={back.x}
                    y1={back.y}
                    x2={o.x}
                    y2={o.y}
                    stroke="var(--data-axis)"
                    strokeDasharray="3 4"
                  />
                  <line
                    x1={o.x}
                    y1={o.y}
                    x2={e.x}
                    y2={e.y}
                    stroke="var(--data-axis)"
                    strokeWidth={1.5}
                  />
                  <text
                    x={tip.x}
                    y={tip.y}
                    dy="0.35em"
                    textAnchor="middle"
                    className={svgStyles.labelMuted}
                  >
                    {name}
                  </text>
                </g>
              );
            })}
          </g>
          {children({ at, unit })}
        </svg>
      )}
    </div>
  );
}
