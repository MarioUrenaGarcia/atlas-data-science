import { useMemo, useState } from 'react';
import { QUOTIENT_CASES } from '../../../lib/calculus/cases.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';

const STEPS = 16;
const SHRINK = 0.65;
const STEPS_PER_SECOND = 1.5;
const DOT_RADIUS = 5;
const PANEL_ASPECT = 0.8;

interface LHopitalViewProps {
  title: string;
  cases: readonly string[];
}

/**
 * L'Hôpital's rule for 0/0. Near a, numerator and denominator look like
 * their tangent lines, so their quotient behaves like the quotient of the
 * slopes. The left panel shows f and g crossing zero together; the right one
 * shows f/g and f'/g' approaching the same value as x approaches a.
 */
export function LHopitalView({ title, cases }: LHopitalViewProps) {
  const definitions = useMemo(
    () =>
      cases.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'caso',
              label: 'Cociente',
              options: cases.map((id) => ({ value: id, label: id.replace(/-/g, ' ') })),
              default: cases[0] ?? 'seno-x',
            },
          ]
        : [],
    [cases],
  );
  const parameters = useParameters(definitions);
  const id =
    cases.length > 1
      ? String((parameters.values as Record<string, string>).caso)
      : (cases[0] ?? 'seno-x');
  const c = QUOTIENT_CASES[id] ?? QUOTIENT_CASES['seno-x'];
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  if (!c) return null;
  const h = ((c.domain[1] - c.domain[0]) / 4) * SHRINK ** step;
  const x = c.point + h;
  const ratio = c.f(x) / c.g(x);
  const slopeRatio = c.df(x) / c.dg(x);
  const description =
    `Cerca de a = ${formatNumber(c.point, 2)}, con x = a + ${formatNumber(h, 4)}: f(x)/g(x) = ${formatNumber(ratio, 4)} y f'(x)/g'(x) = ${formatNumber(slopeRatio, 4)}. ` +
    `Ambos tienden a ${formatNumber(c.limit, 3)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={
        definitions.length > 0
          ? { ...parameters, values: parameters.values as Record<string, unknown> }
          : undefined
      }
      readouts={[
        { label: 'x - a', value: formatNumber(h, 4) },
        { label: 'f(x)', value: formatNumber(c.f(x), 5), color: DATA_COLORS.primary },
        { label: 'g(x)', value: formatNumber(c.g(x), 5), color: DATA_COLORS.secondary },
        { label: 'f(x) / g(x)', value: formatNumber(ratio, 4), color: DATA_COLORS.tertiary },
        {
          label: "f'(x) / g'(x)",
          value: formatNumber(slopeRatio, 4),
          color: DATA_COLORS.quaternary,
        },
        { label: 'Límite', value: formatNumber(c.limit, 4) },
      ]}
      legend={[
        { label: 'f (numerador)', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'g (denominador)', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'f / g', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: "f' / g'", color: DATA_COLORS.quaternary, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\lim_{x \\to ${formatNumber(c.point, 2)}} ${c.latex} = \\lim_{x \\to ${formatNumber(c.point, 2)}} ${c.derivativesLatex} = ${formatNumber(c.limit, 3)},\\qquad x = ${formatNumber(x, 4)}:\\ ${formatNumber(ratio, 4)} \\approx ${formatNumber(slopeRatio, 4)}`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Numerador y denominador</p>
          <FunctionPlot
            xDomain={c.domain}
            label={`Numerador y denominador. ${description}`}
            aspect={PANEL_ASPECT}
            minHeight={220}
            curves={[
              { f: c.f, color: DATA_COLORS.primary, width: 3 },
              { f: c.g, color: DATA_COLORS.secondary, width: 3 },
            ]}
          >
            {(s) => (
              <g aria-hidden="true">
                <circle cx={s.x(x)} cy={s.y(c.f(x))} r={DOT_RADIUS} fill={DATA_COLORS.primary} />
                <circle cx={s.x(x)} cy={s.y(c.g(x))} r={DOT_RADIUS} fill={DATA_COLORS.secondary} />
                <circle
                  cx={s.x(c.point)}
                  cy={s.y(0)}
                  r={DOT_RADIUS}
                  fill="var(--color-surface)"
                  stroke={DATA_COLORS.text}
                  strokeWidth={2}
                />
              </g>
            )}
          </FunctionPlot>
        </div>
        <div>
          <p className={styles.panelTitle}>Cocientes</p>
          <FunctionPlot
            xDomain={c.domain}
            label={`Cocientes. ${description}`}
            aspect={PANEL_ASPECT}
            minHeight={220}
            curves={[
              { f: (t) => c.f(t) / c.g(t), color: DATA_COLORS.tertiary, width: 3 },
              {
                f: (t) => c.df(t) / c.dg(t),
                color: DATA_COLORS.quaternary,
                width: 2.5,
                dashed: true,
              },
            ]}
          >
            {(s) => (
              <g aria-hidden="true">
                <line
                  x1={s.box.inner.left}
                  x2={s.box.inner.left + s.box.inner.width}
                  y1={s.y(c.limit)}
                  y2={s.y(c.limit)}
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="4 4"
                />
                <circle cx={s.x(x)} cy={s.y(ratio)} r={DOT_RADIUS} fill={DATA_COLORS.tertiary} />
                <circle
                  cx={s.x(x)}
                  cy={s.y(slopeRatio)}
                  r={DOT_RADIUS}
                  fill={DATA_COLORS.quaternary}
                />
                <circle
                  cx={s.x(c.point)}
                  cy={s.y(c.limit)}
                  r={DOT_RADIUS}
                  fill="var(--color-surface)"
                  stroke={DATA_COLORS.text}
                  strokeWidth={2}
                />
              </g>
            )}
          </FunctionPlot>
        </div>
      </div>
    </VizFrame>
  );
}
