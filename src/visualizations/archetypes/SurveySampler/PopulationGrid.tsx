import type { GridPopulation } from '../../../lib/sampling/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import styles from './SurveySampler.module.css';

interface PopulationGridProps {
  population: GridPopulation;
  label: string;
  /** Units revealed so far with how many times each was drawn. */
  counts: ReadonlyMap<number, number>;
  /** Units drawn that did not respond. */
  missing: ReadonlySet<number>;
  /** Units outside the sampling frame. */
  excluded: ReadonlySet<number>;
  /** Clusters selected at the first stage. */
  clusters: ReadonlySet<number>;
  showClusters: boolean;
  showSizes: boolean;
  showAccess: boolean;
  binary: boolean;
  /** Units of the systematic path, in order, to draw the jumps between them. */
  path?: readonly number[];
  clusterBlock: readonly [number, number];
}

const LABEL_WIDTH = 64;
const MIN_OPACITY = 0.12;
const BAND_OPACITY = 0.06;

/** The population as a grid of units, with strata bands, cluster blocks and the current sample. */
export function PopulationGrid({
  population,
  label,
  counts,
  missing,
  excluded,
  clusters,
  showClusters,
  showSizes,
  showAccess,
  binary,
  path,
  clusterBlock,
}: PopulationGridProps) {
  const { columns, rows, values } = population;
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const maxSize = Math.max(...population.size);
  const strataCount = population.strataNames.length;
  const showStrata = strataCount > 1;
  return (
    <ChartSvg
      label={label}
      aspect={rows / columns}
      minHeight={200}
      maxHeight={460}
      margins={{ top: 8, right: 8, bottom: 8, left: showStrata ? LABEL_WIDTH : 8 }}
    >
      {(box) => {
        const cell = Math.min(box.inner.width / columns, box.inner.height / rows);
        const left = box.inner.left + (box.inner.width - columns * cell) / 2;
        const top = box.inner.top + (box.inner.height - rows * cell) / 2;
        const center = (unit: number) => ({
          x: left + (unit % columns) * cell + cell / 2,
          y: top + Math.floor(unit / columns) * cell + cell / 2,
        });
        const [bw, bh] = clusterBlock;
        const blocksPerRow = Math.ceil(columns / bw);
        const bands = Array.from({ length: strataCount }, (_, h) => {
          const first = Math.ceil((h * rows) / strataCount);
          const last = Math.ceil(((h + 1) * rows) / strataCount);
          return { h, first, last };
        });
        return (
          <g>
            {showStrata &&
              bands.map(({ h, first, last }) => (
                <g key={h} aria-hidden="true">
                  <rect
                    x={left - 4}
                    y={top + first * cell}
                    width={columns * cell + 8}
                    height={(last - first) * cell}
                    fill={h % 2 === 0 ? DATA_COLORS.quaternary : DATA_COLORS.tertiary}
                    fillOpacity={BAND_OPACITY}
                    stroke={DATA_COLORS.muted}
                    strokeOpacity={0.5}
                  />
                  <text
                    x={left - 8}
                    y={top + ((first + last) / 2) * cell}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className={styles.bandLabel}
                  >
                    {population.strataNames[h]}
                  </text>
                </g>
              ))}
            {values.map((value, unit) => {
              const { x, y } = center(unit);
              const count = counts.get(unit) ?? 0;
              const selected = count > 0;
              const out = excluded.has(unit);
              const intensity = binary ? value : (value - lo) / Math.max(1e-9, hi - lo);
              const sizeFactor = showSizes
                ? 0.35 + 0.65 * Math.sqrt((population.size[unit] ?? 0) / maxSize)
                : 1;
              const radius = cell * 0.36 * sizeFactor;
              if (out) {
                return (
                  <circle
                    key={unit}
                    cx={x}
                    cy={y}
                    r={radius}
                    fill="none"
                    stroke={DATA_COLORS.muted}
                    strokeDasharray="2 2"
                    aria-hidden="true"
                  />
                );
              }
              return (
                <g key={unit} aria-hidden="true">
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={binary && value === 1 ? DATA_COLORS.tertiary : DATA_COLORS.primary}
                    fillOpacity={
                      binary
                        ? value === 1
                          ? 0.8
                          : 0.18
                        : MIN_OPACITY + (1 - MIN_OPACITY) * intensity * 0.85
                    }
                    // Selected units keep their own tone so the values that enter the sample stay visible.
                    stroke={selected ? DATA_COLORS.highlight : 'none'}
                    strokeWidth={selected ? Math.max(2.5, radius * 0.45) : 0}
                  />
                  {missing.has(unit) && (
                    <path
                      d={`M${x - radius} ${y - radius}L${x + radius} ${y + radius}M${x + radius} ${y - radius}L${x - radius} ${y + radius}`}
                      stroke={DATA_COLORS.negative}
                      strokeWidth={2}
                    />
                  )}
                  {count > 1 && cell >= 12 && (
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={styles.count}
                    >
                      {count}
                    </text>
                  )}
                </g>
              );
            })}
            {showClusters &&
              Array.from({ length: population.clusterCount }, (_, c) => {
                const bx = (c % blocksPerRow) * bw;
                const by = Math.floor(c / blocksPerRow) * bh;
                const chosen = clusters.has(c);
                return (
                  <rect
                    key={c}
                    x={left + bx * cell + 1}
                    y={top + by * cell + 1}
                    width={Math.min(bw, columns - bx) * cell - 2}
                    height={Math.min(bh, rows - by) * cell - 2}
                    fill="none"
                    stroke={chosen ? DATA_COLORS.highlight : DATA_COLORS.muted}
                    strokeWidth={chosen ? 3 : 1}
                    strokeOpacity={chosen ? 1 : 0.55}
                    rx={3}
                    aria-hidden="true"
                  />
                );
              })}
            {path && path.length > 1 && (
              <polyline
                points={path
                  .map((unit) => {
                    const { x, y } = center(unit);
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke={DATA_COLORS.highlight}
                strokeOpacity={0.5}
                strokeDasharray="3 3"
                aria-hidden="true"
              />
            )}
            {showAccess && (
              <g aria-hidden="true">
                <rect
                  x={left - 2}
                  y={top - 2}
                  width={cell * 1.6}
                  height={cell * 1.6}
                  fill="none"
                  stroke={DATA_COLORS.negative}
                  strokeWidth={2.5}
                  rx={4}
                />
                <text x={left + cell * 1.9} y={top + cell * 0.6} className={styles.access}>
                  acceso
                </text>
              </g>
            )}
          </g>
        );
      }}
    </ChartSvg>
  );
}
