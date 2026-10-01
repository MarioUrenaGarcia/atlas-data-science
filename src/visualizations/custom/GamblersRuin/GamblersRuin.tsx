import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { ruinExpectedDuration, ruinWinProbability } from '../../../lib/probability/puzzles.ts';
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
import type { VisualizationProps } from '../../types.ts';
import styles from './GamblersRuin.module.css';
import type { GamblersRuinConfig } from './schema.ts';

const BETS_PER_SECOND = 40;
const DEFAULT_GAMES = 200;
const SHOWN_PATHS = 30;
/** A game is cut after this many bets so a nearly fair game with a far target cannot stall the page. */
const MAX_BETS = 20000;

interface Simulation {
  /** Finished games, most recent last, with their path. */
  paths: { values: number[]; won: boolean }[];
  current: number[];
  wins: number;
  games: number;
  totalBets: number;
}

/**
 * A gambler bets one unit at a time until reaching the target or losing
 * everything. The current game is drawn bet by bet; finished games stay as
 * faded paths that end at one of the two absorbing barriers, and the share
 * of wins is compared with the exact probability.
 */
export default function GamblersRuin({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as GamblersRuinConfig;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'inicial',
        label: 'Capital inicial',
        symbol: 'k',
        min: 1,
        max: 49,
        step: 1,
        default: config.inicial ?? 5,
      },
      {
        type: 'number' as const,
        key: 'meta',
        label: 'Meta',
        symbol: 'N',
        min: 2,
        max: 50,
        step: 1,
        default: config.meta ?? 10,
      },
      {
        type: 'number' as const,
        key: 'p',
        label: 'Probabilidad de ganar cada apuesta',
        symbol: 'p',
        min: 0.3,
        max: 0.7,
        step: 0.01,
        digits: 2,
        default: config.p ?? 0.5,
      },
    ],
    [config.inicial, config.meta, config.p],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const target = values.meta ?? 10;
  const start = Math.min(values.inicial ?? 5, target - 1);
  const p = values.p ?? 0.5;
  const maxGames = config.partidas ?? DEFAULT_GAMES;
  const exactWin = ruinWinProbability(start, target, p);
  const exactDuration = ruinExpectedDuration(start, target, p);

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${start}|${target}|${p}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [sim, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    paths: [],
    current: [start],
    wins: 0,
    games: 0,
    totalBets: 0,
  }));
  const bet = (count: number) => {
    const generator = random();
    const steps = Array.from({ length: count }, () => generator.bernoulli(p));
    update((previous) => {
      let { paths, current, wins, games, totalBets } = previous;
      current = [...current];
      for (const won of steps) {
        if (games >= maxGames) break;
        const last = current.at(-1) ?? start;
        const next = last + (won ? 1 : -1);
        current.push(next);
        if (next <= 0 || next >= target || current.length > MAX_BETS) {
          games += 1;
          totalBets += current.length - 1;
          if (next >= target) wins += 1;
          paths = [...paths, { values: current, won: next >= target }].slice(-SHOWN_PATHS);
          current = [start];
        }
      }
      return { paths, current, wins, games, totalBets };
    });
  };
  const playback = usePlayback({
    step: () => bet(1),
    stepMany: bet,
    reset: () => setRun((value) => value + 1),
    rate: BETS_PER_SECOND,
    done: sim.games >= maxGames,
  });

  const share = sim.games > 0 ? sim.wins / sim.games : 0;
  const meanDuration = sim.games > 0 ? sim.totalBets / sim.games : 0;
  const q = 1 - p;
  const header =
    Math.abs(p - 0.5) < 1e-9
      ? `P(\\text{llegar a } ${target}) = \\frac{k}{N} = \\frac{${start}}{${target}} = ${formatNumber(exactWin, 4)}`
      : `P(\\text{llegar a } ${target}) = \\frac{1 - (q/p)^{k}}{1 - (q/p)^{N}} = \\frac{1 - (${formatNumber(q / p, 3)})^{${start}}}{1 - (${formatNumber(q / p, 3)})^{${target}}} = ${formatNumber(exactWin, 4)}`;
  const description =
    `Capital inicial ${start}, meta ${target}, probabilidad de ganar cada apuesta ${formatNumber(p, 2)}. ` +
    `Probabilidad exacta de llegar a la meta ${formatNumber(exactWin, 4)}; duración esperada ${formatNumber(exactDuration, 1)} apuestas. ` +
    `Simuladas ${sim.games} partidas: ${sim.wins} ganadas (${formatNumber(share, 3)}), duración media ${formatNumber(meanDuration, 1)}.`;
  const longest = Math.max(20, sim.current.length, ...sim.paths.map((path) => path.values.length));

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Partidas terminadas', value: String(sim.games) },
        { label: 'Llegan a la meta', value: formatNumber(share, 3), color: DATA_COLORS.positive },
        { label: 'P exacta de llegar a la meta', value: formatNumber(exactWin, 4) },
        { label: 'Duración media simulada', value: formatNumber(meanDuration, 1) },
        { label: 'Duración esperada', value: formatNumber(exactDuration, 1) },
      ]}
      legend={[
        { label: 'Partida en curso', color: DATA_COLORS.text, shape: 'line' },
        { label: 'Terminó en la meta', color: DATA_COLORS.positive, shape: 'line' },
        { label: 'Terminó en la ruina', color: DATA_COLORS.negative, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg label={description} aspect={0.5} minHeight={240} maxHeight={360}>
        {(box) => {
          const x = scaleLinear()
            .domain([0, longest])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, target])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={Math.min(10, target)}
                label="capital"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="número de apuestas"
                format={(v) => formatNumber(v, 0)}
              />
              <g aria-hidden="true">
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(target)}
                  y2={y(target)}
                  stroke={DATA_COLORS.positive}
                  strokeWidth={3}
                />
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(0)}
                  y2={y(0)}
                  stroke={DATA_COLORS.negative}
                  strokeWidth={3}
                />
              </g>
              {sim.paths.map((path, index) => (
                <g key={index} opacity={0.35}>
                  <CurvePath
                    points={path.values.map((value, t) => ({ x: t, y: value }))}
                    xScale={x}
                    yScale={y}
                    color={path.won ? DATA_COLORS.positive : DATA_COLORS.negative}
                    width={1.2}
                    step
                    animate={false}
                  />
                </g>
              ))}
              <CurvePath
                points={sim.current.map((value, t) => ({ x: t, y: value }))}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.text}
                width={2.5}
                step
                animate={false}
              />
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Cada apuesta sube o baja el capital en una unidad. Las líneas horizontales gruesas son la
        meta y la ruina, donde el juego termina.
      </p>
    </VizFrame>
  );
}
