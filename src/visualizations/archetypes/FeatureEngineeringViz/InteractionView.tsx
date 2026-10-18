import { useMemo, useState } from 'react';
import { leastSquares } from '../../../lib/dataprep/lifecycle.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { mean } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { ScatterFrame } from '../../shared/ScatterCharts.tsx';

const N = 60;
const POINTS_PER_SECOND = 20;
const MIN_POINTS = 6;

interface Store {
  ads: number;
  high: number;
  sales: number;
}

/** Weekly sales against advertising spend, in low and high season; the effect of advertising depends on the season. */
function stores(effect: number, seed: number): Store[] {
  const random = new Random(seed);
  return Array.from({ length: N }, (_, i) => {
    const ads = random.uniform(0, 10);
    const high = i % 2;
    return {
      ads,
      high,
      sales: 20 + 2 * ads + 5 * high + effect * ads * high + random.normal(0, 3),
    };
  });
}

function rSquared(y: readonly number[], fitted: readonly number[]): number {
  const m = mean(y);
  const sst = y.reduce((a, v) => a + (v - m) ** 2, 0);
  const sse = y.reduce((a, v, i) => a + (v - (fitted[i] ?? 0)) ** 2, 0);
  return 1 - sse / sst;
}

/**
 * Sales against advertising in two seasons. Without the product feature
 * x1 x2, a linear model can only draw parallel lines; with it, each season
 * gets its own slope.
 */
export function InteractionView({
  title,
  withInteraction,
  effect,
  seed: seed0,
}: {
  title: string;
  withInteraction: boolean;
  effect: number;
  seed: number;
}) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'toggle',
      key: 'inter',
      label: 'Incluir la característica de interacción',
      default: withInteraction,
    },
    {
      type: 'number',
      key: 'efecto',
      label: 'Efecto adicional de la publicidad en temporada alta',
      min: -3,
      max: 3,
      step: 0.1,
      default: effect,
      symbol: 'β₃',
      digits: 1,
    },
  ];
  const parameters = useParameters(definitions);
  const inter = Boolean(parameters.values.inter);
  const beta3 = Number(parameters.values.efecto);
  const seed = useSeed(seed0);
  const data = useMemo(() => stores(beta3, seed.seed), [beta3, seed.seed]);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${seed.seed}|${beta3}|${run}`, () =>
    reducedMotion ? N : MIN_POINTS,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(N, v + 1)),
    stepMany: (count) => update((v) => Math.min(N, v + count)),
    reset: () => setRun((v) => v + 1),
    rate: POINTS_PER_SECOND,
    done: shown >= N,
  });
  const visible = data.slice(0, shown);
  const y = visible.map((s) => s.sales);
  const designA = visible.map((s) => [1, s.ads, s.high]);
  const designB = visible.map((s) => [1, s.ads, s.high, s.ads * s.high]);
  const fitA = leastSquares(designA, y);
  const fitB = leastSquares(designB, y);
  const fit = inter ? fitB : fitA;
  const c = fit?.coefficients ?? [0, 0, 0, 0];
  const r2A = fitA ? rSquared(y, fitA.fitted) : Number.NaN;
  const r2B = fitB ? rSquared(y, fitB.fitted) : Number.NaN;
  const g = (v: number) => formatNumber(v, 2);
  const header = inter
    ? `\\hat{y} = ${g(c[0] ?? 0)} + ${g(c[1] ?? 0)}\\,x_1 + ${g(c[2] ?? 0)}\\,x_2 + (${g(c[3] ?? 0)})\\,x_1 x_2`
    : `\\hat{y} = ${g(c[0] ?? 0)} + ${g(c[1] ?? 0)}\\,x_1 + ${g(c[2] ?? 0)}\\,x_2`;
  const slopeLow = c[1] ?? 0;
  const slopeHigh = (c[1] ?? 0) + (inter ? (c[3] ?? 0) : 0);
  const description =
    `${shown} semanas de ventas contra publicidad. Modelo ${inter ? 'con' : 'sin'} interacción: pendiente ${g(slopeLow)} en temporada baja y ${g(slopeHigh)} en alta. ` +
    `R cuadrada sin interacción ${g(r2A)}, con interacción ${g(r2B)}.`;
  const line = (x0: number, x1v: number, high: number) => {
    const at = (x: number) =>
      (c[0] ?? 0) + (c[1] ?? 0) * x + (c[2] ?? 0) * high + (inter ? (c[3] ?? 0) * x * high : 0);
    return { x0, x1: x1v, y0: at(x0), y1: at(x1v) };
  };
  const ys = data.map((s) => s.sales);

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Pendiente en temporada baja', value: g(slopeLow), color: DATA_COLORS.primary },
        { label: 'Pendiente en temporada alta', value: g(slopeHigh), color: DATA_COLORS.secondary },
        { label: 'R cuadrada sin interacción', value: g(r2A) },
        { label: 'R cuadrada con interacción', value: g(r2B), color: DATA_COLORS.highlight },
      ]}
      legend={[
        { label: 'Temporada baja (x₂ = 0)', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Temporada alta (x₂ = 1)', color: DATA_COLORS.secondary, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ScatterFrame
        xDomain={[0, 10]}
        yDomain={[Math.min(...ys) - 3, Math.max(...ys) + 3]}
        xLabel="Gasto en publicidad (miles de pesos), x₁"
        yLabel="Ventas (miles de pesos)"
        label={description}
      >
        {({ x, y: ys2 }) => (
          <g aria-hidden="true">
            {visible.map((s, i) => (
              <circle
                key={i}
                cx={x(s.ads)}
                cy={ys2(s.sales)}
                r={4}
                fill={s.high ? DATA_COLORS.secondary : DATA_COLORS.primary}
                fillOpacity={0.75}
              />
            ))}
            {[0, 1].map((h) => {
              const l = line(0, 10, h);
              return (
                <line
                  key={h}
                  x1={x(l.x0)}
                  y1={ys2(l.y0)}
                  x2={x(l.x1)}
                  y2={ys2(l.y1)}
                  stroke={h ? DATA_COLORS.secondary : DATA_COLORS.primary}
                  strokeWidth={2.5}
                />
              );
            })}
          </g>
        )}
      </ScatterFrame>
    </VizFrame>
  );
}
