import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './SequenceSeries.module.css';

const TERMS = 25;
const TERMS_PER_SECOND = 2.5;

interface GeometricViewProps {
  title: string;
  ratio: number;
  first: number;
}

/**
 * Terms a r^k stacked as segments of a bar: when |r| < 1 each new piece
 * covers a fixed fraction of what is left to the limit a / (1 - r).
 */
export function GeometricView({ title, ratio, first }: GeometricViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'r',
        label: 'Razón',
        symbol: 'r',
        min: -1.1,
        max: 1.1,
        step: 0.05,
        default: ratio,
      },
      {
        type: 'number' as const,
        key: 'a',
        label: 'Primer término',
        symbol: 'a',
        min: first > 2 ? 1 : 0.1,
        max: first > 2 ? Math.max(10, 2 * first) : 2,
        step: first > 2 ? 1 : 0.1,
        default: first,
      },
    ],
    [ratio, first],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const r = Number(values.r);
  const a = Number(values.a);
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${r}|${a}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(TERMS, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: TERMS_PER_SECOND,
    done: shown >= TERMS,
  });
  const converges = Math.abs(r) < 1;
  const limit = converges ? a / (1 - r) : null;
  const partialSums = Array.from({ length: TERMS }, (_, n) =>
    Math.abs(r - 1) < 1e-12 ? a * (n + 1) : (a * (1 - r ** (n + 1))) / (1 - r),
  );
  const partial = shown > 0 ? (partialSums[shown - 1] ?? 0) : 0;
  const description =
    `Serie geométrica con a = ${a.toFixed(2)} y r = ${r.toFixed(2)}. Tras ${shown} términos la suma parcial es ${formatNumber(partial, 5)}. ` +
    (converges
      ? `Como |r| < 1, converge a a / (1 - r) = ${formatNumber(limit ?? 0, 5)}.`
      : 'Como |r| ≥ 1, los términos no tienden a cero y la serie diverge.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Términos n', value: String(shown) },
        {
          label: 'Término a rⁿ⁻¹',
          value: shown > 0 ? formatNumber(a * r ** (shown - 1), 5) : 'sin términos',
        },
        {
          label: 'Sₙ = a(1 - rⁿ)/(1 - r)',
          value: formatNumber(partial, 6),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Límite a/(1 - r)',
          value: limit === null ? 'no existe' : formatNumber(limit, 6),
          color: DATA_COLORS.secondary,
        },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={
            '\\sum_{k=0}^{n-1} a r^k = a\\,\\frac{1 - r^n}{1 - r},\\qquad \\sum_{k=0}^{\\infty} a r^k = \\frac{a}{1-r}\\ \\text{si } |r| < 1'
          }
        />
      </p>
      <ChartSvg label={description} aspect={0.45} minHeight={240} maxHeight={380}>
        {(box) => {
          const visibleSums = partialSums.slice(0, Math.max(1, shown));
          const lo = Math.min(0, ...visibleSums, limit ?? 0);
          const hi = Math.max(a, ...visibleSums, limit ?? 0);
          const x = scaleLinear()
            .domain([0, TERMS + 1])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([lo, hi * 1.1])
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
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(limit)}
                  y2={y(limit)}
                  stroke={DATA_COLORS.secondary}
                  strokeDasharray="6 4"
                  aria-hidden="true"
                />
              )}
              <g aria-hidden="true">
                {partialSums.slice(0, shown).map((value, index) => {
                  // Each bar stacks the terms that make up S_n, colored by term, to show what every new term adds.
                  const width = Math.max(2, (box.inner.width / (TERMS + 1)) * 0.7);
                  let base = 0;
                  return (
                    <g key={index}>
                      {Array.from({ length: index + 1 }, (_, k) => {
                        const term = a * r ** k;
                        const y0 = y(base);
                        const y1 = y(base + term);
                        base += term;
                        return (
                          <rect
                            key={k}
                            x={x(index + 1) - width / 2}
                            y={Math.min(y0, y1)}
                            width={width}
                            height={Math.max(0.5, Math.abs(y1 - y0))}
                            fill={seriesColor(k)}
                            fillOpacity={0.75}
                          />
                        );
                      })}
                      <circle cx={x(index + 1)} cy={y(value)} r={3} fill={DATA_COLORS.text} />
                    </g>
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
