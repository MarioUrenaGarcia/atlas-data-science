import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import {
  DATASAURUS_TARGETS,
  DEFAULT_MORPH,
  type DatasaurusTarget,
  fittedSegments,
  meanDistance,
  type MorphState,
  morphSteps,
  pairSummary,
  pointsOnShape,
  startMorph,
} from '../../../lib/stats/datasaurus.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import type { DatasaurusDozenConfig } from './schema.ts';

const DEFAULT_POINTS = 142;
const ITERATIONS_PER_STEP = 3000;
const STEPS_PER_SECOND = 10;
const DOT = 3.5;
const DOMAIN_SDS = 2.6;
const JITTER = 1;

const TARGET_NAMES: Record<DatasaurusTarget, string> = {
  dinosaurio: 'Dinosaurio',
  circulo: 'Círculo',
  diana: 'Diana (dos círculos)',
  estrella: 'Estrella',
  equis: 'Equis',
  'lineas-horizontales': 'Líneas horizontales',
  'lineas-verticales': 'Líneas verticales',
  cumulos: 'Nueve cúmulos',
  nube: 'Nube libre',
};

interface Simulation {
  morph: MorphState;
  /** Shape currently pursued. */
  target: DatasaurusTarget;
  /** Value of the shape selector that the simulation has already taken into account. */
  requested: DatasaurusTarget;
}

function clone(state: MorphState): MorphState {
  return {
    points: state.points.map(([x, y]) => [x, y]),
    iteration: state.iteration,
    key: state.key,
    distances: [...state.distances],
    segments: state.segments,
  };
}

/**
 * The Datasaurus dozen: a cloud of points is pushed, by simulated annealing,
 * toward a chosen shape while its means, standard deviations and correlation
 * stay identical to two decimals. Very different pictures share one summary.
 */
export default function DatasaurusDozen({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as DatasaurusDozenConfig;
  const start = config.inicio ?? 'dinosaurio';
  const n = config.puntos ?? DEFAULT_POINTS;
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select',
        key: 'forma',
        label: 'Forma objetivo',
        options: DATASAURUS_TARGETS.map((value) => ({ value, label: TARGET_NAMES[value] })),
        default: config.forma ?? 'circulo',
      },
      {
        type: 'toggle',
        key: 'recorrido',
        label: 'Recorrer todas las formas',
        default: config.recorrido ?? false,
      },
      {
        type: 'toggle',
        key: 'mostrarForma',
        label: 'Mostrar la forma objetivo',
        default: config.mostrarForma ?? true,
      },
    ],
    [config.forma, config.recorrido, config.mostrarForma],
  );
  const parameters = useParameters(definitions);
  const requested = String(parameters.values.forma) as DatasaurusTarget;
  const tour = Boolean(parameters.values.recorrido);
  const showShape = Boolean(parameters.values.mostrarForma);
  const reducedMotion = useReducedMotion();
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const initial = useMemo(() => pointsOnShape(start, n, seed.seed, JITTER), [start, n, seed.seed]);
  const summary0 = useMemo(() => pairSummary(initial), [initial]);
  const [sim, update] = useResettableState<Simulation>(`${seed.seed}|${run}|${start}|${n}`, () => {
    const morph = startMorph(initial);
    if (reducedMotion) {
      morphSteps(
        morph,
        fittedSegments(requested, summary0),
        DEFAULT_MORPH.horizon,
        new Random(seed.seed),
      );
    }
    return { morph, target: requested, requested };
  });

  const advance = (count: number) =>
    update((previous) => {
      let { target } = previous;
      const morph = clone(previous.morph);
      if (requested !== previous.requested) {
        target = requested;
        morph.iteration = 0;
      } else if (tour && morph.iteration >= DEFAULT_MORPH.horizon) {
        const next = (DATASAURUS_TARGETS.indexOf(target) + 1) % DATASAURUS_TARGETS.length;
        target = DATASAURUS_TARGETS[next] ?? target;
        morph.iteration = 0;
      }
      // Seeding from the iteration count keeps the updater pure and the run reproducible.
      const random = new Random(seed.seed * 7919 + morph.iteration + run * 104729);
      morphSteps(morph, fittedSegments(target, summary0), count * ITERATIONS_PER_STEP, random);
      return { morph, target, requested };
    });

  const finished =
    !tour && requested === sim.requested && sim.morph.iteration >= DEFAULT_MORPH.horizon;
  const playback = usePlayback({
    step: () => advance(1),
    stepMany: advance,
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: finished,
  });

  const target = requested !== sim.requested ? requested : sim.target;
  const segments = useMemo(() => fittedSegments(target, summary0), [target, summary0]);
  const s = pairSummary(sim.morph.points);
  const distance = meanDistance(sim.morph.points, segments);
  const f = (v: number) => formatNumber(v, 2);
  const header = `\\bar{x} = ${f(s.meanX)},\\ \\bar{y} = ${f(s.meanY)},\\ s_x = ${f(s.sdX)},\\ s_y = ${f(s.sdY)},\\ r = ${f(s.correlation)}`;
  const progress = Math.min(1, sim.morph.iteration / DEFAULT_MORPH.horizon);
  const description =
    `${n} puntos que parten de la forma ${TARGET_NAMES[start].toLowerCase()} y se mueven hacia ${TARGET_NAMES[target].toLowerCase()}. ` +
    `Avance del recocido ${formatNumber(100 * progress, 0)} %, distancia media a la forma ${formatNumber(distance, 2)}. ` +
    `Medias ${f(s.meanX)} y ${f(s.meanY)}, desviaciones ${f(s.sdX)} y ${f(s.sdY)}, correlación ${f(s.correlation)}: iguales a las del inicio con dos decimales.`;
  const xDomain: [number, number] = [
    summary0.meanX - DOMAIN_SDS * summary0.sdX,
    summary0.meanX + DOMAIN_SDS * summary0.sdX,
  ];
  const yDomain: [number, number] = [
    summary0.meanY - DOMAIN_SDS * summary0.sdY * 0.85,
    summary0.meanY + DOMAIN_SDS * summary0.sdY * 0.85,
  ];

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Forma objetivo', value: TARGET_NAMES[target] },
        { label: 'Media de x', value: f(s.meanX) },
        { label: 'Media de y', value: f(s.meanY) },
        { label: 'Desviación de x', value: f(s.sdX) },
        { label: 'Desviación de y', value: f(s.sdY) },
        { label: 'Correlación r', value: f(s.correlation) },
        { label: 'Avance del recocido', value: `${formatNumber(100 * progress, 0)} %` },
        {
          label: 'Distancia media a la forma',
          value: formatNumber(distance, 2),
          color: DATA_COLORS.secondary,
        },
      ]}
      legend={[
        { label: 'Observación', color: DATA_COLORS.primary, shape: 'circle' },
        ...(showShape
          ? [{ label: 'Forma objetivo', color: DATA_COLORS.secondary, shape: 'line' as const }]
          : []),
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.8}
        minHeight={300}
        maxHeight={480}
        margins={{ top: 12, right: 16, bottom: 44, left: 48 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain(xDomain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain(yDomain)
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={6}
                label="y"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={7}
                label="x"
              />
              <g aria-hidden="true">
                {showShape &&
                  segments.map(([a, b, c, d], i) =>
                    a === c && b === d ? (
                      <circle
                        key={i}
                        cx={x(a)}
                        cy={y(b)}
                        r={7}
                        fill="none"
                        stroke={DATA_COLORS.secondary}
                        strokeOpacity={0.6}
                        strokeWidth={1.5}
                      />
                    ) : (
                      <line
                        key={i}
                        x1={x(a)}
                        y1={y(b)}
                        x2={x(c)}
                        y2={y(d)}
                        stroke={DATA_COLORS.secondary}
                        strokeOpacity={0.45}
                        strokeWidth={2}
                      />
                    ),
                  )}
                {sim.morph.points.map(([px, py], i) => (
                  <circle
                    key={i}
                    cx={x(px)}
                    cy={y(py)}
                    r={DOT}
                    fill={DATA_COLORS.primary}
                    fillOpacity={0.85}
                  />
                ))}
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
