import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, type SeedState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './EstimatorLab.module.css';

const SHOTS_PER_SECOND = 8;
const MAX_SHOTS = 300;
const RADIUS = 3;
const RINGS = [0.5, 1, 1.5, 2, 2.5, 3];
const LOW = 0.25;
const HIGH = 0.9;
const BIAS_ANGLE = Math.PI / 4;

interface Board {
  label: string;
  bias: number;
  spread: number;
}

interface Shots {
  /** Standard normal pairs, scaled per board when drawn. */
  z: [number, number][];
}

function stats(z: readonly [number, number][], board: Board) {
  const pts = z.map(([a, b]) => [
    board.bias * Math.cos(BIAS_ANGLE) + board.spread * a,
    board.bias * Math.sin(BIAS_ANGLE) + board.spread * b,
  ]);
  const n = pts.length || 1;
  const mx = pts.reduce((t, p) => t + (p[0] ?? 0), 0) / n;
  const my = pts.reduce((t, p) => t + (p[1] ?? 0), 0) / n;
  const variance =
    pts.reduce((t, p) => t + ((p[0] ?? 0) - mx) ** 2 + ((p[1] ?? 0) - my) ** 2, 0) / n;
  const bias2 = mx * mx + my * my;
  return { pts, bias2, variance, mse: variance + bias2 };
}

interface DartboardViewProps {
  title: string;
  bias: number;
  spread: number;
  four: boolean;
  seed: SeedState;
}

/**
 * Estimates as darts thrown at a target whose center is the true value.
 * Bias moves the center of the cloud away from the bullseye; variance
 * spreads it out. The mean squared distance to the center is the mean
 * squared error, and it splits exactly into squared bias plus variance.
 */
export function DartboardView({ title, bias: b0, spread: s0, four, seed }: DartboardViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () =>
      four
        ? []
        : [
            {
              type: 'number',
              key: 'sesgo',
              label: 'Sesgo',
              symbol: 'b',
              min: 0,
              max: 2,
              step: 0.05,
              default: b0,
              digits: 2,
            },
            {
              type: 'number',
              key: 'dispersion',
              label: 'Dispersión de cada coordenada',
              symbol: 'σ',
              min: 0.1,
              max: 2,
              step: 0.05,
              default: s0,
              digits: 2,
            },
          ],
    [four, b0, s0],
  );
  const parameters = useParameters(definitions);
  const boards: Board[] = four
    ? [
        { label: 'Sesgo bajo, varianza baja', bias: 0, spread: LOW },
        { label: 'Sesgo bajo, varianza alta', bias: 0, spread: HIGH },
        { label: 'Sesgo alto, varianza baja', bias: 1.6, spread: LOW },
        { label: 'Sesgo alto, varianza alta', bias: 1.6, spread: HIGH },
      ]
    : [
        {
          label: 'Estimaciones',
          bias: Number(parameters.values.sesgo),
          spread: Number(parameters.values.dispersion),
        },
      ];
  const [run, setRun] = useState(0);
  const random = useRandomSource(seed.seed, String(run));
  const [shots, update] = useResettableState<Shots>(`${seed.seed}|${run}`, () => ({ z: [] }));
  const throwMany = (count: number) => {
    const g = random();
    const z = Array.from(
      { length: count },
      () => [g.normal(0, 1), g.normal(0, 1)] as [number, number],
    );
    update((prev) => ({ z: [...prev.z, ...z].slice(0, MAX_SHOTS) }));
  };
  const playback = usePlayback({
    step: () => throwMany(1),
    stepMany: throwMany,
    reset: () => setRun((v) => v + 1),
    rate: SHOTS_PER_SECOND,
    done: shots.z.length >= MAX_SHOTS,
  });
  const summaries = boards.map((b) => stats(shots.z, b));
  const main = summaries[0];
  const f = (v: number) => formatNumber(v, 3);
  const header =
    !four && main && shots.z.length > 1
      ? `\\text{ECM} = ${f(main.mse)} = \\underbrace{${f(main.variance)}}_{\\text{varianza}} + \\underbrace{${f(main.bias2)}}_{\\text{sesgo}^2}`
      : `\\text{ECM} = \\text{varianza} + \\text{sesgo}^2`;
  const description =
    `${shots.z.length} disparos. ` +
    boards
      .map(
        (b, i) =>
          `${b.label}: sesgo al cuadrado ${f(summaries[i]?.bias2 ?? 0)}, varianza ${f(summaries[i]?.variance ?? 0)}, error cuadrático medio ${f(summaries[i]?.mse ?? 0)}`,
      )
      .join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Disparos', value: String(shots.z.length) },
        ...boards.map((b, i) => ({
          label: `${b.label}: ECM`,
          value: f(summaries[i]?.mse ?? 0),
          color: DATA_COLORS.secondary,
        })),
        ...(four
          ? []
          : [
              { label: 'Varianza', value: f(main?.variance ?? 0) },
              { label: 'Sesgo al cuadrado', value: f(main?.bias2 ?? 0) },
            ]),
      ]}
      legend={[
        { label: 'Valor verdadero (centro)', color: DATA_COLORS.text, shape: 'circle' },
        { label: 'Estimación', color: DATA_COLORS.secondary, shape: 'circle' },
        { label: 'Promedio de las estimaciones', color: DATA_COLORS.primary, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div className={four ? styles.grid : undefined}>
        {boards.map((b, i) => (
          <ChartSvg
            key={b.label}
            label={`${b.label}. ${description}`}
            aspect={1}
            minHeight={four ? 200 : 280}
            maxHeight={four ? 300 : 440}
            margins={{ top: 22, right: 8, bottom: 8, left: 8 }}
          >
            {(box) => {
              const size = Math.min(box.inner.width, box.inner.height);
              const cx = box.inner.left + box.inner.width / 2;
              const cy = box.inner.top + box.inner.height / 2;
              const s = scaleLinear()
                .domain([0, 3.2])
                .range([0, size / 2]);
              const pts = summaries[i]?.pts ?? [];
              const mx = pts.length ? pts.reduce((t, p) => t + (p[0] ?? 0), 0) / pts.length : 0;
              const my = pts.length ? pts.reduce((t, p) => t + (p[1] ?? 0), 0) / pts.length : 0;
              return (
                <g>
                  {four && (
                    <text
                      x={cx}
                      y={box.inner.top - 6}
                      textAnchor="middle"
                      className={styles.chartLabel}
                    >
                      {b.label}
                    </text>
                  )}
                  <g aria-hidden="true">
                    {RINGS.map((r) => (
                      <circle
                        key={r}
                        cx={cx}
                        cy={cy}
                        r={s(r)}
                        fill="none"
                        stroke="var(--data-grid)"
                        strokeWidth={1}
                      />
                    ))}
                    <circle cx={cx} cy={cy} r={5} fill={DATA_COLORS.text} />
                    {pts.map((p, k) => (
                      <circle
                        key={k}
                        cx={cx + s(p[0] ?? 0)}
                        cy={cy - s(p[1] ?? 0)}
                        r={RADIUS}
                        fill={DATA_COLORS.secondary}
                        fillOpacity={0.6}
                      />
                    ))}
                    {pts.length > 0 && (
                      <circle
                        cx={cx + s(mx)}
                        cy={cy - s(my)}
                        r={6}
                        fill={DATA_COLORS.primary}
                        stroke="var(--color-surface)"
                        strokeWidth={2}
                      />
                    )}
                  </g>
                </g>
              );
            }}
          </ChartSvg>
        ))}
      </div>
    </VizFrame>
  );
}
