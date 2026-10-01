import { useMemo, useState } from 'react';
import { experiment, findEvent, type ExperimentId } from '../../../lib/probability/sampleSpace.ts';
import { formatProbability } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
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

interface ConditionalViewProps {
  title: string;
  config: SampleSpaceLabConfig;
}

/**
 * Conditioning as shrinking the sample space. Once the condition is known to
 * have happened, the outcomes outside it are discarded and the probability
 * of the other event is recomputed as a share of what remains.
 */
export function ConditionalView({ title, config }: ConditionalViewProps) {
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
      {
        type: 'select' as const,
        key: 'condicion',
        label: 'Se sabe que ocurrió',
        options: [
          { value: 'B', label: 'B (se calcula P(A | B))' },
          { value: 'A', label: 'A (se calcula P(B | A))' },
        ],
        default: config.condicion ?? 'B',
      },
    ];
  }, [config, experimentId]);
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const eventA = values.eventoA ?? '';
  const eventB = values.eventoB ?? '';
  const onA = values.condicion === 'A';
  const testA = findEvent(experimentId, eventA)?.test ?? (() => false);
  const testB = findEvent(experimentId, eventB)?.test ?? (() => false);
  // "target" is the event whose probability is updated; "given" is the known condition.
  const target = onA ? testB : testA;
  const given = onA ? testA : testB;
  const targetName = onA ? 'B' : 'A';
  const givenName = onA ? 'A' : 'B';

  const [run, setRun] = useState(0);
  const [stage, updateStage] = useResettableState(`${eventA}|${eventB}|${onA}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => updateStage((value) => Math.min(LAST_STAGE, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STAGES_PER_SECOND,
    done: stage >= LAST_STAGE,
  });

  const n = space.outcomes.length;
  const sizeTarget = space.outcomes.filter(target).length;
  const sizeGiven = space.outcomes.filter(given).length;
  const both = space.outcomes.filter((o) => target(o) && given(o)).length;
  const conditional = sizeGiven > 0 ? both / sizeGiven : 0;
  const unconditional = sizeTarget / n;
  const pAB = `P(${targetName} \\mid ${givenName})`;
  const headers = [
    `P(${targetName}) = \\frac{|${targetName}|}{|\\Omega|} = \\frac{${sizeTarget}}{${n}}`,
    `\\text{Se sabe que ocurrió } ${givenName}: \\text{ quedan } |${givenName}| = ${sizeGiven} \\text{ resultados posibles}`,
    `|${targetName} \\cap ${givenName}| = ${both} \\text{ de esos } ${sizeGiven} \\text{ resultados están en } ${targetName}`,
    `${pAB} = \\frac{|${targetName} \\cap ${givenName}|}{|${givenName}|} = \\frac{${both}}{${sizeGiven}} \\approx ${formatProbability(conditional)} \\quad \\text{frente a } P(${targetName}) = \\frac{${sizeTarget}}{${n}}`,
  ];
  const independent = Math.abs(conditional - unconditional) < 1e-9;
  const description =
    `${space.label}. A: ${eventLabel(experimentId, eventA)}. B: ${eventLabel(experimentId, eventB)}. ` +
    `Sabiendo que ocurrió ${givenName} (${sizeGiven} resultados), ${both} están también en ${targetName}: ` +
    `P(${targetName} dado ${givenName}) = ${formatProbability(conditional)}, frente a P(${targetName}) = ${formatProbability(unconditional)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        {
          label: `P(${targetName})`,
          value: formatProbability(unconditional),
          color: DATA_COLORS.primary,
        },
        { label: `P(${givenName})`, value: formatProbability(sizeGiven / n) },
        { label: `P(A ∩ B)`, value: formatProbability(both / n), color: DATA_COLORS.highlight },
        {
          label: `P(${targetName} | ${givenName})`,
          value: sizeGiven > 0 ? formatProbability(conditional) : 'no definida',
          color: DATA_COLORS.highlight,
        },
        {
          label: 'Relación',
          value: independent ? 'no cambia' : conditional > unconditional ? 'aumenta' : 'disminuye',
        },
      ]}
      legend={[
        { label: targetName, color: DATA_COLORS.primary },
        { label: `${givenName} (rayado)`, color: DATA_COLORS.secondary },
        { label: `${targetName} y ${givenName}`, color: DATA_COLORS.highlight },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={headers[stage] ?? ''} />
      </p>
      <p className={styles.caption}>
        A: {eventLabel(experimentId, eventA)}. B: {eventLabel(experimentId, eventB)}.
      </p>
      <SpaceGrid
        experiment={space}
        label={description}
        fill={(outcome) => {
          const inTarget = target(outcome);
          const inGiven = given(outcome);
          if (stage >= 1 && !inGiven) return { color: DATA_COLORS.neutral, opacity: 0.12 };
          if (stage >= 2 && inTarget && inGiven)
            return { color: DATA_COLORS.highlight, opacity: 0.85 };
          if (inTarget) return { color: DATA_COLORS.primary, opacity: 0.4 };
          return null;
        }}
        stripe={(outcome) => (given(outcome) ? 'b' : null)}
        text={(outcome) => (stage >= 1 && !given(outcome) ? '' : space.format(outcome))}
      />
      <p className={styles.caption}>
        Al condicionar, los resultados fuera de {givenName} se descartan y {givenName} pasa a ser el
        nuevo espacio muestral. {gridCaption(experimentId)}
      </p>
    </VizFrame>
  );
}
