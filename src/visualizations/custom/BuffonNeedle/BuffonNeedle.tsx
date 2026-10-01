import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import {
  buffonPiEstimate,
  buffonProbability,
  needleCrosses,
} from '../../../lib/probability/geometric.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './BuffonNeedle.module.css';
import type { BuffonNeedleConfig } from './schema.ts';

const NEEDLES_PER_SECOND = 20;
/** Long simulations speed up so a full run at 1x takes about this long. */
const FULL_RUN_SECONDS = 60;
const DEFAULT_NEEDLES = 5000;
const SHOWN_NEEDLES = 400;
const SHOWN_POINTS = 2500;
const FLOOR_COLUMNS = 6;
const FLOOR_ROWS = 4;
const DENSE_HISTORY = 200;
const HISTORY_POINTS = 500;
const CURVE_STEPS = 80;
/** Spacing between lines; the needle length is a fraction of it. */
const SPACING = 1;

interface Needle {
  cx: number;
  cy: number;
  theta: number;
  /** Distance from the center to the nearest line. */
  distance: number;
  crosses: boolean;
}

interface Simulation {
  needles: Needle[];
  total: number;
  crossings: number;
  history: { n: number; estimate: number }[];
}

type View = 'agujas' | 'espacio';

/**
 * Buffon's needle: needles dropped on a floor ruled with parallel lines
 * cross a line with probability 2l / (pi t), so the crossing count estimates
 * pi. The second view maps each needle to its distance and angle, where the
 * crossing needles are exactly the points under x = (l / 2) sin(theta).
 */
export default function BuffonNeedle({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as BuffonNeedleConfig;
  const [view, setView] = useState<View>(config.vista ?? 'agujas');
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'largo',
        label: 'Largo de la aguja (fracción de la separación)',
        symbol: 'l/t',
        min: 0.1,
        max: 1,
        step: 0.05,
        digits: 2,
        default: config.largo ?? 0.8,
      },
    ],
    [config.largo],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const length = (values.largo ?? 0.8) * SPACING;
  const maxNeedles = config.agujas ?? DEFAULT_NEEDLES;
  const thinning = Math.max(1, Math.ceil((maxNeedles - DENSE_HISTORY) / HISTORY_POINTS));
  const probability = buffonProbability(length, SPACING);

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${length}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [simulation, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    needles: [],
    total: 0,
    crossings: 0,
    history: [],
  }));
  const drop = (count: number) => {
    const generator = random();
    const steps = Math.min(count, maxNeedles - simulation.total);
    if (steps <= 0) return;
    const dropped = Array.from({ length: steps }, (): Needle => {
      const cx = generator.uniform(0, FLOOR_COLUMNS * SPACING);
      const cy = generator.uniform(0, FLOOR_ROWS * SPACING);
      const theta = generator.uniform(0, Math.PI);
      const offset = cy % SPACING;
      const distance = Math.min(offset, SPACING - offset);
      return { cx, cy, theta, distance, crosses: needleCrosses(distance, theta, length) };
    });
    update((previous) => {
      let { total, crossings } = previous;
      const history = [...previous.history];
      for (const needle of dropped) {
        total += 1;
        if (needle.crosses) crossings += 1;
        if (
          crossings > 0 &&
          (total <= DENSE_HISTORY || total % thinning === 0 || total === maxNeedles)
        )
          history.push({ n: total, estimate: buffonPiEstimate(length, SPACING, total, crossings) });
      }
      const needles = [...previous.needles, ...dropped].slice(-SHOWN_POINTS);
      return { needles, total, crossings, history };
    });
  };
  const playback = usePlayback({
    step: () => drop(1),
    stepMany: drop,
    reset: () => setRun((value) => value + 1),
    rate: Math.max(NEEDLES_PER_SECOND, maxNeedles / FULL_RUN_SECONDS),
    done: simulation.total >= maxNeedles,
  });

  const estimate = buffonPiEstimate(length, SPACING, simulation.total, simulation.crossings);
  const l = formatNumber(length, 2);
  const header =
    simulation.crossings === 0
      ? `P(\\text{cruza}) = \\frac{2l}{\\pi t} = \\frac{2 \\cdot ${l}}{\\pi \\cdot 1} = ${formatNumber(probability, 4)}`
      : `\\hat{\\pi} = \\frac{2 l\\, n}{t\\, h} = \\frac{2 \\cdot ${l} \\cdot ${simulation.total}}{1 \\cdot ${simulation.crossings}} = ${formatNumber(estimate, 4)}`;
  const description =
    `Agujas de largo ${l} sobre líneas separadas 1. Se han lanzado ${simulation.total} y ${simulation.crossings} cruzan una línea. ` +
    `Probabilidad teórica de cruce ${formatNumber(probability, 4)}; estimación de pi ${simulation.crossings > 0 ? formatNumber(estimate, 4) : 'aún no disponible'}.`;
  const shownNeedles = simulation.needles.slice(-SHOWN_NEEDLES);
  const last = simulation.needles.at(-1);

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      views={{
        options: [
          { value: 'agujas', label: 'Agujas sobre el piso' },
          { value: 'espacio', label: 'Distancia y ángulo' },
        ],
        value: view,
        onChange: (value) => setView(value as View),
      }}
      readouts={[
        { label: 'Agujas n', value: String(simulation.total) },
        { label: 'Cruces h', value: String(simulation.crossings), color: DATA_COLORS.secondary },
        {
          label: 'Proporción de cruces',
          value:
            simulation.total > 0
              ? formatNumber(simulation.crossings / simulation.total, 4)
              : 'sin datos',
        },
        { label: 'P(cruza) = 2l/(πt)', value: formatNumber(probability, 4) },
        {
          label: 'Estimación de π',
          value: simulation.crossings > 0 ? formatNumber(estimate, 4) : 'sin cruces',
          color: DATA_COLORS.primary,
        },
      ]}
      legend={[
        { label: 'Cruza una línea', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'No cruza', color: DATA_COLORS.neutral, shape: 'line' },
        { label: 'Estimación de π', color: DATA_COLORS.primary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      {view === 'agujas' ? (
        <ChartSvg
          label={description}
          aspect={(FLOOR_ROWS + 1) / FLOOR_COLUMNS}
          minHeight={200}
          maxHeight={380}
          margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          {(box) => {
            const unit = Math.min(
              box.inner.width / FLOOR_COLUMNS,
              box.inner.height / (FLOOR_ROWS + 1),
            );
            const left = box.inner.left + (box.inner.width - unit * FLOOR_COLUMNS) / 2;
            const top = box.inner.top + (box.inner.height - unit * FLOOR_ROWS) / 2;
            const px = (value: number) => left + value * unit;
            const py = (value: number) => top + (FLOOR_ROWS - value) * unit;
            return (
              <g aria-hidden="true">
                <defs>
                  <clipPath id="buffon-floor">
                    <rect
                      x={px(0)}
                      y={py(FLOOR_ROWS) - unit * 0.5}
                      width={unit * FLOOR_COLUMNS}
                      height={unit * (FLOOR_ROWS + 1)}
                    />
                  </clipPath>
                </defs>
                <rect
                  x={px(0)}
                  y={py(FLOOR_ROWS)}
                  width={unit * FLOOR_COLUMNS}
                  height={unit * FLOOR_ROWS}
                  fill="var(--color-surface-2)"
                />
                {Array.from({ length: FLOOR_ROWS + 1 }, (_, row) => (
                  <line
                    key={row}
                    x1={px(0)}
                    x2={px(FLOOR_COLUMNS)}
                    y1={py(row)}
                    y2={py(row)}
                    stroke={DATA_COLORS.text}
                    strokeWidth={1.5}
                  />
                ))}
                <g clipPath="url(#buffon-floor)">
                  {shownNeedles.map((needle, index) => {
                    const dx = (length / 2) * Math.cos(needle.theta);
                    const dy = (length / 2) * Math.sin(needle.theta);
                    const isLast = needle === last;
                    return (
                      <line
                        key={index}
                        x1={px(needle.cx - dx)}
                        y1={py(needle.cy - dy)}
                        x2={px(needle.cx + dx)}
                        y2={py(needle.cy + dy)}
                        stroke={needle.crosses ? DATA_COLORS.secondary : DATA_COLORS.neutral}
                        strokeWidth={isLast ? 3.5 : 1.4}
                        strokeOpacity={isLast ? 1 : 0.7}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </g>
              </g>
            );
          }}
        </ChartSvg>
      ) : (
        <ChartSvg
          label={description}
          aspect={0.5}
          minHeight={220}
          maxHeight={360}
          margins={{ top: 12, right: 16, bottom: 44, left: 56 }}
        >
          {(box) => {
            const x = scaleLinear()
              .domain([0, Math.PI])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const y = scaleLinear()
              .domain([0, SPACING / 2])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const curve = Array.from({ length: CURVE_STEPS + 1 }, (_, i) => {
              const theta = (Math.PI * i) / CURVE_STEPS;
              return { x: theta, y: Math.min(SPACING / 2, (length / 2) * Math.sin(theta)) };
            });
            return (
              <>
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  tickValues={[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI]}
                  format={(value) =>
                    ['0', 'π/4', 'π/2', '3π/4', 'π'][Math.round((value / Math.PI) * 4)] ?? ''
                  }
                  label="ángulo θ con las líneas"
                />
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={4}
                  label="distancia x a la línea"
                />
                <CurvePath
                  points={curve}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.secondary}
                  fill
                  fillOpacity={0.2}
                  animate={false}
                />
                <g aria-hidden="true">
                  {simulation.needles.map((needle, index) => (
                    <circle
                      key={index}
                      cx={x(needle.theta)}
                      cy={y(needle.distance)}
                      r={needle === last ? 5 : 1.8}
                      fill={needle.crosses ? DATA_COLORS.secondary : DATA_COLORS.neutral}
                      fillOpacity={0.8}
                    />
                  ))}
                </g>
              </>
            );
          }}
        </ChartSvg>
      )}
      <p className={styles.caption}>
        {view === 'agujas'
          ? 'Líneas separadas una unidad. Cada aguja se lanza con centro y ángulo al azar; las que tocan una línea se dibujan en color.'
          : 'Cada punto es una aguja: su ángulo θ y la distancia x de su centro a la línea más cercana. Cruza exactamente cuando x ≤ (l/2) sen θ, la región sombreada.'}
      </p>
      <ChartSvg label={description} aspect={0.35} minHeight={180} maxHeight={260}>
        {(box) => {
          const xMax = Math.max(50, simulation.total);
          const x = scaleLinear()
            .domain([0, xMax])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([2, 4.5])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const visible = simulation.history.filter((p) => p.n >= 10);
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="estimación"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={5}
                label="agujas lanzadas"
                format={(value) => formatNumber(value, 0)}
              />
              <line
                x1={box.inner.left}
                x2={box.inner.left + box.inner.width}
                y1={y(Math.PI)}
                y2={y(Math.PI)}
                stroke={DATA_COLORS.secondary}
                strokeDasharray="6 4"
                strokeWidth={2}
                aria-hidden="true"
              />
              {visible.length > 1 && (
                <CurvePath
                  points={visible.map((p) => ({
                    x: p.n,
                    y: Math.min(4.5, Math.max(2, p.estimate)),
                  }))}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.primary}
                  animate={false}
                />
              )}
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
