import { arc } from 'd3-shape';
import { seriesColor } from '../../core/colors.ts';
import styles from './DistributionGenesis.module.css';
import { categoryProbabilities } from './processes.ts';
import { experimentNumber, revealed, stageTitle, type StageProps } from './stage.ts';

const LABEL_OFFSET = 16;
/** Fraction of a sector where the needle can stop, keeping it away from the borders. */
const SECTOR_MARGIN = 0.15;
const FULL_TURNS = 2;

/** Golden-ratio sequence in [0, 1): spreads the needle inside the sector from spin to spin. */
function spread(index: number): number {
  return (index * 0.618033988749895) % 1;
}

/** A spinner whose sectors are proportional to the category probabilities. */
export function SpinnerStage({ box, settings, experiment, shown, completed, animate }: StageProps) {
  const probabilities = categoryProbabilities(settings);
  const spin = revealed(experiment, shown).find((event) => event.kind === 'spin');
  const number = experimentNumber(experiment, shown, completed);
  const radius = Math.max(30, Math.min(box.height / 2 - 26, box.width / 2 - 90));
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2 + 8;
  const starts: number[] = [];
  probabilities.reduce((sum, p, index) => {
    starts[index] = sum;
    return sum + p;
  }, 0);
  const sector = arc<{ start: number; end: number }>()
    .innerRadius(0)
    .outerRadius(radius)
    .startAngle((d) => d.start * 2 * Math.PI)
    .endAngle((d) => d.end * 2 * Math.PI);

  let angle = 0;
  if (spin?.kind === 'spin') {
    const start = starts[spin.category] ?? 0;
    const width = probabilities[spin.category] ?? 0;
    const position = start + width * (SECTOR_MARGIN + (1 - 2 * SECTOR_MARGIN) * spread(number));
    angle = 360 * (FULL_TURNS * number + position);
  }

  return (
    <g aria-hidden="true">
      <text x={box.x + 8} y={box.y + 18} className={styles.strong}>
        {stageTitle('Giro', 'Listo para el primer giro', experiment, shown, completed)}
      </text>
      <g transform={`translate(${cx},${cy})`}>
        {probabilities.map((p, index) => {
          const start = starts[index] ?? 0;
          const middle = (start + p / 2) * 2 * Math.PI;
          const active = spin?.kind === 'spin' && spin.category === index;
          const lx = Math.sin(middle) * (radius + LABEL_OFFSET);
          const ly = -Math.cos(middle) * (radius + LABEL_OFFSET);
          return (
            <g key={index}>
              <path
                d={sector({ start, end: start + p }) ?? ''}
                fill={seriesColor(index)}
                fillOpacity={active ? 0.95 : 0.55}
                stroke="var(--color-surface)"
                strokeWidth={active ? 3 : 1.5}
              />
              {p > 0 && (
                <text
                  x={lx}
                  y={ly + 4}
                  textAnchor={lx > 4 ? 'start' : lx < -4 ? 'end' : 'middle'}
                  className={active ? styles.strong : styles.caption}
                >
                  {`${settings.categories[index]?.label ?? index + 1} (${p.toFixed(2)})`}
                </text>
              )}
            </g>
          );
        })}
        <g
          className={animate ? styles.needle : undefined}
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={-radius * 0.9}
            stroke="var(--color-text)"
            strokeWidth={3}
          />
          <path d={`M0,${-radius * 0.95} l-6,12 h12 z`} fill="var(--color-text)" />
        </g>
        <circle r={6} fill="var(--color-text)" />
      </g>
    </g>
  );
}
