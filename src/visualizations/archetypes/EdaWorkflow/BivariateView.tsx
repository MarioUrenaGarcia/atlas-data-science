import { scaleBand, scaleLinear } from 'd3-scale';
import { type ReactNode, useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { contingencySummary } from '../../../lib/stats/association.ts';
import { tukeyFences } from '../../../lib/stats/eda.ts';
import { median, pearson, spearman } from '../../../lib/stats/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import type { ChartBox } from '../../core/svg/chartBox.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './EdaWorkflow.module.css';
import { ENTRY_ERRORS, HOMES, ZONES } from './homes.ts';
import { ScatterPanel } from './marks.tsx';
import { PAIRS } from './schema.ts';

type Pair = (typeof PAIRS)[number];

const BATCHES = 20;
const BATCHES_PER_SECOND = 6;
const ROOMS = [1, 2, 3, 4, 5, 6];

const PAIR_NAMES: Record<Pair, string> = {
  'superficie-precio': 'Superficie y precio (numérica con numérica)',
  'antiguedad-precio': 'Antigüedad y precio (numérica con numérica)',
  'zona-precio': 'Zona y precio (categórica con numérica)',
  'zona-habitaciones': 'Zona y habitaciones (tabla de contingencia)',
};

interface BivariateViewProps {
  title: string;
  pair: Pair;
  excludeErrors: boolean;
  log: boolean;
}

/**
 * Two variables at a time, with the chart and the summary that fit their
 * types: scatter plot and correlations for two numeric variables, boxes by
 * group for a categorical and a numeric one, and a table of row
 * percentages with Cramér's V for two categorical variables.
 */
export function BivariateView({ title, pair: p0, excludeErrors: e0, log: l0 }: BivariateViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select',
        key: 'par',
        label: 'Par de variables',
        options: PAIRS.map((value) => ({ value, label: PAIR_NAMES[value] })),
        default: p0,
      },
      {
        type: 'toggle',
        key: 'excluir',
        label: 'Excluir los errores de captura',
        default: e0,
        shownWhen: { key: 'par', values: ['superficie-precio'] },
      },
      {
        type: 'toggle',
        key: 'log',
        label: 'Escalas logarítmicas',
        default: l0,
        shownWhen: { key: 'par', values: ['superficie-precio'] },
      },
    ],
    [p0, e0, l0],
  );
  const parameters = useParameters(definitions);
  const pair = String(parameters.values.par) as Pair;
  const exclude = Boolean(parameters.values.excluir);
  const log = Boolean(parameters.values.log);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, setShown] = useResettableState<number>(`${pair}|${run}`, () =>
    reducedMotion ? BATCHES : 1,
  );
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(BATCHES, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: BATCHES_PER_SECOND,
    done: shown >= BATCHES,
  });
  const count = Math.round((HOMES.length * shown) / BATCHES);
  const rows = HOMES.slice(0, count).filter(
    (_, i) => !(exclude && pair === 'superficie-precio' && ENTRY_ERRORS.includes(i)),
  );
  const f = (x: number) => formatNumber(x, 3);

  let header: string;
  let description: string;
  let readouts: { label: string; value: string; color?: string }[];
  let chart: (box: ChartBox) => ReactNode;

  if (pair === 'superficie-precio' || pair === 'antiguedad-precio') {
    const xVar = pair === 'superficie-precio' ? 'superficie' : 'antiguedad';
    const complete = rows.filter((h) => h[xVar] !== null);
    const xs = complete.map((h) => h[xVar] as number);
    const ys = complete.map((h) => h.precio);
    const useLog = log && pair === 'superficie-precio';
    const r =
      xs.length > 2
        ? pearson(useLog ? xs.map(Math.log) : xs, useLog ? ys.map(Math.log) : ys)
        : Number.NaN;
    const rho = xs.length > 2 ? spearman(xs, ys) : Number.NaN;
    header = `r = ${f(r)},\\quad r_s = ${f(rho)},\\quad n = ${xs.length}`;
    description = `${PAIR_NAMES[pair]}: ${xs.length} pares completos${exclude && pair === 'superficie-precio' ? ', sin los errores de captura' : ''}${useLog ? ', en escalas logarítmicas' : ''}. Correlación de Pearson ${f(r)}, de Spearman ${f(rho)}.`;
    readouts = [
      { label: 'Pares completos', value: `${xs.length} de ${rows.length}` },
      { label: 'Pearson r', value: f(r), color: DATA_COLORS.primary },
      { label: 'Spearman rs', value: f(rho), color: DATA_COLORS.secondary },
    ];
    const allPoints = HOMES.filter(
      (h, i) =>
        h[xVar] !== null && !(exclude && pair === 'superficie-precio' && ENTRY_ERRORS.includes(i)),
    ).map((h) => ({ x: h[xVar] as number, y: h.precio }));
    const pts = complete.map((h) => ({
      x: h[xVar] as number,
      y: h.precio,
      highlight: pair === 'superficie-precio' && ENTRY_ERRORS.includes(HOMES.indexOf(h)),
    }));
    chart = (box) => (
      <ScatterPanel
        box={box}
        points={pts}
        extentOf={allPoints}
        xLabel={pair === 'superficie-precio' ? 'Superficie (m²)' : 'Antigüedad (años)'}
        yLabel="Precio (millones)"
        log={useLog}
      />
    );
  } else if (pair === 'zona-precio') {
    const groups = ZONES.map((z) => rows.filter((h) => h.zona === z).map((h) => h.precio));
    const meds = groups.map((g) => (g.length ? median(g) : Number.NaN));
    header = ZONES.map(
      (z, i) => `\\tilde{x}_{\\text{${z}}} = ${formatNumber(meds[i] ?? Number.NaN, 2)}`,
    ).join(',\\ ');
    description =
      `Precio por zona en ${rows.length} viviendas. Medianas: ` +
      ZONES.map((z, i) => `${z} ${formatNumber(meds[i] ?? Number.NaN, 2)}`).join(', ') +
      '.';
    readouts = ZONES.map((z, i) => ({
      label: `Mediana ${z}`,
      value: formatNumber(meds[i] ?? Number.NaN, 2),
      color: seriesColor(i),
    }));
    const hi = Math.max(...HOMES.map((h) => h.precio)) * 1.03;
    chart = (box) => {
      const x = scaleLinear()
        .domain([0, hi])
        .range([box.inner.left, box.inner.left + box.inner.width]);
      const band = box.inner.height / ZONES.length;
      return (
        <g>
          <Axis
            scale={x}
            orientation="bottom"
            position={box.inner.top + box.inner.height}
            gridLength={box.inner.height}
            ticks={8}
            label="Precio (millones)"
          />
          {ZONES.map((z, i) => {
            const g = groups[i] ?? [];
            const cy = box.inner.top + band * (i + 0.5);
            const fences = g.length > 3 ? tukeyFences(g) : null;
            return (
              <g key={z}>
                <text
                  x={box.inner.left - 8}
                  y={cy}
                  dy="0.32em"
                  textAnchor="end"
                  className={styles.chartLabel}
                >
                  {z}
                </text>
                <g aria-hidden="true">
                  {g.map((v, k) => (
                    <circle
                      key={k}
                      cx={x(v)}
                      cy={cy + 14 * (((k * 0.618034) % 1) - 0.5)}
                      r={2.5}
                      fill={seriesColor(i)}
                      fillOpacity={0.6}
                    />
                  ))}
                  {fences && (
                    <>
                      <rect
                        x={x(fences.q1)}
                        y={cy - 16}
                        width={x(fences.q3) - x(fences.q1)}
                        height={32}
                        fill="none"
                        stroke={DATA_COLORS.text}
                        strokeWidth={1.5}
                      />
                      <line
                        x1={x(median(g))}
                        x2={x(median(g))}
                        y1={cy - 16}
                        y2={cy + 16}
                        stroke={DATA_COLORS.text}
                        strokeWidth={3}
                      />
                    </>
                  )}
                </g>
              </g>
            );
          })}
        </g>
      );
    };
  } else {
    const table = ZONES.map((z) =>
      ROOMS.map((k) => rows.filter((h) => h.zona === z && h.habitaciones === k).length),
    );
    const summary = rows.length > 0 ? contingencySummary(table) : null;
    const v = summary && Number.isFinite(summary.cramersV) ? summary.cramersV : Number.NaN;
    header = `\\chi^2 = ${formatNumber(summary?.chiSquare ?? Number.NaN, 2)},\\quad V = ${f(v)}`;
    description = `Habitaciones por zona en ${rows.length} viviendas, como porcentaje de cada fila. V de Cramér ${f(v)}.`;
    readouts = [
      { label: 'Viviendas', value: String(rows.length) },
      { label: 'V de Cramér', value: f(v), color: DATA_COLORS.primary },
    ];
    chart = (box) => {
      const x = scaleBand<number>()
        .domain(ROOMS)
        .range([box.inner.left, box.inner.left + box.inner.width])
        .padding(0.05);
      const y = scaleBand<string>()
        .domain([...ZONES])
        .range([box.inner.top, box.inner.top + box.inner.height])
        .padding(0.05);
      return (
        <g>
          {ROOMS.map((k) => (
            <text
              key={k}
              x={(x(k) ?? 0) + x.bandwidth() / 2}
              y={box.inner.top + box.inner.height + 18}
              textAnchor="middle"
              className={styles.chartLabel}
            >
              {k} hab.
            </text>
          ))}
          {ZONES.map((z, i) => {
            const total = (table[i] ?? []).reduce((t, c) => t + c, 0);
            return (
              <g key={z}>
                <text
                  x={box.inner.left - 8}
                  y={(y(z) ?? 0) + y.bandwidth() / 2}
                  dy="0.32em"
                  textAnchor="end"
                  className={styles.chartLabel}
                >
                  {z}
                </text>
                {ROOMS.map((k, j) => {
                  const share = total ? (table[i]?.[j] ?? 0) / total : 0;
                  return (
                    <g key={k}>
                      <rect
                        x={x(k)}
                        y={y(z)}
                        width={x.bandwidth()}
                        height={y.bandwidth()}
                        fill={DATA_COLORS.primary}
                        fillOpacity={Math.min(0.9, 0.08 + 1.7 * share)}
                        aria-hidden="true"
                      />
                      <text
                        x={(x(k) ?? 0) + x.bandwidth() / 2}
                        y={(y(z) ?? 0) + y.bandwidth() / 2}
                        dy="0.32em"
                        textAnchor="middle"
                        className={styles.cellLabel}
                        fill={share > 0.25 ? 'var(--color-surface)' : 'var(--color-text)'}
                      >
                        {formatNumber(100 * share, 0)} %
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>
      );
    };
  }

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={readouts}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.6}
        minHeight={260}
        maxHeight={420}
        margins={{ top: 12, right: 20, bottom: 46, left: 64 }}
      >
        {(box) => chart(box)}
      </ChartSvg>
    </VizFrame>
  );
}
