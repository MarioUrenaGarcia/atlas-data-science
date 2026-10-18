import { scaleBand, scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { frequencyEncode } from '../../../lib/dataprep/features.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CATEGORY_CASES, categoryRows } from './categoryData.ts';
import { CategoryLabel, TILT_ABOVE } from './CategoryLabel.tsx';
import styles from './FeatureEngineeringViz.module.css';
import type { TargetCaseId } from './schema.ts';

const ROWS_PER_SECOND = 30;

/**
 * The rows are counted one at a time into their category and each category
 * is encoded by its share of the rows. Categories with the same count end
 * with the same code, whatever their target looks like.
 */
export function FrequencyView({
  title,
  caseId,
  seed: seed0,
}: {
  title: string;
  caseId: TargetCaseId;
  seed: number;
}) {
  const item = CATEGORY_CASES[caseId];
  const seed = useSeed(seed0);
  const data = useMemo(() => categoryRows(item, seed.seed), [item, seed.seed]);
  const n = data.categories.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${seed.seed}|${run}`, () =>
    reducedMotion ? n : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(n, v + 1)),
    stepMany: (count) => update((v) => Math.min(n, v + count)),
    reset: () => setRun((v) => v + 1),
    rate: ROWS_PER_SECOND,
    done: shown >= n,
  });
  const names = item.categories.map((c) => c.name);
  const tilt = names.length > TILT_ABOVE;
  const counted = data.categories.slice(0, shown);
  const counts = names.map((c) => counted.filter((v) => v === c).length);
  const finalFreq = frequencyEncode(data.categories);
  const finalCounts = names.map((c) => data.categories.filter((v) => v === c).length);
  const ties = names.filter((_, i) => finalCounts.filter((k) => k === finalCounts[i]).length > 1);
  const current = shown > 0 ? data.categories[shown - 1] : undefined;
  const ci = current ? names.indexOf(current) : -1;
  const f = (v: number) => formatNumber(v, 3);
  const header = current
    ? `\\tilde{x}_{\\text{${current}}} = \\frac{n_c}{n} = \\frac{${counts[ci] ?? 0}}{${shown}} = ${f((counts[ci] ?? 0) / shown)}`
    : `\\tilde{x}_c = \\frac{n_c}{n}`;
  const description =
    `${item.column} codificada por frecuencia con ${n} filas: ` +
    names
      .map((c, i) => `${c} ${finalCounts[i]} filas, código ${f(finalFreq.get(c) ?? 0)}`)
      .join('; ') +
    `. Categorías que comparten código: ${ties.length === 0 ? 'ninguna' : ties.join(', ')}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      readouts={[
        { label: 'Filas contadas', value: `${shown} de ${n}` },
        { label: 'Categorías', value: String(names.length) },
        {
          label: 'Categorías que comparten código',
          value: ties.length === 0 ? 'ninguna' : ties.join(', '),
          color: DATA_COLORS.highlight,
        },
      ]}
      description={description}
      dataTable={{
        caption: 'Frecuencia y código de cada categoría',
        columns: [item.column, 'Filas', 'Código', `Media de ${item.target.toLowerCase()}`],
        rows: names.map((c, i) => [
          c,
          finalCounts[i] ?? 0,
          f(finalFreq.get(c) ?? 0),
          formatNumber(item.categories[i]?.mean ?? 0, 0),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={240}
        maxHeight={340}
        margins={{ top: 12, right: 16, bottom: tilt ? 86 : 46, left: 56 }}
      >
        {(box) => {
          const { left, top, width, height } = box.inner;
          const x = scaleBand<number>()
            .domain(names.map((_, i) => i))
            .range([left, left + width])
            .padding(0.2);
          const y = scaleLinear()
            .domain([0, Math.max(...finalCounts) / n])
            .nice()
            .range([top + height, top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={left}
                gridLength={width}
                ticks={5}
                label="Código (proporción de filas)"
              />
              <g aria-hidden="true">
                {names.map((c, i) => {
                  const share = (counts[i] ?? 0) / n;
                  const tied = ties.includes(c) && shown >= n;
                  return (
                    <g key={c}>
                      <rect
                        x={x(i)}
                        y={y(share)}
                        width={x.bandwidth()}
                        height={top + height - y(share)}
                        fill={tied ? DATA_COLORS.highlight : DATA_COLORS.primary}
                        fillOpacity={i === ci ? 0.95 : 0.6}
                      />
                      <CategoryLabel
                        x={(x(i) ?? 0) + x.bandwidth() / 2}
                        y={top + height + 14}
                        tilt={tilt}
                        text={c}
                      />
                      <text
                        x={(x(i) ?? 0) + x.bandwidth() / 2}
                        y={y(share) - 4}
                        textAnchor="middle"
                        className={styles.chartLabel}
                      >
                        {counts[i]}
                      </text>
                    </g>
                  );
                })}
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
