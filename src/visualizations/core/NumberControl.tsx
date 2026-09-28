import { useId } from 'react';
import type { NumberParameter } from './parameters.ts';
import styles from './VizFrame.module.css';

/** Slider paired with a numeric field for precise entry. */
export function NumberControl({
  definition,
  value,
  onChange,
  disabled,
}: {
  definition: NumberParameter;
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}) {
  const id = useId();
  const digits = definition.digits ?? Math.max(0, -Math.floor(Math.log10(definition.step)));
  const label = definition.symbol ? `${definition.label} (${definition.symbol})` : definition.label;
  return (
    <div className={styles.control}>
      <div className={styles.controlHeader}>
        <label htmlFor={id}>{label}</label>
        <input
          type="number"
          className={styles.numberInput}
          min={definition.min}
          max={definition.max}
          step={definition.step}
          value={Number(value.toFixed(digits))}
          disabled={disabled}
          aria-label={label}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (event.target.value !== '' && Number.isFinite(next)) onChange(next);
          }}
        />
      </div>
      <input
        id={id}
        type="range"
        className={styles.slider}
        min={definition.min}
        max={definition.max}
        step={definition.step}
        value={value}
        disabled={disabled}
        aria-valuetext={`${value.toFixed(digits)}${definition.unit ? ` ${definition.unit}` : ''}`}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
