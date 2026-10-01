import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './GamblersFallacy.module.css';
import type { GamblersFallacyConfig } from './schema.ts';

const TOSSES_PER_SECOND = 10;
const FULL_RUN_SECONDS = 60;
const DEFAULT_TOSSES = 20000;
const MAX_STREAK = 8;
const SHOWN_TOSSES = 60;

interface Simulation {
  tosses: number;
  /** Most recent tosses, true for heads. */
  recent: boolean[];
  /** Current run of heads at the end of the sequence. */
  streak: number;
  /** For each k, how many times k heads in a row were followed by another toss, and how many of those were heads. */
  after: number[];
  continued: number[];
}

/**
 * A long sequence of independent coin tosses. After every run of k heads
 * the next toss is recorded; the share of heads after such runs stays at p
 * for every k, so a streak gives no reason to expect the opposite result.
 */
export default function GamblersFallacy({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as GamblersFallacyConfig;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'p',
        label: 'Probabilidad de cara',
        symbol: 'p',
        min: 0.1,
        max: 0.9,
        step: 0.05,
        digits: 2,
        default: config.p ?? 0.5,
      },
      {
        type: 'number' as const,
        key: 'racha',
        label: 'Longitud de la racha',
        symbol: 'k',
        min: 1,
        max: MAX_STREAK,
        step: 1,
        default: config.racha ?? 5,
      },
    ],
    [config.p, config.racha],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const p = values.p ?? 0.5;
  const k = values.racha ?? 5;
  const maxTosses = config.lanzamientos ?? DEFAULT_TOSSES;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${p}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [sim, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    tosses: 0,
    recent: [],
    streak: 0,
    after: Array<number>(MAX_STREAK).fill(0),
    continued: Array<number>(MAX_STREAK).fill(0),
  }));
  const toss = (count: number) => {
    const generator = random();
    const results = Array.from({ length: Math.min(count, maxTosses - sim.tosses) }, () =>
      generator.bernoulli(p),
    );
    update((previous) => {
      let { tosses, streak } = previous;
      const after = [...previous.after];
      const continued = [...previous.continued];
      for (const heads of results) {
        // Every run of length j >= 1 that ends just before this toss is a "streak of j" to score.
        for (let j = 1; j <= Math.min(streak, MAX_STREAK); j += 1) {
          after[j - 1] = (after[j - 1] ?? 0) + 1;
          if (heads) continued[j - 1] = (continued[j - 1] ?? 0) + 1;
        }
        streak = heads ? streak + 1 : 0;
        tosses += 1;
      }
      const recent = [...previous.recent, ...results].slice(-SHOWN_TOSSES);
      return { tosses, recent, streak, after, continued };
    });
  };
  const playback = usePlayback({
    step: () => toss(1),
    stepMany: toss,
    reset: () => setRun((value) => value + 1),
    rate: Math.max(TOSSES_PER_SECOND, maxTosses / FULL_RUN_SECONDS),
    done: sim.tosses >= maxTosses,
  });

  const rate = (j: number) => {
    const n = sim.after[j - 1] ?? 0;
    return n > 0 ? (sim.continued[j - 1] ?? 0) / n : 0;
  };
  const nk = sim.after[k - 1] ?? 0;
  const ck = sim.continued[k - 1] ?? 0;
  const header =
    nk > 0
      ? `P(\\text{cara} \\mid ${k} \\text{ caras seguidas}) \\approx \\frac{${ck}}{${nk}} = ${formatNumber(ck / nk, 3)} \\qquad p = ${formatNumber(p, 2)}`
      : `P(\\text{cara} \\mid ${k} \\text{ caras seguidas}) = P(\\text{cara}) = ${formatNumber(p, 2)}`;
  const description =
    `${sim.tosses} lanzamientos con probabilidad de cara ${formatNumber(p, 2)}. ` +
    Array.from(
      { length: MAX_STREAK },
      (_, i) =>
        `Tras ${i + 1} caras seguidas: ${sim.continued[i] ?? 0} caras de ${sim.after[i] ?? 0}`,
    ).join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Lanzamientos', value: String(sim.tosses) },
        { label: `Rachas de ${k} caras observadas`, value: String(nk) },
        {
          label: `Cara después de ${k} caras`,
          value: nk > 0 ? formatNumber(ck / nk, 3) : 'sin datos',
          color: DATA_COLORS.primary,
        },
        { label: 'Probabilidad de cara', value: formatNumber(p, 2), color: DATA_COLORS.secondary },
      ]}
      legend={[
        { label: 'Cara', color: DATA_COLORS.primary },
        { label: 'Cruz', color: DATA_COLORS.neutral },
        { label: 'p', color: DATA_COLORS.secondary, shape: 'dashed' },
      ]}
      description={description}
      dataTable={{
        caption: 'Lanzamiento siguiente a cada racha de caras',
        columns: ['Racha k', 'Veces observada', 'Siguiente fue cara', 'Proporción'],
        rows: Array.from({ length: MAX_STREAK }, (_, i) => [
          i + 1,
          sim.after[i] ?? 0,
          sim.continued[i] ?? 0,
          formatNumber(rate(i + 1), 3),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0}
        minHeight={44}
        maxHeight={44}
        margins={{ top: 6, right: 4, bottom: 6, left: 4 }}
      >
        {(box) => {
          const size = box.inner.width / SHOWN_TOSSES;
          return (
            <g aria-hidden="true">
              {sim.recent.map((heads, index) => {
                // Highlight the tail of the sequence when it is a run of at least k heads.
                const fromEnd = sim.recent.length - 1 - index;
                const inStreak = heads && fromEnd < sim.streak && sim.streak >= k;
                return (
                  <g key={index}>
                    <rect
                      x={box.inner.left + index * size + 0.5}
                      y={box.inner.top}
                      width={size - 1}
                      height={box.inner.height}
                      rx={2}
                      fill={heads ? DATA_COLORS.primary : DATA_COLORS.neutral}
                      fillOpacity={heads ? 0.75 : 0.35}
                      stroke={inStreak ? DATA_COLORS.text : 'none'}
                      strokeWidth={1.5}
                    />
                    {size > 9 && (
                      <text
                        x={box.inner.left + (index + 0.5) * size}
                        y={box.inner.top + box.inner.height / 2}
                        dy="0.35em"
                        textAnchor="middle"
                        className={svgStyles.label}
                        style={{ fontSize: 9 }}
                      >
                        {heads ? 'C' : 'X'}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Últimos {SHOWN_TOSSES} lanzamientos (C: cara, X: cruz). Una racha final de al menos {k}{' '}
        caras aparece con contorno.
      </p>
      <ChartSvg label={description} aspect={0.4} minHeight={200} maxHeight={300}>
        {(box) => {
          const slot = box.inner.width / MAX_STREAK;
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
                label="proporción de caras"
              />
              <g aria-hidden="true">
                {Array.from({ length: MAX_STREAK }, (_, i) => {
                  const value = rate(i + 1);
                  const count = sim.after[i] ?? 0;
                  const x = box.inner.left + i * slot + slot * 0.2;
                  return (
                    <g key={i} opacity={i + 1 === k ? 1 : 0.6}>
                      {count > 0 && (
                        <rect
                          x={x}
                          y={y(value)}
                          width={slot * 0.6}
                          height={y(0) - y(value)}
                          fill={DATA_COLORS.primary}
                          fillOpacity={0.75}
                        />
                      )}
                      <text
                        x={x + slot * 0.3}
                        y={y(0) + 14}
                        textAnchor="middle"
                        className={svgStyles.label}
                      >
                        {i + 1}
                      </text>
                      <text
                        x={x + slot * 0.3}
                        y={y(0) + 27}
                        textAnchor="middle"
                        className={svgStyles.label}
                        style={{ fontSize: 10 }}
                      >
                        n={count}
                      </text>
                    </g>
                  );
                })}
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(p)}
                  y2={y(p)}
                  stroke={DATA_COLORS.secondary}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />
              </g>
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Cada barra es la proporción de caras en el lanzamiento que sigue a una racha de k caras (k
        en el eje horizontal, con el número de rachas observadas debajo).
      </p>
    </VizFrame>
  );
}
