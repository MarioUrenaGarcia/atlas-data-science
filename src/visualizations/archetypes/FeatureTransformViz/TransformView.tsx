import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { mean, median, skewness } from '../../../lib/stats/index.ts';
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
import { DotStrip, HistBars } from './marks.tsx';
import { TRANSFORMS, type TransformId } from './schema.ts';

const BINS = 20;
const BATCHES = 20;
const BATCHES_PER_SECOND = 6;
const PANEL_GAP = 46;
const LINKS_SHOWN = 40;

const NAMES: Record<TransformId, string> = {
  identidad: 'Sin transformar',
  raiz: 'Raíz cuadrada',
  'raiz-cubica': 'Raíz cúbica',
  log: 'Logaritmo natural',
  log10: 'Logaritmo base 10',
  reciproco: 'Recíproco negativo',
};

const TEX: Record<TransformId, string> = {
  identidad: 'y = x',
  raiz: 'y = \\sqrt{x}',
  'raiz-cubica': 'y = \\sqrt[3]{x}',
  log: 'y = \\log x',
  log10: 'y = \\log_{10} x',
  reciproco: 'y = -1/x',
};

function apply(f: TransformId, x: number): number {
  switch (f) {
    case 'identidad':
      return x;
    case 'raiz':
      return Math.sqrt(x);
    case 'raiz-cubica':
      return Math.cbrt(x);
    case 'log':
      return Math.log(x);
    case 'log10':
      return Math.log10(x);
    case 'reciproco':
      return -1 / x;
  }
}

/** Transformations that require strictly positive data. */
const NEEDS_POSITIVE: readonly TransformId[] = ['log', 'log10', 'reciproco'];

function pad(values: readonly number[]): [number, number] {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const d = (hi - lo) * 0.04 || 1;
  return [lo - d, hi + d];
}

interface TransformViewProps {
  title: string;
  values: number[];
  label: string;
  transform: TransformId;
}

/**
 * The data on the top axis travel, in batches, to the bottom axis through a
 * monotone transformation. Long right tails compress and the histogram below
 * becomes more symmetric; the skewness of both versions is shown live.
 */
export function TransformView({ title, values, label, transform: t0 }: TransformViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select',
        key: 'funcion',
        label: 'Transformación',
        options: TRANSFORMS.map((value) => ({ value, label: NAMES[value] })),
        default: t0,
      },
    ],
    [t0],
  );
  const parameters = useParameters(definitions);
  const f = String(parameters.values.funcion) as TransformId;
  const positive = values.every((x) => x > 0);
  const usable = positive || !NEEDS_POSITIVE.includes(f);
  const data = usable ? values : values.filter((x) => x > 0);
  const sorted = useMemo(() => [...data].sort((a, b) => a - b), [data]);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, setShown] = useResettableState<number>(`${f}|${run}`, () =>
    reducedMotion ? BATCHES : 0,
  );
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(BATCHES, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: BATCHES_PER_SECOND,
    done: shown >= BATCHES,
  });
  const moved = data.slice(0, Math.round((data.length * shown) / BATCHES));
  const transformed = moved.map((x) => apply(f, x));
  const allTransformed = data.map((x) => apply(f, x));
  const g1 = skewness(data);
  const g1t = transformed.length > 2 ? skewness(transformed) : Number.NaN;
  const last = moved[moved.length - 1];
  const header =
    last === undefined
      ? `${TEX[f]},\\quad \\text{asimetría original} = ${formatNumber(g1, 2)}`
      : `${TEX[f].replace(/x/g, `(${formatNumber(last, 2)})`)} = ${formatNumber(apply(f, last), 3)},\\quad \\text{asimetría: } ${formatNumber(g1, 2)} \\to ${formatNumber(g1t, 2)}`;
  const description =
    `${NAMES[f]} de ${data.length} valores de ${label}. Han pasado ${moved.length}. ` +
    `Asimetría original ${formatNumber(g1, 2)}${Number.isFinite(g1t) ? `, transformada ${formatNumber(g1t, 2)}` : ''}.`;
  const topDomain = pad(data);
  const bottomDomain = pad(allTransformed);
  const links = sorted.filter(
    (_, i) => i % Math.max(1, Math.ceil(sorted.length / LINKS_SHOWN)) === 0,
  );

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Asimetría original', value: formatNumber(g1, 3) },
        {
          label: 'Asimetría transformada',
          value: Number.isFinite(g1t) ? formatNumber(g1t, 3) : 'sin datos',
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Media y mediana originales',
          value: `${formatNumber(mean(data), 2)}; ${formatNumber(median(data), 2)}`,
        },
        {
          label: 'Media y mediana transformadas',
          value:
            transformed.length > 0
              ? `${formatNumber(mean(transformed), 3)}; ${formatNumber(median(transformed), 3)}`
              : 'sin datos',
        },
        ...(usable
          ? []
          : [
              {
                label: 'Valores no positivos omitidos',
                value: String(values.length - data.length),
              },
            ]),
      ]}
      legend={[
        { label: 'Datos originales', color: DATA_COLORS.primary },
        { label: 'Datos transformados', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.7}
        minHeight={340}
        maxHeight={520}
        margins={{ top: 10, right: 20, bottom: 40, left: 20 }}
      >
        {(box) => {
          const h = (box.inner.height - PANEL_GAP) / 2;
          const topBase = box.inner.top + h;
          const bottomBase = box.inner.top + h + PANEL_GAP + h;
          const x = scaleLinear()
            .domain(topDomain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const xt = scaleLinear()
            .domain(bottomDomain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const done = new Set(moved);
          return (
            <g>
              <Axis scale={x} orientation="bottom" position={topBase} ticks={7} label={label} />
              <Axis
                scale={xt}
                orientation="bottom"
                position={bottomBase}
                ticks={7}
                label={`${NAMES[f]} de ${label.toLowerCase()}`}
              />
              <HistBars
                values={data}
                bins={BINS}
                domain={topDomain}
                x={x}
                base={topBase}
                height={h * 0.8}
                color={DATA_COLORS.primary}
              />
              <HistBars
                values={transformed}
                bins={BINS}
                domain={bottomDomain}
                x={xt}
                base={bottomBase}
                height={h * 0.8}
                color={DATA_COLORS.secondary}
              />
              <g aria-hidden="true">
                {links.map((v, i) => (
                  <line
                    key={i}
                    x1={x(v)}
                    y1={topBase + 22}
                    x2={xt(apply(f, v))}
                    y2={bottomBase - h * 0.85}
                    stroke={done.has(v) ? DATA_COLORS.secondary : DATA_COLORS.muted}
                    strokeOpacity={done.has(v) ? 0.5 : 0.15}
                  />
                ))}
              </g>
              <DotStrip
                values={data}
                x={x}
                y={topBase - 8}
                color={DATA_COLORS.primary}
                radius={2.5}
              />
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
