import { scaleLog } from 'd3-scale';
import { line } from 'd3-shape';
import { useMemo, useState } from 'react';
import { inscribedBallFraction } from '../../../lib/dataprep/selection.ts';
import { logGamma } from '../../../lib/distributions/special.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { StackedHistogram } from '../../shared/ScatterCharts.tsx';
import styles from './FeatureSelectionViz.module.css';

const POINTS = 300;
const LADDER = [1, 2, 3, 5, 10, 20, 50, 100, 200, 500, 1000];
const STEPS_PER_SECOND = 0.8;

/** Fraction of the cube inside the inscribed ball, written as a power of ten when it is tiny. */
function ballText(d: number): string {
  const v = inscribedBallFraction(d);
  if (v >= 1e-4) return formatNumber(v, 4);
  const log10 =
    (d / 2) * Math.log10(Math.PI) - logGamma(d / 2 + 1) / Math.LN10 + d * Math.log10(0.5);
  return `cerca de 10^${Math.round(log10)}`;
}

interface DistanceSummary {
  d: number;
  min: number;
  max: number;
  contrast: number;
  scaled: number[];
}

/** Distances from the first point to the others, for uniform points in the unit cube of dimension d. */
function distances(d: number, seed: number): DistanceSummary {
  const random = new Random(seed + d);
  const query = Array.from({ length: d }, () => random.next());
  const dist = Array.from({ length: POINTS }, () => {
    let s = 0;
    for (let k = 0; k < d; k += 1) {
      const diff = random.next() - (query[k] ?? 0);
      s += diff * diff;
    }
    return Math.sqrt(s);
  });
  const min = Math.min(...dist);
  const max = Math.max(...dist);
  return { d, min, max, contrast: (max - min) / min, scaled: dist.map((v) => v / max) };
}

/**
 * Uniform points in a cube of growing dimension. The distances from one
 * point to all the others concentrate around a common value: the nearest
 * and the farthest neighbors end up almost equally far.
 */
export function CurseView({
  title,
  maxDimensions,
  seed: seed0,
}: {
  title: string;
  maxDimensions: number;
  seed: number;
}) {
  const seed = useSeed(seed0);
  const ladder = useMemo(() => LADDER.filter((d) => d <= maxDimensions), [maxDimensions]);
  const summaries = useMemo(() => ladder.map((d) => distances(d, seed.seed)), [ladder, seed.seed]);
  const total = ladder.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${seed.seed}|${maxDimensions}|${run}`, () =>
    reducedMotion ? total : 1,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: shown >= total,
  });
  const current = summaries[shown - 1] ?? summaries[0];
  if (!current) return null;
  const g = (v: number) => formatNumber(v, 3);
  const header = `\\frac{d_{\\max} - d_{\\min}}{d_{\\min}} = \\frac{${g(current.max)} - ${g(current.min)}}{${g(current.min)}} = ${g(current.contrast)}\\quad (d = ${current.d})`;
  const description =
    `${POINTS} puntos uniformes en un cubo de dimensión ${current.d}. Distancia al vecino más cercano ${g(current.min)} y al más lejano ${g(current.max)}; contraste relativo ${g(current.contrast)}. ` +
    `Fracción del cubo dentro de la esfera inscrita: ${ballText(current.d)}.`;
  const visible = summaries.slice(0, shown);

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      readouts={[
        { label: 'Dimensión', value: String(current.d) },
        {
          label: 'Vecino más cercano y más lejano',
          value: `${g(current.min)} y ${g(current.max)}`,
        },
        { label: 'Contraste relativo', value: g(current.contrast), color: DATA_COLORS.highlight },
        {
          label: 'Fracción del cubo dentro de la esfera inscrita',
          value: ballText(current.d),
        },
      ]}
      legend={[
        { label: 'Distancias divididas entre la máxima', color: DATA_COLORS.primary },
        {
          label: 'Contraste relativo según la dimensión',
          color: DATA_COLORS.highlight,
          shape: 'line',
        },
      ]}
      description={description}
      dataTable={{
        caption: 'Distancias según la dimensión',
        columns: ['Dimensión', 'Mínima', 'Máxima', 'Contraste'],
        rows: summaries.map((s) => [s.d, g(s.min), g(s.max), g(s.contrast)]),
      }}
    >
      <FormulaLine tex={header} />
      <div className={styles.pair}>
        <StackedHistogram
          series={[{ values: current.scaled, color: DATA_COLORS.primary }]}
          domain={[0, 1]}
          binWidth={0.04}
          label={description}
          axisLabel="Distancia / distancia máxima"
        />
        <ChartSvg
          label={description}
          aspect={0.7}
          minHeight={240}
          maxHeight={360}
          margins={{ top: 12, right: 12, bottom: 46, left: 52 }}
        >
          {(box) => {
            const { left, top, width, height } = box.inner;
            const x = scaleLog()
              .domain([1, Math.max(2, maxDimensions)])
              .range([left, left + width]);
            const y = scaleLog()
              .domain([
                Math.min(...summaries.map((s) => s.contrast)) * 0.8,
                Math.max(...summaries.map((s) => s.contrast)) * 1.2,
              ])
              .range([top + height, top]);
            const path =
              line<DistanceSummary>()
                .x((s) => x(s.d))
                .y((s) => y(s.contrast))(visible) ?? '';
            const [lo, hi] = y.domain() as [number, number];
            const yTicks = [0.01, 0.1, 1, 10, 100, 1000, 10000].filter((v) => v >= lo && v <= hi);
            return (
              <g>
                <Axis
                  scale={y}
                  orientation="left"
                  position={left}
                  gridLength={width}
                  tickValues={yTicks}
                  label="Contraste relativo"
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={top + height}
                  tickValues={ladder.filter((d) => [1, 10, 100, 1000].includes(d))}
                  label="Dimensión (escala logarítmica)"
                />
                <g aria-hidden="true">
                  <path d={path} fill="none" stroke={DATA_COLORS.highlight} strokeWidth={2.5} />
                  {visible.map((s) => (
                    <circle
                      key={s.d}
                      cx={x(s.d)}
                      cy={y(s.contrast)}
                      r={4}
                      fill={DATA_COLORS.highlight}
                    />
                  ))}
                </g>
              </g>
            );
          }}
        </ChartSvg>
      </div>
    </VizFrame>
  );
}
