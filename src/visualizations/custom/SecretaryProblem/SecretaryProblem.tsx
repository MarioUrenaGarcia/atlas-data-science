import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import {
  secretaryOptimalSkip,
  secretaryRound,
  secretarySuccess,
} from '../../../lib/probability/puzzles.ts';
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
import styles from './SecretaryProblem.module.css';
import type { SecretaryProblemConfig } from './schema.ts';

const CANDIDATES_PER_SECOND = 4;
const ROUNDS_PER_SECOND = 40;
/** The first rounds are shown candidate by candidate; the rest are played whole. */
const DETAILED_ROUNDS = 3;
const DEFAULT_ROUNDS = 1000;

interface Simulation {
  ranks: number[];
  /** Candidates interviewed in the current round. */
  seen: number;
  chosen: number | null;
  rounds: number;
  successes: number;
}

/**
 * The secretary problem: candidates arrive in random order and each must be
 * accepted or rejected on the spot. The rule rejects the first r and then
 * takes the first candidate better than all previous ones. Bars show the
 * candidates of the current round; the curve gives the exact success
 * probability for every r, maximized near n / e.
 */
export default function SecretaryProblem({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as SecretaryProblemConfig;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'candidatos',
        label: 'Candidatos',
        symbol: 'n',
        min: 3,
        max: 100,
        step: 1,
        default: config.candidatos ?? 20,
      },
      {
        type: 'number' as const,
        key: 'descartar',
        label: 'Candidatos que se descartan al inicio',
        symbol: 'r',
        min: 0,
        max: 99,
        step: 1,
        default: config.descartar ?? secretaryOptimalSkip(config.candidatos ?? 20),
      },
    ],
    [config.candidatos, config.descartar],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const n = values.candidatos ?? 20;
  const skip = Math.min(values.descartar ?? 0, n - 1);
  const maxRounds = config.rondas ?? DEFAULT_ROUNDS;
  const exact = secretarySuccess(n, skip);
  const optimal = secretaryOptimalSkip(n);

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${n}|${skip}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [sim, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    ranks: [],
    seen: 0,
    chosen: null,
    rounds: 0,
    successes: 0,
  }));
  const permutation = () => {
    const generator = random();
    const ranks = Array.from({ length: n }, (_, i) => i + 1);
    for (let i = n - 1; i > 0; i -= 1) {
      const j = generator.int(0, i);
      [ranks[i], ranks[j]] = [ranks[j] ?? 0, ranks[i] ?? 0];
    }
    return ranks;
  };
  const detailed = sim.rounds < DETAILED_ROUNDS;
  const advance = (count: number) => {
    if (sim.rounds >= maxRounds) return;
    if (detailed) {
      // Candidate by candidate: start a round, reveal candidates, stop at the choice.
      if (sim.ranks.length === 0 || sim.chosen !== null) {
        const ranks = permutation();
        update((previous) => ({ ...previous, ranks, seen: 0, chosen: null }));
        return;
      }
      update((previous) => {
        const seen = previous.seen + 1;
        const result = secretaryRound(previous.ranks, skip);
        if (seen - 1 === result.chosen) {
          return {
            ...previous,
            seen,
            chosen: result.chosen,
            rounds: previous.rounds + 1,
            successes: previous.successes + (result.best ? 1 : 0),
          };
        }
        return { ...previous, seen };
      });
      return;
    }
    const rounds = Array.from({ length: Math.min(count, maxRounds - sim.rounds) }, permutation);
    update((previous) =>
      rounds.reduce((acc, ranks) => {
        const result = secretaryRound(ranks, skip);
        return {
          ranks,
          seen: n,
          chosen: result.chosen,
          rounds: acc.rounds + 1,
          successes: acc.successes + (result.best ? 1 : 0),
        };
      }, previous),
    );
  };
  const playback = usePlayback({
    step: () => advance(1),
    stepMany: advance,
    reset: () => setRun((value) => value + 1),
    rate: detailed ? CANDIDATES_PER_SECOND : ROUNDS_PER_SECOND,
    done: sim.rounds >= maxRounds,
  });

  const share = sim.rounds > 0 ? sim.successes / sim.rounds : 0;
  const threshold = Math.max(0, ...sim.ranks.slice(0, skip));
  const header =
    skip === 0
      ? `P(\\text{elegir al mejor}) = \\frac{1}{n} = ${formatNumber(exact, 4)}`
      : `P(\\text{elegir al mejor}) = \\frac{r}{n}\\sum_{i=r+1}^{n}\\frac{1}{i-1} = \\frac{${skip}}{${n}}\\left(\\frac{1}{${skip}} + \\cdots + \\frac{1}{${n - 1}}\\right) = ${formatNumber(exact, 4)}`;
  const description =
    `${n} candidatos; se descartan los primeros ${skip} y se elige al primero que supere a todos los anteriores. ` +
    `Probabilidad exacta de elegir al mejor ${formatNumber(exact, 4)}; el máximo se alcanza con r = ${optimal}. ` +
    `Simuladas ${sim.rounds} rondas, ${sim.successes} con éxito (${formatNumber(share, 3)}).`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Rondas', value: String(sim.rounds) },
        { label: 'Eligió al mejor', value: formatNumber(share, 3), color: DATA_COLORS.primary },
        { label: 'P exacta', value: formatNumber(exact, 4), color: DATA_COLORS.secondary },
        { label: 'r óptimo', value: String(optimal) },
        { label: 'n / e', value: formatNumber(n / Math.E, 2) },
      ]}
      legend={[
        { label: 'Descartado sin elegir', color: DATA_COLORS.neutral },
        { label: 'Candidato evaluado', color: DATA_COLORS.primary },
        { label: 'Elegido', color: DATA_COLORS.highlight },
        { label: 'Probabilidad exacta según r', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg label={description} aspect={0.3} minHeight={150} maxHeight={220}>
        {(box) => {
          const slot = box.inner.width / n;
          const y = scaleLinear()
            .domain([0, n])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <g aria-hidden="true">
              {sim.ranks.map((rank, index) => {
                if (index >= sim.seen) return null;
                const chosen = index === sim.chosen;
                const color = chosen
                  ? DATA_COLORS.highlight
                  : index < skip
                    ? DATA_COLORS.neutral
                    : DATA_COLORS.primary;
                return (
                  <rect
                    key={index}
                    x={box.inner.left + index * slot + slot * 0.1}
                    y={y(rank)}
                    width={slot * 0.8}
                    height={y(0) - y(rank)}
                    fill={color}
                    fillOpacity={chosen ? 1 : 0.7}
                    stroke={rank === n ? DATA_COLORS.text : 'none'}
                    strokeWidth={2}
                  />
                );
              })}
              {skip > 0 && sim.seen > skip && (
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(threshold)}
                  y2={y(threshold)}
                  stroke={DATA_COLORS.text}
                  strokeDasharray="4 3"
                />
              )}
              <line
                x1={box.inner.left + skip * slot}
                x2={box.inner.left + skip * slot}
                y1={box.inner.top}
                y2={box.inner.top + box.inner.height}
                stroke={DATA_COLORS.muted}
                strokeWidth={1.5}
              />
            </g>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Cada barra es un candidato en orden de llegada y su altura es su calidad; el mejor tiene
        contorno. La línea vertical separa a los descartados, y la horizontal punteada marca al
        mejor de ellos, que hay que superar.
      </p>
      <ChartSvg label={description} aspect={0.4} minHeight={200} maxHeight={300}>
        {(box) => {
          const x = scaleLinear()
            .domain([0, n - 1])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, 1])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const curve = Array.from({ length: n }, (_, r) => ({ x: r, y: secretarySuccess(n, r) }));
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="P(elegir al mejor)"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="candidatos descartados r"
                format={(v) => formatNumber(v, 0)}
              />
              <CurvePath
                points={curve}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.secondary}
                animate={false}
              />
              <g aria-hidden="true">
                <line
                  x1={x(n / Math.E)}
                  x2={x(n / Math.E)}
                  y1={box.inner.top}
                  y2={box.inner.top + box.inner.height}
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="4 4"
                />
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(1 / Math.E)}
                  y2={y(1 / Math.E)}
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="4 4"
                />
                <circle
                  cx={x(skip)}
                  cy={y(exact)}
                  r={6}
                  fill="none"
                  stroke={DATA_COLORS.secondary}
                  strokeWidth={2}
                />
                {sim.rounds > 0 && (
                  <circle cx={x(skip)} cy={y(share)} r={5} fill={DATA_COLORS.primary} />
                )}
              </g>
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Las líneas punteadas marcan r = n/e y la probabilidad 1/e ≈ 0.368. El punto relleno es la
        proporción simulada con el r elegido.
      </p>
    </VizFrame>
  );
}
