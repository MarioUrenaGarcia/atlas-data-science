import { DATA_COLORS } from '../../core/colors.ts';
import styles from './DistributionGenesis.module.css';
import { slotCount } from './processes.ts';
import { experimentNumber, isDone, revealed, stageTitle, type StageProps } from './stage.ts';

const LANE_HEIGHT = 34;
const GATE_WIDTH = 120;
const STREAM_COLORS = [DATA_COLORS.primary, DATA_COLORS.secondary] as const;

/**
 * Arrivals on the unit time window. The window can be split into slots
 * (binomial approximation), preceded by a structural-zero gate, or carry
 * two independent streams whose counts are subtracted.
 */
export function TimelineStage({
  box,
  settings,
  experiment,
  shown,
  completed,
  animate,
}: StageProps) {
  const popClass = animate ? styles.pop : undefined;
  const events = revealed(experiment, shown);
  const done = isDone(experiment, shown);
  const number = experimentNumber(experiment, shown, completed);
  const slots = settings.process === 'llegadas' ? slotCount(settings) : null;
  const twoStreams = settings.process === 'diferencia-de-llegadas';
  const gate =
    settings.process === 'ceros-inflados'
      ? events.find((event) => event.kind === 'gate')
      : undefined;
  const structural = gate?.kind === 'gate' && gate.structural;

  const left = box.x + (settings.process === 'ceros-inflados' ? GATE_WIDTH + 24 : 70);
  const width = box.x + box.width - 24 - left;
  const lanes = twoStreams ? 2 : 1;
  const laneTop = box.y + Math.max(40, (box.height - lanes * LANE_HEIGHT * 1.6) / 2);
  const tx = (time: number) => left + time * width;
  const laneY = (lane: number) => laneTop + lane * LANE_HEIGHT * 1.6 + LANE_HEIGHT / 2;

  const last = events.filter((event) => event.kind === 'arrival' || event.kind === 'slot').at(-1);
  const cursor = done
    ? 1
    : last?.kind === 'arrival'
      ? last.time
      : last?.kind === 'slot' && slots
        ? (last.index + 1) / slots
        : 0;
  const countIn = (lane: number) =>
    events.filter(
      (event) =>
        (event.kind === 'arrival' && event.stream === lane) ||
        (lane === 0 && event.kind === 'slot'),
    ).length;

  return (
    <g aria-hidden="true">
      <text x={box.x + 8} y={box.y + 18} className={styles.strong}>
        {stageTitle('Intervalo', 'Listo para el primer intervalo', experiment, shown, completed)}
      </text>
      <text x={box.x + box.width - 8} y={box.y + 18} textAnchor="end" className={styles.caption}>
        {settings.unit}
      </text>

      {settings.process === 'ceros-inflados' && (
        <g>
          <rect
            x={box.x + 10}
            y={laneY(0) - 26}
            width={GATE_WIDTH}
            height={52}
            rx={8}
            fill={
              gate
                ? structural
                  ? DATA_COLORS.tertiary
                  : 'var(--color-surface)'
                : 'var(--color-surface)'
            }
            fillOpacity={structural ? 0.85 : 1}
            stroke={
              gate ? (structural ? DATA_COLORS.tertiary : DATA_COLORS.primary) : 'var(--data-grid)'
            }
            strokeWidth={1.5}
            key={gate ? `gate-${number}` : 'gate'}
            className={gate ? popClass : undefined}
          />
          <text
            x={box.x + 10 + GATE_WIDTH / 2}
            y={laneY(0) - 4}
            textAnchor="middle"
            className={styles.strong}
            style={structural ? { fill: 'var(--color-surface)' } : undefined}
          >
            {gate ? (structural ? 'Cero estructural' : 'Rama Poisson') : 'Primer sorteo'}
          </text>
          <text
            x={box.x + 10 + GATE_WIDTH / 2}
            y={laneY(0) + 13}
            textAnchor="middle"
            className={styles.caption}
            style={structural ? { fill: 'var(--color-surface)' } : undefined}
          >
            {`π = ${(settings.values.pi ?? 0).toFixed(2)}`}
          </text>
        </g>
      )}

      {Array.from({ length: lanes }, (_, lane) => {
        const y = laneY(lane);
        const color = STREAM_COLORS[lane] ?? DATA_COLORS.primary;
        const dim = structural ? 0.35 : 1;
        return (
          <g key={lane} opacity={dim}>
            {twoStreams && (
              <text x={left - 10} y={y + 4} textAnchor="end" className={styles.strong}>
                {settings.streams[lane]}
              </text>
            )}
            {slots ? (
              Array.from({ length: slots }, (_, index) => {
                const hit = events.some((event) => event.kind === 'slot' && event.index === index);
                return (
                  <rect
                    key={index}
                    x={tx(index / slots) + 0.5}
                    y={y - LANE_HEIGHT / 2}
                    width={Math.max(0.5, width / slots - 1)}
                    height={LANE_HEIGHT}
                    fill={hit ? color : 'var(--color-surface)'}
                    stroke={slots <= 60 ? 'var(--data-grid)' : 'none'}
                  />
                );
              })
            ) : (
              <line
                x1={tx(0)}
                x2={tx(1)}
                y1={y}
                y2={y}
                stroke="var(--data-axis)"
                strokeWidth={1.5}
              />
            )}
            {events.map((event, index) =>
              event.kind === 'arrival' && event.stream === lane ? (
                <g
                  key={`${number}-${index}`}
                  className={index === events.length - 1 && !done ? popClass : undefined}
                >
                  <line
                    x1={tx(event.time)}
                    x2={tx(event.time)}
                    y1={y - LANE_HEIGHT / 2}
                    y2={y + LANE_HEIGHT / 2}
                    stroke={color}
                    strokeWidth={2.5}
                  />
                  <circle cx={tx(event.time)} cy={y - LANE_HEIGHT / 2} r={4} fill={color} />
                </g>
              ) : null,
            )}
            <text x={tx(1) + 8} y={y + 5} className={styles.strong}>
              {countIn(lane)}
            </text>
          </g>
        );
      })}

      <line
        x1={tx(cursor)}
        x2={tx(cursor)}
        y1={laneY(0) - LANE_HEIGHT}
        y2={laneY(lanes - 1) + LANE_HEIGHT}
        stroke="var(--color-text)"
        strokeDasharray="4 3"
        opacity={structural ? 0 : 0.8}
      />
      {[0, 0.5, 1].map((tick) => (
        <text
          key={tick}
          x={tx(tick)}
          y={laneY(lanes - 1) + LANE_HEIGHT + 14}
          textAnchor="middle"
          className={styles.caption}
        >
          {tick}
        </text>
      ))}
      <text
        x={tx(0.5)}
        y={laneY(lanes - 1) + LANE_HEIGHT + 30}
        textAnchor="middle"
        className={styles.caption}
      >
        {slots ? `tiempo dividido en ${slots} rendijas` : 'tiempo dentro del intervalo'}
      </text>
    </g>
  );
}
