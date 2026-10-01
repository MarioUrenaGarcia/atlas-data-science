import { Switch } from '../../components/ui/Switch.tsx';
import { NumberControl } from './NumberControl.tsx';
import type { ParameterDefinition } from './parameters.ts';
import styles from './VizFrame.module.css';

interface ParameterControlsProps {
  definitions: readonly ParameterDefinition[];
  values: Record<string, unknown>;
  onChange: (key: string, value: number | string | boolean) => void;
  /** Keys whose controls are temporarily unavailable. */
  disabled?: readonly string[];
}

/** Controls generated from the declarative parameter definitions. */
export function ParameterControls({
  definitions,
  values,
  onChange,
  disabled = [],
}: ParameterControlsProps) {
  return (
    <div className={styles.parameters}>
      {definitions.map((definition) => {
        const condition = definition.shownWhen;
        if (condition && !condition.values.includes(String(values[condition.key]))) return null;
        const isDisabled = disabled.includes(definition.key);
        if (definition.type === 'number') {
          return (
            <NumberControl
              key={definition.key}
              definition={definition}
              value={Number(values[definition.key])}
              disabled={isDisabled}
              onChange={(value) => onChange(definition.key, value)}
            />
          );
        }
        if (definition.type === 'select') {
          return (
            <label key={definition.key} className={styles.control}>
              <span className={styles.controlLabel}>{definition.label}</span>
              <select
                className={styles.select}
                value={String(values[definition.key])}
                disabled={isDisabled}
                onChange={(event) => onChange(definition.key, event.target.value)}
              >
                {definition.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          );
        }
        return (
          <div key={definition.key} className={styles.control}>
            <Switch
              checked={Boolean(values[definition.key])}
              disabled={isDisabled}
              label={definition.label}
              onChange={(checked) => onChange(definition.key, checked)}
            />
          </div>
        );
      })}
    </div>
  );
}
