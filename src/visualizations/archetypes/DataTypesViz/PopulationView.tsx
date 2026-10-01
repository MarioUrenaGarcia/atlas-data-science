import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import {
  allSamples,
  biasedSample,
  generatePopulation,
  populationStatistic,
  simpleRandomSample,
  type PopulationShape,
  type PopulationStatistic,
} from '../../../lib/stats/population.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataTypesViz.module.css';

const UNITS_PER_SECOND = 6;
const MAX_SAMPLES = 60;
const GRID_HEIGHT_SHARE = 0.56;
const STRIP_GAP = 34;
const HISTORY_DOT = 4;
const DOT_MIN_OPACITY = 0.18;
const POPULATION_TICK = 10;

const STATISTIC_NAMES: Record<
  PopulationStatistic,
  { parameter: string; statistic: string; name: string }
> = {
  media: { parameter: '\\mu', statistic: '\\bar{x}', name: 'media' },
  mediana: { parameter: 'M', statistic: '\\tilde{x}', name: 'mediana' },
  proporcion: { parameter: 'p', statistic: '\\hat{p}', name: 'proporción' },
  maximo: { parameter: '\\max', statistic: 'x_{(n)}', name: 'máximo' },
};

interface PopulationViewProps {
  title: string;
  focus: 'muestra' | 'parametro';
  size: number;
  n: number;
  shape: PopulationShape;
  center: number;
  spread?: number;
  statistic: PopulationStatistic;
  unit: string;
  variable: string;
  success?: string;
  selection: 'aleatoria' | 'sesgada';
  decimals: number;
  seed: number;
  /** Fixed population values; when given, nothing is simulated. */
  fixed?: readonly number[];
  /** Draws every possible sample once, in order, instead of random ones. */
  enumerate?: boolean;
}

interface SamplingState {
  /** Indices of the current sample, in drawing order. */
  order: number[];
  drawn: number;
  history: number[];
  sampleIndex: number;
}

/**
 * A finite population drawn as a grid of units. Units are drawn one at a time
 * into a sample; the strip below compares the fixed population value (the
 * parameter) with the value computed from the sample (the statistic).
 */
export function PopulationView(props: PopulationViewProps) {
  const { title, focus, size, shape, center, spread, statistic, unit, variable, decimals } = props;
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'n',
      label: 'Tamaño de muestra',
      symbol: 'n',
      min: 2,
      max: Math.min(80, props.fixed?.length ?? size),
      step: 1,
      default: props.n,
    },
    {
      type: 'select',
      key: 'seleccion',
      label: 'Forma de elegir las unidades',
      options: [
        { value: 'aleatoria', label: 'Muestreo aleatorio simple' },
        { value: 'sesgada', label: 'Selección sesgada hacia valores altos' },
      ],
      default: props.selection,
    },
  ];
  const parameters = useParameters(definitions);
  const n = Number(parameters.values.n);
  const selection = String(parameters.values.seleccion) as 'aleatoria' | 'sesgada';
  const seed = useSeed(props.seed);
  const fixed = props.fixed;
  const [population] = useResettableState(
    `${seed.seed}|${size}|${shape}|${center}|${spread}|${fixed?.join(',') ?? ''}`,
    () =>
      fixed
        ? [...fixed]
        : generatePopulation(
            { size, shape, center, ...(spread === undefined ? {} : { spread }), decimals },
            new Random(seed.seed),
          ),
  );
  const [combinations] = useResettableState(`${population.length}|${n}|${props.enumerate}`, () =>
    props.enumerate ? allSamples(population.length, n) : [],
  );
  const [run, setRun] = useState(0);
  const draw = (sampleIndex: number) => {
    if (props.enumerate) return combinations[sampleIndex % Math.max(1, combinations.length)] ?? [];
    const random = new Random(seed.seed + 7919 * (sampleIndex + 1) + run);
    return selection === 'sesgada'
      ? biasedSample(population, n, random)
      : simpleRandomSample(population.length, n, random);
  };
  const [state, update] = useResettableState<SamplingState>(
    `${seed.seed}|${n}|${selection}|${run}|${population.length}`,
    () => ({ order: draw(0), drawn: 0, history: [], sampleIndex: 0 }),
  );

  const complete = state.drawn >= state.order.length;
  const sampleLimit = props.enumerate ? combinations.length : MAX_SAMPLES;
  const done = focus === 'muestra' ? complete : complete && state.history.length >= sampleLimit;
  const playback = usePlayback({
    step: () =>
      update((previous) => {
        if (previous.drawn < previous.order.length) {
          const drawn = previous.drawn + 1;
          if (drawn < previous.order.length || focus === 'muestra') return { ...previous, drawn };
          const values = previous.order.map((index) => population[index] ?? 0);
          return {
            ...previous,
            drawn,
            history: [...previous.history, populationStatistic(statistic, values)],
          };
        }
        if (focus === 'muestra') return previous;
        // After the first sample is drawn unit by unit, each later sample is
        // drawn whole so the statistics accumulate at a readable pace.
        const sampleIndex = previous.sampleIndex + 1;
        const order = draw(sampleIndex);
        const values = order.map((index) => population[index] ?? 0);
        return {
          order,
          drawn: order.length,
          sampleIndex,
          history: [...previous.history, populationStatistic(statistic, values)],
        };
      }),
    reset: () => setRun((value) => value + 1),
    rate: UNITS_PER_SECOND,
    done,
  });

  const sampleIndices = state.order.slice(0, state.drawn);
  const inSample = new Set(sampleIndices);
  const sampleValues = sampleIndices.map((index) => population[index] ?? 0);
  const parameterValue = populationStatistic(statistic, population);
  const statisticValue = populationStatistic(statistic, sampleValues);
  const names = STATISTIC_NAMES[statistic];
  const isBinary = shape === 'bernoulli';
  const digits =
    isBinary || statistic === 'media' || statistic === 'mediana' ? decimals + 2 : decimals;

  const lo = Math.min(...population);
  const hi = Math.max(...population);
  const pad = isBinary ? 0.1 : (hi - lo) * 0.05 || 1;

  const shownValues = sampleValues.slice(-8).map((value) => formatNumber(value, decimals));
  const sumTex =
    sampleValues.length === 0
      ? ''
      : statistic === 'media' || statistic === 'proporcion'
        ? `= \\frac{${sampleValues.length > 8 ? '\\dots + ' : ''}${shownValues.join(' + ')}}{${sampleValues.length}} `
        : '';
  const header =
    `${names.parameter} = ${formatNumber(parameterValue, digits)}\\ \\text{(parámetro, ${population.length} unidades)}` +
    `\\qquad ${names.statistic} ${sumTex}= ${sampleValues.length === 0 ? '?' : formatNumber(statisticValue, digits)}` +
    `\\ \\text{(estadístico, ${sampleValues.length} de ${n})}`;

  const error = statisticValue - parameterValue;
  const description =
    `Población de ${population.length} ${unit}s; ${names.name} de ${variable}: ${formatNumber(parameterValue, digits)}. ` +
    (sampleValues.length === 0
      ? 'Aún no se ha extraído ninguna unidad.'
      : `Muestra actual con ${sampleValues.length} unidades: ${names.name} ${formatNumber(statisticValue, digits)}, error ${formatNumber(error, digits)}.`) +
    (state.history.length > 0
      ? ` Se han completado ${state.history.length} muestras; su ${names.name} promedio es ${formatNumber(state.history.reduce((a, b) => a + b, 0) / state.history.length, digits)}.`
      : '');

  const valueLabel = (value: number) =>
    isBinary ? (value === 1 ? (props.success ?? 'sí') : 'no') : formatNumber(value, decimals);

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: `Tamaño de la población N`, value: String(population.length) },
        { label: 'Unidades en la muestra', value: `${sampleValues.length} de ${n}` },
        {
          label: `Parámetro: ${names.name} poblacional`,
          value: formatNumber(parameterValue, digits),
          color: DATA_COLORS.primary,
        },
        {
          label: `Estadístico: ${names.name} muestral`,
          value: sampleValues.length === 0 ? 'sin datos' : formatNumber(statisticValue, digits),
          color: DATA_COLORS.highlight,
        },
        ...(focus === 'parametro'
          ? [
              {
                label: props.enumerate ? 'Muestras posibles recorridas' : 'Muestras completadas',
                value: props.enumerate
                  ? `${state.history.length} de ${combinations.length}`
                  : String(state.history.length),
              },
              {
                label: 'Promedio de los estadísticos',
                value:
                  state.history.length === 0
                    ? 'sin datos'
                    : formatNumber(
                        state.history.reduce((a, b) => a + b, 0) / state.history.length,
                        digits,
                      ),
              },
            ]
          : []),
      ]}
      legend={[
        { label: `${unit} de la población`, color: DATA_COLORS.neutral, shape: 'circle' },
        { label: `${unit} en la muestra`, color: DATA_COLORS.highlight, shape: 'circle' },
        { label: 'Parámetro', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Estadístico', color: DATA_COLORS.highlight, shape: 'dashed' },
      ]}
      description={description}
      dataTable={{
        caption: `Unidades de la muestra actual y su ${variable}`,
        columns: ['Orden', 'Unidad', variable],
        rows: sampleIndices.map((index, i) => [
          String(i + 1),
          `${unit} ${index + 1}`,
          valueLabel(population[index] ?? 0),
        ]),
      }}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.62}
        minHeight={320}
        maxHeight={560}
        margins={{ top: 8, right: 16, bottom: 44, left: 16 }}
      >
        {(box) => {
          const gridHeight = box.inner.height * GRID_HEIGHT_SHARE;
          const columns = Math.ceil(
            Math.sqrt((population.length * box.inner.width) / Math.max(1, gridHeight)),
          );
          const rows = Math.ceil(population.length / columns);
          const cell = Math.min(box.inner.width / columns, gridHeight / rows);
          const radius = Math.max(2, cell * 0.36);
          const gridLeft = box.inner.left + (box.inner.width - columns * cell) / 2;
          const stripTop = box.inner.top + gridHeight + STRIP_GAP;
          const stripBottom = box.inner.top + box.inner.height;
          const x = scaleLinear()
            .domain([lo - pad, hi + pad])
            .range([box.inner.left + 8, box.inner.left + box.inner.width - 8]);
          const axisY = stripBottom;
          const historyBase = axisY - 26;
          const counts = new Map<string, number>();
          return (
            <g>
              {population.map((value, index) => {
                const cx = gridLeft + (index % columns) * cell + cell / 2;
                const cy = box.inner.top + Math.floor(index / columns) * cell + cell / 2;
                const selected = inSample.has(index);
                const intensity = isBinary ? value : (value - lo) / Math.max(1e-9, hi - lo);
                return (
                  <circle
                    key={index}
                    cx={cx}
                    cy={cy}
                    r={selected ? radius * 1.15 : radius}
                    fill={
                      selected
                        ? DATA_COLORS.highlight
                        : isBinary && value === 1
                          ? DATA_COLORS.tertiary
                          : DATA_COLORS.primary
                    }
                    fillOpacity={
                      selected
                        ? 1
                        : isBinary
                          ? value === 1
                            ? 0.85
                            : 0.2
                          : DOT_MIN_OPACITY + (1 - DOT_MIN_OPACITY) * intensity * 0.8
                    }
                    stroke={selected ? DATA_COLORS.text : 'none'}
                    strokeWidth={selected ? 1.5 : 0}
                  />
                );
              })}
              <text x={box.inner.left} y={stripTop - 12} className={styles.chartLabel}>
                {`${variable} de cada unidad (marcas grises: población; puntos: muestra)`}
              </text>
              {population.map((value, index) => (
                <line
                  key={index}
                  x1={x(value)}
                  x2={x(value)}
                  y1={axisY - POPULATION_TICK}
                  y2={axisY}
                  stroke={DATA_COLORS.neutral}
                  strokeOpacity={0.5}
                />
              ))}
              {focus === 'parametro'
                ? state.history.map((value, index) => {
                    const key = Math.round(x(value) / (HISTORY_DOT * 2)).toString();
                    const level = counts.get(key) ?? 0;
                    counts.set(key, level + 1);
                    return (
                      <circle
                        key={index}
                        cx={x(value)}
                        cy={historyBase - level * HISTORY_DOT * 2}
                        r={HISTORY_DOT}
                        fill={DATA_COLORS.secondary}
                        fillOpacity={0.75}
                      />
                    );
                  })
                : sampleValues.map((value, index) => {
                    const key = Math.round(x(value) / (HISTORY_DOT * 2.4)).toString();
                    const level = counts.get(key) ?? 0;
                    counts.set(key, level + 1);
                    return (
                      <circle
                        key={index}
                        cx={x(value)}
                        cy={historyBase - level * HISTORY_DOT * 2.4}
                        r={HISTORY_DOT + 1}
                        fill={DATA_COLORS.highlight}
                      />
                    );
                  })}
              <line
                x1={x(parameterValue)}
                x2={x(parameterValue)}
                y1={stripTop}
                y2={axisY}
                stroke={DATA_COLORS.primary}
                strokeWidth={3}
              />
              {sampleValues.length > 0 && (
                <line
                  x1={x(statisticValue)}
                  x2={x(statisticValue)}
                  y1={stripTop}
                  y2={axisY}
                  stroke={DATA_COLORS.highlight}
                  strokeWidth={3}
                  strokeDasharray="6 4"
                />
              )}
              <Axis
                scale={x}
                orientation="bottom"
                position={axisY}
                ticks={6}
                {...(isBinary ? { tickValues: [0, 1], format: (v: number) => valueLabel(v) } : {})}
              />
            </g>
          );
        }}
      </ChartSvg>
      {focus === 'parametro' && (
        <p className={styles.caption}>
          Cada punto de la franja inferior es el estadístico de una muestra completa: el parámetro
          no cambia, el estadístico varía de muestra en muestra.
        </p>
      )}
    </VizFrame>
  );
}
