import { useMemo, useState } from 'react';
import {
  geneticAlgorithm,
  nelderMead,
  particleSwarm,
  simulatedAnnealing,
} from '../../../lib/optimization/global.ts';
import type { Point } from '../../../lib/optimization/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { formatNumber } from '../../../lib/format/number.ts';
import { num } from '../../core/plane/levels.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { FunctionMap } from './FunctionMap.tsx';
import { item, point, useFunctionChoice } from './shared.ts';

export type PopulationMethod = 'nelder-mead' | 'recocido' | 'genetico' | 'enjambre';

const SETTINGS: Record<PopulationMethod, { iterations: number; rate: number; name: string }> = {
  'nelder-mead': { iterations: 40, rate: 2, name: 'Nelder-Mead' },
  recocido: { iterations: 300, rate: 20, name: 'Recocido simulado' },
  genetico: { iterations: 40, rate: 2, name: 'Algoritmo genético' },
  enjambre: { iterations: 60, rate: 3, name: 'Enjambre de partículas' },
};
const DOT_RADIUS = 4;
const DEFAULT_COOLING = 0.98;
const DEFAULT_MUTATION = 0.04;
const DEFAULT_INERTIA = 0.7;
/** Side of the initial Nelder-Mead triangle, as a fraction of the window width. */
const TRIANGLE = 0.08;
/** Below this size temperatures and probabilities switch to scientific notation instead of reading as 0. */
const TINY = 0.001;

const tiny = (v: number) => v !== 0 && Math.abs(v) < TINY;
const texSmall = (v: number) => {
  if (!tiny(v)) return num(v, 3);
  const [mantissa = '0', exponent = '0'] = v.toExponential(1).split('e');
  return `${mantissa} \\times 10^{${Number(exponent)}}`;
};
const textSmall = (v: number) => (tiny(v) ? formatNumber(v, 2) : num(v, 3));

interface PopulationViewProps {
  title: string;
  ids: readonly string[];
  method: PopulationMethod;
  start: Point;
  seed: number;
  options: { triangle?: [Point, Point, Point]; cooling?: number; mutation?: number; inertia?: number };
}

/**
 * Searches that do not use derivatives. Nelder-Mead moves a triangle by
 * reflections, expansions and contractions; simulated annealing walks at
 * random accepting some uphill moves while it is hot; a genetic algorithm
 * breeds a population; a particle swarm pulls particles toward the best
 * places found so far.
 */
export function PopulationView({ title, ids, method, start, seed: initialSeed, options }: PopulationViewProps) {
  // A fixed initial triangle makes the start point irrelevant, so its controls are hidden.
  const usesStart = (method === 'nelder-mead' && !options.triangle) || method === 'recocido';
  const { parameters, values, fn, start: x0 } = useFunctionChoice(ids, usesStart ? start : null);
  const seed = useSeed(initialSeed);
  const settings = SETTINGS[method];
  const box = fn.domain;
  const width = box.x[1] - box.x[0];
  const run = useMemo(() => {
    switch (method) {
      case 'nelder-mead': {
        const side = TRIANGLE * width;
        const triangle: [Point, Point, Point] = options.triangle ?? [x0, [x0[0] + side, x0[1]], [x0[0], x0[1] + side]];
        return { kind: method, steps: nelderMead(fn.f, triangle, settings.iterations) } as const;
      }
      case 'recocido':
        return { kind: method, steps: simulatedAnnealing(fn.f, box, x0, { iterations: settings.iterations, seed: seed.seed, step: 0.08 * width, cooling: options.cooling ?? DEFAULT_COOLING }) } as const;
      case 'genetico':
        return { kind: method, steps: geneticAlgorithm(fn.f, box, { generations: settings.iterations, seed: seed.seed, mutation: (options.mutation ?? DEFAULT_MUTATION) * width }) } as const;
      case 'enjambre':
        return { kind: method, steps: particleSwarm(fn.f, box, { iterations: settings.iterations, seed: seed.seed, w: options.inertia ?? DEFAULT_INERTIA }) } as const;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, fn, x0[0], x0[1], seed.seed, width, box, settings.iterations, options.triangle, options.cooling, options.mutation, options.inertia]);
  const total = run.steps.length - 1;
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(total, value + 1)),
    reset: () => setStep(0),
    rate: settings.rate,
    done: step >= total,
  });
  const k = Math.min(step, total);

  let header: string;
  let best: Point;
  let extraReadouts: { label: string; value: string }[];
  let description: string;
  if (run.kind === 'nelder-mead') {
    const s = run.steps[k] ?? item(run.steps, 0);
    best = s.simplex[0];
    header = `\\text{Iteración ${k}: ${s.move}},\\quad f(\\text{mejor}) = ${num(fn.f(s.simplex[0]), 4)},\\quad f(\\text{peor}) = ${num(fn.f(s.simplex[2]), 4)}`;
    extraReadouts = [{ label: 'Movimiento', value: s.move }];
    description = `Nelder-Mead sobre ${fn.label}, iteración ${k}: ${s.move}. Mejor vértice ${point(best)} con f = ${num(fn.f(best), 4)}.`;
  } else if (run.kind === 'recocido') {
    const s = run.steps[k] ?? item(run.steps, 0);
    best = s.best;
    const delta = fn.f(s.candidate) - fn.f(run.steps[Math.max(0, k - 1)]?.current ?? s.current);
    header = `T = ${texSmall(s.temperature)},\\quad \\Delta = ${num(delta, 3)},\\quad P(\\text{aceptar}) = ${delta <= 0 ? '1' : `e^{-\\Delta/T} = ${texSmall(s.probability)}`}\\ \\Rightarrow\\ \\text{${s.accepted ? 'se acepta' : 'se rechaza'}}`;
    extraReadouts = [
      { label: 'Temperatura T', value: textSmall(s.temperature) },
      { label: 'Probabilidad de aceptar', value: textSmall(s.probability) },
      { label: 'Punto actual', value: point(s.current) },
    ];
    description = `Recocido simulado sobre ${fn.label}, iteración ${k}, temperatura ${textSmall(s.temperature)}. Mejor punto ${point(best)} con f = ${num(fn.f(best), 4)}.`;
  } else if (run.kind === 'genetico') {
    const s = run.steps[k] ?? item(run.steps, 0);
    best = s.best;
    const mean = s.population.reduce((sum, p) => sum + fn.f(p), 0) / s.population.length;
    header = `\\text{Generación ${k}}:\\quad \\min f = ${num(fn.f(s.best), 4)},\\quad \\text{promedio de } f = ${num(mean, 3)}`;
    extraReadouts = [{ label: 'f promedio de la población', value: num(mean, 3) }];
    description = `Algoritmo genético sobre ${fn.label}, generación ${k}. Mejor individuo ${point(best)} con f = ${num(fn.f(best), 4)}; f promedio ${num(mean, 3)}.`;
  } else {
    const s = run.steps[k] ?? item(run.steps, 0);
    best = s.global;
    const spread = Math.sqrt(s.positions.reduce((sum, p) => sum + (p[0] - s.global[0]) ** 2 + (p[1] - s.global[1]) ** 2, 0) / s.positions.length);
    header = `\\text{Iteración ${k}}:\\quad \\mathbf{g} = (${num(s.global[0], 3)}, ${num(s.global[1], 3)}),\\quad f(\\mathbf{g}) = ${num(fn.f(s.global), 4)},\\quad \\text{dispersión} = ${num(spread, 3)}`;
    extraReadouts = [{ label: 'Dispersión del enjambre', value: num(spread, 3) }];
    description = `Enjambre de partículas sobre ${fn.label}, iteración ${k}. Mejor posición global ${point(best)} con f = ${num(fn.f(best), 4)}.`;
  }

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={method === 'nelder-mead' ? undefined : seed}
      parameters={ids.length > 1 || usesStart ? { ...parameters, values: values as Record<string, unknown> } : undefined}
      readouts={[
        { label: 'Iteración', value: `${k} de ${total}` },
        { label: 'Mejor punto', value: point(best), color: DATA_COLORS.highlight },
        { label: 'f del mejor punto', value: num(fn.f(best), 4) },
        ...extraReadouts,
      ]}
      legend={[
        { label: run.kind === 'nelder-mead' ? 'Triángulo de Nelder-Mead' : run.kind === 'recocido' ? 'Recorrido aceptado' : 'Individuos o partículas', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Mejor punto encontrado', color: DATA_COLORS.highlight, shape: 'circle' },
        { label: 'Mínimo global', color: DATA_COLORS.text, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine tex={`\\text{${settings.name}}:\\quad ${header}`} />
      <FunctionMap fn={fn} label={description}>
        {({ x, y }) => (
          <g aria-hidden="true">
            {fn.minima.map((m, i) => (
              <circle key={`m${i}`} cx={x(m[0])} cy={y(m[1])} r={DOT_RADIUS + 1} fill="none" stroke="var(--color-text)" strokeWidth={2} />
            ))}
            {run.kind === 'nelder-mead' &&
              run.steps.slice(0, k + 1).map((s, i) => (
                <polygon
                  key={i}
                  points={s.simplex.map((p) => `${x(p[0])},${y(p[1])}`).join(' ')}
                  fill={i === k ? DATA_COLORS.primary : 'none'}
                  fillOpacity={0.3}
                  stroke={DATA_COLORS.primary}
                  strokeOpacity={i === k ? 1 : 0.25}
                  strokeWidth={i === k ? 2 : 1}
                />
              ))}
            {run.kind === 'recocido' && (
              <>
                <polyline
                  points={run.steps.slice(0, k + 1).map((s) => `${x(s.current[0])},${y(s.current[1])}`).join(' ')}
                  fill="none"
                  stroke={DATA_COLORS.primary}
                  strokeOpacity={0.6}
                  strokeWidth={1.5}
                />
                {run.steps[k] && (
                  <circle
                    cx={x(item(run.steps, k).candidate[0])}
                    cy={y(item(run.steps, k).candidate[1])}
                    r={DOT_RADIUS}
                    fill={item(run.steps, k).accepted ? DATA_COLORS.tertiary : DATA_COLORS.secondary}
                  />
                )}
              </>
            )}
            {run.kind === 'genetico' &&
              (run.steps[k]?.population ?? []).map((p, i) => (
                <circle key={i} cx={x(p[0])} cy={y(p[1])} r={DOT_RADIUS - 1} fill={DATA_COLORS.primary} fillOpacity={0.8} />
              ))}
            {run.kind === 'enjambre' &&
              (run.steps[k]?.positions ?? []).map((p, i) => {
                const v = run.steps[k]?.velocities[i] ?? [0, 0];
                return (
                  <g key={i}>
                    <line x1={x(p[0])} y1={y(p[1])} x2={x(p[0] - v[0])} y2={y(p[1] - v[1])} stroke={DATA_COLORS.primary} strokeOpacity={0.5} />
                    <circle cx={x(p[0])} cy={y(p[1])} r={DOT_RADIUS - 1} fill={DATA_COLORS.primary} />
                  </g>
                );
              })}
            <circle cx={x(best[0])} cy={y(best[1])} r={DOT_RADIUS + 1} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
          </g>
        )}
      </FunctionMap>
    </VizFrame>
  );
}
