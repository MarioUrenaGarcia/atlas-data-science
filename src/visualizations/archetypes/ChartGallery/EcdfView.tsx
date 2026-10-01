import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { ecdf, median, sorted } from '../../../lib/stats/index.ts';
import { seriesColor, DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ChartGallery.module.css';

const STEPS = 25;
const STEPS_PER_SECOND = 6;

interface EcdfViewProps {
  title: string;
  groups: { name: string; values: number[] }[];
  label: string;
}

/** Largest vertical gap between two empirical distribution functions and where it occurs. */
function maxGap(a: readonly number[], b: readonly number[]): { gap: number; at: number } {
  const fa = ecdf(a);
  const fb = ecdf(b);
  let best = { gap: 0, at: a[0] ?? 0 };
  for (const x of [...a, ...b]) {
    const gap = Math.abs(fa(x) - fb(x));
    if (gap > best.gap) best = { gap, at: x };
  }
  return best;
}

/**
 * Empirical distribution functions that grow as data arrive. Each jump is
 * one observation; with two groups, the largest vertical gap between the
 * staircases summarizes how different the distributions are.
 */
export function EcdfView({ title, groups, label }: EcdfViewProps) {
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [step, update] = useResettableState<number>(`${groups.length}|${run}`, () =>
    reducedMotion ? STEPS : 1,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(STEPS, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  const visible = groups.map((g) =>
    g.values.slice(0, Math.max(1, Math.round((g.values.length * step) / STEPS))),
  );
  const all = groups.flatMap((g) => g.values);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const pad = (hi - lo) * 0.05 || 1;
  const gap = groups.length === 2 ? maxGap(visible[0] ?? [], visible[1] ?? []) : null;
  const f = (v: number) => formatNumber(v, 2);
  const header = gap
    ? `D = \\max_x |\\hat{F}_1(x) - \\hat{F}_2(x)| = ${f(gap.gap)}\\ \\text{en } x = ${f(gap.at)}`
    : `\\hat{F}(x) = \\frac{\\#\\{i : x_i \\le x\\}}{n},\\quad n = ${visible[0]?.length ?? 0}`;
  const description =
    groups
      .map(
        (g, i) =>
          `${g.name}: ${visible[i]?.length ?? 0} datos, mediana ${f(median(visible[i] ?? []))}.`,
      )
      .join(' ') +
    (gap ? ` La mayor distancia vertical entre las funciones es ${f(gap.gap)}.` : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        ...groups.map((g, i) => ({
          label: `Mediana de ${g.name}`,
          value: f(median(visible[i] ?? [])),
          color: seriesColor(i),
        })),
        ...(gap
          ? [{ label: 'Distancia máxima D', value: f(gap.gap), color: DATA_COLORS.highlight }]
          : []),
      ]}
      legend={groups.map((g, i) => ({
        label: g.name,
        color: seriesColor(i),
        shape: 'line' as const,
      }))}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={240}
        maxHeight={400}
        margins={{ top: 16, right: 20, bottom: 46, left: 56 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([lo - pad, hi + pad])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, 1])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="Proporción acumulada"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={8}
                label={label}
              />
              {visible.map((values, gi) => {
                const xs = sorted(values);
                const n = xs.length;
                const path = [
                  `M ${x(lo - pad)} ${y(0)}`,
                  ...xs.flatMap((v, i) => [`L ${x(v)} ${y(i / n)}`, `L ${x(v)} ${y((i + 1) / n)}`]),
                  `L ${x(hi + pad)} ${y(1)}`,
                ].join(' ');
                return (
                  <path
                    key={gi}
                    d={path}
                    fill="none"
                    stroke={seriesColor(gi)}
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                );
              })}
              {gap && (
                <line
                  x1={x(gap.at)}
                  x2={x(gap.at)}
                  y1={y(ecdf(visible[0] ?? [])(gap.at))}
                  y2={y(ecdf(visible[1] ?? [])(gap.at))}
                  stroke={DATA_COLORS.highlight}
                  strokeWidth={4}
                  aria-hidden="true"
                />
              )}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
