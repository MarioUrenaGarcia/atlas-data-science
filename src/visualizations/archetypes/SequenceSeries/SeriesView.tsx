import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { SERIES, type SeriesId } from './catalog.ts';
import styles from './SequenceSeries.module.css';

const TERMS_PER_SECOND = 8;

interface SeriesViewProps {
  title: string;
  series: SeriesId;
  options: readonly SeriesId[];
  terms: number;
}

/** Terms as bars and partial sums as a line; convergence means the partial sums settle. */
export function SeriesView({ title, series, options, terms }: SeriesViewProps) {
  const definitions = useMemo(
    () =>
      options.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'serie',
              label: 'Serie',
              options: options.map((id) => ({ value: id, label: SERIES[id].label })),
              default: series,
            },
          ]
        : [],
    [options, series],
  );
  const parameters = useParameters(definitions);
  const selected = (
    options.length > 1 ? String((parameters.values as Record<string, unknown>).serie) : series
  ) as SeriesId;
  const definition = SERIES[selected];
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${selected}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(terms, value + 1)),
    stepMany: (count) => update((value) => Math.min(terms, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: TERMS_PER_SECOND,
    done: shown >= terms,
  });
  const allTerms = useMemo(
    () => Array.from({ length: terms }, (_, index) => definition.term(index + 1)),
    [definition, terms],
  );
  const allSums = useMemo(() => {
    let total = 0;
    return allTerms.map((term) => (total += term));
  }, [allTerms]);
  const partial = shown > 0 ? (allSums[shown - 1] ?? 0) : 0;
  const lastTerm = shown > 0 ? (allTerms[shown - 1] ?? 0) : 0;
  const sum = definition.sum;
  const description =
    `${definition.label}. Suma parcial S_${shown} = ${formatNumber(partial, 5)}. ` +
    (sum === null
      ? 'La serie diverge: sus sumas parciales no se acercan a ningún número.'
      : `La serie converge a ${formatNumber(sum, 5)}; faltan ${formatNumber(sum - partial, 5)}.`);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={
        definitions.length > 0
          ? { ...parameters, values: parameters.values as Record<string, unknown> }
          : undefined
      }
      readouts={[
        { label: 'Términos sumados n', value: String(shown) },
        { label: 'Último término aₙ', value: formatNumber(lastTerm, 5), color: DATA_COLORS.light },
        { label: 'Suma parcial Sₙ', value: formatNumber(partial, 6), color: DATA_COLORS.primary },
        {
          label: 'Suma de la serie',
          value: sum === null ? 'diverge' : formatNumber(sum, 6),
          color: DATA_COLORS.secondary,
        },
      ]}
      legend={[
        { label: 'Términos aₙ', color: DATA_COLORS.light },
        { label: 'Sumas parciales Sₙ', color: DATA_COLORS.primary, shape: 'line' },
        ...(sum !== null
          ? [{ label: 'Suma de la serie', color: DATA_COLORS.secondary, shape: 'dashed' as const }]
          : []),
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`${definition.latex}${sum === null ? '' : ` = ${formatNumber(sum, 5)}\\dots`}`}
        />
      </p>
      <ChartSvg label={description} aspect={0.5} minHeight={240} maxHeight={400}>
        {(box) => {
          const lo = Math.min(0, ...allTerms, ...allSums);
          const hi = Math.max(...allTerms, ...allSums, sum ?? -Infinity);
          const x = scaleLinear()
            .domain([0, terms + 1])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([lo, hi * 1.08])
            .nice()
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const barWidth = Math.max(1, (box.inner.width / (terms + 1)) * 0.6);
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={8}
                label="n"
              />
              <g aria-hidden="true">
                {allTerms.slice(0, shown).map((term, index) => (
                  <rect
                    key={index}
                    x={x(index + 1) - barWidth / 2}
                    y={Math.min(y(term), y(0))}
                    width={barWidth}
                    height={Math.abs(y(0) - y(term))}
                    fill={DATA_COLORS.light}
                    fillOpacity={0.8}
                  />
                ))}
              </g>
              {sum !== null && (
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(sum)}
                  y2={y(sum)}
                  stroke={DATA_COLORS.secondary}
                  strokeDasharray="6 4"
                  aria-hidden="true"
                />
              )}
              {shown > 1 && (
                <CurvePath
                  points={allSums
                    .slice(0, shown)
                    .map((value, index) => ({ x: index + 1, y: value }))}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.primary}
                  width={2.5}
                  animate={false}
                />
              )}
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
