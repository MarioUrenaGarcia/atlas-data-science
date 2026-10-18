import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { COPULA_INFO, empiricalTail, tailDependence } from '../../../lib/probability/copula.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CopulaViz.module.css';
import { PairScatter } from './PairScatter.tsx';
import type { CopulaVizConfig } from './schema.ts';
import { useCopulaSample } from './useCopulaSample.ts';

const CURVE_FROM = 0.5;
const CURVE_TO = 0.98;
const CURVE_POINTS = 25;
/** Corners with fewer pairs than this give estimates too noisy to draw. */
const MIN_IN_CORNER = 15;

interface TailViewProps {
  title: string;
  conceptId: string;
  config: CopulaVizConfig;
}

/**
 * Tail dependence: among the pairs where U lands in its top fraction 1 - q,
 * the share where V also does. As q approaches 1 this conditional
 * probability tends to the upper tail coefficient: zero for the Gaussian and
 * Frank copulas, positive for Gumbel. The lower corner does the same for
 * joint small values, where Clayton has dependence. The right chart traces
 * both estimates against q next to the theoretical limits.
 */
export function TailView({ title, conceptId, config }: TailViewProps) {
  const extra = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'q',
        label: 'Umbral de cola',
        symbol: 'q',
        min: 0.5,
        max: 0.99,
        step: 0.01,
        digits: 2,
        default: config.q ?? 0.9,
      },
    ],
    [config.q],
  );
  const { family, tau, theta, pairs, playback, seed, parameters, values } = useCopulaSample(
    config,
    conceptId,
    extra,
  );
  const q = Number(values.q ?? 0.9);
  const tails = tailDependence(family, theta);
  const upperIn = pairs.filter(([u]) => u > q);
  const upperBoth = upperIn.filter(([, v]) => v > q).length;
  const lowerIn = pairs.filter(([u]) => u <= 1 - q);
  const lowerBoth = lowerIn.filter(([, v]) => v <= 1 - q).length;
  const upper = upperIn.length > 0 ? upperBoth / upperIn.length : 0;
  const lower = lowerIn.length > 0 ? lowerBoth / lowerIn.length : 0;
  const curve = (side: 'upper' | 'lower') =>
    Array.from(
      { length: CURVE_POINTS },
      (_, k) => CURVE_FROM + ((CURVE_TO - CURVE_FROM) * k) / (CURVE_POINTS - 1),
    )
      .filter(
        (level) =>
          pairs.filter(([u]) => (side === 'upper' ? u > level : u <= 1 - level)).length >=
          MIN_IN_CORNER,
      )
      .map((level) => ({ x: level, y: empiricalTail(pairs, level, side) }));
  const f = (v: number) => formatNumber(v, 3);
  const qText = formatNumber(q, 2);
  const header =
    upperIn.length > 0
      ? `P(V > ${qText} \\mid U > ${qText}) \\approx \\frac{${upperBoth}}{${upperIn.length}} = ${f(upper)}, \\qquad \\lambda_U = ${f(tails.upper)}`
      : `\\lambda_U = \\lim_{q \\to 1} P(V > q \\mid U > q)`;
  const description =
    `Cópula ${COPULA_INFO[family].label.toLowerCase()} con tau ${f(tau)}. Con q = ${qText}: ` +
    `P(V > q | U > q) ≈ ${f(upper)} y P(V ≤ 1 - q | U ≤ 1 - q) ≈ ${f(lower)}. ` +
    `Coeficientes teóricos: superior ${f(tails.upper)}, inferior ${f(tails.lower)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Pares simulados', value: String(pairs.length) },
        { label: 'P(V > q | U > q)', value: f(upper), color: DATA_COLORS.highlight },
        { label: 'P(V ≤ 1-q | U ≤ 1-q)', value: f(lower), color: DATA_COLORS.secondary },
        { label: 'Coeficiente superior λU', value: f(tails.upper) },
        { label: 'Coeficiente inferior λL', value: f(tails.lower) },
      ]}
      legend={[
        { label: 'Esquina superior', color: DATA_COLORS.highlight },
        { label: 'Esquina inferior', color: DATA_COLORS.secondary },
        { label: 'Límite teórico', color: DATA_COLORS.text, shape: 'dashed' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <div className={styles.panels}>
        <PairScatter
          points={pairs}
          xDomain={[0, 1]}
          yDomain={[0, 1]}
          xLabel="u"
          yLabel="v"
          label={description}
          showMarginals={false}
          maxHeight={340}
          color={(k) => {
            const [u = 0, v = 0] = pairs[k] ?? [];
            if (u > q && v > q) return DATA_COLORS.highlight;
            if (u <= 1 - q && v <= 1 - q) return DATA_COLORS.secondary;
            return DATA_COLORS.neutral;
          }}
          underlay={({ x, y }) => (
            <g aria-hidden="true">
              <rect
                x={x(q)}
                y={y(1)}
                width={x(1) - x(q)}
                height={y(q) - y(1)}
                fill={DATA_COLORS.highlight}
                fillOpacity={0.15}
              />
              <rect
                x={x(0)}
                y={y(1 - q)}
                width={x(1 - q) - x(0)}
                height={y(0) - y(1 - q)}
                fill={DATA_COLORS.secondary}
                fillOpacity={0.15}
              />
            </g>
          )}
        />
        <ChartSvg label={description} aspect={0.9} minHeight={240} maxHeight={340}>
          {(box) => {
            const x = scaleLinear()
              .domain([CURVE_FROM, 1])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const y = scaleLinear()
              .domain([0, 1])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const upperCurve = curve('upper');
            const lowerCurve = curve('lower');
            return (
              <>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="probabilidad condicional"
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={5}
                  label="q"
                />
                {upperCurve.length > 1 && (
                  <CurvePath
                    points={upperCurve}
                    xScale={x}
                    yScale={y}
                    color={DATA_COLORS.highlight}
                    width={2.2}
                    animate={false}
                  />
                )}
                {lowerCurve.length > 1 && (
                  <CurvePath
                    points={lowerCurve}
                    xScale={x}
                    yScale={y}
                    color={DATA_COLORS.secondary}
                    width={2.2}
                    animate={false}
                  />
                )}
                <g aria-hidden="true">
                  {[tails.upper, tails.lower].map((value, k) => (
                    <line
                      key={k}
                      x1={box.inner.left}
                      x2={box.inner.left + box.inner.width}
                      y1={y(value)}
                      y2={y(value)}
                      stroke={k === 0 ? DATA_COLORS.highlight : DATA_COLORS.secondary}
                      strokeDasharray="6 4"
                    />
                  ))}
                  <line
                    x1={x(q)}
                    x2={x(q)}
                    y1={box.inner.top}
                    y2={box.inner.top + box.inner.height}
                    stroke={DATA_COLORS.text}
                    strokeDasharray="3 3"
                  />
                </g>
              </>
            );
          }}
        </ChartSvg>
      </div>
      <p className={styles.caption}>
        Las esquinas sombreadas contienen los pares donde ambas coordenadas son extremas. Si la
        fracción de la derecha no baja a cero cuando q se acerca a 1, los valores extremos tienden a
        ocurrir juntos.
      </p>
    </VizFrame>
  );
}
