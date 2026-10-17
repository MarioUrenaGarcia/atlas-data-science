import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { mean, pearson } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, type SeedState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './SufficiencyLab.module.css';

const SAMPLES_PER_SECOND = 20;
const MAX_SAMPLES = 1500;
const MU_MAX = 10;

interface Sim {
  pairs: { m: number; r: number }[];
}

interface AncillaryViewProps {
  title: string;
  n: number;
  seed: SeedState;
}

/**
 * Normal samples with unknown mean mu and known sigma = 1. The sample range
 * is ancillary: its distribution does not move when mu changes. The sample
 * mean is complete and sufficient, so by Basu's theorem the two are
 * independent; the cloud of (mean, range) pairs has no structure.
 */
export function AncillaryView({ title, n: n0, seed }: AncillaryViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'mu',
        label: 'Media de la población',
        symbol: 'μ',
        min: -MU_MAX,
        max: MU_MAX,
        step: 0.5,
        default: 0,
        digits: 1,
      },
      {
        type: 'number',
        key: 'n',
        label: 'Tamaño de cada muestra',
        symbol: 'n',
        min: 2,
        max: 30,
        step: 1,
        default: n0,
      },
    ],
    [n0],
  );
  const parameters = useParameters(definitions);
  const mu = Number(parameters.values.mu);
  const n = Number(parameters.values.n);
  const [run, setRun] = useState(0);
  const runKey = `${mu}|${n}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [sim, update] = useResettableState<Sim>(`${runKey}|${seed.seed}`, () => ({ pairs: [] }));
  const draw = (count: number) => {
    const g = random();
    const pairs: { m: number; r: number }[] = [];
    for (let k = 0; k < count; k += 1) {
      const s = Array.from({ length: n }, () => g.normal(mu, 1));
      pairs.push({ m: mean(s), r: Math.max(...s) - Math.min(...s) });
    }
    update((prev) => ({ pairs: [...prev.pairs, ...pairs].slice(0, MAX_SAMPLES) }));
  };
  const playback = usePlayback({
    step: () => draw(1),
    stepMany: draw,
    reset: () => setRun((v) => v + 1),
    rate: SAMPLES_PER_SECOND,
    done: sim.pairs.length >= MAX_SAMPLES,
  });
  const ranges = sim.pairs.map((p) => p.r);
  const corr =
    sim.pairs.length > 3
      ? pearson(
          sim.pairs.map((p) => p.m),
          ranges,
        )
      : Number.NaN;
  const meanRange = ranges.length ? mean(ranges) : Number.NaN;
  const header = `R = X_{(n)} - X_{(1)}\\ \\text{(ancilar)},\\quad \\bar{X}\\ \\text{(suficiente y completo)},\\quad \\operatorname{corr}(\\bar{X}, R) \\approx ${formatNumber(corr, 3)}`;
  const description =
    `Muestras normales de tamaño ${n} con media ${formatNumber(mu, 1)} y desviación 1. ${sim.pairs.length} pares de media y rango; ` +
    `rango medio ${formatNumber(meanRange, 3)}, que no depende de la media, y correlación entre media y rango ${formatNumber(corr, 3)}.`;
  const rMax = 2 * Math.sqrt(2 * Math.log(Math.max(n, 2))) + 3;
  const mSpan = 4 / Math.sqrt(n);

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Muestras', value: String(sim.pairs.length) },
        { label: 'Rango medio', value: formatNumber(meanRange, 3), color: DATA_COLORS.secondary },
        { label: 'Correlación entre media y rango', value: formatNumber(corr, 3) },
      ]}
      legend={[
        { label: 'Una muestra: (media, rango)', color: DATA_COLORS.secondary, shape: 'circle' },
        { label: 'Media verdadera', color: DATA_COLORS.text, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.55}
        minHeight={240}
        maxHeight={400}
        margins={{ top: 12, right: 20, bottom: 46, left: 56 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([-MU_MAX - mSpan, MU_MAX + mSpan])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, rMax])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="Rango de la muestra"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={9}
                label="Media de la muestra"
              />
              <g aria-hidden="true">
                <line
                  x1={x(mu)}
                  x2={x(mu)}
                  y1={box.inner.top}
                  y2={box.inner.top + box.inner.height}
                  stroke={DATA_COLORS.text}
                  strokeDasharray="4 3"
                />
                {sim.pairs.map((p, i) => (
                  <circle
                    key={i}
                    cx={x(p.m)}
                    cy={y(Math.min(rMax, p.r))}
                    r={2}
                    fill={DATA_COLORS.secondary}
                    fillOpacity={0.5}
                  />
                ))}
              </g>
              <text x={box.inner.left + 6} y={box.inner.top + 14} className={styles.chartLabel}>
                al mover μ la nube se desplaza de lado, pero no sube ni baja
              </text>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
