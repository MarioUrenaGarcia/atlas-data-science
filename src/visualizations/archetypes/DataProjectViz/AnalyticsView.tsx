import { scaleLinear } from 'd3-scale';
import { area, line } from 'd3-shape';
import { useMemo, useState } from 'react';
import { newsvendorOptimum, newsvendorProfit } from '../../../lib/dataprep/decision.ts';
import {
  decomposeChange,
  fitSalesModel,
  simulateSales,
  type SalesSpec,
} from '../../../lib/dataprep/lifecycle.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { mean } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataProjectViz.module.css';
import { HBars } from '../../shared/HBars.tsx';
import { ANALYTICS_KINDS, type AnalyticsKind } from './schema.ts';

const SALES: SalesSpec = {
  months: 24,
  base: 120,
  trend: 1.2,
  seasonal: 18,
  promoEffect: 22,
  noise: 5,
  promoMonths: [3, 4, 10, 15, 16, 22],
};
const SALES_SEED = 31415;
const HORIZON = 6;
const Z95 = 1.96;
const Q_STEPS = 41;
const STEPS_PER_SECOND: Record<AnalyticsKind, number> = {
  descriptiva: 6,
  diagnostica: 1,
  predictiva: 2,
  prescriptiva: 12,
};

const KIND_LABELS: Record<AnalyticsKind, string> = {
  descriptiva: 'Descriptiva',
  diagnostica: 'Diagnóstica',
  predictiva: 'Predictiva',
  prescriptiva: 'Prescriptiva',
};

const KIND_QUESTIONS: Record<AnalyticsKind, string> = {
  descriptiva: '¿Qué pasó? Unidades vendidas por mes durante 24 meses.',
  diagnostica: '¿Por qué pasó? Descomposición de la mayor caída mensual.',
  predictiva: '¿Qué pasará? Pronóstico de los próximos 6 meses con su intervalo.',
  prescriptiva: '¿Qué conviene hacer? Cantidad a pedir para el mes siguiente.',
};

const MONTH_NAMES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

function monthName(t: number): string {
  return `${MONTH_NAMES[t % 12] ?? ''} ${t < 12 ? 'año 1' : t < 24 ? 'año 2' : 'año 3'}`;
}

/**
 * One store's monthly sales seen through the four kinds of analytics:
 * summarizing the past, explaining a change, forecasting and choosing an
 * order quantity that maximizes expected profit.
 */
export function AnalyticsView({
  title,
  kind,
  price,
  cost,
}: {
  title: string;
  kind: AnalyticsKind;
  price: number;
  cost: number;
}) {
  const [view, setView] = useState<AnalyticsKind>(kind);
  const definitions: ParameterDefinition[] =
    view === 'prescriptiva'
      ? [
          {
            type: 'number',
            key: 'precio',
            label: 'Precio de venta por unidad',
            min: 20,
            max: 200,
            step: 5,
            default: price,
            symbol: 'p',
            unit: 'pesos',
          },
          {
            type: 'number',
            key: 'costo',
            label: 'Costo por unidad',
            min: 5,
            max: 150,
            step: 5,
            default: cost,
            symbol: 'c',
            unit: 'pesos',
          },
        ]
      : [];
  const parameters = useParameters(definitions);
  const p = Number(parameters.values.precio ?? price);
  const c = Math.min(Number(parameters.values.costo ?? cost), p - 1);
  const series = useMemo(() => simulateSales(SALES, new Random(SALES_SEED)), []);
  const model = useMemo(() => fitSalesModel(series), [series]);
  const drop = useMemo(() => {
    let best = 1;
    for (let t = 1; t < series.months; t += 1) {
      const d = (series.sales[t] ?? 0) - (series.sales[t - 1] ?? 0);
      const bd = (series.sales[best] ?? 0) - (series.sales[best - 1] ?? 0);
      if (d < bd) best = t;
    }
    return best;
  }, [series]);
  const totals: Record<AnalyticsKind, number> = {
    descriptiva: series.months,
    diagnostica: 5,
    predictiva: HORIZON,
    prescriptiva: Q_STEPS,
  };
  const total = totals[view];
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState(`${view}|${run}`, () =>
    reducedMotion ? total : view === 'descriptiva' ? 2 : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND[view],
    done: shown >= total,
  });
  if (!model) return null;
  const sigma = model.fit.sigma;
  const g = (v: number) => formatNumber(v, 1);
  const sales = series.sales;
  const visibleSales = view === 'descriptiva' ? sales.slice(0, shown) : sales;
  const forecast = Array.from({ length: HORIZON }, (_, h) =>
    model.predict(series.months + h, false),
  );
  const decomposition = decomposeChange(series, model, drop - 1, drop);
  const parts = [
    decomposition.trend,
    decomposition.season,
    decomposition.promo,
    decomposition.residual,
  ];
  const partLabels = ['Tendencia', 'Estacionalidad', 'Promoción', 'Residuo'];
  const mu = forecast[0] ?? 0;
  const qStar = newsvendorOptimum(mu, sigma, p, c);
  const qGrid = Array.from(
    { length: Q_STEPS },
    (_, i) => mu - 3 * sigma + (6 * sigma * i) / (Q_STEPS - 1),
  );
  const profits = qGrid.map((q) => newsvendorProfit(q, mu, sigma, p, c));
  const coefficients = model.fit.coefficients.map((v) => formatNumber(v, 2));

  let header: string;
  let readouts: { label: string; value: string; color?: string }[];
  if (view === 'descriptiva') {
    const m = mean(visibleSales);
    const maxIndex = visibleSales.indexOf(Math.max(...visibleSales));
    header = `\\bar{y} = \\frac{1}{${visibleSales.length}}\\sum_{t=1}^{${visibleSales.length}} y_t = ${g(m)}`;
    readouts = [
      { label: 'Meses mostrados', value: String(visibleSales.length) },
      { label: 'Promedio mensual', value: `${g(m)} unidades` },
      { label: 'Mes más alto', value: `${monthName(maxIndex)}: ${g(visibleSales[maxIndex] ?? 0)}` },
      {
        label: 'Meses con promoción',
        value: String(series.promo.slice(0, visibleSales.length).filter(Boolean).length),
      },
    ];
  } else if (view === 'diagnostica') {
    const shownParts = parts.slice(0, Math.max(0, shown - 1));
    header =
      shown === 0
        ? `\\Delta y = y_{${drop + 1}} - y_{${drop}} = ${g(decomposition.total)}`
        : `\\Delta y = ${g(decomposition.total)} = ${shownParts.map((v) => `(${g(v)})`).join(' + ') || '\\dots'}${shownParts.length < 4 ? ' + \\dots' : ''}`;
    readouts = [
      { label: 'Cambio observado', value: `${g(decomposition.total)} unidades` },
      ...partLabels.map((label, i) => ({ label, value: i < shown - 1 ? g(parts[i] ?? 0) : '...' })),
    ];
  } else if (view === 'predictiva') {
    const h = Math.max(1, shown);
    const yhat = forecast[h - 1] ?? 0;
    header =
      shown === 0
        ? `\\hat{y}_t = ${coefficients[0]} + ${coefficients[1]}\\,t + (${coefficients[2]})\\sin\\tfrac{2\\pi t}{12} + (${coefficients[3]})\\cos\\tfrac{2\\pi t}{12} + ${coefficients[4]}\\,\\text{promo}_t`
        : `\\hat{y}_{${series.months + h}} = ${g(yhat)} \\pm ${Z95} \\cdot ${g(sigma)} = [${g(yhat - Z95 * sigma)},\\ ${g(yhat + Z95 * sigma)}]`;
    readouts = [
      { label: 'Meses pronosticados', value: `${shown} de ${HORIZON}` },
      { label: 'Desviación del error', value: g(sigma) },
      { label: 'Efecto estimado de una promoción', value: `${coefficients[4] ?? ''} unidades` },
    ];
  } else {
    header = `q^* = \\mu + \\sigma\\,\\Phi^{-1}\\!\\left(\\frac{p - c}{p}\\right) = ${g(mu)} + ${g(sigma)}\\,\\Phi^{-1}\\!\\left(\\frac{${p} - ${c}}{${p}}\\right) = ${g(qStar)}`;
    readouts = [
      { label: 'Demanda esperada', value: `${g(mu)} unidades` },
      { label: 'Razón crítica', value: formatNumber((p - c) / p, 3) },
      { label: 'Pedido óptimo', value: `${g(qStar)} unidades`, color: DATA_COLORS.highlight },
      {
        label: 'Ganancia esperada óptima',
        value: `${g(newsvendorProfit(qStar, mu, sigma, p, c))} pesos`,
      },
    ];
  }
  const description =
    `Analítica ${KIND_LABELS[view].toLowerCase()}. ${KIND_QUESTIONS[view]} ` +
    readouts.map((r) => `${r.label}: ${r.value}`).join('; ') +
    '.';
  const timeChart = view !== 'prescriptiva';

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      views={{
        options: ANALYTICS_KINDS.map((k) => ({ value: k, label: KIND_LABELS[k] })),
        value: view,
        onChange: (next) => setView(next as AnalyticsKind),
      }}
      readouts={readouts}
      legend={
        timeChart
          ? [
              { label: 'Unidades vendidas', color: DATA_COLORS.primary, shape: 'line' },
              { label: 'Mes con promoción', color: DATA_COLORS.tertiary, shape: 'circle' },
              ...(view === 'predictiva'
                ? [
                    { label: 'Pronóstico', color: DATA_COLORS.secondary, shape: 'dashed' as const },
                    { label: 'Intervalo de 95 %', color: DATA_COLORS.light },
                  ]
                : []),
            ]
          : [
              { label: 'Ganancia esperada', color: DATA_COLORS.secondary, shape: 'line' },
              { label: 'Pedido óptimo', color: DATA_COLORS.highlight, shape: 'line' },
            ]
      }
      description={description}
      dataTable={{
        caption: 'Ventas mensuales',
        columns: ['Mes', 'Unidades vendidas', 'Promoción'],
        rows: sales.map((v, t) => [monthName(t), g(v), series.promo[t] ? 'sí' : 'no']),
      }}
    >
      <FormulaLine tex={header} />
      <p className={styles.stage}>{KIND_QUESTIONS[view]}</p>
      {timeChart && (
        <ChartSvg
          label={description}
          aspect={0.5}
          minHeight={240}
          maxHeight={380}
          margins={{ top: 12, right: 16, bottom: 44, left: 52 }}
        >
          {(box) => {
            const { left, top, width, height } = box.inner;
            const months = series.months + (view === 'predictiva' ? HORIZON : 0);
            const x = scaleLinear()
              .domain([0, months - 1])
              .range([left, left + width]);
            const all = [
              ...sales,
              ...forecast.map((f) => f + Z95 * sigma),
              ...forecast.map((f) => f - Z95 * sigma),
            ];
            const y = scaleLinear()
              .domain([Math.min(...all) - 5, Math.max(...all) + 5])
              .nice()
              .range([top + height, top]);
            const salesPath =
              line<number>()
                .x((_, i) => x(i))
                .y((v) => y(v))(visibleSales) ?? '';
            const fc = forecast.slice(0, shown);
            const fcPath =
              line<number>()
                .x((_, i) => x(series.months - 1 + i))
                .y((v) => y(v))([sales[series.months - 1] ?? 0, ...fc]) ?? '';
            const band =
              area<number>()
                .x((_, i) => x(series.months + i))
                .y0((v) => y(v - Z95 * sigma))
                .y1((v) => y(v + Z95 * sigma))(fc) ?? '';
            return (
              <g>
                <Axis
                  scale={y}
                  orientation="left"
                  position={left}
                  gridLength={width}
                  ticks={5}
                  label="Unidades"
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={top + height}
                  ticks={Math.min(10, months)}
                  format={(v) => String(v + 1)}
                  label="Mes"
                />
                <g aria-hidden="true">
                  {view === 'predictiva' && (
                    <path d={band} fill={DATA_COLORS.light} fillOpacity={0.45} />
                  )}
                  {view === 'diagnostica' && (
                    <rect
                      x={x(drop - 1) - 6}
                      y={top}
                      width={x(drop) - x(drop - 1) + 12}
                      height={height}
                      fill={DATA_COLORS.highlight}
                      fillOpacity={0.14}
                    />
                  )}
                  <path d={salesPath} fill="none" stroke={DATA_COLORS.primary} strokeWidth={2.2} />
                  {view === 'predictiva' && (
                    <path
                      d={fcPath}
                      fill="none"
                      stroke={DATA_COLORS.secondary}
                      strokeWidth={2.2}
                      strokeDasharray="6 4"
                    />
                  )}
                  {visibleSales.map((v, t) => (
                    <circle
                      key={t}
                      cx={x(t)}
                      cy={y(v)}
                      r={series.promo[t] ? 5 : 3}
                      fill={series.promo[t] ? DATA_COLORS.tertiary : DATA_COLORS.primary}
                    />
                  ))}
                  {view === 'descriptiva' && visibleSales.length > 0 && (
                    <line
                      x1={left}
                      x2={left + width}
                      y1={y(mean(visibleSales))}
                      y2={y(mean(visibleSales))}
                      stroke={DATA_COLORS.muted}
                      strokeDasharray="4 4"
                    />
                  )}
                </g>
              </g>
            );
          }}
        </ChartSvg>
      )}
      {view === 'diagnostica' && (
        <HBars
          labels={partLabels}
          values={parts.map((v, i) => (i < shown - 1 ? v : 0))}
          highlight={parts.reduce(
            (best, v, i) => (Math.abs(v) > Math.abs(parts[best] ?? 0) ? i : best),
            0,
          )}
          axisLabel="Aporte al cambio (unidades)"
          decimals={1}
          label={`Aportes al cambio entre ${monthName(drop - 1)} y ${monthName(drop)}`}
        />
      )}
      {view === 'prescriptiva' && (
        <ChartSvg
          label={description}
          aspect={0.5}
          minHeight={240}
          maxHeight={360}
          margins={{ top: 12, right: 16, bottom: 44, left: 60 }}
        >
          {(box) => {
            const { left, top, width, height } = box.inner;
            const x = scaleLinear()
              .domain([qGrid[0] ?? 0, qGrid[Q_STEPS - 1] ?? 1])
              .range([left, left + width]);
            const y = scaleLinear()
              .domain([Math.min(0, ...profits), Math.max(...profits) * 1.08])
              .nice()
              .range([top + height, top]);
            const path =
              line<number>()
                .x((_, i) => x(qGrid[i] ?? 0))
                .y((v) => y(v))(profits.slice(0, shown)) ?? '';
            return (
              <g>
                <Axis
                  scale={y}
                  orientation="left"
                  position={left}
                  gridLength={width}
                  ticks={5}
                  label="Ganancia esperada (pesos)"
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={top + height}
                  ticks={6}
                  label="Unidades pedidas (q)"
                />
                <g aria-hidden="true">
                  <path d={path} fill="none" stroke={DATA_COLORS.secondary} strokeWidth={2.5} />
                  {shown >= Q_STEPS && (
                    <line
                      x1={x(qStar)}
                      x2={x(qStar)}
                      y1={top}
                      y2={top + height}
                      stroke={DATA_COLORS.highlight}
                      strokeWidth={2}
                      strokeDasharray="5 3"
                    />
                  )}
                  <line
                    x1={x(mu)}
                    x2={x(mu)}
                    y1={top + height - 8}
                    y2={top + height}
                    stroke={DATA_COLORS.muted}
                    strokeWidth={2}
                  />
                  <text
                    x={x(mu)}
                    y={top + height - 12}
                    textAnchor="middle"
                    className={styles.chartLabel}
                  >
                    μ
                  </text>
                </g>
              </g>
            );
          }}
        </ChartSvg>
      )}
    </VizFrame>
  );
}
