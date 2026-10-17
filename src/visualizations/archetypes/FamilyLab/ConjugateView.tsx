import { useCallback, useMemo } from 'react';
import { beta, gamma, normal } from '../../../lib/distributions/index.ts';
import {
  conjugateMean,
  conjugateUpdate,
  type ConjugateState,
} from '../../../lib/distributions/families.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import type { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CasePanel, QuickSample } from '../MultivariateExplorer/CasePanel.tsx';
import { loadPreset, num, useSamples } from '../MultivariateExplorer/shared.ts';
import styles from './FamilyLab.module.css';
import type { FamilyLabConfig } from './schema.ts';

const MAX_OBSERVATIONS = 300;
const OBSERVATIONS_PER_SECOND = 3;
const QUICK_OBSERVATIONS = 10;
const CREDIBLE = 0.95;

type Model = 'beta-bernoulli' | 'gamma-poisson' | 'normal-normal';

interface ModelSpec {
  title: string;
  parameter: string;
  defaults: { a: number; b: number; truth: number };
  definitions: (a: number, b: number, truth: number) => ParameterDefinition[];
  domain: (state: ConjugateState, truth: number) => [number, number];
  density: (state: ConjugateState) => (x: number) => number;
  quantile: (state: ConjugateState, q: number) => number;
  draw: (random: Random, truth: number) => number;
  tex: (prior: ConjugateState, posterior: ConjugateState, n: number, total: number) => string;
  hyper: (state: ConjugateState) => string;
}

const DATA_SD = 1;

const MODELS: Record<Model, ModelSpec> = {
  'beta-bernoulli': {
    title: 'Beta y ensayos de Bernoulli',
    parameter: 'p',
    defaults: { a: 2, b: 2, truth: 0.7 },
    definitions: (a, b, truth) => [
      num('a', 'Éxitos previos', 'a', 0.5, 20, 0.5, a, 1),
      num('b', 'Fracasos previos', 'b', 0.5, 20, 0.5, b, 1),
      num('truth', 'Probabilidad verdadera', 'p', 0.05, 0.95, 0.01, truth),
    ],
    domain: () => [0, 1],
    density: (s) => (x) => beta(s.a, s.b).pdf(x),
    quantile: (s, q) => beta(s.a, s.b).quantile(q),
    draw: (random, truth) => (random.uniform() < truth ? 1 : 0),
    tex: (prior, post, n, total) =>
      `\\operatorname{Beta}(${formatNumber(prior.a, 1)},\\ ${formatNumber(prior.b, 1)}) \\xrightarrow{\\;${total} \\text{ de } ${n}\\;} \\operatorname{Beta}(${formatNumber(post.a, 1)},\\ ${formatNumber(post.b, 1)})`,
    hyper: (s) => `a = ${formatNumber(s.a, 1)}, b = ${formatNumber(s.b, 1)}`,
  },
  'gamma-poisson': {
    title: 'Gamma y conteos de Poisson',
    parameter: 'λ',
    defaults: { a: 2, b: 1, truth: 4 },
    definitions: (a, b, truth) => [
      num('a', 'Forma previa', 'a', 0.5, 20, 0.5, a, 1),
      num('b', 'Tasa previa', 'b', 0.1, 10, 0.1, b, 1),
      num('truth', 'Tasa verdadera', 'λ', 0.5, 15, 0.1, truth, 1),
    ],
    domain: (s, truth) => [0, Math.max(truth * 2, conjugateMean('gamma-poisson', s) * 2.5, 2)],
    density: (s) => (x) => gamma(s.a, s.b).pdf(x),
    quantile: (s, q) => gamma(s.a, s.b).quantile(q),
    draw: (random, truth) => random.poisson(truth),
    tex: (prior, post, n, total) =>
      `\\operatorname{Gamma}(${formatNumber(prior.a, 1)},\\ ${formatNumber(prior.b, 1)}) \\xrightarrow{\\;\\sum x_i = ${total},\\ n = ${n}\\;} \\operatorname{Gamma}(${formatNumber(post.a, 1)},\\ ${formatNumber(post.b, 1)})`,
    hyper: (s) => `forma ${formatNumber(s.a, 1)}, tasa ${formatNumber(s.b, 1)}`,
  },
  'normal-normal': {
    title: 'Normal con varianza conocida',
    parameter: 'μ',
    defaults: { a: 0, b: 2, truth: 1.5 },
    definitions: (a, b, truth) => [
      num('a', 'Media previa', 'm₀', -5, 5, 0.1, a, 1),
      num('b', 'Desviación previa', 's₀', 0.2, 5, 0.1, b, 1),
      num('truth', 'Media verdadera', 'μ', -5, 5, 0.1, truth, 1),
    ],
    domain: (s, truth) => [
      Math.min(s.a - 4 * Math.sqrt(s.b), truth - 3),
      Math.max(s.a + 4 * Math.sqrt(s.b), truth + 3),
    ],
    density: (s) => (x) => normal(s.a, Math.sqrt(s.b)).pdf(x),
    quantile: (s, q) => normal(s.a, Math.sqrt(s.b)).quantile(q),
    draw: (random, truth) => random.normal(truth, DATA_SD),
    tex: (prior, post, n, total) =>
      `\\mathcal{N}(${formatNumber(prior.a)},\\ ${formatNumber(prior.b)}) \\xrightarrow{\\;\\bar{x} = ${formatNumber(n === 0 ? 0 : total / n)},\\ n = ${n}\\;} \\mathcal{N}(${formatNumber(post.a)},\\ ${formatNumber(post.b, 3)})`,
    hyper: (s) => `media ${formatNumber(s.a)}, varianza ${formatNumber(s.b, 3)}`,
  },
};

interface ConjugateViewProps {
  config: FamilyLabConfig;
  conceptId: string;
  title: string;
}

/**
 * A conjugate pair: data arrive one at a time and the posterior stays in
 * the family of the prior, with hyperparameters that simply accumulate the
 * data. Prior dashed, posterior solid, true value marked.
 */
export function ConjugateView({ config, conceptId, title }: ConjugateViewProps) {
  const model = config.modelo ?? 'beta-bernoulli';
  const spec = MODELS[model];
  const initial = config.valores ?? {};
  const definitions = useMemo(
    () =>
      spec.definitions(
        initial.a ?? spec.defaults.a,
        initial.b ?? spec.defaults.b,
        initial.truth ?? spec.defaults.truth,
      ),
    [spec, initial.a, initial.b, initial.truth],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number>;
  const truth = Number(v.truth);
  // The normal model stores the prior variance; its slider gives the deviation.
  const prior: ConjugateState =
    model === 'normal-normal'
      ? { a: Number(v.a), b: Number(v.b) ** 2 }
      : { a: Number(v.a), b: Number(v.b) };

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const draw = useCallback((random: Random) => spec.draw(random, truth), [spec, truth]);
  const { samples, stepMany, playback } = useSamples(
    seed,
    `${model}|${truth}|${prior.a}|${prior.b}`,
    draw,
    {
      max: MAX_OBSERVATIONS,
      rate: OBSERVATIONS_PER_SECOND,
    },
  );
  const posterior = conjugateUpdate(model, prior, samples, DATA_SD * DATA_SD);
  const n = samples.length;
  const total = samples.reduce((sum, x) => sum + x, 0);
  const lo = spec.quantile(posterior, (1 - CREDIBLE) / 2);
  const hi = spec.quantile(posterior, (1 + CREDIBLE) / 2);
  const domain = spec.domain(prior, truth);
  const description =
    `${spec.title}. A priori ${spec.hyper(prior)}; tras ${n} observaciones, a posteriori ${spec.hyper(posterior)}, ` +
    `con media ${formatNumber(conjugateMean(model, posterior), 3)} e intervalo del 95 % entre ${formatNumber(lo, 3)} y ${formatNumber(hi, 3)}. Valor verdadero ${formatNumber(truth)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: v }}
      controls={
        <QuickSample count={QUICK_OBSERVATIONS} onClick={() => stepMany(QUICK_OBSERVATIONS)} />
      }
      readouts={[
        { label: 'Observaciones n', value: String(n), color: DATA_COLORS.tertiary },
        {
          label: model === 'beta-bernoulli' ? 'Éxitos' : 'Suma de los datos',
          value: formatNumber(total, 2),
        },
        { label: 'A posteriori', value: spec.hyper(posterior), color: DATA_COLORS.primary },
        {
          label: `Media a posteriori de ${spec.parameter}`,
          value: formatNumber(conjugateMean(model, posterior), 3),
        },
        {
          label: 'Intervalo creíble del 95 %',
          value: `${formatNumber(lo, 3)} a ${formatNumber(hi, 3)}`,
        },
      ]}
      legend={[
        { label: 'A priori', color: DATA_COLORS.muted, shape: 'dashed' as const },
        { label: 'A posteriori', color: DATA_COLORS.primary, shape: 'line' as const },
        { label: 'Valor verdadero', color: DATA_COLORS.secondary, shape: 'line' as const },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine tex={spec.tex(prior, posterior, n, Math.round(total * 100) / 100)} />
      <p className={styles.stage} aria-live="polite">
        {n === 0
          ? 'Sin datos: la posterior es igual a la a priori. Reproduce para agregar observaciones.'
          : `Última observación: ${formatNumber(samples[n - 1] ?? 0, 2)}.`}
      </p>
      <FunctionPlot
        xDomain={domain}
        label={description}
        xLabel={spec.parameter}
        curves={[
          { f: spec.density(prior), color: DATA_COLORS.muted, dashed: true },
          { f: spec.density(posterior), color: DATA_COLORS.primary, width: 2.5 },
        ]}
        background={({ x, box }) => (
          <rect
            x={x(lo)}
            y={box.inner.top}
            width={Math.max(0, x(hi) - x(lo))}
            height={box.inner.height}
            fill={DATA_COLORS.primary}
            fillOpacity={0.08}
            aria-hidden="true"
          />
        )}
      >
        {({ x, box }) => (
          <line
            x1={x(truth)}
            x2={x(truth)}
            y1={box.inner.top}
            y2={box.inner.top + box.inner.height}
            stroke={DATA_COLORS.secondary}
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
