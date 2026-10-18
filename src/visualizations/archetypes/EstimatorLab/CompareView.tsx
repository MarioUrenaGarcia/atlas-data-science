import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  meanSquaredError,
  type Problem,
  summarizeEstimates,
} from '../../../lib/inference/estimators.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, type SeedState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './EstimatorLab.module.css';

const SAMPLES_PER_SECOND = 15;
const MAX_SAMPLES = 2000;
const DOTS_SHOWN = 250;
const BINS = 30;
const ROW = 70;
const LABEL_WIDTH = 150;

interface CompareViewProps {
  title: string;
  problem: Problem;
  estimatorIds: string[];
  n: number;
  theta: number;
  seed: SeedState;
}

/**
 * Several estimators of the same parameter applied to the same samples. Each
 * row collects its estimates around the true value; the readouts give the
 * simulated bias, variance and mean squared error of each one, next to the
 * exact values when they are known.
 */
export function CompareView({
  title,
  problem,
  estimatorIds,
  n: n0,
  theta,
  seed,
}: CompareViewProps) {
  const idKey = estimatorIds.join('|');
  const estimators = useMemo(
    () => problem.estimators.filter((e) => idKey.split('|').includes(e.id)),
    [problem, idKey],
  );
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'n',
        label: 'Tamaño de cada muestra',
        symbol: 'n',
        min: 2,
        max: 100,
        step: 1,
        default: n0,
      },
    ],
    [n0],
  );
  const parameters = useParameters(definitions);
  const n = Number(parameters.values.n);
  const population = useMemo(() => problem.population(theta), [problem, theta]);
  const [run, setRun] = useState(0);
  const runKey = `${problem.id}|${n}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [estimates, update] = useResettableState<number[][]>(`${runKey}|${seed.seed}`, () =>
    estimators.map(() => []),
  );
  const draw = (count: number) => {
    const g = random();
    const fresh: number[][] = estimators.map(() => []);
    for (let k = 0; k < count; k += 1) {
      const sample = Array.from({ length: n }, () => population.sample(g));
      estimators.forEach((e, j) => fresh[j]?.push(e.compute(sample)));
    }
    update((prev) => prev.map((list, j) => [...list, ...(fresh[j] ?? [])].slice(0, MAX_SAMPLES)));
  };
  const count = estimates[0]?.length ?? 0;
  const playback = usePlayback({
    step: () => draw(1),
    stepMany: draw,
    reset: () => setRun((v) => v + 1),
    rate: SAMPLES_PER_SECOND,
    done: count >= MAX_SAMPLES,
  });
  const summaries = estimates.map((list) =>
    list.length > 1 ? summarizeEstimates(list, theta) : null,
  );
  const f = (v: number) => formatNumber(v, 4);
  const domain = useMemo<[number, number]>(() => {
    const spread = Math.max(
      ...estimators.map(
        (e) => Math.sqrt(e.variance?.(n, theta) ?? 0) + Math.abs(e.bias?.(n, theta) ?? 0),
      ),
      theta * 0.3,
    );
    return [
      Math.max(problem.id === 'media-normal' ? -Infinity : 0, theta - 3.5 * spread),
      theta + 3.5 * spread,
    ];
  }, [estimators, n, theta, problem.id]);
  const best = summaries.reduce(
    (bi, s, i) => (s && (!summaries[bi] || s.mse < (summaries[bi]?.mse ?? Infinity)) ? i : bi),
    0,
  );
  const header = `\\text{ECM}(\\hat{\\theta}) = \\mathbb{E}\\big[(\\hat{\\theta} - ${problem.parameter})^2\\big] = \\operatorname{Var}(\\hat{\\theta}) + \\text{sesgo}^2,\\quad ${problem.parameter} = ${formatNumber(theta, 2)},\\ n = ${n}`;
  const description =
    `${count} muestras de tamaño ${n}. ` +
    estimators
      .map((e, i) => {
        const s = summaries[i];
        return s
          ? `${e.name}: sesgo ${f(s.bias)}, varianza ${f(s.variance)}, error cuadrático medio ${f(s.mse)}`
          : e.name;
      })
      .join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={estimators.flatMap((e, i) => {
        const s = summaries[i];
        const exact =
          e.bias && e.variance ? meanSquaredError(e.bias(n, theta), e.variance(n, theta)) : null;
        return [
          {
            label: `${e.name}: sesgo; varianza`,
            value: s ? `${f(s.bias)}; ${f(s.variance)}` : 'sin datos',
            color: seriesColor(i),
          },
          {
            label: `${e.name}: ECM${exact === null ? '' : ' (exacto)'}`,
            value: s ? `${f(s.mse)}${exact === null ? '' : ` (${f(exact)})`}` : 'sin datos',
          },
        ];
      })}
      legend={[
        ...estimators.map((e, i) => ({
          label: e.name,
          color: seriesColor(i),
          shape: 'circle' as const,
        })),
        { label: 'Valor verdadero', color: DATA_COLORS.text, shape: 'line' as const },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={estimators.length * ROW + 60}
        maxHeight={estimators.length * ROW + 90}
        margins={{ top: 8, right: 20, bottom: 44, left: LABEL_WIDTH }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain(domain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const rowH = box.inner.height / estimators.length;
          return (
            <g>
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                gridLength={box.inner.height}
                ticks={8}
                label="Estimación"
              />
              <line
                x1={x(theta)}
                x2={x(theta)}
                y1={box.inner.top}
                y2={box.inner.top + box.inner.height}
                stroke={DATA_COLORS.text}
                strokeWidth={2}
                aria-hidden="true"
              />
              {estimators.map((e, i) => {
                const list = estimates[i] ?? [];
                const top = box.inner.top + i * rowH;
                const width = (domain[1] - domain[0]) / BINS;
                const counts = new Array<number>(BINS).fill(0);
                for (const v of list) {
                  const k = Math.floor((v - domain[0]) / width);
                  if (k >= 0 && k < BINS) counts[k] = (counts[k] ?? 0) + 1;
                }
                const peak = Math.max(1, ...counts);
                const m = summaries[i]?.mean;
                return (
                  <g key={e.id}>
                    <text
                      x={box.inner.left - 8}
                      y={top + rowH / 2}
                      dy="0.32em"
                      textAnchor="end"
                      className={styles.chartLabel}
                    >
                      {e.name}
                      {i === best && list.length > 30 ? ' (menor ECM)' : ''}
                    </text>
                    <g aria-hidden="true">
                      {counts.map((c, k) => {
                        const h = ((rowH - 10) * c) / peak;
                        return (
                          <rect
                            key={k}
                            x={x(domain[0] + k * width)}
                            y={top + rowH - 4 - h}
                            width={Math.max(0, x(domain[0] + width) - x(domain[0]) - 1)}
                            height={h}
                            fill={seriesColor(i)}
                            fillOpacity={0.35}
                          />
                        );
                      })}
                      {list.slice(-DOTS_SHOWN).map((v, k) => (
                        <circle
                          key={k}
                          cx={x(Math.max(domain[0], Math.min(domain[1], v)))}
                          cy={top + rowH - 8 - ((k * 0.618) % 1) * (rowH * 0.3)}
                          r={2}
                          fill={seriesColor(i)}
                          fillOpacity={0.6}
                        />
                      ))}
                      {m !== undefined && (
                        <line
                          x1={x(m)}
                          x2={x(m)}
                          y1={top + 4}
                          y2={top + rowH - 4}
                          stroke={seriesColor(i)}
                          strokeWidth={3}
                        />
                      )}
                    </g>
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
