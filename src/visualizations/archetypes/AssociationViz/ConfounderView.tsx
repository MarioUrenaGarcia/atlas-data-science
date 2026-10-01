import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { partialCorrelation } from '../../../lib/stats/association.ts';
import { linearRegression, pearson } from '../../../lib/stats/index.ts';
import { confoundedData } from '../../../lib/stats/pairs.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './AssociationViz.module.css';
import { paddedDomain } from './pairDomain.ts';
import { PairPlot } from './PairPlot.tsx';

const STAGES = 3;
const MORPH_STEPS = 8;
const STEPS_PER_SECOND = 1.5;
const DOT_RADIUS = 4.5;
const DEFAULT_NOISE = 1;

interface ConfounderViewProps {
  title: string;
  view: 'grupos' | 'residuos';
  names: { x: string; y: string; z: string };
  levels: readonly string[];
  n: number;
  effectX: number;
  effectY: number;
  direct: number;
  noise?: number;
  origin?: [number, number];
  seed: number;
}

/**
 * Two variables driven by a common cause. Coloring by the cause reveals that
 * the association vanishes within its levels; removing its linear effect
 * gives the partial correlation.
 */
export function ConfounderView(props: ConfounderViewProps) {
  const { title, view, names, levels } = props;
  const seed = useSeed(props.seed);
  const reducedMotion = useReducedMotion();
  const total = view === 'grupos' ? STAGES - 1 : 1 + MORPH_STEPS;
  const [run, setRun] = useState(0);
  const [state, update] = useResettableState(`${seed.seed}|${run}`, () => ({
    rows: confoundedData(
      {
        levels: levels.length,
        n: props.n,
        effectX: props.effectX,
        effectY: props.effectY,
        direct: props.direct,
        noise: props.noise ?? DEFAULT_NOISE,
        ...(props.origin ? { origin: props.origin } : {}),
      },
      new Random(seed.seed),
    ),
    step: reducedMotion ? total : 0,
  }));
  const playback = usePlayback({
    step: () => update((previous) => ({ ...previous, step: Math.min(total, previous.step + 1) })),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: state.step >= total,
  });
  const xs = state.rows.map((row) => row.x);
  const ys = state.rows.map((row) => row.y);
  const zs = state.rows.map((row) => row.z);
  const overall = pearson(xs, ys);
  const partial = partialCorrelation(xs, ys, zs);
  const rxz = pearson(xs, zs);
  const ryz = pearson(ys, zs);
  const within = levels.map((_, level) => {
    const rows = state.rows.filter((row) => row.z === level);
    const lx = rows.map((row) => row.x);
    const ly = rows.map((row) => row.y);
    return {
      level,
      r: pearson(lx, ly),
      fit: linearRegression(lx, ly),
      range: [Math.min(...lx), Math.max(...lx)] as [number, number],
    };
  });
  const residualX = linearRegression(zs, xs).residuals;
  const residualY = linearRegression(zs, ys).residuals;
  const morph = view === 'residuos' ? Math.max(0, Math.min(1, (state.step - 1) / MORPH_STEPS)) : 0;
  const display = state.rows.map((row, i) => [
    row.x + ((residualX[i] ?? 0) - row.x) * morph,
    row.y + ((residualY[i] ?? 0) - row.y) * morph,
  ]);
  const colored = view === 'grupos' ? state.step >= 1 : state.step >= 1;
  const g = (v: number) => formatNumber(v, 3);
  const header =
    view === 'grupos'
      ? [
          `r_{xy} = ${g(overall)}\\quad\\text{con todas las observaciones juntas}`,
          `\\text{colores: niveles de ${names.z.toLowerCase()}}`,
          `\\text{dentro de cada nivel: } ${within.map((w) => `r = ${g(w.r)}`).join(',\\ ')}`,
        ][Math.min(2, state.step)]
      : state.step === 0
        ? `r_{xy} = ${g(overall)}`
        : `r_{xy\\cdot z} = \\frac{r_{xy} - r_{xz}\\,r_{yz}}{\\sqrt{(1 - r_{xz}^2)(1 - r_{yz}^2)}} = \\frac{${g(overall)} - ${g(rxz)} \\cdot ${g(ryz)}}{\\sqrt{(1 - ${g(rxz)}^2)(1 - ${g(ryz)}^2)}} = ${g(partial)}`;
  const description =
    `${state.rows.length} observaciones. Correlación entre ${names.x} y ${names.y}: ${g(overall)}. ` +
    `Dentro de cada nivel de ${names.z}: ${within.map((w) => g(w.r)).join(', ')}. Correlación parcial dado ${names.z}: ${g(partial)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      readouts={[
        {
          label: `Correlación de ${names.x} y ${names.y}`,
          value: g(overall),
          color: DATA_COLORS.text,
        },
        ...within.map((w) => ({
          label: `Dentro de ${levels[w.level] ?? ''}`,
          value: g(w.r),
          color: seriesColor(w.level),
        })),
        {
          label: `Correlación parcial dado ${names.z}`,
          value: g(partial),
          color: DATA_COLORS.highlight,
        },
      ]}
      legend={levels.map((level, i) => ({
        label: `${names.z}: ${level}`,
        color: seriesColor(i),
        shape: 'circle' as const,
      }))}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header ?? ''} />
      </p>
      <PairPlot
        xDomain={morph > 0 ? paddedDomain(display.map((d) => d[0] ?? 0)) : paddedDomain(xs)}
        yDomain={morph > 0 ? paddedDomain(display.map((d) => d[1] ?? 0)) : paddedDomain(ys)}
        xLabel={morph > 0.5 ? `${names.x} sin el efecto de ${names.z.toLowerCase()}` : names.x}
        yLabel={morph > 0.5 ? `${names.y} sin el efecto de ${names.z.toLowerCase()}` : names.y}
        label={description}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {display.map(([px = 0, py = 0], i) => (
              <circle
                key={i}
                cx={x(px)}
                cy={y(py)}
                r={DOT_RADIUS}
                fill={colored ? seriesColor(zs[i] ?? 0) : DATA_COLORS.text}
                fillOpacity={0.75}
              />
            ))}
            {view === 'grupos' &&
              state.step >= 2 &&
              within.map((w) => (
                <line
                  key={w.level}
                  x1={x(w.range[0])}
                  x2={x(w.range[1])}
                  y1={y(w.fit.intercept + w.fit.slope * w.range[0])}
                  y2={y(w.fit.intercept + w.fit.slope * w.range[1])}
                  stroke={seriesColor(w.level)}
                  strokeWidth={3}
                />
              ))}
          </g>
        )}
      </PairPlot>
    </VizFrame>
  );
}
