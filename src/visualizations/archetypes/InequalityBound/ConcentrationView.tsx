import { scaleLinear, scaleLog } from 'd3-scale';
import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  bernsteinBound,
  binomialUpperTail,
  chernoffBound,
  hoeffdingBound,
} from '../../../lib/probability/inequalities.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './InequalityBound.module.css';
import { SUM_BOUNDS, type InequalityBoundConfig } from './schema.ts';

const DEFAULT_N = 200;
/** Probabilities below this are drawn at the bottom of the logarithmic axis. */
const FLOOR = 1e-8;
const SWEEP_SECONDS = 8;
const CURVE_POINTS = 120;

type SumBound = (typeof SUM_BOUNDS)[number];

const BOUND_NAMES: Record<SumBound, string> = {
  chebyshev: 'Chebyshev',
  hoeffding: 'Hoeffding',
  chernoff: 'Chernoff',
  bernstein: 'Bernstein',
};

interface ConcentrationViewProps {
  title: string;
  config: InequalityBoundConfig;
}

/**
 * Concentration of the average of n independent Bernoulli(p) trials around
 * p: the exact probability that the average exceeds p by t or more, against
 * the Chebyshev bound (which decays like 1/n) and the exponential bounds of
 * Hoeffding, Chernoff and Bernstein, on a logarithmic scale where
 * exponential decay is a straight line. The animation grows n.
 */
export function ConcentrationView({ title, config }: ConcentrationViewProps) {
  const maxN = config.n ?? DEFAULT_N;
  const bounds: SumBound[] = config.cotas ?? ['chebyshev', 'hoeffding', 'chernoff'];
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'p',
        label: 'Probabilidad de éxito',
        symbol: 'p',
        min: 0.05,
        max: 0.95,
        step: 0.05,
        digits: 2,
        default: config.p ?? 0.5,
      },
      {
        type: 'number' as const,
        key: 't',
        label: 'Desviación t',
        symbol: 't',
        min: 0.02,
        max: 0.4,
        step: 0.01,
        digits: 2,
        default: config.umbral ?? 0.1,
      },
      {
        type: 'number' as const,
        key: 'n',
        label: 'Número de ensayos',
        symbol: 'n',
        min: 1,
        max: maxN,
        step: 1,
        digits: 0,
        default: maxN,
      },
    ],
    [config.p, config.umbral, maxN],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const p = values.p ?? 0.5;
  const t = values.t ?? 0.1;
  const n = Math.round(values.n ?? maxN);
  const stepN = Math.max(1, Math.round(maxN / (SWEEP_SECONDS * 10)));
  const playback = usePlayback({
    step: () => parameters.set('n', Math.min(maxN, n + stepN)),
    reset: () => parameters.set('n', 1),
    rate: 10,
    done: n >= maxN,
    autoplay: false,
  });

  const variance = p * (1 - p);
  const boundAt = (kind: SumBound, size: number) => {
    switch (kind) {
      case 'chebyshev':
        return Math.min(1, variance / (size * t * t));
      case 'hoeffding':
        return hoeffdingBound(size, t);
      case 'chernoff':
        return chernoffBound(size, p, t);
      case 'bernstein':
        return bernsteinBound(size, t, variance, Math.max(p, 1 - p));
    }
  };
  const exact = binomialUpperTail(n, p, t);
  const f = (v: number) => (v < 1e-4 ? formatNumber(v, 2) : formatNumber(v, 4));
  const main = bounds[0] ?? 'hoeffding';
  const header = `P(\\bar{X}_{${n}} - ${formatNumber(p, 2)} \\ge ${formatNumber(t, 2)}) = ${f(exact)} \\;\\le\\; ${
    main === 'chebyshev'
      ? `\\frac{p(1-p)}{n t^2} = ${f(boundAt(main, n))}`
      : main === 'hoeffding'
        ? `e^{-2 n t^2} = ${f(boundAt(main, n))}`
        : main === 'chernoff'
          ? `e^{-n\\, D(p + t \\,\\|\\, p)} = ${f(boundAt(main, n))}`
          : `e^{-n t^2 / (2\\sigma^2 + 2ct/3)} = ${f(boundAt(main, n))}`
  }`;
  const description =
    `Promedio de ${n} ensayos con p = ${formatNumber(p, 2)}. Probabilidad exacta de superar p en ${formatNumber(t, 2)} o más: ${f(exact)}. ` +
    bounds.map((b) => `Cota de ${BOUND_NAMES[b]}: ${f(boundAt(b, n))}`).join('. ') +
    '.';
  const ns = Array.from({ length: CURVE_POINTS + 1 }, (_, i) =>
    Math.max(1, Math.round(1 + ((maxN - 1) * i) / CURVE_POINTS)),
  );
  const uniqueNs = [...new Set(ns)];

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Probabilidad exacta', value: f(exact), color: DATA_COLORS.text },
        ...bounds.map((b, k) => ({
          label: `Cota de ${BOUND_NAMES[b]}`,
          value: f(boundAt(b, n)),
          color: seriesColor(k),
        })),
      ]}
      legend={[
        {
          label: 'Probabilidad exacta (binomial)',
          color: DATA_COLORS.text,
          shape: 'line' as const,
        },
        ...bounds.map((b, k) => ({
          label: `Cota de ${BOUND_NAMES[b]}`,
          color: seriesColor(k),
          shape: 'line' as const,
        })),
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={260}
        maxHeight={380}
        margins={{ top: 16, right: 20, bottom: 40, left: 76 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([1, maxN])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLog()
            .domain([FLOOR, 1])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const clamp = (v: number) => Math.max(FLOOR, Math.min(1, v));
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                tickValues={[1e-8, 1e-6, 1e-4, 1e-2, 1]}
                format={(v) => (v === 1 ? '1' : `10^${Math.round(Math.log10(v))}`)}
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="n"
              />
              {bounds.map((b, k) => (
                <CurvePath
                  key={b}
                  points={uniqueNs.map((size) => ({ x: size, y: clamp(boundAt(b, size)) }))}
                  xScale={x}
                  yScale={y}
                  color={seriesColor(k)}
                  width={k === 0 ? 3 : 2}
                  dashed={k > 0}
                  animate={false}
                />
              ))}
              <CurvePath
                points={uniqueNs.map((size) => ({
                  x: size,
                  y: clamp(binomialUpperTail(size, p, t)),
                }))}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.text}
                width={2}
                animate={false}
              />
              <g aria-hidden="true">
                <line
                  x1={x(n)}
                  x2={x(n)}
                  y1={box.inner.top}
                  y2={box.inner.top + box.inner.height}
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="3 3"
                />
                <circle cx={x(n)} cy={y(clamp(exact))} r={5} fill={DATA_COLORS.text} />
              </g>
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        En escala logarítmica una caída exponencial es una recta. La cota de Chebyshev baja como 1/n
        y se queda muy por encima. La de Chernoff baja con la misma pendiente que la probabilidad
        exacta; las de Hoeffding y Bernstein pueden ser más planas, y entonces su distancia a la
        exacta crece con n.
      </p>
    </VizFrame>
  );
}
