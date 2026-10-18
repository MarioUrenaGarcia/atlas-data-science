import { useMemo, useState } from 'react';
import { correlationScores, validationError } from '../../../lib/dataprep/selection.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { HBars } from '../../shared/HBars.tsx';
import { cropData, CROP_FEATURES, ROLE_NAMES } from './cropData.ts';

const FEATURES_PER_SECOND = 1.2;

/**
 * Each candidate variable gets a score computed on its own (here the
 * absolute correlation with the yield) and the k best are kept. The filter
 * is fast and model-free, but it keeps the redundant copy of rain and misses
 * the temperature, whose effect is not linear.
 */
export function FilterView({ title, k, seed: seed0 }: { title: string; k: number; seed: number }) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'k',
      label: 'Variables que se conservan',
      min: 1,
      max: 8,
      step: 1,
      default: k,
      symbol: 'k',
    },
  ];
  const parameters = useParameters(definitions);
  const keep = Number(parameters.values.k);
  const seed = useSeed(seed0);
  const data = useMemo(() => cropData(seed.seed), [seed.seed]);
  const scores = useMemo(() => correlationScores(data), [data]);
  const total = scores.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${seed.seed}|${run}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: FEATURES_PER_SECOND,
    done: shown >= total,
  });
  const order = scores
    .map((s, j) => ({ s, j }))
    .sort((a, b) => b.s - a.s)
    .map((o) => o.j);
  const selected = shown >= total ? order.slice(0, keep) : [];
  const errorSelected = selected.length > 0 ? validationError(data, selected) : Number.NaN;
  const errorAll = validationError(
    data,
    data.names.map((_, j) => j),
  );
  const current = shown > 0 ? shown - 1 : -1;
  const g = (v: number) => formatNumber(v, 3);
  const header =
    current >= 0 && shown < total
      ? `|r(\\text{${data.names[current]}},\\ y)| = ${g(scores[current] ?? 0)}`
      : `\\text{se conservan las } ${keep} \\text{ variables con mayor } |r(x_j, y)|`;
  const description =
    `Filtro por correlación absoluta con el rendimiento: ${data.names.map((n, j) => `${n} ${g(scores[j] ?? 0)}`).join(', ')}. ` +
    (selected.length > 0
      ? `Con k = ${keep} se conservan ${selected.map((j) => data.names[j]).join(', ')}; error de validación ${g(errorSelected)} contra ${g(errorAll)} con todas.`
      : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Variables evaluadas', value: `${shown} de ${total}` },
        {
          label: 'Seleccionadas',
          value: selected.length > 0 ? selected.map((j) => data.names[j]).join(', ') : '...',
        },
        {
          label: 'Error de validación con las seleccionadas',
          value: g(errorSelected),
          color: DATA_COLORS.highlight,
        },
        { label: 'Error de validación con todas', value: g(errorAll) },
      ]}
      legend={[
        { label: 'Seleccionada', color: DATA_COLORS.highlight },
        { label: 'Descartada', color: DATA_COLORS.primary },
      ]}
      description={description}
      dataTable={{
        caption: 'Puntaje de cada variable',
        columns: ['Variable', 'Papel en los datos simulados', '|r| con el rendimiento'],
        rows: data.names.map((n, j) => [
          n,
          ROLE_NAMES[CROP_FEATURES[j]?.role ?? 'ruido'],
          g(scores[j] ?? 0),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <HBars
        labels={data.names}
        values={scores.map((s, j) => (j < shown ? s : 0))}
        highlight={current >= 0 && shown < total ? current : -1}
        colors={data.names.map((_, j) =>
          selected.includes(j) ? DATA_COLORS.highlight : DATA_COLORS.primary,
        )}
        axisLabel="Correlación absoluta con el rendimiento"
        decimals={2}
        domain={[0, 1]}
        labelWidth={136}
        label={description}
      />
    </VizFrame>
  );
}
