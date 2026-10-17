import { useState } from 'react';
import {
  crossEntropy,
  entropy,
  jsDivergence,
  klDivergence,
  normalize,
} from '../../../lib/information/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { BarChart } from './BarChart.tsx';

const STEPS = 20;
const STEPS_PER_SECOND = 3;

export type DivergenceFocus = 'cruzada' | 'kl' | 'jensen-shannon';

interface DivergenceViewProps {
  title: string;
  p: readonly number[];
  q: readonly number[];
  focus: DivergenceFocus;
  labels?: readonly string[];
}

const show = (v: number) => (Number.isFinite(v) ? formatNumber(v, 3) : '∞');

/**
 * Two distributions over the same categories: p, the one that generates the
 * data, and q, a model. Cross-entropy H(p, q) is the average surprise under q,
 * equal to H(p) plus KL(p || q); Jensen-Shannon compares both with their
 * average. The animation moves q toward p and the divergence falls to zero.
 */
export function DivergenceView({ title, p: pRaw, q: qRaw, focus, labels }: DivergenceViewProps) {
  const p = normalize(pRaw);
  const q0 = normalize(qRaw);
  const names = labels ?? p.map((_, i) => `x${i + 1}`);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  const t = step / STEPS;
  const q = q0.map((qi, i) => (1 - t) * qi + t * (p[i] ?? 0));
  const hp = entropy(p);
  const hpq = crossEntropy(p, q);
  const kl = klDivergence(p, q);
  const klBack = klDivergence(q, p);
  const js = jsDivergence(p, q);
  const m = p.map((pi, i) => (pi + (q[i] ?? 0)) / 2);
  const contributions = p.map((pi, i) => (pi > 0 ? pi * Math.log2(pi / (q[i] ?? 0)) : 0));
  const header =
    focus === 'cruzada'
      ? `H(p, q) = -\\sum_x p(x)\\log_2 q(x) = ${show(hpq)} = \\underbrace{${show(hp)}}_{H(p)} + \\underbrace{${show(kl)}}_{D_{\\mathrm{KL}}(p \\,\\|\\, q)}`
      : focus === 'kl'
        ? `D_{\\mathrm{KL}}(p \\,\\|\\, q) = \\sum_x p(x)\\log_2\\frac{p(x)}{q(x)} = ${contributions
            .map((c) => show(c))
            .join(' + ')
            .replace(/\+ -/g, '- ')} = ${show(kl)}`
        : `\\mathrm{JS}(p, q) = \\tfrac{1}{2}D_{\\mathrm{KL}}(p \\,\\|\\, m) + \\tfrac{1}{2}D_{\\mathrm{KL}}(q \\,\\|\\, m) = ${show(js)},\\quad m = \\tfrac{p + q}{2}`;
  const description =
    `p = (${p.map((v) => formatNumber(v, 3)).join(', ')}), q = (${q.map((v) => formatNumber(v, 3)).join(', ')}): ` +
    `H(p) = ${show(hp)}, H(p, q) = ${show(hpq)}, KL(p||q) = ${show(kl)}, KL(q||p) = ${show(klBack)}, JS = ${show(js)} bits.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Entropía H(p)', value: show(hp) },
        {
          label: 'Entropía cruzada H(p, q)',
          value: show(hpq),
          color: focus === 'cruzada' ? DATA_COLORS.highlight : undefined,
        },
        {
          label: 'KL(p ‖ q)',
          value: show(kl),
          color: focus === 'kl' ? DATA_COLORS.highlight : undefined,
        },
        { label: 'KL(q ‖ p)', value: show(klBack) },
        {
          label: 'Jensen-Shannon',
          value: show(js),
          color: focus === 'jensen-shannon' ? DATA_COLORS.highlight : undefined,
        },
        { label: 'q movida hacia p', value: `${Math.round(t * 100)} %` },
      ]}
      legend={[
        { label: 'p, la que genera los datos', color: DATA_COLORS.primary },
        { label: 'q, el modelo', color: DATA_COLORS.secondary },
        ...(focus === 'jensen-shannon'
          ? [{ label: 'm, el promedio', color: DATA_COLORS.tertiary }]
          : []),
      ]}
      description={description}
    >
      <FormulaLine tex={`${header}\\ \\text{bits}`} />
      <BarChart
        series={[
          { values: p, color: DATA_COLORS.primary },
          { values: q, color: DATA_COLORS.secondary },
          ...(focus === 'jensen-shannon'
            ? [{ values: m, color: DATA_COLORS.tertiary, outline: true }]
            : []),
        ]}
        labels={names}
        yDomain={[0, 1]}
        annotations={focus === 'kl' ? contributions.map((c) => show(c)) : undefined}
        label={description}
      />
    </VizFrame>
  );
}
