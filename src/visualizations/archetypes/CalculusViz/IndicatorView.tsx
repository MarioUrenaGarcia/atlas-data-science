import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';

const SWEEP_STEPS = 160;
const STEPS_PER_SECOND = 20;
const DOT_RADIUS = 5;
const MARGIN = 1.5;
const Y_DOMAIN: [number, number] = [-0.4, 1.5];
const OFFSET = 0.04;

/** x - c written without a double sign. */
const shifted = (c: number) => (c < 0 ? `x + ${formatNumber(-c, 1)}` : `x - ${formatNumber(c, 1)}`);

interface IndicatorViewProps {
  title: string;
  intervals: readonly [number, number][];
}

/**
 * The indicator of a union of closed intervals, 1 inside and 0 outside, built
 * from Heaviside steps: each interval [a, b] is H(x - a) minus a step at b.
 * A point sweeps the line and reads the value; the integral of the
 * indicator is the total length of the set.
 */
export function IndicatorView({ title, intervals }: IndicatorViewProps) {
  const sorted = [...intervals]
    .map(([p, q]) => [Math.min(p, q), Math.max(p, q)] as [number, number])
    .sort((u, v) => u[0] - v[0]);
  const lo = (sorted[0]?.[0] ?? 0) - MARGIN;
  const hi = (sorted[sorted.length - 1]?.[1] ?? 1) + MARGIN;
  const inside = (x: number) => sorted.some(([p, q]) => x >= p && x <= q);
  const indicator = (x: number) => (inside(x) ? 1 : 0);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => (value + 1) % (SWEEP_STEPS + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
  });
  const x = lo + ((hi - lo) * step) / SWEEP_STEPS;
  const value = indicator(x);
  const length = sorted.reduce((total, [p, q]) => total + (q - p), 0);
  const [first] = sorted;
  const setLatex = sorted
    .map(([p, q]) => `[${formatNumber(p, 2)}, ${formatNumber(q, 2)}]`)
    .join(' \\cup ');
  const description =
    `A = ${sorted.map(([p, q]) => `[${formatNumber(p, 2)}, ${formatNumber(q, 2)}]`).join(' unión ')}. ` +
    `En x = ${formatNumber(x, 2)} la indicadora vale ${value}. La integral de la indicadora es la longitud total de A, ${formatNumber(length, 2)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'x', value: formatNumber(x, 2) },
        { label: '1_A(x)', value: String(value), color: DATA_COLORS.primary },
        { label: '¿x pertenece a A?', value: value === 1 ? 'sí' : 'no' },
        { label: 'Integral de 1_A = longitud de A', value: formatNumber(length, 3) },
      ]}
      legend={[
        { label: 'Indicadora 1_A', color: DATA_COLORS.primary, shape: 'line' },
        ...(first
          ? [
              {
                label: `Escalones H(${shifted(first[0])}) y H(${shifted(first[1])})`,
                color: DATA_COLORS.secondary,
                shape: 'dashed' as const,
              },
            ]
          : []),
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`A = ${setLatex},\\qquad \\mathbf{1}_A(${formatNumber(x, 2)}) = ${value},\\qquad \\int \\mathbf{1}_A(x)\\,dx = ${formatNumber(length, 2)}`}
        />
      </p>
      <FunctionPlot
        xDomain={[lo, hi]}
        yDomain={Y_DOMAIN}
        label={description}
        curves={[
          ...(first
            ? [
                {
                  f: (t: number) => (t >= first[0] ? 1 : 0) + OFFSET,
                  breaks: [first[0]],
                  color: DATA_COLORS.secondary,
                  width: 1.5,
                  dashed: true,
                },
                {
                  f: (t: number) => (t > first[1] ? 1 : 0) - OFFSET,
                  breaks: [first[1]],
                  color: DATA_COLORS.secondary,
                  width: 1.5,
                  dashed: true,
                },
              ]
            : []),
          { f: indicator, color: DATA_COLORS.primary, width: 3.5, breaks: sorted.flat() },
        ]}
        background={({ x: sx, y: sy }) => (
          <g aria-hidden="true">
            {sorted.map(([p, q]) => (
              <rect
                key={`${p}-${q}`}
                x={sx(p)}
                y={sy(1)}
                width={sx(q) - sx(p)}
                height={sy(0) - sy(1)}
                fill={DATA_COLORS.primary}
                fillOpacity={0.15}
              />
            ))}
          </g>
        )}
      >
        {(s) => (
          <g aria-hidden="true">
            {sorted.flatMap(([p, q]) => [
              <circle
                key={`in-${p}`}
                cx={s.x(p)}
                cy={s.y(1)}
                r={DOT_RADIUS}
                fill={DATA_COLORS.primary}
              />,
              <circle
                key={`out-${p}`}
                cx={s.x(p)}
                cy={s.y(0)}
                r={DOT_RADIUS}
                fill="var(--color-surface)"
                stroke={DATA_COLORS.primary}
                strokeWidth={2}
              />,
              <circle
                key={`in-${q}`}
                cx={s.x(q)}
                cy={s.y(1)}
                r={DOT_RADIUS}
                fill={DATA_COLORS.primary}
              />,
              <circle
                key={`out-${q}`}
                cx={s.x(q)}
                cy={s.y(0)}
                r={DOT_RADIUS}
                fill="var(--color-surface)"
                stroke={DATA_COLORS.primary}
                strokeWidth={2}
              />,
            ])}
            <circle cx={s.x(x)} cy={s.y(value)} r={DOT_RADIUS + 2} fill={DATA_COLORS.highlight} />
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
