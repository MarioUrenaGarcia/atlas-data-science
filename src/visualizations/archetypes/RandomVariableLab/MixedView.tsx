import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
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
import styles from './RandomVariableLab.module.css';
import type { RandomVariableLabConfig } from './schema.ts';
import { niceStep } from './source.ts';

const SWEEP_STEPS = 60;
const STEPS_PER_SECOND = 8;
const CURVE_POINTS = 200;

interface MixedViewProps {
  title: string;
  config: RandomVariableLabConfig;
}

/**
 * A mixed distribution: point masses p_i at values x_i plus a density part
 * of total weight w = 1 - sum p_i. The upper chart draws the weighted density
 * w f(x) and the atoms as spikes labeled with their probability; the lower
 * chart is the distribution function, continuous where only density lives
 * and with a jump of size p_i at each atom.
 */
export function MixedView({ title, config }: MixedViewProps) {
  const spec = DISTRIBUTION_SPECS[config.distribucion ?? 'exponencial'];
  const continuous = useMemo(
    () => spec.create(specValues(spec, config.parametros)),
    [spec, config.parametros],
  );
  const atoms = useMemo(
    () => [...(config.atomos ?? [])].sort((left, right) => left.x - right.x),
    [config.atomos],
  );
  const atomMass = atoms.reduce((total, atom) => total + atom.p, 0);
  const weight = Math.max(0, 1 - atomMass);
  const [w0, w1] = plotWindow([continuous], spec.domain, false);
  const xs = atoms.map((atom) => atom.x);
  const pad = (w1 - w0) * 0.08;
  const d0 = Math.min(w0, Math.min(...xs) - pad);
  const d1 = Math.max(w1, Math.max(...xs) + pad);
  const step = niceStep(d1 - d0);
  const sweepStep = (d1 - d0) / SWEEP_STEPS;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'x',
        label: 'Punto x',
        symbol: 'x',
        min: Number(d0.toFixed(2)),
        max: Number(d1.toFixed(2)),
        step,
        digits: 2,
        default: config.x ?? (d0 + d1) / 2,
      },
    ],
    [d0, d1, step, config.x],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const x = values.x ?? 0;
  const playback = usePlayback({
    step: () => parameters.set('x', Math.min(d1, x + sweepStep)),
    reset: () => parameters.set('x', d0),
    rate: STEPS_PER_SECOND,
    done: x >= d1 - sweepStep / 2,
    autoplay: false,
  });

  const pdf = (t: number) => (continuous.kind === 'continuous' ? continuous.pdf(t) : 0);
  const atomsBelow = atoms.filter((atom) => atom.x <= x + 1e-9);
  const jumpPart = atomsBelow.reduce((total, atom) => total + atom.p, 0);
  const densityPart = weight * continuous.cdf(x);
  const F = jumpPart + densityPart;
  const atomHere = atoms.find((atom) => Math.abs(atom.x - x) < step / 2);
  const mean = atoms.reduce((total, atom) => total + atom.p * atom.x, 0) + weight * continuous.mean;
  const f = (value: number, digits = 3) => formatNumber(value, digits);
  const header =
    `F(${f(x, 2)}) = \\underbrace{${atomsBelow.length > 0 ? atomsBelow.map((atom) => f(atom.p)).join(' + ') : '0'}}_{\\text{saltos}}` +
    ` + \\underbrace{${f(weight)} \\cdot ${f(continuous.cdf(x))}}_{\\text{parte continua}} = ${f(F, 4)}`;
  const description =
    `Distribución mixta: masas puntuales ${atoms.map((atom) => `${f(atom.p)} en ${f(atom.x, 2)}`).join(', ')} ` +
    `y una parte continua ${spec.label.toLowerCase()} con peso ${f(weight)}. ` +
    `En x = ${f(x, 2)}, F(x) = ${f(F, 4)}. Media ${f(mean)}.`;
  const curveXs = Array.from(
    { length: CURVE_POINTS + 1 },
    (_, i) => d0 + ((d1 - d0) * i) / CURVE_POINTS,
  );
  const densityTop = Math.max(...curveXs.map((t) => weight * pdf(t)).filter(Number.isFinite), 0.05);
  const spikeTop = Math.max(...atoms.map((atom) => atom.p));

  // The distribution function is drawn in pieces between atoms so the jumps stay vertical gaps.
  const breaks = [d0, ...xs.filter((value) => value > d0 && value < d1), d1];
  const pieces = breaks.slice(0, -1).map((start, index) => {
    const end = breaks[index + 1] ?? d1;
    return Array.from({ length: 41 }, (_, i) => {
      const t = start + ((end - start) * i) / 40;
      const jumps = atoms
        .filter((atom) => (i === 40 ? atom.x < end : atom.x <= t))
        .reduce((total, atom) => total + atom.p, 0);
      return { x: t, y: jumps + weight * continuous.cdf(t) };
    });
  });

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'F(x)', value: f(F, 4), color: DATA_COLORS.primary },
        { label: 'Saltos hasta x', value: f(jumpPart, 4), color: DATA_COLORS.highlight },
        { label: 'Parte continua hasta x', value: f(densityPart, 4), color: DATA_COLORS.secondary },
        { label: 'P(X = x)', value: f(atomHere?.p ?? 0, 4) },
        { label: 'Peso de la parte continua', value: f(weight) },
        { label: 'Media E[X]', value: f(mean) },
      ]}
      legend={[
        { label: 'Masa puntual', color: DATA_COLORS.highlight, shape: 'circle' },
        { label: 'Densidad ponderada', color: DATA_COLORS.secondary },
        { label: 'Función de distribución', color: DATA_COLORS.text, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <ChartSvg label={description} aspect={0.34} minHeight={190} maxHeight={280}>
        {(box) => {
          const sx = scaleLinear()
            .domain([d0, d1])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const sy = scaleLinear()
            .domain([0, densityTop * 1.7])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          // Spikes use their own scale: a probability is not a density, so the spike height
          // only ranks the atoms and the label carries the value.
          const spikeHeight = (p: number) => (box.inner.height * 0.92 * p) / spikeTop;
          const bottom = box.inner.top + box.inner.height;
          const left = curveXs.filter((t) => t <= x).map((t) => ({ x: t, y: weight * pdf(t) }));
          return (
            <>
              <Axis
                scale={sy}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={4}
                label="w f(x)"
              />
              <Axis scale={sx} orientation="bottom" position={bottom} ticks={6} label="x" />
              <CurvePath
                points={curveXs.map((t) => ({ x: t, y: weight * pdf(t) }))}
                xScale={sx}
                yScale={sy}
                color={DATA_COLORS.secondary}
                fill
                fillOpacity={0.15}
                animate={false}
              />
              {left.length > 1 && (
                <CurvePath
                  points={left}
                  xScale={sx}
                  yScale={sy}
                  color={DATA_COLORS.secondary}
                  fill
                  fillOpacity={0.45}
                  animate={false}
                />
              )}
              <g aria-hidden="true">
                {atoms.map((atom) => {
                  const active = atom.x <= x + 1e-9;
                  const top = bottom - spikeHeight(atom.p);
                  return (
                    <g key={atom.x} opacity={active ? 1 : 0.45}>
                      <line
                        x1={sx(atom.x)}
                        x2={sx(atom.x)}
                        y1={bottom}
                        y2={top}
                        stroke={DATA_COLORS.highlight}
                        strokeWidth={3}
                      />
                      <circle cx={sx(atom.x)} cy={top} r={5.5} fill={DATA_COLORS.highlight} />
                      <text
                        x={sx(atom.x) + 8}
                        y={top + 4}
                        fontSize={12}
                        fill={DATA_COLORS.text}
                      >{`P = ${f(atom.p)}`}</text>
                    </g>
                  );
                })}
                <line
                  x1={sx(x)}
                  x2={sx(x)}
                  y1={box.inner.top}
                  y2={bottom}
                  stroke={DATA_COLORS.text}
                  strokeDasharray="4 4"
                />
              </g>
            </>
          );
        }}
      </ChartSvg>
      <ChartSvg label={description} aspect={0.34} minHeight={180} maxHeight={280}>
        {(box) => {
          const sx = scaleLinear()
            .domain([d0, d1])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const sy = scaleLinear()
            .domain([0, 1])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <>
              <Axis
                scale={sy}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={4}
                label="F(x)"
              />
              <Axis
                scale={sx}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="x"
              />
              {pieces.map((piece, index) => (
                <CurvePath
                  key={index}
                  points={piece}
                  xScale={sx}
                  yScale={sy}
                  color={DATA_COLORS.text}
                  animate={false}
                />
              ))}
              <g aria-hidden="true">
                {atoms.map((atom) => {
                  const before = atoms
                    .filter((other) => other.x < atom.x)
                    .reduce((total, other) => total + other.p, 0);
                  const below = before + weight * continuous.cdf(atom.x);
                  return (
                    <g key={atom.x}>
                      <line
                        x1={sx(atom.x)}
                        x2={sx(atom.x)}
                        y1={sy(below)}
                        y2={sy(below + atom.p)}
                        stroke={DATA_COLORS.highlight}
                        strokeWidth={2}
                        strokeDasharray="3 3"
                      />
                      <circle
                        cx={sx(atom.x)}
                        cy={sy(below)}
                        r={4}
                        fill="var(--color-surface)"
                        stroke={DATA_COLORS.text}
                      />
                      <circle
                        cx={sx(atom.x)}
                        cy={sy(below + atom.p)}
                        r={4}
                        fill={DATA_COLORS.text}
                      />
                    </g>
                  );
                })}
                <line
                  x1={sx(x)}
                  x2={sx(x)}
                  y1={sy(0)}
                  y2={sy(F)}
                  stroke={DATA_COLORS.primary}
                  strokeWidth={2.5}
                />
                <circle cx={sx(x)} cy={sy(F)} r={6} fill={DATA_COLORS.primary} />
              </g>
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Cada masa puntual produce un salto de la función de distribución igual a su probabilidad;
        entre saltos, F crece de manera continua con el área de la densidad ponderada.
      </p>
    </VizFrame>
  );
}
