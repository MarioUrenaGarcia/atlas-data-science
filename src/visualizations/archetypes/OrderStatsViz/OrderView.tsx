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
const MEAN_GRID = 2000;

interface OrderViewProps {
  title: string;
  conceptId: string;
  config: OrderStatsVizConfig;
}

/**
 * The k-th order statistic X_(k): each simulated sample of size n is sorted
 * (strip above) and its k-th smallest value goes into the histogram, which
 * approaches the density n C(n-1, k-1) F^(k-1) (1-F)^(n-k) f. Moving k shifts
 * the distribution from the minimum to the maximum; the parent density is
 * drawn dashed for comparison.
 */
export function OrderView({ title, conceptId, config }: OrderViewProps) {
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
      {
        type: 'number' as const,
        key: 'k',
        label: 'Rango del estadístico',
        symbol: 'k',
        min: 1,
        max: 30,
        step: 1,
        digits: 0,
        default: config.k ?? 2,
      },
    ],
    [config.n, config.k],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const n = Math.round(values.n ?? 5);
  const k = Math.min(n, Math.max(1, Math.round(values.k ?? 1)));
  const { samples, count, total, playback, seed } = useOrderSamples(
    config,
    conceptId,
    distribution,
    n,
  );
  const column = samples.byRank[k - 1] ?? [];
  const density = (x: number) =>
    orderStatisticDensity(k, n, distribution.cdf(x), distribution.pdf(x));
  const exactMean = useMemo(() => {
    const [lo, hi] = [distribution.quantile(1e-6), distribution.quantile(1 - 1e-6)];
    const h = (hi - lo) / MEAN_GRID;
    let sum = 0;
    for (let i = 0; i < MEAN_GRID; i += 1) {
      const x = lo + (i + 0.5) * h;
      sum += x * orderStatisticDensity(k, n, distribution.cdf(x), distribution.pdf(x)) * h;
    }
    return sum;
  }, [distribution, k, n]);
  const simulatedMean = column.length > 0 ? column.reduce((a, b) => a + b, 0) / column.length : 0;
  const f = (v: number) => formatNumber(v, 3);
  const width = (domain[1] - domain[0]) / BINS;
  const header =
    count === 0
      ? `f_{X_{(${k})}}(x) = \\frac{n!}{(k-1)!\\,(n-k)!}\\, F(x)^{k-1}\\,\\big(1 - F(x)\\big)^{n-k} f(x), \\quad n = ${n},\\ k = ${k}`
      : `X_{(${k})} = ${f(samples.last[k - 1] ?? 0)}, \\qquad \\bar{X}_{(${k})} = ${f(simulatedMean)} \\approx \\mathbb{E}[X_{(${k})}] = ${f(exactMean)} \\quad (${count} \\text{ muestras})`;
  const description =
    `${n} observaciones independientes de ${parent.label.toLowerCase()}; estadístico de orden ${k}. ` +
    `Media exacta ${f(exactMean)}; media de ${count} muestras simuladas ${f(simulatedMean)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Muestras', value: `${count} de ${total}` },
        {
          label: `Último X(${k})`,
          value: count > 0 ? f(samples.last[k - 1] ?? 0) : 'sin datos',
          color: DATA_COLORS.highlight,
        },
        { label: `E[X(${k})] exacta`, value: f(exactMean), color: DATA_COLORS.text },
        { label: 'Media simulada', value: f(simulatedMean), color: DATA_COLORS.secondary },
      ]}
      legend={[
        {
          label: `Valor de rango ${k} en cada muestra`,
          color: DATA_COLORS.highlight,
          shape: 'circle',
        },
        { label: 'Histograma simulado', color: DATA_COLORS.secondary },
        { label: 'Densidad exacta del estadístico', color: DATA_COLORS.text, shape: 'line' },
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
        color={(rank) => (rank === k ? DATA_COLORS.highlight : DATA_COLORS.neutral)}
      />
      <DensityHistogram
        start={domain[0]}
        width={width}
        densities={densityBins(column, domain, BINS)}
        curves={[
          { f: density, color: DATA_COLORS.text },
          { f: (x) => distribution.pdf(x), color: DATA_COLORS.muted, dashed: true },
        ]}
        domain={domain}
        label={description}
        axisLabel={`x(${k})`}
      />
      <p className={styles.caption}>
        Cada muestra se ordena de menor a mayor; el punto resaltado es el de rango k y su valor se
        suma al histograma. Con k = 1 se estudia el mínimo y con k = n el máximo.
      </p>
    </VizFrame>
  );
}
