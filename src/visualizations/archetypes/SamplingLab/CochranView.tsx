import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { sumOfSquares } from '../../../lib/inference/sampling.ts';
import { mean, pearson, variance } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, type SeedState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { makePopulation, POPULATION_NAMES } from './populations.ts';
import { POPULATIONS, type PopulationId } from './schema.ts';
import styles from './SamplingLab.module.css';

const MU = 50;
const SIGMA = 10;
const SAMPLES_PER_SECOND = 20;
const MAX_SAMPLES = 1500;

interface Simulation {
  pairs: { m: number; v: number }[];
  last: number[];
}

interface CochranViewProps {
  title: string;
  population: PopulationId;
  n: number;
  seed: SeedState;
}

/**
 * Each sample contributes the point (sample mean, sample variance). For a
 * normal population the cloud has no tilt or shape: mean and variance are
 * independent, a consequence of Cochran's theorem. For skewed populations
 * the two move together. The bars split the total sum of squares of the
 * last sample into its within-sample part and its mean part.
 */
export function CochranView({ title, population: p0, n: n0, seed }: CochranViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select',
        key: 'poblacion',
        label: 'Forma de la población',
        options: POPULATIONS.map((value) => ({ value, label: POPULATION_NAMES[value] })),
        default: p0,
      },
      {
        type: 'number',
        key: 'n',
        label: 'Tamaño de cada muestra',
        symbol: 'n',
        min: 2,
        max: 50,
        step: 1,
        default: n0,
      },
    ],
    [p0, n0],
  );
  const parameters = useParameters(definitions);
  const id = String(parameters.values.poblacion) as PopulationId;
  const n = Number(parameters.values.n);
  const population = useMemo(() => makePopulation(id, MU, SIGMA), [id]);
  const [run, setRun] = useState(0);
  const runKey = `${id}|${n}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [sim, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    pairs: [],
    last: [],
  }));
  const draw = (count: number) => {
    const generator = random();
    const pairs: { m: number; v: number }[] = [];
    let last: number[] = [];
    for (let k = 0; k < count; k += 1) {
      last = Array.from({ length: n }, () => population.sample(generator));
      pairs.push({ m: mean(last), v: variance(last) });
    }
    update((prev) => ({ pairs: [...prev.pairs, ...pairs].slice(0, MAX_SAMPLES), last }));
  };
  const playback = usePlayback({
    step: () => draw(1),
    stepMany: draw,
    reset: () => setRun((v) => v + 1),
    rate: SAMPLES_PER_SECOND,
    done: sim.pairs.length >= MAX_SAMPLES,
  });
  const r =
    sim.pairs.length > 3
      ? pearson(
          sim.pairs.map((p) => p.m),
          sim.pairs.map((p) => p.v),
        )
      : Number.NaN;
  const ss = sim.last.length ? sumOfSquares(sim.last, MU) : null;
  const header = ss
    ? `\\underbrace{${formatNumber(ss.total, 1)}}_{\\sum (x_i - \\mu)^2} = \\underbrace{${formatNumber(ss.within, 1)}}_{\\sum (x_i - \\bar{x})^2} + \\underbrace{${formatNumber(ss.mean, 1)}}_{n(\\bar{x} - \\mu)^2}`
    : `\\sum (x_i - \\mu)^2 = \\sum (x_i - \\bar{x})^2 + n(\\bar{x} - \\mu)^2`;
  const description =
    `Población ${POPULATION_NAMES[id].toLowerCase()}, muestras de tamaño ${n}. ${sim.pairs.length} pares de media y varianza muestrales; correlación entre ambas ${formatNumber(r, 3)}.` +
    (ss
      ? ` En la última muestra la suma total de cuadrados ${formatNumber(ss.total, 1)} se divide en ${formatNumber(ss.within, 1)} dentro de la muestra y ${formatNumber(ss.mean, 1)} de la media.`
      : '');
  const vMax = useMemo(() => {
    const sample = Array.from({ length: 400 }, (_, i) => population.quantile((i + 0.5) / 400));
    return Math.max(variance(sample) * (n < 6 ? 5 : 3), SIGMA * SIGMA * 2.5);
  }, [population, n]);
  const mSpan = (4 * SIGMA) / Math.sqrt(n);

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Muestras', value: String(sim.pairs.length) },
        {
          label: 'Correlación entre media y varianza',
          value: formatNumber(r, 3),
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Media de las varianzas',
          value: sim.pairs.length ? formatNumber(mean(sim.pairs.map((p) => p.v)), 2) : 'sin datos',
        },
        { label: 'σ²', value: String(SIGMA * SIGMA) },
      ]}
      legend={[
        { label: 'Una muestra: (media, varianza)', color: DATA_COLORS.secondary, shape: 'circle' },
        { label: 'Parte dentro de la muestra', color: DATA_COLORS.primary },
        { label: 'Parte de la media', color: DATA_COLORS.highlight },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div className={styles.pair}>
        <ChartSvg
          label={`Pares de media y varianza muestrales. ${description}`}
          aspect={0.8}
          minHeight={240}
          maxHeight={380}
          margins={{ top: 12, right: 12, bottom: 46, left: 56 }}
        >
          {(box) => {
            const x = scaleLinear()
              .domain([MU - mSpan, MU + mSpan])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const y = scaleLinear()
              .domain([0, vMax])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            return (
              <g>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="Varianza muestral s²"
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={5}
                  label="Media muestral"
                />
                <g aria-hidden="true">
                  {sim.pairs.map((p, i) => (
                    <circle
                      key={i}
                      cx={x(p.m)}
                      cy={y(Math.min(vMax, p.v))}
                      r={2}
                      fill={DATA_COLORS.secondary}
                      fillOpacity={0.45}
                    />
                  ))}
                </g>
              </g>
            );
          }}
        </ChartSvg>
        <ChartSvg
          label="Descomposición de la suma de cuadrados de la última muestra."
          aspect={0.8}
          minHeight={240}
          maxHeight={380}
          margins={{ top: 12, right: 12, bottom: 46, left: 56 }}
        >
          {(box) => {
            const top = ss ? Math.max(ss.total, 1) : 1;
            const y = scaleLinear()
              .domain([0, top * 1.1])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const w = box.inner.width / 5;
            const bars = ss
              ? [
                  {
                    label: 'Total',
                    x: box.inner.left + w * 0.5,
                    parts: [{ v: ss.total, c: DATA_COLORS.text }],
                  },
                  {
                    label: 'Dentro + media',
                    x: box.inner.left + w * 2.5,
                    parts: [
                      { v: ss.within, c: DATA_COLORS.primary },
                      { v: ss.mean, c: DATA_COLORS.highlight },
                    ],
                  },
                ]
              : [];
            return (
              <g>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="Suma de cuadrados"
                />
                {bars.map((b) => {
                  let base = 0;
                  return (
                    <g key={b.label}>
                      {b.parts.map((part, k) => {
                        const y0 = y(base);
                        base += part.v;
                        return (
                          <rect
                            key={k}
                            x={b.x}
                            y={y(base)}
                            width={w * 1.6}
                            height={y0 - y(base)}
                            fill={part.c}
                            fillOpacity={0.8}
                            aria-hidden="true"
                          />
                        );
                      })}
                      <text
                        x={b.x + w * 0.8}
                        y={box.inner.top + box.inner.height + 18}
                        textAnchor="middle"
                        className={styles.chartLabel}
                      >
                        {b.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          }}
        </ChartSvg>
      </div>
    </VizFrame>
  );
}
