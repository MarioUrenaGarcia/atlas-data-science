import { useCallback, useMemo } from 'react';
import { normal } from '../../../lib/distributions/index.ts';
import {
  compoundPoissonMoments,
  sampleCompoundPoisson,
} from '../../../lib/distributions/families.ts';
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
import styles from './FamilyLab.module.css';
import type { FamilyLabConfig } from './schema.ts';

const MAX_SAMPLES = 5000;
const SAMPLES_PER_SECOND = 30;
const QUICK_SAMPLES = 1000;
/** Totals drawn before any interaction, so the histogram is readable from the start. */
const INITIAL_SAMPLES = 1000;
const BINS = 40;
/** The plotted range covers the mean plus this many standard deviations. */
const REACH = 4;

interface CompoundViewProps {
  config: FamilyLabConfig;
  conceptId: string;
  title: string;
}

/**
 * A compound Poisson sum, such as the total claimed in a year: the number
 * of claims is Poisson and each claim is gamma. The histogram shows the
 * simulated totals, the bar at zero is the atom of years without claims
 * and the dashed curve is the normal with the same mean and variance.
 */
export function CompoundView({ config, conceptId, title }: CompoundViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      num('lambda', 'Número medio de eventos', 'λ', 0.2, 20, 0.1, initial.lambda ?? 3, 1),
      num('media', 'Monto medio de cada evento', 'm', 0.2, 5, 0.1, initial.media ?? 2, 1),
      num('forma', 'Forma de cada monto', 'k', 0.5, 6, 0.1, initial.forma ?? 2, 1),
    ],
    [initial.lambda, initial.media, initial.forma],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number>;
  const lambda = Number(v.lambda);
  const shape = Number(v.forma);
  const rate = shape / Number(v.media);
  const moments = compoundPoissonMoments(lambda, shape, rate);
  const sd = Math.sqrt(moments.variance);
  const upper = moments.mean + REACH * sd;
  const width = upper / BINS;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const draw = useCallback(
    (random: Random) => sampleCompoundPoisson(random, lambda, shape, rate),
    [lambda, shape, rate],
  );
  const { samples, stepMany, playback } = useSamples(seed, `${lambda}|${shape}|${rate}`, draw, {
    max: MAX_SAMPLES,
    rate: SAMPLES_PER_SECOND,
    initial: INITIAL_SAMPLES,
  });
  const zeros = samples.filter((s) => s.count === 0).length;
  const counts = new Array<number>(BINS).fill(0);
  for (const s of samples) {
    if (s.count === 0 || s.total >= upper) continue;
    const bin = Math.floor(s.total / width);
    counts[bin] = (counts[bin] ?? 0) + 1;
  }
  const bars = counts.map((count, i) => ({
    x0: i * width,
    x1: (i + 1) * width,
    value: samples.length === 0 ? 0 : count / (samples.length * width),
  }));
  const simulatedMean =
    samples.length === 0 ? Number.NaN : samples.reduce((s, x) => s + x.total, 0) / samples.length;
  const approx = normal(moments.mean, sd);

  const description =
    `Suma compuesta con ${formatNumber(lambda, 1)} eventos en promedio y montos gamma de media ${formatNumber(Number(v.media), 1)}. ` +
    `Media ${formatNumber(moments.mean)}, varianza ${formatNumber(moments.variance)}, probabilidad de total cero ${formatProbability(moments.zero)}. ${samples.length} totales simulados.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: v }}
      controls={<QuickSample count={QUICK_SAMPLES} onClick={() => stepMany(QUICK_SAMPLES)} />}
      readouts={[
        {
          label: 'Media E[S] = λ E[X]',
          value: formatNumber(moments.mean),
          color: DATA_COLORS.primary,
        },
        { label: 'Varianza λ E[X²]', value: formatNumber(moments.variance) },
        {
          label: 'P(S = 0) = e^(-λ)',
          value: formatProbability(moments.zero),
          color: DATA_COLORS.secondary,
        },
        { label: 'Totales simulados', value: String(samples.length), color: DATA_COLORS.tertiary },
        {
          label: 'Fracción simulada en cero',
          value: samples.length === 0 ? 'sin datos' : formatProbability(zeros / samples.length),
        },
        {
          label: 'Media simulada',
          value: Number.isNaN(simulatedMean) ? 'sin datos' : formatNumber(simulatedMean),
        },
      ]}
      legend={[
        { label: 'Totales simulados', color: DATA_COLORS.tertiary },
        { label: 'Años sin eventos (masa en cero)', color: DATA_COLORS.secondary },
        {
          label: 'Normal con la misma media y varianza',
          color: DATA_COLORS.muted,
          shape: 'dashed' as const,
        },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine
        tex={`S = \\sum_{i=1}^{N} X_i,\\quad N \\sim \\operatorname{Poisson}(${formatNumber(lambda, 1)}),\\quad X_i \\sim \\operatorname{Gamma}(${formatNumber(shape, 1)},\\ ${formatNumber(rate, 2)})`}
      />
      <p className={styles.stage}>
        {`Masa en cero: ${formatProbability(moments.zero)}${samples.length > 0 ? `; simulada ${formatProbability(zeros / samples.length)}` : ''}.`}
      </p>
      <FunctionPlot
        xDomain={[-width, upper]}
        label={description}
        xLabel="total s"
        curves={[{ f: (x) => (x < 0 ? 0 : approx.pdf(x)), color: DATA_COLORS.muted, dashed: true }]}
        background={({ x, y }) => (
          <g aria-hidden="true">
            <Bars bars={bars} xScale={x} yScale={y} color={DATA_COLORS.tertiary} opacity={0.6} />
            {samples.length > 0 && (
              <rect
                x={x(-width * 0.4)}
                width={x(width * 0.4) - x(-width * 0.4)}
                y={y(Math.min(y.domain()[1] ?? 1, zeros / (samples.length * width)))}
                height={Math.max(
                  0,
                  y(0) - y(Math.min(y.domain()[1] ?? 1, zeros / (samples.length * width))),
                )}
                fill={DATA_COLORS.secondary}
              />
            )}
          </g>
        )}
      />
    </VizFrame>
  );
}
