import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  cantelliBound,
  chebyshevBound,
  markovBound,
} from '../../../lib/probability/inequalities.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { DISTRIBUTION_SPECS, specValues } from '../../shared/distributionSpecs.ts';
import { plotWindow } from '../../shared/plotWindow.ts';
import styles from './InequalityBound.module.css';
import { TailChart } from './TailChart.tsx';
import type { InequalityBoundConfig } from './schema.ts';

const SWEEP_STEPS = 50;
const STEPS_PER_SECOND = 8;
const CURVE_POINTS = 160;
/** Range of k, in standard deviations, for the Chebyshev and Cantelli bounds. */
const K_MIN = 0.25;
const K_MAX = 4;
/** Values within this distance of a threshold count as reaching it, for discrete distributions. */
const EDGE = 1e-9;

interface TailBoundViewProps {
  title: string;
  config: InequalityBoundConfig;
}

/**
 * A moment bound against the exact tail it controls. Above, the
 * distribution with the event shaded: X >= a for Markov, |X - mu| >= k sigma
 * for Chebyshev, X - mu >= k sigma for Cantelli. Below, the exact
 * probability of the event and the bound as functions of the threshold: the
 * bound always lies above, and the gap shows how much it gives away by using
 * only the mean or the variance.
 */
export function TailBoundView({ title, config }: TailBoundViewProps) {
  const bound = config.cota ?? 'markov';
  const spec = DISTRIBUTION_SPECS[config.distribucion ?? 'exponencial'];
  const distribution = useMemo(
    () => spec.create(specValues(spec, config.parametros)),
    [spec, config.parametros],
  );
  const domain = plotWindow([distribution], spec.domain, spec.discrete);
  const mu = distribution.mean;
  const sigma = Math.sqrt(distribution.variance);
  const discrete = distribution.kind === 'discrete';
  const isMarkov = bound === 'markov';
  const range: [number, number] = isMarkov
    ? [Math.max(0.05, mu / 4), Math.max(domain[1], mu * 4)]
    : [K_MIN, K_MAX];
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'umbral',
        label: isMarkov ? 'Umbral a' : 'Distancia k en desviaciones estándar',
        symbol: isMarkov ? 'a' : 'k',
        min: Number(range[0].toFixed(2)),
        max: Number(range[1].toFixed(2)),
        step: isMarkov ? Number(((range[1] - range[0]) / 100).toPrecision(2)) : 0.05,
        digits: 2,
        default: config.umbral ?? (isMarkov ? 2 * mu : 2),
      },
    ],
    // The range derives from the configuration, which is fixed per figure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, isMarkov],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const level = values.umbral ?? range[0];
  const sweep = (range[1] - range[0]) / SWEEP_STEPS;
  const playback = usePlayback({
    step: () => parameters.set('umbral', Math.min(range[1], level + sweep)),
    reset: () => parameters.set('umbral', range[0]),
    rate: STEPS_PER_SECOND,
    done: level >= range[1] - sweep / 2,
    autoplay: false,
  });

  const upperTail = (x: number) => 1 - distribution.cdf(discrete ? Math.ceil(x - EDGE) - 1 : x);
  const lowerTail = (x: number) => distribution.cdf(discrete ? Math.floor(x + EDGE) : x);
  const exactOf = (v: number) => {
    if (isMarkov) return upperTail(v);
    if (bound === 'cantelli') return upperTail(mu + v * sigma);
    return Math.min(1, upperTail(mu + v * sigma) + lowerTail(mu - v * sigma));
  };
  const boundOf = (v: number) =>
    isMarkov ? markovBound(mu, v) : bound === 'cantelli' ? cantelliBound(1, v) : chebyshevBound(v);
  const exact = exactOf(level);
  const limit = boundOf(level);
  const inEvent = (x: number) =>
    isMarkov
      ? x >= level - EDGE
      : bound === 'cantelli'
        ? x - mu >= level * sigma - EDGE
        : Math.abs(x - mu) >= level * sigma - EDGE;
  const f = (v: number) => formatNumber(v, 3);
  const lv = formatNumber(level, 2);
  const header = isMarkov
    ? `P(X \\ge ${lv}) = ${f(exact)} \\;\\le\\; \\frac{\\mathbb{E}[X]}{${lv}} = \\frac{${f(mu)}}{${lv}} = ${f(limit)}`
    : bound === 'cantelli'
      ? `P(X - \\mu \\ge ${lv}\\,\\sigma) = ${f(exact)} \\;\\le\\; \\frac{1}{1 + ${lv}^2} = ${f(limit)}`
      : `P(|X - \\mu| \\ge ${lv}\\,\\sigma) = ${f(exact)} \\;\\le\\; \\frac{1}{${lv}^2} = ${f(limit)}`;
  const boundName = isMarkov ? 'Markov' : bound === 'cantelli' ? 'Cantelli' : 'Chebyshev';
  const description =
    `${config.nombre ?? spec.label} con media ${f(mu)} y desviación estándar ${f(sigma)}. ` +
    `Con ${isMarkov ? `a = ${lv}` : `k = ${lv}`}, la probabilidad exacta es ${f(exact)} y la cota de ${boundName} es ${f(limit)}.`;
  const markers = (
    isMarkov
      ? [
          { x: mu, label: `μ = ${formatNumber(mu, 2)}`, color: DATA_COLORS.text, dashed: true },
          { x: level, label: `a = ${lv}`, color: DATA_COLORS.secondary },
        ]
      : [
          { x: mu, label: 'μ', color: DATA_COLORS.text, dashed: true },
          { x: mu + level * sigma, label: 'μ + kσ', color: DATA_COLORS.secondary },
          ...(bound === 'chebyshev'
            ? [{ x: mu - level * sigma, label: 'μ - kσ', color: DATA_COLORS.secondary }]
            : []),
        ]
  ).filter((marker) => marker.x >= domain[0] && marker.x <= domain[1]);
  const curveXs = Array.from(
    { length: CURVE_POINTS + 1 },
    (_, i) => range[0] + ((range[1] - range[0]) * i) / CURVE_POINTS,
  );

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Probabilidad exacta', value: f(exact), color: DATA_COLORS.highlight },
        { label: `Cota de ${boundName}`, value: f(limit), color: DATA_COLORS.secondary },
        {
          label: 'Cociente cota / exacta',
          value: exact > 0 ? formatNumber(limit / exact, 2) : 'sin límite',
        },
        { label: 'Media μ', value: f(mu) },
        { label: 'Desviación estándar σ', value: f(sigma) },
      ]}
      legend={[
        { label: 'Evento acotado', color: DATA_COLORS.highlight },
        { label: 'Probabilidad exacta', color: DATA_COLORS.highlight, shape: 'line' },
        { label: `Cota de ${boundName}`, color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <TailChart
        distribution={distribution}
        domain={domain}
        inEvent={inEvent}
        markers={markers}
        label={description}
        xLabel="x"
      />
      <ChartSvg label={description} aspect={0.32} minHeight={200} maxHeight={280}>
        {(box) => {
          const x = scaleLinear()
            .domain(range)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, 1])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={4}
                label="probabilidad"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label={isMarkov ? 'a' : 'k'}
              />
              <CurvePath
                points={curveXs.map((v) => ({ x: v, y: boundOf(v) }))}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.secondary}
                width={2.5}
                animate={false}
              />
              <CurvePath
                points={curveXs.map((v) => ({ x: v, y: exactOf(v) }))}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.highlight}
                width={2.5}
                step={discrete && isMarkov}
                animate={false}
              />
              <g aria-hidden="true">
                <line
                  x1={x(level)}
                  x2={x(level)}
                  y1={y(exact)}
                  y2={y(limit)}
                  stroke={DATA_COLORS.text}
                  strokeDasharray="3 3"
                />
                <circle cx={x(level)} cy={y(exact)} r={5} fill={DATA_COLORS.highlight} />
                <circle cx={x(level)} cy={y(limit)} r={5} fill={DATA_COLORS.secondary} />
              </g>
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Arriba, el evento cuya probabilidad se acota. Abajo, la probabilidad exacta y la cota en
        función del umbral: la cota nunca queda por debajo, y la distancia entre ambas es el precio
        de usar solo {isMarkov ? 'la media' : 'la media y la varianza'}.
      </p>
    </VizFrame>
  );
}
