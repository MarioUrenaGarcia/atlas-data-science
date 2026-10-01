import { useMemo, useState } from 'react';
import {
  SEQUENCES,
  type ConvergenceFlags,
  type SequenceId,
} from '../../../lib/limits/sequences.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { TrajectoryCanvas, type Envelope } from '../../shared/TrajectoryCanvas.tsx';
import styles from './ConvergenceViz.module.css';
import { ImplicationDiagram } from './ImplicationDiagram.tsx';
import { SEQUENCE_DISPLAY } from './display.ts';
import { simulateSequencePaths } from './pathStats.ts';

const PATHS = 40;
/** Fewer paths for 0/1 sequences, whose spikes would otherwise cover the whole row. */
const SPIKE_PATHS = 8;
const HORIZON = 300;
const BAND = 0.5;
const SWEEP_SECONDS = 8;

const MODE_NAMES: Record<keyof ConvergenceFlags, string> = {
  casiSegura: 'casi seguramente',
  mediaCuadratica: 'en media cuadrática',
  probabilidad: 'en probabilidad',
  distribucion: 'en distribución',
};

interface RelationsViewProps {
  title: string;
  sequence: SequenceId;
  sequences: readonly SequenceId[];
  seed: number;
}

/** Implication diagram driven by a selected sequence, with its paths below. */
export function RelationsView({
  title,
  sequence,
  sequences,
  seed: initialSeed,
}: RelationsViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () =>
      sequences.length > 1
        ? [
            {
              type: 'select',
              key: 'sucesion',
              label: 'Sucesión',
              options: sequences.map((id) => ({ value: id, label: SEQUENCES[id].label })),
              default: sequence,
            },
          ]
        : [],
    [sequences, sequence],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const selected = (sequences.length > 1 ? String(values.sucesion) : sequence) as SequenceId;
  const definition = SEQUENCES[selected];
  const seed = useSeed(initialSeed);
  const paths = useMemo(
    () =>
      simulateSequencePaths(
        definition,
        SEQUENCE_DISPLAY[selected].spikes ? SPIKE_PATHS : PATHS,
        HORIZON,
        seed.seed,
      ),
    [definition, selected, seed.seed],
  );
  const [run, setRun] = useState(0);
  const [revealed, update] = useResettableState<number>(`${selected}|${seed.seed}|${run}`, () => 1);
  const playback = usePlayback({
    step: () => update((value) => Math.min(HORIZON, value + 1)),
    stepMany: (steps) => update((value) => Math.min(HORIZON, value + steps)),
    reset: () => setRun((value) => value + 1),
    rate: HORIZON / SWEEP_SECONDS,
    done: revealed >= HORIZON,
  });
  const band = useMemo<Envelope[]>(
    () => [{ lower: () => -BAND, upper: () => BAND, color: DATA_COLORS.secondary, fill: true }],
    [],
  );

  const flags = definition.converges;
  const modes = Object.keys(MODE_NAMES) as (keyof ConvergenceFlags)[];
  const holds = modes.filter((mode) => flags[mode]).map((mode) => MODE_NAMES[mode]);
  const fails = modes.filter((mode) => !flags[mode]).map((mode) => MODE_NAMES[mode]);
  const description =
    `${definition.label}. Converge ${holds.join(', ')}` +
    (fails.length > 0 ? `; no converge ${fails.join(', ')}.` : '.') +
    ` Se muestran ${paths.length} trayectorias hasta n = ${revealed}.`;
  const stageTex =
    fails.length === 0
      ? 'X_n \\to X\\ \\text{en los cuatro sentidos}'
      : `X_n \\to X\\ \\text{${holds.join(', ')}}`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={modes.map((mode) => ({
        label: `Converge ${MODE_NAMES[mode]}`,
        value: flags[mode] ? 'sí' : 'no',
        color: flags[mode] ? DATA_COLORS.positive : DATA_COLORS.negative,
      }))}
      legend={[
        { label: 'Implicación que siempre se cumple', color: DATA_COLORS.text, shape: 'line' },
        {
          label: 'Implicación que esta sucesión refuta',
          color: DATA_COLORS.negative,
          shape: 'dashed',
        },
        { label: 'Banda ± 0.5 alrededor del límite', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`${definition.latex},\\qquad ${definition.limitLatex}`} />
      </p>
      <p className={styles.stage}>
        <Latex tex={stageTex} />
      </p>
      <ImplicationDiagram flags={flags} label={description} />
      <p className={styles.panelTitle}>Trayectorias de Xₙ - X</p>
      <TrajectoryCanvas
        paths={paths}
        revealed={revealed}
        yDomain={SEQUENCE_DISPLAY[selected].y}
        label={`Trayectorias. ${description}`}
        envelopes={band}
        points={SEQUENCE_DISPLAY[selected].spikes}
        aspect={0.4}
      />
    </VizFrame>
  );
}
