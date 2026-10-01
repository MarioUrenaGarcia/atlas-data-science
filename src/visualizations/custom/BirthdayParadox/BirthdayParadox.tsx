import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { birthdayProbability, birthdayThreshold } from '../../../lib/probability/puzzles.ts';
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
import styles from './BirthdayParadox.module.css';
import type { BirthdayParadoxConfig } from './schema.ts';

const GROUPS_PER_SECOND = 3;
/** Long simulations speed up so a full run at 1x takes about this long. */
const FULL_RUN_SECONDS = 60;
const DEFAULT_GROUPS = 300;
const CALENDAR_COLUMNS = 31;
const CURVE_MAX = 80;

interface Simulation {
  groups: number;
  withMatch: number;
  /** Day of each person in the last group. */
  days: number[];
}

/**
 * Random groups of people with birthdays drawn uniformly from the calendar.
 * Each group is drawn on a grid of days, shared days are highlighted, and the
 * share of groups with at least one match is compared with the exact curve
 * 1 - (365)(364)...(365 - n + 1) / 365^n.
 */
export default function BirthdayParadox({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as BirthdayParadoxConfig;
  const days = config.dias ?? 365;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'personas',
        label: 'Personas en el grupo',
        symbol: 'n',
        min: 2,
        max: 100,
        step: 1,
        default: config.personas ?? 23,
      },
    ],
    [config.personas],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const n = values.personas ?? 23;
  const maxGroups = config.grupos ?? DEFAULT_GROUPS;
  const exact = birthdayProbability(n, days);
  const target = config.objetivo ?? 0.5;
  const threshold = birthdayThreshold(target, days);

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${n}|${days}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [sim, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    groups: 0,
    withMatch: 0,
    days: [],
  }));
  const simulate = (count: number) => {
    const generator = random();
    const groups = Array.from({ length: Math.min(count, maxGroups - sim.groups) }, () =>
      Array.from({ length: n }, () => generator.int(0, days - 1)),
    );
    update((previous) =>
      groups.reduce(
        (acc, group) => ({
          groups: acc.groups + 1,
          withMatch: acc.withMatch + (new Set(group).size < group.length ? 1 : 0),
          days: group,
        }),
        previous,
      ),
    );
  };
  const playback = usePlayback({
    step: () => simulate(1),
    stepMany: simulate,
    reset: () => setRun((value) => value + 1),
    rate: Math.max(GROUPS_PER_SECOND, maxGroups / FULL_RUN_SECONDS),
    done: sim.groups >= maxGroups,
  });

  const counts = new Map<number, number>();
  sim.days.forEach((day) => counts.set(day, (counts.get(day) ?? 0) + 1));
  const shared = [...counts.values()].filter((count) => count > 1).length;
  const share = sim.groups > 0 ? sim.withMatch / sim.groups : 0;
  const pairs = (n * (n - 1)) / 2;
  const header = `P(\\text{alguna coincidencia}) = 1 - \\frac{${days} \\cdot ${days - 1} \\cdots ${days - n + 1}}{${days}^{${n}}} = ${formatNumber(exact, 4)}`;
  const description =
    `Grupos de ${n} personas con ${days} días posibles. Probabilidad exacta de al menos un cumpleaños compartido: ${formatNumber(exact, 4)}. ` +
    `Simulados ${sim.groups} grupos, ${sim.withMatch} con coincidencia (${formatNumber(share, 3)}). ` +
    `En el último grupo hay ${shared} días compartidos.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'P exacta', value: formatNumber(exact, 4), color: DATA_COLORS.secondary },
        { label: 'Grupos simulados', value: String(sim.groups) },
        { label: 'Con coincidencia', value: formatNumber(share, 3), color: DATA_COLORS.primary },
        { label: 'Parejas en el grupo', value: formatNumber(pairs, 0) },
        { label: `Mínimo para ${formatNumber(target * 100, 0)} %`, value: `${threshold} personas` },
      ]}
      legend={[
        { label: 'Día con un cumpleaños', color: DATA_COLORS.primary },
        { label: 'Día compartido', color: DATA_COLORS.highlight },
        { label: 'Curva exacta', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.4}
        minHeight={140}
        maxHeight={240}
        margins={{ top: 4, right: 4, bottom: 4, left: 4 }}
      >
        {(box) => {
          const rows = Math.ceil(days / CALENDAR_COLUMNS);
          const size = Math.min(box.inner.width / CALENDAR_COLUMNS, box.inner.height / rows);
          const left = box.inner.left + (box.inner.width - size * CALENDAR_COLUMNS) / 2;
          return (
            <g aria-hidden="true">
              {Array.from({ length: days }, (_, day) => {
                const count = counts.get(day) ?? 0;
                return (
                  <rect
                    key={day}
                    x={left + (day % CALENDAR_COLUMNS) * size + 0.5}
                    y={box.inner.top + Math.floor(day / CALENDAR_COLUMNS) * size + 0.5}
                    width={size - 1}
                    height={size - 1}
                    rx={2}
                    fill={
                      count > 1
                        ? DATA_COLORS.highlight
                        : count === 1
                          ? DATA_COLORS.primary
                          : 'var(--color-surface-2)'
                    }
                    fillOpacity={count > 0 ? 0.85 : 1}
                  />
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Cada casilla es un día del año; el último grupo simulado ocupa las casillas en color.
      </p>
      <ChartSvg label={description} aspect={0.42} minHeight={200} maxHeight={300}>
        {(box) => {
          const x = scaleLinear()
            .domain([0, CURVE_MAX])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, 1])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const curve = Array.from({ length: CURVE_MAX }, (_, k) => ({
            x: k + 1,
            y: birthdayProbability(k + 1, days),
          }));
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="P(coincidencia)"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={8}
                label="personas en el grupo"
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
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(target)}
                  y2={y(target)}
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="4 4"
                />
                <line
                  x1={x(threshold)}
                  x2={x(threshold)}
                  y1={y(0)}
                  y2={y(target)}
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="4 4"
                />
                {n <= CURVE_MAX && (
                  <>
                    <circle
                      cx={x(n)}
                      cy={y(exact)}
                      r={6}
                      fill="none"
                      stroke={DATA_COLORS.secondary}
                      strokeWidth={2}
                    />
                    {sim.groups > 0 && (
                      <circle cx={x(n)} cy={y(share)} r={5} fill={DATA_COLORS.primary} />
                    )}
                  </>
                )}
              </g>
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        El punto relleno es la proporción simulada para el tamaño elegido; el círculo vacío, el
        valor exacto. Las líneas punteadas marcan el tamaño mínimo que alcanza la probabilidad
        objetivo.
      </p>
    </VizFrame>
  );
}
