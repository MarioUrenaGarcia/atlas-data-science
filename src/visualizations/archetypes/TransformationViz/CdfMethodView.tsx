import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import { sublevelIntervals, transformedCdf } from '../../../lib/probability/transform.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { TransformationVizConfig } from './schema.ts';
import { setupTransformation } from './setup.ts';
import styles from './TransformationViz.module.css';

const CURVE_POINTS = 200;
const SWEEP_STEPS = 60;
const STEPS_PER_SECOND = 8;

interface CdfMethodViewProps {
  title: string;
  config: TransformationVizConfig;
}

/**
 * The CDF method for Y = g(X): for each threshold y, the set of x with
 * g(x) <= y is found on the graph of g and its probability under X is the
 * value F_Y(y). The sweep moves y and traces the whole distribution function
 * of Y, whose derivative is the density of Y.
 */
export function CdfMethodView({ title, config }: CdfMethodViewProps) {
  const setup = setupTransformation(config);
  const { x: X, transform, xDomain, yDomain } = setup;
  const ySpan = yDomain[1] - yDomain[0];
  const step = Number((ySpan / 100).toPrecision(1));
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'y',
        label: 'Umbral y',
        symbol: 'y',
        min: Number(yDomain[0].toFixed(2)),
        max: Number(yDomain[1].toFixed(2)),
        step,
        digits: 2,
        default: config.y ?? Number((yDomain[0] + ySpan / 3).toFixed(2)),
      },
    ],
    // The window depends only on the configuration of the figure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const y = values.y ?? 0;
  const sweep = ySpan / SWEEP_STEPS;
  const playback = usePlayback({
    step: () => parameters.set('y', Math.min(yDomain[1], y + sweep)),
    reset: () => parameters.set('y', yDomain[0]),
    rate: STEPS_PER_SECOND,
    done: y >= yDomain[1] - sweep / 2,
    autoplay: false,
  });

  const [x0, x1] = xDomain;
  const intervals = sublevelIntervals(transform, y, x0, x1);
  const Fy = transformedCdf((t) => X.cdf(t), transform, y, x0, x1);
  const f = (v: number) => formatNumber(v, 3);
  const pieces = intervals.map(([a, b]) => `F_X(${f(b)}) - F_X(${f(a)})`).join(' + ');
  const header =
    intervals.length === 0
      ? `F_Y(${f(y)}) = P(g(X) \\le ${f(y)}) = 0`
      : `F_Y(${f(y)}) = P(${transform.tex.replace(/x/g, 'X')} \\le ${f(y)}) = ${pieces} = ${formatNumber(Fy, 4)}`;
  const description =
    `X con distribución ${setup.label}; Y = g(X) con g(x) = ${transform.tex}. Para y = ${f(y)}, el conjunto donde g(x) es menor o igual que y es ` +
    `${intervals.map(([a, b]) => `[${f(a)}, ${f(b)}]`).join(' y ') || 'vacío'}, con probabilidad ${formatNumber(Fy, 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Umbral y', value: f(y) },
        { label: 'F_Y(y)', value: formatNumber(Fy, 4), color: DATA_COLORS.primary },
        {
          label: 'Conjunto {g(x) ≤ y}',
          value:
            intervals
              .map(([a, b]) => `[${formatNumber(a, 2)}, ${formatNumber(b, 2)}]`)
              .join(' y ') || 'vacío',
        },
      ]}
      legend={[
        { label: 'g(x)', color: DATA_COLORS.text, shape: 'line' },
        { label: 'x con g(x) ≤ y', color: DATA_COLORS.primary },
        { label: 'F_Y(y)', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <div className={styles.panels}>
        <ChartSvg label={description} aspect={0.8} minHeight={220} maxHeight={320}>
          {(box) => {
            const sx = scaleLinear()
              .domain(xDomain)
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const sy = scaleLinear()
              .domain(yDomain)
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const curve = Array.from({ length: CURVE_POINTS + 1 }, (_, i) => {
              const t = x0 + ((x1 - x0) * i) / CURVE_POINTS;
              return { x: t, y: Math.min(yDomain[1], Math.max(yDomain[0], transform.g(t))) };
            }).filter((p) => Number.isFinite(p.y));
            return (
              <>
                <Axis
                  scale={sy}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="y = g(x)"
                />
                <Axis
                  scale={sx}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={5}
                  label="x"
                />
                <g aria-hidden="true">
                  {intervals.map(([a, b], i) => (
                    <rect
                      key={i}
                      x={sx(a)}
                      y={box.inner.top}
                      width={Math.max(0, sx(b) - sx(a))}
                      height={box.inner.height}
                      fill={DATA_COLORS.primary}
                      fillOpacity={0.15}
                    />
                  ))}
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={sy(y)}
                    y2={sy(y)}
                    stroke={DATA_COLORS.secondary}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                  />
                </g>
                <CurvePath
                  points={curve}
                  xScale={sx}
                  yScale={sy}
                  color={DATA_COLORS.text}
                  animate={false}
                />
              </>
            );
          }}
        </ChartSvg>
        <ChartSvg label={description} aspect={0.8} minHeight={220} maxHeight={320}>
          {(box) => {
            const sx = scaleLinear()
              .domain(xDomain)
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const peak = Math.max(
              ...Array.from({ length: CURVE_POINTS + 1 }, (_, i) =>
                X.pdf(x0 + ((x1 - x0) * i) / CURVE_POINTS),
              ).filter(Number.isFinite),
            );
            const sy = scaleLinear()
              .domain([0, peak * 1.15])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const density = Array.from({ length: CURVE_POINTS + 1 }, (_, i) => {
              const t = x0 + ((x1 - x0) * i) / CURVE_POINTS;
              return { x: t, y: Math.min(peak * 1.15, X.pdf(t)) };
            });
            return (
              <>
                <Axis
                  scale={sy}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={4}
                  label="densidad de X"
                />
                <Axis
                  scale={sx}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={5}
                  label="x"
                />
                {intervals.map(([a, b], i) => (
                  <CurvePath
                    key={i}
                    points={density.filter((p) => p.x >= a && p.x <= b)}
                    xScale={sx}
                    yScale={sy}
                    color={DATA_COLORS.primary}
                    fill
                    fillOpacity={0.45}
                    animate={false}
                  />
                ))}
                <CurvePath
                  points={density}
                  xScale={sx}
                  yScale={sy}
                  color={DATA_COLORS.text}
                  animate={false}
                />
              </>
            );
          }}
        </ChartSvg>
      </div>
      <ChartSvg label={description} aspect={0.32} minHeight={170} maxHeight={260}>
        {(box) => {
          const sx = scaleLinear()
            .domain(yDomain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const sy = scaleLinear()
            .domain([0, 1])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const traced = Array.from(
            { length: CURVE_POINTS + 1 },
            (_, i) => yDomain[0] + (ySpan * i) / CURVE_POINTS,
          )
            .filter((t) => t <= y)
            .map((t) => ({ x: t, y: transformedCdf((v) => X.cdf(v), transform, t, x0, x1) }));
          return (
            <>
              <Axis
                scale={sy}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={4}
                label="F_Y(y)"
              />
              <Axis
                scale={sx}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="y"
              />
              {traced.length > 1 && (
                <CurvePath
                  points={traced}
                  xScale={sx}
                  yScale={sy}
                  color={DATA_COLORS.secondary}
                  animate={false}
                />
              )}
              <circle
                cx={sx(y)}
                cy={sy(Fy)}
                r={5}
                fill={DATA_COLORS.secondary}
                aria-hidden="true"
              />
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Arriba a la izquierda, la línea punteada es el umbral y sobre la gráfica de g; las franjas
        marcan las x con g(x) ≤ y. A la derecha, esas mismas x en la densidad de X: su área es
        F_Y(y). Abajo, la función de distribución de Y que se traza al mover y.
      </p>
    </VizFrame>
  );
}
