import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { spreadMeasure, type SpreadMeasure } from '../../../lib/stats/dispersion.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataStrip.module.css';
import { DeviationPanel } from './DeviationPanel.tsx';
import { SPREAD_NAMES, spreadFormula } from './spreadFormulas.ts';

const DEVIATIONS_PER_SECOND = 1.5;
const DOMAIN_PADDING = 0.08;

export interface SpreadDataset {
  values: readonly number[];
  variable: string;
  unit: string;
  labels?: readonly string[];
  domain?: [number, number];
}

interface DispersionViewProps {
  title: string;
  main: SpreadDataset;
  other?: SpreadDataset;
  measure: SpreadMeasure;
  readouts: readonly SpreadMeasure[];
  squares: boolean;
  band: boolean;
  decimals: number;
}

function domainOf(dataset: SpreadDataset): [number, number] {
  if (dataset.domain) return dataset.domain;
  const lo = Math.min(...dataset.values);
  const hi = Math.max(...dataset.values);
  const pad = (hi - lo) * DOMAIN_PADDING || 1;
  return [lo - pad, hi + pad];
}

function valueText(measure: SpreadMeasure, value: number, decimals: number, unit: string): string {
  if (Number.isNaN(value)) return 'no definido';
  if (measure === 'cv') return `${formatNumber(value * 100, 1)} %`;
  const squared = measure === 'varianza' || measure === 'varianza-n';
  return `${formatNumber(value, decimals + 2)}${unit ? ` ${unit}${squared ? '²' : ''}` : ''}`;
}

/**
 * Deviations from the center drawn one by one, with the formula of the
 * chosen spread measure accumulating the same terms. A second dataset can be
 * shown below to compare spreads in different units or scales.
 */
export function DispersionView(props: DispersionViewProps) {
  const { title, measure, squares, band, decimals } = props;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const key = `${props.main.values.join(',')}|${props.other?.values.join(',') ?? ''}|${run}`;
  const [state, update] = useResettableState(key, () => ({
    main: [...props.main.values],
    other: props.other ? [...props.other.values] : [],
    revealed: reducedMotion
      ? Math.max(props.main.values.length, props.other?.values.length ?? 0)
      : 0,
  }));
  const total = Math.max(state.main.length, state.other.length);
  const playback = usePlayback({
    step: () =>
      update((previous) => ({ ...previous, revealed: Math.min(total, previous.revealed + 1) })),
    reset: () => setRun((value) => value + 1),
    rate: DEVIATIONS_PER_SECOND,
    done: state.revealed >= total,
  });
  const datasets = [
    { ...props.main, values: state.main, key: 'main' as const },
    ...(props.other ? [{ ...props.other, values: state.other, key: 'other' as const }] : []),
  ];
  const readouts = datasets.flatMap((dataset) =>
    props.readouts.map((item) => ({
      label: `${SPREAD_NAMES[item]}${datasets.length > 1 ? `, ${dataset.variable}` : ''}`,
      value: valueText(item, spreadMeasure(item, dataset.values), decimals, dataset.unit),
      ...(item === measure ? { color: DATA_COLORS.highlight } : {}),
    })),
  );
  const description = datasets
    .map(
      (dataset) =>
        `${dataset.variable}: ${dataset.values.length} observaciones; ${SPREAD_NAMES[measure]} ${valueText(measure, spreadMeasure(measure, dataset.values), decimals, dataset.unit)}.`,
    )
    .join(' ');

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        {
          label: 'Desviaciones dibujadas',
          value: `${Math.min(state.revealed, total)} de ${total}`,
        },
        ...readouts,
      ]}
      legend={[
        { label: 'Observación (arrastrable)', color: DATA_COLORS.text, shape: 'circle' },
        { label: 'Desviación positiva', color: DATA_COLORS.positive, shape: 'line' },
        { label: 'Desviación negativa', color: DATA_COLORS.negative, shape: 'line' },
        ...(band
          ? [{ label: 'Media más y menos una desviación estándar', color: DATA_COLORS.primary }]
          : []),
      ]}
      description={description}
      dataTable={{
        caption: 'Valores',
        columns: datasets.map((dataset) => dataset.variable),
        rows: Array.from({ length: total }, (_, i) =>
          datasets.map((dataset) =>
            dataset.values[i] === undefined ? '' : formatNumber(dataset.values[i] ?? 0, decimals),
          ),
        ),
      }}
    >
      {datasets.map((dataset) => (
        <div key={dataset.key}>
          <p className={styles.formula}>
            <Latex
              tex={spreadFormula(
                measure,
                dataset.values,
                Math.min(state.revealed, dataset.values.length),
                decimals,
              )}
            />
          </p>
          <DeviationPanel
            values={dataset.values}
            measure={measure}
            revealed={state.revealed}
            squares={squares}
            band={band}
            domain={domainOf(props[dataset.key === 'main' ? 'main' : 'other'] ?? props.main)}
            variable={dataset.variable}
            unit={dataset.unit}
            decimals={decimals}
            {...(dataset.labels ? { labels: dataset.labels } : {})}
            label={description}
            onMove={(index, value) => {
              playback.pause();
              update((previous) => ({
                ...previous,
                [dataset.key]: previous[dataset.key].map((v, j) => (j === index ? value : v)),
              }));
            }}
          />
        </div>
      ))}
    </VizFrame>
  );
}
