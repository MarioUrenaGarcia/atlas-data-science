import { useMemo, useState } from 'react';
import { forwardSelection } from '../../../lib/dataprep/selection.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { HBars } from '../../shared/HBars.tsx';
import { cropData } from './cropData.ts';
import styles from './FeatureSelectionViz.module.css';
import { StepCurve } from './StepCurve.tsx';

const STEPS_PER_SECOND = 0.7;

/**
 * Forward selection: at each step every remaining variable is tried by
 * fitting the model with it and measuring the validation error, and the
 * best one is added. The curve of errors shows where adding more stops helping.
 */
export function WrapperView({ title, seed: seed0 }: { title: string; seed: number }) {
  const seed = useSeed(seed0);
  const data = useMemo(() => cropData(seed.seed), [seed.seed]);
  const steps = useMemo(() => forwardSelection(data), [data]);
  const total = steps.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${seed.seed}|${run}`, () =>
    reducedMotion ? total : 1,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: shown >= total,
  });
  const current = steps[shown - 1] ?? steps[0];
  if (!current) return null;
  const errors = steps.map((s) => s.error);
  const best = errors.indexOf(Math.min(...errors));
  const added = current.chosen[current.chosen.length - 1];
  const g = (v: number) => formatNumber(v, 3);
  const header =
    added === undefined
      ? `\\text{modelo sin variables: } \\mathrm{ECM}_{\\text{val}} = ${g(current.error)}`
      : `S_{${current.chosen.length}} = S_{${current.chosen.length - 1}} \\cup \\{\\text{${data.names[added]}}\\},\\quad \\mathrm{ECM}_{\\text{val}} = ${g(current.error)}`;
  const description =
    `Selección hacia adelante, paso ${shown - 1}: variables ${current.chosen.map((j) => data.names[j]).join(', ') || 'ninguna'}, error de validación ${g(current.error)}. ` +
    (shown >= total
      ? `El menor error, ${g(errors[best] ?? 0)}, se alcanza con ${steps[best]?.chosen.length ?? 0} variables.`
      : '');
  const candidateValues = current.candidates.map((v) => (Number.isFinite(v) ? v : 0));

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      readouts={[
        { label: 'Variables en el modelo', value: String(current.chosen.length) },
        {
          label: 'Última agregada',
          value: added === undefined ? 'ninguna' : (data.names[added] ?? ''),
        },
        { label: 'Error de validación', value: g(current.error), color: DATA_COLORS.primary },
        {
          label: 'Mejor número de variables',
          value: shown >= total ? String(steps[best]?.chosen.length ?? 0) : '...',
          color: DATA_COLORS.highlight,
        },
      ]}
      description={description}
      dataTable={{
        caption: 'Orden de entrada y error de validación',
        columns: ['Paso', 'Variable agregada', 'Error de validación'],
        rows: steps.map((s, i) => [
          i,
          i === 0 ? 'ninguna' : (data.names[s.chosen[s.chosen.length - 1] ?? 0] ?? ''),
          g(s.error),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <div className={styles.pair}>
        <div>
          <h4 className={styles.panelTitle}>Error de validación de cada candidata en este paso</h4>
          <HBars
            labels={data.names}
            values={candidateValues}
            highlight={added ?? -1}
            colors={data.names.map((_, j) =>
              current.chosen.includes(j) ? DATA_COLORS.neutral : DATA_COLORS.primary,
            )}
            axisLabel="Error de validación al agregarla"
            decimals={2}
            labelWidth={136}
            label={description}
          />
        </div>
        <div>
          <h4 className={styles.panelTitle}>Error según el número de variables</h4>
          <StepCurve
            counts={steps.map((s) => s.chosen.length)}
            errors={errors}
            shown={shown}
            best={best}
            label={description}
          />
        </div>
      </div>
    </VizFrame>
  );
}
