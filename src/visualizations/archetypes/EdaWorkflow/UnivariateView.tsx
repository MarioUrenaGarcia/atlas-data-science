import { scaleBand, scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { tukeyFences } from '../../../lib/stats/eda.ts';
import { mean, median, skewness, standardDeviation } from '../../../lib/stats/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './EdaWorkflow.module.css';
import {
  HOMES,
  type NumericVariable,
  numeric,
  present,
  type Variable,
  VARIABLE_NAMES,
  ZONES,
} from './homes.ts';
import { HistogramPanel } from './marks.tsx';
import { VARIABLES } from './schema.ts';

const BATCHES = 20;
const BATCHES_PER_SECOND = 6;
const BINS = 22;
const BOX_ROW = 40;

interface UnivariateViewProps {
  title: string;
  variable: Variable;
  log: boolean;
}

/**
 * One variable at a time: its distribution (histogram or bars), a box plot
 * aligned on the same axis and the summaries that describe center, spread,
 * shape, completeness and unusual values, all filling in as rows arrive.
 */
export function UnivariateView({ title, variable: v0, log: log0 }: UnivariateViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select',
        key: 'variable',
        label: 'Variable',
        options: VARIABLES.map((value) => ({ value, label: VARIABLE_NAMES[value] })),
        default: v0,
      },
      {
        type: 'toggle',
        key: 'log',
        label: 'Escala logarítmica',
        default: log0,
        shownWhen: { key: 'variable', values: ['precio', 'superficie'] },
      },
    ],
    [v0, log0],
  );
  const parameters = useParameters(definitions);
  const variable = String(parameters.values.variable) as Variable;
  const log =
    Boolean(parameters.values.log) && (variable === 'precio' || variable === 'superficie');
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, setShown] = useResettableState<number>(`${variable}|${run}`, () =>
    reducedMotion ? BATCHES : 1,
  );
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(BATCHES, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: BATCHES_PER_SECOND,
    done: shown >= BATCHES,
  });
  const rows = HOMES.slice(0, Math.round((HOMES.length * shown) / BATCHES));
  const f = (x: number) => formatNumber(x, 2);

  if (variable === 'zona') {
    const counts = ZONES.map((z) => rows.filter((h) => h.zona === z).length);
    const total = rows.length;
    const modeIndex = counts.indexOf(Math.max(...counts));
    const header = ZONES.map(
      (z, i) =>
        `\\text{${z}}: ${formatNumber((100 * (counts[i] ?? 0)) / Math.max(1, total), 1)}\\,\\%`,
    ).join(',\\ ');
    const description =
      `Zona de ${total} viviendas: ` +
      ZONES.map((z, i) => `${z} ${counts[i]}`).join(', ') +
      `. Moda ${ZONES[modeIndex]}.`;
    return (
      <VizFrame
        title={title}
        playback={playback}
        parameters={parameters}
        readouts={[
          { label: 'Viviendas', value: String(total) },
          { label: 'Moda', value: ZONES[modeIndex] ?? '' },
          ...ZONES.map((z, i) => ({ label: z, value: String(counts[i]), color: seriesColor(i) })),
        ]}
        description={description}
      >
        <FormulaLine tex={header} />
        <ChartSvg
          label={description}
          aspect={0.5}
          minHeight={240}
          maxHeight={360}
          margins={{ top: 14, right: 20, bottom: 40, left: 56 }}
        >
          {(box) => {
            const x = scaleBand<string>()
              .domain([...ZONES])
              .range([box.inner.left, box.inner.left + box.inner.width])
              .padding(0.35);
            const y = scaleLinear()
              .domain([0, HOMES.length * 0.5])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            return (
              <g>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="Viviendas"
                />
                {ZONES.map((z, i) => (
                  <g key={z}>
                    <rect
                      x={x(z)}
                      y={y(counts[i] ?? 0)}
                      width={x.bandwidth()}
                      height={y(0) - y(counts[i] ?? 0)}
                      fill={seriesColor(i)}
                      aria-hidden="true"
                    />
                    <text
                      x={(x(z) ?? 0) + x.bandwidth() / 2}
                      y={box.inner.top + box.inner.height + 18}
                      textAnchor="middle"
                      className={styles.chartLabel}
                    >
                      {z}
                    </text>
                  </g>
                ))}
              </g>
            );
          }}
        </ChartSvg>
      </VizFrame>
    );
  }

  const all = present(numeric(variable as NumericVariable));
  const raw = numeric(variable as NumericVariable, rows);
  const values = present(raw);
  const shownValues = log ? values.map(Math.log) : values;
  const allShown = log ? all.map(Math.log) : all;
  const missing = raw.length - values.length;
  const lo = Math.min(...allShown);
  const hi = Math.max(...allShown);
  const pad = (hi - lo) * 0.04 || 1;
  const domain: [number, number] = [lo - pad, hi + pad];
  const sh = shownValues.length > 3 ? tukeyFences(shownValues) : null;
  const outliers = sh ? shownValues.filter((x) => x < sh.lower || x > sh.upper).length : 0;
  const header =
    values.length > 2
      ? `n = ${values.length},\\ \\bar{x} = ${f(mean(values))},\\ \\tilde{x} = ${f(median(values))},\\ s = ${f(standardDeviation(values))},\\ g_1 = ${f(skewness(values))}`
      : `n = ${values.length}`;
  const description =
    `${VARIABLE_NAMES[variable]} en ${raw.length} viviendas${log ? ', en escala logarítmica' : ''}: ${missing} faltantes` +
    (values.length > 2
      ? `, media ${f(mean(values))}, mediana ${f(median(values))}, desviación ${f(standardDeviation(values))}, asimetría ${f(skewness(values))}, ${outliers} fuera de las vallas de Tukey.`
      : '.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Observados', value: `${values.length} de ${raw.length}` },
        { label: 'Faltantes', value: String(missing), color: DATA_COLORS.secondary },
        {
          label: 'Mínimo y máximo',
          value: values.length
            ? `${f(Math.min(...values))}; ${f(Math.max(...values))}`
            : 'sin datos',
        },
        {
          label: 'Media y mediana',
          value: values.length ? `${f(mean(values))}; ${f(median(values))}` : 'sin datos',
        },
        { label: 'Asimetría', value: values.length > 2 ? f(skewness(values)) : 'sin datos' },
        {
          label: 'Fuera de las vallas de Tukey',
          value: String(outliers),
          color: DATA_COLORS.highlight,
        },
      ]}
      legend={[
        { label: 'Frecuencia', color: DATA_COLORS.primary },
        { label: 'Fuera de las vallas', color: DATA_COLORS.highlight, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.62}
        minHeight={280}
        maxHeight={440}
        margins={{ top: 10, right: 20, bottom: 46, left: 56 }}
      >
        {(box) => {
          const histBox = {
            ...box,
            inner: {
              ...box.inner,
              top: box.inner.top + BOX_ROW,
              height: box.inner.height - BOX_ROW,
            },
          };
          const x = scaleLinear()
            .domain(domain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const cy = box.inner.top + BOX_ROW / 2 - 4;
          return (
            <g>
              <HistogramPanel
                box={histBox}
                values={shownValues}
                domain={domain}
                bins={BINS}
                label={`${VARIABLE_NAMES[variable]}${log ? ' (logaritmo)' : ''}`}
              />
              {sh && (
                <g aria-hidden="true">
                  <line
                    x1={x(
                      Math.max(domain[0], Math.min(...shownValues.filter((v) => v >= sh.lower))),
                    )}
                    x2={x(
                      Math.min(domain[1], Math.max(...shownValues.filter((v) => v <= sh.upper))),
                    )}
                    y1={cy}
                    y2={cy}
                    stroke={DATA_COLORS.text}
                  />
                  <rect
                    x={x(sh.q1)}
                    y={cy - 10}
                    width={x(sh.q3) - x(sh.q1)}
                    height={20}
                    fill={DATA_COLORS.primary}
                    fillOpacity={0.2}
                    stroke={DATA_COLORS.text}
                  />
                  <line
                    x1={x(median(shownValues))}
                    x2={x(median(shownValues))}
                    y1={cy - 10}
                    y2={cy + 10}
                    stroke={DATA_COLORS.text}
                    strokeWidth={2.5}
                  />
                  {shownValues
                    .filter((v) => v < sh.lower || v > sh.upper)
                    .map((v, i) => (
                      <circle key={i} cx={x(v)} cy={cy} r={3.5} fill={DATA_COLORS.highlight} />
                    ))}
                </g>
              )}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
