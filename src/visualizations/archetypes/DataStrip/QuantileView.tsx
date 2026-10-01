import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { QUANTILE_METHODS } from '../../../lib/stats/dispersion.ts';
import { quantile, sorted, type QuantileMethod } from '../../../lib/stats/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataStrip.module.css';
import { METHOD_NAMES, quantileFormula } from './quantileFormulas.ts';

export type QuantileFamily = 'cuantil' | 'cuartiles' | 'deciles' | 'percentiles';

const FAMILY_PROBABILITIES: Record<Exclude<QuantileFamily, 'cuantil' | 'percentiles'>, number[]> = {
  cuartiles: [0.25, 0.5, 0.75],
  deciles: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
};
const SWEEP = [0.05, 0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9, 0.95];
const STEPS_PER_SECOND = 0.8;
const DOT_RADIUS = 5;
const DOMAIN_PADDING = 0.06;

interface QuantileViewProps {
  title: string;
  data: readonly number[];
  p: number;
  family: QuantileFamily;
  method: QuantileMethod;
  compareMethods: boolean;
  variable: string;
  unit: string;
  decimals: number;
}

/**
 * The empirical distribution function as a staircase. A quantile is read by
 * going across at height p until the staircase and then down to the axis;
 * the header shows which order statistics are interpolated.
 */
export function QuantileView(props: QuantileViewProps) {
  const { title, data, family, compareMethods, variable, unit, decimals } = props;
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(family === 'cuantil' || family === 'percentiles'
        ? [
            {
              type: 'number' as const,
              key: 'p',
              label: 'Probabilidad acumulada',
              symbol: 'p',
              min: 0.01,
              max: 0.99,
              step: 0.01,
              default: props.p,
              digits: 2,
            },
          ]
        : []),
      {
        type: 'select',
        key: 'metodo',
        label: 'Método de cálculo',
        options: QUANTILE_METHODS.map((method) => ({
          value: String(method),
          label: METHOD_NAMES[method],
        })),
        default: String(props.method),
      },
    ],
    [family, props.p, props.method],
  );
  const parameters = useParameters(definitions);
  const method = Number(parameters.values.metodo) as QuantileMethod;
  const marks =
    family === 'cuartiles' || family === 'deciles' ? FAMILY_PROBABILITIES[family] : SWEEP;
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(reducedMotion ? marks.length : 0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(marks.length, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= marks.length,
  });
  const sweeping = (family === 'cuantil' || family === 'percentiles') && step < marks.length;
  const p = sweeping
    ? (marks[step] ?? 0.5)
    : Number(parameters.values.p ?? marks[Math.max(0, step - 1)] ?? 0.5);
  const shown = family === 'cuartiles' || family === 'deciles' ? marks.slice(0, step) : [p];
  const current = shown[shown.length - 1] ?? p;
  const x = sorted(data);
  const n = x.length;
  const lo = Math.min(...x);
  const hi = Math.max(...x);
  const pad = (hi - lo) * DOMAIN_PADDING || 1;
  const name = (prob: number) =>
    family === 'cuartiles'
      ? `Q${Math.round(prob * 4)}`
      : family === 'deciles'
        ? `D${Math.round(prob * 10)}`
        : family === 'percentiles'
          ? `P${Math.round(prob * 100)}`
          : `Q(${formatNumber(prob, 2)})`;
  const description =
    `${n} datos de ${variable}. ` +
    shown
      .map((prob) => `${name(prob)} = ${formatNumber(quantile(data, prob, method), decimals + 2)}`)
      .join('; ') +
    `. Método tipo ${method}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Número de datos', value: String(n) },
        ...shown.map((prob, i) => ({
          label: `${name(prob)} (p = ${formatNumber(prob, 2)})`,
          value: `${formatNumber(quantile(data, prob, method), decimals + 2)}${unit ? ` ${unit}` : ''}`,
          color: seriesColor(i),
        })),
        ...(compareMethods
          ? QUANTILE_METHODS.map((m) => ({
              label: `Tipo ${m}`,
              value: formatNumber(quantile(data, current, m), decimals + 2),
            }))
          : []),
      ]}
      legend={[
        { label: 'Función de distribución empírica', color: DATA_COLORS.text, shape: 'line' },
        { label: 'Datos ordenados', color: DATA_COLORS.text, shape: 'circle' },
      ]}
      description={description}
      dataTable={{
        caption: 'Datos ordenados',
        columns: ['Posición', variable],
        rows: x.map((value, i) => [String(i + 1), formatNumber(value, decimals)]),
      }}
    >
      <p className={styles.formula}>
        <Latex
          tex={
            shown.length > 0
              ? quantileFormula(data, current, method, decimals)
              : `\\text{${n} datos ordenados}`
          }
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={260}
        maxHeight={420}
        margins={{ top: 16, right: 24, bottom: 48, left: 52 }}
      >
        {(box) => {
          const sx = scaleLinear()
            .domain([lo - pad, hi + pad])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const sy = scaleLinear()
            .domain([0, 1])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const steps = x.map((value, i) => {
            const next = x[i + 1] ?? hi + pad;
            return { from: value, to: next, level: (i + 1) / n };
          });
          return (
            <g>
              <Axis
                scale={sy}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="Proporción acumulada"
              />
              <Axis
                scale={sx}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={8}
                label={`${variable}${unit ? ` (${unit})` : ''}`}
              />
              <line
                x1={sx(lo - pad)}
                x2={sx(x[0] ?? lo)}
                y1={sy(0)}
                y2={sy(0)}
                stroke={DATA_COLORS.text}
                strokeWidth={2}
              />
              {steps.map((s, i) => (
                <g key={i} aria-hidden="true">
                  <line
                    x1={sx(s.from)}
                    x2={sx(s.to)}
                    y1={sy(s.level)}
                    y2={sy(s.level)}
                    stroke={DATA_COLORS.text}
                    strokeWidth={2}
                  />
                  <line
                    x1={sx(s.from)}
                    x2={sx(s.from)}
                    y1={sy(s.level - 1 / n)}
                    y2={sy(s.level)}
                    stroke={DATA_COLORS.text}
                    strokeOpacity={0.35}
                    strokeDasharray="2 2"
                  />
                  <circle
                    cx={sx(s.from)}
                    cy={sy(0)}
                    r={DOT_RADIUS}
                    fill={DATA_COLORS.text}
                    fillOpacity={0.6}
                  />
                </g>
              ))}
              {shown.map((prob, i) => {
                const q = quantile(data, prob, method);
                const color = seriesColor(i);
                return (
                  <g key={prob} aria-hidden="true">
                    <line
                      x1={box.inner.left}
                      x2={sx(q)}
                      y1={sy(prob)}
                      y2={sy(prob)}
                      stroke={color}
                      strokeDasharray="5 3"
                      strokeWidth={2}
                    />
                    <line
                      x1={sx(q)}
                      x2={sx(q)}
                      y1={sy(prob)}
                      y2={sy(0)}
                      stroke={color}
                      strokeWidth={2}
                    />
                    <circle
                      cx={sx(q)}
                      cy={sy(0)}
                      r={DOT_RADIUS + 2}
                      fill="none"
                      stroke={color}
                      strokeWidth={2.5}
                    />
                    <text
                      x={sx(q) + 4}
                      y={sy(prob) - 6}
                      className={styles.markerLabel}
                      fill={color}
                    >
                      {name(prob)}
                    </text>
                  </g>
                );
              })}
              {compareMethods &&
                QUANTILE_METHODS.map((m, i) => (
                  <line
                    key={m}
                    x1={sx(quantile(data, current, m))}
                    x2={sx(quantile(data, current, m))}
                    y1={sy(0) - 14 - i * 3}
                    y2={sy(0) - 24 - i * 3}
                    stroke={m === method ? DATA_COLORS.highlight : DATA_COLORS.muted}
                    strokeWidth={m === method ? 3 : 1.5}
                  />
                ))}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
