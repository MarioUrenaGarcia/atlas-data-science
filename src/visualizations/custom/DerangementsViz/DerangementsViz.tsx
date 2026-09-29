import { scaleBand, scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { choose, derangements, factorial, fixedPoints } from '../../../lib/combinatorics/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './DerangementsViz.module.css';
import type { DerangementsVizConfig } from './schema.ts';

const TRIALS_PER_SECOND = 6;
const MAX_TRIALS = 5000;
const TOKEN_RADIUS = 13;

interface Simulation {
  current: number[] | null;
  counts: number[];
  trials: number;
}

/**
 * n guests leave their coats and get them back in random order. Each trial
 * draws a random permutation and records how many guests receive their own
 * coat. The share of trials with no match approaches D_n / n!, which is
 * already close to 1/e for small n.
 */
export default function DerangementsViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as DerangementsVizConfig;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'n',
        label: 'Invitados',
        symbol: 'n',
        min: 2,
        max: 10,
        step: 1,
        default: config.n ?? 6,
      },
    ],
    [config.n],
  );
  const parameters = useParameters(definitions);
  const n = Number((parameters.values as Record<string, number>).n);
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${n}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [simulation, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    current: null,
    counts: Array.from({ length: n + 1 }, () => 0),
    trials: 0,
  }));
  // Draws happen outside the state updater, which React may call twice, so each seed replays exactly.
  const trial = (count: number) => {
    const generator = random();
    const drawn = Array.from({ length: count }, () =>
      generator.shuffle(Array.from({ length: n }, (_, index) => index)),
    );
    update((previous) => {
      const counts = [...previous.counts];
      const accepted = drawn.slice(0, Math.max(0, MAX_TRIALS - previous.trials));
      accepted.forEach((permutation) => {
        const matches = fixedPoints(permutation);
        counts[matches] = (counts[matches] ?? 0) + 1;
      });
      return {
        current: accepted.at(-1) ?? previous.current,
        counts,
        trials: previous.trials + accepted.length,
      };
    });
  };
  const playback = usePlayback({
    step: () => trial(1),
    stepMany: trial,
    reset: () => setRun((value) => value + 1),
    rate: TRIALS_PER_SECOND,
    done: simulation.trials >= MAX_TRIALS,
  });

  const exact = Array.from(
    { length: n + 1 },
    (_, k) => (choose(n, k) * derangements(n - k)) / factorial(n),
  );
  const noMatch = simulation.trials === 0 ? 0 : (simulation.counts[0] ?? 0) / simulation.trials;
  const target = derangements(n) / factorial(n);
  const matches = simulation.current ? fixedPoints(simulation.current) : 0;
  const description =
    `${n} invitados. Ensayos: ${simulation.trials}. Proporción sin ninguna coincidencia: ${formatNumber(noMatch, 3)}; ` +
    `valor exacto D(${n})/${n}! = ${derangements(n)}/${factorial(n)} = ${formatNumber(target, 4)}, cercano a 1/e = ${formatNumber(Math.exp(-1), 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'Ensayos', value: String(simulation.trials) },
        {
          label: 'Coincidencias en el último',
          value: simulation.current ? String(matches) : 'ninguno',
        },
        {
          label: 'Sin coincidencias (simulado)',
          value: formatNumber(noMatch, 4),
          color: DATA_COLORS.primary,
        },
        {
          label: `D(${n})/${n}!`,
          value: `${derangements(n)}/${factorial(n)} = ${formatNumber(target, 4)}`,
          color: DATA_COLORS.secondary,
        },
        { label: '1/e', value: formatNumber(Math.exp(-1), 4) },
      ]}
      legend={[
        { label: 'Frecuencia simulada', color: DATA_COLORS.primary },
        { label: 'Probabilidad exacta', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
      dataTable={{
        caption: 'Proporción de desarreglos',
        columns: ['n', 'D(n)', 'n!', 'D(n)/n!'],
        rows: Array.from({ length: 10 }, (_, index) => {
          const size = index + 1;
          return [
            size,
            derangements(size),
            factorial(size),
            formatNumber(derangements(size) / factorial(size), 5),
          ];
        }),
      }}
    >
      <p className={styles.formula}>
        <Latex
          tex={`D_n = n!\\sum_{k=0}^{n} \\frac{(-1)^k}{k!},\\qquad \\frac{D_{${n}}}{${n}!} = ${formatNumber(target, 4)} \\approx e^{-1}`}
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0}
        minHeight={2 * TOKEN_RADIUS + 60}
        maxHeight={2 * TOKEN_RADIUS + 60}
        margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {(box) => {
          const spacing = box.inner.width / n;
          const top = box.inner.top + TOKEN_RADIUS + 12;
          const bottom = box.inner.top + box.inner.height - TOKEN_RADIUS - 4;
          return (
            <g aria-hidden="true">
              <text
                x={box.inner.left}
                y={box.inner.top + 8}
                className={svgStyles.labelMuted}
                style={{ fontSize: 10 }}
              >
                invitado
              </text>
              <text
                x={box.inner.left}
                y={box.inner.top + box.inner.height}
                className={svgStyles.labelMuted}
                style={{ fontSize: 10 }}
              >
                abrigo
              </text>
              {Array.from({ length: n }, (_, person) => {
                const coat = simulation.current?.[person];
                const x = box.inner.left + (person + 0.5) * spacing;
                const match = coat === person;
                return (
                  <g key={person}>
                    {coat !== undefined && (
                      <line
                        x1={x}
                        y1={top + TOKEN_RADIUS}
                        x2={x}
                        y2={bottom - TOKEN_RADIUS}
                        stroke={match ? DATA_COLORS.secondary : 'var(--color-border-strong)'}
                        strokeWidth={match ? 3 : 1.5}
                      />
                    )}
                    <circle
                      cx={x}
                      cy={top}
                      r={TOKEN_RADIUS}
                      fill={DATA_COLORS.light}
                      fillOpacity={0.35}
                      stroke={DATA_COLORS.primary}
                    />
                    <text
                      x={x}
                      y={top}
                      dy="0.35em"
                      textAnchor="middle"
                      className={svgStyles.label}
                      style={{ fontSize: 11 }}
                    >
                      {person + 1}
                    </text>
                    {coat !== undefined && (
                      <>
                        <rect
                          x={x - TOKEN_RADIUS}
                          y={bottom - TOKEN_RADIUS}
                          width={2 * TOKEN_RADIUS}
                          height={2 * TOKEN_RADIUS}
                          rx={4}
                          fill={match ? DATA_COLORS.secondary : 'var(--color-surface-2)'}
                          fillOpacity={match ? 0.35 : 1}
                          stroke="var(--color-border-strong)"
                        />
                        <text
                          x={x}
                          y={bottom}
                          dy="0.35em"
                          textAnchor="middle"
                          className={svgStyles.label}
                          style={{ fontSize: 11 }}
                        >
                          {coat + 1}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
      <ChartSvg
        label={description}
        aspect={0.4}
        minHeight={210}
        maxHeight={330}
        margins={{ bottom: 42 }}
      >
        {(box) => {
          const band = scaleBand<number>()
            .domain(exact.map((_, k) => k))
            .range([box.inner.left, box.inner.left + box.inner.width])
            .padding(0.2);
          const frequencies = simulation.counts.map((count) =>
            simulation.trials === 0 ? 0 : count / simulation.trials,
          );
          const y = scaleLinear()
            .domain([0, Math.max(0.4, ...exact, ...frequencies)])
            .nice()
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={4}
              />
              <g aria-hidden="true">
                {exact.map((probability, k) => {
                  const left = band(k) ?? 0;
                  const frequency = frequencies[k] ?? 0;
                  return (
                    <g key={k}>
                      <rect
                        x={left}
                        y={y(frequency)}
                        width={band.bandwidth()}
                        height={y(0) - y(frequency)}
                        fill={DATA_COLORS.primary}
                        fillOpacity={0.7}
                      />
                      <line
                        x1={left}
                        x2={left + band.bandwidth()}
                        y1={y(probability)}
                        y2={y(probability)}
                        stroke={DATA_COLORS.secondary}
                        strokeWidth={3}
                      />
                      <text
                        x={left + band.bandwidth() / 2}
                        y={box.inner.top + box.inner.height + 16}
                        textAnchor="middle"
                        className={svgStyles.labelMuted}
                      >
                        {k}
                      </text>
                    </g>
                  );
                })}
              </g>
              <text
                x={box.inner.left + box.inner.width / 2}
                y={box.inner.top + box.inner.height + 32}
                textAnchor="middle"
                className={svgStyles.labelMuted}
              >
                número de invitados que reciben su propio abrigo
              </text>
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
