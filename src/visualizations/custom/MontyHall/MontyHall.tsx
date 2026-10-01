import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import {
  montyRound,
  montySwitchProbability,
  type MontyRound,
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
import styles from './MontyHall.module.css';
import type { MontyHallConfig } from './schema.ts';

const PHASES_PER_SECOND = 2;
const ROUNDS_PER_SECOND = 20;
const DEFAULT_ROUNDS = 500;
const DOOR_GAP = 8;
const DETAILED_ROUNDS = 5;

interface Simulation {
  rounds: number;
  /** Rounds kept for the statistics (all of them unless an uninformed host revealed the car). */
  valid: number;
  stayWins: number;
  switchWins: number;
  current: MontyRound | null;
  /** 0: contestant picks, 1: host opens doors, 2: doors revealed. */
  phase: number;
  history: { n: number; stay: number; change: number }[];
}

/**
 * The Monty Hall game played many times. Each round shows the pick, the
 * doors the host opens and the outcome, while the win rates of staying and
 * switching accumulate. With an uninformed host, rounds that reveal the car
 * are discarded and the advantage of switching disappears.
 */
export default function MontyHall({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as MontyHallConfig;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'puertas',
        label: 'Número de puertas',
        min: 3,
        max: 10,
        step: 1,
        default: config.puertas ?? 3,
      },
      {
        type: 'select' as const,
        key: 'presentador',
        label: 'El presentador',
        options: [
          { value: 'sabe', label: 'sabe dónde está el auto' },
          { value: 'ignora', label: 'abre puertas al azar' },
        ],
        default: config.presentador ?? 'sabe',
      },
      {
        type: 'toggle' as const,
        key: 'rapido',
        label: 'Jugar todas las rondas sin pausas',
        default: config.rapido ?? false,
      },
    ],
    [config.puertas, config.presentador, config.rapido],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string | boolean>;
  const doors = Number(values.puertas);
  const hostKnows = values.presentador !== 'ignora';
  const fast = Boolean(values.rapido);
  const maxRounds = config.rondas ?? DEFAULT_ROUNDS;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${doors}|${hostKnows}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [sim, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    rounds: 0,
    valid: 0,
    stayWins: 0,
    switchWins: 0,
    current: null,
    phase: 2,
    history: [],
  }));
  // The first rounds show each phase; later ones are played whole so the rates converge quickly.
  const detailed = !fast && (sim.rounds < DETAILED_ROUNDS || sim.phase < 2);
  const record = (previous: Simulation, round: MontyRound): Simulation => {
    const valid = previous.valid + (round.valid ? 1 : 0);
    const stayWins = previous.stayWins + (round.valid && round.stayWins ? 1 : 0);
    const switchWins = previous.switchWins + (round.valid && round.switchWins ? 1 : 0);
    const history =
      round.valid && valid > 0
        ? [...previous.history, { n: valid, stay: stayWins / valid, change: switchWins / valid }]
        : previous.history;
    return { ...previous, rounds: previous.rounds + 1, valid, stayWins, switchWins, history };
  };
  const play = (count: number) => {
    const generator = random();
    if (detailed) {
      if (sim.phase < 2) {
        update((previous) => {
          const phase = previous.phase + 1;
          const next = { ...previous, phase };
          return phase === 2 && previous.current ? record(next, previous.current) : next;
        });
        return;
      }
      const round = montyRound(generator, doors, hostKnows);
      update((previous) => ({ ...previous, current: round, phase: 0 }));
      return;
    }
    const rounds = Array.from({ length: Math.min(count, maxRounds - sim.rounds) }, () =>
      montyRound(generator, doors, hostKnows),
    );
    update((previous) =>
      rounds.reduce(
        (acc, round) => ({ ...record(acc, round), current: round, phase: 2 }),
        previous,
      ),
    );
  };
  const done = sim.rounds >= maxRounds && sim.phase === 2;
  const playback = usePlayback({
    step: () => play(1),
    stepMany: play,
    reset: () => setRun((value) => value + 1),
    rate: detailed ? PHASES_PER_SECOND : ROUNDS_PER_SECOND,
    done,
  });

  const stayRate = sim.valid > 0 ? sim.stayWins / sim.valid : 0;
  const switchRate = sim.valid > 0 ? sim.switchWins / sim.valid : 0;
  const exactSwitch = hostKnows ? montySwitchProbability(doors) : 0.5;
  const exactStay = hostKnows ? 1 / doors : 0.5;
  const round = sim.current;
  const phase = sim.phase;
  const header = (() => {
    if (!round)
      return `P(\\text{ganar cambiando}) = ${hostKnows ? `\\frac{${doors - 1}}{${doors}}` : '\\frac{1}{2}'}`;
    if (phase === 0)
      return `\\text{El concursante elige la puerta ${round.pick + 1}: } P(\\text{auto ahí}) = \\frac{1}{${doors}}`;
    if (phase === 1)
      return round.valid
        ? `\\text{Se abren ${round.opened.length} puertas con cabra; queda cerrada la ${round.other + 1}}`
        : `\\text{El presentador abrió la puerta del auto: la ronda se descarta}`;
    return `\\text{Quedarse: } \\frac{${sim.stayWins}}{${sim.valid}} = ${formatNumber(stayRate, 3)} \\qquad \\text{Cambiar: } \\frac{${sim.switchWins}}{${sim.valid}} = ${formatNumber(switchRate, 3)}`;
  })();
  const description =
    `${doors} puertas, presentador que ${hostKnows ? 'sabe dónde está el auto' : 'abre al azar'}. ` +
    `${sim.rounds} rondas jugadas, ${sim.valid} válidas. Quedarse ganó ${sim.stayWins} veces (${formatNumber(stayRate, 3)}) y cambiar ${sim.switchWins} veces (${formatNumber(switchRate, 3)}).`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Rondas válidas', value: String(sim.valid) },
        {
          label: 'Gana quedándose',
          value: formatNumber(stayRate, 3),
          color: DATA_COLORS.secondary,
        },
        { label: 'Gana cambiando', value: formatNumber(switchRate, 3), color: DATA_COLORS.primary },
        { label: 'Teórico quedándose', value: formatNumber(exactStay, 3) },
        { label: 'Teórico cambiando', value: formatNumber(exactSwitch, 3) },
        ...(hostKnows
          ? []
          : [{ label: 'Rondas descartadas', value: String(sim.rounds - sim.valid) }]),
      ]}
      legend={[
        { label: 'Cambiar', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Quedarse', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Puerta elegida', color: DATA_COLORS.highlight },
        { label: 'Puerta para cambiar', color: DATA_COLORS.primary },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.22}
        minHeight={110}
        maxHeight={150}
        margins={{ top: 8, right: 8, bottom: 22, left: 8 }}
      >
        {(box) => {
          const width = Math.min(70, (box.inner.width - DOOR_GAP * (doors - 1)) / doors);
          const left =
            box.inner.left + (box.inner.width - width * doors - DOOR_GAP * (doors - 1)) / 2;
          return (
            <g aria-hidden="true">
              {Array.from({ length: doors }, (_, door) => {
                const x = left + door * (width + DOOR_GAP);
                const open =
                  round !== null && ((phase >= 1 && round.opened.includes(door)) || phase >= 2);
                const content = round && open ? (door === round.car ? 'auto' : 'cabra') : '';
                const picked = round?.pick === door;
                const offered = round !== null && phase >= 1 && round.other === door;
                return (
                  <g key={door}>
                    <rect
                      x={x}
                      y={box.inner.top}
                      width={width}
                      height={box.inner.height}
                      rx={4}
                      fill={
                        open
                          ? content === 'auto'
                            ? DATA_COLORS.positive
                            : 'var(--color-surface-2)'
                          : DATA_COLORS.neutral
                      }
                      fillOpacity={open ? 0.6 : 0.35}
                      stroke={
                        picked
                          ? DATA_COLORS.highlight
                          : offered
                            ? DATA_COLORS.primary
                            : 'var(--color-border-strong)'
                      }
                      strokeWidth={picked || offered ? 3 : 1}
                    />
                    <text
                      x={x + width / 2}
                      y={box.inner.top + box.inner.height / 2}
                      dy="0.35em"
                      textAnchor="middle"
                      className={svgStyles.label}
                      style={{ fontWeight: 700 }}
                    >
                      {content}
                    </text>
                    <text
                      x={x + width / 2}
                      y={box.inner.top + box.inner.height + 15}
                      textAnchor="middle"
                      className={svgStyles.label}
                    >
                      {door + 1}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Los recuadros gruesos marcan la puerta elegida y la que queda disponible para cambiar, con
        los colores de la leyenda.
      </p>
      <ChartSvg label={description} aspect={0.4} minHeight={200} maxHeight={300}>
        {(box) => {
          const xMax = Math.max(20, sim.valid);
          const x = scaleLinear()
            .domain([0, xMax])
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
                label="proporción de victorias"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={5}
                label="rondas válidas"
                format={(value) => formatNumber(value, 0)}
              />
              <g aria-hidden="true">
                {[exactStay, exactSwitch].map((value, index) => (
                  <line
                    key={index}
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={y(value)}
                    y2={y(value)}
                    stroke={index === 0 ? DATA_COLORS.secondary : DATA_COLORS.primary}
                    strokeDasharray="6 4"
                  />
                ))}
              </g>
              {sim.history.length > 1 && (
                <>
                  <CurvePath
                    points={sim.history.map((p) => ({ x: p.n, y: p.change }))}
                    xScale={x}
                    yScale={y}
                    color={DATA_COLORS.primary}
                    animate={false}
                  />
                  <CurvePath
                    points={sim.history.map((p) => ({ x: p.n, y: p.stay }))}
                    xScale={x}
                    yScale={y}
                    color={DATA_COLORS.secondary}
                    animate={false}
                  />
                </>
              )}
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
