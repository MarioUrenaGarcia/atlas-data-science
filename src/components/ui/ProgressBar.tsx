import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  color?: string;
}

export function ProgressBar({ value, max, label, color }: ProgressBarProps) {
  const percent = max === 0 ? 0 : Math.round((100 * value) / max);
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${percent} %`}
    >
      <div className={styles.fill} style={{ width: `${percent}%`, background: color }} />
    </div>
  );
}
