import { useMemo, useState } from 'react';
import { bimodalDensity, fitNormal, grid, normalDensity } from '../../../lib/information/models.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';

const X_RANGE: [number, number] = [-6, 6];
const GRID_POINTS = 200;
/** Coarser search than the default: enough to show which mode the reverse fit picks. */
const SEARCH = { muSteps: 48, sigmaSteps: 40 };
const MAX_SEPARATION = 5;
const SEPARATION_STEP = 0.25;
const STEPS_PER_SECOND = 3;
const Y_MAX = 0.75;
const ROUNDING_FLOOR = 1e-9;

interface AsymmetryViewProps {
  title: string;
  separation: number;
}

/**
 * The best normal approximation q of a two-mode density p depends on the
 * direction of the divergence. Minimizing KL(p || q) forces q to cover every
 * place where p has mass, so it widens over both modes; minimizing KL(q || p)
 * punishes q for putting mass where p has none, so it settles on one mode.
 * The animation pulls the modes apart.
 */
export function AsymmetryView({ title, separation }: AsymmetryViewProps) {
  const total = Math.round(MAX_SEPARATION / SEPARATION_STEP);
  const first = Math.min(total, Math.round(separation / SEPARATION_STEP));
  const [step, setStep] = useState(first);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(total, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= total,
  });
  const d = step * SEPARATION_STEP;
  const xs = useMemo(() => grid(X_RANGE[0], X_RANGE[1], GRID_POINTS), []);
  const p = useMemo(() => bimodalDensity(d), [d]);
  const fitted = useMemo(() => fitNormal(p, xs, 'forward'), [p, xs]);
  // The mean of a symmetric mixture is zero; quadrature leaves rounding noise near 1e-17.
  const forward = { ...fitted, mu: Math.abs(fitted.mu) < ROUNDING_FLOOR ? 0 : fitted.mu };
  const reverse = useMemo(() => fitNormal(p, xs, 'reverse', SEARCH), [p, xs]);
  const description =
    `Modos en ±${formatNumber(d / 2, 2)}: el ajuste por KL(p‖q) es una normal con media ${formatNumber(forward.mu, 2)} y desviación ${formatNumber(forward.sigma, 2)}; ` +
    `el ajuste por KL(q‖p) tiene media ${formatNumber(reverse.mu, 2)} y desviación ${formatNumber(reverse.sigma, 2)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Separación de los modos', value: formatNumber(d, 2) },
        {
          label: 'KL(p‖q): media y desviación',
          value: `${formatNumber(forward.mu, 2)} y ${formatNumber(forward.sigma, 2)}`,
          color: DATA_COLORS.secondary,
        },
        {
          label: 'KL(q‖p): media y desviación',
          value: `${formatNumber(reverse.mu, 2)} y ${formatNumber(reverse.sigma, 2)}`,
          color: DATA_COLORS.quaternary,
        },
        { label: 'KL(p‖q) mínima, nats', value: formatNumber(forward.divergence, 3) },
        { label: 'KL(q‖p) mínima, nats', value: formatNumber(reverse.divergence, 3) },
      ]}
      legend={[
        { label: 'p, mezcla de dos normales', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'q que minimiza KL(p‖q)', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'q que minimiza KL(q‖p)', color: DATA_COLORS.quaternary, shape: 'dashed' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`\\arg\\min_q D_{\\mathrm{KL}}(p\\,\\|\\,q) = \\mathcal{N}(${formatNumber(forward.mu, 2)},\\ ${formatNumber(forward.sigma, 2)}^2),\\qquad \\arg\\min_q D_{\\mathrm{KL}}(q\\,\\|\\,p) = \\mathcal{N}(${formatNumber(reverse.mu, 2)},\\ ${formatNumber(reverse.sigma, 2)}^2)`}
      />
      <FunctionPlot
        xDomain={X_RANGE}
        yDomain={[0, Y_MAX]}
        label={description}
        curves={[
          { f: p, color: DATA_COLORS.primary, width: 3 },
          {
            f: (x) => normalDensity(x, forward.mu, forward.sigma),
            color: DATA_COLORS.secondary,
            width: 2.5,
          },
          {
            f: (x) => normalDensity(x, reverse.mu, reverse.sigma),
            color: DATA_COLORS.quaternary,
            width: 2.5,
            dashed: true,
          },
        ]}
      />
    </VizFrame>
  );
}
