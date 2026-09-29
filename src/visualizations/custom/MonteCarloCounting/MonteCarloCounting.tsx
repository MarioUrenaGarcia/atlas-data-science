import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import {
  estimateCount,
  hasAdjacentOnes,
  stringsWithoutAdjacentOnes,
  subsetsWithSumAtMost,
} from '../../../lib/combinatorics/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './MonteCarloCounting.module.css';
import type { MonteCarloCountingConfig } from './schema.ts';

const SAMPLES_PER_SECOND = 40;
const MAX_SAMPLES = 20000;
/** History points kept for the chart; later samples are recorded more sparsely. */
const HISTORY_EVERY = 10;
const SUBSET_SIZE = 20;
const CELL = 22;

interface Simulation {
  samples: number;
  hits: number;
  last: number[] | null;
  history: { samples: number; estimate: number; low: number; high: number }[];
}

/**
 * Counting a set too large to list by sampling its universe uniformly: the
 * share of samples that satisfy the property, times the size of the
 * universe, estimates the count. The band is a 95 % interval that narrows
 * like 1 / sqrt(N) around the exact value.
 */
export default function MonteCarloCounting({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as MonteCarloCountingConfig;
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'problema',
        label: 'Qué se cuenta',
        options: [
          { value: 'sin-unos-consecutivos', label: 'Cadenas binarias sin dos unos seguidos' },
          { value: 'subconjuntos-suma', label: 'Subconjuntos de {1, ..., 20} con suma acotada' },
        ],
        default: config.problema ?? 'sin-unos-consecutivos',
      },
      {
        type: 'number' as const,
        key: 'largo',
        label: 'Longitud de la cadena',
        symbol: 'L',
        min: 8,
        max: 30,
        step: 1,
        default: config.largo ?? 16,
      },
      {
        type: 'number' as const,
        key: 'limite',
        label: 'Suma máxima',
        symbol: 'S',
        min: 10,
        max: 200,
        step: 5,
        default: config.limite ?? 60,
      },
    ],
    [config.problema, config.largo, config.limite],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const problem = String(values.problema);
  const length = problem === 'sin-unos-consecutivos' ? Number(values.largo) : SUBSET_SIZE;
  const limit = Number(values.limite);
  const universe = 2 ** length;
  const exact =
    problem === 'sin-unos-consecutivos'
      ? stringsWithoutAdjacentOnes(length)
      : subsetsWithSumAtMost(SUBSET_SIZE, limit);
  const accepts = (bits: readonly number[]) =>
    problem === 'sin-unos-consecutivos'
      ? !hasAdjacentOnes(bits)
      : bits.reduce((sum, bit, index) => sum + bit * (index + 1), 0) <= limit;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${problem}|${length}|${limit}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [simulation, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    samples: 0,
    hits: 0,
    last: null,
    history: [],
  }));
  const sample = (count: number) => {
    const generator = random();
    const drawn = Array.from({ length: count }, () =>
      Array.from({ length }, () => (generator.bernoulli(0.5) ? 1 : 0)),
    );
    update((previous) => {
      let { samples, hits } = previous;
      const history = [...previous.history];
      const accepted = drawn.slice(0, Math.max(0, MAX_SAMPLES - samples));
      accepted.forEach((bits) => {
        samples += 1;
        if (accepts(bits)) hits += 1;
        if (samples <= 100 || samples % HISTORY_EVERY === 0)
          history.push({ samples, ...estimateCount(hits, samples, universe) });
      });
      return { samples, hits, last: accepted.at(-1) ?? previous.last, history };
    });
  };
  const playback = usePlayback({
    step: () => sample(1),
    stepMany: sample,
    reset: () => setRun((value) => value + 1),
    rate: SAMPLES_PER_SECOND,
    done: simulation.samples >= MAX_SAMPLES,
  });
  const result = estimateCount(simulation.hits, simulation.samples, universe);
  const lastAccepted = simulation.last ? accepts(simulation.last) : false;
  const relativeError = simulation.samples === 0 ? 0 : Math.abs(result.estimate - exact) / exact;
  const description =
    `Universo de 2^${length} = ${formatNumber(universe, 0)} objetos. Tras ${simulation.samples} muestras, ${simulation.hits} cumplen la condición; ` +
    `estimación ${formatNumber(result.estimate, 0)} con intervalo de ${formatNumber(result.low, 0)} a ${formatNumber(result.high, 0)}. Valor exacto ${formatNumber(exact, 0)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{
        ...parameters,
        values,
        disabled: problem === 'sin-unos-consecutivos' ? ['limite'] : ['largo'],
      }}
      readouts={[
        { label: 'Muestras', value: String(simulation.samples) },
        { label: 'Cumplen', value: String(simulation.hits) },
        {
          label: 'Estimación',
          value: formatNumber(result.estimate, 0),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Intervalo del 95 %',
          value: `${formatNumber(result.low, 0)} a ${formatNumber(result.high, 0)}`,
        },
        { label: 'Valor exacto', value: formatNumber(exact, 0), color: DATA_COLORS.secondary },
        { label: 'Error relativo', value: `${formatNumber(relativeError * 100, 2)} %` },
      ]}
      legend={[
        { label: 'Estimación', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Intervalo del 95 %', color: DATA_COLORS.light },
        { label: 'Valor exacto', color: DATA_COLORS.secondary, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\widehat{|A|} = |U| \\cdot \\frac{\\#\\text{muestras en } A}{N} = 2^{${length}} \\cdot \\frac{${simulation.hits}}{${simulation.samples}}`}
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0}
        minHeight={CELL + 30}
        maxHeight={CELL + 30}
        margins={{ top: 4, right: 8, bottom: 4, left: 8 }}
      >
        {(box) => {
          const cell = Math.min(CELL, box.inner.width / length);
          const start = box.inner.left + (box.inner.width - cell * length) / 2;
          const bits = simulation.last ?? Array.from({ length }, () => 0);
          return (
            <g aria-hidden="true">
              {bits.map((bit, index) => {
                const inPair =
                  problem === 'sin-unos-consecutivos' &&
                  bit === 1 &&
                  (bits[index - 1] === 1 || bits[index + 1] === 1);
                return (
                  <g key={index}>
                    <rect
                      x={start + index * cell + 1}
                      y={box.inner.top}
                      width={cell - 2}
                      height={cell}
                      rx={3}
                      fill={
                        bit === 1
                          ? inPair
                            ? DATA_COLORS.secondary
                            : DATA_COLORS.primary
                          : 'var(--color-surface-2)'
                      }
                      fillOpacity={bit === 1 ? 0.6 : 1}
                      stroke="var(--color-border)"
                    />
                    <text
                      x={start + (index + 0.5) * cell}
                      y={box.inner.top + cell / 2}
                      dy="0.35em"
                      textAnchor="middle"
                      className={svgStyles.label}
                      style={{ fontSize: Math.min(11, cell * 0.5) }}
                    >
                      {problem === 'sin-unos-consecutivos' ? bit : index + 1}
                    </text>
                  </g>
                );
              })}
              {simulation.last && (
                <text
                  x={box.inner.left + box.inner.width / 2}
                  y={box.inner.top + cell + 18}
                  textAnchor="middle"
                  className={svgStyles.label}
                  style={{
                    fill: lastAccepted ? DATA_COLORS.tertiary : DATA_COLORS.secondary,
                    fontWeight: 700,
                  }}
                >
                  {lastAccepted ? 'cumple' : 'no cumple'}
                  {problem === 'subconjuntos-suma'
                    ? `: suma ${simulation.last.reduce((sum, bit, index) => sum + bit * (index + 1), 0)}`
                    : ''}
                </text>
              )}
            </g>
          );
        }}
      </ChartSvg>
      <ChartSvg label={description} aspect={0.45} minHeight={220} maxHeight={360}>
        {(box) => {
          const history = simulation.history;
          const maxSamples = Math.max(100, simulation.samples);
          const x = scaleLinear()
            .domain([0, maxSamples])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const visible = history.filter(
            (point) => point.samples >= Math.min(20, simulation.samples),
          );
          const top = Math.max(exact * 2, ...visible.map((point) => point.high));
          const y = scaleLinear()
            .domain([0, top])
            .nice()
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const band =
            visible.length > 1
              ? [
                  ...visible.map((point) => `${x(point.samples)},${y(point.high)}`),
                  ...[...visible].reverse().map((point) => `${x(point.samples)},${y(point.low)}`),
                ].join(' ')
              : '';
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                format={(value) => formatNumber(value, 0)}
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="muestras N"
                format={(value) => formatNumber(value, 0)}
              />
              <g aria-hidden="true">
                {band && <polygon points={band} fill={DATA_COLORS.light} fillOpacity={0.35} />}
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(exact)}
                  y2={y(exact)}
                  stroke={DATA_COLORS.secondary}
                  strokeDasharray="6 4"
                  strokeWidth={2}
                />
              </g>
              {visible.length > 1 && (
                <CurvePath
                  points={visible.map((point) => ({ x: point.samples, y: point.estimate }))}
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
    </VizFrame>
  );
}
