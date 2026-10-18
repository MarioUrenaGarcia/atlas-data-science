import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { orderStatisticDensity } from '../../../lib/probability/order.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { DensityHistogram } from '../../shared/DensityHistogram.tsx';
import styles from './OrderStatsViz.module.css';
import { SampleStrip } from './SampleStrip.tsx';
import type { OrderStatsVizConfig } from './schema.ts';
import { densityBins, useOrderSamples, useParent } from './useOrderSamples.ts';

const BINS = 40;

interface ExtremesViewProps {
  title: string;
  conceptId: string;
  config: OrderStatsVizConfig;
}

/**
 * The maximum and the minimum of n independent draws. The maximum stays at
 * or below x only if every draw does, so its distribution function is F(x)^n;
 * the minimum exceeds x only if every draw does, so P(min > x) = (1 - F(x))^n.
 * The histograms of both extremes approach the densities n F^(n-1) f and
 * n (1 - F)^(n-1) f, which move apart as n grows.
 */
export function ExtremesView({ title, conceptId, config }: ExtremesViewProps) {
  const parent = useParent(config);
  const { distribution, domain } = parent;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'n',
        label: 'Tamaño de la muestra',
        symbol: 'n',
        min: 2,
        max: 30,
        step: 1,
        digits: 0,
        default: config.n ?? 5,
      },
    ],
    [config.n],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const n = Math.round(values.n ?? 5);
  const { samples, count, total, playback, seed } = useOrderSamples(
    config,
    conceptId,
    distribution,
    n,
  );
  const maxima = samples.byRank[n - 1] ?? [];
  const minima = samples.byRank[0] ?? [];
  const median = distribution.quantile(0.5);
  const belowMedian = maxima.filter((value) => value <= median).length;
  const f = (v: number) => formatNumber(v, 3);
  const width = (domain[1] - domain[0]) / BINS;
  const header =
    count === 0
      ? `P(\\max \\le x) = F(x)^{n}, \\qquad P(\\min > x) = \\big(1 - F(x)\\big)^{n}`
      : `P(\\max \\le m) = F(m)^{${n}} = 0.5^{${n}} = ${formatNumber(0.5 ** n, 4)}, \\qquad \\text{simulado: } \\frac{${belowMedian}}{${count}} = ${formatNumber(belowMedian / count, 4)}`;
  const description =
    `Máximo y mínimo de ${n} observaciones de ${parent.label.toLowerCase()}. ` +
    `La mediana de cada observación es ${f(median)}; la probabilidad de que el máximo no la supere es ${formatNumber(0.5 ** n, 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Muestras', value: `${count} de ${total}` },
        {
          label: 'Último mínimo',
          value: count > 0 ? f(samples.last[0] ?? 0) : 'sin datos',
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Último máximo',
          value: count > 0 ? f(samples.last[n - 1] ?? 0) : 'sin datos',
          color: DATA_COLORS.highlight,
        },
        { label: 'Mediana m de cada observación', value: f(median) },
        { label: 'P(máx ≤ m) = 0.5^n', value: formatNumber(0.5 ** n, 4) },
      ]}
      legend={[
        { label: 'Mínimo', color: DATA_COLORS.secondary },
        { label: 'Máximo', color: DATA_COLORS.highlight },
        { label: 'Densidad de cada observación', color: DATA_COLORS.muted, shape: 'dashed' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <SampleStrip
        values={samples.last}
        domain={domain}
        label={`Última muestra ordenada. ${description}`}
        color={(rank) =>
          rank === 1
            ? DATA_COLORS.secondary
            : rank === n
              ? DATA_COLORS.highlight
              : DATA_COLORS.neutral
        }
      />
      <div className={styles.panels}>
        <DensityHistogram
          start={domain[0]}
          width={width}
          densities={densityBins(minima, domain, BINS)}
          curves={[
            {
              f: (x) => orderStatisticDensity(1, n, distribution.cdf(x), distribution.pdf(x)),
              color: DATA_COLORS.secondary,
            },
            { f: (x) => distribution.pdf(x), color: DATA_COLORS.muted, dashed: true },
          ]}
          domain={domain}
          label={`Distribución del mínimo. ${description}`}
          axisLabel="mínimo"
          aspect={0.7}
        />
        <DensityHistogram
          start={domain[0]}
          width={width}
          densities={densityBins(maxima, domain, BINS)}
          curves={[
            {
              f: (x) => orderStatisticDensity(n, n, distribution.cdf(x), distribution.pdf(x)),
              color: DATA_COLORS.highlight,
            },
            { f: (x) => distribution.pdf(x), color: DATA_COLORS.muted, dashed: true },
          ]}
          domain={domain}
          label={`Distribución del máximo. ${description}`}
          axisLabel="máximo"
          aspect={0.7}
        />
      </div>
      <p className={styles.caption}>
        El mínimo se recorre hacia la izquierda y el máximo hacia la derecha conforme crece n: con
        más observaciones es más probable que alguna sea extrema.
      </p>
    </VizFrame>
  );
}
