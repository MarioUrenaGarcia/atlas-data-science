import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './SetStructures.module.css';

const VALUES_PER_SECOND = 2;
const ROW_HEIGHT = 34;
const POINT_RADIUS = 6;

export interface IntervalSet {
  etiqueta: string;
  desde?: number;
  hasta?: number;
}

interface NumberLineViewProps {
  title: string;
  values: readonly number[];
  sets: readonly IntervalSet[];
  unit?: string;
}

function contains(set: IntervalSet, value: number): boolean {
  return (
    (set.desde === undefined || value >= set.desde) &&
    (set.hasta === undefined || value <= set.hasta)
  );
}

function conditionLatex(set: IntervalSet): string {
  if (set.desde !== undefined && set.hasta !== undefined)
    return `${set.desde} \\le x \\le ${set.hasta}`;
  if (set.desde !== undefined) return `x \\ge ${set.desde}`;
  if (set.hasta !== undefined) return `x \\le ${set.hasta}`;
  return 'x \\in U';
}

/**
 * Data values on a number line, with sets defined by conditions such as
 * "x >= 38". Each value is checked in turn and copied to the row of every set
 * whose condition it satisfies, so the listing by extension builds up next to
 * the description by comprehension and inclusions between sets become visible.
 */
export function NumberLineView({ title, values, sets, unit }: NumberLineViewProps) {
  const [run, setRun] = useState(0);
  const [checked, update] = useResettableState<number>(`${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(values.length, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: VALUES_PER_SECOND,
    done: checked >= values.length,
  });
  const seen = values.slice(0, checked);
  const members = sets.map((set) => seen.filter((value) => contains(set, value)));
  const complete = checked >= values.length;
  const subset = (i: number, j: number) =>
    (members[i] ?? []).every((value) => (members[j] ?? []).includes(value));
  const inclusions = complete
    ? sets.flatMap((a, i) =>
        sets.flatMap((b, j) => (i !== j && subset(i, j) ? [`${a.etiqueta} ⊆ ${b.etiqueta}`] : [])),
      )
    : [];
  const listing = (list: readonly number[]) =>
    list.length === 0 ? '∅' : `{${list.map((value) => formatNumber(value, 2)).join(', ')}}`;
  const description =
    `Valores revisados: ${checked} de ${values.length}. ` +
    sets.map((set, index) => `${set.etiqueta} = ${listing(members[index] ?? [])}`).join('; ') +
    (inclusions.length > 0 ? `. Contenciones: ${inclusions.join(', ')}.` : '.');
  const current = checked > 0 ? values[checked - 1] : undefined;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        {
          label: 'Valor revisado',
          value:
            current === undefined
              ? 'ninguno'
              : `${formatNumber(current, 2)}${unit ? ` ${unit}` : ''}`,
        },
        ...sets.map((set, index) => ({
          label: `|${set.etiqueta}|`,
          value: `${(members[index] ?? []).length}`,
          color: seriesColor(index),
        })),
        ...(complete ? [{ label: 'Contenciones', value: inclusions.join(', ') || 'ninguna' }] : []),
      ]}
      legend={sets.map((set, index) => ({
        label: set.etiqueta,
        color: seriesColor(index),
        shape: 'line' as const,
      }))}
      description={description}
    >
      <p className={styles.notation}>
        <Latex
          tex={sets
            .map((set) => `${set.etiqueta} = \\{x \\in U : ${conditionLatex(set)}\\}`)
            .join(',\\quad ')}
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0}
        minHeight={90 + ROW_HEIGHT * sets.length}
        maxHeight={90 + ROW_HEIGHT * sets.length}
        margins={{ top: 10, right: 24, bottom: 34, left: 24 }}
      >
        {(box) => {
          const low = Math.min(...values);
          const high = Math.max(...values);
          const pad = Math.max(0.5, (high - low) * 0.06);
          const x = scaleLinear()
            .domain([low - pad, high + pad])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const axisY = box.inner.top + box.inner.height;
          const rowY = (index: number) => box.inner.top + ROW_HEIGHT * index + ROW_HEIGHT / 2;
          return (
            <>
              <Axis scale={x} orientation="bottom" position={axisY} ticks={8} label={unit} />
              <g aria-hidden="true">
                {sets.map((set, index) => {
                  const from = x(Math.max(low - pad, set.desde ?? low - pad));
                  const to = x(Math.min(high + pad, set.hasta ?? high + pad));
                  return (
                    <g key={set.etiqueta}>
                      <rect
                        x={from}
                        y={rowY(index) - ROW_HEIGHT / 2 + 4}
                        width={Math.max(0, to - from)}
                        height={ROW_HEIGHT - 8}
                        rx={6}
                        fill={seriesColor(index)}
                        fillOpacity={0.12}
                        stroke={seriesColor(index)}
                      />
                      <text
                        x={from + 6}
                        y={rowY(index) - ROW_HEIGHT / 2 + 16}
                        className={svgStyles.label}
                        style={{ fill: seriesColor(index), fontWeight: 700, fontSize: 11 }}
                      >
                        {set.etiqueta}
                      </text>
                      {(members[index] ?? []).map((value) => (
                        <circle
                          key={value}
                          cx={x(value)}
                          cy={rowY(index) + 4}
                          r={POINT_RADIUS}
                          fill={seriesColor(index)}
                        />
                      ))}
                    </g>
                  );
                })}
                {values.map((value, index) => (
                  <circle
                    key={`${value}-${index}`}
                    cx={x(value)}
                    cy={axisY - POINT_RADIUS - 2}
                    r={POINT_RADIUS}
                    fill={index < checked ? 'var(--color-text)' : 'var(--color-surface)'}
                    stroke="var(--color-text)"
                    strokeWidth={index === checked - 1 ? 3 : 1}
                  />
                ))}
              </g>
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
