import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { mcdiarmidBound } from '../../../lib/probability/inequalities.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './InequalityBound.module.css';
import type { InequalityBoundConfig } from './schema.ts';

const DEFAULT_BALLS = 50;
const DEFAULT_ROUNDS = 2000;
const ROUND_SECONDS = 15;
const CURVE_POINTS = 80;

interface McDiarmidViewProps {
  title: string;
  conceptId: string;
  config: InequalityBoundConfig;
}

/**
 * McDiarmid's bounded differences inequality on balls and bins: m balls fall
 * independently into m bins and f counts the empty bins. Moving one ball
 * changes f by at most 1, so P(f - E f >= t) <= exp(-2 t^2 / m). The
 * histogram of simulated values of f is shaded beyond E f + t, and the second
 * chart compares the simulated tail with the bound for every t.
 */
export function McDiarmidView({ title, conceptId, config }: McDiarmidViewProps) {
  const m = config.bolas ?? DEFAULT_BALLS;
  const total = config.muestras ?? DEFAULT_ROUNDS;
  const mean = m * (1 - 1 / m) ** m;
  const tMax = Math.max(2, Math.ceil(Math.sqrt(m) * 1.5));
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 't',
        label: 'Desviación t',
        symbol: 't',
        min: 0.5,
        max: tMax,
        step: 0.5,
        digits: 1,
        default: config.umbral ?? Math.min(tMax, Math.round(Math.sqrt(m))),
      },
    ],
    [config.umbral, tMax, m],
  );
  const parameters = useParameters(definitions);
  const t = (parameters.values as Record<string, number>).t ?? 1;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const key = `${run}|${seed.seed}`;
  const random = useRandomSource(seed.seed, key);
  const [counts, update] = useResettableState<number[]>(key, () => []);
  const throwRounds = (rounds: number) => {
    const generator = random();
    const fresh = Array.from(
      { length: Math.max(0, Math.min(rounds, total - counts.length)) },
      () => {
        const used = new Uint8Array(m);
        for (let ball = 0; ball < m; ball += 1) used[generator.int(0, m - 1)] = 1;
        let empty = 0;
        for (let bin = 0; bin < m; bin += 1) if (used[bin] === 0) empty += 1;
        return empty;
      },
    );
    update((previous) => [...previous, ...fresh]);
  };
  const playback = usePlayback({
    step: () => throwRounds(1),
    stepMany: throwRounds,
    reset: () => setRun((value) => value + 1),
    rate: Math.max(20, total / ROUND_SECONDS),
    done: counts.length >= total,
  });
  const r = counts.length;
  const tailOf = (s: number) => (r > 0 ? counts.filter((c) => c - mean >= s).length / r : 0);
  const empirical = tailOf(t);
  const bound = mcdiarmidBound(t, m);
  const f = (v: number) => formatNumber(v, 3);
  const header =
    r === 0
      ? `P\\big(f - \\mathbb{E}[f] \\ge t\\big) \\le \\exp\\!\\left(-\\frac{2t^2}{\\sum_i c_i^2}\\right) = e^{-2t^2/${m}}`
      : `P(f - ${f(mean)} \\ge ${formatNumber(t, 1)}) \\approx \\frac{${counts.filter((c) => c - mean >= t).length}}{${r}} = ${f(empirical)} \\;\\le\\; e^{-2 \\cdot ${formatNumber(t, 1)}^2 / ${m}} = ${f(bound)}`;
  const description =
    `${m} bolas en ${m} cajas; f es el número de cajas vacías, con media ${f(mean)}. ` +
    `${r} repeticiones: proporción con f al menos ${formatNumber(t, 1)} sobre la media ${f(empirical)}; cota de McDiarmid ${f(bound)}.`;
  const lo = Math.floor(Math.min(mean - 3 * Math.sqrt(m) * 0.3, ...counts));
  const hi = Math.ceil(Math.max(mean + 3 * Math.sqrt(m) * 0.3, ...counts));
  const histogram = Array.from(
    { length: hi - lo + 1 },
    (_, i) => counts.filter((c) => c === lo + i).length,
  );
  const maxCount = Math.max(1, ...histogram);
  const ts = Array.from({ length: CURVE_POINTS + 1 }, (_, i) => (tMax * i) / CURVE_POINTS);

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: parameters.values }}
      readouts={[
        { label: 'Repeticiones', value: `${r} de ${total}` },
        { label: 'E[f] = m(1 - 1/m)^m', value: f(mean) },
        { label: 'Cola simulada', value: f(empirical), color: DATA_COLORS.highlight },
        { label: 'Cota de McDiarmid', value: f(bound), color: DATA_COLORS.secondary },
      ]}
      legend={[
        { label: 'Repeticiones con f ≥ E[f] + t', color: DATA_COLORS.highlight },
        { label: 'Cola simulada', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Cota de McDiarmid', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <div className={styles.panels}>
        <ChartSvg label={description} aspect={0.7} minHeight={240} maxHeight={340}>
          {(box) => {
            const x = scaleLinear()
              .domain([lo - 0.5, hi + 0.5])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const y = scaleLinear()
              .domain([0, maxCount * 1.1])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const bottom = box.inner.top + box.inner.height;
            const width = Math.max(2, (x(1) - x(0)) * 0.8);
            return (
              <>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={4}
                  label="repeticiones"
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={bottom}
                  ticks={6}
                  label="cajas vacías"
                />
                <g aria-hidden="true">
                  {histogram.map((c, i) => {
                    const value = lo + i;
                    return (
                      <rect
                        key={value}
                        x={x(value) - width / 2}
                        y={y(c)}
                        width={width}
                        height={bottom - y(c)}
                        fill={value - mean >= t ? DATA_COLORS.highlight : DATA_COLORS.primary}
                        fillOpacity={0.8}
                      />
                    );
                  })}
                  <line
                    x1={x(mean)}
                    x2={x(mean)}
                    y1={box.inner.top}
                    y2={bottom}
                    stroke={DATA_COLORS.text}
                    strokeDasharray="5 4"
                  />
                  <line
                    x1={x(mean + t)}
                    x2={x(mean + t)}
                    y1={box.inner.top}
                    y2={bottom}
                    stroke={DATA_COLORS.secondary}
                    strokeWidth={2}
                  />
                </g>
              </>
            );
          }}
        </ChartSvg>
        <ChartSvg label={description} aspect={0.7} minHeight={240} maxHeight={340}>
          {(box) => {
            const x = scaleLinear()
              .domain([0, tMax])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const y = scaleLinear()
              .domain([0, 1])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            return (
              <>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="probabilidad"
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={5}
                  label="t"
                />
                <CurvePath
                  points={ts.map((s) => ({ x: s, y: mcdiarmidBound(s, m) }))}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.secondary}
                  width={2.5}
                  animate={false}
                />
                {r > 0 && (
                  <CurvePath
                    points={ts.map((s) => ({ x: s, y: tailOf(s) }))}
                    xScale={x}
                    yScale={y}
                    color={DATA_COLORS.highlight}
                    width={2.5}
                    step
                    animate={false}
                  />
                )}
                <line
                  aria-hidden="true"
                  x1={x(t)}
                  x2={x(t)}
                  y1={box.inner.top}
                  y2={box.inner.top + box.inner.height}
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="3 3"
                />
              </>
            );
          }}
        </ChartSvg>
      </div>
      <p className={styles.caption}>
        Mover una sola bola cambia el número de cajas vacías en a lo más una unidad; con esa sola
        información la desigualdad acota la cola sin conocer la distribución de f.
      </p>
    </VizFrame>
  );
}
