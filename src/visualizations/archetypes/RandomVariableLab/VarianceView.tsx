import { useMemo, useState } from 'react';
import { affinePmf, expectationOf, varianceOf } from '../../../lib/probability/randomVariable.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { PmfChart } from './PmfChart.tsx';
import styles from './RandomVariableLab.module.css';
import type { RandomVariableLabConfig } from './schema.ts';
import { resolveSource, type VariableSource } from './source.ts';

const TERMS_PER_SECOND = 1.5;
const MAX_LISTED_TERMS = 5;

interface VarianceViewProps {
  title: string;
  config: RandomVariableLabConfig;
}

/**
 * Variance as the expected squared distance to the mean. The lower chart
 * shows each contribution (x - mu)^2 p(x), added one at a time; the band
 * mu +- sigma marks one standard deviation. With the affine controls the
 * view also shows Y = aX + b, whose variance is a^2 Var(X) whatever b is.
 */
export function VarianceView({ title, config }: VarianceViewProps) {
  const source = resolveSource(config);
  const affine = config.a !== undefined || config.b !== undefined;
  const definitions = useMemo(
    () =>
      affine
        ? [
            {
              type: 'number' as const,
              key: 'a',
              label: 'Escala a',
              symbol: 'a',
              min: -3,
              max: 3,
              step: 0.5,
              digits: 1,
              default: config.a ?? 1,
            },
            {
              type: 'number' as const,
              key: 'b',
              label: 'Desplazamiento b',
              symbol: 'b',
              min: -10,
              max: 10,
              step: 1,
              digits: 0,
              default: config.b ?? 0,
            },
          ]
        : [],
    [affine, config.a, config.b],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const a = values.a ?? 1;
  const b = values.b ?? 0;
  const { pmf } = source;
  const mean = expectationOf(pmf);
  const variance = varianceOf(pmf);
  const sd = Math.sqrt(variance);
  const contributions = pmf.values.map(
    (value, index) => (value - mean) ** 2 * (pmf.probs[index] ?? 0),
  );
  const n = source.continuous ? 1 : pmf.values.length;

  const [run, setRun] = useState(0);
  const [added, update] = useResettableState(`${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(n, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: TERMS_PER_SECOND,
    done: added >= n,
  });
  const partial = contributions.slice(0, added).reduce((sum, value) => sum + value, 0);
  const s = source.symbol;
  const mu = formatNumber(mean, 2);
  const header = (() => {
    if (affine && added >= n)
      return `\\operatorname{Var}(${formatNumber(a, 1)}${s} ${b >= 0 ? '+' : '-'} ${formatNumber(Math.abs(b), 0)}) = ${formatNumber(a, 1)}^2 \\cdot ${formatNumber(variance, 3)} = ${formatNumber(a * a * variance, 3)}`;
    if (source.continuous)
      return added === 0
        ? `\\operatorname{Var}(${s}) = \\int (x - \\mu)^2 f(x)\\, dx`
        : `\\operatorname{Var}(${s}) \\approx ${formatNumber(variance, 3)}, \\quad \\sigma \\approx ${formatNumber(sd, 3)}`;
    if (added === 0)
      return `\\operatorname{Var}(${s}) = \\sum_x (x - \\mu)^2 p(x), \\quad \\mu = ${mu}`;
    const shown = pmf.values
      .slice(0, added)
      .map(
        (value, index) =>
          `(${formatNumber(value, 2)} - ${mu})^2 \\cdot ${formatNumber(pmf.probs[index] ?? 0, 3)}`,
      );
    const listed =
      shown.length > MAX_LISTED_TERMS
        ? [...shown.slice(0, 2), '\\cdots', ...shown.slice(-1)]
        : shown;
    return `\\operatorname{Var}(${s}) ${added < n ? '\\approx' : '='} ${listed.join(' + ')}${added < n ? ' + \\cdots' : ''} = ${formatNumber(added < n ? partial : variance, 3)}`;
  })();
  const contributionSource: VariableSource = {
    ...source,
    pmf: { values: pmf.values, probs: contributions },
  };
  const ySource: VariableSource | null = affine
    ? (() => {
        const y = affinePmf(pmf, a, b);
        const lo = y.values[0] ?? 0;
        const hi = y.values.at(-1) ?? 0;
        return {
          ...source,
          pmf: y,
          symbol: 'Y',
          domain: [Math.min(lo, -1) - 1, Math.max(hi, 1) + 1],
        };
      })()
    : null;
  const yMean = ySource ? expectationOf(ySource.pmf) : 0;
  const ySd = ySource ? Math.sqrt(varianceOf(ySource.pmf)) : 0;
  const description =
    `${source.label}. Media ${formatNumber(mean, 3)}, varianza ${formatNumber(variance, 3)}, desviación estándar ${formatNumber(sd, 3)}.` +
    (ySource
      ? ` Y = ${formatNumber(a, 1)}X + ${formatNumber(b, 0)}: media ${formatNumber(yMean, 3)}, desviación estándar ${formatNumber(ySd, 3)}.`
      : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={affine ? { ...parameters, values } : undefined}
      readouts={[
        { label: 'Media μ', value: formatNumber(mean, 3), color: DATA_COLORS.secondary },
        { label: 'Varianza σ²', value: formatNumber(variance, 3), color: DATA_COLORS.primary },
        { label: 'Desviación estándar σ', value: formatNumber(sd, 3) },
        ...(ySource
          ? [
              { label: 'Media de Y', value: formatNumber(yMean, 3) },
              {
                label: 'Varianza de Y',
                value: formatNumber(ySd ** 2, 3),
                color: DATA_COLORS.tertiary,
              },
            ]
          : []),
      ]}
      legend={[
        { label: 'Media', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Banda μ ± σ', color: DATA_COLORS.secondary },
        { label: 'Contribución (x - μ)² p(x)', color: DATA_COLORS.primary },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <PmfChart
        source={source}
        label={description}
        aspect={0.34}
        color={() => DATA_COLORS.neutral}
        opacity={() => 0.55}
        markers={[{ x: mean, label: `μ = ${formatNumber(mean, 2)}`, color: DATA_COLORS.secondary }]}
        bands={[{ from: mean - sd, to: mean + sd, color: DATA_COLORS.secondary }]}
        showValues={false}
      />
      <PmfChart
        source={contributionSource}
        label={description}
        aspect={0.28}
        yLabel="contribución"
        color={(index) =>
          source.continuous || index < added ? DATA_COLORS.primary : DATA_COLORS.neutral
        }
        opacity={(index) => (source.continuous || index < added ? 0.8 : 0.25)}
        markers={[{ x: mean, label: '', color: DATA_COLORS.secondary, dashed: true }]}
        showValues={false}
      />
      <p className={styles.caption}>
        Abajo, cada barra es lo que ese valor aporta a la varianza: crece con el cuadrado de la
        distancia a la media, así que los valores lejanos pesan mucho aunque sean poco probables.
      </p>
      {ySource && (
        <>
          <PmfChart
            source={ySource}
            label={description}
            aspect={0.3}
            color={() => DATA_COLORS.tertiary}
            markers={[
              { x: yMean, label: `E[Y] = ${formatNumber(yMean, 2)}`, color: DATA_COLORS.secondary },
            ]}
            bands={[{ from: yMean - ySd, to: yMean + ySd, color: DATA_COLORS.secondary }]}
            showValues={false}
          />
          <p className={styles.caption}>
            Y = aX + b: el desplazamiento b mueve la distribución sin cambiar su ancho; la escala a
            multiplica la desviación estándar por |a| y la varianza por a².
          </p>
        </>
      )}
    </VizFrame>
  );
}
