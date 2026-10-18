import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import { gammaFunction } from '../../../lib/distributions/special.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './InequalityBound.module.css';
import type { InequalityBoundConfig } from './schema.ts';

const CURVE_POINTS = 160;
const RHO_LIMIT = 0.99;
const P_MIN = 1.05;
const P_MAX = 8;
const SWEEP_STEPS = 60;
const STEPS_PER_SECOND = 10;

/** E|Z|^r for a standard normal Z. */
function normalAbsoluteMoment(r: number): number {
  return (2 ** (r / 2) * gammaFunction((r + 1) / 2)) / Math.sqrt(Math.PI);
}

/** E|XY| for a standard bivariate normal pair with correlation rho. */
function meanAbsoluteProduct(rho: number): number {
  return (2 / Math.PI) * (Math.sqrt(1 - rho * rho) + rho * Math.asin(rho));
}

/** Hölder bound (E|X|^p)^(1/p) (E|Y|^q)^(1/q) with 1/p + 1/q = 1, for standard normals. */
function holderBound(p: number): number {
  const q = p / (p - 1);
  return normalAbsoluteMoment(p) ** (1 / p) * normalAbsoluteMoment(q) ** (1 / q);
}

interface HolderViewProps {
  title: string;
  config: InequalityBoundConfig;
}

/**
 * The Cauchy and Schwarz inequality and its generalization by Hölder for a
 * standard normal pair with correlation rho. The first chart traces |E[XY]|
 * and E|XY| as rho moves, always below the Cauchy and Schwarz bound
 * sqrt(E[X^2] E[Y^2]) = 1, with equality only when Y = X or Y = -X. With an
 * exponent p, the second chart shows the Hölder bound for every pair of
 * conjugate exponents: all of them hold, and p = q = 2 is the tightest one
 * for normal variables.
 */
export function HolderView({ title, config }: HolderViewProps) {
  const holder = config.exponente !== undefined;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'rho',
        label: 'Correlación',
        symbol: 'ρ',
        min: -RHO_LIMIT,
        max: RHO_LIMIT,
        step: 0.01,
        digits: 2,
        default: config.rho ?? 0.5,
      },
      ...(holder
        ? [
            {
              type: 'number' as const,
              key: 'p',
              label: 'Exponente p',
              symbol: 'p',
              min: P_MIN,
              max: P_MAX,
              step: 0.05,
              digits: 2,
              default: config.exponente ?? 3,
            },
          ]
        : []),
    ],
    [config.rho, config.exponente, holder],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const rho = values.rho ?? 0.5;
  const p = values.p ?? 2;
  const q = p / (p - 1);
  const sweepKey = holder ? 'p' : 'rho';
  const [s0, s1] = holder ? [P_MIN, P_MAX] : [-RHO_LIMIT, RHO_LIMIT];
  const current = holder ? p : rho;
  const sweep = (s1 - s0) / SWEEP_STEPS;
  const playback = usePlayback({
    step: () => parameters.set(sweepKey, Math.min(s1, current + sweep)),
    reset: () => parameters.set(sweepKey, s0),
    rate: STEPS_PER_SECOND,
    done: current >= s1 - sweep / 2,
    autoplay: false,
  });
  const absMean = meanAbsoluteProduct(rho);
  const bound = holderBound(p);
  const f = (v: number) => formatNumber(v, 3);
  const header = holder
    ? `\\mathbb{E}|XY| = ${f(absMean)} \\;\\le\\; \\big(\\mathbb{E}|X|^{${formatNumber(p, 2)}}\\big)^{1/${formatNumber(p, 2)}} \\big(\\mathbb{E}|Y|^{${formatNumber(q, 2)}}\\big)^{1/${formatNumber(q, 2)}} = ${f(bound)}`
    : `|\\mathbb{E}[XY]| = |${formatNumber(rho, 2)}| \\;\\le\\; \\mathbb{E}|XY| = ${f(absMean)} \\;\\le\\; \\sqrt{\\mathbb{E}[X^2]\\,\\mathbb{E}[Y^2]} = 1`;
  const description =
    `Par normal estándar con correlación ${formatNumber(rho, 2)}: E[XY] = ${f(rho)}, E|XY| = ${f(absMean)}. ` +
    (holder
      ? `Cota de Hölder con p = ${formatNumber(p, 2)} y q = ${formatNumber(q, 2)}: ${f(bound)}.`
      : 'Cota de Cauchy y Schwarz: 1.');
  const rhos = Array.from(
    { length: CURVE_POINTS + 1 },
    (_, i) => -RHO_LIMIT + (2 * RHO_LIMIT * i) / CURVE_POINTS,
  );
  const ps = Array.from(
    { length: CURVE_POINTS + 1 },
    (_, i) => P_MIN + ((P_MAX - P_MIN) * i) / CURVE_POINTS,
  );

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'E[XY] = ρ', value: f(rho), color: DATA_COLORS.primary },
        { label: 'E|XY|', value: f(absMean), color: DATA_COLORS.highlight },
        ...(holder
          ? [
              { label: 'Exponentes p, q', value: `${formatNumber(p, 2)}, ${formatNumber(q, 2)}` },
              { label: 'Cota de Hölder', value: f(bound), color: DATA_COLORS.secondary },
            ]
          : [{ label: 'Cota de Cauchy y Schwarz', value: '1', color: DATA_COLORS.secondary }]),
      ]}
      legend={[
        { label: '|E[XY]|', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'E|XY|', color: DATA_COLORS.highlight, shape: 'line' },
        {
          label: holder ? 'Cota de Hölder' : 'Cota de Cauchy y Schwarz',
          color: DATA_COLORS.secondary,
          shape: 'line',
        },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <div className={styles.panels}>
        <ChartSvg label={description} aspect={0.7} minHeight={240} maxHeight={340}>
          {(box) => {
            const x = scaleLinear()
              .domain([-1, 1])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const y = scaleLinear()
              .domain([0, 1.15])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            return (
              <>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={5}
                  label="ρ"
                />
                <CurvePath
                  points={rhos.map((r) => ({ x: r, y: 1 }))}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.secondary}
                  width={2.5}
                  dashed
                  animate={false}
                />
                <CurvePath
                  points={rhos.map((r) => ({ x: r, y: meanAbsoluteProduct(r) }))}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.highlight}
                  width={2.5}
                  animate={false}
                />
                <CurvePath
                  points={rhos.map((r) => ({ x: r, y: Math.abs(r) }))}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.primary}
                  width={2.5}
                  animate={false}
                />
                <g aria-hidden="true">
                  <line
                    x1={x(rho)}
                    x2={x(rho)}
                    y1={box.inner.top}
                    y2={box.inner.top + box.inner.height}
                    stroke={DATA_COLORS.muted}
                    strokeDasharray="3 3"
                  />
                  <circle cx={x(rho)} cy={y(absMean)} r={5} fill={DATA_COLORS.highlight} />
                  <circle cx={x(rho)} cy={y(Math.abs(rho))} r={5} fill={DATA_COLORS.primary} />
                </g>
              </>
            );
          }}
        </ChartSvg>
        {holder && (
          <ChartSvg label={description} aspect={0.7} minHeight={240} maxHeight={340}>
            {(box) => {
              const bounds = ps.map(holderBound);
              const x = scaleLinear()
                .domain([1, P_MAX])
                .range([box.inner.left, box.inner.left + box.inner.width]);
              const y = scaleLinear()
                .domain([0, Math.max(1.2, ...bounds) * 1.05])
                .range([box.inner.top + box.inner.height, box.inner.top]);
              return (
                <>
                  <Axis
                    scale={y}
                    orientation="left"
                    position={box.inner.left}
                    gridLength={box.inner.width}
                    ticks={5}
                  />
                  <Axis
                    scale={x}
                    orientation="bottom"
                    position={box.inner.top + box.inner.height}
                    ticks={6}
                    label="p"
                  />
                  <CurvePath
                    points={ps.map((v, i) => ({ x: v, y: bounds[i] ?? 0 }))}
                    xScale={x}
                    yScale={y}
                    color={DATA_COLORS.secondary}
                    width={2.5}
                    animate={false}
                  />
                  <CurvePath
                    points={ps.map((v) => ({ x: v, y: absMean }))}
                    xScale={x}
                    yScale={y}
                    color={DATA_COLORS.highlight}
                    width={2}
                    dashed
                    animate={false}
                  />
                  <g aria-hidden="true">
                    <circle cx={x(p)} cy={y(bound)} r={5} fill={DATA_COLORS.secondary} />
                    <line
                      x1={x(2)}
                      x2={x(2)}
                      y1={box.inner.top}
                      y2={box.inner.top + box.inner.height}
                      stroke={DATA_COLORS.muted}
                      strokeDasharray="3 3"
                    />
                  </g>
                </>
              );
            }}
          </ChartSvg>
        )}
      </div>
      <p className={styles.caption}>
        {holder
          ? 'Cada exponente p da una cota válida; para normales la más ajustada es p = 2, la de Cauchy y Schwarz. La línea punteada es el valor exacto de E|XY|.'
          : 'Ninguna curva pasa la línea de la cota. Solo en ρ = ±1, cuando Y = ±X, |E[XY]| alcanza la cota y la desigualdad es igualdad.'}
      </p>
    </VizFrame>
  );
}
