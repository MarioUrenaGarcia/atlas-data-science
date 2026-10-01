import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { pearson } from '../../../lib/stats/index.ts';
import { randomWalks } from '../../../lib/stats/pairs.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './AssociationViz.module.css';
import { paddedDomain } from './pairDomain.ts';
import { PairPlot } from './PairPlot.tsx';

const STEPS_PER_FRAME = 4;
const FRAMES_PER_SECOND = 10;
const MIN_POINTS = 5;
const DOT_RADIUS = 3;

interface SpuriousViewProps {
  title: string;
  names: { x: string; y: string };
  steps: number;
  drift: [number, number];
  differencesFirst: boolean;
  seed: number;
}

function differences(values: readonly number[]): number[] {
  return values.slice(1).map((value, i) => value - (values[i] ?? 0));
}

/**
 * Two independent random walks drawn over time. Their levels often look
 * strongly correlated; their period-to-period changes do not.
 */
export function SpuriousView({
  title,
  names,
  steps,
  drift,
  differencesFirst,
  seed: seed0,
}: SpuriousViewProps) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'toggle',
      key: 'diferencias',
      label: 'Usar cambios entre periodos',
      default: differencesFirst,
    },
  ];
  const parameters = useParameters(definitions);
  const useDifferences = Boolean(parameters.values.diferencias);
  const seed = useSeed(seed0);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [state, update] = useResettableState(`${seed.seed}|${steps}|${run}`, () => {
    const [a, b] = randomWalks(steps, drift, new Random(seed.seed));
    return { a, b, shown: reducedMotion ? steps : MIN_POINTS };
  });
  const playback = usePlayback({
    step: () =>
      update((previous) => ({
        ...previous,
        shown: Math.min(steps, previous.shown + STEPS_PER_FRAME),
      })),
    reset: () => setRun((v) => v + 1),
    rate: FRAMES_PER_SECOND,
    done: state.shown >= steps,
  });
  const a = state.a.slice(0, state.shown);
  const b = state.b.slice(0, state.shown);
  const da = differences(a);
  const db = differences(b);
  const rLevels = pearson(a, b);
  const rChanges = pearson(da, db);
  const sx = useDifferences ? da : a;
  const sy = useDifferences ? db : b;
  const g = (v: number) => formatNumber(v, 3);
  const header = useDifferences
    ? `r(\\Delta x_t, \\Delta y_t) = ${g(rChanges)}\\quad\\text{frente a}\\quad r(x_t, y_t) = ${g(rLevels)}`
    : `r(x_t, y_t) = ${g(rLevels)}\\quad\\text{con } ${state.shown} \\text{ periodos de series independientes}`;
  const description =
    `Dos series independientes de ${state.shown} periodos. Correlación de los niveles: ${g(rLevels)}; ` +
    `correlación de los cambios: ${g(rChanges)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Periodos', value: String(state.shown) },
        { label: 'Correlación de los niveles', value: g(rLevels), color: DATA_COLORS.highlight },
        { label: 'Correlación de los cambios', value: g(rChanges), color: DATA_COLORS.tertiary },
      ]}
      legend={[
        { label: names.x, color: DATA_COLORS.primary, shape: 'line' },
        { label: names.y, color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <div className={styles.pair}>
        <ChartSvg
          label={description}
          aspect={0.62}
          minHeight={220}
          maxHeight={360}
          margins={{ top: 16, right: 16, bottom: 44, left: 48 }}
        >
          {(box) => {
            const t = scaleLinear()
              .domain([0, steps - 1])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const all = [...state.a, ...state.b];
            const v = scaleLinear()
              .domain(paddedDomain(all))
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const path = (series: number[]) =>
              series.map((value, i) => `${i === 0 ? 'M' : 'L'} ${t(i)} ${v(value)}`).join(' ');
            return (
              <g>
                <Axis
                  scale={v}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="Nivel"
                />
                <Axis
                  scale={t}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={6}
                  label="Periodo"
                />
                <path
                  d={path(a)}
                  fill="none"
                  stroke={DATA_COLORS.primary}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <path
                  d={path(b)}
                  fill="none"
                  stroke={DATA_COLORS.secondary}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </g>
            );
          }}
        </ChartSvg>
        <PairPlot
          xDomain={paddedDomain(useDifferences ? differences(state.a) : state.a)}
          yDomain={paddedDomain(useDifferences ? differences(state.b) : state.b)}
          xLabel={useDifferences ? `Cambio de ${names.x}` : names.x}
          yLabel={useDifferences ? `Cambio de ${names.y}` : names.y}
          label={description}
          aspect={0.9}
        >
          {({ x, y }) => (
            <g aria-hidden="true">
              {sx.map((value, i) => (
                <circle
                  key={i}
                  cx={x(value)}
                  cy={y(sy[i] ?? 0)}
                  r={DOT_RADIUS}
                  fill={DATA_COLORS.text}
                  fillOpacity={0.6}
                />
              ))}
            </g>
          )}
        </PairPlot>
      </div>
    </VizFrame>
  );
}
