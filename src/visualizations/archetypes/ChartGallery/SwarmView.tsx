import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { median } from '../../../lib/stats/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ChartGallery.module.css';

type SwarmMode = 'franjas' | 'franjas-dispersas' | 'enjambre';

const DOT = 4;
const ROW_HEIGHT = 90;
const BATCHES = 15;
const BATCHES_PER_SECOND = 5;
const LABEL_WIDTH = 100;
const JITTER_HEIGHT = 26;

const MODE_NAMES: Record<SwarmMode, string> = {
  franjas: 'Franjas sin desplazamiento',
  'franjas-dispersas': 'Franjas con desplazamiento aleatorio',
  enjambre: 'Enjambre sin encimar puntos',
};

/** Vertical offsets that keep circles of radius r from overlapping, packing them close to the center line. */
function beeswarm(xs: readonly number[], r: number): number[] {
  const order = xs.map((x, i) => ({ x, i })).sort((a, b) => a.x - b.x);
  const placed: { x: number; y: number }[] = [];
  const offsets = new Array<number>(xs.length).fill(0);
  for (const { x, i } of order) {
    const near = placed.filter((p) => Math.abs(p.x - x) < 2 * r);
    let y = 0;
    for (let k = 0; k < 400; k += 1) {
      const candidate = (k % 2 === 0 ? 1 : -1) * Math.ceil(k / 2) * (r * 0.5);
      if (near.every((p) => (p.x - x) ** 2 + (p.y - candidate) ** 2 >= (2 * r) ** 2)) {
        y = candidate;
        break;
      }
    }
    placed.push({ x, y });
    offsets[i] = y;
  }
  return offsets;
}

interface SwarmViewProps {
  title: string;
  groups: { name: string; values: number[] }[];
  label: string;
  mode: 'franjas' | 'enjambre';
}

/**
 * Every observation as a dot on a common axis, one row per group. Without
 * help many dots overlap; random vertical displacement or a beeswarm layout
 * separates them so each one is visible.
 */
export function SwarmView({ title, groups, label, mode: mode0 }: SwarmViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select',
        key: 'modo',
        label: 'Acomodo de los puntos',
        options: (Object.keys(MODE_NAMES) as SwarmMode[]).map((value) => ({
          value,
          label: MODE_NAMES[value],
        })),
        default: mode0,
      },
    ],
    [mode0],
  );
  const parameters = useParameters(definitions);
  const mode = String(parameters.values.modo) as SwarmMode;
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(reducedMotion ? BATCHES : 1);
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(BATCHES, v + 1)),
    reset: () => setShown(1),
    rate: BATCHES_PER_SECOND,
    done: shown >= BATCHES,
  });
  const visible = groups.map((g) =>
    g.values.slice(0, Math.round((g.values.length * shown) / BATCHES)),
  );
  const all = groups.flatMap((g) => g.values);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const pad = (hi - lo) * 0.05 || 1;
  const jitters = useMemo(
    () =>
      groups.map((g, gi) => {
        const random = new Random(gi + 11);
        return g.values.map(() => random.uniform(-JITTER_HEIGHT, JITTER_HEIGHT));
      }),
    [groups],
  );
  const header = groups
    .map((g, i) => `\\tilde{x}_{\\text{${g.name}}} = ${formatNumber(median(visible[i] ?? []), 1)}`)
    .join(',\\ ');
  const description =
    `${MODE_NAMES[mode]}. ` +
    groups
      .map(
        (g, i) =>
          `${g.name}: ${visible[i]?.length ?? 0} puntos, mediana ${formatNumber(median(visible[i] ?? []), 1)}`,
      )
      .join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={groups.map((g, i) => ({
        label: `${g.name}, puntos`,
        value: `${visible[i]?.length ?? 0} de ${g.values.length}`,
        color: seriesColor(i),
      }))}
      legend={[
        ...groups.map((g, i) => ({
          label: g.name,
          color: seriesColor(i),
          shape: 'circle' as const,
        })),
        { label: 'Mediana', color: DATA_COLORS.text, shape: 'line' as const },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={groups.length * ROW_HEIGHT + 60}
        maxHeight={groups.length * ROW_HEIGHT + 90}
        margins={{ top: 12, right: 20, bottom: 46, left: LABEL_WIDTH }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([lo - pad, hi + pad])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const rowHeight = box.inner.height / groups.length;
          return (
            <g>
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                gridLength={box.inner.height}
                ticks={8}
                label={label}
              />
              {groups.map((g, gi) => {
                const cy = box.inner.top + rowHeight * (gi + 0.5);
                const values = visible[gi] ?? [];
                const swarm =
                  mode === 'enjambre'
                    ? beeswarm(
                        values.map((v) => x(v)),
                        DOT,
                      )
                    : [];
                const m = median(values);
                return (
                  <g key={g.name}>
                    <text
                      x={box.inner.left - 8}
                      y={cy}
                      dy="0.32em"
                      textAnchor="end"
                      className={styles.chartLabel}
                    >
                      {g.name}
                    </text>
                    <g aria-hidden="true">
                      {values.map((v, i) => {
                        const dy =
                          mode === 'enjambre'
                            ? Math.max(
                                -rowHeight / 2 + DOT,
                                Math.min(rowHeight / 2 - DOT, swarm[i] ?? 0),
                              )
                            : mode === 'franjas-dispersas'
                              ? (jitters[gi]?.[i] ?? 0)
                              : 0;
                        return (
                          <circle
                            key={i}
                            cx={x(v)}
                            cy={cy + dy}
                            r={DOT}
                            fill={seriesColor(gi)}
                            fillOpacity={mode === 'franjas' ? 0.5 : 0.85}
                          />
                        );
                      })}
                      {values.length > 0 && (
                        <line
                          x1={x(m)}
                          x2={x(m)}
                          y1={cy - rowHeight / 2 + 4}
                          y2={cy + rowHeight / 2 - 4}
                          stroke={DATA_COLORS.text}
                          strokeWidth={2}
                        />
                      )}
                    </g>
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
