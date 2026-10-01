import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { distanceCorrelation, maximalInformation } from '../../../lib/stats/association.ts';
import { pearson, quantile } from '../../../lib/stats/index.ts';
import { generatePairs } from '../../../lib/stats/pairs.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './AssociationViz.module.css';
import { paddedDomain } from './pairDomain.ts';
import { PairPlot } from './PairPlot.tsx';
import type { GeneratorSpec } from './schema.ts';

const GRIDS_PER_SECOND = 2;
const DOT_RADIUS = 3.5;

interface MicViewProps {
  title: string;
  points?: readonly [number, number][];
  generator?: GeneratorSpec;
  names: { x: string; y: string };
  seed: number;
}

function cuts(values: readonly number[], bins: number): number[] {
  return Array.from({ length: bins - 1 }, (_, k) => quantile(values, (k + 1) / bins));
}

/**
 * Grids of increasing resolution laid over the scatter. Each grid turns the
 * points into a contingency table whose normalized mutual information is
 * scored; the maximum over grids approximates the MIC.
 */
export function MicView({ title, points, generator, names, seed: seed0 }: MicViewProps) {
  const seed = useSeed(seed0);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [data] = useResettableState(
    `${JSON.stringify(points ?? generator)}|${seed.seed}|${run}`,
    () =>
      points
        ? points.map(([x, y]) => [x, y] as [number, number])
        : generator
          ? generatePairs(
              {
                shape: generator.tipo,
                n: generator.n,
                ...(generator.ruido === undefined ? {} : { noise: generator.ruido }),
                ...(generator.pendiente === undefined ? {} : { slope: generator.pendiente }),
              },
              new Random(seed.seed),
            )
          : [],
  );
  const xs = data.map((p) => p[0]);
  const ys = data.map((p) => p[1]);
  const { grids, best } = maximalInformation(xs, ys);
  const [step, setStep] = useResettableState(`${seed.seed}|${run}|${grids.length}`, () =>
    reducedMotion ? grids.length : 1,
  );
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(grids.length, value + 1)),
    reset: () => setRun((v) => v + 1),
    rate: GRIDS_PER_SECOND,
    done: step >= grids.length,
  });
  const explored = grids.slice(0, step);
  const current = explored[explored.length - 1];
  const bestSoFar = explored.reduce((a, b) => (b.score > a.score ? b : a), explored[0] ?? best);
  const finished = step >= grids.length;
  const shownGrid = finished ? best : current;
  const g = (v: number) => formatNumber(v, 3);
  const header = current
    ? finished
      ? `\\mathrm{MIC} \\approx \\max_{a b \\le n^{0.6}} \\frac{\\hat{I}_{a \\times b}}{\\log \\min(a, b)} = ${g(best.score)}\\quad(\\text{malla } ${best.columns} \\times ${best.rows})`
      : `\\text{malla } ${current.columns} \\times ${current.rows}:\\ \\frac{\\hat{I}}{\\log ${Math.min(current.columns, current.rows)}} = \\frac{${g(current.mutualInformation)}}{${g(Math.log(Math.min(current.columns, current.rows)))}} = ${g(current.score)};\\ \\text{mejor hasta ahora } ${g(bestSoFar.score)}`
    : '';
  const rPearson = pearson(xs, ys);
  const dCor = distanceCorrelation(xs, ys).dCor;
  const description =
    `${data.length} puntos. Mallas exploradas: ${step} de ${grids.length}. Puntaje máximo de información ${g(best.score)}; ` +
    `correlación de Pearson ${g(rPearson)}; correlación de distancia ${g(dCor)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      {...(generator ? { seed } : {})}
      readouts={[
        { label: 'Mallas exploradas', value: `${step} de ${grids.length}` },
        {
          label: 'Malla actual',
          value: shownGrid ? `${shownGrid.columns} × ${shownGrid.rows}` : '',
        },
        { label: 'Puntaje de la malla actual', value: shownGrid ? g(shownGrid.score) : '' },
        {
          label: 'MIC aproximado',
          value: finished ? g(best.score) : `${g(bestSoFar.score)} hasta ahora`,
          color: DATA_COLORS.highlight,
        },
        { label: 'Correlación de Pearson', value: g(rPearson) },
        { label: 'Correlación de distancia', value: g(dCor) },
      ]}
      legend={[
        { label: 'Observaciones', color: DATA_COLORS.text, shape: 'circle' },
        {
          label: 'Cortes de la malla (frecuencias iguales)',
          color: DATA_COLORS.highlight,
          shape: 'dashed',
        },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <PairPlot
        xDomain={paddedDomain(xs)}
        yDomain={paddedDomain(ys)}
        xLabel={names.x}
        yLabel={names.y}
        label={description}
      >
        {({ x, y, left, right, top, bottom }) => (
          <g aria-hidden="true">
            {shownGrid &&
              cuts(xs, shownGrid.columns).map((cut, k) => (
                <line
                  key={`c${k}`}
                  x1={x(cut)}
                  x2={x(cut)}
                  y1={top}
                  y2={bottom}
                  stroke={DATA_COLORS.highlight}
                  strokeDasharray="5 4"
                  strokeWidth={1.5}
                />
              ))}
            {shownGrid &&
              cuts(ys, shownGrid.rows).map((cut, k) => (
                <line
                  key={`r${k}`}
                  x1={left}
                  x2={right}
                  y1={y(cut)}
                  y2={y(cut)}
                  stroke={DATA_COLORS.highlight}
                  strokeDasharray="5 4"
                  strokeWidth={1.5}
                />
              ))}
            {data.map(([px, py], i) => (
              <circle
                key={i}
                cx={x(px)}
                cy={y(py)}
                r={DOT_RADIUS}
                fill={DATA_COLORS.text}
                fillOpacity={0.75}
              />
            ))}
          </g>
        )}
      </PairPlot>
    </VizFrame>
  );
}
