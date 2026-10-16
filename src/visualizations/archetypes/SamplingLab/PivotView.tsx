import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { normal, studentT } from '../../../lib/distributions/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { tPivot } from '../../../lib/inference/sampling.ts';
import { mean, standardDeviation } from '../../../lib/stats/index.ts';
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

const SAMPLES_PER_SECOND = 25;
const MAX_SAMPLES = 3000;
const T_LIMIT = 6;
const BINS = 48;
const CURVE_POINTS = 160;
const LOGNORMAL_MEAN_RATIO = 2;

interface Simulation {
  values: number[];
  last: number[];
}

interface PivotViewProps {
  title: string;
  population: PopulationId;
  n: number;
  mu: number;
  sigma: number;
  seed: SeedState;
}

/**
 * The studentized mean T = (xbar - mu) / (s / sqrt(n)) is computed for many
 * samples. Its histogram follows Student's t with n - 1 degrees of freedom
 * whatever the values of mu and sigma: that independence from the unknown
 * parameters is what makes T a pivot.
 */
export function PivotView({
  title,
  population: p0,
  n: n0,
  mu: mu0,
  sigma: s0,
  seed,
}: PivotViewProps) {
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
        max: 60,
        step: 1,
        default: n0,
      },
      {
        type: 'number',
        key: 'mu',
        label: 'Media de la población',
        symbol: 'μ',
        min: -100,
        max: 100,
        step: 5,
        default: mu0,
        shownWhen: { key: 'poblacion', values: ['normal', 'exponencial', 'uniforme'] },
      },
      {
        type: 'number',
        key: 'sigma',
        label: 'Desviación de la población',
        symbol: 'σ',
        min: 1,
        max: 50,
        step: 1,
        default: s0,
      },
    ],
    [p0, n0, mu0, s0],
  );
  const parameters = useParameters(definitions);
  const id = String(parameters.values.poblacion) as PopulationId;
  const n = Number(parameters.values.n);
  const mu = Number(parameters.values.mu);
  const sigma = Number(parameters.values.sigma);
  // A lognormal needs a positive mean; fixing it at twice sigma keeps its shape constant.
  const population = useMemo(
    () => makePopulation(id, id === 'lognormal' ? LOGNORMAL_MEAN_RATIO * sigma : mu, sigma),
    [id, mu, sigma],
  );
  const trueMean = population.mean;
  const [run, setRun] = useState(0);
  const runKey = `${id}|${n}|${mu}|${sigma}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [sim, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    values: [],
    last: [],
  }));
  const draw = (count: number) => {
    const generator = random();
    const values: number[] = [];
    let last: number[] = [];
    for (let k = 0; k < count; k += 1) {
      last = Array.from({ length: n }, () => population.sample(generator));
      values.push(tPivot(last, trueMean));
    }
    update((prev) => ({ values: [...prev.values, ...values].slice(0, MAX_SAMPLES), last }));
  };
  const playback = usePlayback({
    step: () => draw(1),
    stepMany: draw,
    reset: () => setRun((v) => v + 1),
    rate: SAMPLES_PER_SECOND,
    done: sim.values.length >= MAX_SAMPLES,
  });
  const t = useMemo(() => studentT(n - 1), [n]);
  const z = useMemo(() => normal(0, 1), []);
  const critical = t.quantile(0.975);
  const outside = sim.values.length
    ? sim.values.filter((v) => Math.abs(v) > critical).length / sim.values.length
    : Number.NaN;
  const lastT = sim.values[sim.values.length - 1];
  const header =
    lastT === undefined
      ? `T = \\frac{\\bar{X} - \\mu}{S/\\sqrt{n}} \\sim t_{${n - 1}}`
      : `T = \\frac{${formatNumber(mean(sim.last), 2)} - ${formatNumber(trueMean, 2)}}{${formatNumber(standardDeviation(sim.last), 2)}/\\sqrt{${n}}} = ${formatNumber(lastT, 3)}`;
  const description =
    `Población ${POPULATION_NAMES[id].toLowerCase()} con media ${formatNumber(trueMean, 2)} y desviación ${sigma}, muestras de tamaño ${n}. ` +
    `${sim.values.length} valores de T; ${formatNumber(100 * outside, 1)} % caen fuera de más o menos ${formatNumber(critical, 3)}, donde la t con ${n - 1} grados de libertad deja 5 %.`;
  const bars = useMemo(() => {
    const width = (2 * T_LIMIT) / BINS;
    const counts = new Array<number>(BINS).fill(0);
    for (const v of sim.values) {
      if (v < -T_LIMIT || v > T_LIMIT) continue;
      const k = Math.min(BINS - 1, Math.floor((v + T_LIMIT) / width));
      counts[k] = (counts[k] ?? 0) + 1;
    }
    return counts.map((c, i) => ({
      x0: -T_LIMIT + i * width,
      x1: -T_LIMIT + (i + 1) * width,
      d: sim.values.length ? c / (sim.values.length * width) : 0,
    }));
  }, [sim.values]);

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Muestras', value: String(sim.values.length) },
        {
          label: 'Media y desviación de T',
          value:
            sim.values.length > 1
              ? `${formatNumber(mean(sim.values), 3)}; ${formatNumber(standardDeviation(sim.values), 3)}`
              : 'sin datos',
        },
        {
          label: `Fuera de ±${formatNumber(critical, 2)}`,
          value: Number.isFinite(outside) ? `${formatNumber(100 * outside, 1)} %` : 'sin datos',
          color: DATA_COLORS.secondary,
        },
        { label: 'Esperado si T sigue la t', value: '5 %' },
      ]}
      legend={[
        { label: 'Histograma de T', color: DATA_COLORS.secondary },
        {
          label: `t de Student con ${n - 1} grados de libertad`,
          color: DATA_COLORS.primary,
          shape: 'line',
        },
        { label: 'Normal estándar', color: DATA_COLORS.text, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={240}
        maxHeight={400}
        margins={{ top: 12, right: 20, bottom: 46, left: 52 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([-T_LIMIT, T_LIMIT])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const yMax = Math.max(0.45, ...bars.map((b) => b.d)) * 1.08;
          const y = scaleLinear()
            .domain([0, yMax])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const curve = (pdf: (v: number) => number) =>
            Array.from({ length: CURVE_POINTS + 1 }, (_, i) => {
              const v = -T_LIMIT + (2 * T_LIMIT * i) / CURVE_POINTS;
              return `${x(v)},${y(pdf(v))}`;
            }).join(' ');
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="Densidad"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={9}
                label="T"
              />
              <g aria-hidden="true">
                {bars.map((b, i) => (
                  <rect
                    key={i}
                    x={x(b.x0)}
                    y={y(b.d)}
                    width={Math.max(0, x(b.x1) - x(b.x0) - 1)}
                    height={y(0) - y(b.d)}
                    fill={DATA_COLORS.secondary}
                    fillOpacity={0.6}
                  />
                ))}
                <polyline
                  points={curve((v) => z.pdf(v))}
                  fill="none"
                  stroke={DATA_COLORS.text}
                  strokeWidth={1.5}
                  strokeDasharray="5 3"
                />
                <polyline
                  points={curve((v) => t.pdf(v))}
                  fill="none"
                  stroke={DATA_COLORS.primary}
                  strokeWidth={2.5}
                />
                {[-critical, critical].map((c) => (
                  <line
                    key={c}
                    x1={x(c)}
                    x2={x(c)}
                    y1={box.inner.top}
                    y2={box.inner.top + box.inner.height}
                    stroke={DATA_COLORS.highlight}
                    strokeDasharray="4 3"
                  />
                ))}
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
