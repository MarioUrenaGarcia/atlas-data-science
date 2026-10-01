import { useMemo, useState } from 'react';
import { PLANE_SETS, segmentTrials, type PlaneSet } from '../../../lib/optimization/extras.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { EqualPlane } from '../../core/plane/EqualPlane.tsx';
import { num } from '../../core/plane/levels.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './OptimizerRace.module.css';

const TRIALS = 25;
const STEPS_PER_SECOND = 1.5;
const GRID = 60;
const LIMIT = 2;
const PLANE: [[number, number], [number, number]] = [
  [-LIMIT, LIMIT],
  [-LIMIT, LIMIT],
];
const DOT_RADIUS = 4;

interface ConvexSetViewProps {
  title: string;
  sets: readonly string[];
  seed: number;
}

/**
 * Convexity tested with segments. Pairs of points of the set are drawn at
 * random and joined: in a convex set every segment stays inside; in a
 * non-convex one some segment leaves it, and the first point outside is a
 * witness that the set is not convex.
 */
export function ConvexSetView({ title, sets, seed: initialSeed }: ConvexSetViewProps) {
  const definitions = useMemo(
    () =>
      sets.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'conjunto',
              label: 'Conjunto',
              options: sets.map((id) => ({ value: id, label: PLANE_SETS[id]?.name ?? id })),
              default: sets[0] ?? 'disco',
            },
          ]
        : [],
    [sets],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const set = PLANE_SETS[sets.length > 1 ? String(values.conjunto) : (sets[0] ?? 'disco')] ?? (PLANE_SETS.disco as PlaneSet);
  const seed = useSeed(initialSeed);
  const trials = useMemo(() => segmentTrials(set, TRIALS, seed.seed), [set, seed.seed]);
  const cells = useMemo(() => {
    const list: [number, number][] = [];
    for (let i = 0; i < GRID; i += 1) {
      for (let j = 0; j < GRID; j += 1) {
        const p: [number, number] = [-LIMIT + ((i + 0.5) * 2 * LIMIT) / GRID, -LIMIT + ((j + 0.5) * 2 * LIMIT) / GRID];
        if (set.inside(p)) list.push(p);
      }
    }
    return list;
  }, [set]);
  const [step, setStep] = useState(1);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(TRIALS, value + 1)),
    reset: () => setStep(1),
    rate: STEPS_PER_SECOND,
    done: step >= TRIALS,
  });
  const shown = trials.slice(0, step);
  const failures = shown.filter((t) => t.exit !== null);
  const current = shown[shown.length - 1];
  const verdict = failures.length > 0 ? 'no es convexo' : step >= TRIALS ? 'ningún segmento sale' : 'sin contraejemplo hasta ahora';
  const description =
    `${set.name}. Se han unido ${shown.length} pares de puntos del conjunto; ${failures.length} segmentos salen de él. ` +
    (failures.length > 0 ? 'El conjunto no es convexo.' : 'Ningún segmento ha salido.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={definitions.length > 0 ? { ...parameters, values } : undefined}
      readouts={[
        { label: 'Segmentos probados', value: `${shown.length} de ${TRIALS}` },
        { label: 'Segmentos que salen', value: String(failures.length), color: DATA_COLORS.secondary },
        { label: 'Veredicto', value: verdict },
      ]}
      legend={[
        { label: 'Conjunto', color: DATA_COLORS.primary },
        { label: 'Segmento dentro del conjunto', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Segmento que sale', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine
        className={styles.formula}
        tex={`\\mathbf{x}, \\mathbf{y} \\in C,\\ \\lambda \\in [0, 1]\\ \\Rightarrow\\ \\lambda\\mathbf{x} + (1 - \\lambda)\\mathbf{y} \\in C`}
      />
      <FormulaLine
        className={styles.formula}
        tex={
          current
            ? current.exit
              ? `\\text{Par ${shown.length}: el segmento sale de } C \\text{ en } (${num(current.exit[0], 2)}, ${num(current.exit[1], 2)})`
              : `\\text{Par ${shown.length}: el segmento de } (${num(current.p[0], 2)}, ${num(current.p[1], 2)}) \\text{ a } (${num(current.q[0], 2)}, ${num(current.q[1], 2)}) \\text{ queda dentro}`
            : '\\text{Sin pares todavía}'
        }
      />
      <EqualPlane domain={PLANE} label={description}>
        {({ x, y, unit }) => {
          const cell = ((2 * LIMIT) / GRID) * unit;
          return (
            <g aria-hidden="true">
              {cells.map(([cx, cy], i) => (
                <rect key={i} x={x(cx) - cell / 2} y={y(cy) - cell / 2} width={cell + 0.6} height={cell + 0.6} fill={DATA_COLORS.primary} fillOpacity={0.25} />
              ))}
              {shown.map((t, i) => (
                <g key={i} opacity={i === shown.length - 1 ? 1 : 0.45}>
                  <line x1={x(t.p[0])} y1={y(t.p[1])} x2={x(t.q[0])} y2={y(t.q[1])} stroke={t.exit ? DATA_COLORS.secondary : DATA_COLORS.tertiary} strokeWidth={i === shown.length - 1 ? 2.5 : 1.5} />
                  <circle cx={x(t.p[0])} cy={y(t.p[1])} r={DOT_RADIUS - 1} fill={DATA_COLORS.text} />
                  <circle cx={x(t.q[0])} cy={y(t.q[1])} r={DOT_RADIUS - 1} fill={DATA_COLORS.text} />
                  {t.exit && <circle cx={x(t.exit[0])} cy={y(t.exit[1])} r={DOT_RADIUS + 1} fill="none" stroke={DATA_COLORS.secondary} strokeWidth={2} />}
                </g>
              ))}
            </g>
          );
        }}
      </EqualPlane>
    </VizFrame>
  );
}
