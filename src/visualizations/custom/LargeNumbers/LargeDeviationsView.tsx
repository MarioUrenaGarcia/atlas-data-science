import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  LD_POPULATIONS,
  logCltTail,
  type LdPopulationId,
} from '../../../lib/limits/largeDeviations.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { SeriesChart } from '../../shared/SeriesChart.tsx';
import styles from './LargeNumbers.module.css';

const STEPS_PER_SECOND = 8;
const DOT_RADIUS = 5;
const PANEL_ASPECT = 0.7;

interface LargeDeviationsViewProps {
  title: string;
  population: LdPopulationId;
  populations: readonly LdPopulationId[];
  a: number | undefined;
  nMax: number;
}

/** Scientific notation from a natural logarithm, for probabilities far below 1e-300. */
function fromLog(logValue: number): string {
  if (!Number.isFinite(logValue)) return '0';
  const log10 = logValue / Math.LN10;
  if (log10 > -4) return formatNumber(Math.exp(logValue), 4);
  const exponent = Math.floor(log10);
  return `${formatNumber(10 ** (log10 - exponent), 3)} × 10^${exponent}`;
}

/** The same number as fromLog, written in LaTeX. */
function logToTex(logValue: number): string {
  if (!Number.isFinite(logValue)) return '0';
  const log10 = logValue / Math.LN10;
  if (log10 > -4) return formatNumber(Math.exp(logValue), 4);
  const exponent = Math.floor(log10);
  return `${formatNumber(10 ** (log10 - exponent), 3)} \\times 10^{${exponent}}`;
}

/**
 * Cramér's theorem. The exact probability that the sample mean exceeds a
 * decays exponentially with rate I(a); the normal approximation predicts the
 * quadratic rate (a - mu)^2 / (2 sigma^2), which is wrong far from the mean.
 */
export function LargeDeviationsView({
  title,
  population,
  populations,
  a: initialA,
  nMax,
}: LargeDeviationsViewProps) {
  const initial = LD_POPULATIONS[population];
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(populations.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'poblacion',
              label: 'Población',
              options: populations.map((id) => ({ value: id, label: LD_POPULATIONS[id].label })),
              default: population,
            },
          ]
        : []),
      {
        type: 'number' as const,
        key: 'a',
        label: 'Umbral',
        symbol: 'a',
        min: initial.range[0],
        max: initial.range[1],
        step: 0.01,
        default: initialA ?? (initial.range[0] + initial.range[1]) / 2,
      },
      {
        type: 'number' as const,
        key: 'n',
        label: 'Tamaño de muestra',
        symbol: 'n',
        min: 1,
        max: nMax,
        step: 1,
        default: 20,
        digits: 0,
      },
    ],
    [populations, population, initial, initialA, nMax],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (
    populations.length > 1 ? String(values.poblacion) : population
  ) as LdPopulationId;
  const definition = LD_POPULATIONS[selected];
  const a = Math.min(definition.range[1], Math.max(definition.range[0], Number(values.a)));
  const rate = definition.rate(a);
  const cltRate = (a - definition.mean) ** 2 / (2 * definition.sd ** 2);

  const [sweep, setSweep] = useState<number | null>(null);
  const playback = usePlayback({
    step: () => setSweep((value) => Math.min(nMax, (value ?? 0) + 1)),
    reset: () => setSweep(null),
    rate: STEPS_PER_SECOND,
    done: sweep !== null && sweep >= nMax,
  });
  const n = sweep ?? Number(values.n);

  const table = useMemo(
    () =>
      Array.from({ length: nMax }, (_, i) => {
        const m = i + 1;
        return { n: m, exact: definition.logTail(m, a), clt: logCltTail(definition, m, a) };
      }),
    [definition, a, nMax],
  );
  const row = table[n - 1] ?? { n, exact: Number.NaN, clt: Number.NaN };
  const empiricalRate = -row.exact / n;
  const minLog = Math.min(
    -1,
    ...table.map((r) => (Number.isFinite(r.exact) ? r.exact : 0)),
    -nMax * rate,
  );
  const logFloor = 10 ** Math.floor(minLog / Math.LN10);

  const description =
    `${definition.label}, umbral a = ${formatNumber(a, 2)}. Con n = ${n}, P(media ≥ a) = ${fromLog(row.exact)}; ` +
    `la cota de Chernoff e^(-n I(a)) vale ${fromLog(-n * rate)} y la aproximación normal da ${fromLog(row.clt)}. ` +
    `La tasa observada -(1/n) log P es ${formatNumber(empiricalRate, 4)} y tiende a I(a) = ${formatNumber(rate, 4)}; ` +
    `la aproximación normal sugeriría ${formatNumber(cltRate, 4)}.`;

  const [lo, hi] = definition.range;
  const xDomain: [number, number] = [
    Math.min(definition.mean - (hi - definition.mean) * 0.6, lo),
    hi,
  ];

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'n', value: String(n) },
        { label: 'P(X̄ₙ ≥ a) exacta', value: fromLog(row.exact), color: DATA_COLORS.primary },
        { label: 'Cota e^(-n I(a))', value: fromLog(-n * rate), color: DATA_COLORS.highlight },
        { label: 'Aproximación normal', value: fromLog(row.clt), color: DATA_COLORS.muted },
        {
          label: 'I(a), tasa de Cramér',
          value: formatNumber(rate, 4),
          color: DATA_COLORS.highlight,
        },
        {
          label: '-(1/n) log P',
          value: formatNumber(empiricalRate, 4),
          color: DATA_COLORS.primary,
        },
        { label: 'Tasa cuadrática (a - μ)²/(2σ²)', value: formatNumber(cltRate, 4) },
      ]}
      legend={[
        { label: 'Probabilidad exacta', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Cramér: I(a) y e^(-n I(a))', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Aproximación normal', color: DATA_COLORS.muted, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`P(\\bar{X}_{${n}} \\ge ${formatNumber(a, 2)}) = ${logToTex(row.exact)}\\ \\le\\ e^{-${n}\\cdot ${formatNumber(rate, 4)}}`}
        />
      </p>
      <p className={styles.panelTitle}>Probabilidad de la cola según n (escala logarítmica)</p>
      <SeriesChart
        series={[
          {
            points: table.map((r) => ({ x: r.n, y: Math.exp(r.exact) })),
            color: DATA_COLORS.primary,
            width: 2.5,
          },
          {
            points: table.map((r) => ({ x: r.n, y: Math.exp(-r.n * rate) })),
            color: DATA_COLORS.highlight,
            width: 2,
          },
          {
            points: table.map((r) => ({ x: r.n, y: Math.exp(r.clt) })),
            color: DATA_COLORS.muted,
            dashed: true,
          },
        ]}
        xDomain={[1, nMax]}
        yDomain={[Math.max(1e-300, logFloor), 1]}
        logY
        label={`Probabilidad de la cola. ${description}`}
      >
        {(s) => (
          <circle
            aria-hidden="true"
            cx={s.x(n)}
            cy={s.y(Math.max(logFloor, Math.exp(row.exact)))}
            r={DOT_RADIUS}
            fill={DATA_COLORS.primary}
          />
        )}
      </SeriesChart>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Tasa -(1/n) log P según n</p>
          <SeriesChart
            series={[
              {
                points: table.map((r) => ({ x: r.n, y: -r.exact / r.n })),
                color: DATA_COLORS.primary,
                width: 2,
              },
              {
                points: [
                  { x: 1, y: rate },
                  { x: nMax, y: rate },
                ],
                color: DATA_COLORS.highlight,
                width: 2,
              },
              {
                points: [
                  { x: 1, y: cltRate },
                  { x: nMax, y: cltRate },
                ],
                color: DATA_COLORS.muted,
                dashed: true,
              },
            ]}
            xDomain={[1, nMax]}
            yDomain={[0, Math.max(rate, cltRate) * 1.8 + 1e-6]}
            label={`Tasa de decaimiento. ${description}`}
            aspect={PANEL_ASPECT}
          />
        </div>
        <div>
          <p className={styles.panelTitle}>Función de tasa I(x)</p>
          <FunctionPlot
            xDomain={xDomain}
            yDomain={[0, Math.max(rate, cltRate) * 1.8 + 1e-6]}
            label={`Función de tasa y su aproximación cuadrática. ${description}`}
            aspect={PANEL_ASPECT}
            minHeight={200}
            curves={[
              { f: (x) => definition.rate(x), color: DATA_COLORS.highlight, width: 2.5 },
              {
                f: (x) => (x - definition.mean) ** 2 / (2 * definition.sd ** 2),
                color: DATA_COLORS.muted,
                dashed: true,
              },
            ]}
          >
            {(s) => (
              <g aria-hidden="true">
                <line
                  x1={s.x(a)}
                  x2={s.x(a)}
                  y1={s.y(0)}
                  y2={s.y(rate)}
                  stroke={DATA_COLORS.highlight}
                  strokeDasharray="4 4"
                />
                <circle cx={s.x(a)} cy={s.y(rate)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} />
                <circle
                  cx={s.x(definition.mean)}
                  cy={s.y(0)}
                  r={DOT_RADIUS - 1}
                  fill={DATA_COLORS.text}
                />
              </g>
            )}
          </FunctionPlot>
        </div>
      </div>
    </VizFrame>
  );
}
