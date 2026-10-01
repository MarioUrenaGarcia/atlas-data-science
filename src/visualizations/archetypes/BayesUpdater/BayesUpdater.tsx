import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { normalize } from '../../../lib/probability/conditional.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { seriesColor } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './BayesUpdater.module.css';
import type { BayesUpdaterConfig } from './schema.ts';

const PHASES_PER_SECOND = 1;
const SIMULATED_OBSERVATIONS = 30;
const DIGITS = 3;

const f = (value: number) => formatNumber(value, DIGITS);
const tex = (name: string) => `\\text{${name}}`;

interface State {
  /** Indices of the observations seen so far. */
  seen: number[];
  /** 0: the last observation is not applied yet; 1: multiplied by the likelihood; 2: normalized. */
  phase: 0 | 1 | 2;
}

/**
 * Bayes' theorem applied one observation at a time. Each observation first
 * multiplies every prior by its likelihood (the bars shrink by different
 * factors) and then the products are divided by their sum, which becomes
 * the prior for the next observation.
 */
export default function BayesUpdater({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as BayesUpdaterConfig;
  const hypotheses = config.hipotesis;
  const observations = config.observaciones;
  const priors = hypotheses.map((h) => h.prior);
  const fixed = useMemo(
    () => config.secuencia?.map((name) => observations.findIndex((o) => o.nombre === name)) ?? null,
    [config.secuencia, observations],
  );
  const total = fixed ? fixed.length : SIMULATED_OBSERVATIONS;
  const truth = config.verdadera ?? 0;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const random = useRandomSource(seed.seed, `${run}`);
  const [state, update] = useResettableState<State>(`${run}|${seed.seed}`, () => ({
    seen: [],
    phase: 2,
  }));
  const draw = () => {
    if (fixed) return fixed[state.seen.length] ?? 0;
    // Simulated data come from the hypothesis marked as true.
    const u = random().uniform();
    let acc = 0;
    for (let i = 0; i < observations.length; i += 1) {
      acc += observations[i]?.verosimilitudes[truth] ?? 0;
      if (u < acc) return i;
    }
    return observations.length - 1;
  };
  const finished = state.seen.length >= total && state.phase === 2;
  const step = () => {
    if (finished) return;
    if (state.phase === 2) {
      const next = draw();
      update((previous) => ({ seen: [...previous.seen, next], phase: 1 }));
    } else update((previous) => ({ ...previous, phase: 2 }));
  };
  const playback = usePlayback({
    step,
    reset: () => setRun((value) => value + 1),
    rate: PHASES_PER_SECOND,
    done: finished,
  });

  // Posterior after each completed observation.
  const history = useMemo(() => {
    const result = [normalize(priors)];
    for (const index of state.seen) {
      const last = result.at(-1) ?? priors;
      const likelihood = observations[index]?.verosimilitudes ?? [];
      result.push(normalize(last.map((p, h) => p * (likelihood[h] ?? 0))));
    }
    return result;
  }, [priors, state.seen, observations]);
  const applied = state.phase === 2 ? state.seen.length : state.seen.length - 1;
  const current = history[applied] ?? priors;
  const lastObservation = observations[state.seen.at(-1) ?? 0];
  const products =
    state.phase === 1 && lastObservation
      ? current.map((p, h) => p * (lastObservation.verosimilitudes[h] ?? 0))
      : null;
  const evidence = products?.reduce((sum, value) => sum + value, 0) ?? 0;
  const shown = products ?? current;

  const header = (() => {
    if (state.seen.length === 0)
      return hypotheses.map((h, i) => `P(${tex(h.nombre)}) = ${f(priors[i] ?? 0)}`).join(',\\; ');
    const obs = tex(lastObservation?.nombre ?? '');
    if (products) {
      return products
        .map(
          (value, h) =>
            `${f(current[h] ?? 0)} \\cdot ${f(lastObservation?.verosimilitudes[h] ?? 0)} = ${f(value)}`,
        )
        .join(';\\; ')
        .concat(` \\quad (\\text{a priori} \\times P(${obs} \\mid H))`);
    }
    const previous = history[applied - 1] ?? priors;
    const raw = previous.map((p, h) => p * (lastObservation?.verosimilitudes[h] ?? 0));
    const sum = raw.reduce((acc, value) => acc + value, 0);
    return `P(${tex(hypotheses[0]?.nombre ?? '')} \\mid \\text{datos}) = \\frac{${f(raw[0] ?? 0)}}{${f(sum)}} = ${f(current[0] ?? 0)}`;
  })();
  const seenText = state.seen.map((index) => observations[index]?.nombre ?? '').join(', ');
  const description =
    `Hipótesis: ${hypotheses.map((h, i) => `${h.nombre}, probabilidad actual ${f(current[i] ?? 0)}`).join('; ')}. ` +
    `Observaciones aplicadas: ${applied}${seenText ? ` (${seenText})` : ''}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={fixed ? undefined : seed}
      readouts={[
        { label: 'Observaciones', value: `${applied} de ${total}` },
        ...hypotheses.map((h, i) => ({
          label: `P(${h.nombre} | datos)`,
          value: f(current[i] ?? 0),
          color: seriesColor(i),
        })),
        ...(products ? [{ label: 'Suma de productos', value: f(evidence) }] : []),
      ]}
      legend={hypotheses.map((h, i) => ({ label: h.nombre, color: seriesColor(i) }))}
      description={description}
      dataTable={{
        caption: 'Probabilidad de cada hipótesis tras cada observación',
        columns: ['Observaciones', ...hypotheses.map((h) => h.nombre)],
        rows: history.map((row, n) => [n, ...row.map((value) => f(value))]),
      }}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <p className={styles.caption}>
        Observaciones: {seenText || 'ninguna todavía'}
        {fixed ? '' : ` (simuladas bajo "${hypotheses[truth]?.nombre ?? ''}")`}
      </p>
      <div className={styles.panels}>
        <ChartSvg label={description} aspect={0.75} minHeight={220} maxHeight={320}>
          {(box) => {
            const slot = box.inner.width / hypotheses.length;
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
                <g aria-hidden="true">
                  {hypotheses.map((h, i) => {
                    const x = box.inner.left + i * slot + slot * 0.2;
                    const width = slot * 0.6;
                    const value = shown[i] ?? 0;
                    return (
                      <g key={h.nombre}>
                        {products && (
                          <rect
                            x={x}
                            y={y(current[i] ?? 0)}
                            width={width}
                            height={y(0) - y(current[i] ?? 0)}
                            fill="none"
                            stroke={seriesColor(i)}
                            strokeDasharray="4 3"
                          />
                        )}
                        <rect
                          x={x}
                          y={y(value)}
                          width={width}
                          height={y(0) - y(value)}
                          fill={seriesColor(i)}
                          fillOpacity={products ? 0.45 : 0.75}
                        />
                        <text
                          x={x + width / 2}
                          y={y(value) - 6}
                          textAnchor="middle"
                          className={svgStyles.label}
                        >
                          {f(value)}
                        </text>
                        <text
                          x={x + width / 2}
                          y={y(0) + 16}
                          textAnchor="middle"
                          className={svgStyles.label}
                        >
                          {h.nombre}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </>
            );
          }}
        </ChartSvg>
        <ChartSvg label={description} aspect={0.75} minHeight={220} maxHeight={320}>
          {(box) => {
            const x = scaleLinear()
              .domain([0, total])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const y = scaleLinear()
              .domain([0, 1])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const completed = history.slice(0, applied + 1);
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
                  ticks={Math.min(6, total)}
                  label="observaciones aplicadas"
                  format={(value) => formatNumber(value, 0)}
                />
                {hypotheses.map((h, i) => (
                  <CurvePath
                    key={h.nombre}
                    points={completed.map((row, n) => ({ x: n, y: row[i] ?? 0 }))}
                    xScale={x}
                    yScale={y}
                    color={seriesColor(i)}
                    animate={false}
                  />
                ))}
              </>
            );
          }}
        </ChartSvg>
      </div>
      <p className={styles.caption}>
        Cada observación se aplica en dos pasos: primero cada barra se multiplica por la
        probabilidad de la observación bajo esa hipótesis (contorno punteado: valor anterior) y
        luego todas se dividen entre su suma.
      </p>
    </VizFrame>
  );
}
