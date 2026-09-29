import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { SEQUENCES, type SequenceId } from './catalog.ts';
import styles from './SequenceSeries.module.css';

const TERMS_PER_SECOND = 6;
/** Terms examined when looking for the index after which the sequence stays in the band. */
const SEARCH_LIMIT = 100_000;

interface SequenceViewProps {
  title: string;
  sequence: SequenceId;
  sequences: readonly SequenceId[];
  epsilon: number;
  terms: number;
}

/**
 * Terms appear one at a time. For a convergent sequence the band of radius
 * epsilon around the limit is drawn together with the first index N from
 * which every later term stays inside it.
 */
export function SequenceView({ title, sequence, sequences, epsilon, terms }: SequenceViewProps) {
  const definitions = useMemo(
    () => [
      ...(sequences.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'sucesion',
              label: 'Sucesión',
              options: sequences.map((id) => ({ value: id, label: SEQUENCES[id].label })),
              default: sequence,
            },
          ]
        : []),
      {
        type: 'number' as const,
        key: 'epsilon',
        label: 'Tolerancia',
        symbol: 'ε',
        min: 0.01,
        max: 0.5,
        step: 0.01,
        default: epsilon,
      },
    ],
    [sequences, sequence, epsilon],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (sequences.length > 1 ? String(values.sucesion) : sequence) as SequenceId;
  const eps = Number(values.epsilon);
  const definition = SEQUENCES[selected];
  const limit = definition.limit;
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${selected}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(terms, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: TERMS_PER_SECOND,
    done: shown >= terms,
  });

  // Smallest N such that |a_n - L| < eps for every n >= N, searched far beyond the plotted range.
  const threshold = useMemo(() => {
    if (limit === null) return null;
    let last = 0;
    for (let n = 1; n <= SEARCH_LIMIT; n += 1) {
      if (Math.abs(definition.term(n) - limit) >= eps) last = n;
    }
    return last + 1;
  }, [definition, limit, eps]);

  const points = Array.from({ length: shown }, (_, index) => ({
    n: index + 1,
    value: definition.term(index + 1),
  }));
  const all = Array.from({ length: terms }, (_, index) => definition.term(index + 1));
  const current = points[points.length - 1];
  const description =
    `${definition.label}. ` +
    (current ? `Término ${current.n}: ${formatNumber(current.value, 4)}. ` : '') +
    (limit === null
      ? 'La sucesión no converge: no hay un número al que sus términos se acerquen y permanezcan cerca.'
      : `Converge a ${formatNumber(limit, 4)}; con ε = ${eps.toFixed(2)} todos los términos desde n = ${threshold} quedan dentro de la banda.`);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'n', value: String(current?.n ?? 0) },
        { label: 'aₙ', value: current ? formatNumber(current.value, 5) : 'sin términos' },
        {
          label: 'Límite L',
          value: limit === null ? 'no existe' : formatNumber(limit, 5),
          color: DATA_COLORS.secondary,
        },
        ...(limit !== null && current
          ? [{ label: '|aₙ - L|', value: formatNumber(Math.abs(current.value - limit), 5) }]
          : []),
        ...(threshold !== null
          ? [{ label: 'N(ε)', value: String(threshold), color: DATA_COLORS.highlight }]
          : []),
      ]}
      legend={[
        { label: 'Términos aₙ', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Banda L ± ε', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={definition.latex} />
      </p>
      <ChartSvg label={description} aspect={0.5} minHeight={240} maxHeight={400}>
        {(box) => {
          const lo = Math.min(...all, limit !== null ? limit - eps : Infinity);
          const hi = Math.max(...all, limit !== null ? limit + eps : -Infinity);
          const pad = (hi - lo) * 0.08 || 0.5;
          const x = scaleLinear()
            .domain([0, terms + 1])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([lo - pad, hi + pad])
            .nice()
            .range([box.inner.top + box.inner.height, box.inner.top]);
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
              {limit !== null && (
                <g aria-hidden="true">
                  <rect
                    x={box.inner.left}
                    y={y(limit + eps)}
                    width={box.inner.width}
                    height={Math.max(1, y(limit - eps) - y(limit + eps))}
                    fill={DATA_COLORS.secondary}
                    fillOpacity={0.14}
                  />
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={y(limit)}
                    y2={y(limit)}
                    stroke={DATA_COLORS.secondary}
                    strokeDasharray="6 4"
                  />
                  {threshold !== null && threshold <= terms && (
                    <line
                      x1={x(threshold)}
                      x2={x(threshold)}
                      y1={box.inner.top}
                      y2={box.inner.top + box.inner.height}
                      stroke={DATA_COLORS.highlight}
                      strokeWidth={2}
                    />
                  )}
                </g>
              )}
              <g aria-hidden="true">
                {points.map((point) => {
                  const outside = limit !== null && Math.abs(point.value - limit) >= eps;
                  return (
                    <circle
                      key={point.n}
                      cx={x(point.n)}
                      cy={y(point.value)}
                      r={Math.max(2.5, Math.min(5, box.inner.width / terms / 2.5))}
                      fill={outside ? DATA_COLORS.muted : DATA_COLORS.primary}
                    />
                  );
                })}
              </g>
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
