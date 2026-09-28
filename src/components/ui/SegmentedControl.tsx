import type { ReactNode } from 'react';
import styles from './SegmentedControl.module.css';

interface Option<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  hideLabels?: boolean;
}

/** Radio group styled as adjacent buttons; arrow keys move between options. */
export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  hideLabels,
}: SegmentedControlProps<T>) {
  const move = (delta: number) => {
    const index = options.findIndex((option) => option.value === value);
    const next = options[(index + delta + options.length) % options.length];
    if (next) onChange(next.value);
  };
  return (
    <div
      className={styles.group}
      role="radiogroup"
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          move(1);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          move(-1);
        }
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={hideLabels ? option.label : undefined}
            title={hideLabels ? option.label : undefined}
            tabIndex={selected ? 0 : -1}
            className={selected ? `${styles.option} ${styles.selected}` : styles.option}
            onClick={() => onChange(option.value)}
          >
            {option.icon}
            {!hideLabels && <span>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
