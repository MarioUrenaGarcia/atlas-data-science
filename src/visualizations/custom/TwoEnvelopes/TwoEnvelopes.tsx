import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
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
import styles from './TwoEnvelopes.module.css';
import type { TwoEnvelopesConfig } from './schema.ts';

const FULL_RUN_SECONDS = 60;
const DEFAULT_GAMES = 5000;
const SHOWN_POINTS = 600;
const HISTORY_POINTS = 300;

interface Game {
  opened: number;
  other: number;
}

interface Simulation {
  games: number;
  keep: number;
  change: number;
  threshold: number;
  points: Game[];
  history: { n: number; keep: number; change: number; threshold: number }[];
}

/**
 * Two envelopes hold x and 2x. The tempting argument says the other one is
 * worth 1.25 times the amount seen, so switching always pays. The simulation
 * plays keep, always switch and a threshold rule side by side: the first two
 * earn the same on average, because with a proper distribution of x the
 * other envelope is not equally likely to hold half or double for every
 * amount; only switching on small amounts gains.
 */
export default function TwoEnvelopes({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as TwoEnvelopesConfig;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'maximo',
        label: 'Máximo de la cantidad menor',
        symbol: 'M',
        min: 10,
        max: 1000,
        step: 10,
        default: config.maximo ?? 100,
      },
      {
        type: 'number' as const,
        key: 'umbral',
        label: 'Umbral: cambiar si el sobre abierto tiene menos de',
        symbol: 't',
        min: 0,
        max: 2000,
        step: 10,
        default: config.umbral ?? 100,
      },
    ],
    [config.maximo, config.umbral],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const maximum = values.maximo ?? 100;
  const threshold = values.umbral ?? 100;
  const maxGames = config.juegos ?? DEFAULT_GAMES;
  const thinning = Math.max(1, Math.floor(maxGames / HISTORY_POINTS));
  // With x uniform on [1, M], keeping or switching both average 1.5 E[x] = 1.5 (1 + M) / 2.
  const expected = (1.5 * (1 + maximum)) / 2;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${maximum}|${threshold}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [sim, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    games: 0,
    keep: 0,
    change: 0,
    threshold: 0,
    points: [],
    history: [],
  }));
  const play = (count: number) => {
    const generator = random();
    const games = Array.from({ length: Math.min(count, maxGames - sim.games) }, (): Game => {
      const x = generator.uniform(1, maximum);
      return generator.bernoulli(0.5) ? { opened: x, other: 2 * x } : { opened: 2 * x, other: x };
    });
    update((previous) => {
      let { games: n, keep, change, threshold: rule } = previous;
      const history = [...previous.history];
      for (const game of games) {
        n += 1;
        keep += game.opened;
        change += game.other;
        rule += game.opened < threshold ? game.other : game.opened;
        if (n <= 50 || n % thinning === 0)
          history.push({ n, keep: keep / n, change: change / n, threshold: rule / n });
      }
      const points = [...previous.points, ...games].slice(-SHOWN_POINTS);
      return { games: n, keep, change, threshold: rule, points, history };
    });
  };
  const playback = usePlayback({
    step: () => play(1),
    stepMany: play,
    reset: () => setRun((value) => value + 1),
    rate: Math.max(5, maxGames / FULL_RUN_SECONDS),
    done: sim.games >= maxGames,
  });

  const mean = (total: number) => (sim.games > 0 ? total / sim.games : 0);
  const last = sim.points.at(-1);
  const header = last
    ? `\\text{Abierto: } ${formatNumber(last.opened, 1)} \\quad \\text{argumento: } \\tfrac{1}{2}\\cdot\\tfrac{${formatNumber(last.opened, 1)}}{2} + \\tfrac{1}{2}\\cdot 2 \\cdot ${formatNumber(last.opened, 1)} = ${formatNumber(1.25 * last.opened, 1)} \\quad \\text{real: } ${formatNumber(last.other, 1)}`
    : `\\text{El argumento ingenuo: } \\mathbb{E}[\\text{otro}] = \\tfrac{1}{2}\\cdot\\tfrac{A}{2} + \\tfrac{1}{2}\\cdot 2A = 1.25\\,A`;
  const description =
    `La cantidad menor es uniforme entre 1 y ${maximum}. Tras ${sim.games} juegos, quedarse promedia ${formatNumber(mean(sim.keep), 2)}, ` +
    `cambiar siempre ${formatNumber(mean(sim.change), 2)} y cambiar solo por debajo de ${threshold} promedia ${formatNumber(mean(sim.threshold), 2)}. ` +
    `Ambas estrategias simples tienen valor esperado ${formatNumber(expected, 2)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Juegos', value: String(sim.games) },
        { label: 'Quedarse', value: formatNumber(mean(sim.keep), 2), color: DATA_COLORS.secondary },
        {
          label: 'Cambiar siempre',
          value: formatNumber(mean(sim.change), 2),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Cambiar bajo el umbral',
          value: formatNumber(mean(sim.threshold), 2),
          color: DATA_COLORS.tertiary,
        },
        { label: 'Esperanza de quedarse o cambiar', value: formatNumber(expected, 2) },
      ]}
      legend={[
        { label: 'Quedarse', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Cambiar siempre', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Cambiar bajo el umbral', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Cambiar gana', color: DATA_COLORS.positive, shape: 'circle' },
        { label: 'Cambiar pierde', color: DATA_COLORS.negative, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div className={styles.panels}>
        <ChartSvg label={description} aspect={0.8} minHeight={220} maxHeight={320}>
          {(box) => {
            const x = scaleLinear()
              .domain([0, 2 * maximum])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const y = scaleLinear()
              .domain([-maximum, 2 * maximum])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            return (
              <>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="ganancia al cambiar"
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={5}
                  label="cantidad en el sobre abierto"
                />
                <g aria-hidden="true">
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={y(0)}
                    y2={y(0)}
                    stroke={DATA_COLORS.text}
                  />
                  <line
                    x1={x(Math.min(threshold, 2 * maximum))}
                    x2={x(Math.min(threshold, 2 * maximum))}
                    y1={box.inner.top}
                    y2={box.inner.top + box.inner.height}
                    stroke={DATA_COLORS.tertiary}
                    strokeDasharray="4 3"
                  />
                  {sim.points.map((game, index) => {
                    const gain = game.other - game.opened;
                    return (
                      <circle
                        key={index}
                        cx={x(game.opened)}
                        cy={y(gain)}
                        r={2}
                        fill={gain > 0 ? DATA_COLORS.positive : DATA_COLORS.negative}
                        fillOpacity={0.6}
                      />
                    );
                  })}
                </g>
              </>
            );
          }}
        </ChartSvg>
        <ChartSvg label={description} aspect={0.8} minHeight={220} maxHeight={320}>
          {(box) => {
            const xMax = Math.max(50, sim.games);
            const x = scaleLinear()
              .domain([0, xMax])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const y = scaleLinear()
              .domain([0, expected * 2])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const series = [
              { key: 'keep' as const, color: DATA_COLORS.secondary },
              { key: 'change' as const, color: DATA_COLORS.primary },
              { key: 'threshold' as const, color: DATA_COLORS.tertiary },
            ];
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
                  ticks={5}
                  label="juegos"
                  format={(v) => formatNumber(v, 0)}
                />
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(expected)}
                  y2={y(expected)}
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="6 4"
                  aria-hidden="true"
                />
                {sim.history.length > 1 &&
                  series.map((s) => (
                    <CurvePath
                      key={s.key}
                      points={sim.history.map((p) => ({ x: p.n, y: p[s.key] }))}
                      xScale={x}
                      yScale={y}
                      color={s.color}
                      animate={false}
                    />
                  ))}
              </>
            );
          }}
        </ChartSvg>
      </div>
      <p className={styles.caption}>
        A la izquierda, cada punto es un juego: cambiar gana con cantidades pequeñas y pierde con
        las grandes (por encima de M solo puede perder). La línea vertical es el umbral. A la
        derecha, las ganancias medias de las tres estrategias.
      </p>
    </VizFrame>
  );
}
