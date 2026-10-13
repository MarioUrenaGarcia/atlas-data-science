import { DATA_COLORS } from '../../core/colors.ts';
import styles from './ContinuousGenesis.module.css';
import { tex } from './headers.ts';
import { processSpec, type Tone } from './processes.ts';
import {
  continuousTitle,
  experimentDone,
  revealedEvents,
  type ContinuousStageProps,
} from './stage.ts';

const LABEL_WIDTH = 64;
const MAX_ROW_GAP = 64;
const TONE_COLORS: Record<Tone, string> = {
  normal: DATA_COLORS.primary,
  chosen: DATA_COLORS.secondary,
  rejected: DATA_COLORS.muted,
  result: DATA_COLORS.highlight,
};

/**
 * Each ingredient of the construction gets its own number line: the draws
 * appear as dots, the running value leaves a trail and the final value is
 * marked on the last line.
 */
export function RowsStage({
  box,
  settings,
  experiment,
  shown,
  completed,
  animate,
}: ContinuousStageProps) {
  const rows = processSpec(settings.process).rows?.(settings) ?? [];
  const events = revealedEvents(experiment, shown);
  const done = experimentDone(experiment, shown);
  const room = box.height - 60;
  const gap = rows.length > 1 ? Math.min(MAX_ROW_GAP, room / (rows.length - 1)) : 0;
  const top = box.y + 40 + (room - gap * (rows.length - 1)) / 2;
  const left = box.x + LABEL_WIDTH;
  const right = box.x + box.width - 24;
  const lastIndex = events.length - 1;

  return (
    <g aria-hidden="true">
      <text x={box.x + 8} y={box.y + 18} className={styles.strong}>
        {continuousTitle(
          'Experimento',
          'Listo para el primer experimento',
          experiment,
          shown,
          completed,
        )}
      </text>
      {rows.map((row, r) => {
        const y = top + r * gap;
        const [lo, hi] = row.domain;
        const px = (value: number) =>
          left + ((Math.min(hi, Math.max(lo, value)) - lo) / (hi - lo || 1)) * (right - left);
        const rowEvents = events.flatMap((event, index) =>
          event.kind === 'draw' && event.row === r ? [{ ...event, index }] : [],
        );
        const trail = rowEvents.filter(
          (event) => event.tone === 'chosen' || event.tone === 'result',
        );
        const lastTrail = trail.at(-1)?.index;
        return (
          <g key={r}>
            <text x={box.x + 8} y={y + 4} className={styles.strong}>
              {row.label}
            </text>
            <line x1={left} x2={right} y1={y} y2={y} stroke="var(--data-axis)" />
            {[lo, (lo + hi) / 2, hi].map((tick) => (
              <text
                key={tick}
                x={px(tick)}
                y={y + 16}
                textAnchor="middle"
                className={styles.caption}
              >
                {tex(tick, 2)}
              </text>
            ))}
            {rowEvents.map((event) => {
              const outside = event.value < lo || event.value > hi;
              const isTrail = event.tone === 'chosen' || event.tone === 'result';
              const faded =
                isTrail &&
                event.index !== lastTrail &&
                event.tone !== 'result' &&
                rowEvents.length > 1 &&
                trail.length > 1;
              const fresh = event.index === lastIndex && !done;
              const color = TONE_COLORS[event.tone];
              const radius = event.tone === 'result' ? 7 : 5;
              return (
                <g
                  key={`${completed}-${event.index}`}
                  className={fresh && animate ? styles.pop : undefined}
                  opacity={faded ? 0.3 : event.tone === 'normal' ? 0.7 : 1}
                >
                  {event.tone === 'rejected' ? (
                    <path
                      d={`M${px(event.value) - 4},${y - 4} l8,8 m0,-8 l-8,8`}
                      stroke={color}
                      strokeWidth={2}
                    />
                  ) : (
                    <circle cx={px(event.value)} cy={y} r={radius} fill={color} />
                  )}
                  {outside && event.index === lastIndex && (
                    <text
                      x={px(event.value)}
                      y={y - 10}
                      textAnchor={event.value > hi ? 'end' : 'start'}
                      className={styles.caption}
                    >
                      {`fuera de la vista: ${tex(event.value, 2)}`}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}
