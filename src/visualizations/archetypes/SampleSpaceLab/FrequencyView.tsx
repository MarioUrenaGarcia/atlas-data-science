import { scaleLinear, scaleLog } from 'd3-scale';
import { useMemo, useState } from 'react';
import {
  eventProbability,
  experiment,
  findEvent,
  frequencyBand,
  type ExperimentId,
} from '../../../lib/probability/sampleSpace.ts';
import { formatNumber, formatProbability } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import svgStyles from '../../core/svg/svg.module.css';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { eventLabel, eventOptions, gridCaption } from './labels.ts';
import styles from './SampleSpaceLab.module.css';
import type { SampleSpaceLabConfig } from './schema.ts';
import { SpaceGrid } from './SpaceGrid.tsx';

const TRIALS_PER_SECOND = 30;
/** Long simulations speed up so a full run at 1x takes about this long. */
const FULL_RUN_SECONDS = 60;
const DEFAULT_TRIALS = 2000;
/** Every trial is recorded up to this count; later ones are thinned so the chart stays light. */
const DENSE_HISTORY = 200;
const HISTORY_POINTS = 600;
const BAND_STEPS = 120;
const MAX_TEXT_CELLS = 52;
const MIN_EXCESS_RANGE = 5;
const REFERENCE_MARGIN = 0.1;

interface Series {
  hits: number;
  history: { n: number; f: number }[];
}

interface Simulation {
  trials: number;
  series: Series[];
  /** Occurrences of each outcome in the first series. */
  counts: number[];
  last: number | null;
}

interface FrequencyViewProps {
  title: string;
  conceptId: string;
  config: SampleSpaceLabConfig;
}

/**
 * The experiment repeated many times. The grid accumulates how often each
 * outcome appears, and the chart follows the relative frequency of the event
 * as the number of trials grows, next to the probability it approaches.
 */
export function FrequencyView({ title, conceptId, config }: FrequencyViewProps) {
  const experimentId: ExperimentId = config.experimento ?? 'dos-dados';
  const space = experiment(experimentId);
  const maxTrials = config.ensayos ?? DEFAULT_TRIALS;
  const definitions = useMemo(() => {
    const options = eventOptions(experimentId, config.eventos);
    return [
      {
        type: 'select' as const,
        key: 'evento',
        label: 'Evento A',
        options,
        default: config.eventoA ?? options[0]?.value ?? '',
      },
      {
        type: 'number' as const,
        key: 'trayectorias',
        label: 'Repeticiones independientes',
        min: 1,
        max: 8,
        step: 1,
        default: config.trayectorias ?? 1,
      },
      {
        type: 'select' as const,
        key: 'grafica',
        label: 'Qué se grafica',
        options: [
          { value: 'relativa', label: 'Frecuencia relativa n_A / n' },
          { value: 'exceso', label: 'Exceso absoluto n_A - n P(A)' },
        ],
        default: config.grafica ?? 'relativa',
      },
      {
        type: 'toggle' as const,
        key: 'banda',
        label: 'Banda de 95 % alrededor de P(A)',
        default: config.banda ?? false,
      },
      {
        type: 'toggle' as const,
        key: 'escalaLog',
        label: 'Eje de ensayos logarítmico',
        default: config.escalaLog ?? false,
      },
    ];
  }, [config, experimentId]);
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string | number | boolean>;
  const eventId = String(values.evento);
  const paths = Number(values.trayectorias);
  const showBand = Boolean(values.banda);
  const logScale = Boolean(values.escalaLog);
  const excess = values.grafica === 'exceso';
  const test = findEvent(experimentId, eventId)?.test ?? (() => false);
  const probability = eventProbability(space.outcomes, test);
  const reference = config.referencia;
  // A reference value zooms the axis around it and the probability, where the comparison happens.
  const yWindow: [number, number] =
    reference === undefined || excess
      ? [0, 1]
      : [
          Math.max(0, Math.min(reference, probability) - REFERENCE_MARGIN),
          Math.min(1, Math.max(reference, probability) + REFERENCE_MARGIN),
        ];
  const clampY = (value: number) =>
    excess ? value : Math.min(yWindow[1], Math.max(yWindow[0], value));
  const thinning = Math.max(1, Math.ceil((maxTrials - DENSE_HISTORY) / HISTORY_POINTS));

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${eventId}|${paths}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [simulation, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    trials: 0,
    series: Array.from({ length: paths }, () => ({ hits: 0, history: [] })),
    counts: space.outcomes.map(() => 0),
    last: null,
  }));
  const simulate = (count: number) => {
    const generator = random();
    const steps = Math.min(count, maxTrials - simulation.trials);
    if (steps <= 0) return;
    const draws = Array.from({ length: steps }, () =>
      Array.from({ length: paths }, () => generator.int(0, space.outcomes.length - 1)),
    );
    update((previous) => {
      let trials = previous.trials;
      const counts = [...previous.counts];
      const series = previous.series.map((s) => ({ hits: s.hits, history: [...s.history] }));
      let last = previous.last;
      for (const row of draws) {
        if (trials >= maxTrials) break;
        trials += 1;
        row.forEach((index, path) => {
          const current = series[path];
          const outcome = space.outcomes[index];
          if (!current || !outcome) return;
          if (test(outcome)) current.hits += 1;
          if (trials <= DENSE_HISTORY || trials % thinning === 0 || trials === maxTrials)
            current.history.push({ n: trials, f: current.hits / trials });
        });
        const first = row[0] ?? 0;
        counts[first] = (counts[first] ?? 0) + 1;
        last = first;
      }
      return { trials, series, counts, last };
    });
  };
  const playback = usePlayback({
    step: () => simulate(1),
    stepMany: simulate,
    reset: () => setRun((value) => value + 1),
    rate: Math.max(TRIALS_PER_SECOND, maxTrials / FULL_RUN_SECONDS),
    done: simulation.trials >= maxTrials,
  });

  const first = simulation.series[0] ?? { hits: 0, history: [] };
  const frequency = simulation.trials > 0 ? first.hits / simulation.trials : 0;
  const maxCount = Math.max(1, ...simulation.counts);
  const lastOutcome = simulation.last === null ? undefined : space.outcomes[simulation.last];
  const header = excess
    ? `n_A - n\\,P(A) = ${first.hits} - ${simulation.trials} \\cdot ${formatNumber(probability, 4)} = ${formatNumber(first.hits - simulation.trials * probability, 2)} \\qquad f_n(A) = ${formatProbability(frequency)}`
    : simulation.trials === 0
      ? `f_n(A) = \\frac{n_A}{n} \\qquad P(A) = ${formatProbability(probability)}`
      : `f_{${simulation.trials}}(A) = \\frac{${first.hits}}{${simulation.trials}} = ${formatProbability(frequency)} \\qquad P(A) = ${formatProbability(probability)}`;
  const description =
    `${space.label} repetido ${simulation.trials} veces. Evento A: ${eventLabel(experimentId, eventId)}, con probabilidad ${formatProbability(probability)}. ` +
    `Frecuencia relativa observada: ${formatProbability(frequency)}` +
    (lastOutcome ? `. Último resultado: ${space.format(lastOutcome)}.` : '.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Ensayos n', value: String(simulation.trials) },
        { label: 'Veces que ocurre A', value: String(first.hits) },
        {
          label: 'Frecuencia relativa',
          value: formatProbability(frequency),
          color: DATA_COLORS.primary,
        },
        { label: 'P(A)', value: formatProbability(probability), color: DATA_COLORS.secondary },
        {
          label: 'Diferencia',
          value: simulation.trials > 0 ? formatNumber(frequency - probability, 4) : 'sin datos',
        },
      ]}
      legend={[
        { label: 'Frecuencia relativa', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'P(A)', color: DATA_COLORS.secondary, shape: 'dashed' },
        ...(showBand ? [{ label: 'Banda de 95 %', color: DATA_COLORS.light }] : []),
        { label: 'Resultados de A (rayado)', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <SpaceGrid
        experiment={space}
        label={description}
        fill={(_, index) => {
          const count = simulation.counts[index] ?? 0;
          return count > 0
            ? { color: DATA_COLORS.primary, opacity: 0.15 + 0.7 * (count / maxCount) }
            : null;
        }}
        stripe={(outcome) => (test(outcome) ? 'a' : null)}
        text={
          space.outcomes.length <= MAX_TEXT_CELLS
            ? (outcome, index) =>
                simulation.trials > 0
                  ? String(simulation.counts[index] ?? 0)
                  : space.format(outcome)
            : undefined
        }
        outlined={new Set(simulation.last === null ? [] : [simulation.last])}
      />
      <p className={styles.caption}>
        {simulation.trials > 0 && space.outcomes.length <= MAX_TEXT_CELLS
          ? 'El número de cada casilla es cuántas veces ha salido ese resultado en la primera repetición; el recuadro marca el último. '
          : ''}
        {gridCaption(experimentId)}
      </p>
      <ChartSvg label={description} aspect={0.45} minHeight={220} maxHeight={340}>
        {(box) => {
          const xMax = Math.max(logScale ? 10 : 50, simulation.trials);
          const x = logScale
            ? scaleLog()
                .domain([1, xMax])
                .range([box.inner.left, box.inner.left + box.inner.width])
            : scaleLinear()
                .domain([0, xMax])
                .range([box.inner.left, box.inner.left + box.inner.width]);
          // In excess mode the chart shows n_A - n p, whose typical size grows like sqrt(n).
          const value = (n: number, f: number) => (excess ? n * f - n * probability : f);
          const spread = (n: number) => 1.96 * Math.sqrt(n * probability * (1 - probability));
          const extreme = Math.max(
            MIN_EXCESS_RANGE,
            spread(xMax) * 1.15,
            ...simulation.series.flatMap((s) => s.history.map((p) => Math.abs(value(p.n, p.f)))),
          );
          const y = scaleLinear()
            .domain(excess ? [-extreme, extreme] : yWindow)
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const bandPoints = Array.from({ length: BAND_STEPS + 1 }, (_, i) => {
            const n = logScale ? xMax ** (i / BAND_STEPS) : 1 + ((xMax - 1) * i) / BAND_STEPS;
            return excess
              ? { n, low: -spread(n), high: spread(n) }
              : { n, ...frequencyBand(probability, n) };
          });
          const band = [
            ...bandPoints.map((point) => `${x(point.n)},${y(clampY(point.high))}`),
            ...[...bandPoints].reverse().map((point) => `${x(point.n)},${y(clampY(point.low))}`),
          ].join(' ');
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label={excess ? 'exceso n_A - n P(A)' : 'frecuencia relativa'}
                format={excess ? (tick) => formatNumber(tick, 0) : undefined}
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="número de ensayos n"
                format={(value) => formatNumber(value, 0)}
              />
              <g aria-hidden="true">
                {showBand && <polygon points={band} fill={DATA_COLORS.light} fillOpacity={0.35} />}
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(excess ? 0 : probability)}
                  y2={y(excess ? 0 : probability)}
                  stroke={DATA_COLORS.secondary}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />
                {reference !== undefined && !excess && (
                  <>
                    <line
                      x1={box.inner.left}
                      x2={box.inner.left + box.inner.width}
                      y1={y(reference)}
                      y2={y(reference)}
                      stroke={DATA_COLORS.text}
                      strokeWidth={1}
                      strokeDasharray="2 3"
                    />
                    <text
                      x={box.inner.left + box.inner.width - 4}
                      y={y(reference) + 14}
                      textAnchor="end"
                      className={svgStyles.label}
                    >
                      {formatNumber(reference, 2)}
                    </text>
                  </>
                )}
              </g>
              {simulation.series.map((series, index) =>
                series.history.length > 1 ? (
                  <CurvePath
                    key={index}
                    points={series.history.map((point) => ({
                      x: point.n,
                      y: Math.min(yWindow[1], Math.max(yWindow[0], value(point.n, point.f))),
                    }))}
                    xScale={x}
                    yScale={y}
                    color={index === 0 ? DATA_COLORS.primary : seriesColor(index + 2)}
                    width={index === 0 ? 2.2 : 1.4}
                    animate={false}
                  />
                ) : null,
              )}
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
