import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { frequencyBand } from '../../../lib/probability/sampleSpace.ts';
import { formatNumber, formatProbability } from '../../../lib/format/number.ts';
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
import styles from './GeometricProbability.module.css';
import { scenarioModel } from './scenarios.ts';
import type { GeometricProbabilityConfig } from './schema.ts';
import { StickView } from './StickView.tsx';

const POINTS_PER_SECOND = 30;
const DEFAULT_POINTS = 5000;
const SHOWN_POINTS = 2500;
const DENSE_HISTORY = 200;
const HISTORY_POINTS = 500;
const BAND_STEPS = 100;

interface Simulation {
  points: { x: number; y: number; hit: boolean }[];
  total: number;
  hits: number;
  history: { n: number; share: number }[];
}

/**
 * A point chosen uniformly in a region lands in a subregion with probability
 * equal to the ratio of areas. Points accumulate in the region while the
 * share of hits, converted to the target quantity, approaches its exact value.
 */
export default function GeometricProbability({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as GeometricProbabilityConfig;
  const scenario = config.escenario;
  const definitions = useMemo(() => {
    switch (scenario) {
      case 'encuentro':
        return [
          {
            type: 'number' as const,
            key: 'espera',
            label: 'Minutos que cada persona espera',
            symbol: 'w',
            min: 1,
            max: config.horizonte ?? 60,
            step: 1,
            default: config.espera ?? 15,
          },
        ];
      case 'disco':
        return [
          {
            type: 'number' as const,
            key: 'radio',
            label: 'Radio del disco interior',
            symbol: 'r',
            min: 0.05,
            max: 1,
            step: 0.05,
            digits: 2,
            default: config.radio ?? 0.5,
          },
          {
            type: 'select' as const,
            key: 'muestreo',
            label: 'Cómo se elige el punto',
            options: [
              { value: 'area', label: 'Uniforme en el área del disco' },
              { value: 'radio', label: 'Radio uniforme y ángulo uniforme' },
            ],
            default: config.muestreo ?? 'area',
          },
        ];
      case 'raices-reales':
        return [
          {
            type: 'number' as const,
            key: 'bMax',
            label: 'Máximo de b',
            symbol: 'b_max',
            min: 0.5,
            max: 6,
            step: 0.5,
            digits: 1,
            default: config.bMax ?? 1,
          },
          {
            type: 'number' as const,
            key: 'cMax',
            label: 'Máximo de c',
            symbol: 'c_max',
            min: 0.5,
            max: 6,
            step: 0.5,
            digits: 1,
            default: config.cMax ?? 1,
          },
        ];
      default:
        return [];
    }
  }, [
    scenario,
    config.espera,
    config.horizonte,
    config.radio,
    config.muestreo,
    config.bMax,
    config.cMax,
  ]);
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const settings = {
    wait: Number(values.espera ?? config.espera ?? 15),
    horizon: config.horizonte ?? 60,
    radius: Number(values.radio ?? config.radio ?? 0.5),
    byRadius: values.muestreo === 'radio',
    bMax: Number(values.bMax ?? config.bMax ?? 1),
    cMax: Number(values.cMax ?? config.cMax ?? 1),
  };
  const model = scenarioModel(scenario, settings);
  // With a uniform radius the share converges to r instead of the area ratio r squared.
  const limit = scenario === 'disco' && settings.byRadius ? settings.radius : model.exact;
  const maxPoints = config.puntos ?? DEFAULT_POINTS;
  const thinning = Math.max(1, Math.ceil((maxPoints - DENSE_HISTORY) / HISTORY_POINTS));

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${JSON.stringify(settings)}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [simulation, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    points: [],
    total: 0,
    hits: 0,
    history: [],
  }));
  const simulate = (count: number) => {
    const generator = random();
    const steps = Math.min(count, maxPoints - simulation.total);
    if (steps <= 0) return;
    const drawn = Array.from({ length: steps }, () => {
      const [x, y] = model.sample(generator);
      return { x, y, hit: model.hit(x, y) };
    });
    update((previous) => {
      let { total, hits } = previous;
      const history = [...previous.history];
      for (const point of drawn) {
        total += 1;
        if (point.hit) hits += 1;
        if (total <= DENSE_HISTORY || total % thinning === 0 || total === maxPoints)
          history.push({ n: total, share: hits / total });
      }
      const points = [...previous.points, ...drawn].slice(-SHOWN_POINTS);
      return { points, total, hits, history };
    });
  };
  const playback = usePlayback({
    step: () => simulate(1),
    stepMany: simulate,
    reset: () => setRun((value) => value + 1),
    rate: POINTS_PER_SECOND,
    done: simulation.total >= maxPoints,
  });

  const share = simulation.total > 0 ? simulation.hits / simulation.total : 0;
  const factor = model.target.factor;
  const estimate = share * factor;
  const last = simulation.points.at(-1);
  const header =
    simulation.total === 0
      ? factor === 1
        ? `P = ${model.areaLatex} = ${formatNumber(model.exact, 4)}`
        : `P = ${model.areaLatex} = ${formatNumber(model.exact, 4)} \\qquad \\pi = ${factor} P`
      : factor === 1
        ? `\\hat{P} = \\frac{${simulation.hits}}{${simulation.total}} = ${formatNumber(share, 4)} \\qquad P = ${model.areaLatex} = ${formatNumber(model.exact, 4)}`
        : `\\hat{\\pi} = ${factor} \\cdot \\frac{${simulation.hits}}{${simulation.total}} = ${formatNumber(estimate, 4)} \\qquad \\pi = ${formatNumber(Math.PI, 4)}`;
  const description =
    `${simulation.total} puntos al azar, ${simulation.hits} en la región favorable. ` +
    `${model.target.name}: estimación ${formatNumber(estimate, 4)}, valor exacto ${formatNumber(model.target.exact, 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Puntos', value: String(simulation.total) },
        { label: 'En la región', value: String(simulation.hits), color: DATA_COLORS.primary },
        {
          label: factor === 1 ? 'Proporción observada' : 'Estimación de π',
          value: formatNumber(estimate, 4),
          color: DATA_COLORS.primary,
        },
        {
          label: factor === 1 ? 'Probabilidad exacta' : 'π',
          value: formatNumber(model.target.exact, 4),
          color: DATA_COLORS.secondary,
        },
        ...(limit !== model.exact
          ? [{ label: 'Límite con este muestreo', value: formatProbability(limit) }]
          : []),
      ]}
      legend={[
        { label: 'Región favorable', color: DATA_COLORS.light },
        { label: 'Punto dentro', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Punto fuera', color: DATA_COLORS.neutral, shape: 'circle' },
        { label: 'Valor exacto', color: DATA_COLORS.secondary, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      {scenario === 'varilla-rota' && <StickView point={last} />}
      <div className={styles.panels}>
        <ChartSvg label={description} aspect={1} minHeight={260} maxHeight={400}>
          {(box) => {
            const side = Math.min(box.inner.width, box.inner.height);
            const [x0, x1] = model.domain.x;
            const [y0, y1] = model.domain.y;
            const ratio = (y1 - y0) / (x1 - x0);
            const width = ratio > 1 ? side / ratio : side;
            const height = ratio > 1 ? side : side * ratio;
            const x = scaleLinear()
              .domain([x0, x1])
              .range([box.inner.left, box.inner.left + width]);
            const y = scaleLinear()
              .domain([y0, y1])
              .range([box.inner.top + height, box.inner.top]);
            const path = (polygon: [number, number][]) =>
              polygon.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${x(px)},${y(py)}`).join('') +
              'Z';
            return (
              <>
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={box.inner.top + height}
                  ticks={4}
                  label={model.xLabel}
                />
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  ticks={4}
                  label={model.yLabel}
                />
                <g aria-hidden="true">
                  <rect
                    x={x(x0)}
                    y={y(y1)}
                    width={width}
                    height={height}
                    fill="none"
                    stroke="var(--color-border-strong)"
                  />
                  {model.outline && (
                    <path
                      d={path(model.outline)}
                      fill="var(--color-surface-2)"
                      stroke="var(--color-border-strong)"
                    />
                  )}
                  {model.region.map((polygon, index) => (
                    <path
                      key={index}
                      d={path(polygon)}
                      fill={DATA_COLORS.light}
                      fillOpacity={0.45}
                      stroke={DATA_COLORS.primary}
                      strokeWidth={1.5}
                    />
                  ))}
                  {simulation.points.map((point, index) => (
                    <circle
                      key={index}
                      cx={x(point.x)}
                      cy={y(point.y)}
                      r={2}
                      fill={point.hit ? DATA_COLORS.primary : DATA_COLORS.neutral}
                      fillOpacity={0.75}
                    />
                  ))}
                  {last && (
                    <circle
                      cx={x(last.x)}
                      cy={y(last.y)}
                      r={6}
                      fill="none"
                      stroke={DATA_COLORS.text}
                      strokeWidth={2}
                    />
                  )}
                </g>
              </>
            );
          }}
        </ChartSvg>
        <ChartSvg label={description} aspect={0.8} minHeight={260} maxHeight={400}>
          {(box) => {
            const xMax = Math.max(50, simulation.total);
            const x = scaleLinear()
              .domain([0, xMax])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const top = Math.min(
              factor,
              Math.max(model.target.exact, limit * factor) * 1.6 + 0.05 * factor,
            );
            const y = scaleLinear()
              .domain([0, top])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const bandPoints = Array.from({ length: BAND_STEPS + 1 }, (_, i) => {
              const n = 1 + ((xMax - 1) * i) / BAND_STEPS;
              return { n, ...frequencyBand(model.exact, n) };
            });
            const band = [
              ...bandPoints.map((p) => `${x(p.n)},${y(Math.min(top, p.high * factor))}`),
              ...[...bandPoints].reverse().map((p) => `${x(p.n)},${y(p.low * factor)}`),
            ].join(' ');
            const visible = simulation.history.filter((p) => p.n >= Math.min(10, simulation.total));
            return (
              <>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label={model.target.name}
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={5}
                  label="número de puntos"
                  format={(value) => formatNumber(value, 0)}
                />
                <g aria-hidden="true">
                  <polygon points={band} fill={DATA_COLORS.light} fillOpacity={0.3} />
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={y(model.target.exact)}
                    y2={y(model.target.exact)}
                    stroke={DATA_COLORS.secondary}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                  />
                  {limit !== model.exact && (
                    <line
                      x1={box.inner.left}
                      x2={box.inner.left + box.inner.width}
                      y1={y(limit)}
                      y2={y(limit)}
                      stroke={DATA_COLORS.negative}
                      strokeWidth={1.5}
                      strokeDasharray="2 3"
                    />
                  )}
                </g>
                {visible.length > 1 && (
                  <CurvePath
                    points={visible.map((p) => ({ x: p.n, y: Math.min(top, p.share * factor) }))}
                    xScale={x}
                    yScale={y}
                    color={DATA_COLORS.primary}
                    width={2}
                    animate={false}
                  />
                )}
              </>
            );
          }}
        </ChartSvg>
      </div>
      <p className={styles.caption}>
        La banda sombreada de la derecha es la zona donde cae la estimación el 95 % de las veces; se
        estrecha como 1 / √n.
        {limit !== model.exact
          ? ' La línea de puntos finos es el valor al que converge el muestreo por radio uniforme.'
          : ''}
      </p>
    </VizFrame>
  );
}
