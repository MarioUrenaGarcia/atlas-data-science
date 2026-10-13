import { DATA_COLORS } from '../../core/colors.ts';
import styles from './ContinuousGenesis.module.css';
import { tex } from './headers.ts';
import { processSpec, value } from './processes.ts';
import {
  continuousTitle,
  experimentDone,
  revealedEvents,
  type ContinuousStageProps,
} from './stage.ts';

const LANE_HEIGHT = 30;
/** The time axis covers this quantile of the waiting time, so long waits run off the edge only rarely. */
const AXIS_QUANTILE = 0.99;

/** Arrivals on a time axis; the waiting time ends at arrival number k. */
export function ArrivalStage({
  box,
  settings,
  experiment,
  shown,
  completed,
  animate,
}: ContinuousStageProps) {
  const events = revealedEvents(experiment, shown);
  const done = experimentDone(experiment, shown);
  const k = Math.max(1, Math.round(value(settings, 'k', 1)));
  const horizon = processSpec(settings.process).theory(settings).quantile(AXIS_QUANTILE);
  const left = box.x + 30;
  const right = box.x + box.width - 30;
  const y = box.y + box.height / 2;
  const px = (t: number) => left + (Math.min(horizon, t) / horizon) * (right - left);
  const arrivals = events.flatMap((event) => (event.kind === 'arrival' ? [event.time] : []));
  const last = arrivals.at(-1) ?? 0;

  return (
    <g aria-hidden="true">
      <text x={box.x + 8} y={box.y + 18} className={styles.strong}>
        {continuousTitle('Espera', 'Listo para la primera espera', experiment, shown, completed)}
      </text>
      <text x={box.x + box.width - 8} y={box.y + 18} textAnchor="end" className={styles.caption}>
        {settings.unit ||
          `llegadas a tasa ${tex(value(settings, 'lambda', 1), 2)} por unidad de tiempo`}
      </text>
      <line x1={left} x2={right} y1={y} y2={y} stroke="var(--data-axis)" strokeWidth={1.5} />
      <rect
        x={left}
        y={y - LANE_HEIGHT / 2}
        width={Math.max(0, px(last) - left)}
        height={LANE_HEIGHT}
        fill={DATA_COLORS.light}
        fillOpacity={0.35}
      />
      {arrivals.map((time, index) => {
        const final = index === k - 1;
        const fresh = index === arrivals.length - 1 && !done;
        return (
          <g key={`${completed}-${index}`} className={fresh && animate ? styles.pop : undefined}>
            <line
              x1={px(time)}
              x2={px(time)}
              y1={y - LANE_HEIGHT / 2}
              y2={y + LANE_HEIGHT / 2}
              stroke={final ? DATA_COLORS.highlight : DATA_COLORS.primary}
              strokeWidth={final ? 3.5 : 2.5}
            />
            <text
              x={px(time)}
              y={y - LANE_HEIGHT / 2 - 6}
              textAnchor="middle"
              className={styles.caption}
            >
              {index + 1}
            </text>
          </g>
        );
      })}
      {[0, horizon / 2, horizon].map((tick) => (
        <text
          key={tick}
          x={px(tick)}
          y={y + LANE_HEIGHT / 2 + 16}
          textAnchor="middle"
          className={styles.caption}
        >
          {tex(tick, 2)}
        </text>
      ))}
      <text
        x={(left + right) / 2}
        y={y + LANE_HEIGHT / 2 + 32}
        textAnchor="middle"
        className={styles.caption}
      >
        {done ? `la llegada ${k} ocurrió en t = ${tex(last, 3)}` : 'tiempo'}
      </text>
    </g>
  );
}
