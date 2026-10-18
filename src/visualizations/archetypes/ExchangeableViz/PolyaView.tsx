import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { betaFunction } from '../../../lib/distributions/special.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { DensityHistogram } from '../../shared/DensityHistogram.tsx';
import styles from './ExchangeableViz.module.css';
import type { ExchangeableVizConfig } from './schema.ts';

const DEFAULT_DRAWS = 60;
const DEFAULT_SEQUENCES = 40;
const DRAWS_PER_SECOND = 6;
const BINS = 20;
const CURVE_POINTS = 200;

interface UrnState {
  /** Balls of the first color drawn so far, per sequence. */
  ones: number[];
  /** Running proportion of first-color draws, per sequence and step. */
  paths: number[][];
  step: number;
  last: number | null;
}

interface PolyaViewProps {
  title: string;
  conceptId: string;
  config: ExchangeableVizConfig;
}

/**
 * Pólya urns run side by side: each starts with a balls of the first color
 * and b of the second, and every draw returns the ball with one more of its
 * color. Each sequence's proportion of first-color draws settles at its own
 * limit, and the limits across sequences follow a Beta(a, b) distribution:
 * the draws are exchangeable, not independent.
 */
export function PolyaView({ title, conceptId, config }: PolyaViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'a',
        label: 'Bolas iniciales del primer color',
        symbol: 'a',
        min: 1,
        max: 8,
        step: 1,
        digits: 0,
        default: config.a ?? 1,
      },
      {
        type: 'number' as const,
        key: 'b',
        label: 'Bolas iniciales del segundo color',
        symbol: 'b',
        min: 1,
        max: 8,
        step: 1,
        digits: 0,
        default: config.b ?? 1,
      },
    ],
    [config.a, config.b],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const a = values.a ?? 1;
  const b = values.b ?? 1;
  const draws = config.n ?? DEFAULT_DRAWS;
  const sequences = Math.min(200, config.secuencias ?? DEFAULT_SEQUENCES);

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const key = `${run}|${seed.seed}|${a}|${b}`;
  const random = useRandomSource(seed.seed, key);
  const [urn, update] = useResettableState<UrnState>(key, () => ({
    ones: Array<number>(sequences).fill(0),
    paths: Array.from({ length: sequences }, () => []),
    step: 0,
    last: null,
  }));
  const advance = (count: number) => {
    const generator = random();
    update((previous) => {
      let { step, last } = previous;
      const ones = [...previous.ones];
      const paths = previous.paths.map((path) => [...path]);
      for (let c = 0; c < count && step < draws; c += 1) {
        for (let s = 0; s < sequences; s += 1) {
          const k = ones[s] ?? 0;
          const hit = generator.uniform() < (a + k) / (a + b + step) ? 1 : 0;
          ones[s] = k + hit;
          paths[s]?.push((k + hit) / (step + 1));
          if (s === 0) last = hit;
        }
        step += 1;
      }
      return { ones, paths, step, last };
    });
  };
  const playback = usePlayback({
    step: () => advance(1),
    stepMany: advance,
    reset: () => setRun((value) => value + 1),
    rate: DRAWS_PER_SECOND,
    done: urn.step >= draws,
  });
  const m = urn.step;
  const k1 = urn.ones[0] ?? 0;
  const nextProbability = (a + k1) / (a + b + m);
  const finals = urn.paths.map((path) => path.at(-1) ?? 0);
  const width = 1 / BINS;
  const counts = Array<number>(BINS).fill(0);
  for (const value of finals) {
    const bin = Math.min(BINS - 1, Math.floor(value / width));
    counts[bin] = (counts[bin] ?? 0) + 1;
  }
  const densities = counts.map((c) => (m > 0 ? c / (finals.length * width) : 0));
  const betaDensity = (p: number) =>
    p <= 0 || p >= 1 ? 0 : (p ** (a - 1) * (1 - p) ** (b - 1)) / betaFunction(a, b);
  const success = config.exito ?? 'primer color';
  const f = (v: number) => formatNumber(v, 3);
  const header =
    m === 0
      ? `P(\\text{siguiente es del primer color}) = \\frac{a + k}{a + b + m} = \\frac{${a}}{${a + b}}`
      : `\\text{urna 1: } k = ${k1} \\text{ de } m = ${m} \\;\\Rightarrow\\; P(\\text{siguiente}) = \\frac{${a} + ${k1}}{${a} + ${b} + ${m}} = ${f(nextProbability)}`;
  const description =
    `${sequences} urnas de Pólya con ${a} y ${b} bolas iniciales, ${m} de ${draws} extracciones. ` +
    `Proporciones actuales entre ${f(Math.min(...finals))} y ${f(Math.max(...finals))}; los límites siguen una Beta(${a}, ${b}).`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Extracciones por urna', value: `${m} de ${draws}` },
        {
          label: 'Urna 1: última extracción',
          value:
            urn.last === null
              ? 'sin datos'
              : urn.last === 1
                ? success
                : (config.fracaso ?? 'segundo color'),
          color: DATA_COLORS.highlight,
        },
        {
          label: 'Urna 1: proporción',
          value: m > 0 ? f(k1 / m) : 'sin datos',
          color: DATA_COLORS.highlight,
        },
        { label: 'Media de los límites, a/(a+b)', value: f(a / (a + b)) },
      ]}
      legend={[
        { label: 'Proporción en cada urna', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Urna 1', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Histograma de proporciones finales', color: DATA_COLORS.secondary },
        { label: `Densidad Beta(${a}, ${b})`, color: DATA_COLORS.text, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <div className={styles.panels}>
        <ChartSvg label={description} aspect={0.75} minHeight={240} maxHeight={340}>
          {(box) => {
            const x = scaleLinear()
              .domain([1, draws])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const y = scaleLinear()
              .domain([0, 1])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            return (
              <>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="proporción"
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={5}
                  label="extracción"
                />
                {urn.paths.map((path, s) =>
                  path.length > 1 ? (
                    <CurvePath
                      key={s}
                      points={path.map((value, t) => ({ x: t + 1, y: value }))}
                      xScale={x}
                      yScale={y}
                      color={s === 0 ? DATA_COLORS.highlight : DATA_COLORS.primary}
                      width={s === 0 ? 2.5 : 1}
                      animate={false}
                    />
                  ) : null,
                )}
              </>
            );
          }}
        </ChartSvg>
        <DensityHistogram
          start={0}
          width={width}
          densities={densities}
          curves={[{ f: betaDensity, color: DATA_COLORS.text }]}
          domain={[0, 1]}
          label={`Proporciones finales de las urnas. ${description}`}
          axisLabel="proporción final"
          aspect={0.75}
          minTop={Math.max(
            1.2,
            ...Array.from({ length: CURVE_POINTS }, (_, i) => betaDensity((i + 0.5) / CURVE_POINTS))
              .filter(Number.isFinite)
              .map((v) => Math.min(v, 6)),
          )}
        />
      </div>
      <p className={styles.caption}>
        Cada línea es una urna. Las primeras extracciones refuerzan su propio color, así que cada
        urna se estabiliza en una proporción distinta; el histograma de esas proporciones se acerca
        a la densidad beta.
      </p>
    </VizFrame>
  );
}
