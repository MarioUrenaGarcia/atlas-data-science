import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { kernelDensity, median } from '../../../lib/stats/index.ts';
import { seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ChartGallery.module.css';

const POINTS = 120;
const ROW_HEIGHT = 38;
const LABEL_WIDTH = 96;
const GROUPS_PER_SECOND = 2;

interface RidgelineViewProps {
  title: string;
  groups: { name: string; values: number[] }[];
  label: string;
  overlap: number;
}

/**
 * Density curves of many groups stacked like a mountain range, each slightly
 * overlapping the one above, so a gradual shift of the distribution across
 * groups (months, years, ages) is visible at a glance.
 */
export function RidgelineView({ title, groups, label, overlap: overlap0 }: RidgelineViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'solapamiento',
        label: 'Solapamiento entre crestas',
        min: 0,
        max: 3,
        step: 0.25,
        default: overlap0,
        digits: 2,
      },
    ],
    [overlap0],
  );
  const parameters = useParameters(definitions);
  const overlap = Number(parameters.values.solapamiento);
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(reducedMotion ? groups.length : 1);
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(groups.length, v + 1)),
    reset: () => setShown(1),
    rate: GROUPS_PER_SECOND,
    done: shown >= groups.length,
  });
  const all = groups.flatMap((g) => g.values);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const pad = (hi - lo) * 0.08 || 1;
  const grid = Array.from(
    { length: POINTS },
    (_, i) => lo - pad + ((hi - lo + 2 * pad) * i) / (POINTS - 1),
  );
  const curves = groups.map((g) => grid.map(kernelDensity(g.values)));
  const peak = Math.max(...curves.flat());
  const last = groups[shown - 1];
  const header = last
    ? `\\tilde{x}_{\\text{${last.name}}} = ${formatNumber(median(last.values), 1)}`
    : '';
  const description =
    `Densidades de ${groups.length} grupos apiladas. Medianas: ` +
    groups.map((g) => `${g.name} ${formatNumber(median(g.values), 1)}`).join(', ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={groups.map((g, i) => ({
        label: `Mediana de ${g.name}`,
        value: formatNumber(median(g.values), 1),
        color: seriesColor(i),
      }))}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.6}
        minHeight={groups.length * ROW_HEIGHT + 90}
        maxHeight={groups.length * ROW_HEIGHT + 140}
        margins={{ top: 10 + ROW_HEIGHT * overlap, right: 20, bottom: 46, left: LABEL_WIDTH }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([lo - pad, hi + pad])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const rowHeight = box.inner.height / groups.length;
          const height = rowHeight * (1 + overlap);
          return (
            <g>
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={8}
                label={label}
              />
              {groups.slice(0, shown).map((g, gi) => {
                const base = box.inner.top + rowHeight * (gi + 1);
                const curve = curves[gi] ?? [];
                const top = curve.map((v, i) => `${x(grid[i] ?? 0)},${base - (height * v) / peak}`);
                return (
                  <g key={g.name}>
                    <polygon
                      points={[
                        `${x(grid[0] ?? 0)},${base}`,
                        ...top,
                        `${x(grid[grid.length - 1] ?? 0)},${base}`,
                      ].join(' ')}
                      fill={seriesColor(gi)}
                      fillOpacity={0.75}
                      stroke="var(--color-surface)"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <text
                      x={box.inner.left - 8}
                      y={base - 4}
                      textAnchor="end"
                      className={styles.chartLabel}
                    >
                      {g.name}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
