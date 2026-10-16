import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { cumulantsFromRawMoments, mgfOf } from '../../../lib/probability/randomVariable.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MomentFunctionViz.module.css';
import { snapZero } from '../RandomVariableLab/source.ts';
import { momentsOf, momentSource } from './momentSource.ts';
import type { MomentFunctionVizConfig } from './schema.ts';

const STAGES_PER_SECOND = 0.7;
const CURVE_POINTS = 160;
const MAX_ORDER = 6;

function factorial(n: number): number {
  let result = 1;
  for (let k = 2; k <= n; k += 1) result *= k;
  return result;
}

interface MgfViewProps {
  title: string;
  config: MomentFunctionVizConfig;
  /** True to show the cumulant generating function K(t) = log M(t) instead of M(t). */
  cumulants: boolean;
}

/**
 * The moment generating function M(t) = E[e^{tX}] near t = 0 with its Taylor
 * polynomials, whose coefficients are the moments divided by k!; or the
 * cumulant generating function K(t) = log M(t), whose coefficients are the
 * cumulants. Each stage adds one more term, so the polynomial hugs the curve
 * on a wider interval around 0.
 */
export function MgfView({ title, config, cumulants }: MgfViewProps) {
  const source = momentSource(config);
  const { pmf } = source;
  const half = config.t ?? 1;
  const maxOrder = Math.min(cumulants ? 4 : MAX_ORDER, config.orden ?? (cumulants ? 4 : 4));
  const exactMoments = momentsOf(source, MAX_ORDER);
  // Odd moments of symmetric distributions cancel to rounding noise; the scale is the even
  // moment of the same order so the comparison is relative.
  const scaleOf = (index: number) =>
    Math.abs(exactMoments[index % 2 === 0 ? Math.min(index + 1, MAX_ORDER - 1) : index] ?? 1);
  const moments = exactMoments.map((m, index) => snapZero(m, scaleOf(index)));
  const kappas = cumulantsFromRawMoments(moments).map((c, index) => snapZero(c, scaleOf(index)));
  const coefficients = cumulants ? kappas : moments;

  const [run, setRun] = useState(0);
  const [order, update] = useResettableState(`${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(maxOrder, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STAGES_PER_SECOND,
    done: order >= maxOrder,
  });

  const fn = (t: number) => (cumulants ? Math.log(mgfOf(pmf, t)) : mgfOf(pmf, t));
  const poly = (t: number, k: number) =>
    (cumulants ? 0 : 1) +
    Array.from(
      { length: k },
      (_, i) => ((coefficients[i] ?? 0) * t ** (i + 1)) / factorial(i + 1),
    ).reduce((a, b) => a + b, 0);
  const f = (v: number) => formatNumber(v, 3);
  const name = cumulants ? 'K' : 'M';
  const terms = Array.from({ length: order }, (_, i) => {
    const k = i + 1;
    const c = f(coefficients[i] ?? 0);
    return k === 1 ? `${c}\\,t` : `${c}\\,\\frac{t^{${k}}}{${k}!}`;
  });
  const header =
    order === 0
      ? cumulants
        ? `K(t) = \\log M(t) = \\sum_{k \\ge 1} \\kappa_k \\frac{t^k}{k!}`
        : `M(t) = \\mathbb{E}[e^{tX}] = \\sum_{k \\ge 0} \\mathbb{E}[X^k] \\frac{t^k}{k!}`
      : `${name}(t) \\approx ${cumulants ? '' : '1 + '}${terms.join(' + ')}`;
  const description =
    `${source.label}. ${cumulants ? 'Cumulantes' : 'Momentos'} de orden 1 a 4: ${coefficients
      .slice(0, 4)
      .map((c) => f(c))
      .join(', ')}. ` + `Polinomio de Taylor de orden ${order} alrededor de t = 0.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        ...coefficients.slice(0, 4).map((c, i) => ({
          label: cumulants ? `κ${['₁', '₂', '₃', '₄'][i]}` : `E[X${['', '²', '³', '⁴'][i]}]`,
          value: f(c),
          color: seriesColor(i),
        })),
        { label: 'Orden del polinomio', value: String(order) },
      ]}
      legend={[
        { label: cumulants ? 'K(t) = log M(t)' : 'M(t)', color: DATA_COLORS.text, shape: 'line' },
        { label: 'Polinomio de Taylor', color: DATA_COLORS.primary, shape: 'dashed' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <ChartSvg label={description} aspect={0.5} minHeight={240} maxHeight={360}>
        {(box) => {
          const ts = Array.from(
            { length: CURVE_POINTS + 1 },
            (_, i) => -half + (2 * half * i) / CURVE_POINTS,
          );
          const curve = ts.map((t) => ({ x: t, y: fn(t) })).filter((p) => Number.isFinite(p.y));
          const ys = curve.map((p) => p.y);
          const lo = Math.min(...ys);
          const hi = Math.max(...ys);
          const pad = (hi - lo) * 0.15 + 0.05;
          const clamp = (v: number) => Math.min(hi + pad, Math.max(lo - pad, v));
          const sx = scaleLinear()
            .domain([-half, half])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const sy = scaleLinear()
            .domain([lo - pad, hi + pad])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <>
              <Axis
                scale={sy}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label={cumulants ? 'K(t)' : 'M(t)'}
              />
              <Axis
                scale={sx}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="t"
              />
              <line
                x1={sx(0)}
                x2={sx(0)}
                y1={box.inner.top}
                y2={box.inner.top + box.inner.height}
                stroke={DATA_COLORS.muted}
                strokeDasharray="3 3"
                aria-hidden="true"
              />
              <CurvePath
                points={curve}
                xScale={sx}
                yScale={sy}
                color={DATA_COLORS.text}
                width={2.5}
                animate={false}
              />
              {Array.from({ length: order }, (_, i) => i + 1).map((k) => (
                <g key={k} opacity={k === order ? 1 : 0.3}>
                  <CurvePath
                    points={ts.map((t) => ({ x: t, y: clamp(poly(t, k)) }))}
                    xScale={sx}
                    yScale={sy}
                    color={k === order ? DATA_COLORS.primary : seriesColor(k)}
                    dashed
                    width={k === order ? 2 : 1}
                    animate={false}
                  />
                </g>
              ))}
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        {cumulants
          ? 'La pendiente de K en 0 es la media y su curvatura es la varianza; cada término adicional usa un cumulante más.'
          : 'La pendiente de M en 0 es la media y su curvatura es E[X²]; cada término adicional usa un momento más y el polinomio se pega a la curva en un intervalo mayor.'}
      </p>
    </VizFrame>
  );
}
