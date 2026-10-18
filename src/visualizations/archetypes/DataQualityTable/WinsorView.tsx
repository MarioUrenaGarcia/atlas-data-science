import { useMemo, useState } from 'react';
import { winsorizeQuantiles } from '../../../lib/dataprep/missing.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { linearRegression, mean, pearson, standardDeviation } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './Quality.module.css';
import { ScatterFrame, StackedHistogram } from '../../shared/ScatterCharts.tsx';
import { padded } from './missingData.ts';

const HOMES = 150;
const MORPH_STEPS = 20;
const STEPS_PER_SECOND = 12;

/** Floor area and price of homes; a few luxury homes form a long right tail in price. */
function homes(seed: number): [number, number][] {
  const random = new Random(seed);
  return Array.from({ length: HOMES }, () => {
    const area = Math.max(40, random.normal(110, 30));
    const luxury = random.next() < 0.04;
    const price =
      Math.exp(Math.log(0.025 * area) + random.normal(0, 0.25)) *
      (luxury ? random.uniform(3, 6) : 1);
    return [area, price];
  });
}

/**
 * Prices below the p-quantile and above the (1 - p)-quantile slide to those
 * quantiles. The histogram loses its long tail, the spread drops and the
 * regression line stops being pulled by the luxury homes.
 */
export function WinsorView({ title, p, seed: seed0 }: { title: string; p: number; seed: number }) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'p',
      label: 'Proporción winsorizada en cada cola',
      min: 0,
      max: 0.2,
      step: 0.01,
      default: p,
      symbol: 'p',
      digits: 2,
    },
  ];
  const parameters = useParameters(definitions);
  const share = Number(parameters.values.p);
  const seed = useSeed(seed0);
  const data = useMemo(() => homes(seed.seed), [seed.seed]);
  const prices = data.map((d) => d[1]);
  const result = winsorizeQuantiles(prices, share);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [stepIndex, update] = useResettableState<number>(`${seed.seed}|${share}|${run}`, () =>
    reducedMotion ? MORPH_STEPS : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(MORPH_STEPS, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: stepIndex >= MORPH_STEPS,
  });
  const t = stepIndex / MORPH_STEPS;
  const current = prices.map((v, i) => v + ((result.values[i] ?? v) - v) * t);
  const areas = data.map((d) => d[0]);
  const fitBefore = linearRegression(areas, prices);
  const fitNow = linearRegression(areas, current);
  const g = (v: number) => formatNumber(v, 2);
  const header = `w_i = \\min\\big(\\max(x_i,\\ q_{${formatNumber(share, 2)}}),\\ q_{${formatNumber(1 - share, 2)}}\\big),\\quad [q_{${formatNumber(share, 2)}},\\ q_{${formatNumber(1 - share, 2)}}] = [${g(result.low)},\\ ${g(result.high)}]`;
  const description =
    `${HOMES} viviendas. Winsorización al ${formatNumber(share * 100, 0)} % por cola: precios entre ${g(result.low)} y ${g(result.high)} millones; ` +
    `${result.clippedLow + result.clippedHigh} valores recortados. Media ${g(mean(prices))} a ${g(mean(current))}; ` +
    `desviación estándar ${g(standardDeviation(prices))} a ${g(standardDeviation(current))}; pendiente ${formatNumber(fitBefore.slope, 4)} a ${formatNumber(fitNow.slope, 4)}.`;
  const yDomain = padded([...prices, 0]);

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Límites (millones)', value: `${g(result.low)} y ${g(result.high)}` },
        {
          label: 'Valores recortados abajo y arriba',
          value: `${result.clippedLow} y ${result.clippedHigh}`,
        },
        { label: 'Media original y actual', value: `${g(mean(prices))} y ${g(mean(current))}` },
        {
          label: 'Desviación estándar original y actual',
          value: `${g(standardDeviation(prices))} y ${g(standardDeviation(current))}`,
          color: DATA_COLORS.highlight,
        },
        {
          label: 'Correlación con la superficie',
          value: `${g(pearson(areas, prices))} y ${g(pearson(areas, current))}`,
        },
      ]}
      legend={[
        { label: 'Precio actual', color: DATA_COLORS.primary },
        { label: 'Límites de winsorización', color: DATA_COLORS.highlight, shape: 'dashed' },
        { label: 'Recta con datos originales', color: DATA_COLORS.muted, shape: 'line' },
        { label: 'Recta con datos actuales', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div className={styles.pair}>
        <StackedHistogram
          series={[{ values: current, color: DATA_COLORS.primary }]}
          domain={yDomain}
          binWidth={(yDomain[1] - yDomain[0]) / 30}
          label={description}
          axisLabel="Precio (millones de pesos)"
        />
        <ScatterFrame
          xDomain={padded(areas)}
          yDomain={yDomain}
          xLabel="Superficie (m²)"
          yLabel="Precio (millones)"
          label={description}
        >
          {({ x, y, left, right }) => (
            <g aria-hidden="true">
              {[result.low, result.high].map((l, i) => (
                <line
                  key={i}
                  x1={left}
                  x2={right}
                  y1={y(l)}
                  y2={y(l)}
                  stroke={DATA_COLORS.highlight}
                  strokeDasharray="6 4"
                />
              ))}
              {current.map((v, i) => (
                <circle
                  key={i}
                  cx={x(areas[i] ?? 0)}
                  cy={y(v)}
                  r={3.2}
                  fill={DATA_COLORS.primary}
                  fillOpacity={0.6}
                />
              ))}
              {[fitBefore, fitNow].map((fit, i) => (
                <line
                  key={i}
                  x1={left}
                  x2={right}
                  y1={y(fit.intercept + fit.slope * x.invert(left))}
                  y2={y(fit.intercept + fit.slope * x.invert(right))}
                  stroke={i === 0 ? DATA_COLORS.muted : DATA_COLORS.highlight}
                  strokeWidth={2}
                />
              ))}
            </g>
          )}
        </ScatterFrame>
      </div>
    </VizFrame>
  );
}
