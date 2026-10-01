import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  mean,
  median,
  medianAbsoluteDeviation,
  standardDeviation,
} from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataStrip.module.css';

const STAGES = 3;
const STAGES_PER_SECOND = 0.5;
const ROW_GAP = 86;
const DOT_RADIUS = 6;
const HIGHLIGHT_RADIUS = 9;
const DOMAIN_PADDING = 0.08;
/** 0.6745 is the 0.75 quantile of the standard normal; it puts modified z on the usual scale. */
const MODIFIED_Z_FACTOR = 0.6745;

export interface ZDataset {
  values: readonly number[];
  variable: string;
  unit: string;
  highlight?: number;
}

interface StandardizeViewProps {
  title: string;
  groups: ZDataset[];
  robust: boolean;
  threshold?: number;
  decimals: number;
}

function center(values: readonly number[], robust: boolean) {
  return robust ? median(values) : mean(values);
}

function spread(values: readonly number[], robust: boolean) {
  return robust ? medianAbsoluteDeviation(values) / MODIFIED_Z_FACTOR : standardDeviation(values);
}

/**
 * Standardization in three stages: the raw values, their distance to the
 * center measured in spreads, and the common z scale where values from
 * different variables can be compared.
 */
export function StandardizeView({
  title,
  groups,
  robust,
  threshold,
  decimals,
}: StandardizeViewProps) {
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState(reducedMotion ? STAGES - 1 : 0);
  const playback = usePlayback({
    step: () => setStage((value) => Math.min(STAGES - 1, value + 1)),
    reset: () => setStage(0),
    rate: STAGES_PER_SECOND,
    done: stage >= STAGES - 1,
  });
  const f = (value: number) => formatNumber(value, decimals);
  const g = (value: number) => formatNumber(value, 2);
  const stats = groups.map((group) => {
    const c = center(group.values, robust);
    const s = spread(group.values, robust);
    return { c, s, z: group.values.map((value) => (value - c) / s) };
  });
  const allZ = stats.flatMap((item) => item.z);
  const zLimit = Math.max(3, threshold ?? 0, ...allZ.map(Math.abs)) * 1.1;
  const cSymbol = robust ? '\\tilde{x}' : '\\bar{x}';
  const sSymbol = robust ? '\\mathrm{MAD}/0.6745' : 's';
  const header = groups
    .map((group, i) => {
      const item = stats[i];
      if (!item) return '';
      const h = group.highlight ?? 0;
      const value = group.values[h] ?? 0;
      if (stage === 0) return `${cSymbol} = ${f(item.c)},\\ ${sSymbol} = ${g(item.s)}`;
      if (stage === 1) return `x - ${cSymbol} = ${f(value)} - ${f(item.c)} = ${g(value - item.c)}`;
      return `${robust ? 'z^{*}' : 'z'} = \\frac{${f(value)} - ${f(item.c)}}{${g(item.s)}} = ${g(item.z[h] ?? 0)}`;
    })
    .join('\\qquad ');
  const description = groups
    .map((group, i) => {
      const item = stats[i];
      if (!item) return '';
      const h = group.highlight;
      return (
        `${group.variable}: centro ${f(item.c)}, escala ${g(item.s)}.` +
        (h === undefined
          ? ''
          : ` El valor ${f(group.values[h] ?? 0)} tiene puntuación ${g(item.z[h] ?? 0)}.`) +
        (threshold
          ? ` ${item.z.filter((z) => Math.abs(z) > threshold).length} valores superan ${g(threshold)} en valor absoluto.`
          : '')
      );
    })
    .join(' ');
  const colors = [DATA_COLORS.primary, DATA_COLORS.secondary];

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={groups.flatMap((group, i) => {
        const item = stats[i];
        if (!item) return [];
        const h = group.highlight;
        return [
          {
            label: `${robust ? 'Mediana' : 'Media'} de ${group.variable}`,
            value: f(item.c),
            color: colors[i],
          },
          {
            label: `${robust ? 'MAD / 0.6745' : 'Desviación estándar'} de ${group.variable}`,
            value: g(item.s),
          },
          ...(h === undefined
            ? []
            : [
                {
                  label: `Puntuación del valor ${f(group.values[h] ?? 0)}`,
                  value: g(item.z[h] ?? 0),
                  color: DATA_COLORS.highlight,
                },
              ]),
          ...(threshold
            ? [
                {
                  label: `Valores con |z| > ${g(threshold)}`,
                  value: String(item.z.filter((z) => Math.abs(z) > threshold).length),
                  color: DATA_COLORS.negative,
                },
              ]
            : []),
        ];
      })}
      legend={[
        ...groups.map((group, i) => ({
          label: group.variable,
          color: colors[i] ?? DATA_COLORS.primary,
          shape: 'circle' as const,
        })),
        { label: 'Valor resaltado', color: DATA_COLORS.highlight, shape: 'circle' },
      ]}
      description={description}
      dataTable={{
        caption: 'Valores y puntuaciones',
        columns: groups.flatMap((group) => [group.variable, `Puntuación en ${group.variable}`]),
        rows: Array.from(
          { length: Math.max(...groups.map((group) => group.values.length)) },
          (_, r) =>
            groups.flatMap((group, i) =>
              group.values[r] === undefined
                ? ['', '']
                : [f(group.values[r] ?? 0), g(stats[i]?.z[r] ?? 0)],
            ),
        ),
      }}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={(groups.length + 1) * ROW_GAP + 40}
        maxHeight={(groups.length + 1) * ROW_GAP + 80}
        margins={{ top: 28, right: 24, bottom: 44, left: 24 }}
      >
        {(box) => {
          const zRowY = box.inner.top + box.inner.height;
          const zScale = scaleLinear()
            .domain([-zLimit, zLimit])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          return (
            <g>
              {groups.map((group, i) => {
                const item = stats[i];
                if (!item) return null;
                const lo = Math.min(...group.values);
                const hi = Math.max(...group.values);
                const pad = (hi - lo) * DOMAIN_PADDING || 1;
                const sx = scaleLinear()
                  .domain([lo - pad, hi + pad])
                  .range([box.inner.left, box.inner.left + box.inner.width]);
                const y = box.inner.top + i * ROW_GAP + 10;
                const color = colors[i] ?? DATA_COLORS.primary;
                return (
                  <g key={group.variable}>
                    <text x={box.inner.left} y={y - 16} className={styles.pointLabel}>
                      {`${group.variable}${group.unit ? ` (${group.unit})` : ''}`}
                    </text>
                    {stage >= 1 && (
                      <g aria-hidden="true">
                        <rect
                          x={sx(item.c - item.s)}
                          y={y - 12}
                          width={Math.max(0, sx(item.c + item.s) - sx(item.c - item.s))}
                          height={24}
                          fill={color}
                          fillOpacity={0.12}
                        />
                        <line
                          x1={sx(item.c)}
                          x2={sx(item.c)}
                          y1={y - 14}
                          y2={y + 14}
                          stroke={DATA_COLORS.text}
                          strokeWidth={2}
                        />
                      </g>
                    )}
                    <Axis scale={sx} orientation="bottom" position={y + 14} ticks={6} />
                    {group.values.map((value, j) => {
                      const highlighted = j === group.highlight;
                      const outside =
                        threshold !== undefined &&
                        stage >= 2 &&
                        Math.abs(item.z[j] ?? 0) > threshold;
                      return (
                        <g key={j} aria-hidden="true">
                          {stage >= 2 && (
                            <line
                              x1={sx(value)}
                              x2={zScale(item.z[j] ?? 0)}
                              y1={y + 20}
                              y2={zRowY - 12}
                              stroke={color}
                              strokeOpacity={highlighted ? 0.9 : 0.18}
                              strokeWidth={highlighted ? 2 : 1}
                            />
                          )}
                          <circle
                            cx={sx(value)}
                            cy={y}
                            r={highlighted ? HIGHLIGHT_RADIUS : DOT_RADIUS}
                            fill={
                              outside
                                ? DATA_COLORS.negative
                                : highlighted
                                  ? DATA_COLORS.highlight
                                  : color
                            }
                            fillOpacity={0.85}
                          />
                          {stage >= 2 && (
                            <circle
                              cx={zScale(item.z[j] ?? 0)}
                              cy={zRowY - 12 - i * 10}
                              r={highlighted ? HIGHLIGHT_RADIUS : DOT_RADIUS}
                              fill={
                                outside
                                  ? DATA_COLORS.negative
                                  : highlighted
                                    ? DATA_COLORS.highlight
                                    : color
                              }
                              fillOpacity={0.85}
                            />
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}
              {stage >= 2 && threshold !== undefined && (
                <g aria-hidden="true">
                  {[-threshold, threshold].map((t) => (
                    <line
                      key={t}
                      x1={zScale(t)}
                      x2={zScale(t)}
                      y1={zRowY - 40}
                      y2={zRowY}
                      stroke={DATA_COLORS.negative}
                      strokeDasharray="5 4"
                      strokeWidth={2}
                    />
                  ))}
                </g>
              )}
              <Axis
                scale={zScale}
                orientation="bottom"
                position={zRowY}
                ticks={8}
                label={robust ? 'Puntuación z modificada' : 'Puntuación z'}
              />
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
