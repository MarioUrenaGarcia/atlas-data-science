import styles from './FeatureEngineeringViz.module.css';

/** Above this many categories the bar labels no longer fit side by side and are drawn at an angle. */
export const TILT_ABOVE = 8;
const TILT_DEGREES = -40;
const LINE_HEIGHT = 14;

/**
 * Category name under a bar. Upright and centered when there is room; tilted
 * and anchored at its end when many bars share the width, so neighboring
 * names do not overlap. The optional detail goes on a second line, or after
 * the name when tilted.
 */
export function CategoryLabel({
  x,
  y,
  tilt,
  text,
  detail,
}: {
  x: number;
  y: number;
  tilt: boolean;
  text: string;
  detail?: string;
}) {
  if (tilt) {
    return (
      <text
        x={x}
        y={y}
        textAnchor="end"
        transform={`rotate(${TILT_DEGREES} ${x} ${y})`}
        className={styles.chartLabel}
      >
        {detail ? `${text} (${detail})` : text}
      </text>
    );
  }
  return (
    <>
      <text x={x} y={y} textAnchor="middle" className={styles.chartLabel}>
        {text}
      </text>
      {detail && (
        <text x={x} y={y + LINE_HEIGHT} textAnchor="middle" className={styles.chartLabel}>
          {detail}
        </text>
      )}
    </>
  );
}
