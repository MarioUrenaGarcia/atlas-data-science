import { useMemo, useState } from 'react';
import { recursiveElimination } from '../../../lib/dataprep/selection.ts';
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
 * Recursive feature elimination: fit the model with every variable, drop
 * the one with the smallest standardized coefficient, refit and repeat. The
 * validation error of each subset shows which size to keep.
 */
export function RfeView({ title, seed: seed0 }: { title: string; seed: number }) {
  const seed = useSeed(seed0);
  const data = useMemo(() => cropData(seed.seed), [seed.seed]);
  const steps = useMemo(() => recursiveElimination(data), [data]);
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
  const next = steps[shown];
  const toDrop = next ? current.chosen.find((j) => !next.chosen.includes(j)) : undefined;
  const errors = steps.map((s) => s.error);
  const best = errors.indexOf(Math.min(...errors));
  const g = (v: number) => formatNumber(v, 3);
  const header =
    toDrop === undefined
      ? `\\text{sin variables: } \\mathrm{ECM}_{\\text{val}} = ${g(current.error)}`
      : `\\min_j |\\hat{\\beta}_j| = |\\hat{\\beta}_{\\text{${data.names[toDrop]}}}| = ${g(Math.abs(current.candidates[toDrop] ?? 0))} \\Rightarrow \\text{se elimina}`;
  const description =
    `Eliminación recursiva, ${current.chosen.length} variables: ${current.chosen.map((j) => data.names[j]).join(', ') || 'ninguna'}; error de validación ${g(current.error)}. ` +
    (toDrop === undefined ? '' : `Siguiente en salir: ${data.names[toDrop]}. `) +
    (shown >= total
      ? `El menor error se alcanza con ${steps[best]?.chosen.length ?? 0} variables.`
      : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      readouts={[
        { label: 'Variables restantes', value: String(current.chosen.length) },
        {
          label: 'Siguiente en salir',
          value: toDrop === undefined ? 'ninguna' : (data.names[toDrop] ?? ''),
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
        caption: 'Subconjuntos de la eliminación recursiva',
        columns: ['Variables', 'Conjunto', 'Error de validación'],
        rows: steps.map((s) => [
          s.chosen.length,
          s.chosen.map((j) => data.names[j]).join(', ') || 'ninguna',
          g(s.error),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <div className={styles.pair}>
        <div>
          <h4 className={styles.panelTitle}>Coeficientes estandarizados del modelo actual</h4>
          <HBars
            labels={data.names}
            values={current.candidates.map((v) => (Number.isFinite(v) ? Math.abs(v) : 0))}
            highlight={toDrop ?? -1}
            colors={data.names.map(() => DATA_COLORS.primary)}
            axisLabel="Valor absoluto del coeficiente"
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
