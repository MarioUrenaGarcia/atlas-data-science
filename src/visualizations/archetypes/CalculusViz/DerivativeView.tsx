import { useMemo, useState } from 'react';
import { findRoots } from '../../../lib/calculus/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot, type PlotScales } from '../../core/svg/FunctionPlot.tsx';
import { autoYDomain } from '../../core/svg/plotDomain.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';
import { plainLabel, useFunctionChoice } from './useFunctionChoice.ts';

const SWEEP_STEPS = 160;
const STEPS_PER_SECOND = 20;
const DOT_RADIUS = 6;
const TANGENT_HALF_WIDTH = 0.8;
const FLAT = 1e-9;
const PANEL_ASPECT = 0.42;
const SHADE_BANDS = 120;

interface DerivativeViewProps {
  title: string;
  ids: readonly string[];
  order: 1 | 2;
  critical: boolean;
}

/**
 * A point sweeps along the graph of f with its tangent line. Below, the graph
 * of f' records the slope of that tangent at every x, and optionally f''
 * records how the slope changes. With critical points on, the intervals where
 * f increases and decreases are shaded and maxima and minima are marked.
 */
export function DerivativeView({ title, ids, order, critical }: DerivativeViewProps) {
  const { parameters, values, fn } = useFunctionChoice(ids);
  const [step, setStep] = useState(SWEEP_STEPS / 4);
  const playback = usePlayback({
    step: () => setStep((value) => (value + 1) % (SWEEP_STEPS + 1)),
    reset: () => setStep(SWEEP_STEPS / 4),
    rate: STEPS_PER_SECOND,
  });
  const [a, b] = fn.domain;
  const x0 = a + ((b - a) * step) / SWEEP_STEPS;
  const y0 = fn.f(x0);
  const slope = fn.df(x0);
  const curvature = fn.d2f(x0);
  const criticalPoints = useMemo(
    () => (critical ? findRoots(fn.df, a, b) : []),
    [critical, fn, a, b],
  );
  const inflections = useMemo(
    () => (critical && order === 2 ? findRoots(fn.d2f, a, b) : []),
    [critical, order, fn, a, b],
  );
  const kind = (x: number) => {
    const second = fn.d2f(x);
    return second > FLAT
      ? 'mínimo local'
      : second < -FLAT
        ? 'máximo local'
        : 'sin clasificar por f″';
  };
  const trend = slope > FLAT ? 'creciente' : slope < -FLAT ? 'decreciente' : 'plana';
  const bend =
    curvature > FLAT
      ? 'cóncava hacia arriba'
      : curvature < -FLAT
        ? 'cóncava hacia abajo'
        : 'sin curvatura';
  const fDomain = autoYDomain([{ f: fn.f, color: '' }], fn.domain);
  const description =
    `f(x) = ${plainLabel(fn.id)}. En x = ${formatNumber(x0, 2)}: f(x) = ${formatNumber(y0, 3)}, f'(x) = ${formatNumber(slope, 3)} (función ${trend})` +
    (order === 2 ? `, f''(x) = ${formatNumber(curvature, 3)} (${bend})` : '') +
    '.' +
    (critical && criticalPoints.length > 0
      ? ` Puntos críticos: ${criticalPoints.map((c) => `${formatNumber(c, 3)} (${kind(c)})`).join(', ')}.`
      : '');

  // Thin vertical bands colored by the sign of f', which shows where f increases or decreases.
  const signShade = ({ x, box }: PlotScales) => (
    <g aria-hidden="true">
      {Array.from({ length: SHADE_BANDS }, (_, i) => {
        const u0 = a + ((b - a) * i) / SHADE_BANDS;
        const u1 = a + ((b - a) * (i + 1)) / SHADE_BANDS;
        return (
          <rect
            key={i}
            x={x(u0)}
            y={box.inner.top}
            width={x(u1) - x(u0) + 0.5}
            height={box.inner.height}
            fill={fn.df((u0 + u1) / 2) > 0 ? DATA_COLORS.tertiary : DATA_COLORS.quaternary}
            fillOpacity={0.1}
          />
        );
      })}
    </g>
  );

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={
        ids.length > 1 ? { ...parameters, values: values as Record<string, unknown> } : undefined
      }
      readouts={[
        { label: 'x', value: formatNumber(x0, 3) },
        { label: 'f(x)', value: formatNumber(y0, 3), color: DATA_COLORS.primary },
        { label: "f'(x), pendiente", value: formatNumber(slope, 3), color: DATA_COLORS.secondary },
        ...(order === 2
          ? [
              {
                label: "f''(x), curvatura",
                value: formatNumber(curvature, 3),
                color: DATA_COLORS.tertiary,
              },
            ]
          : []),
        { label: 'Comportamiento', value: order === 2 ? `${trend}, ${bend}` : trend },
        ...(critical
          ? [
              {
                label: 'Puntos críticos',
                value:
                  criticalPoints.length === 0
                    ? 'ninguno'
                    : criticalPoints
                        .map((c) => `${formatNumber(c, 2)} (${kind(c).split(' ')[0]})`)
                        .join('; '),
              },
            ]
          : []),
        ...(critical && order === 2
          ? [
              {
                label: 'Puntos de inflexión',
                value:
                  inflections.length === 0
                    ? 'ninguno'
                    : inflections.map((c) => formatNumber(c, 2)).join('; '),
              },
            ]
          : []),
      ]}
      legend={[
        { label: 'f(x) y su tangente', color: DATA_COLORS.primary, shape: 'line' },
        { label: "f'(x)", color: DATA_COLORS.secondary, shape: 'line' },
        ...(order === 2
          ? [{ label: "f''(x)", color: DATA_COLORS.tertiary, shape: 'line' as const }]
          : []),
        ...(critical
          ? [
              { label: "Crece (f' > 0)", color: DATA_COLORS.tertiary },
              { label: "Decrece (f' < 0)", color: DATA_COLORS.quaternary },
            ]
          : []),
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`f(x) = ${fn.latex}${fn.derivativeLatex ? `,\\quad f'(x) = ${fn.derivativeLatex}` : ''},\\quad f'(${formatNumber(x0, 2)}) = ${formatNumber(slope, 3)}${order === 2 ? `,\\ f''(${formatNumber(x0, 2)}) = ${formatNumber(curvature, 3)}` : ''}`}
        />
      </p>
      <p className={styles.panelTitle}>f(x) y su recta tangente</p>
      <FunctionPlot
        xDomain={fn.domain}
        yDomain={fDomain}
        label={description}
        aspect={PANEL_ASPECT}
        minHeight={200}
        curves={[
          { f: fn.f, color: DATA_COLORS.primary, width: 3 },
          {
            f: (x) => y0 + slope * (x - x0),
            color: DATA_COLORS.highlight,
            width: 2,
            from: x0 - (TANGENT_HALF_WIDTH * (b - a)) / 4,
            to: x0 + (TANGENT_HALF_WIDTH * (b - a)) / 4,
          },
        ]}
        background={critical ? signShade : undefined}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {criticalPoints.map((c) => (
              <g key={c}>
                <circle
                  cx={x(c)}
                  cy={y(fn.f(c))}
                  r={DOT_RADIUS}
                  fill="var(--color-surface)"
                  stroke={DATA_COLORS.negative}
                  strokeWidth={2.5}
                />
                <text
                  x={x(c)}
                  y={y(fn.f(c)) + (fn.d2f(c) > 0 ? 20 : -12)}
                  textAnchor="middle"
                  style={{ fontSize: 11, fill: 'var(--color-text)' }}
                >
                  {fn.d2f(c) > FLAT ? 'mín' : fn.d2f(c) < -FLAT ? 'máx' : ''}
                </text>
              </g>
            ))}
            {inflections.map((c) => (
              <rect
                key={c}
                x={x(c) - 5}
                y={y(fn.f(c)) - 5}
                width={10}
                height={10}
                fill={DATA_COLORS.tertiary}
                transform={`rotate(45 ${x(c)} ${y(fn.f(c))})`}
              />
            ))}
            <circle cx={x(x0)} cy={y(y0)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} />
          </g>
        )}
      </FunctionPlot>
      <p className={styles.panelTitle}>f′(x): la pendiente en cada punto</p>
      <FunctionPlot
        xDomain={fn.domain}
        label={`Gráfica de la derivada. ${description}`}
        aspect={PANEL_ASPECT}
        minHeight={180}
        curves={[{ f: fn.df, color: DATA_COLORS.secondary, width: 3 }]}
      >
        {({ x, y }) => (
          <circle
            aria-hidden="true"
            cx={x(x0)}
            cy={y(slope)}
            r={DOT_RADIUS}
            fill={DATA_COLORS.secondary}
          />
        )}
      </FunctionPlot>
      {order === 2 && (
        <>
          <p className={styles.panelTitle}>f″(x): cómo cambia la pendiente</p>
          <FunctionPlot
            xDomain={fn.domain}
            label={`Gráfica de la segunda derivada. ${description}`}
            aspect={PANEL_ASPECT}
            minHeight={180}
            curves={[{ f: fn.d2f, color: DATA_COLORS.tertiary, width: 3 }]}
          >
            {({ x, y }) => (
              <circle
                aria-hidden="true"
                cx={x(x0)}
                cy={y(curvature)}
                r={DOT_RADIUS}
                fill={DATA_COLORS.tertiary}
              />
            )}
          </FunctionPlot>
        </>
      )}
    </VizFrame>
  );
}
