import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  binCount,
  histogram,
  interquartileRange,
  standardDeviation,
  type BinRule,
} from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { Bars } from '../../core/svg/Bars.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ChartGallery.module.css';

const BATCHES = 20;
const BATCHES_PER_SECOND = 6;
const RULES: { id: BinRule; name: string }[] = [
  { id: 'sturges', name: 'Sturges' },
  { id: 'scott', name: 'Scott' },
  { id: 'freedman-diaconis', name: 'Freedman-Diaconis' },
];

interface HistogramViewProps {
  title: string;
  values: readonly number[];
  label: string;
  bins?: number;
  rules: boolean;
}

function SmallHistogram({
  values,
  bins,
  domain,
  label,
}: {
  values: readonly number[];
  bins: number;
  domain: [number, number];
  label: string;
}) {
  const data = histogram(values, bins, domain);
  return (
    <ChartSvg
      label={label}
      aspect={0.6}
      minHeight={150}
      maxHeight={220}
      margins={{ top: 8, right: 8, bottom: 30, left: 34 }}
    >
      {(box) => {
        const x = scaleLinear()
          .domain(domain)
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLinear()
          .domain([0, Math.max(1, ...data.map((b) => b.count)) * 1.1])
          .range([box.inner.top + box.inner.height, box.inner.top]);
        return (
          <g>
            <Axis scale={y} orientation="left" position={box.inner.left} ticks={3} />
            <Axis
              scale={x}
              orientation="bottom"
              position={box.inner.top + box.inner.height}
              ticks={4}
            />
            <Bars
              bars={data.map((b) => ({ x0: b.x0, x1: b.x1, value: b.count }))}
              xScale={x}
              yScale={y}
              color={DATA_COLORS.tertiary}
              animate={false}
            />
          </g>
        );
      }}
    </ChartSvg>
  );
}

/**
 * A histogram whose data arrive in batches. The number of bins and the
 * position of the first edge can be changed to see how much the picture
 * depends on those choices; the three classic rules can be compared.
 */
export function HistogramView({
  title,
  values,
  label,
  bins: initialBins,
  rules,
}: HistogramViewProps) {
  const n = values.length;
  const suggested = binCount(values, 'freedman-diaconis');
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'k',
        label: 'Número de intervalos',
        symbol: 'k',
        min: 2,
        max: 60,
        step: 1,
        default: initialBins ?? suggested,
      },
      {
        type: 'number',
        key: 'origen',
        label: 'Desplazamiento del primer borde (fracción del ancho)',
        min: 0,
        max: 0.9,
        step: 0.1,
        default: 0,
        digits: 1,
      },
    ],
    [initialBins, suggested],
  );
  const parameters = useParameters(definitions);
  const k = Number(parameters.values.k);
  const offset = Number(parameters.values.origen);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${values.length}|${run}`, () =>
    reducedMotion ? BATCHES : 1,
  );
  const playback = usePlayback({
    step: () => update((value) => Math.min(BATCHES, value + 1)),
    reset: () => setRun((v) => v + 1),
    rate: BATCHES_PER_SECOND,
    done: shown >= BATCHES,
  });
  const visible = values.slice(0, Math.round((n * shown) / BATCHES));
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const width = (hi - lo) / k || 1;
  const domain: [number, number] = [
    lo - offset * width,
    lo - offset * width + width * (k + (offset > 0 ? 1 : 0)),
  ];
  const totalBins = k + (offset > 0 ? 1 : 0);
  const data = histogram(visible, totalBins, domain);
  const maxCount = Math.max(1, ...histogram(values, totalBins, domain).map((b) => b.count));
  const f = (v: number) => formatNumber(v, 3);
  const s = standardDeviation(values);
  const iqr = interquartileRange(values);
  const header = rules
    ? `k_{\\text{Sturges}} = \\lceil \\log_2 ${n} \\rceil + 1 = ${binCount(values, 'sturges')},\\quad h_{\\text{Scott}} = \\frac{3.49\\,s}{n^{1/3}} = ${f((3.49 * s) / Math.cbrt(n))},\\quad h_{\\text{FD}} = \\frac{2\\,\\mathrm{RIQ}}{n^{1/3}} = ${f((2 * iqr) / Math.cbrt(n))}`
    : `h = \\frac{x_{(n)} - x_{(1)}}{k} = \\frac{${f(hi)} - ${f(lo)}}{${k}} = ${f(width)}\\quad(${visible.length} \\text{ de } ${n} \\text{ datos})`;
  const tallest = data.reduce(
    (a, b) => (b.count > a.count ? b : a),
    data[0] ?? { x0: 0, x1: 0, count: 0 },
  );
  const description =
    `Histograma de ${visible.length} datos de ${label} con ${totalBins} intervalos de ancho ${f(width)}. ` +
    `El intervalo más poblado va de ${f(tallest.x0)} a ${f(tallest.x1)} con ${tallest.count} datos.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Datos', value: `${visible.length} de ${n}` },
        { label: 'Intervalos', value: String(totalBins) },
        { label: 'Ancho de intervalo h', value: f(width) },
        { label: 'Intervalos según Sturges', value: String(binCount(values, 'sturges')) },
        { label: 'Intervalos según Scott', value: String(binCount(values, 'scott')) },
        {
          label: 'Intervalos según Freedman-Diaconis',
          value: String(binCount(values, 'freedman-diaconis')),
        },
      ]}
      legend={[{ label: 'Frecuencia por intervalo', color: DATA_COLORS.tertiary }]}
      description={description}
      dataTable={{
        caption: 'Frecuencias por intervalo',
        columns: ['Desde', 'Hasta', 'Frecuencia'],
        rows: data.map((b) => [f(b.x0), f(b.x1), String(b.count)]),
      }}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={240}
        maxHeight={400}
        margins={{ top: 16, right: 20, bottom: 46, left: 52 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain(domain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, maxCount * 1.1])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="Frecuencia"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={8}
                label={label}
              />
              <Bars
                bars={data.map((b) => ({ x0: b.x0, x1: b.x1, value: b.count }))}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.tertiary}
              />
              {visible.map((v, i) => (
                <line
                  key={i}
                  x1={x(v)}
                  x2={x(v)}
                  y1={box.inner.top + box.inner.height}
                  y2={box.inner.top + box.inner.height + 5}
                  stroke={DATA_COLORS.text}
                  strokeOpacity={0.5}
                  aria-hidden="true"
                />
              ))}
            </g>
          );
        }}
      </ChartSvg>
      {rules && (
        <div className={styles.pair}>
          {RULES.map((rule) => (
            <div key={rule.id}>
              <h4 className={styles.panelTitle}>
                {rule.name}: {binCount(values, rule.id)} intervalos
              </h4>
              <SmallHistogram
                values={values}
                bins={binCount(values, rule.id)}
                domain={[lo, hi]}
                label={`Histograma con la regla de ${rule.name}`}
              />
            </div>
          ))}
        </div>
      )}
    </VizFrame>
  );
}
