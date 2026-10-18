import { useCallback, useMemo } from 'react';
import { aliasDraw, aliasTable } from '../../../lib/random/generators.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import type { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CasePanel, QuickSample } from '../MultivariateExplorer/CasePanel.tsx';
import { loadPreset, num, useSamples } from '../MultivariateExplorer/shared.ts';
import styles from './RandomLab.module.css';
import type { RandomLabConfig } from './schema.ts';

const DEFAULT_WEIGHTS = [0.1, 0.5, 0.15, 0.25];
const MAX_DRAWS = 5000;
// A first batch keeps the frequency panel from opening empty.
const INITIAL_DRAWS = 200;
const DRAWS_PER_SECOND = 2;
const QUICK_DRAWS = 1000;
const GAP = 8;

interface Draw {
  u: number;
  outcome: number;
}

interface AliasViewProps {
  config: RandomLabConfig;
  conceptId: string;
  title: string;
}

/**
 * Alias method: the k probabilities, scaled by k, are cut and stacked so
 * that every column has height one and holds at most two outcomes, its own
 * and one alias. A draw picks a column uniformly and flips one biased coin.
 * Below, the frequencies of the drawn outcomes against the probabilities.
 */
export function AliasView({ config, conceptId, title }: AliasViewProps) {
  const start = config.pesos ?? DEFAULT_WEIGHTS;
  const k = start.length;
  const definitions = useMemo<ParameterDefinition[]>(
    () =>
      start.map((w, i) =>
        num(
          `w${i}`,
          `Peso de la categoría ${i + 1}`,
          `w${i + 1}`,
          0.01,
          1,
          0.01,
          config.valores?.[`w${i}`] ?? w,
        ),
      ),
    [start, config.valores],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number>;
  const weights = useMemo(() => Array.from({ length: k }, (_, i) => Number(v[`w${i}`])), [k, v]);
  const total = weights.reduce((s, w) => s + w, 0);
  const probabilities = weights.map((w) => w / total);
  const table = useMemo(() => aliasTable(weights), [weights]);

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const draw = useCallback(
    (random: Random): Draw => {
      const u = random.uniform();
      return { u, outcome: aliasDraw(table, u) };
    },
    [table],
  );
  const { samples, stepMany, playback } = useSamples(seed, weights.join(','), draw, {
    max: MAX_DRAWS,
    rate: DRAWS_PER_SECOND,
    initial: INITIAL_DRAWS,
  });
  const counts = new Array<number>(k).fill(0);
  for (const s of samples) counts[s.outcome] = (counts[s.outcome] ?? 0) + 1;
  const last = samples[samples.length - 1];
  const lastColumn = last ? Math.min(k - 1, Math.floor(last.u * k)) : -1;
  const lastCoin = last ? last.u * k - lastColumn : 0;
  const description =
    `Tabla de alias para ${k} categorías con probabilidades ${probabilities.map((p) => formatNumber(p, 3)).join(', ')}. ` +
    `${samples.length} extracciones; frecuencias ${counts.map((c) => formatNumber(samples.length === 0 ? 0 : c / samples.length, 3)).join(', ')}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: v }}
      controls={<QuickSample count={QUICK_DRAWS} onClick={() => stepMany(QUICK_DRAWS)} />}
      readouts={[
        ...probabilities.map((p, i) => ({
          label: `Categoría ${i + 1}: probabilidad y frecuencia`,
          value: `${formatNumber(p, 3)} y ${samples.length === 0 ? 'sin datos' : formatNumber((counts[i] ?? 0) / samples.length, 3)}`,
          color: seriesColor(i),
        })),
        ...(last
          ? [
              {
                label: 'Última extracción',
                value: `columna ${lastColumn + 1}, moneda ${formatNumber(lastCoin, 3)}: categoría ${last.outcome + 1}`,
              },
            ]
          : []),
      ]}
      legend={probabilities.map((_, i) => ({ label: `Categoría ${i + 1}`, color: seriesColor(i) }))}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine
        tex={`j = \\lfloor kU \\rfloor,\\quad X = \\begin{cases} j & \\text{si } kU - j < q_j \\\\ a_j & \\text{si no} \\end{cases},\\qquad k = ${k}`}
      />
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Tabla: cada columna mide 1</p>
          <ChartSvg label={`Tabla de alias de ${k} columnas`} aspect={0.8} maxHeight={320}>
            {(box) => {
              const width = (box.inner.width - GAP * (k - 1)) / k;
              const height = box.inner.height;
              return (
                <g aria-hidden="true">
                  {table.probability.map((q, j) => {
                    const left = box.inner.left + j * (width + GAP);
                    const own = q * height;
                    const bottom = box.inner.top + height;
                    return (
                      <g key={j}>
                        <rect
                          x={left}
                          y={bottom - own}
                          width={width}
                          height={own}
                          fill={seriesColor(j)}
                          fillOpacity={0.85}
                        />
                        <rect
                          x={left}
                          y={box.inner.top}
                          width={width}
                          height={height - own}
                          fill={seriesColor(table.alias[j] ?? j)}
                          fillOpacity={0.4}
                        />
                        {j === lastColumn && (
                          <line
                            x1={left - 3}
                            x2={left + width + 3}
                            y1={bottom - lastCoin * height}
                            y2={bottom - lastCoin * height}
                            stroke={DATA_COLORS.text}
                            strokeWidth={2.5}
                          />
                        )}
                        <text
                          x={left + width / 2}
                          y={bottom + 14}
                          textAnchor="middle"
                          className={styles.label}
                        >
                          {j + 1}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            }}
          </ChartSvg>
        </div>
        <div>
          <p className={styles.panelTitle}>Probabilidad (contorno) y frecuencia</p>
          <ChartSvg
            label="Frecuencias de las categorías extraídas frente a sus probabilidades"
            aspect={0.8}
            maxHeight={320}
          >
            {(box) => {
              const width = (box.inner.width - GAP * (k - 1)) / k;
              const peak =
                Math.max(
                  ...probabilities,
                  ...counts.map((c) => (samples.length === 0 ? 0 : c / samples.length)),
                ) * 1.1;
              const scale = (p: number) => (p / peak) * box.inner.height;
              const bottom = box.inner.top + box.inner.height;
              return (
                <g aria-hidden="true">
                  {probabilities.map((p, j) => {
                    const left = box.inner.left + j * (width + GAP);
                    const freq = samples.length === 0 ? 0 : (counts[j] ?? 0) / samples.length;
                    return (
                      <g key={j}>
                        <rect
                          x={left}
                          y={bottom - scale(freq)}
                          width={width}
                          height={scale(freq)}
                          fill={seriesColor(j)}
                          fillOpacity={0.7}
                        />
                        <rect
                          x={left}
                          y={bottom - scale(p)}
                          width={width}
                          height={scale(p)}
                          fill="none"
                          stroke={DATA_COLORS.text}
                          strokeWidth={1.5}
                          strokeDasharray="4 3"
                        />
                        <text
                          x={left + width / 2}
                          y={bottom + 14}
                          textAnchor="middle"
                          className={styles.label}
                        >
                          {j + 1}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            }}
          </ChartSvg>
        </div>
      </div>
    </VizFrame>
  );
}
