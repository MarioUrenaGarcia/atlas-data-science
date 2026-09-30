import { NumberControl } from '../../core/NumberControl.tsx';
import type { Camera } from './projection.ts';

const AZIMUTH = {
  type: 'number',
  key: 'azimut',
  label: 'Giro horizontal',
  min: 0,
  max: 359,
  step: 1,
  default: 35,
  digits: 0,
} as const;
const ELEVATION = {
  type: 'number',
  key: 'elevacion',
  label: 'Inclinación',
  min: -80,
  max: 80,
  step: 1,
  default: 25,
  digits: 0,
} as const;

interface CameraSlidersProps {
  camera: Camera;
  setCamera: (camera: Camera) => void;
}

/** Keyboard-accessible alternative to dragging the 3D scene. */
export function CameraSliders({ camera, setCamera }: CameraSlidersProps) {
  return (
    <>
      <NumberControl
        definition={AZIMUTH}
        value={Math.round(camera.azimuth)}
        onChange={(azimuth) => setCamera({ ...camera, azimuth })}
        disabled={false}
      />
      <NumberControl
        definition={ELEVATION}
        value={Math.round(camera.elevation)}
        onChange={(elevation) => setCamera({ ...camera, elevation })}
        disabled={false}
      />
    </>
  );
}
