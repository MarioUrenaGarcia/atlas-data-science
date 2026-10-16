import { useMemo } from 'react';
import { serialCorrelation } from '../../../lib/random/generators.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CasePanel } from '../MultivariateExplorer/CasePanel.tsx';
import { loadPreset, num } from '../MultivariateExplorer/shared.ts';
import { GENERATOR_IDS, type GeneratorId, type RandomLabConfig } from './schema.ts';
import { GENERATOR_LABELS, take, uniformStream } from './sources.ts';
import { SquarePlot } from './SquarePlot.tsx';

/** Width of the slice of the middle coordinate in the triples view. */
const SLICE = 0.01;
/** Triples generated to fill the thin slice with enough points. */
const TRIPLES = 60000;

interface PairsViewProps {
  config: RandomLabConfig;
  title: string;
}

/**
 * Consecutive outputs plotted against each other. A good generator fills
 * the square evenly; a poor one leaves visible structure: the lattice of a
 * small linear congruential generator or, in the slice of triples with the
 * middle value fixed, the parallel lines of RANDU.
 */
export function PairsView({ config, title }: PairsViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select' as const,
        key: 'generador',
        label: 'Generador',
        options: GENERATOR_IDS.map((id) => ({ value: id, label: GENERATOR_LABELS[id] })),
        default: config.generador ?? 'mt',
      },
      num('n', 'Número de pares', 'n', 50, 4000, 50, initial.n ?? 1000, 0),
      num('semilla', 'Semilla del generador', 's', 1, 9999, 1, initial.semilla ?? 1, 0),
      {
        type: 'toggle' as const,
        key: 'ternas',
        label: 'Rebanada de ternas (uₙ, uₙ₊₂) con uₙ₊₁ cerca de 0.5',
        default: config.ternas ?? false,
      },
    ],
    [config.generador, config.ternas, initial.n, initial.semilla],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, string | number | boolean>;
  const id = v.generador as GeneratorId;
  const n = Number(v.n);
  const seed = Number(v.semilla);
  const triples = Boolean(v.ternas);
  const points = useMemo<[number, number][]>(() => {
    const stream = uniformStream(id, seed);
    if (!triples) {
      const values = take(stream, n + 1);
      return values.slice(0, n).map((u, i) => [u, values[i + 1] ?? 0]);
    }
    const result: [number, number][] = [];
    for (let i = 0; i < TRIPLES && result.length < n; i += 1) {
      const [u, w, z] = [stream(), stream(), stream()];
      if (Math.abs(w - 0.5) < SLICE / 2) result.push([u, z]);
    }
    return result;
  }, [id, seed, n, triples]);
  const correlation = useMemo(
    () => serialCorrelation(take(uniformStream(id, seed), Math.max(n, 3))),
    [id, seed, n],
  );
  const distinct = new Set(points.map(([x, y]) => `${x.toFixed(6)},${y.toFixed(6)}`)).size;
  const description =
    `${GENERATOR_LABELS[id]}, ${points.length} ${triples ? 'ternas en la rebanada' : 'pares consecutivos'}. ` +
    `Correlación serial ${formatNumber(correlation, 3)}; ${distinct} puntos distintos.`;

  return (
    <VizFrame
      title={title}
      parameters={{ ...parameters, values: v }}
      readouts={[
        {
          label: triples ? 'Ternas en la rebanada' : 'Pares dibujados',
          value: String(points.length),
          color: DATA_COLORS.primary,
        },
        { label: 'Puntos distintos', value: String(distinct) },
        { label: 'Correlación serial de orden 1', value: formatNumber(correlation, 4) },
      ]}
      legend={[
        {
          label: triples ? '(uₙ, uₙ₊₂) con uₙ₊₁ en [0.495, 0.505]' : '(uₙ, uₙ₊₁)',
          color: DATA_COLORS.primary,
        },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine
        tex={
          triples
            ? '\\big(u_n,\\ u_{n+2}\\big)\\ \\text{con}\\ |u_{n+1} - 0.5| < 0.005'
            : '\\big(u_n,\\ u_{n+1}\\big),\\quad n = 1, 2, \\dots'
        }
      />
      <SquarePlot
        domain={[0, 1]}
        label={description}
        xLabel={triples ? 'uₙ' : 'uₙ'}
        yLabel={triples ? 'uₙ₊₂' : 'uₙ₊₁'}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {points.map(([px, py], i) => (
              <circle
                key={i}
                cx={x(px)}
                cy={y(py)}
                r={1.8}
                fill={DATA_COLORS.primary}
                fillOpacity={0.7}
              />
            ))}
          </g>
        )}
      </SquarePlot>
    </VizFrame>
  );
}
