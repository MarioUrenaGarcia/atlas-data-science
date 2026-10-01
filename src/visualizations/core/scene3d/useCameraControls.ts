import { useState } from 'react';
import { usePlayback } from '../usePlayback.ts';
import type { Camera } from './projection.ts';

const INITIAL_CAMERA: Camera = { azimuth: 35, elevation: 25 };
const DEGREES_PER_STEP = 1;
const STEPS_PER_SECOND = 30;

/**
 * Camera state for a 3D view: playing turns the scene slowly around the
 * vertical axis so depth becomes visible, and resetting returns to the
 * initial angle.
 */
export function useCameraControls() {
  const [camera, setCamera] = useState<Camera>(INITIAL_CAMERA);
  const playback = usePlayback({
    step: () =>
      setCamera((current) => ({ ...current, azimuth: (current.azimuth + DEGREES_PER_STEP) % 360 })),
    reset: () => setCamera(INITIAL_CAMERA),
    rate: STEPS_PER_SECOND,
  });
  return { camera, setCamera, playback };
}
