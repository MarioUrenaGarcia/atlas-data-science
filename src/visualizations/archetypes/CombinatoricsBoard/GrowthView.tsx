import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { logFactorial } from '../../../lib/distributions/special.ts';
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
import styles from './CombinatoricsBoard.module.css';

const VALUES_PER_SECOND = 3;

/** log10 of Stirling's approximation sqrt(2 pi n) (n / e)^n. */
function logStirling(n: number): number {
  return (0.5 * Math.log(2 * Math.PI * n) + n * Math.log(n / Math.E)) / Math.LN10;
}

const CURVES = [
  {
    key: 'factorial',
    label: 'n!',
    color: DATA_COLORS.primary,
    log10: (n: number) => logFactorial(n) / Math.LN10,
  },
  {
    key: 'stirling',
    label: 'Aproximación de Stirling',
    color: DATA_COLORS.secondary,
    log10: logStirling,
  },
  {
    key: 'exponencial',
    label: '2ⁿ',
    color: DATA_COLORS.tertiary,
    log10: (n: number) => n * Math.log10(2),
  },
  {
    key: 'potencia',
    label: 'nⁿ',
    color: DATA_COLORS.quaternary,
    log10: (n: number) => n * Math.log10(n),
  },
] as const;

/** Largest log10 shown with all its digits; larger values switch to scientific notation. */
const EXACT_DIGITS = 9;

/** Value 10^x, rounded to an integer while it is small enough to show every digit. */
function powerOfTen(log10: number): string {
  const value = 10 ** log10;
  return formatNumber(log10 < EXACT_DIGITS ? Math.round(value) : value, 4);
}

interface GrowthViewProps {
  title: string;
  nMax: number;
}

/**
 * Growth of n! on a logarithmic scale against 2^n and n^n, with Stirling's
 * approximation, whose relative error shrinks like 1 / (12 n).
 */
export function GrowthView({ title, nMax }: GrowthViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'n',
        label: 'Valor marcado',
        symbol: 'n',
        min: 1,
        max: nMax,
        step: 1,
        default: 10,
      },
    ],
    [nMax],
  );
  const parameters = useParameters(definitions);
  const n = Number((parameters.values as Record<string, number>).n);
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${nMax}|${run}`, () => 1);
  const playback = usePlayback({
    step: () => update((value) => Math.min(nMax, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: VALUES_PER_SECOND,
    done: shown >= nMax,
  });

  const exactLog = logFactorial(n) / Math.LN10;
  const stirlingLog = logStirling(n);
  const relativeError = 1 - 10 ** (stirlingLog - exactLog);
  const description =
    `En escala logarítmica, n! crece más rápido que 2 a la n y más lento que n a la n. ` +
    `Para n = ${n}, n! vale ${powerOfTen(exactLog)} y la aproximación de Stirling se queda corta en ${formatNumber(relativeError * 100, 3)} %.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: `${n}!`, value: powerOfTen(exactLog), color: DATA_COLORS.primary },
        { label: 'Stirling', value: powerOfTen(stirlingLog), color: DATA_COLORS.secondary },
        { label: 'Error relativo', value: `${formatNumber(relativeError * 100, 3)} %` },
        { label: 'Cifras de n!', value: String(Math.floor(exactLog) + 1) },
      ]}
      legend={CURVES.map((curve) => ({
        label: curve.label,
        color: curve.color,
        shape: 'line' as const,
      }))}
      description={description}
      dataTable={{
        caption: 'Valores en escala logarítmica (log base 10)',
        columns: ['n', 'log n!', 'log Stirling', 'log 2ⁿ', 'log nⁿ'],
        rows: Array.from({ length: nMax }, (_, index) => {
          const value = index + 1;
          return [value, ...CURVES.map((curve) => formatNumber(curve.log10(value), 3))];
        }),
      }}
    >
      <p className={styles.formula}>
        <Latex tex="n! = n(n-1)\cdots 2 \cdot 1 \approx \sqrt{2\pi n}\left(\frac{n}{e}\right)^{n}" />
      </p>
      <ChartSvg label={description} aspect={0.55} minHeight={260} maxHeight={440}>
        {(box) => {
          const x = scaleLinear()
            .domain([1, nMax])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const top = nMax * Math.log10(nMax);
          const y = scaleLinear()
            .domain([0, top])
            .nice()
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const points = (log10: (value: number) => number) =>
            Array.from({ length: shown }, (_, index) => ({ x: index + 1, y: log10(index + 1) }));
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="cifras (log₁₀)"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={8}
                label="n"
              />
              {CURVES.map((curve) => (
                <CurvePath
                  key={curve.key}
                  points={points(curve.log10)}
                  xScale={x}
                  yScale={y}
                  color={curve.color}
                  width={curve.key === 'factorial' ? 3 : 2}
                  dashed={curve.key === 'stirling'}
                  animate={false}
                />
              ))}
              <line
                x1={x(n)}
                x2={x(n)}
                y1={box.inner.top}
                y2={box.inner.top + box.inner.height}
                stroke={DATA_COLORS.highlight}
                strokeWidth={2}
                aria-hidden="true"
              />
              <circle
                cx={x(n)}
                cy={y(exactLog)}
                r={5}
                fill={DATA_COLORS.primary}
                aria-hidden="true"
              />
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
