import type { ComponentType } from 'react';
import type { ParameterDefinition } from '../../core/parameters.ts';
import type { AlgorithmId } from './algorithmIds.ts';

export interface AlgorithmVariable {
  name: string;
  value: string;
}

export interface SceneProps<S> {
  state: S;
  values: Record<string, unknown>;
  label: string;
}

/**
 * An algorithm described as a pure state machine: `step` returns a new state,
 * `line` points at the pseudocode line that produced it and `Scene` draws it.
 */
export interface AlgorithmDefinition<S> {
  id: AlgorithmId;
  label: string;
  pseudocode: readonly string[];
  parameters: readonly ParameterDefinition[];
  init: (values: Record<string, unknown>) => S;
  step: (state: S) => S;
  done: (state: S) => boolean;
  line: (state: S) => number;
  variables: (state: S) => AlgorithmVariable[];
  describe: (state: S) => string;
  Scene: ComponentType<SceneProps<S>>;
}
