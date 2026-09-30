import { beta as betaDistribution } from '../../../lib/distributions/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import styles from './DistributionGenesis.module.css';
import { texNumber } from './headers.ts';
import { experimentNumber, fitRadius, isDone, revealed, type StageProps } from './stage.ts';

/** Coins kept on screen for waiting-time processes; older trials are summarized in the caption. */
const MAX_VISIBLE = 60;
const PER_ROW = 20;
const GAUGE_HEIGHT = 34;
const GAUGE_POINTS = 80;

function initial(label: string): string {
  return label.trim().charAt(0).toUpperCase();
}

/**
 * Bernoulli trials as coins that appear one by one. Processes that first
 * draw the success probability show it on a gauge above the coins.
 */
export function CoinStage({ box, settings, experiment, shown, completed, animate }: StageProps) {
  const popClass = animate ? styles.pop : undefined;
  const events = revealed(experiment, shown);
  const trials = events.flatMap((event) => (event.kind === 'trial' ? [event.success] : []));
  const bias = events.find((event) => event.kind === 'bias');
  const hasGauge = settings.process === 'beta-binomial' || settings.process === 'mezcla-geometrica';
  const fixedCount =
    settings.process === 'ensayos' || settings.process === 'beta-binomial'
      ? Math.round(settings.values.n ?? 10)
      : settings.process === 'moneda'
        ? 1
        : null;
  const successes = trials.filter(Boolean).length;
  const number = experimentNumber(experiment, shown, completed);

  const top = box.y + 18;
  const gaugeTop = top + 12;
  const coinsTop = hasGauge ? gaugeTop + GAUGE_HEIGHT + 22 : top + 14;
  const coinsHeight = box.y + box.height - coinsTop - 6;

  const visible = trials.slice(Math.max(0, trials.length - MAX_VISIBLE));
  const hidden = trials.length - visible.length;
  const slots = fixedCount ?? Math.max(visible.length, 1);
  const perRow = Math.min(PER_ROW, slots);
  const rows = Math.ceil(Math.max(slots, 1) / perRow);
  const radius = fitRadius(
    box.width - 24,
    coinsHeight,
    perRow,
    Math.max(rows, fixedCount ? rows : 3),
    fixedCount === 1 ? 34 : fixedCount !== null && fixedCount <= 12 ? 22 : 16,
  );
  const spacing = radius * 2.5;
  const left = box.x + (box.width - (perRow - 1) * spacing) / 2;

  let status = '';
  if (settings.process === 'r-exitos') {
    status = `éxitos: ${successes} de ${Math.round(settings.values.r ?? 3)}, ensayos: ${trials.length}`;
  } else if (fixedCount && fixedCount > 1) {
    status = `${settings.success}: ${successes} de ${trials.length} ensayos`;
  } else if (fixedCount === null) {
    status = `ensayos: ${trials.length}${hidden > 0 ? ` (se muestran los últimos ${visible.length})` : ''}`;
  }

  const gaugeLeft = box.x + 40;
  const gaugeWidth = Math.max(40, box.width - 80);
  const gx = (value: number) => gaugeLeft + value * gaugeWidth;
  let gaugeCurve = '';
  let gaugeRange: [number, number] | null = null;
  if (settings.process === 'beta-binomial') {
    const density = betaDistribution(settings.values.alpha ?? 1.5, settings.values.beta ?? 1.5);
    const samples = Array.from({ length: GAUGE_POINTS + 1 }, (_, i) => {
      const x = (i + 0.5) / (GAUGE_POINTS + 1);
      return { x, y: density.pdf(x) };
    });
    const peak = Math.max(
      ...samples.map((point) => (Number.isFinite(point.y) ? point.y : 0)),
      1e-9,
    );
    gaugeCurve = samples
      .map((point, i) => {
        const y = gaugeTop + GAUGE_HEIGHT - (Math.min(point.y, peak) / peak) * (GAUGE_HEIGHT - 4);
        return `${i === 0 ? 'M' : 'L'}${gx(point.x).toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  } else if (settings.process === 'mezcla-geometrica') {
    gaugeRange = [1 - (settings.values.p ?? 0.8), 1];
  }

  return (
    <g aria-hidden="true">
      <text x={box.x + 8} y={top} className={styles.strong}>
        {number > 0 ? `Experimento ${number}` : 'Listo para el primer experimento'}
      </text>
      {status && (
        <text x={box.x + box.width - 8} y={top} textAnchor="end" className={styles.caption}>
          {status}
        </text>
      )}

      {hasGauge && (
        <g>
          {gaugeRange && (
            <rect
              x={gx(gaugeRange[0])}
              y={gaugeTop}
              width={gx(gaugeRange[1]) - gx(gaugeRange[0])}
              height={GAUGE_HEIGHT}
              fill={DATA_COLORS.light}
              fillOpacity={0.35}
            />
          )}
          {gaugeCurve && (
            <path d={gaugeCurve} fill="none" stroke={DATA_COLORS.tertiary} strokeWidth={1.5} />
          )}
          <line
            x1={gaugeLeft}
            x2={gaugeLeft + gaugeWidth}
            y1={gaugeTop + GAUGE_HEIGHT}
            y2={gaugeTop + GAUGE_HEIGHT}
            stroke="var(--data-axis)"
          />
          {[0, 0.5, 1].map((tick) => (
            <text
              key={tick}
              x={gx(tick)}
              y={gaugeTop + GAUGE_HEIGHT + 13}
              textAnchor="middle"
              className={styles.caption}
            >
              {tick}
            </text>
          ))}
          <text
            x={gaugeLeft - 8}
            y={gaugeTop + GAUGE_HEIGHT - 2}
            textAnchor="end"
            className={styles.caption}
          >
            {settings.process === 'beta-binomial' ? 'p' : 's'}
          </text>
          {bias && bias.kind === 'bias' && (
            <g key={`${number}-bias`} className={popClass}>
              <path
                d={`M${gx(bias.p)},${gaugeTop + GAUGE_HEIGHT} l-6,-11 h12 z`}
                fill={DATA_COLORS.secondary}
              />
              <text
                x={gx(bias.p)}
                y={gaugeTop + 2}
                textAnchor={bias.p > 0.85 ? 'end' : bias.p < 0.15 ? 'start' : 'middle'}
                className={styles.strong}
              >
                {`${settings.process === 'beta-binomial' ? 'p' : 's'} = ${texNumber(bias.p, 3)}`}
              </text>
            </g>
          )}
        </g>
      )}

      {visible.map((success, index) => {
        const row = Math.floor(index / perRow);
        const column = index % perRow;
        const cx = left + column * spacing;
        const cy = coinsTop + radius + row * spacing;
        const fresh = index === visible.length - 1 && !isDone(experiment, shown);
        return (
          <g key={`${number}-${index + hidden}`} className={fresh ? popClass : undefined}>
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill={success ? DATA_COLORS.primary : 'var(--color-surface)'}
              stroke={success ? DATA_COLORS.primary : DATA_COLORS.muted}
              strokeWidth={1.5}
            />
            {radius >= 8 && (
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                className={styles.coinText}
                fill={success ? 'var(--color-surface)' : DATA_COLORS.muted}
                style={fixedCount === 1 ? { fontSize: 22 } : undefined}
              >
                {initial(success ? settings.success : settings.failure)}
              </text>
            )}
          </g>
        );
      })}

      {fixedCount !== null &&
        fixedCount > 1 &&
        Array.from({ length: Math.max(0, fixedCount - visible.length) }, (_, i) => {
          const index = visible.length + i;
          const cx = left + (index % perRow) * spacing;
          const cy = coinsTop + radius + Math.floor(index / perRow) * spacing;
          return (
            <circle
              key={`empty-${index}`}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="var(--data-grid)"
              strokeDasharray="3 3"
            />
          );
        })}
    </g>
  );
}
