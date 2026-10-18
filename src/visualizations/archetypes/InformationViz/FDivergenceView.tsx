import { useState } from 'react';
import {
  F_GENERATORS,
  fDivergence,
  normalize,
  type FDivergence,
} from '../../../lib/information/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';

const STEPS = 20;
const STEPS_PER_SECOND = 3;
const T_RANGE: [number, number] = [0.02, 3];
const Y_RANGE: [number, number] = [-0.5, 2.5];
/** Radius of a point of weight 1; each point is scaled by the square root of q_i. */
const DOT_SCALE = 16;

const OPTIONS: readonly { value: FDivergence; label: string }[] = [
  { value: 'kl', label: 'Kullback-Leibler' },
  { value: 'kl-inversa', label: 'Kullback-Leibler inversa' },
  { value: 'variacion-total', label: 'Variación total' },
  { value: 'hellinger', label: 'Hellinger al cuadrado' },
  { value: 'chi-cuadrada', label: 'Chi cuadrada de Pearson' },
];

const GENERATOR_TEX: Readonly<Record<FDivergence, string>> = {
  kl: 't\\log t',
  'kl-inversa': '-\\log t',
  'variacion-total': '\\tfrac{1}{2}|t - 1|',
  hellinger: '(\\sqrt{t} - 1)^2',
  'chi-cuadrada': '(t - 1)^2',
};

interface FDivergenceViewProps {
  title: string;
  p: readonly number[];
  q: readonly number[];
  f?: FDivergence;
}

const ratioTex = (t: number) => (Number.isFinite(t) ? formatNumber(t, 2) : '\\infty');

const isFDivergence = (v: unknown): v is FDivergence => OPTIONS.some((o) => o.value === v);

/**
 * Every f-divergence weighs the likelihood ratios t_i = p_i / q_i with a convex
 * generator f that vanishes at t = 1: D_f(p || q) = sum q_i f(t_i). The points on
 * the curve are the ratios, sized by q_i. The animation moves q toward p and all
 * ratios slide to t = 1, where every divergence of the family is zero.
 */
export function FDivergenceView({ title, p: pRaw, q: qRaw, f = 'kl' }: FDivergenceViewProps) {
  const parameters = useParameters([
    { type: 'select', key: 'f', label: 'Generador f', options: OPTIONS, default: f },
  ] as const);
  const kind = isFDivergence(parameters.values.f) ? parameters.values.f : f;
  const generator = F_GENERATORS[kind];
  const p = normalize(pRaw);
  const q0 = normalize(qRaw);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  const s = step / STEPS;
  const q = q0.map((qi, i) => (1 - s) * qi + s * (p[i] ?? 0));
  const ratios = p.map((pi, i) => pi / (q[i] ?? 1));
  const value = fDivergence(p, q, kind);
  const all = OPTIONS.map((o) => ({ key: o.value, label: o.label, d: fDivergence(p, q, o.value) }));
  const show = (v: number) => (Number.isFinite(v) ? formatNumber(v, 3) : '∞');
  const name = OPTIONS.find((o) => o.value === kind)?.label ?? kind;
  const description =
    `Generador ${name}. Cocientes p/q: ${ratios.map((t) => (Number.isFinite(t) ? formatNumber(t, 2) : 'infinito')).join(', ')}. ` +
    all.map((o) => `${o.label} ${show(o.d)}`).join(', ') +
    ' nats.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        ...all.map((o) => ({
          label: o.label,
          value: show(o.d),
          color: o.key === kind ? DATA_COLORS.highlight : undefined,
        })),
        { label: 'q movida hacia p', value: `${Math.round(s * 100)} %` },
      ]}
      legend={[
        { label: 'Generador f(t)', color: DATA_COLORS.primary, shape: 'line' },
        {
          label: 'Cocientes t = p/q, tamaño según q',
          color: DATA_COLORS.highlight,
          shape: 'circle',
        },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`D_f(p\\,\\|\\,q) = \\sum_i q_i\\, f\\!\\left(\\tfrac{p_i}{q_i}\\right),\\ f(t) = ${GENERATOR_TEX[kind]}:\\ ${q
          .map((qi, i) => `${formatNumber(qi, 2)}\\cdot f(${ratioTex(ratios[i] ?? 1)})`)
          .join(' + ')} = ${show(value)}`}
      />
      <FunctionPlot
        xDomain={T_RANGE}
        yDomain={Y_RANGE}
        xLabel="cociente t = p/q"
        label={description}
        curves={[{ f: generator, color: DATA_COLORS.primary, width: 3 }]}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            <line
              x1={x(1)}
              x2={x(1)}
              y1={y(Y_RANGE[0])}
              y2={y(Y_RANGE[1])}
              stroke={DATA_COLORS.muted}
              strokeDasharray="4 4"
            />
            {ratios.map((t, i) =>
              t >= T_RANGE[0] && t <= T_RANGE[1] ? (
                <circle
                  key={i}
                  cx={x(t)}
                  cy={y(Math.max(Y_RANGE[0], Math.min(Y_RANGE[1], generator(t))))}
                  r={Math.max(3, DOT_SCALE * Math.sqrt(q[i] ?? 0))}
                  fill={DATA_COLORS.highlight}
                  fillOpacity={0.75}
                  stroke="var(--color-surface)"
                  strokeWidth={1.5}
                />
              ) : null,
            )}
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
