import { useMemo, useState } from 'react';
import { initialValues } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import { ALGORITHMS } from './algorithms/index.ts';
import { PseudocodePanel } from './PseudocodePanel.tsx';
import type { AlgorithmStepperConfig } from './schema.ts';

const DEFAULT_RATE = 1.5;

/** Generic stepper: pseudocode with the current line, variables and a drawing of the state. */
export default function AlgorithmStepper({ params, title }: VisualizationProps) {
  const config = params as unknown as AlgorithmStepperConfig;
  const algorithm = ALGORITHMS[config.algoritmo];
  const definitions = useMemo(() => {
    const overrides = initialValues(algorithm.parameters, config.valores ?? {});
    return algorithm.parameters.map((definition) => ({
      ...definition,
      default: overrides[definition.key as keyof typeof overrides],
    })) as typeof algorithm.parameters;
  }, [algorithm, config.valores]);
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, unknown>;
  const [run, setRun] = useState(0);
  const [state, update] = useResettableState<never>(`${JSON.stringify(values)}|${run}`, () =>
    algorithm.init(values),
  );

  const done = algorithm.done(state);
  const playback = usePlayback({
    step: () => update((previous) => algorithm.step(previous)),
    reset: () => setRun((value) => value + 1),
    rate: config.ritmo ?? DEFAULT_RATE,
    done,
    autoplay: true,
  });

  const description = algorithm.describe(state);
  const variables = algorithm.variables(state);
  const Scene = algorithm.Scene;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={variables.map((variable) => ({ label: variable.name, value: variable.value }))}
      description={description}
    >
      <Scene state={state} values={values} label={description} />
      <PseudocodePanel lines={algorithm.pseudocode} active={algorithm.line(state)} />
      <p
        aria-hidden="true"
        style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}
      >
        {description}
      </p>
    </VizFrame>
  );
}
