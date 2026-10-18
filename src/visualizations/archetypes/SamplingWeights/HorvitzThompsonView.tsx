import { scaleLinear } from 'd3-scale';
import { pluralize } from '../../../lib/format/plural.ts';
import { useCallback, useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import {
  horvitzThompsonTotal,
  inclusionProbabilities,
  systematicPpsFrom,
} from '../../../lib/sampling/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { EstimateHistogram } from '../../shared/EstimateHistogram.tsx';
import type { HtConfig } from './schema.ts';
import styles from './SamplingWeights.module.css';

type Design = 'pps' | 'poisson' | 'mas';

const DESIGN_LABELS: Record<Design, string> = {
  pps: 'Sistemático proporcional al tamaño',
  poisson: 'Poisson proporcional al tamaño',
  mas: 'Aleatorio simple',
};

const DEFAULT_REPETITIONS = 500;
const SLOW_SAMPLES = 6;

interface Draw {
  units: number[];
  start: number;
}

interface State {
  draw: Draw;
  totals: number[];
  naive: number[];
}

function drawFor(design: Design, pi: readonly number[], n: number, random: Random): Draw {
  if (design === 'pps') {
    const start = random.next();
    return { units: systematicPpsFrom(pi, start), start };
  }
  if (design === 'poisson') {
    return { units: pi.flatMap((p, i) => (random.next() < p ? [i] : [])), start: Number.NaN };
  }
  const all = pi.map((_, i) => i);
  return { units: random.sample(all, n).sort((a, b) => a - b), start: Number.NaN };
}

/**
 * Units laid end to end with lengths equal to their inclusion probabilities.
 * Each sample expands the selected values by 1/π and the Horvitz-Thompson
 * totals accumulate around the true population total.
 */
export function HorvitzThompsonView({
  config,
  title,
  conceptId,
}: {
  config: HtConfig;
  title: string;
  conceptId: string;
}) {
  const units = config.unidades;
  const N = units.length;
  const offered: Design[] = config.disenos ?? [config.diseno];
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(offered.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'diseno',
              label: 'Diseño',
              options: offered.map((d) => ({ value: d, label: DESIGN_LABELS[d] })),
              default: config.diseno,
            },
          ]
        : []),
      {
        type: 'number',
        key: 'n',
        label: 'Tamaño esperado de muestra',
        symbol: 'n',
        min: 1,
        max: Math.max(2, N - 1),
        step: 1,
        default: config.n,
      },
      {
        type: 'toggle',
        key: 'comparar',
        label: 'Comparar con N por la media muestral',
        default: config.comparar ?? false,
      },
    ],
    // Static frontmatter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string | boolean>;
  const design = (offered.length > 1 ? String(values.diseno) : config.diseno) as Design;
  const n = Number(values.n);
  const compare = Boolean(values.comparar);
  const sizes = units.map((u) => u.tamano);
  const y = units.map((u) => u.valor);
  const pi = useMemo(
    () => (design === 'mas' ? units.map(() => n / N) : inclusionProbabilities(sizes, n)),
    // sizes derive from static frontmatter
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [design, n, N],
  );
  const truth = y.reduce((a, b) => a + b, 0);
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const key = `${design}|${n}|${seed.seed}|${run}`;
  const generatorFor = useCallback(
    (index: number) => new Random((seed.seed * 7919 + index * 104729 + run * 31) >>> 0),
    [seed.seed, run],
  );
  const repetitions = config.repeticiones ?? DEFAULT_REPETITIONS;
  const [state, update] = useResettableState<State>(key, () => ({
    draw: { units: [], start: Number.NaN },
    totals: [],
    naive: [],
  }));
  const stepMany = useCallback(
    (count: number) =>
      update((previous) => {
        let next = previous;
        for (let i = 0; i < count && next.totals.length < repetitions; i += 1) {
          const draw = drawFor(design, pi, n, generatorFor(next.totals.length));
          const total = horvitzThompsonTotal(draw.units, y, pi);
          const mean =
            draw.units.length === 0
              ? 0
              : draw.units.reduce((a, u) => a + (y[u] ?? 0), 0) / draw.units.length;
          next = { draw, totals: [...next.totals, total], naive: [...next.naive, N * mean] };
        }
        return next;
      }),
    // y derives from static frontmatter
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [update, repetitions, design, pi, n, generatorFor, N],
  );
  const playback = usePlayback({
    step: () => stepMany(1),
    stepMany,
    reset: () => setRun((value) => value + 1),
    rate: state.totals.length < SLOW_SAMPLES ? 0.8 : 25,
    done: state.totals.length >= repetitions,
  });

  const selected = state.draw.units;
  const current =
    state.totals.length > 0 ? (state.totals[state.totals.length - 1] ?? 0) : Number.NaN;
  const average =
    state.totals.length > 0
      ? state.totals.reduce((a, b) => a + b, 0) / state.totals.length
      : Number.NaN;
  const naiveAverage =
    state.naive.length > 0
      ? state.naive.reduce((a, b) => a + b, 0) / state.naive.length
      : Number.NaN;
  const sd = (list: number[], m: number) =>
    list.length > 1
      ? Math.sqrt(list.reduce((a, v) => a + (v - m) ** 2, 0) / (list.length - 1))
      : Number.NaN;
  const unit = config.unidad ? ` ${config.unidad}` : '';
  const terms = selected
    .slice(0, 4)
    .map((u) => `\\frac{${formatNumber(y[u] ?? 0, 1)}}{${formatNumber(pi[u] ?? 0, 3)}}`)
    .join(' + ');
  const header =
    selected.length === 0
      ? state.totals.length === 0
        ? `\\pi_i = n\\,\\frac{x_i}{\\sum_k x_k},\\qquad \\hat{T}_{HT} = \\sum_{i \\in \\mathcal{S}} \\frac{y_i}{\\pi_i}`
        : `\\hat{T}_{HT} = 0\\quad\\text{(muestra vacía)}`
      : `\\hat{T}_{HT} = \\sum_{i \\in \\mathcal{S}} \\frac{y_i}{\\pi_i} = ${terms}${selected.length > 4 ? ' + \\dots' : ''} = ${formatNumber(current, 1)}`;
  const domain = useMemo<[number, number]>(() => {
    // A pilot run with its own generator fixes a window that stays stable while estimates accumulate.
    const pilot = new Random(seed.seed + 101);
    const draws: number[] = [truth];
    for (let r = 0; r < 300; r += 1) {
      const draw = drawFor(design, pi, n, pilot);
      draws.push(horvitzThompsonTotal(draw.units, y, pi));
      if (compare && draw.units.length > 0) {
        draws.push((N * draw.units.reduce((a, u) => a + (y[u] ?? 0), 0)) / draw.units.length);
      }
    }
    const lo = Math.min(...draws);
    const hi = Math.max(...draws);
    const pad = (hi - lo) * 0.1 || Math.abs(truth) * 0.1 || 1;
    const [a = lo - pad, b = hi + pad] = scaleLinear()
      .domain([lo - pad, hi + pad])
      .nice()
      .domain();
    return [a, b];
    // y derives from static frontmatter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pi, truth, design, n, compare, seed.seed, N]);
  const description =
    `${DESIGN_LABELS[design]} de ${N} ${pluralize(config.nombreUnidad.toLowerCase())} con tamaño esperado ${n}. Total real ${formatNumber(truth, 1)}. ` +
    (state.totals.length > 0
      ? `Última estimación ${formatNumber(current, 1)}; promedio de ${state.totals.length} estimaciones ${formatNumber(average, 1)}.`
      : 'Aún no se extrae ninguna muestra.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        {
          label: 'Total real',
          value: `${formatNumber(truth, 1)}${unit}`,
          color: DATA_COLORS.primary,
        },
        {
          label: 'Estimación de Horvitz-Thompson actual',
          value: `${formatNumber(current, 1)}${unit}`,
          color: DATA_COLORS.highlight,
        },
        { label: 'Unidades en la muestra', value: String(selected.length) },
        { label: 'Muestras repetidas', value: String(state.totals.length) },
        {
          label: 'Promedio de las estimaciones',
          value: formatNumber(average, 1),
          color: DATA_COLORS.secondary,
        },
        { label: 'Error estándar observado', value: formatNumber(sd(state.totals, average), 1) },
        ...(compare
          ? [
              { label: 'Promedio de N por la media', value: formatNumber(naiveAverage, 1) },
              {
                label: 'Error estándar de N por la media',
                value: formatNumber(sd(state.naive, naiveAverage), 1),
              },
            ]
          : []),
      ]}
      legend={[
        { label: `${config.nombreUnidad} en la muestra`, color: DATA_COLORS.highlight },
        { label: 'Arranque y saltos de una unidad', color: DATA_COLORS.negative, shape: 'line' },
        { label: 'Total real', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Estimaciones de Horvitz-Thompson', color: DATA_COLORS.secondary },
        ...(compare
          ? [{ label: 'N por la media muestral', color: DATA_COLORS.text, shape: 'line' as const }]
          : []),
      ]}
      description={description}
      dataTable={{
        caption: 'Unidades, tamaños y probabilidades de inclusión',
        columns: [
          config.nombreUnidad,
          config.nombreTamano,
          config.variable,
          'π_i',
          'En la muestra',
        ],
        rows: units.map((u, i) => [
          u.nombre ?? `${config.nombreUnidad} ${i + 1}`,
          formatNumber(u.tamano, 1),
          formatNumber(u.valor, 1),
          formatNumber(pi[i] ?? 0, 3),
          selected.includes(i) ? 'sí' : 'no',
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.3}
        minHeight={170}
        maxHeight={230}
        margins={{ top: 26, bottom: 46, left: 16, right: 16 }}
      >
        {(box) => {
          const total = pi.reduce((a, b) => a + b, 0);
          const x = scaleLinear()
            .domain([0, total])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const barY = box.inner.top + 14;
          const barH = 34;
          let cumulative = 0;
          const selectedSet = new Set(selected);
          const marks =
            design === 'pps' && Number.isFinite(state.draw.start)
              ? Array.from(
                  { length: Math.ceil(total - state.draw.start) },
                  (_, k) => state.draw.start + k,
                )
              : [];
          return (
            <g>
              <Axis
                scale={x}
                orientation="bottom"
                position={barY + barH + 6}
                ticks={Math.min(10, Math.ceil(total))}
                label="Probabilidades de inclusión acumuladas"
              />
              {pi.map((p, i) => {
                const left = cumulative;
                cumulative += p;
                const on = selectedSet.has(i);
                const w = Math.max(1, x(left + p) - x(left));
                return (
                  <g key={i}>
                    <rect
                      x={x(left)}
                      y={barY}
                      width={w}
                      height={barH}
                      fill={on ? DATA_COLORS.highlight : seriesColor(i % 2 === 0 ? 0 : 3)}
                      fillOpacity={on ? 0.9 : 0.25}
                      stroke={DATA_COLORS.text}
                      strokeOpacity={0.4}
                    />
                    {w > 22 && (
                      <text
                        x={x(left) + w / 2}
                        y={barY + barH / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={styles.labelMuted}
                      >
                        {units[i]?.nombre ?? i + 1}
                      </text>
                    )}
                  </g>
                );
              })}
              {marks.map((m, k) => (
                <g key={k} aria-hidden="true">
                  <line
                    x1={x(m)}
                    x2={x(m)}
                    y1={barY - 12}
                    y2={barY + barH + 4}
                    stroke={DATA_COLORS.negative}
                    strokeWidth={2}
                  />
                  <text x={x(m)} y={barY - 14} textAnchor="middle" className={styles.labelMuted}>
                    {k === 0 ? `u = ${formatNumber(m, 2)}` : `u + ${k}`}
                  </text>
                </g>
              ))}
            </g>
          );
        }}
      </ChartSvg>
      <EstimateHistogram
        values={state.totals}
        {...(compare ? { compare: state.naive } : {})}
        domain={domain}
        markers={[
          { value: truth, label: 'total real', color: DATA_COLORS.primary },
          ...(state.totals.length > 1
            ? [{ value: average, label: 'promedio', color: DATA_COLORS.secondary, dashed: true }]
            : []),
        ]}
        label={`Estimaciones del total en ${state.totals.length} muestras`}
        axisLabel={`Estimación del total de ${config.variable}${unit ? ` (${config.unidad})` : ''}`}
      />
    </VizFrame>
  );
}
