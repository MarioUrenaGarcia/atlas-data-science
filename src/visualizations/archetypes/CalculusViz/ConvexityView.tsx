import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot, type PlotScales } from '../../core/svg/FunctionPlot.tsx';
import { autoYDomain } from '../../core/svg/plotDomain.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';
import { plainLabel, useFunctionChoice } from './useFunctionChoice.ts';

const STEPS = 40;
const STEPS_PER_SECOND = 12;
const DOT_RADIUS = 6;
const SHADE_BANDS = 120;
const TOLERANCE = 1e-9;

interface ConvexityViewProps {
  title: string;
  ids: readonly string[];
  chord: [number, number];
}

/**
 * Convexity through chords: a point slides along the segment between
 * (p, f(p)) and (q, f(q)) and is compared with the graph directly below or
 * above it. Where f'' > 0 (shaded green) the chord stays above the graph;
 * where f'' < 0 (shaded pink) it stays below.
 */
export function ConvexityView({ title, ids, chord }: ConvexityViewProps) {
  const extra = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'p',
        label: 'Extremo izquierdo de la cuerda',
        symbol: 'p',
        min: -6,
        max: 6,
        step: 0.1,
        default: chord[0],
        digits: 1,
      },
      {
        type: 'number' as const,
        key: 'q',
        label: 'Extremo derecho de la cuerda',
        symbol: 'q',
        min: -6,
        max: 6,
        step: 0.1,
        default: chord[1],
        digits: 1,
      },
    ],
    [chord],
  );
  const { parameters, values, fn } = useFunctionChoice(ids, extra);
  const [lo, hi] = fn.domain;
  const clamp = (v: number) => Math.max(lo, Math.min(hi, v));
  const p = clamp(Number(values.p));
  const q = clamp(Number(values.q));
  const [step, setStep] = useState(STEPS / 2);
  const playback = usePlayback({
    step: () => setStep((value) => (value + 1) % (STEPS + 1)),
    reset: () => setStep(STEPS / 2),
    rate: STEPS_PER_SECOND,
  });
  const lambda = step / STEPS;
  const xm = (1 - lambda) * p + lambda * q;
  const chordValue = (1 - lambda) * fn.f(p) + lambda * fn.f(q);
  const graphValue = fn.f(xm);
  const gap = chordValue - graphValue;
  const relation =
    gap > TOLERANCE
      ? 'la cuerda queda por encima de la gráfica'
      : gap < -TOLERANCE
        ? 'la cuerda queda por debajo de la gráfica'
        : 'la cuerda toca la gráfica';
  const description =
    `f(x) = ${plainLabel(fn.id)}, cuerda entre p = ${formatNumber(p, 2)} y q = ${formatNumber(q, 2)}. En λ = ${formatNumber(lambda, 2)}: ` +
    `cuerda ${formatNumber(chordValue, 3)}, gráfica ${formatNumber(graphValue, 3)}; ${relation}.`;
  const shade = ({ x, box }: PlotScales) => (
    <g aria-hidden="true">
      {Array.from({ length: SHADE_BANDS }, (_, i) => {
        const u0 = lo + ((hi - lo) * i) / SHADE_BANDS;
        const u1 = lo + ((hi - lo) * (i + 1)) / SHADE_BANDS;
        const second = fn.d2f((u0 + u1) / 2);
        return (
          <rect
            key={i}
            x={x(u0)}
            y={box.inner.top}
            width={x(u1) - x(u0) + 0.5}
            height={box.inner.height}
            fill={second >= 0 ? DATA_COLORS.tertiary : DATA_COLORS.quaternary}
            fillOpacity={0.12}
          />
        );
      })}
    </g>
  );

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'λ', value: formatNumber(lambda, 2) },
        {
          label: 'Cuerda: (1 - λ) f(p) + λ f(q)',
          value: formatNumber(chordValue, 3),
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Gráfica: f((1 - λ) p + λ q)',
          value: formatNumber(graphValue, 3),
          color: DATA_COLORS.primary,
        },
        { label: 'Cuerda menos gráfica', value: formatNumber(gap, 3) },
        { label: "f''(x) en el punto", value: formatNumber(fn.d2f(xm), 3) },
      ]}
      legend={[
        { label: "Convexa (f'' ≥ 0)", color: DATA_COLORS.tertiary },
        { label: "Cóncava (f'' < 0)", color: DATA_COLORS.quaternary },
        { label: 'Cuerda', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\underbrace{f\\big((1 - \\lambda)p + \\lambda q\\big)}_{${formatNumber(graphValue, 3)}} \\ ${gap >= 0 ? '\\le' : '>'}\\ \\underbrace{(1 - \\lambda) f(p) + \\lambda f(q)}_{${formatNumber(chordValue, 3)}},\\quad \\lambda = ${formatNumber(lambda, 2)}`}
        />
      </p>
      <p className={styles.stage}>En este punto {relation}.</p>
      <FunctionPlot
        xDomain={fn.domain}
        yDomain={autoYDomain([{ f: fn.f, color: '' }], fn.domain)}
        label={description}
        background={shade}
        curves={[
          { f: fn.f, color: DATA_COLORS.primary, width: 3 },
          {
            f: (x) => fn.f(p) + ((fn.f(q) - fn.f(p)) * (x - p)) / (q - p || 1),
            color: DATA_COLORS.secondary,
            width: 2.5,
            from: Math.min(p, q),
            to: Math.max(p, q),
          },
        ]}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            <line
              x1={x(xm)}
              x2={x(xm)}
              y1={y(chordValue)}
              y2={y(graphValue)}
              stroke={DATA_COLORS.muted}
              strokeDasharray="3 3"
            />
            <circle cx={x(p)} cy={y(fn.f(p))} r={DOT_RADIUS} fill={DATA_COLORS.secondary} />
            <circle cx={x(q)} cy={y(fn.f(q))} r={DOT_RADIUS} fill={DATA_COLORS.secondary} />
            <circle
              cx={x(xm)}
              cy={y(chordValue)}
              r={DOT_RADIUS}
              fill="var(--color-surface)"
              stroke={DATA_COLORS.secondary}
              strokeWidth={2.5}
            />
            <circle cx={x(xm)} cy={y(graphValue)} r={DOT_RADIUS} fill={DATA_COLORS.primary} />
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
