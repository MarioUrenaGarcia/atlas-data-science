import { useMemo, useState } from 'react';
import { experiment, findEvent, type ExperimentId } from '../../../lib/probability/sampleSpace.ts';
import { formatProbability } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { eventLabel, eventOptions, gridCaption } from './labels.ts';
import styles from './SampleSpaceLab.module.css';
import type { SampleSpaceLabConfig } from './schema.ts';
import { SpaceGrid } from './SpaceGrid.tsx';

const STAGES_PER_SECOND = 0.6;
const LAST_STAGE = 3;

const STAGE_TEXT = [
  'Se quiere la probabilidad de que ocurra A o B.',
  'Paso 1: se suman las probabilidades de los resultados de A.',
  'Paso 2: se suman las de B. Los resultados comunes quedan contados dos veces.',
  'Paso 3: se resta la intersección una vez. Cada resultado de la unión queda contado una sola vez.',
];

interface UnionViewProps {
  title: string;
  config: SampleSpaceLabConfig;
}

/**
 * The addition rule built in three steps. Each cell shows how many times
 * its outcome has been counted: adding P(B) double counts the intersection,
 * and subtracting P(A and B) brings every outcome of the union back to one.
 */
export function UnionView({ title, config }: UnionViewProps) {
  const experimentId: ExperimentId = config.experimento ?? 'dos-dados';
  const space = experiment(experimentId);
  const definitions = useMemo(() => {
    const options = eventOptions(experimentId, config.eventos);
    return [
      {
        type: 'select' as const,
        key: 'eventoA',
        label: 'Evento A',
        options,
        default: config.eventoA ?? options[0]?.value ?? '',
      },
      {
        type: 'select' as const,
        key: 'eventoB',
        label: 'Evento B',
        options,
        default: config.eventoB ?? options[1]?.value ?? '',
      },
    ];
  }, [config, experimentId]);
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const eventA = values.eventoA ?? '';
  const eventB = values.eventoB ?? '';
  const testA = findEvent(experimentId, eventA)?.test ?? (() => false);
  const testB = findEvent(experimentId, eventB)?.test ?? (() => false);

  const [run, setRun] = useState(0);
  const [stage, updateStage] = useResettableState(`${eventA}|${eventB}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => updateStage((value) => Math.min(LAST_STAGE, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STAGES_PER_SECOND,
    done: stage >= LAST_STAGE,
  });

  const n = space.outcomes.length;
  const a = space.outcomes.filter(testA).length;
  const b = space.outcomes.filter(testB).length;
  const both = space.outcomes.filter((o) => testA(o) && testB(o)).length;
  const union = a + b - both;
  const frac = (k: number) => `\\frac{${k}}{${n}}`;
  const headers = [
    `P(A \\cup B) = \\;?`,
    `P(A) = ${frac(a)}`,
    `P(A) + P(B) = ${frac(a)} + ${frac(b)} = ${frac(a + b)}`,
    `P(A) + P(B) - P(A \\cap B) = ${frac(a)} + ${frac(b)} - ${frac(both)} = ${frac(union)} = P(A \\cup B)`,
  ];
  const times = (outcome: readonly number[]) => {
    const inA = testA(outcome);
    const inB = testB(outcome);
    let count = 0;
    if (stage >= 1 && inA) count += 1;
    if (stage >= 2 && inB) count += 1;
    if (stage >= 3 && inA && inB) count -= 1;
    return count;
  };
  const description =
    `${space.label}. A: ${eventLabel(experimentId, eventA)} (${a} resultados). B: ${eventLabel(experimentId, eventB)} (${b} resultados). ` +
    `Intersección: ${both} resultados. Unión: ${union} resultados, probabilidad ${formatProbability(union / n)}. ${STAGE_TEXT[stage]}`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'P(A)', value: formatProbability(a / n), color: DATA_COLORS.primary },
        { label: 'P(B)', value: formatProbability(b / n), color: DATA_COLORS.secondary },
        { label: 'P(A ∩ B)', value: formatProbability(both / n), color: DATA_COLORS.highlight },
        { label: 'P(A ∪ B)', value: formatProbability(union / n) },
        { label: 'P(A) + P(B)', value: formatProbability((a + b) / n) },
      ]}
      legend={[
        { label: 'Contado una vez', color: DATA_COLORS.primary },
        { label: 'Contado dos veces', color: DATA_COLORS.highlight },
        { label: 'B (rayado)', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <FormulaLine tex={headers[stage] ?? ''} />
      <p className={styles.stage}>{STAGE_TEXT[stage]}</p>
      <p className={styles.caption}>
        A: {eventLabel(experimentId, eventA)}. B: {eventLabel(experimentId, eventB)}.
      </p>
      <SpaceGrid
        experiment={space}
        label={description}
        fill={(outcome) => {
          const count = times(outcome);
          if (count >= 2) return { color: DATA_COLORS.highlight, opacity: 0.85 };
          if (count === 1) return { color: DATA_COLORS.primary, opacity: 0.55 };
          return null;
        }}
        stripe={(outcome) => (stage >= 2 && testB(outcome) ? 'b' : null)}
        text={(outcome) => {
          const count = times(outcome);
          return count > 0 ? `${count}` : '';
        }}
      />
      <p className={styles.caption}>
        El número en cada casilla indica cuántas veces se ha sumado ese resultado.{' '}
        {gridCaption(experimentId)}
      </p>
    </VizFrame>
  );
}
