import { useCallback, useMemo } from 'react';
import {
  dirichletMoments,
  dirichletPdf,
  sampleDirichlet,
} from '../../../lib/distributions/multivariate.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import type { Vector } from '../../../lib/linalg/index.ts';
import type { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MultivariateExplorer.module.css';
import type { MultivariateConfig } from './schema.ts';
import { CasePanel, QuickSample } from './CasePanel.tsx';
import { loadPreset, num, useSamples } from './shared.ts';

/** Subdivisions of each side of the simplex for the density shading. */
const GRID = 36;
const MAX_SAMPLES = 2000;
const SAMPLES_PER_SECOND = 30;
const QUICK_SAMPLES = 300;
const HEIGHT = Math.sqrt(3) / 2;
/** Shading saturates at this quantile of the cell densities, so infinite corners do not wash out the rest. */
const SHADE_QUANTILE = 0.95;

const toPlane = (p: Vector): [number, number] => [
  (p[1] ?? 0) + (p[2] ?? 0) / 2,
  (p[2] ?? 0) * HEIGHT,
];

interface Cell {
  points: [number, number][];
  density: number;
}

function simplexCells(alpha: Vector): Cell[] {
  const cells: Cell[] = [];
  const at = (i: number, j: number): Vector => [1 - (i + j) / GRID, i / GRID, j / GRID];
  for (let i = 0; i < GRID; i += 1) {
    for (let j = 0; j < GRID - i; j += 1) {
      const triangles: Vector[][] = [[at(i, j), at(i + 1, j), at(i, j + 1)]];
      if (i + j < GRID - 1) triangles.push([at(i + 1, j), at(i + 1, j + 1), at(i, j + 1)]);
      for (const corners of triangles) {
        const center = [0, 1, 2].map((k) => corners.reduce((s, c) => s + (c[k] ?? 0), 0) / 3);
        cells.push({ points: corners.map(toPlane), density: dirichletPdf(center, alpha) });
      }
    }
  }
  return cells;
}

interface DirichletViewProps {
  config: MultivariateConfig;
  conceptId: string;
  title: string;
}

/**
 * Dirichlet distribution on the triangle of proportions (p₁, p₂, p₃): the
 * shading is the density, darker where it is higher, and samples are
 * vectors of three proportions that always add up to one.
 */
export function DirichletView({ config, conceptId, title }: DirichletViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      num('a1', 'Concentración α₁', 'α₁', 0.2, 20, 0.1, initial.a1 ?? 2, 1),
      num('a2', 'Concentración α₂', 'α₂', 0.2, 20, 0.1, initial.a2 ?? 3, 1),
      num('a3', 'Concentración α₃', 'α₃', 0.2, 20, 0.1, initial.a3 ?? 5, 1),
    ],
    // The definitions depend only on the frontmatter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number>;
  const alpha = useMemo(() => [Number(v.a1), Number(v.a2), Number(v.a3)], [v.a1, v.a2, v.a3]);
  const total = alpha.reduce((a, b) => a + b, 0);
  const { mean, variance } = dirichletMoments(alpha);
  const cells = useMemo(() => simplexCells(alpha), [alpha]);
  const cap = useMemo(() => {
    const sorted = cells
      .map((c) => c.density)
      .filter(Number.isFinite)
      .sort((a, b) => a - b);
    return sorted[Math.floor(SHADE_QUANTILE * (sorted.length - 1))] ?? 1;
  }, [cells]);

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const draw = useCallback((random: Random) => sampleDirichlet(random, alpha), [alpha]);
  const { samples, stepMany, playback } = useSamples(seed, alpha.join(','), draw, {
    max: MAX_SAMPLES,
    rate: SAMPLES_PER_SECOND,
  });
  const sampleMean = [0, 1, 2].map((k) =>
    samples.length === 0
      ? Number.NaN
      : samples.reduce((s, p) => s + (p[k] ?? 0), 0) / samples.length,
  );
  const last = samples[samples.length - 1];

  const description =
    `Dirichlet con α = (${alpha.map((a) => formatNumber(a, 1)).join(', ')}), suma ${formatNumber(total, 1)}. ` +
    `Medias ${mean.map((m) => formatNumber(m, 3)).join(', ')}. ${samples.length} vectores simulados.`;
  const tex = `\\mathbf{p} \\sim \\operatorname{Dir}(${alpha.map((a) => formatNumber(a, 1)).join(',\\ ')}),\\quad \\mathbb{E}[\\mathbf{p}] = \\frac{\\boldsymbol{\\alpha}}{\\alpha_0} = (${mean.map((m) => formatNumber(m, 3)).join(',\\ ')}),\\quad \\alpha_0 = ${formatNumber(total, 1)}`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: v }}
      controls={<QuickSample count={QUICK_SAMPLES} onClick={() => stepMany(QUICK_SAMPLES)} />}
      readouts={[
        { label: 'Suma α₀', value: formatNumber(total, 2) },
        ...[0, 1, 2].map((k) => ({
          label: `Media y varianza de p${['₁', '₂', '₃'][k]}`,
          value: `${formatNumber(mean[k] ?? 0, 3)}, ${formatNumber(variance[k] ?? 0, 4)}`,
        })),
        { label: 'Vectores simulados', value: String(samples.length), color: DATA_COLORS.tertiary },
        {
          label: 'Medias de las muestras',
          value:
            samples.length === 0
              ? 'sin datos'
              : sampleMean.map((m) => formatNumber(m, 3)).join(', '),
        },
        ...(last
          ? [{ label: 'Último vector', value: last.map((p) => formatNumber(p, 2)).join(', ') }]
          : []),
      ]}
      legend={[
        { label: 'Densidad (más oscuro, más alta)', color: DATA_COLORS.primary },
        { label: 'Vectores simulados', color: DATA_COLORS.tertiary },
        { label: 'Media', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine tex={tex} />
      <ChartSvg
        label={description}
        aspect={0.82}
        maxHeight={480}
        margins={{ top: 24, right: 30, bottom: 28, left: 30 }}
      >
        {(box) => {
          const side = Math.min(box.inner.width, box.inner.height / HEIGHT);
          const left = box.inner.left + (box.inner.width - side) / 2;
          const bottom = box.inner.top + box.inner.height;
          const px = ([x, y]: [number, number]) => `${left + x * side},${bottom - y * side}`;
          const [mx, my] = toPlane(mean);
          return (
            <g aria-hidden="true">
              {cells.map((cell, index) => (
                <polygon
                  key={index}
                  points={cell.points.map(px).join(' ')}
                  fill={DATA_COLORS.primary}
                  fillOpacity={
                    Math.min(1, (Number.isFinite(cell.density) ? cell.density : cap) / cap) * 0.85
                  }
                  stroke="none"
                />
              ))}
              <polygon
                points={[toPlane([1, 0, 0]), toPlane([0, 1, 0]), toPlane([0, 0, 1])]
                  .map(px)
                  .join(' ')}
                fill="none"
                stroke="var(--color-border-strong)"
                strokeWidth={1.5}
              />
              {samples.map((p, index) => {
                const [x, y] = toPlane(p);
                return (
                  <circle
                    key={index}
                    cx={left + x * side}
                    cy={bottom - y * side}
                    r={2}
                    fill={DATA_COLORS.tertiary}
                    fillOpacity={0.7}
                  />
                );
              })}
              <circle
                cx={left + mx * side}
                cy={bottom - my * side}
                r={6}
                fill={DATA_COLORS.secondary}
                stroke="var(--color-surface)"
                strokeWidth={2}
              />
              <text x={left - 4} y={bottom + 18} textAnchor="start" className={styles.label}>
                p₁ = 1
              </text>
              <text x={left + side + 4} y={bottom + 18} textAnchor="end" className={styles.label}>
                p₂ = 1
              </text>
              <text
                x={left + side / 2}
                y={bottom - HEIGHT * side - 8}
                textAnchor="middle"
                className={styles.label}
              >
                p₃ = 1
              </text>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
