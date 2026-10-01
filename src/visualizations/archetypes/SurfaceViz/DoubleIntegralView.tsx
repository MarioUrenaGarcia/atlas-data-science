import { useMemo, useState } from 'react';
import { doubleIntegral, FIELDS, type Field2, type Point2 } from '../../../lib/multivariable/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CameraSliders } from '../../core/scene3d/CameraSliders.tsx';
import type { Camera, Vec3 } from '../../core/scene3d/projection.ts';
import { Scene3D } from '../../core/scene3d/Scene3D.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { EqualPlane } from './EqualPlane.tsx';
import { num } from './levels.ts';
import styles from './SurfaceViz.module.css';

/** Grid sizes n of the animation: the rectangle is cut into n by n cells. */
const SIZES = [1, 2, 4, 8, 16];
const STEPS_PER_SECOND = 0.7;
const HALF = 2;
const HEIGHT = 2.2;
const EXTENT = 2.6;
const REFERENCE_CELLS = 600;
const INITIAL_CAMERA: Camera = { azimuth: 35, elevation: 28 };

export interface IntegralCase {
  campo: string;
  /** Rectangle [x range, y range] of integration. */
  region: [Point2, Point2];
}

interface DoubleIntegralViewProps {
  title: string;
  cases: readonly IntegralCase[];
}

const caseName = (c: IntegralCase) =>
  `${c.campo} en [${c.region[0][0]}, ${c.region[0][1]}] × [${c.region[1][0]}, ${c.region[1][1]}]`;

/**
 * The double integral as the limit of volumes of columns. The rectangle is
 * cut into n by n cells; over each cell stands a column as tall as f at the
 * cell's center. As n doubles, the total volume approaches the integral.
 */
export function DoubleIntegralView({ title, cases }: DoubleIntegralViewProps) {
  const definitions = useMemo(
    () =>
      cases.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'caso',
              label: 'Función y región',
              options: cases.map((c, index) => ({ value: String(index), label: caseName(c) })),
              default: '0',
            },
          ]
        : [],
    [cases],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const chosen = cases[Number(values.caso ?? 0)] ?? (cases[0] as IntegralCase);
  const field = FIELDS[chosen.campo] ?? (FIELDS.paraboloide as Field2);
  const [[a, b], [c, d]] = chosen.region;
  const [camera, setCamera] = useState<Camera>(INITIAL_CAMERA);
  const [stage, setStage] = useState(0);
  const playback = usePlayback({
    step: () => setStage((value) => Math.min(SIZES.length - 1, value + 1)),
    reset: () => setStage(0),
    rate: STEPS_PER_SECOND,
    done: stage >= SIZES.length - 1,
  });
  const n = SIZES[stage] ?? 1;
  const exact = useMemo(() => doubleIntegral(field.f, [a, b], [c, d], REFERENCE_CELLS), [field, a, b, c, d]);
  const dx = (b - a) / n;
  const dy = (d - c) / n;
  const cells = Array.from({ length: n * n }, (_, k) => {
    const i = k % n;
    const j = Math.floor(k / n);
    const cx = a + (i + 0.5) * dx;
    const cy = c + (j + 0.5) * dy;
    return { i, j, height: field.f(cx, cy) };
  });
  const sum = cells.reduce((total, cell) => total + cell.height * dx * dy, 0);
  const top = Math.max(...cells.map((cell) => Math.abs(cell.height)), ...[0.5, 0.25, 0.75].map((t) => Math.abs(field.f(a + t * (b - a), c + t * (d - c)))), 1e-9);
  const scale = Math.max(b - a, d - c);
  const toScene = (x: number, y: number, z: number): Vec3 => [
    -HALF + (2 * HALF * (x - a)) / scale,
    -HALF + (2 * HALF * (y - c)) / scale,
    (HEIGHT * z) / top - HEIGHT / 2,
  ];
  const description =
    `Integral de ${field.id} sobre [${a}, ${b}] × [${c}, ${d}] con ${n} por ${n} celdas: la suma de los volúmenes es ${num(sum, 4)} ` +
    `y la integral vale ${num(exact, 4)}; el error es ${num(Math.abs(sum - exact), 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={definitions.length > 0 ? { ...parameters, values } : undefined}
      readouts={[
        { label: 'Celdas', value: `${n} × ${n} = ${n * n}` },
        { label: 'Área de cada celda', value: num(dx * dy, 4) },
        { label: 'Suma de volúmenes', value: num(sum, 4), color: DATA_COLORS.primary },
        { label: 'Integral', value: num(exact, 4), color: DATA_COLORS.secondary },
        { label: 'Error', value: num(Math.abs(sum - exact), 4) },
      ]}
      legend={[
        { label: 'Columna de altura f en el centro de la celda', color: DATA_COLORS.primary },
        { label: 'Columna donde f es negativa, que resta', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\iint_R \\big(${field.latex}\\big)\\,dA \\approx \\sum_{i=1}^{${n}}\\sum_{j=1}^{${n}} f(x_i^*, y_j^*)\\,\\Delta x\\,\\Delta y = ${num(sum, 4)},\\qquad \\iint_R f\\,dA = ${num(exact, 4)}`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Columnas sobre la región</p>
          <Scene3D camera={camera} setCamera={setCamera} extent={EXTENT} label={description}>
            {(screen) => {
              const faces: { points: { x: number; y: number }[]; depth: number; shade: number; negative: boolean; key: string }[] = [];
              for (const { i, j, height } of cells) {
                const xa = a + i * dx;
                const ya = c + j * dy;
                const corners: Point2[] = [
                  [xa, ya],
                  [xa + dx, ya],
                  [xa + dx, ya + dy],
                  [xa, ya + dy],
                ];
                const topFace = corners.map(([x, y]) => screen.at(toScene(x, y, height)));
                faces.push({
                  points: topFace,
                  depth: topFace.reduce((total, p) => total + p.depth, 0) / 4,
                  shade: 0.85,
                  negative: height < 0,
                  key: `t${i}-${j}`,
                });
                corners.forEach(([x, y], side) => {
                  const [nx, ny] = corners[(side + 1) % 4] as Point2;
                  const quad = [
                    screen.at(toScene(x, y, 0)),
                    screen.at(toScene(nx, ny, 0)),
                    screen.at(toScene(nx, ny, height)),
                    screen.at(toScene(x, y, height)),
                  ];
                  faces.push({
                    points: quad,
                    depth: quad.reduce((total, p) => total + p.depth, 0) / 4,
                    shade: side % 2 === 0 ? 0.55 : 0.4,
                    negative: height < 0,
                    key: `s${i}-${j}-${side}`,
                  });
                });
              }
              faces.sort((p, q) => q.depth - p.depth);
              return (
                <g aria-hidden="true">
                  {faces.map((face) => (
                    <polygon
                      key={face.key}
                      points={face.points.map((p) => `${p.x},${p.y}`).join(' ')}
                      fill={face.negative ? DATA_COLORS.secondary : DATA_COLORS.primary}
                      fillOpacity={face.shade}
                      stroke="var(--color-surface)"
                      strokeWidth={n > 8 ? 0.4 : 1}
                    />
                  ))}
                </g>
              );
            }}
          </Scene3D>
          <div className={styles.camera}>
            <CameraSliders camera={camera} setCamera={setCamera} />
          </div>
        </div>
        <div>
          <p className={styles.panelTitle}>La región vista desde arriba, con los centros de las celdas</p>
          <EqualPlane domain={chosen.region} label={`Rejilla de celdas. ${description}`}>
            {({ x, y }) => (
              <g aria-hidden="true">
                {cells.map(({ i, j, height }) => (
                  <rect
                    key={`${i}-${j}`}
                    x={x(a + i * dx)}
                    y={y(c + (j + 1) * dy)}
                    width={x(a + dx) - x(a)}
                    height={y(c) - y(c + dy)}
                    fill={height < 0 ? DATA_COLORS.secondary : DATA_COLORS.primary}
                    fillOpacity={0.1 + 0.6 * (Math.abs(height) / top)}
                    stroke="var(--color-surface)"
                  />
                ))}
                {n <= 8 &&
                  cells.map(({ i, j }) => (
                    <circle key={`c${i}-${j}`} cx={x(a + (i + 0.5) * dx)} cy={y(c + (j + 0.5) * dy)} r={3} fill={DATA_COLORS.highlight} />
                  ))}
              </g>
            )}
          </EqualPlane>
        </div>
      </div>
    </VizFrame>
  );
}
