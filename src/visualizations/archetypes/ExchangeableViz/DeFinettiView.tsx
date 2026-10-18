import { scaleBand, scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { choose } from '../../../lib/distributions/special.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  mixtureSequence,
  polyaSequence,
  polyaSequenceProbability,
} from '../../../lib/probability/exchangeable.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ExchangeableViz.module.css';
import type { ExchangeableVizConfig } from './schema.ts';

const DEFAULT_DRAWS = 8;
const DEFAULT_REPETITIONS = 1500;
const SLOW_REPETITIONS = 6;
const SLOW_RATE = 1;
const REPETITION_SECONDS = 25;

interface Tally {
  urn: number[];
  mixture: number[];
  repetitions: number;
  lastUrn: number[];
  lastMixture: number[];
  lastP: number;
}

interface DeFinettiViewProps {
  title: string;
  conceptId: string;
  config: ExchangeableVizConfig;
}

/**
 * De Finetti's representation: n draws from a Pólya urn and n independent
 * Bernoulli trials whose success probability p was first drawn from a
 * Beta(a, b) produce the same distribution of sequences. The bars compare
 * the number of successes in both procedures with the exact beta-binomial
 * probabilities, and the header shows that the probability of a sequence
 * depends only on how many successes it has.
 */
export function DeFinettiView({ title, conceptId, config }: DeFinettiViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'a',
        label: 'Parámetro a',
        symbol: 'a',
        min: 1,
        max: 8,
        step: 1,
        digits: 0,
        default: config.a ?? 2,
      },
      {
        type: 'number' as const,
        key: 'b',
        label: 'Parámetro b',
        symbol: 'b',
        min: 1,
        max: 8,
        step: 1,
        digits: 0,
        default: config.b ?? 2,
      },
    ],
    [config.a, config.b],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const a = values.a ?? 2;
  const b = values.b ?? 2;
  const n = Math.min(20, config.n ?? DEFAULT_DRAWS);
  const total = config.secuencias ?? DEFAULT_REPETITIONS;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const key = `${run}|${seed.seed}|${a}|${b}`;
  const random = useRandomSource(seed.seed, key);
  const [tally, update] = useResettableState<Tally>(key, () => ({
    urn: Array<number>(n + 1).fill(0),
    mixture: Array<number>(n + 1).fill(0),
    repetitions: 0,
    lastUrn: [],
    lastMixture: [],
    lastP: 0,
  }));
  const repeat = (count: number) => {
    const generator = random();
    update((previous) => {
      const next = { ...previous, urn: [...previous.urn], mixture: [...previous.mixture] };
      for (let c = 0; c < count && next.repetitions < total; c += 1) {
        const urnDraws = polyaSequence(a, b, n, generator);
        const mixture = mixtureSequence(a, b, n, generator);
        const ku = urnDraws.reduce((s, v) => s + v, 0);
        const km = mixture.draws.reduce((s, v) => s + v, 0);
        next.urn[ku] = (next.urn[ku] ?? 0) + 1;
        next.mixture[km] = (next.mixture[km] ?? 0) + 1;
        next.repetitions += 1;
        next.lastUrn = urnDraws;
        next.lastMixture = mixture.draws;
        next.lastP = mixture.p;
      }
      return next;
    });
  };
  const playback = usePlayback({
    step: () => repeat(1),
    stepMany: repeat,
    reset: () => setRun((value) => value + 1),
    rate:
      tally.repetitions < SLOW_REPETITIONS ? SLOW_RATE : Math.max(30, total / REPETITION_SECONDS),
    done: tally.repetitions >= total,
  });
  const exact = Array.from(
    { length: n + 1 },
    (_, k) => choose(n, k) * polyaSequenceProbability(a, b, n, k),
  );
  const r = tally.repetitions;
  const urnShare = tally.urn.map((c) => (r > 0 ? c / r : 0));
  const mixtureShare = tally.mixture.map((c) => (r > 0 ? c / r : 0));
  const kLast = tally.lastUrn.reduce((s, v) => s + v, 0);
  const f = (v: number) => formatNumber(v, 3);
  const header =
    r === 0
      ? `P(x_1, \\dots, x_n) = \\int_0^1 p^{k} (1 - p)^{n - k}\\, \\frac{p^{a-1}(1-p)^{b-1}}{B(a, b)}\\, dp = \\frac{B(a + k,\\ b + n - k)}{B(a, b)}`
      : `P(\\text{${tally.lastUrn.join('')}}) = \\frac{B(${a} + ${kLast},\\ ${b} + ${n - kLast})}{B(${a}, ${b})} = ${formatNumber(polyaSequenceProbability(a, b, n, kLast), 5)} \\quad \\text{(igual para cualquier orden con } k = ${kLast})`;
  const description =
    `${r} repeticiones de ${n} extracciones con parámetros a = ${a} y b = ${b}. ` +
    `Probabilidades exactas del número de éxitos: ${exact.map(f).join(', ')}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Repeticiones', value: `${r} de ${total}` },
        {
          label: 'Última secuencia de la urna',
          value: tally.lastUrn.join('') || 'sin datos',
          color: DATA_COLORS.primary,
        },
        {
          label: 'Última p de la mezcla',
          value: r > 0 ? f(tally.lastP) : 'sin datos',
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Última secuencia de la mezcla',
          value: tally.lastMixture.join('') || 'sin datos',
          color: DATA_COLORS.secondary,
        },
      ]}
      legend={[
        { label: 'Urna de Pólya', color: DATA_COLORS.primary },
        { label: 'Mezcla: p ~ Beta, luego ensayos independientes', color: DATA_COLORS.secondary },
        { label: 'Probabilidad exacta (beta-binomial)', color: DATA_COLORS.text, shape: 'circle' },
      ]}
      description={description}
      dataTable={{
        caption: 'Número de éxitos en las dos construcciones',
        columns: ['k', 'urna', 'mezcla', 'exacta'],
        rows: exact.map((p, k) => [String(k), f(urnShare[k] ?? 0), f(mixtureShare[k] ?? 0), f(p)]),
      }}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <ChartSvg label={description} aspect={0.45} minHeight={240} maxHeight={340}>
        {(box) => {
          const ks = exact.map((_, k) => String(k));
          const x = scaleBand()
            .domain(ks)
            .range([box.inner.left, box.inner.left + box.inner.width])
            .padding(0.2);
          const top = Math.max(0.05, ...exact, ...urnShare, ...mixtureShare) * 1.15;
          const y = scaleLinear()
            .domain([0, top])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const bw = x.bandwidth() / 2;
          const bottom = box.inner.top + box.inner.height;
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={4}
                label="proporción"
              />
              <g aria-hidden="true">
                {exact.map((p, k) => {
                  const x0 = x(String(k)) ?? 0;
                  return (
                    <g key={k}>
                      <rect
                        x={x0}
                        y={y(urnShare[k] ?? 0)}
                        width={bw}
                        height={bottom - y(urnShare[k] ?? 0)}
                        fill={DATA_COLORS.primary}
                        fillOpacity={0.8}
                      />
                      <rect
                        x={x0 + bw}
                        y={y(mixtureShare[k] ?? 0)}
                        width={bw}
                        height={bottom - y(mixtureShare[k] ?? 0)}
                        fill={DATA_COLORS.secondary}
                        fillOpacity={0.8}
                      />
                      <circle cx={x0 + bw} cy={y(p)} r={4.5} fill={DATA_COLORS.text} />
                      <text
                        x={x0 + bw}
                        y={bottom + 16}
                        textAnchor="middle"
                        fontSize={11}
                        fill={DATA_COLORS.text}
                      >
                        {k}
                      </text>
                    </g>
                  );
                })}
                <text
                  x={box.inner.left + box.inner.width / 2}
                  y={bottom + 32}
                  textAnchor="middle"
                  fontSize={12}
                  fill={DATA_COLORS.muted}
                >
                  número de éxitos en {n} extracciones
                </text>
              </g>
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        La urna nunca elige una p, pero su número de éxitos se distribuye igual que si primero se
        sorteara p de una beta y luego se hicieran ensayos independientes con esa p.
      </p>
    </VizFrame>
  );
}
