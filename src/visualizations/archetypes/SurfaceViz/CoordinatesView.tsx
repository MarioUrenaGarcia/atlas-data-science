import { useMemo, useState } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Arrow3D } from '../../core/scene3d/Arrow3D.tsx';
import { CameraSliders } from '../../core/scene3d/CameraSliders.tsx';
import type { Camera, Vec3 } from '../../core/scene3d/projection.ts';
import { Scene3D, type Screen } from '../../core/scene3d/Scene3D.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { EqualPlane } from './EqualPlane.tsx';
import { num } from './levels.ts';
import styles from './SurfaceViz.module.css';

export type CoordinateSystem = 'polares' | 'cilindricas' | 'esfericas';

const STEPS = 90;
const STEPS_PER_SECOND = 10;
/** Increments of the coordinates that span the small element drawn around the point. */
const DR = 0.25;
const DANGLE = 0.25;
const DZ = 0.3;
const ARC_SAMPLES = 16;
const EXTENT = 2.4;
const PLANE: [[number, number], [number, number]] = [
  [-2.2, 2.2],
  [-2.2, 2.2],
];
const INITIAL_CAMERA: Camera = { azimuth: 35, elevation: 22 };
const NAMES: Record<CoordinateSystem, string> = {
  polares: 'Polares',
  cilindricas: 'Cilíndricas',
  esfericas: 'Esféricas',
};

interface CoordinatesViewProps {
  title: string;
  systems: readonly CoordinateSystem[];
}

const polar = (r: number, t: number): [number, number] => [r * Math.cos(t), r * Math.sin(t)];
const spherical = (rho: number, t: number, phi: number): Vec3 => [
  rho * Math.sin(phi) * Math.cos(t),
  rho * Math.sin(phi) * Math.sin(t),
  rho * Math.cos(phi),
];

/** Polyline through points of the scene, projected to the screen. */
function path(screen: Screen, points: Vec3[]): string {
  return points
    .map((p) => screen.at(p))
    .map((p) => `${p.x},${p.y}`)
    .join(' ');
}

/**
 * Polar, cylindrical and spherical coordinates. The point turns around the
 * vertical axis as θ grows; the small element around it, spanned by small
 * increments of each coordinate, is not a square but a curved patch whose
 * size carries the factor r, or ρ² sen φ: the Jacobian of the change.
 */
export function CoordinatesView({ title, systems }: CoordinatesViewProps) {
  const definitions = useMemo(() => {
    const single = systems.length === 1;
    // Controls used by only one system are hidden while another one is selected.
    const only = (id: CoordinateSystem) =>
      single ? {} : { shownWhen: { key: 'sistema', values: [id] } };
    return [
      ...(single
        ? []
        : [
            {
              type: 'select' as const,
              key: 'sistema',
              label: 'Sistema de coordenadas',
              options: systems.map((id) => ({ value: id, label: NAMES[id] })),
              default: systems[0] ?? 'polares',
            },
          ]),
      { type: 'number' as const, key: 'radio', label: 'Distancia al origen o al eje', symbol: 'r', min: 0.3, max: 1.8, step: 0.05, default: 1.2, digits: 2 },
      ...(systems.includes('cilindricas')
        ? [{ type: 'number' as const, key: 'altura', label: 'Altura', symbol: 'z', min: 0.2, max: 1.6, step: 0.05, default: 0.9, digits: 2, ...only('cilindricas') }]
        : []),
      ...(systems.includes('esfericas')
        ? [{ type: 'number' as const, key: 'polar', label: 'Ángulo desde el eje z', symbol: 'φ', unit: '°', min: 10, max: 80, step: 1, default: 50, ...only('esfericas') }]
        : []),
    ];
  }, [systems]);
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string | number>;
  const system = (systems.length > 1 ? String(values.sistema) : (systems[0] ?? 'polares')) as CoordinateSystem;
  const radius = Number(values.radio);
  const [camera, setCamera] = useState<Camera>(INITIAL_CAMERA);
  const [step, setStep] = useState(10);
  const playback = usePlayback({
    step: () => setStep((value) => (value + 1) % STEPS),
    reset: () => setStep(10),
    rate: STEPS_PER_SECOND,
  });
  const theta = (2 * Math.PI * step) / STEPS;
  const thetaDeg = (theta * 180) / Math.PI;
  const z = Number(values.altura ?? 0.9);
  const phi = (Number(values.polar ?? 50) * Math.PI) / 180;

  let point: Vec3;
  let conversion: string;
  let element: string;
  let elementValue: number;
  let factor: number;
  if (system === 'polares') {
    const [x, y] = polar(radius, theta);
    point = [x, y, 0];
    factor = radius;
    elementValue = radius * DR * DANGLE;
    conversion = `x = r\\cos\\theta = ${num(x, 3)},\\quad y = r\\operatorname{sen}\\theta = ${num(y, 3)}`;
    element = `dA = r\\,dr\\,d\\theta \\approx ${num(radius, 2)} \\cdot ${DR} \\cdot ${DANGLE} = ${num(elementValue, 4)}`;
  } else if (system === 'cilindricas') {
    const [x, y] = polar(radius, theta);
    point = [x, y, z];
    factor = radius;
    elementValue = radius * DR * DANGLE * DZ;
    conversion = `x = ${num(x, 3)},\\quad y = ${num(y, 3)},\\quad z = ${num(z, 3)}`;
    element = `dV = r\\,dr\\,d\\theta\\,dz \\approx ${num(radius, 2)} \\cdot ${DR} \\cdot ${DANGLE} \\cdot ${DZ} = ${num(elementValue, 4)}`;
  } else {
    point = spherical(radius, theta, phi);
    factor = radius * radius * Math.sin(phi);
    elementValue = factor * DR * DANGLE * DANGLE;
    conversion = `x = \\rho\\operatorname{sen}\\varphi\\cos\\theta = ${num(point[0], 3)},\\quad y = ${num(point[1], 3)},\\quad z = \\rho\\cos\\varphi = ${num(point[2], 3)}`;
    element = `dV = \\rho^2 \\operatorname{sen}\\varphi\\,d\\rho\\,d\\theta\\,d\\varphi \\approx ${num(factor, 3)} \\cdot ${DR} \\cdot ${DANGLE} \\cdot ${DANGLE} = ${num(elementValue, 4)}`;
  }
  const description =
    `Coordenadas ${NAMES[system].toLowerCase()}: θ = ${num(thetaDeg, 0)} grados lleva al punto (${num(point[0], 2)}, ${num(point[1], 2)}, ${num(point[2], 2)}). ` +
    `El elemento alrededor del punto mide aproximadamente ${num(elementValue, 4)}, con factor de escala ${num(factor, 3)}.`;

  const arc = (r: number, t0: number, t1: number, height = 0): Vec3[] =>
    Array.from({ length: ARC_SAMPLES + 1 }, (_, i) => {
      const t = t0 + ((t1 - t0) * i) / ARC_SAMPLES;
      return [r * Math.cos(t), r * Math.sin(t), height];
    });

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'θ', value: `${num(thetaDeg, 0)}°` },
        { label: 'Punto (x, y, z)', value: `(${num(point[0], 2)}, ${num(point[1], 2)}, ${num(point[2], 2)})` },
        { label: 'Factor de escala', value: num(factor, 3), color: DATA_COLORS.secondary },
        { label: 'Tamaño del elemento', value: num(elementValue, 4), color: DATA_COLORS.highlight },
      ]}
      legend={[
        { label: 'Punto', color: DATA_COLORS.highlight, shape: 'circle' },
        { label: 'Elemento de área o volumen', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={conversion} />
      </p>
      <p className={styles.formula}>
        <Latex tex={element} />
      </p>
      {system === 'polares' ? (
        <EqualPlane domain={PLANE} label={description}>
          {({ x, y }) => {
            const patch = [
              ...Array.from({ length: ARC_SAMPLES + 1 }, (_, i) => polar(radius, theta + (DANGLE * i) / ARC_SAMPLES)),
              ...Array.from({ length: ARC_SAMPLES + 1 }, (_, i) => polar(radius + DR, theta + DANGLE - (DANGLE * i) / ARC_SAMPLES)),
            ];
            return (
              <g aria-hidden="true">
                {[0.5, 1, 1.5, 2].map((r) => (
                  <circle key={r} cx={x(0)} cy={y(0)} r={x(r) - x(0)} fill="none" stroke={DATA_COLORS.grid} />
                ))}
                {Array.from({ length: 12 }, (_, k) => (
                  <line key={k} x1={x(0)} y1={y(0)} x2={x(2.2 * Math.cos((k * Math.PI) / 6))} y2={y(2.2 * Math.sin((k * Math.PI) / 6))} stroke={DATA_COLORS.grid} />
                ))}
                <polygon points={patch.map(([px, py]) => `${x(px)},${y(py)}`).join(' ')} fill={DATA_COLORS.secondary} fillOpacity={0.5} stroke={DATA_COLORS.secondary} strokeWidth={2} />
                <line x1={x(0)} y1={y(0)} x2={x(point[0])} y2={y(point[1])} stroke={DATA_COLORS.text} strokeWidth={2} />
                <circle cx={x(point[0])} cy={y(point[1])} r={5} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
              </g>
            );
          }}
        </EqualPlane>
      ) : (
        <div>
          <Scene3D camera={camera} setCamera={setCamera} extent={EXTENT} label={description}>
            {(screen) => {
              const foot: Vec3 = [point[0], point[1], 0];
              const flatRadius = Math.hypot(point[0], point[1]);
              let patch: Vec3[];
              if (system === 'cilindricas') {
                patch = [...arc(radius, theta, theta + DANGLE, z), ...arc(radius + DR, theta + DANGLE, theta, z)];
              } else {
                patch = [
                  ...Array.from({ length: ARC_SAMPLES + 1 }, (_, i) => spherical(radius, theta + (DANGLE * i) / ARC_SAMPLES, phi)),
                  ...Array.from({ length: ARC_SAMPLES + 1 }, (_, i) => spherical(radius, theta + DANGLE, phi + (DANGLE * i) / ARC_SAMPLES)),
                  ...Array.from({ length: ARC_SAMPLES + 1 }, (_, i) => spherical(radius, theta + DANGLE - (DANGLE * i) / ARC_SAMPLES, phi + DANGLE)),
                  ...Array.from({ length: ARC_SAMPLES + 1 }, (_, i) => spherical(radius, theta, phi + DANGLE - (DANGLE * i) / ARC_SAMPLES)),
                ];
              }
              const p = screen.at(point);
              return (
                <g aria-hidden="true">
                  <polyline points={path(screen, arc(flatRadius, 0, 2 * Math.PI))} fill="none" stroke={DATA_COLORS.grid} strokeWidth={1.5} />
                  <polyline points={path(screen, [[0, 0, 0], foot, point])} fill="none" stroke={DATA_COLORS.text} strokeDasharray="4 4" />
                  <polygon points={path(screen, patch)} fill={DATA_COLORS.secondary} fillOpacity={0.5} stroke={DATA_COLORS.secondary} strokeWidth={2} />
                  <Arrow3D screen={screen} to={point} color={DATA_COLORS.highlight} width={2.5} />
                  <circle cx={p.x} cy={p.y} r={5} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
                </g>
              );
            }}
          </Scene3D>
          <div className={styles.camera}>
            <CameraSliders camera={camera} setCamera={setCamera} />
          </div>
        </div>
      )}
    </VizFrame>
  );
}
