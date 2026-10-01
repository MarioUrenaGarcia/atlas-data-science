import { scaleLinear, scaleLog } from 'd3-scale';
import { useMemo, useState } from 'react';
import {
  stPetersburgCappedExpectation,
  stPetersburgRound,
} from '../../../lib/probability/puzzles.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './StPetersburg.module.css';
import type { StPetersburgConfig } from './schema.ts';

const FULL_RUN_SECONDS = 60;
const DEFAULT_GAMES = 20000;
const MAX_TOSSES_SHOWN = 16;
const HISTORY_POINTS = 400;

interface Simulation {
  games: number;
  total: number;
  /** Number of games that ended on toss k (index k - 1). */
  byTosses: number[];
  last: { tosses: number; payout: number } | null;
  history: { n: number; mean: number }[];
}

/**
 * The St. Petersburg game: a coin is tossed until the first head, and the
 * game pays 2^(k-1) if that happens on toss k. Every possible k contributes
 * 1/2 to the expectation, so it is infinite, yet the running average of
 * simulated payouts grows only like log2(n)/2. A bank with limited money
 * caps the payout and makes the expectation small and finite.
 */
export default function StPetersburg({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as StPetersburgConfig;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'limiteExponente',
        label: 'Límite del banco: 2 elevado a (0 = sin límite)',
        min: 0,
        max: 40,
        step: 1,
        default: config.limiteExponente ?? 0,
      },
    ],
    [config.limiteExponente],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const exponent = values.limiteExponente ?? 0;
  const cap = exponent > 0 ? 2 ** exponent : Number.POSITIVE_INFINITY;
  const maxGames = config.juegos ?? DEFAULT_GAMES;
  const thinning = Math.max(1, Math.floor(maxGames / HISTORY_POINTS));
  const cappedExpectation = Number.isFinite(cap)
    ? stPetersburgCappedExpectation(cap)
    : Number.POSITIVE_INFINITY;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${exponent}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [sim, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    games: 0,
    total: 0,
    byTosses: [],
    last: null,
    history: [],
  }));
  const play = (count: number) => {
    const generator = random();
    const rounds = Array.from({ length: Math.min(count, maxGames - sim.games) }, () =>
      stPetersburgRound(generator),
    );
    update((previous) => {
      let { games, total, last } = previous;
      const byTosses = [...previous.byTosses];
      const history = [...previous.history];
      for (const round of rounds) {
        const payout = Math.min(round.payout, cap);
        games += 1;
        total += payout;
        byTosses[round.tosses - 1] = (byTosses[round.tosses - 1] ?? 0) + 1;
        last = { tosses: round.tosses, payout };
        if (games <= 100 || games % thinning === 0) history.push({ n: games, mean: total / games });
      }
      return { games, total, byTosses, last, history };
    });
  };
  const playback = usePlayback({
    step: () => play(1),
    stepMany: play,
    reset: () => setRun((value) => value + 1),
    rate: Math.max(5, maxGames / FULL_RUN_SECONDS),
    done: sim.games >= maxGames,
  });

  const mean = sim.games > 0 ? sim.total / sim.games : 0;
  const header = Number.isFinite(cap)
    ? `\\mathbb{E}[\\min(X, 2^{${exponent}})] = \\sum_{k} \\frac{\\min(2^{k-1}, 2^{${exponent}})}{2^{k}} = ${formatNumber(cappedExpectation, 2)}`
    : `\\mathbb{E}[X] = \\sum_{k=1}^{\\infty} \\frac{1}{2^{k}} \\cdot 2^{k-1} = \\tfrac{1}{2} + \\tfrac{1}{2} + \\tfrac{1}{2} + \\cdots = \\infty`;
  const description =
    `Juego de San Petersburgo${Number.isFinite(cap) ? ` con pago máximo 2^${exponent}` : ' sin límite de pago'}. ` +
    `Jugados ${sim.games} juegos; ganancia media ${formatNumber(mean, 2)}` +
    (sim.last
      ? `; último juego: cara en el lanzamiento ${sim.last.tosses}, pago ${formatNumber(sim.last.payout, 0)}.`
      : '.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Juegos', value: String(sim.games) },
        { label: 'Ganancia media', value: formatNumber(mean, 2), color: DATA_COLORS.primary },
        {
          label: 'log2(n) / 2',
          value: sim.games > 0 ? formatNumber(Math.log2(sim.games) / 2, 2) : 'sin datos',
        },
        {
          label: 'Esperanza',
          value: Number.isFinite(cappedExpectation)
            ? formatNumber(cappedExpectation, 2)
            : 'infinita',
        },
        { label: 'Último pago', value: sim.last ? formatNumber(sim.last.payout, 0) : 'sin datos' },
      ]}
      legend={[
        { label: 'Ganancia media acumulada', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Referencia log2(n)/2', color: DATA_COLORS.secondary, shape: 'dashed' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div className={styles.panels}>
        <ChartSvg label={description} aspect={0.75} minHeight={220} maxHeight={320}>
          {(box) => {
            const slot = box.inner.width / MAX_TOSSES_SHOWN;
            const y = scaleLinear()
              .domain([0, 0.5])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            return (
              <>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="aporte a la media"
                />
                <g aria-hidden="true">
                  {Array.from({ length: MAX_TOSSES_SHOWN }, (_, k) => {
                    const count = sim.byTosses[k] ?? 0;
                    const payout = Math.min(2 ** k, cap);
                    const contribution = sim.games > 0 ? (count * payout) / sim.games : 0;
                    const theoretical = payout / 2 ** (k + 1);
                    const x = box.inner.left + k * slot;
                    return (
                      <g key={k}>
                        <rect
                          x={x + slot * 0.15}
                          y={y(Math.min(0.5, contribution))}
                          width={slot * 0.7}
                          height={y(0) - y(Math.min(0.5, contribution))}
                          fill={DATA_COLORS.primary}
                          fillOpacity={0.7}
                        />
                        <line
                          x1={x + slot * 0.1}
                          x2={x + slot * 0.9}
                          y1={y(theoretical)}
                          y2={y(theoretical)}
                          stroke={DATA_COLORS.secondary}
                          strokeWidth={2}
                        />
                        <text
                          x={x + slot / 2}
                          y={y(0) + 14}
                          textAnchor="middle"
                          className={svgStyles.label}
                          style={{ fontSize: 10 }}
                        >
                          {k + 1}
                        </text>
                      </g>
                    );
                  })}
                  <text
                    x={box.inner.left + box.inner.width / 2}
                    y={y(0) + 30}
                    textAnchor="middle"
                    className={svgStyles.label}
                  >
                    lanzamiento de la primera cara
                  </text>
                </g>
              </>
            );
          }}
        </ChartSvg>
        <ChartSvg label={description} aspect={0.75} minHeight={220} maxHeight={320}>
          {(box) => {
            const xMax = Math.max(10, sim.games);
            const x = scaleLog()
              .domain([1, xMax])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const top = Math.max(
              4,
              mean * 1.3,
              Math.log2(xMax) / 2 + 2,
              ...sim.history.map((p) => p.mean),
            );
            const y = scaleLinear()
              .domain([0, top])
              .nice()
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const reference = Array.from({ length: 60 }, (_, i) => {
              const n = xMax ** (i / 59);
              return { x: n, y: Math.log2(n) / 2 };
            });
            return (
              <>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="ganancia media"
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={4}
                  label="juegos (escala logarítmica)"
                  format={(v) => formatNumber(v, 0)}
                />
                <CurvePath
                  points={reference}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.secondary}
                  dashed
                  animate={false}
                />
                {Number.isFinite(cappedExpectation) && cappedExpectation < top && (
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={y(cappedExpectation)}
                    y2={y(cappedExpectation)}
                    stroke={DATA_COLORS.text}
                    strokeDasharray="2 3"
                    aria-hidden="true"
                  />
                )}
                {sim.history.length > 1 && (
                  <CurvePath
                    points={sim.history.map((p) => ({ x: p.n, y: p.mean }))}
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
      </div>
      <p className={styles.caption}>
        A la izquierda, lo que aporta a la media cada número de lanzamientos: en teoría todos
        aportan 1/2 (líneas), pero los juegos largos son tan raros que casi nunca aparecen. A la
        derecha, la media acumulada sube a saltos y sin estabilizarse, cerca de log2(n)/2.
      </p>
    </VizFrame>
  );
}
