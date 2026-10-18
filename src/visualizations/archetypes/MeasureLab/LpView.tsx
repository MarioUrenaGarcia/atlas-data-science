import { useState } from 'react';
import { lpNorm, lpUnitCirclePoint } from '../../../lib/measure/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { EqualPlane } from '../../core/plane/EqualPlane.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';

/** Exponents visited by the animation; the last one stands for p = infinity. */
const EXPONENTS = [1, 1.25, 1.5, 2, 2.5, 2.9, 3, 4, 6, 10, Infinity];
const STEPS_PER_SECOND = 0.8;
const BALL_SAMPLES = 240;
const PLANE = 1.3;
const VECTOR: [number, number] = [1, 0.5];
/** f(x) = x^-1/3 is in Lp of [0, 1] exactly for p < 3. */
const BLOWUP = 3;
const DOT_RADIUS = 5;

export type LpViewMode = 'bola' | 'funcion';

interface LpViewProps {
  title: string;
  p?: number;
  view: LpViewMode;
}

const pText = (p: number) => (Number.isFinite(p) ? formatNumber(p, 2) : '∞');
const pTex = (p: number) => (Number.isFinite(p) ? formatNumber(p, 2) : '\\infty');

/** Norm of x^-1/3 on [0, 1]: (3 / (3 - p))^(1/p) for p < 3, infinite otherwise; the sup norm is infinite. */
const functionNorm = (p: number) => (p < BLOWUP ? (BLOWUP / (BLOWUP - p)) ** (1 / p) : Infinity);

/**
 * Two faces of the Lp spaces. In the plane, the unit sphere of the p-norm goes
 * from a diamond (p = 1) through the circle (p = 2) to a square (p = infinity).
 * For functions, the norm of f(x) = x^-1/3 on [0, 1] is the p-th root of the
 * area under |f|^p: finite for p < 3 and infinite from p = 3 on, so f belongs
 * to L1 and L2 but not to L3.
 */
export function LpView({ title, p: initial, view }: LpViewProps) {
  const start =
    initial === undefined
      ? 0
      : Math.max(
          0,
          EXPONENTS.findIndex((e) => e >= initial),
        );
  const [step, setStep] = useState(start);
  const last = EXPONENTS.length - 1;
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(last, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= last,
  });
  const p = EXPONENTS[step] ?? 1;
  if (view === 'bola') {
    const norm = lpNorm(VECTOR, p);
    const ball = (q: number) =>
      Array.from({ length: BALL_SAMPLES + 1 }, (_, i) =>
        lpUnitCirclePoint((2 * Math.PI * i) / BALL_SAMPLES, q),
      );
    const description =
      `p = ${pText(p)}: la esfera unitaria de la norma p y el vector (1, 0.5), cuya norma es ${formatNumber(norm, 4)}. ` +
      `Con p = 1 vale 1.5, con p = 2 vale 1.118 y con p infinito vale 1.`;
    return (
      <VizFrame
        title={title}
        playback={playback}
        readouts={[
          { label: 'Exponente p', value: pText(p) },
          { label: '‖(1, 0.5)‖ₚ', value: formatNumber(norm, 4), color: DATA_COLORS.highlight },
          { label: '‖·‖₁', value: formatNumber(lpNorm(VECTOR, 1), 4) },
          { label: '‖·‖₂', value: formatNumber(lpNorm(VECTOR, 2), 4) },
          { label: '‖·‖∞', value: formatNumber(lpNorm(VECTOR, Infinity), 4) },
        ]}
        legend={[
          { label: 'Esfera unitaria actual', color: DATA_COLORS.highlight, shape: 'line' },
          { label: 'Esferas anteriores', color: DATA_COLORS.primary, shape: 'line' },
          { label: 'Vector (1, 0.5)', color: DATA_COLORS.secondary, shape: 'circle' },
        ]}
        description={description}
      >
        <FormulaLine
          tex={`\\|\\mathbf{x}\\|_{${pTex(p)}} = ${
            Number.isFinite(p)
              ? `\\big(|1|^{${pTex(p)}} + |0.5|^{${pTex(p)}}\\big)^{1/${pTex(p)}}`
              : '\\max(|1|, |0.5|)'
          } = ${formatNumber(norm, 4)}`}
        />
        <EqualPlane
          domain={[
            [-PLANE, PLANE],
            [-PLANE, PLANE],
          ]}
          label={description}
        >
          {({ x, y }) => (
            <g aria-hidden="true" fill="none">
              {EXPONENTS.slice(0, step).map((q) => (
                <polyline
                  key={q}
                  points={ball(q)
                    .map(([a, b]) => `${x(a)},${y(b)}`)
                    .join(' ')}
                  stroke={DATA_COLORS.primary}
                  strokeOpacity={0.35}
                  strokeWidth={1.5}
                />
              ))}
              <polyline
                points={ball(p)
                  .map(([a, b]) => `${x(a)},${y(b)}`)
                  .join(' ')}
                stroke={DATA_COLORS.highlight}
                strokeWidth={3}
              />
              <line
                x1={x(0)}
                y1={y(0)}
                x2={x(VECTOR[0])}
                y2={y(VECTOR[1])}
                stroke={DATA_COLORS.secondary}
                strokeWidth={2}
              />
              <circle
                cx={x(VECTOR[0])}
                cy={y(VECTOR[1])}
                r={DOT_RADIUS}
                fill={DATA_COLORS.secondary}
              />
            </g>
          )}
        </EqualPlane>
      </VizFrame>
    );
  }
  const norm = Number.isFinite(p) ? functionNorm(p) : Infinity;
  const area = Number.isFinite(norm) && Number.isFinite(p) ? norm ** p : Infinity;
  const show = (v: number) => (Number.isFinite(v) ? formatNumber(v, 4) : '∞');
  const description =
    `p = ${pText(p)}: el área bajo |f|^p con f(x) = x^(-1/3) es ${show(area)} y la norma es ${show(norm)}; ` +
    `f está en Lp solo si p < 3.`;
  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Exponente p', value: pText(p) },
        { label: 'Área ∫ |f|ᵖ', value: show(area) },
        { label: '‖f‖ₚ', value: show(norm), color: DATA_COLORS.highlight },
        { label: '¿f en Lp?', value: p < BLOWUP ? 'sí' : 'no' },
      ]}
      legend={[{ label: '|f(x)|ᵖ con f(x) = x^(-1/3)', color: DATA_COLORS.primary, shape: 'line' }]}
      description={description}
    >
      <FormulaLine
        tex={
          p < BLOWUP
            ? `\\|f\\|_{${pTex(p)}} = \\Big(\\int_0^1 x^{-${formatNumber(p, 2)}/3}\\,dx\\Big)^{1/${pTex(p)}} = \\Big(\\tfrac{3}{3 - ${formatNumber(p, 2)}}\\Big)^{1/${pTex(p)}} = ${show(norm)}`
            : Number.isFinite(p)
              ? `\\int_0^1 x^{-${formatNumber(p, 2)}/3}\\,dx = \\infty \\;\\Longrightarrow\\; f \\notin L^{${pTex(p)}}`
              : `\\|f\\|_\\infty = \\operatorname{ess\\,sup}_{x} x^{-1/3} = \\infty`
        }
      />
      <FunctionPlot
        xDomain={[0, 1]}
        yDomain={[0, 12]}
        label={description}
        curves={[
          {
            f: (x) => (Number.isFinite(p) ? x ** (-p / 3) : x ** (-1 / 3)),
            color: DATA_COLORS.primary,
            width: 3,
            from: 0.0005,
          },
        ]}
        background={({ x, y }) => {
          const n = 300;
          const f = (t: number) => Math.min(12, Number.isFinite(p) ? t ** (-p / 3) : t ** (-1 / 3));
          const pts = Array.from({ length: n + 1 }, (_, i) => {
            const t = 0.0005 + ((1 - 0.0005) * i) / n;
            return `${x(t)},${y(f(t))}`;
          });
          return (
            <polygon
              points={`${x(0.0005)},${y(0)} ${pts.join(' ')} ${x(1)},${y(0)}`}
              fill={p < BLOWUP ? DATA_COLORS.primary : DATA_COLORS.highlight}
              fillOpacity={0.2}
              aria-hidden="true"
            />
          );
        }}
      />
    </VizFrame>
  );
}
