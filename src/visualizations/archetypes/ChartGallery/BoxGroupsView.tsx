import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { boxplotStats } from '../../../lib/stats/dispersion.ts';
import { kernelDensity } from '../../../lib/stats/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ChartGallery.module.css';

const ROW_HEIGHT = 74;
const BOX_HALF = 14;
const VIOLIN_HALF = 30;
const DOT = 2.5;
const JITTER = 12;
const CURVE_POINTS = 80;
const STAGES_PER_SECOND = 0.7;
const LABEL_WIDTH = 110;

interface BoxGroupsViewProps {
  title: string;
  groups: { name: string; values: number[] }[];
  label: string;
  violin: boolean;
  points: boolean;
}

/**
 * Several groups drawn on a common axis: first the raw points, then the box
 * plots and, optionally, the violins that show the full shape of each group.
 */
export function BoxGroupsView({ title, groups, label, violin, points }: BoxGroupsViewProps) {
  const stages = violin ? 3 : 2;
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState(reducedMotion ? stages - 1 : 0);
  const playback = usePlayback({
    step: () => setStage((v) => Math.min(stages - 1, v + 1)),
    reset: () => setStage(0),
    rate: STAGES_PER_SECOND,
    done: stage >= stages - 1,
  });
  const all = groups.flatMap((g) => g.values);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const pad = (hi - lo) * 0.06 || 1;
  const domain: [number, number] = [lo - pad, hi + pad];
  const stats = groups.map((g) => boxplotStats(g.values));
  const jitter = groups.map((g, gi) => {
    const random = new Random(gi + 1);
    return g.values.map(() => random.uniform(-JITTER, JITTER));
  });
  const f = (v: number) => formatNumber(v, 2);
  const header =
    stage === 0
      ? `\\text{${groups.length} grupos, ${all.length} observaciones}`
      : groups
          .map((g, i) => `\\tilde{x}_{\\text{${g.name}}} = ${f(stats[i]?.median ?? 0)}`)
          .join(',\\ ');
  const description = groups
    .map((g, i) => {
      const s = stats[i];
      return s
        ? `${g.name}: mediana ${f(s.median)}, cuartiles ${f(s.q1)} y ${f(s.q3)}, ${s.outliers.length} atípicos.`
        : '';
    })
    .join(' ');

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={groups.flatMap((g, i) => {
        const s = stats[i];
        return s
          ? [
              { label: `Mediana de ${g.name}`, value: f(s.median), color: seriesColor(i) },
              { label: `Rango intercuartílico de ${g.name}`, value: f(s.iqr) },
            ]
          : [];
      })}
      legend={groups.map((g, i) => ({ label: g.name, color: seriesColor(i) }))}
      description={description}
      dataTable={{
        caption: 'Resumen de cada grupo',
        columns: ['Grupo', 'n', 'Mínimo', 'Q1', 'Mediana', 'Q3', 'Máximo'],
        rows: groups.map((g, i) => {
          const s = stats[i];
          return [
            g.name,
            String(g.values.length),
            f(s?.min ?? 0),
            f(s?.q1 ?? 0),
            f(s?.median ?? 0),
            f(s?.q3 ?? 0),
            f(s?.max ?? 0),
          ];
        }),
      }}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={groups.length * ROW_HEIGHT + 60}
        maxHeight={groups.length * ROW_HEIGHT + 80}
        margins={{ top: 16, right: 20, bottom: 46, left: LABEL_WIDTH }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain(domain)
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
              {groups.map((g, i) => {
                const s = stats[i];
                const cy = box.inner.top + rowHeight * (i + 0.5);
                const color = seriesColor(i);
                if (!s) return null;
                const density = kernelDensity(g.values);
                const grid = Array.from(
                  { length: CURVE_POINTS },
                  (_, k) => s.min + ((s.max - s.min) * k) / (CURVE_POINTS - 1),
                );
                const peak = Math.max(...grid.map(density));
                const top = grid.map((v) => `${x(v)},${cy - (VIOLIN_HALF * density(v)) / peak}`);
                const bottom = [...grid]
                  .reverse()
                  .map((v) => `${x(v)},${cy + (VIOLIN_HALF * density(v)) / peak}`);
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
                    {violin && stage >= 2 && (
                      <polygon
                        points={[...top, ...bottom].join(' ')}
                        fill={color}
                        fillOpacity={0.25}
                        stroke={color}
                        aria-hidden="true"
                      />
                    )}
                    {(points || stage === 0) &&
                      g.values.map((v, k) => (
                        <circle
                          key={k}
                          cx={x(v)}
                          cy={cy + (jitter[i]?.[k] ?? 0)}
                          r={DOT}
                          fill={color}
                          fillOpacity={stage === 0 ? 0.7 : 0.35}
                          aria-hidden="true"
                        />
                      ))}
                    {stage >= 1 && (
                      <g aria-hidden="true">
                        <line
                          x1={x(s.lowerWhisker)}
                          x2={x(s.q1)}
                          y1={cy}
                          y2={cy}
                          stroke={DATA_COLORS.text}
                          strokeWidth={1.5}
                        />
                        <line
                          x1={x(s.q3)}
                          x2={x(s.upperWhisker)}
                          y1={cy}
                          y2={cy}
                          stroke={DATA_COLORS.text}
                          strokeWidth={1.5}
                        />
                        <rect
                          x={x(s.q1)}
                          y={cy - BOX_HALF}
                          width={Math.max(1, x(s.q3) - x(s.q1))}
                          height={BOX_HALF * 2}
                          fill={color}
                          fillOpacity={0.45}
                          stroke={DATA_COLORS.text}
                          strokeWidth={1.5}
                        />
                        <line
                          x1={x(s.median)}
                          x2={x(s.median)}
                          y1={cy - BOX_HALF}
                          y2={cy + BOX_HALF}
                          stroke={DATA_COLORS.text}
                          strokeWidth={3}
                        />
                        {s.outliers.map((o, k) => (
                          <circle
                            key={k}
                            cx={x(o)}
                            cy={cy}
                            r={4}
                            fill="none"
                            stroke={DATA_COLORS.text}
                            strokeWidth={1.5}
                          />
                        ))}
                      </g>
                    )}
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
