import { scaleBand, scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './SequenceSeries.module.css';

const STEPS_PER_SECOND = 1.2;

interface DataSumViewProps {
  title: string;
  values: readonly number[];
  name: string;
}

/**
 * Summation notation applied to data. The index i runs over the bars: first
 * the values are added one by one, then the mean is drawn, and finally each
 * deviation x_i - mean appears as a segment whose square is accumulated.
 */
export function DataSumView({ title, values, name }: DataSumViewProps) {
  const n = values.length;
  const totalSteps = 2 * n + 1;
  const [run, setRun] = useState(0);
  const [step, update] = useResettableState<number>(`${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(totalSteps, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STEPS_PER_SECOND,
    done: step >= totalSteps,
  });
  const sum = values.reduce((acc, value) => acc + value, 0);
  const mean = sum / n;
  const added = Math.min(step, n);
  const partial = values.slice(0, added).reduce((acc, value) => acc + value, 0);
  const meanShown = step > n;
  const deviationsShown = Math.max(0, step - n - 1);
  const squares = values
    .slice(0, deviationsShown)
    .reduce((acc, value) => acc + (value - mean) ** 2, 0);
  const sumOfSquares = values.reduce((acc, value) => acc + value * value, 0);
  const description =
    `Datos: ${values.join(', ')}. Suma parcial de ${added} términos: ${partial}. ` +
    (meanShown ? `Media ${formatNumber(mean, 3)}. ` : '') +
    (deviationsShown > 0
      ? `Suma de desviaciones cuadradas de ${deviationsShown} términos: ${formatNumber(squares, 3)}.`
      : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: `Suma de ${added} términos`, value: String(partial), color: DATA_COLORS.primary },
        {
          label: 'Media',
          value: meanShown ? formatNumber(mean, 3) : 'se calcula al terminar la suma',
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Suma de desviaciones cuadradas',
          value: deviationsShown > 0 ? formatNumber(squares, 3) : '0',
          color: DATA_COLORS.highlight,
        },
        {
          label: 'Suma de cuadrados menos n por media al cuadrado',
          value: formatNumber(sumOfSquares - n * mean * mean, 3),
        },
      ]}
      legend={[
        { label: name, color: DATA_COLORS.primary },
        { label: 'Media', color: DATA_COLORS.secondary, shape: 'dashed' },
        { label: 'Desviación', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
      dataTable={{
        caption: 'Datos y desviaciones',
        columns: ['i', 'valor', 'desviación', 'desviación al cuadrado'],
        rows: values.map((value, index) => [
          index + 1,
          value,
          formatNumber(value - mean, 3),
          formatNumber((value - mean) ** 2, 3),
        ]),
      }}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\sum_{i=1}^{${n}} x_i = ${values.slice(0, added).join(' + ') || '0'}${added === n ? ` = ${sum}` : ''},\\qquad \\bar{x} = \\frac{1}{${n}}\\sum_{i=1}^{${n}} x_i${meanShown ? ` = ${formatNumber(mean, 3)}` : ''}`}
        />
      </p>
      <ChartSvg label={description} aspect={0.45} minHeight={220} maxHeight={340}>
        {(box) => {
          const x = scaleBand<number>()
            .domain(values.map((_, index) => index))
            .range([box.inner.left, box.inner.left + box.inner.width])
            .padding(0.3);
          const y = scaleLinear()
            .domain([Math.min(0, ...values), Math.max(...values, mean) * 1.15])
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
              <g aria-hidden="true">
                {values.map((value, index) => {
                  const left = x(index) ?? 0;
                  const center = left + x.bandwidth() / 2;
                  return (
                    <g key={index}>
                      <rect
                        x={left}
                        y={Math.min(y(value), y(0))}
                        width={x.bandwidth()}
                        height={Math.abs(y(0) - y(value))}
                        fill={DATA_COLORS.primary}
                        fillOpacity={index < added ? 0.75 : 0.15}
                      />
                      <text
                        x={center}
                        y={y(value) - 6}
                        textAnchor="middle"
                        className={svgStyles.label}
                      >
                        {value}
                      </text>
                      <text
                        x={center}
                        y={box.inner.top + box.inner.height + 16}
                        textAnchor="middle"
                        className={svgStyles.labelMuted}
                      >
                        x{String.fromCodePoint(0x2080 + ((index + 1) % 10))}
                      </text>
                      {index < deviationsShown && (
                        <line
                          x1={center}
                          x2={center}
                          y1={y(mean)}
                          y2={y(value)}
                          stroke={DATA_COLORS.highlight}
                          strokeWidth={4}
                        />
                      )}
                    </g>
                  );
                })}
                {meanShown && (
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={y(mean)}
                    y2={y(mean)}
                    stroke={DATA_COLORS.secondary}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                  />
                )}
              </g>
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
