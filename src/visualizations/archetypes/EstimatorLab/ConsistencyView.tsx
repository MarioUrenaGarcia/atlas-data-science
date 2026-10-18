import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import type { Problem } from '../../../lib/inference/estimators.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, type SeedState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './EstimatorLab.module.css';

const PATHS = 25;
const STEPS = 60;
const STEPS_PER_SECOND = 8;
const PANEL_GAP = 26;

interface ConsistencyViewProps {
  title: string;
  problem: Problem;
  estimatorIds: string[];
  nMax: number;
  epsilon: number;
  theta: number;
  seed: SeedState;
}

/**
 * Each path follows one estimator as a single sample grows observation by
 * observation. A consistent estimator funnels every path into the band
 * theta plus or minus epsilon; an inconsistent one keeps wandering, so the
 * share of paths outside the band does not go to zero.
 */
export function ConsistencyView({
  title,
  problem,
  estimatorIds,
  nMax,
  epsilon: e0,
  theta,
  seed,
}: ConsistencyViewProps) {
  const idKey = estimatorIds.join('|');
  const estimators = useMemo(
    () => problem.estimators.filter((e) => idKey.split('|').includes(e.id)),
    [problem, idKey],
  );
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'epsilon',
        label: 'Tolerancia',
        symbol: 'ε',
        min: 0.02,
        max: 1,
        step: 0.02,
        default: e0,
        digits: 2,
      },
    ],
    [e0],
  );
  const parameters = useParameters(definitions);
  const epsilon = Number(parameters.values.epsilon);
  // Sample sizes on a roughly geometric grid so early and late behavior are both visible.
  const sizes = useMemo(() => {
    const out = new Set<number>();
    for (let k = 0; k < STEPS; k += 1)
      out.add(Math.max(2, Math.round(2 * (nMax / 2) ** (k / (STEPS - 1)))));
    return [...out].sort((a, b) => a - b);
  }, [nMax]);
  const paths = useMemo(() => {
    const random = new Random(seed.seed);
    const population = problem.population(theta);
    return Array.from({ length: PATHS }, () => {
      const data = Array.from({ length: nMax }, () => population.sample(random));
      return estimators.map((e) => sizes.map((n) => e.compute(data.slice(0, n))));
    });
  }, [seed.seed, problem, theta, nMax, estimators, sizes]);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, setShown] = useResettableState<number>(`${seed.seed}|${run}`, () =>
    reducedMotion ? sizes.length : 1,
  );
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(sizes.length, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: shown >= sizes.length,
  });
  const nNow = sizes[shown - 1] ?? 2;
  const outside = estimators.map(
    (_, j) =>
      paths.filter((p) => Math.abs((p[j]?.[shown - 1] ?? theta) - theta) > epsilon).length / PATHS,
  );
  const header =
    `n = ${nNow}:\\quad ` +
    estimators
      .map(
        (e, j) =>
          `P(|${e.tex} - ${problem.parameter}| > ${formatNumber(epsilon, 2)}) \\approx ${formatNumber(outside[j] ?? 0, 2)}`,
      )
      .join(',\\ ');
  const description =
    `${PATHS} trayectorias con muestras que crecen hasta ${nMax}; ahora n = ${nNow}. ` +
    estimators
      .map(
        (e, j) =>
          `${e.name}: ${formatNumber(100 * (outside[j] ?? 0), 0)} % de las trayectorias fuera de la banda`,
      )
      .join('; ') +
    '.';
  const all = paths.flatMap((p) => p.flat()).filter(Number.isFinite);
  const spread = Math.max(
    epsilon * 3,
    ...all
      .map((v) => Math.abs(v - theta))
      .sort((a, b) => a - b)
      .slice(0, Math.floor(all.length * 0.98))
      .slice(-1),
  );
  const domain: [number, number] = [theta - spread, theta + spread];

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Tamaño de muestra n', value: String(nNow) },
        ...estimators.map((e, j) => ({
          label: `${e.name}: fuera de la banda`,
          value: `${formatNumber(100 * (outside[j] ?? 0), 0)} %`,
          color: seriesColor(j),
        })),
      ]}
      legend={[
        ...estimators.map((e, j) => ({
          label: e.name,
          color: seriesColor(j),
          shape: 'line' as const,
        })),
        { label: 'Banda θ ± ε', color: DATA_COLORS.highlight },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.55}
        minHeight={estimators.length * 150 + 40}
        maxHeight={estimators.length * 200 + 60}
        margins={{ top: 8, right: 20, bottom: 44, left: 56 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([Math.log(2), Math.log(nMax)])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const h = (box.inner.height - PANEL_GAP * (estimators.length - 1)) / estimators.length;
          return (
            <g>
              {estimators.map((e, j) => {
                const top = box.inner.top + j * (h + PANEL_GAP);
                const y = scaleLinear()
                  .domain(domain)
                  .range([top + h, top]);
                const clamp = (v: number) => y(Math.max(domain[0], Math.min(domain[1], v)));
                return (
                  <g key={e.id}>
                    <text x={box.inner.left + 6} y={top + 14} className={styles.chartLabel}>
                      {e.name}
                    </text>
                    <Axis
                      scale={y}
                      orientation="left"
                      position={box.inner.left}
                      gridLength={box.inner.width}
                      ticks={4}
                    />
                    <rect
                      x={box.inner.left}
                      y={y(theta + epsilon)}
                      width={box.inner.width}
                      height={y(theta - epsilon) - y(theta + epsilon)}
                      fill={DATA_COLORS.highlight}
                      fillOpacity={0.18}
                      aria-hidden="true"
                    />
                    <g aria-hidden="true">
                      {paths.map((p, k) => (
                        <polyline
                          key={k}
                          points={(p[j] ?? [])
                            .slice(0, shown)
                            .map((v, i) => `${x(Math.log(sizes[i] ?? 2))},${clamp(v)}`)
                            .join(' ')}
                          fill="none"
                          stroke={seriesColor(j)}
                          strokeOpacity={0.45}
                          strokeWidth={1.2}
                        />
                      ))}
                    </g>
                  </g>
                );
              })}
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                tickValues={[2, 5, 10, 20, 50, 100, 200, 500, 1000]
                  .filter((v) => v <= nMax)
                  .map(Math.log)}
                format={(v) => String(Math.round(Math.exp(v)))}
                label="Tamaño de muestra n (escala logarítmica)"
              />
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
