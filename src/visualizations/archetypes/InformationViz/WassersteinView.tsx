import { useState } from 'react';
import {
  klDivergence,
  normalize,
  transportPlan,
  wasserstein1,
} from '../../../lib/information/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';

const STEPS_PER_SECOND = 1;
const BAR_WIDTH = 0.6;
const ARC_LIFT = 0.12;
const Y_MAX = 1.2;

interface WassersteinViewProps {
  title: string;
  p: readonly number[];
  q: readonly number[];
}

/**
 * Optimal transport between two histograms on the positions 1, 2, ..., k.
 * Each step moves one shipment of the monotone plan, drawn as an arc whose
 * width is the mass moved; the cost of a shipment is its mass times the
 * distance travelled and the total is the Wasserstein-1 distance. KL is shown
 * beside it: it ignores how far apart the bins are and is infinite as soon as
 * p puts mass where q has none.
 */
export function WassersteinView({ title, p: pRaw, q: qRaw }: WassersteinViewProps) {
  const p = normalize(pRaw);
  const q = normalize(qRaw);
  const plan = transportPlan(p, q);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(plan.length, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= plan.length,
  });
  const moved = plan.slice(0, step);
  const cost = moved.reduce((s, m) => s + m.mass * Math.abs(m.to - m.from), 0);
  const w1 = wasserstein1(p, q);
  const kl = klDivergence(p, q);
  const remaining = p.map(
    (pi, i) => pi - moved.filter((m) => m.from === i).reduce((s, m) => s + m.mass, 0),
  );
  const arrived = q.map((_, j) => moved.filter((m) => m.to === j).reduce((s, m) => s + m.mass, 0));
  const k = p.length;
  const current = moved[moved.length - 1];
  const description =
    `${step} de ${plan.length} envíos hechos, costo acumulado ${formatNumber(cost, 3)}. ` +
    `Distancia de Wasserstein W₁ = ${formatNumber(w1, 3)}; divergencia KL(p‖q) = ${Number.isFinite(kl) ? formatNumber(kl, 3) : 'infinita'} bits.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Envíos hechos', value: `${step} de ${plan.length}` },
        { label: 'Costo acumulado', value: formatNumber(cost, 3), color: DATA_COLORS.highlight },
        { label: 'W₁(p, q)', value: formatNumber(w1, 3) },
        { label: 'KL(p ‖ q), bits', value: Number.isFinite(kl) ? formatNumber(kl, 3) : '∞' },
      ]}
      legend={[
        { label: 'Masa de p por mover', color: DATA_COLORS.primary },
        { label: 'q, destino', color: DATA_COLORS.secondary, shape: 'dashed' },
        { label: 'Masa que ya llegó', color: DATA_COLORS.secondary },
        { label: 'Envío', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={
          current
            ? `\\text{envío: } ${formatNumber(current.mass, 3)} \\times |${current.to + 1} - ${current.from + 1}| = ${formatNumber(current.mass * Math.abs(current.to - current.from), 3)},\\quad \\sum = ${formatNumber(cost, 3)}\\ \\text{de}\\ W_1 = ${formatNumber(w1, 3)}`
            : `W_1(p, q) = \\min_{\\gamma} \\sum_{i,j} \\gamma_{ij}\\,|i - j| = \\sum_i |F_p(i) - F_q(i)| = ${formatNumber(w1, 3)}`
        }
      />
      <FunctionPlot
        xDomain={[0.5, k + 0.5]}
        yDomain={[0, Y_MAX]}
        xLabel="posición"
        label={description}
        curves={[]}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {p.map((_, i) => {
              const left = x(i + 1 - BAR_WIDTH / 2);
              const width = x(i + 1 + BAR_WIDTH / 2) - left;
              const arrivedTop = arrived[i] ?? 0;
              const rest = Math.max(0, remaining[i] ?? 0);
              return (
                <g key={i}>
                  <rect
                    x={left}
                    width={width}
                    y={y(arrivedTop)}
                    height={y(0) - y(arrivedTop)}
                    fill={DATA_COLORS.secondary}
                    fillOpacity={0.75}
                  />
                  <rect
                    x={left}
                    width={width}
                    y={y(arrivedTop + rest)}
                    height={y(arrivedTop) - y(arrivedTop + rest)}
                    fill={DATA_COLORS.primary}
                    fillOpacity={0.75}
                  />
                  <rect
                    x={left}
                    width={width}
                    y={y(q[i] ?? 0)}
                    height={y(0) - y(q[i] ?? 0)}
                    fill="none"
                    stroke={DATA_COLORS.secondary}
                    strokeWidth={2}
                    strokeDasharray="5 4"
                  />
                </g>
              );
            })}
            {moved.map((m, i) => {
              const top =
                Math.max(p[m.from] ?? 0, q[m.to] ?? 0) + ARC_LIFT + 0.05 * Math.abs(m.to - m.from);
              const x0 = x(m.from + 1);
              const x1 = x(m.to + 1);
              return (
                <path
                  key={i}
                  d={`M${x0},${y(p[m.from] ?? 0)} Q${(x0 + x1) / 2},${y(Math.min(Y_MAX, top))} ${x1},${y(q[m.to] ?? 0)}`}
                  fill="none"
                  stroke={DATA_COLORS.highlight}
                  strokeWidth={1 + 10 * m.mass}
                  strokeOpacity={i === moved.length - 1 ? 1 : 0.45}
                />
              );
            })}
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
