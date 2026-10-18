import { useCallback, useMemo } from 'react';
import { normal } from '../../../lib/distributions/index.ts';
import {
  mixtureDensity,
  mixtureMoments,
  sampleMixture,
  type MixtureComponent,
} from '../../../lib/distributions/families.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import type { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
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
import type { FamilyLabConfig } from './schema.ts';

const MAX_SAMPLES = 4000;
const SAMPLES_PER_SECOND = 40;
const QUICK_SAMPLES = 1000;
const BINS = 48;
/** Standard deviations shown on each side of the outer components. */
const REACH = 4;
const GRID = 400;

interface MixtureViewProps {
  config: FamilyLabConfig;
  conceptId: string;
  title: string;
}

/** Count of local maxima of the density on a fine grid, and its highest value. */
function scanDensity(
  f: (x: number) => number,
  domain: [number, number],
): { modes: number; peak: number } {
  let modes = 0;
  let previous = f(domain[0]);
  let peak = previous;
  let rising = false;
  for (let i = 1; i <= GRID; i += 1) {
    const value = f(domain[0] + ((domain[1] - domain[0]) * i) / GRID);
    peak = Math.max(peak, value);
    if (value > previous) rising = true;
    else if (value < previous && rising) {
      modes += 1;
      rising = false;
    }
    previous = value;
  }
  return { modes, peak };
}

/**
 * A mixture of two normals: each component weighted by its probability
 * (dashed), their sum (solid) and samples colored by the component that
 * produced them, so the two populations behind one histogram are visible.
 */
export function MixtureView({ config, conceptId, title }: MixtureViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      num('w', 'Peso del primer grupo', 'π', 0.02, 0.98, 0.01, initial.w ?? 0.4),
      num('m1', 'Media del primer grupo', 'μ₁', -5, 5, 0.1, initial.m1 ?? -1.5),
      num('s1', 'Desviación del primer grupo', 'σ₁', 0.2, 3, 0.05, initial.s1 ?? 0.8),
      num('m2', 'Media del segundo grupo', 'μ₂', -5, 5, 0.1, initial.m2 ?? 1.5),
      num('s2', 'Desviación del segundo grupo', 'σ₂', 0.2, 3, 0.05, initial.s2 ?? 1),
    ],
    [initial.w, initial.m1, initial.s1, initial.m2, initial.s2],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number>;
  const components = useMemo<MixtureComponent[]>(
    () => [
      { weight: Number(v.w), mean: Number(v.m1), sd: Number(v.s1) },
      { weight: 1 - Number(v.w), mean: Number(v.m2), sd: Number(v.s2) },
    ],
    [v.w, v.m1, v.s1, v.m2, v.s2],
  );
  const moments = mixtureMoments(components);
  const f = (x: number) => mixtureDensity(components, x);
  const domain: [number, number] = [
    Math.min(...components.map((c) => c.mean - REACH * c.sd)),
    Math.max(...components.map((c) => c.mean + REACH * c.sd)),
  ];
  const { modes, peak } = scanDensity(f, domain);

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const draw = useCallback((random: Random) => sampleMixture(random, components), [components]);
  const { samples, stepMany, playback } = useSamples(
    seed,
    components.map((c) => `${c.weight},${c.mean},${c.sd}`).join('|'),
    draw,
    { max: MAX_SAMPLES, rate: SAMPLES_PER_SECOND },
  );
  const width = (domain[1] - domain[0]) / BINS;
  const histogram = [0, 1].map((component) => {
    const counts = new Array<number>(BINS).fill(0);
    for (const s of samples) {
      if (s.component !== component || s.value < domain[0] || s.value >= domain[1]) continue;
      const bin = Math.floor((s.value - domain[0]) / width);
      counts[bin] = (counts[bin] ?? 0) + 1;
    }
    return counts;
  });
  // Stacked bars: the second group sits on top of the first.
  const bars = (component: number) =>
    (histogram[0] ?? []).map((_, i) => {
      const below = component === 1 ? (histogram[0]?.[i] ?? 0) : 0;
      const own = histogram[component]?.[i] ?? 0;
      return {
        x0: domain[0] + i * width,
        x1: domain[0] + (i + 1) * width,
        value: samples.length === 0 ? 0 : (below + own) / (samples.length * width),
      };
    });

  const description =
    `Mezcla de dos normales con pesos ${formatNumber(Number(v.w))} y ${formatNumber(1 - Number(v.w))}. ` +
    `Media ${formatNumber(moments.mean)}, varianza ${formatNumber(moments.variance)} (${formatNumber(moments.within)} dentro de los grupos y ${formatNumber(moments.between)} entre grupos). ` +
    `La densidad tiene ${modes} ${modes === 1 ? 'moda' : 'modas'}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: v }}
      controls={<QuickSample count={QUICK_SAMPLES} onClick={() => stepMany(QUICK_SAMPLES)} />}
      readouts={[
        { label: 'Media de la mezcla', value: formatNumber(moments.mean) },
        {
          label: 'Varianza total',
          value: formatNumber(moments.variance),
          color: DATA_COLORS.primary,
        },
        { label: 'Varianza dentro de los grupos', value: formatNumber(moments.within) },
        { label: 'Varianza entre grupos', value: formatNumber(moments.between) },
        { label: 'Número de modas', value: String(modes) },
        { label: 'Muestras', value: String(samples.length), color: DATA_COLORS.tertiary },
      ]}
      legend={[
        { label: 'Densidad de la mezcla', color: DATA_COLORS.primary, shape: 'line' as const },
        { label: 'Primer grupo ponderado', color: seriesColor(1), shape: 'dashed' as const },
        { label: 'Segundo grupo ponderado', color: seriesColor(2), shape: 'dashed' as const },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine
        tex={`f(x) = ${formatNumber(Number(v.w))}\\,\\varphi\\!\\left(x;\\ ${formatNumber(Number(v.m1))},\\ ${formatNumber(Number(v.s1))}^{2}\\right) + ${formatNumber(1 - Number(v.w))}\\,\\varphi\\!\\left(x;\\ ${formatNumber(Number(v.m2))},\\ ${formatNumber(Number(v.s2))}^{2}\\right)`}
      />
      <FunctionPlot
        xDomain={domain}
        yDomain={[0, Math.max(peak, ...bars(1).map((bar) => bar.value)) * 1.1]}
        label={description}
        xLabel="x"
        curves={[
          {
            f: (x) => Number(v.w) * normal(Number(v.m1), Number(v.s1)).pdf(x),
            color: seriesColor(1),
            dashed: true,
          },
          {
            f: (x) => (1 - Number(v.w)) * normal(Number(v.m2), Number(v.s2)).pdf(x),
            color: seriesColor(2),
            dashed: true,
          },
          { f, color: DATA_COLORS.primary, width: 2.5 },
        ]}
        background={({ x, y }) => (
          <g aria-hidden="true">
            <Bars bars={bars(1)} xScale={x} yScale={y} color={seriesColor(2)} opacity={0.35} />
            <Bars bars={bars(0)} xScale={x} yScale={y} color={seriesColor(1)} opacity={0.45} />
          </g>
        )}
      />
    </VizFrame>
  );
}
