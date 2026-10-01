import { scaleLinear, scaleSqrt } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { hexagonPath, hexbin } from '../../../lib/stats/hexbin.ts';
import { pearson } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ChartGallery.module.css';

type ScatterMode = 'puntos' | 'transparencia' | 'dispersion-aleatoria' | 'hexagonos';

const BATCHES = 20;
const BATCHES_PER_SECOND = 6;
const DOT = 3;
const HEX_RADIUS = 12;
const LOW_OPACITY = 0.12;
const JITTER_FRACTION = 0.35;

const MODE_NAMES: Record<ScatterMode, string> = {
  puntos: 'Puntos opacos',
  transparencia: 'Puntos con transparencia',
  'dispersion-aleatoria': 'Desplazamiento aleatorio pequeño',
  hexagonos: 'Hexágonos con conteos',
};

interface ScatterViewProps {
  title: string;
  points: [number, number][];
  xLabel: string;
  yLabel: string;
  mode: ScatterMode;
  /** Step to which x was rounded, used to size the jitter. */
  rounding?: number;
  /** Initial radius of the hexagons in pixels. */
  radius?: number;
}

/**
 * A scatter plot that fills up in batches. When many points overlap, the
 * rendering can switch to transparency, a small random displacement or
 * hexagonal bins that count the points in each region.
 */
export function ScatterView({
  title,
  points,
  xLabel,
  yLabel,
  mode: mode0,
  rounding,
  radius = HEX_RADIUS,
}: ScatterViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select',
        key: 'vista',
        label: 'Forma de dibujar',
        options: (Object.keys(MODE_NAMES) as ScatterMode[]).map((value) => ({
          value,
          label: MODE_NAMES[value],
        })),
        default: mode0,
      },
      {
        type: 'number',
        key: 'radio',
        label: 'Radio de los hexágonos (px)',
        min: 5,
        max: 30,
        step: 1,
        default: radius,
        digits: 0,
      },
    ],
    [mode0, radius],
  );
  const parameters = useParameters(definitions);
  const mode = String(parameters.values.vista) as ScatterMode;
  const hexRadius = Number(parameters.values.radio);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${points.length}|${run}`, () =>
    reducedMotion ? BATCHES : 1,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(BATCHES, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: BATCHES_PER_SECOND,
    done: shown >= BATCHES,
  });
  const visible = points.slice(0, Math.round((points.length * shown) / BATCHES));
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const pad = (values: number[]) => {
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const d = (hi - lo) * 0.05 || 1;
    return [lo - d, hi + d] as [number, number];
  };
  const jitter = useMemo(() => {
    const random = new Random(points.length);
    const width = (rounding ?? 0) * JITTER_FRACTION;
    return points.map(() => random.uniform(-width, width));
  }, [points, rounding]);
  const r = pearson(
    visible.map((p) => p[0]),
    visible.map((p) => p[1]),
  );
  const distinct = new Set(visible.map((p) => `${p[0]},${p[1]}`)).size;
  const header = `n = ${visible.length},\\quad \\text{posiciones distintas} = ${distinct},\\quad r = ${formatNumber(r, 3)}`;
  const description =
    `Diagrama de dispersión de ${visible.length} puntos de ${yLabel} frente a ${xLabel}, dibujado como ${MODE_NAMES[mode].toLowerCase()}. ` +
    `Hay ${distinct} posiciones distintas; la correlación es ${formatNumber(r, 3)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Puntos', value: `${visible.length} de ${points.length}` },
        { label: 'Posiciones distintas', value: String(distinct) },
        { label: 'Correlación de Pearson', value: formatNumber(r, 3) },
      ]}
      legend={[
        mode === 'hexagonos'
          ? { label: 'Hexágono: más oscuro, más puntos', color: DATA_COLORS.primary }
          : { label: 'Observación', color: DATA_COLORS.primary, shape: 'circle' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.62}
        minHeight={260}
        maxHeight={460}
        margins={{ top: 16, right: 20, bottom: 46, left: 58 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain(pad(xs))
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain(pad(ys))
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const bins =
            mode === 'hexagonos'
              ? hexbin(
                  visible.map(([px, py]) => [x(px), y(py)] as [number, number]),
                  hexRadius,
                )
              : [];
          const maxCount = Math.max(1, ...bins.map((b) => b.count));
          const shade = scaleSqrt().domain([0, maxCount]).range([0.08, 1]);
          const hex = hexagonPath(hexRadius);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={6}
                label={yLabel}
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={7}
                label={xLabel}
              />
              <g aria-hidden="true">
                {mode === 'hexagonos'
                  ? bins.map((b, i) => (
                      <path
                        key={i}
                        d={hex}
                        transform={`translate(${b.x},${b.y})`}
                        fill={DATA_COLORS.primary}
                        fillOpacity={shade(b.count)}
                        stroke="var(--color-surface)"
                        strokeWidth={0.5}
                      />
                    ))
                  : visible.map(([px, py], i) => (
                      <circle
                        key={i}
                        cx={x(px + (mode === 'dispersion-aleatoria' ? (jitter[i] ?? 0) : 0))}
                        cy={y(py)}
                        r={DOT}
                        fill={DATA_COLORS.primary}
                        fillOpacity={mode === 'transparencia' ? LOW_OPACITY : 1}
                      />
                    ))}
              </g>
              {mode === 'hexagonos' && (
                <text
                  x={box.inner.left + box.inner.width - 4}
                  y={box.inner.top + 12}
                  textAnchor="end"
                  className={styles.chartLabel}
                >
                  {bins.length} hexágonos ocupados, máximo{' '}
                  {maxCount === 1 && bins.length === 0 ? 0 : maxCount} por hexágono
                </text>
              )}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
