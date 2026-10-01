import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber, formatPercent } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import {
  excessKurtosis,
  histogram,
  kernelDensity,
  mean,
  median,
  quantile,
  silvermanBandwidth,
  skewness,
  standardDeviation,
  sum,
} from '../../../lib/stats/index.ts';
import {
  densityModes,
  drawSample,
  familyMoments,
  tailFraction,
  type ShapeFamily,
} from '../../../lib/stats/shape.ts';
import { standardNormalCdf } from '../../../lib/distributions/special.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { NumberParameter, ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { Bars } from '../../core/svg/Bars.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataStrip.module.css';

export type ShapeFocus = 'asimetria' | 'curtosis' | 'modas' | 'colas';

const BATCH = 20;
const BATCHES_PER_SECOND = 6;
const BINS = 32;
const CURVE_POINTS = 160;
const TAIL_K = 3;
const DOMAIN_QUANTILES: [number, number] = [0.003, 0.997];

const FAMILY_NAMES: Record<ShapeFamily, string> = {
  normal: 'Normal (campana simétrica)',
  'sesgo-derecha': 'Cola larga a la derecha',
  'sesgo-izquierda': 'Cola larga a la izquierda',
  'colas-pesadas': 'Colas pesadas (t de Student)',
  uniforme: 'Uniforme (colas ligeras)',
  laplace: 'Laplace (pico agudo)',
  mezcla: 'Mezcla de dos grupos',
};

/** Slider for the shape of each family; a figure offers families that share one kind of control. */
const SHAPE_CONTROL: Partial<Record<ShapeFamily, Omit<NumberParameter, 'key' | 'default'>>> = {
  'sesgo-derecha': {
    type: 'number',
    label: 'Forma de la gamma (menor es más sesgada)',
    symbol: 'k',
    min: 0.5,
    max: 30,
    step: 0.5,
    digits: 1,
  },
  'sesgo-izquierda': {
    type: 'number',
    label: 'Forma de la gamma (menor es más sesgada)',
    symbol: 'k',
    min: 0.5,
    max: 30,
    step: 0.5,
    digits: 1,
  },
  'colas-pesadas': {
    type: 'number',
    label: 'Grados de libertad (menor es más pesada)',
    symbol: 'ν',
    min: 1,
    max: 40,
    step: 1,
  },
  mezcla: {
    type: 'number',
    label: 'Separación entre grupos, en desviaciones',
    symbol: 'd',
    min: 0,
    max: 6,
    step: 0.25,
    digits: 2,
  },
};

interface ShapeViewProps {
  title: string;
  families: readonly ShapeFamily[];
  family: ShapeFamily;
  shape: number;
  weight: number;
  n: number;
  focus: ShapeFocus;
  center: number;
  scale: number;
  variable: string;
  unit: string;
  seed: number;
}

/**
 * A sample that grows in batches and is drawn as a histogram next to the
 * normal curve with the same mean and standard deviation. The readouts and
 * the header follow the feature in focus: skewness, kurtosis, modes or tails.
 */
export function ShapeView(props: ShapeViewProps) {
  const { title, families, focus, center, scale, variable, unit, n } = props;
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(families.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'forma',
              label: 'Forma de la población',
              options: families.map((value) => ({ value, label: FAMILY_NAMES[value] })),
              default: props.family,
            },
          ]
        : []),
      ...families
        .filter((value) => SHAPE_CONTROL[value])
        .slice(0, 1)
        .flatMap((value) => {
          const control = SHAPE_CONTROL[value];
          return control ? [{ ...control, key: 'k', default: props.shape }] : [];
        }),
      { type: 'toggle', key: 'normal', label: 'Normal de referencia', default: true },
      ...(focus === 'modas'
        ? [
            {
              type: 'number' as const,
              key: 'ancho',
              label: 'Ancho de banda de la densidad (veces Silverman)',
              symbol: 'h',
              min: 0.2,
              max: 3,
              step: 0.1,
              default: 1,
              digits: 1,
            },
          ]
        : []),
    ],
    [families, props.family, props.shape, focus],
  );
  const parameters = useParameters(definitions);
  const family = (
    families.length > 1 ? String(parameters.values.forma) : props.family
  ) as ShapeFamily;
  const shape = Number(parameters.values.k ?? props.shape);
  const showNormal = Boolean(parameters.values.normal);
  const bandwidthFactor = Number(parameters.values.ancho ?? 1);
  const seed = useSeed(props.seed);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const key = `${family}|${shape}|${props.weight}|${n}|${seed.seed}|${run}`;
  const [state, update] = useResettableState(key, () => ({
    values: drawSample({ family, shape, weight: props.weight }, n, new Random(seed.seed + run)).map(
      (z) => center + scale * z,
    ),
    shown: reducedMotion ? n : BATCH,
  }));
  const playback = usePlayback({
    step: () => update((previous) => ({ ...previous, shown: Math.min(n, previous.shown + BATCH) })),
    reset: () => setRun((value) => value + 1),
    rate: BATCHES_PER_SECOND,
    done: state.shown >= n,
  });
  const visible = state.values.slice(0, state.shown);
  const m = mean(visible);
  const s = standardDeviation(visible);
  const g1 = skewness(visible);
  const g2 = excessKurtosis(visible);
  const domain: [number, number] = [
    quantile(state.values, DOMAIN_QUANTILES[0]),
    quantile(state.values, DOMAIN_QUANTILES[1]),
  ];
  const outside = visible.filter((value) => value < domain[0] || value > domain[1]).length;
  const bins = histogram(visible, BINS, domain);
  const binWidth = (domain[1] - domain[0]) / BINS;
  const kde = kernelDensity(visible, silvermanBandwidth(visible) * bandwidthFactor);
  const modes = focus === 'modas' ? densityModes(kde, domain) : [];
  const tails = tailFraction(visible, TAIL_K);
  const normalTail = 2 * (1 - standardNormalCdf(TAIL_K));
  const theory = familyMoments({ family, shape, weight: props.weight });
  const f = (value: number, digits = 3) =>
    Number.isFinite(value) ? formatNumber(value, digits) : value > 0 ? '\\infty' : '?';
  const nVisible = visible.length;
  const m2 = sum(visible.map((x) => (x - m) ** 2)) / nVisible;
  const m3 = sum(visible.map((x) => (x - m) ** 3)) / nVisible;
  const m4 = sum(visible.map((x) => (x - m) ** 4)) / nVisible;
  const unitText = unit ? ` ${unit}` : '';
  const header = {
    asimetria: `G_1 = \\frac{\\sqrt{n(n-1)}}{n-2}\\,\\frac{m_3}{m_2^{3/2}} = \\frac{\\sqrt{${nVisible}\\cdot${nVisible - 1}}}{${nVisible - 2}}\\cdot\\frac{${f(m3)}}{${f(m2)}^{3/2}} = ${f(g1)}`,
    curtosis: `g_2 = \\frac{m_4}{m_2^{2}} - 3 = \\frac{${f(m4)}}{${f(m2)}^{2}} - 3 = ${f(m4 / (m2 * m2) - 3)},\\quad G_2 = ${f(g2)}`,
    modas: `\\text{máximos locales de la densidad: } ${modes.length === 0 ? '\\text{ninguno}' : modes.map((x) => f(x, 1)).join(',\\ ')}`,
    colas: `\\frac{\\#\\{|x_i - \\bar{x}| > 3s\\}}{n} = ${formatNumber(tails * 100, 2)}\\,\\%\\quad\\text{frente a } ${formatNumber(normalTail * 100, 2)}\\,\\% \\text{ en una normal}`,
  }[focus];
  const description =
    `${nVisible} observaciones de ${variable}, forma: ${FAMILY_NAMES[family].toLowerCase()}. ` +
    `Media ${formatNumber(m, 2)}, mediana ${formatNumber(median(visible), 2)}, asimetría ${formatNumber(g1, 2)}, exceso de curtosis ${formatNumber(g2, 2)}.` +
    (focus === 'modas' ? ` La densidad estimada tiene ${modes.length} máximos locales.` : '') +
    (focus === 'colas'
      ? ` ${formatPercent(tails, 2)} de los datos están a más de tres desviaciones estándar de la media.`
      : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Observaciones', value: `${nVisible} de ${n}` },
        { label: 'Media', value: `${formatNumber(m, 2)}${unitText}`, color: DATA_COLORS.primary },
        {
          label: 'Mediana',
          value: `${formatNumber(median(visible), 2)}${unitText}`,
          color: DATA_COLORS.highlight,
        },
        { label: 'Asimetría muestral G1', value: formatNumber(g1, 3) },
        { label: 'Exceso de curtosis G2', value: formatNumber(g2, 3) },
        {
          label: 'Asimetría de la población',
          value: Number.isFinite(theory.skewness)
            ? formatNumber(theory.skewness, 3)
            : 'no definida',
        },
        {
          label: 'Exceso de curtosis de la población',
          value: Number.isFinite(theory.kurtosis)
            ? formatNumber(theory.kurtosis, 3)
            : 'infinito o no definido',
        },
        ...(focus === 'colas'
          ? [
              {
                label: 'Datos a más de 3 s de la media',
                value: formatPercent(tails, 2),
                color: DATA_COLORS.negative,
              },
            ]
          : []),
        ...(focus === 'modas'
          ? [
              {
                label: 'Máximos locales de la densidad',
                value: String(modes.length),
                color: DATA_COLORS.secondary,
              },
            ]
          : []),
        ...(outside > 0 ? [{ label: 'Datos fuera del eje', value: String(outside) }] : []),
      ]}
      legend={[
        { label: 'Histograma de la muestra', color: DATA_COLORS.tertiary },
        ...(showNormal
          ? [
              {
                label: 'Normal con la misma media y desviación',
                color: DATA_COLORS.text,
                shape: 'dashed' as const,
              },
            ]
          : []),
        ...(focus === 'modas'
          ? [{ label: 'Densidad estimada', color: DATA_COLORS.secondary, shape: 'line' as const }]
          : []),
        { label: 'Media', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Mediana', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={260}
        maxHeight={420}
        margins={{ top: 16, right: 20, bottom: 46, left: 52 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain(domain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const normalPeak = nVisible * binWidth * (1 / (s * Math.sqrt(2 * Math.PI)));
          const top =
            Math.max(
              1,
              ...bins.map((bin) => bin.count),
              showNormal ? normalPeak : 0,
              focus === 'modas' ? nVisible * binWidth * Math.max(...modes.map(kde), 0) : 0,
            ) * 1.1;
          const y = scaleLinear()
            .domain([0, top])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const grid = Array.from(
            { length: CURVE_POINTS },
            (_, i) => domain[0] + ((domain[1] - domain[0]) * i) / (CURVE_POINTS - 1),
          );
          const curve = (fn: (v: number) => number) =>
            grid.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(v)} ${y(fn(v))}`).join(' ');
          const normalCount = (v: number) =>
            (nVisible * binWidth * Math.exp(-0.5 * ((v - m) / s) ** 2)) /
            (s * Math.sqrt(2 * Math.PI));
          const tailLines = focus === 'colas' ? [m - TAIL_K * s, m + TAIL_K * s] : [];
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
                label={`${variable}${unit ? ` (${unit})` : ''}`}
              />
              <Bars
                bars={bins.map((bin) => ({ x0: bin.x0, x1: bin.x1, value: bin.count }))}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.tertiary}
                opacity={0.7}
                animate={false}
              />
              {showNormal && s > 0 && (
                <path
                  d={curve(normalCount)}
                  fill="none"
                  stroke={DATA_COLORS.text}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  aria-hidden="true"
                />
              )}
              {focus === 'modas' && (
                <g aria-hidden="true">
                  <path
                    d={curve((v) => nVisible * binWidth * kde(v))}
                    fill="none"
                    stroke={DATA_COLORS.secondary}
                    strokeWidth={2.5}
                  />
                  {modes.map((mode) => (
                    <circle
                      key={mode}
                      cx={x(mode)}
                      cy={y(nVisible * binWidth * kde(mode))}
                      r={6}
                      fill={DATA_COLORS.secondary}
                    />
                  ))}
                </g>
              )}
              {tailLines.map((t) =>
                t >= domain[0] && t <= domain[1] ? (
                  <line
                    key={t}
                    x1={x(t)}
                    x2={x(t)}
                    y1={box.inner.top}
                    y2={box.inner.top + box.inner.height}
                    stroke={DATA_COLORS.negative}
                    strokeDasharray="4 3"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                ) : null,
              )}
              {[
                { value: m, color: DATA_COLORS.primary },
                { value: median(visible), color: DATA_COLORS.highlight },
              ].map((marker) =>
                marker.value >= domain[0] && marker.value <= domain[1] ? (
                  <line
                    key={marker.color}
                    x1={x(marker.value)}
                    x2={x(marker.value)}
                    y1={box.inner.top}
                    y2={box.inner.top + box.inner.height}
                    stroke={marker.color}
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                ) : null,
              )}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
