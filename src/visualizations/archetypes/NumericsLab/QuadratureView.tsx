import { useMemo, useState } from 'react';
import { NUMERIC_FUNCTIONS } from '../../../lib/numerics/functions.ts';
import {
  gaussLegendre,
  quadrature,
  quadratureEvaluations,
  type QuadratureRule,
} from '../../../lib/numerics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { autoYDomain } from '../../core/svg/plotDomain.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { exact, sci } from './format.ts';
import styles from './NumericsLab.module.css';

/** n = 2, 4, ..., 2^LEVELS for the composite rules and n = 1, ..., LEVELS + 1 points for Gauss. */
const LEVELS = 6;
const STEPS_PER_SECOND = 1;
const DOT_RADIUS = 5;
const ERROR_DOMAIN: [number, number] = [-16, 0];
const EVAL_DOMAIN: [number, number] = [0, 2.2];
/** Floor for the logarithm of an error that is exactly zero. */
const ZERO_ERROR = 1e-16;
const DIGITS = 12;
const BOUND_DIGITS = 6;

const RULE_INFO: Record<QuadratureRule, { name: string; color: string; latex: string }> = {
  trapecio: {
    name: 'Trapecio',
    color: DATA_COLORS.secondary,
    latex: '\\tfrac{h}{2}\\big(f_0 + 2f_1 + \\dots + 2f_{n-1} + f_n\\big)',
  },
  simpson: {
    name: 'Simpson',
    color: DATA_COLORS.tertiary,
    latex: '\\tfrac{h}{3}\\big(f_0 + 4f_1 + 2f_2 + \\dots + 4f_{n-1} + f_n\\big)',
  },
  gauss: {
    name: 'Gauss-Legendre',
    color: DATA_COLORS.quaternary,
    latex: '\\tfrac{b - a}{2}\\sum_{i=1}^{n} w_i\\, f(t_i)',
  },
};

interface QuadratureViewProps {
  title: string;
  id: string;
  interval?: [number, number];
  rules: readonly QuadratureRule[];
}

const sizeAt = (rule: QuadratureRule, level: number) => (rule === 'gauss' ? level + 1 : 2 ** level);

/**
 * Numerical integration with the trapezoid, Simpson and Gauss-Legendre rules.
 * On the left, how the chosen rule replaces f between its nodes; on the right,
 * the error against the number of evaluations of f on logarithmic axes, where
 * the slope of each line is the order of the rule.
 */
export function QuadratureView({ title, id, interval, rules }: QuadratureViewProps) {
  const fn = NUMERIC_FUNCTIONS[id] ?? NUMERIC_FUNCTIONS.seno;
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'regla',
        label: 'Regla dibujada',
        options: rules.map((rule) => ({ value: rule, label: RULE_INFO[rule].name })),
        default: rules[0] ?? 'trapecio',
      },
    ],
    [rules],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, unknown>;
  const drawn = String(values.regla) as QuadratureRule;
  const [level, setLevel] = useState(1);
  const playback = usePlayback({
    step: () => setLevel((value) => Math.min(LEVELS, value + 1)),
    reset: () => setLevel(1),
    rate: STEPS_PER_SECOND,
    done: level >= LEVELS,
  });
  if (!fn) return null;
  const [a, b] = interval ?? fn.domain;
  const truth = fn.antiderivative(b) - fn.antiderivative(a);
  const n = sizeAt(drawn, level);
  const estimate = quadrature(drawn, fn.f, a, b, n);
  const error = Math.abs(estimate - truth);
  const log = (v: number) => Math.log10(Math.max(ZERO_ERROR, v));
  const history = rules.map((rule) =>
    Array.from({ length: level }, (_, i) => {
      const size = sizeAt(rule, i + 1);
      return {
        evaluations: quadratureEvaluations(rule, size),
        error: Math.abs(quadrature(rule, fn.f, a, b, size) - truth),
      };
    }),
  );
  const [y0, y1] = autoYDomain([{ f: fn.f, color: '', from: a, to: b }], [a, b]);
  const description =
    `${RULE_INFO[drawn].name} con n = ${n} sobre [${a}, ${b}]: ${exact(estimate)}, integral exacta ${exact(truth)}, error ${sci(error)}, ` +
    `${quadratureEvaluations(drawn, n)} evaluaciones de f.`;

  const shape = (x: (v: number) => number, y: (v: number) => number) => {
    if (drawn === 'gauss') {
      const { nodes, weights } = gaussLegendre(n);
      const half = (b - a) / 2;
      const mid = (a + b) / 2;
      let left = a;
      return nodes.map((t, i) => {
        const xi = mid + half * t;
        const width = (weights[i] ?? 0) * half;
        const right = left + width;
        const rect = (
          <g key={i}>
            <rect
              x={x(left)}
              width={x(right) - x(left)}
              y={Math.min(y(0), y(fn.f(xi)))}
              height={Math.abs(y(0) - y(fn.f(xi)))}
              fill={RULE_INFO.gauss.color}
              fillOpacity={0.3}
              stroke={RULE_INFO.gauss.color}
            />
            <circle cx={x(xi)} cy={y(fn.f(xi))} r={DOT_RADIUS} fill={RULE_INFO.gauss.color} />
          </g>
        );
        left = right;
        return rect;
      });
    }
    const m = drawn === 'simpson' ? (n % 2 === 0 ? n : n + 1) : n;
    const h = (b - a) / m;
    if (drawn === 'trapecio') {
      return Array.from({ length: m }, (_, i) => {
        const xa = a + i * h;
        const xb = xa + h;
        return (
          <polygon
            key={i}
            points={`${x(xa)},${y(0)} ${x(xa)},${y(fn.f(xa))} ${x(xb)},${y(fn.f(xb))} ${x(xb)},${y(0)}`}
            fill={RULE_INFO.trapecio.color}
            fillOpacity={0.3}
            stroke={RULE_INFO.trapecio.color}
          />
        );
      });
    }
    return Array.from({ length: m / 2 }, (_, i) => {
      const xa = a + 2 * i * h;
      const xm = xa + h;
      const xb = xa + 2 * h;
      const fa = fn.f(xa);
      const fm = fn.f(xm);
      const fb = fn.f(xb);
      const parabola = (t: number) =>
        (fa * (t - xm) * (t - xb)) / ((xa - xm) * (xa - xb)) +
        (fm * (t - xa) * (t - xb)) / ((xm - xa) * (xm - xb)) +
        (fb * (t - xa) * (t - xm)) / ((xb - xa) * (xb - xm));
      const samples = 16;
      const top = Array.from({ length: samples + 1 }, (_, k) => {
        const t = xa + ((xb - xa) * k) / samples;
        return `${x(t)},${y(parabola(t))}`;
      });
      return (
        <polygon
          key={i}
          points={`${x(xa)},${y(0)} ${top.join(' ')} ${x(xb)},${y(0)}`}
          fill={RULE_INFO.simpson.color}
          fillOpacity={0.3}
          stroke={RULE_INFO.simpson.color}
        />
      );
    });
  };

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={rules.length > 1 ? { ...parameters, values } : undefined}
      readouts={[
        { label: drawn === 'gauss' ? 'Puntos n' : 'Subintervalos n', value: String(n) },
        { label: 'Evaluaciones de f', value: String(quadratureEvaluations(drawn, n)) },
        {
          label: 'Aproximación',
          value: exact(estimate, false, DIGITS),
          color: RULE_INFO[drawn].color,
        },
        { label: 'Integral exacta', value: exact(truth, false, DIGITS) },
        { label: 'Error', value: sci(error), color: DATA_COLORS.highlight },
      ]}
      legend={[
        { label: 'f(x)', color: DATA_COLORS.primary, shape: 'line' },
        ...rules.map((rule) => ({
          label: RULE_INFO[rule].name,
          color: RULE_INFO[rule].color,
          shape: 'circle' as const,
        })),
      ]}
      description={description}
    >
      <FormulaLine
        tex={`\\int_{${exact(a, true, BOUND_DIGITS)}}^{${exact(b, true, BOUND_DIGITS)}} ${fn.latex}\\,dx \\approx ${RULE_INFO[drawn].latex} = ${exact(estimate, true)},\\qquad |\\text{error}| = ${sci(error, true)}`}
      />
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Lo que integra la regla</p>
          <FunctionPlot
            xDomain={[a, b]}
            yDomain={[Math.min(0, y0), y1]}
            label={description}
            curves={[{ f: fn.f, color: DATA_COLORS.primary, width: 3 }]}
            background={({ x, y }) => <g aria-hidden="true">{shape(x, y)}</g>}
          />
        </div>
        <div>
          <p className={styles.panelTitle}>log₁₀ del error contra log₁₀ de las evaluaciones</p>
          <FunctionPlot
            xDomain={EVAL_DOMAIN}
            yDomain={ERROR_DOMAIN}
            xLabel="log₁₀ evaluaciones"
            label={`Error de cada regla según el número de evaluaciones. ${description}`}
            curves={[]}
          >
            {({ x, y }) => (
              <g aria-hidden="true">
                {history.map((points, r) => {
                  const rule = rules[r] ?? 'trapecio';
                  return (
                    <g key={rule}>
                      <polyline
                        points={points
                          .map((p) => `${x(Math.log10(p.evaluations))},${y(log(p.error))}`)
                          .join(' ')}
                        fill="none"
                        stroke={RULE_INFO[rule].color}
                        strokeWidth={2}
                      />
                      {points.map((p, i) => (
                        <circle
                          key={i}
                          cx={x(Math.log10(p.evaluations))}
                          cy={y(log(p.error))}
                          r={DOT_RADIUS - 1}
                          fill={RULE_INFO[rule].color}
                        />
                      ))}
                    </g>
                  );
                })}
              </g>
            )}
          </FunctionPlot>
        </div>
      </div>
    </VizFrame>
  );
}
