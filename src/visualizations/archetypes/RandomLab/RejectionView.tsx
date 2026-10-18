import { useCallback, useMemo } from 'react';
import { beta, normal } from '../../../lib/distributions/index.ts';
import { rejectionStep, type RejectionStep } from '../../../lib/random/generators.ts';
import { formatNumber, formatProbability } from '../../../lib/format/number.ts';
import type { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Bars } from '../../core/svg/Bars.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CasePanel, QuickSample } from '../MultivariateExplorer/CasePanel.tsx';
import { loadPreset, num, useSamples } from '../MultivariateExplorer/shared.ts';
import type { RandomLabConfig, TargetId } from './schema.ts';

const MAX_PROPOSALS = 4000;
const PROPOSALS_PER_SECOND = 4;
const QUICK_PROPOSALS = 500;
const INITIAL_PROPOSALS = 200;
const BINS = 30;
const GRID = 600;

interface Target {
  label: string;
  domain: [number, number];
  density: (x: number) => number;
  proposalLabel: string;
  proposal: (x: number) => number;
  sampleProposal: (random: Random) => number;
}

const betaTarget = beta(2.5, 4);
const wide = normal(0, 2);
const TARGETS: Record<TargetId, Target> = {
  beta: {
    label: 'Beta(2.5, 4)',
    domain: [0, 1],
    density: (x) => betaTarget.pdf(x),
    proposalLabel: 'uniforme en [0, 1]',
    proposal: (x) => (x >= 0 && x <= 1 ? 1 : 0),
    sampleProposal: (random) => random.uniform(),
  },
  bimodal: {
    label: 'mezcla bimodal',
    domain: [-5, 5],
    density: (x) => 0.4 * normal(-1.5, 0.5).pdf(x) + 0.6 * normal(1.5, 0.8).pdf(x),
    proposalLabel: 'normal N(0, 2²)',
    proposal: (x) => wide.pdf(x),
    sampleProposal: (random) => random.normal(0, 2),
  },
  'normal-truncada': {
    label: 'normal estándar truncada a [-2, 2]',
    domain: [-2, 2],
    density: (x) => (Math.abs(x) <= 2 ? normal(0, 1).pdf(x) / (2 * normal(0, 1).cdf(2) - 1) : 0),
    proposalLabel: 'uniforme en [-2, 2]',
    proposal: (x) => (Math.abs(x) <= 2 ? 0.25 : 0),
    sampleProposal: (random) => random.uniform(-2, 2),
  },
};

/** Smallest M with f(x) <= M g(x) on the plotted domain. */
function minimalBound(target: Target): number {
  let worst = 0;
  for (let i = 0; i <= GRID; i += 1) {
    const x = target.domain[0] + ((target.domain[1] - target.domain[0]) * i) / GRID;
    const g = target.proposal(x);
    if (g > 0) worst = Math.max(worst, target.density(x) / g);
  }
  return worst;
}

interface RejectionViewProps {
  config: RandomLabConfig;
  conceptId: string;
  title: string;
}

/**
 * Rejection sampling: points (x, u M g(x)) are thrown under the envelope
 * M g and kept when they fall under the target f. The kept x follow f
 * exactly when M g covers f everywhere, and a fraction 1/M of proposals is
 * kept. With M too small the envelope cuts through f and the histogram is
 * flattened where f sticks out.
 */
export function RejectionView({ config, conceptId, title }: RejectionViewProps) {
  const target = TARGETS[config.objetivo ?? 'beta'];
  const minimum = useMemo(() => minimalBound(target), [target]);
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      num('holgura', 'Factor sobre la M mínima', 'M/M*', 0.6, 4, 0.05, initial.holgura ?? 1, 2),
    ],
    [initial.holgura],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number>;
  const bound = minimum * Number(v.holgura);
  const valid = Number(v.holgura) >= 1;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const draw = useCallback(
    (random: Random): RejectionStep =>
      rejectionStep(
        target.sampleProposal(random),
        random.uniform(),
        target.density,
        target.proposal,
        bound,
      ),
    [target, bound],
  );
  const { samples, stepMany, playback } = useSamples(seed, `${config.objetivo}|${bound}`, draw, {
    max: MAX_PROPOSALS,
    rate: PROPOSALS_PER_SECOND,
    initial: INITIAL_PROPOSALS,
  });
  const accepted = samples.filter((s) => s.accepted);
  const rate = samples.length === 0 ? 0 : accepted.length / samples.length;
  const width = (target.domain[1] - target.domain[0]) / BINS;
  const counts = new Array<number>(BINS).fill(0);
  for (const s of accepted) {
    const bin = Math.floor((s.x - target.domain[0]) / width);
    if (bin >= 0 && bin < BINS) counts[bin] = (counts[bin] ?? 0) + 1;
  }
  const bars = counts.map((count, i) => ({
    x0: target.domain[0] + i * width,
    x1: target.domain[0] + (i + 1) * width,
    value: accepted.length === 0 ? 0 : count / (accepted.length * width),
  }));
  const description =
    `Objetivo ${target.label} con propuesta ${target.proposalLabel} y M = ${formatNumber(bound, 3)} (mínima ${formatNumber(minimum, 3)}). ` +
    `${samples.length} propuestas, ${accepted.length} aceptadas: tasa ${formatProbability(rate)} frente a 1/M = ${formatProbability(Math.min(1, 1 / bound))}.` +
    (valid
      ? ''
      : ' La envolvente no cubre a la densidad: las muestras aceptadas no siguen al objetivo.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: v }}
      controls={<QuickSample count={QUICK_PROPOSALS} onClick={() => stepMany(QUICK_PROPOSALS)} />}
      readouts={[
        { label: 'Constante M', value: formatNumber(bound, 3), color: DATA_COLORS.text },
        { label: 'Propuestas', value: String(samples.length) },
        { label: 'Aceptadas', value: String(accepted.length), color: DATA_COLORS.primary },
        { label: 'Tasa de aceptación', value: formatProbability(rate) },
        { label: 'Tasa teórica 1/M', value: formatProbability(Math.min(1, 1 / bound)) },
        { label: '¿La envolvente cubre a f?', value: valid ? 'sí' : 'no: muestreo sesgado' },
      ]}
      legend={[
        { label: 'Densidad objetivo f', color: DATA_COLORS.primary, shape: 'line' as const },
        { label: 'Envolvente M g', color: DATA_COLORS.text, shape: 'dashed' as const },
        { label: 'Propuestas aceptadas', color: DATA_COLORS.tertiary },
        { label: 'Propuestas rechazadas', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine
        tex={`\\text{aceptar } x \\iff u\\,M\\,g(x) \\le f(x),\\qquad M = ${formatNumber(bound, 3)},\\qquad P(\\text{aceptar}) = \\frac{1}{M} = ${formatNumber(Math.min(1, 1 / bound), 3)}`}
      />
      <FunctionPlot
        xDomain={target.domain}
        yDomain={[
          0,
          Math.max(
            bound *
              Math.max(
                ...Array.from({ length: 50 }, (_, i) =>
                  target.proposal(
                    target.domain[0] + ((target.domain[1] - target.domain[0]) * i) / 49,
                  ),
                ),
              ),
            ...bars.map((b) => b.value),
          ) * 1.1,
        ]}
        label={description}
        xLabel="x"
        curves={[
          { f: target.density, color: DATA_COLORS.primary, width: 2.5 },
          { f: (x) => bound * target.proposal(x), color: DATA_COLORS.text, dashed: true },
        ]}
        background={({ x, y }) => (
          <Bars bars={bars} xScale={x} yScale={y} color={DATA_COLORS.primary} opacity={0.25} />
        )}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {samples.slice(-600).map((s, i) => (
              <circle
                key={i}
                cx={x(s.x)}
                cy={y(s.y)}
                r={2}
                fill={s.accepted ? DATA_COLORS.tertiary : DATA_COLORS.secondary}
                fillOpacity={0.75}
              />
            ))}
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
