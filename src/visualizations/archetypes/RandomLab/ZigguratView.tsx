import { useCallback, useMemo } from 'react';
import { buildZiggurat, type Ziggurat } from '../../../lib/random/generators.ts';
import { formatNumber, formatProbability } from '../../../lib/format/number.ts';
import type { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CasePanel, QuickSample } from '../MultivariateExplorer/CasePanel.tsx';
import { loadPreset, num, useSamples } from '../MultivariateExplorer/shared.ts';
import type { RandomLabConfig } from './schema.ts';

const MAX_DRAWS = 3000;
const DRAWS_PER_SECOND = 3;
const QUICK_DRAWS = 500;
const INITIAL_DRAWS = 200;
const TAIL_EXTRA = 1.2;

const f = (x: number) => Math.exp(-(x * x) / 2);

type Outcome = 'nucleo' | 'prueba' | 'rechazo' | 'cola';

interface Draw {
  layer: number;
  x: number;
  y: number;
  outcome: Outcome;
}

/** One attempt of the ziggurat method for the half normal. */
function attempt(random: Random, z: Ziggurat): Draw {
  const n = z.edges.length;
  const layer = Math.floor(random.uniform() * n);
  const r = z.edges[0] ?? 1;
  if (layer === 0) {
    const x = (random.uniform() * z.area) / f(r);
    if (x < r) return { layer, x, y: random.uniform() * f(r), outcome: 'nucleo' };
    // Tail beyond r by Marsaglia's exponential method.
    for (;;) {
      const t = -Math.log(1 - random.uniform()) / r;
      const s = -Math.log(1 - random.uniform());
      if (2 * s > t * t)
        return { layer, x: r + t, y: random.uniform() * f(r + t), outcome: 'cola' };
    }
  }
  const outer = z.edges[layer - 1] ?? r;
  const inner = z.edges[layer] ?? 0;
  const x = random.uniform() * outer;
  const bottom = f(outer);
  const top = f(inner);
  const y = bottom + random.uniform() * (top - bottom);
  if (x < inner) return { layer, x, y, outcome: 'nucleo' };
  return { layer, x, y, outcome: y < f(x) ? 'prueba' : 'rechazo' };
}

const COLORS: Record<Outcome, string> = {
  nucleo: DATA_COLORS.tertiary,
  prueba: DATA_COLORS.primary,
  rechazo: DATA_COLORS.secondary,
  cola: DATA_COLORS.quaternary,
};

interface ZigguratViewProps {
  config: RandomLabConfig;
  conceptId: string;
  title: string;
}

/**
 * The ziggurat for the half normal: the area under the curve is covered by
 * layers of equal area. A draw picks a layer at random and a point in it;
 * most points land in the core of the layer, under the curve for sure, and
 * are accepted without evaluating the exponential.
 */
export function ZigguratView({ config, conceptId, title }: ZigguratViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [num('capas', 'Número de capas', 'n', 4, 32, 1, initial.capas ?? 8, 0)],
    [initial.capas],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number>;
  const layers = Number(v.capas);
  const z = useMemo(() => buildZiggurat(layers), [layers]);
  const r = z.edges[0] ?? 1;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const draw = useCallback((random: Random) => attempt(random, z), [z]);
  const { samples, stepMany, playback } = useSamples(seed, `zig|${layers}`, draw, {
    max: MAX_DRAWS,
    rate: DRAWS_PER_SECOND,
    initial: INITIAL_DRAWS,
  });
  const count = (o: Outcome) => samples.filter((s) => s.outcome === o).length;
  const fast = samples.length === 0 ? 0 : count('nucleo') / samples.length;
  const description =
    `Zigurat de ${layers} capas con borde r = ${formatNumber(r, 4)} y área por capa ${formatNumber(z.area, 4)}. ` +
    `${samples.length} intentos: ${count('nucleo')} aceptados directamente en el núcleo, ${count('prueba')} tras evaluar la densidad, ${count('rechazo')} rechazados y ${count('cola')} de la cola.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: v }}
      controls={<QuickSample count={QUICK_DRAWS} onClick={() => stepMany(QUICK_DRAWS)} />}
      readouts={[
        { label: 'Borde de la base r', value: formatNumber(r, 4) },
        { label: 'Área de cada capa', value: formatNumber(z.area, 4) },
        { label: 'Intentos', value: String(samples.length) },
        {
          label: 'Aceptados sin evaluar la densidad',
          value: formatProbability(fast),
          color: DATA_COLORS.tertiary,
        },
        { label: 'Rechazados', value: String(count('rechazo')), color: DATA_COLORS.secondary },
      ]}
      legend={[
        { label: 'Núcleo: aceptado directo', color: COLORS.nucleo },
        { label: 'Borde: aceptado tras evaluar', color: COLORS.prueba },
        { label: 'Borde: rechazado', color: COLORS.rechazo },
        { label: 'Cola más allá de r', color: COLORS.cola },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine
        tex={`x_{i+1} = f^{-1}\\!\\left(f(x_i) + \\frac{v}{x_i}\\right),\\quad f(x) = e^{-x^{2}/2},\\quad r = ${formatNumber(r, 3)},\\ v = ${formatNumber(z.area, 4)}`}
      />
      <FunctionPlot
        xDomain={[0, r + TAIL_EXTRA]}
        yDomain={[0, 1.05]}
        label={description}
        xLabel="x"
        curves={[{ f, color: DATA_COLORS.text, width: 2.5 }]}
        background={({ x, y }) => (
          <g aria-hidden="true">
            <rect
              x={x(0)}
              y={y(f(r))}
              width={x(r) - x(0)}
              height={y(0) - y(f(r))}
              fill={seriesColor(0)}
              fillOpacity={0.12}
              stroke={seriesColor(0)}
            />
            {z.edges.slice(1).map((inner, i) => {
              const outer = z.edges[i] ?? r;
              return (
                <g key={i}>
                  <rect
                    x={x(0)}
                    y={y(f(inner))}
                    width={x(outer) - x(0)}
                    height={y(f(outer)) - y(f(inner))}
                    fill={seriesColor(0)}
                    fillOpacity={i % 2 === 0 ? 0.06 : 0.12}
                    stroke={seriesColor(0)}
                  />
                  <line
                    x1={x(inner)}
                    x2={x(inner)}
                    y1={y(f(inner))}
                    y2={y(f(outer))}
                    stroke={seriesColor(0)}
                    strokeDasharray="3 3"
                  />
                </g>
              );
            })}
          </g>
        )}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {samples.slice(-800).map((s, i) => (
              <circle
                key={i}
                cx={x(s.x)}
                cy={y(s.y)}
                r={2}
                fill={COLORS[s.outcome]}
                fillOpacity={0.8}
              />
            ))}
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
