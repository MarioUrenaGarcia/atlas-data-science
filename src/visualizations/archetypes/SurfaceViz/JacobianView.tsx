import { useMemo, useState } from 'react';
import { det2, MAPS, type Map2, type Point2 } from '../../../lib/multivariable/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { EqualPlane } from './EqualPlane.tsx';
import { num } from './levels.ts';
import styles from './SurfaceViz.module.css';

const GRID_LINES = 8;
const LINE_SAMPLES = 40;
const EDGE_SAMPLES = 16;
/** Side of the small square as a fraction of the input window, shrinking by RATIO each step. */
const SIDE0 = 0.3;
const RATIO = 0.8;
const STEPS = 14;
const STEPS_PER_SECOND = 1.5;
/** Margin added around the image of the input window. */
const PAD = 0.1;
const MAP_NAMES: Record<string, string> = {
  polares: 'Coordenadas polares',
  cuadrado: 'Cuadrado complejo',
  lineal: 'Transformación lineal',
  onda: 'Deformación ondulada',
};

interface JacobianViewProps {
  title: string;
  maps: readonly string[];
  /** Base point of the small square, as fractions of the input window. */
  at: Point2;
}

/** Signed area of a closed polygon by the shoelace formula. */
function polygonArea(points: readonly Point2[]): number {
  let sum = 0;
  points.forEach(([x, y], index) => {
    const [nx, ny] = points[(index + 1) % points.length] as Point2;
    sum += x * ny - nx * y;
  });
  return sum / 2;
}

/**
 * The Jacobian matrix as the local linear map. A small square of the input
 * plane is sent to a curved patch; its sides are nearly the columns of J
 * scaled by the side, so the patch is nearly a parallelogram of area |det J|
 * times the area of the square. As the square shrinks, the area ratio tends
 * to |det J|.
 */
export function JacobianView({ title, maps, at }: JacobianViewProps) {
  const definitions = useMemo(
    () => [
      ...(maps.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'mapa',
              label: 'Transformación',
              options: maps.map((id) => ({ value: id, label: MAP_NAMES[id] ?? id })),
              default: maps[0] ?? 'polares',
            },
          ]
        : []),
      {
        type: 'number' as const,
        key: 'u',
        label: 'Posición del cuadrado, primera coordenada (fracción de la ventana)',
        min: 0.05,
        max: 0.75,
        step: 0.05,
        default: at[0],
        digits: 2,
      },
      {
        type: 'number' as const,
        key: 'v',
        label: 'Posición del cuadrado, segunda coordenada (fracción de la ventana)',
        min: 0.05,
        max: 0.75,
        step: 0.05,
        default: at[1],
        digits: 2,
      },
    ],
    [maps, at],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string | number>;
  const id = maps.length > 1 ? String(values.mapa) : (maps[0] ?? 'polares');
  const map = MAPS[id] ?? (MAPS.polares as Map2);
  const [[u0, u1], [v0, v1]] = map.domain;
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });

  const fraction = SIDE0 * RATIO ** step;
  const du = fraction * (u1 - u0);
  const dv = fraction * (v1 - v0);
  const ua = u0 + Number(values.u) * (u1 - u0);
  const va = v0 + Number(values.v) * (v1 - v0);
  const jacobian = map.jacobian(ua, va) as [[number, number], [number, number]];
  const det = det2(jacobian);
  const square: Point2[] = [
    ...Array.from({ length: EDGE_SAMPLES }, (_, i) => [ua + (du * i) / EDGE_SAMPLES, va] as Point2),
    ...Array.from({ length: EDGE_SAMPLES }, (_, i) => [ua + du, va + (dv * i) / EDGE_SAMPLES] as Point2),
    ...Array.from({ length: EDGE_SAMPLES }, (_, i) => [ua + du - (du * i) / EDGE_SAMPLES, va + dv] as Point2),
    ...Array.from({ length: EDGE_SAMPLES }, (_, i) => [ua, va + dv - (dv * i) / EDGE_SAMPLES] as Point2),
  ];
  const image = square.map(([u, v]) => map.map(u, v));
  const imageArea = Math.abs(polygonArea(image));
  const ratio = imageArea / (du * dv);
  const origin = map.map(ua, va);
  const parallelogram: Point2[] = [
    origin,
    [origin[0] + jacobian[0][0] * du, origin[1] + jacobian[1][0] * du],
    [origin[0] + jacobian[0][0] * du + jacobian[0][1] * dv, origin[1] + jacobian[1][0] * du + jacobian[1][1] * dv],
    [origin[0] + jacobian[0][1] * dv, origin[1] + jacobian[1][1] * dv],
  ];

  const outputDomain = useMemo((): [Point2, Point2] => {
    let [xmin, xmax, ymin, ymax] = [Infinity, -Infinity, Infinity, -Infinity];
    for (let i = 0; i <= LINE_SAMPLES; i += 1) {
      for (let j = 0; j <= LINE_SAMPLES; j += 1) {
        const [x, y] = map.map(u0 + ((u1 - u0) * i) / LINE_SAMPLES, v0 + ((v1 - v0) * j) / LINE_SAMPLES);
        xmin = Math.min(xmin, x);
        xmax = Math.max(xmax, x);
        ymin = Math.min(ymin, y);
        ymax = Math.max(ymax, y);
      }
    }
    const pad = PAD * Math.max(xmax - xmin, ymax - ymin);
    return [
      [xmin - pad, xmax + pad],
      [ymin - pad, ymax + pad],
    ];
  }, [map, u0, u1, v0, v1]);

  const gridLines = (transform: (u: number, v: number) => Point2) => [
    ...Array.from({ length: GRID_LINES + 1 }, (_, i) =>
      Array.from({ length: LINE_SAMPLES + 1 }, (_, j) =>
        transform(u0 + ((u1 - u0) * i) / GRID_LINES, v0 + ((v1 - v0) * j) / LINE_SAMPLES),
      ),
    ),
    ...Array.from({ length: GRID_LINES + 1 }, (_, i) =>
      Array.from({ length: LINE_SAMPLES + 1 }, (_, j) =>
        transform(u0 + ((u1 - u0) * j) / LINE_SAMPLES, v0 + ((v1 - v0) * i) / GRID_LINES),
      ),
    ),
  ];
  const [a, b] = map.inputs;
  const description =
    `${MAP_NAMES[id] ?? id}. Cuadrado de lado ${num(du, 4)} por ${num(dv, 4)} en (${a}, ${b}) = (${num(ua, 2)}, ${num(va, 2)}). ` +
    `Su imagen tiene área ${num(imageArea, 6)}; el cociente de áreas es ${num(ratio, 4)} y |det J| = ${num(Math.abs(det), 4)}.`;
  const tex = (matrix: [[number, number], [number, number]]) =>
    `\\begin{pmatrix} ${num(matrix[0][0], 3)} & ${num(matrix[0][1], 3)} \\\\ ${num(matrix[1][0], 3)} & ${num(matrix[1][1], 3)} \\end{pmatrix}`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: `Punto (${a}, ${b})`, value: `(${num(ua, 2)}, ${num(va, 2)})` },
        { label: 'Área del cuadrado', value: num(du * dv, 6), color: DATA_COLORS.tertiary },
        { label: 'Área de la imagen', value: num(imageArea, 6), color: DATA_COLORS.highlight },
        { label: 'Cociente de áreas', value: num(ratio, 4) },
        { label: '|det J|', value: num(Math.abs(det), 4), color: DATA_COLORS.secondary },
      ]}
      legend={[
        { label: 'Cuadrado pequeño', color: DATA_COLORS.tertiary },
        { label: 'Su imagen', color: DATA_COLORS.highlight },
        { label: 'Paralelogramo de las columnas de J', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`${map.latex},\\qquad \\mathbf{J}(${num(ua, 2)}, ${num(va, 2)}) = ${tex(jacobian)},\\qquad \\det \\mathbf{J} = ${num(det, 4)}`} />
      </p>
      <p className={styles.formula}>
        <Latex
          tex={`\\frac{\\text{área de la imagen}}{\\text{área del cuadrado}} = \\frac{${num(imageArea, 6)}}{${num(du * dv, 6)}} = ${num(ratio, 4)} \\ \\to\\ \\lvert \\det \\mathbf{J} \\rvert = ${num(Math.abs(det), 4)}`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Plano de entrada ({a}, {b})</p>
          <EqualPlane domain={map.domain} label={`Rejilla de entrada. ${description}`} xLabel={a} yLabel={b}>
            {({ x, y }) => (
              <g aria-hidden="true">
                {gridLines((u, v) => [u, v]).map((line, index) => (
                  <polyline key={index} points={line.map(([p, q]) => `${x(p)},${y(q)}`).join(' ')} fill="none" stroke={DATA_COLORS.grid} />
                ))}
                <polygon points={square.map(([p, q]) => `${x(p)},${y(q)}`).join(' ')} fill={DATA_COLORS.tertiary} fillOpacity={0.5} stroke={DATA_COLORS.tertiary} strokeWidth={2} />
              </g>
            )}
          </EqualPlane>
        </div>
        <div>
          <p className={styles.panelTitle}>Imagen en el plano (x, y)</p>
          <EqualPlane domain={outputDomain} label={`Rejilla transformada. ${description}`}>
            {({ x, y }) => (
              <g aria-hidden="true">
                {gridLines(map.map).map((line, index) => (
                  <polyline key={index} points={line.map(([p, q]) => `${x(p)},${y(q)}`).join(' ')} fill="none" stroke={DATA_COLORS.grid} />
                ))}
                <polygon points={image.map(([p, q]) => `${x(p)},${y(q)}`).join(' ')} fill={DATA_COLORS.highlight} fillOpacity={0.5} stroke={DATA_COLORS.highlight} strokeWidth={2} />
                <polygon points={parallelogram.map(([p, q]) => `${x(p)},${y(q)}`).join(' ')} fill="none" stroke={DATA_COLORS.secondary} strokeWidth={2} strokeDasharray="5 4" />
              </g>
            )}
          </EqualPlane>
        </div>
      </div>
    </VizFrame>
  );
}
