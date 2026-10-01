import { useMemo, useState } from 'react';
import {
  combineEvents,
  experiment,
  findEvent,
  OPERATION_LATEX,
  type EventOperation,
  type ExperimentId,
} from '../../../lib/probability/sampleSpace.ts';
import { formatProbability } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { eventLabel, eventOptions, gridCaption, operationOptions } from './labels.ts';
import styles from './SampleSpaceLab.module.css';
import type { SampleSpaceLabConfig } from './schema.ts';
import { SpaceGrid } from './SpaceGrid.tsx';

/** Seconds the sweep takes to inspect the whole sample space. */
const SWEEP_SECONDS = 5;

interface EventsViewProps {
  title: string;
  config: SampleSpaceLabConfig;
}

/**
 * Events as subsets of the sample space. The sweep inspects the outcomes one
 * by one and counts those in the chosen event, so the classical probability
 * appears as favorable cases over possible cases.
 */
export function EventsView({ title, config }: EventsViewProps) {
  const experimentId: ExperimentId = config.experimento ?? 'dos-dados';
  const space = experiment(experimentId);
  const allowed = config.operaciones ?? ['A', 'B'];
  // Without operations that involve B there is no second event to choose or draw.
  const singleEvent = allowed.every(
    (operation) => operation === 'A' || operation === 'complemento',
  );
  const singleOperation = allowed.length === 1;
  const definitions = useMemo(() => {
    const options = eventOptions(experimentId, config.eventos);
    const operations = operationOptions(config.operaciones);
    return [
      {
        type: 'select' as const,
        key: 'eventoA',
        label: 'Evento A',
        options,
        default: config.eventoA ?? options[0]?.value ?? '',
      },
      ...(singleEvent
        ? []
        : [
            {
              type: 'select' as const,
              key: 'eventoB',
              label: 'Evento B',
              options,
              default: config.eventoB ?? options[1]?.value ?? options[0]?.value ?? '',
            },
          ]),
      ...(singleOperation
        ? []
        : [
            {
              type: 'select' as const,
              key: 'operacion',
              label: 'Evento que se cuenta',
              options: operations,
              default: config.operacion ?? operations[0]?.value ?? 'A',
            },
          ]),
    ];
  }, [config, experimentId, singleEvent, singleOperation]);
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const eventA = values.eventoA ?? '';
  const eventB = values.eventoB ?? eventA;
  const operation = (singleOperation ? allowed[0] : values.operacion) as EventOperation;
  const testA = findEvent(experimentId, eventA)?.test ?? (() => false);
  const testB = findEvent(experimentId, eventB)?.test ?? (() => false);
  const test = combineEvents(operation, testA, testB);
  const total = space.outcomes.length;
  const membership = space.outcomes.map((outcome) => test(outcome));

  const [run, setRun] = useState(0);
  const [scanned, updateScanned] = useResettableState(
    `${experimentId}|${eventA}|${eventB}|${operation}|${run}`,
    () => 0,
  );
  const playback = usePlayback({
    step: () => updateScanned((value) => Math.min(total, value + 1)),
    stepMany: (count) => updateScanned((value) => Math.min(total, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: total / SWEEP_SECONDS,
    done: scanned >= total,
  });
  const counted = membership.slice(0, scanned).filter(Boolean).length;
  const favorable = membership.filter(Boolean).length;
  const sizeA = space.outcomes.filter(testA).length;
  const sizeB = space.outcomes.filter(testB).length;
  const finished = scanned >= total;
  const eventTex = OPERATION_LATEX[operation];
  const header = finished
    ? `P(${eventTex}) = \\frac{|${eventTex}|}{|\\Omega|} = \\frac{${favorable}}{${total}} \\approx ${formatProbability(favorable / total)}`
    : `|${eventTex}| \\text{ hasta ahora} = ${counted} \\quad (\\text{revisados } ${scanned} \\text{ de } ${total})`;
  const operationText =
    singleEvent || operation === 'A'
      ? `A: ${eventLabel(experimentId, eventA)}`
      : `A: ${eventLabel(experimentId, eventA)}; B: ${eventLabel(experimentId, eventB)}`;
  const description =
    `${space.label}. ${operationText}. Se han revisado ${scanned} de ${total} resultados y ${counted} pertenecen al evento contado. ` +
    `En total el evento tiene ${favorable} resultados, con probabilidad ${formatProbability(favorable / total)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: '|Ω|', value: String(total) },
        { label: '|A|', value: String(sizeA), color: DATA_COLORS.primary },
        ...(singleEvent
          ? []
          : [{ label: '|B|', value: String(sizeB), color: DATA_COLORS.secondary }]),
        { label: 'Contados', value: String(counted), color: DATA_COLORS.highlight },
        {
          label: 'Probabilidad',
          value: finished ? formatProbability(favorable / total) : 'contando',
        },
      ]}
      legend={[
        { label: 'A', color: DATA_COLORS.primary },
        ...(singleEvent ? [] : [{ label: 'B (rayado)', color: DATA_COLORS.secondary }]),
        { label: 'Contado en el evento', color: DATA_COLORS.highlight },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <p className={styles.caption}>{operationText}</p>
      <SpaceGrid
        experiment={space}
        label={description}
        fill={(outcome, index) => {
          if (index < scanned && membership[index])
            return { color: DATA_COLORS.highlight, opacity: 0.85 };
          if (testA(outcome)) return { color: DATA_COLORS.primary, opacity: 0.3 };
          return null;
        }}
        stripe={singleEvent ? undefined : (outcome) => (testB(outcome) ? 'b' : null)}
        outlined={new Set(scanned > 0 && !finished ? [scanned - 1] : [])}
      />
      <p className={styles.caption}>{gridCaption(experimentId)}</p>
    </VizFrame>
  );
}
