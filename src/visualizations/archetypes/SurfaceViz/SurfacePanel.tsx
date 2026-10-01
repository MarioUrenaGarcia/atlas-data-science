import { useState, type ReactNode } from 'react';
import type { Point2 } from '../../../lib/multivariable/index.ts';
import { CameraSliders } from '../../core/scene3d/CameraSliders.tsx';
import type { Camera, Vec3 } from '../../core/scene3d/projection.ts';
import { Scene3D, type Screen } from '../../core/scene3d/Scene3D.tsx';
import { SurfaceMesh } from '../../core/scene3d/SurfaceMesh.tsx';
import { relative, type FieldRange } from '../../core/plane/levels.ts';
import styles from './SurfaceViz.module.css';

const HALF = 2;
const HEIGHT = 1.5;
const EXTENT = 2.4;
const INITIAL_CAMERA: Camera = { azimuth: 35, elevation: 28 };

export interface SurfaceSpace {
  screen: Screen;
  /** Scene point of (x, y, value), in the same coordinates as the surface. */
  at: (x: number, y: number, value: number) => Vec3;
}

interface SurfacePanelProps {
  f: (x: number, y: number) => number;
  domain: [Point2, Point2];
  range: FieldRange;
  label: string;
  children?: (space: SurfaceSpace) => ReactNode;
}

/**
 * The surface z = f(x, y) in a turning 3D scene. The domain is mapped to a
 * square and the values to a fixed height band, so different functions are
 * comparable; overlays receive the same mapping.
 */
export function SurfacePanel({ f, domain, range, label, children }: SurfacePanelProps) {
  const [camera, setCamera] = useState<Camera>(INITIAL_CAMERA);
  const [[x0, x1], [y0, y1]] = domain;
  const toScene = (x: number, y: number): [number, number] => [
    -HALF + (2 * HALF * (x - x0)) / (x1 - x0),
    -HALF + (2 * HALF * (y - y0)) / (y1 - y0),
  ];
  const toZ = (value: number) => (2 * relative(value, range) - 1) * HEIGHT;
  const at = (x: number, y: number, value: number): Vec3 => {
    const [sx, sy] = toScene(x, y);
    return [sx, sy, toZ(value)];
  };
  return (
    <div>
      <Scene3D camera={camera} setCamera={setCamera} extent={EXTENT} label={label}>
        {(screen) => (
          <>
            <SurfaceMesh
              screen={screen}
              f={f}
              domain={domain}
              toZ={toZ}
              toScene={toScene}
              shade={(v) => relative(v, range)}
            />
            {children?.({ screen, at })}
          </>
        )}
      </Scene3D>
      <div className={styles.camera}>
        <CameraSliders camera={camera} setCamera={setCamera} />
      </div>
    </div>
  );
}
