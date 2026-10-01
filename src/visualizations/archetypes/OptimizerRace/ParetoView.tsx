import { useMemo, useState } from 'react';
import { IDEAL_A, IDEAL_B, objectives, paretoFront, weightedOptimum } from '../../../lib/optimization/extras.ts';
import type { Point } from '../../../lib/optimization/index.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { EqualPlane } from '../../core/plane/EqualPlane.tsx';
import { num } from '../../core/plane/levels.ts';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './OptimizerRace.module.css';
import { item } from './shared.ts';

const CANDIDATES = 150;
const STEPS = 40;
const STEPS_PER_SECOND = 5;
const DECISION: [[number, number], [number, number]] = [
  [-1, 3],
  [-1.5, 2.5],
];
const OBJECTIVE_MAX = 8;
const DOT_RADIUS = 3;

/**
 * Two objectives in conflict: being close to A and being close to B. Random
 * candidate decisions are drawn in both spaces; those that no other candidate
 * improves in both objectives form the Pareto front. Minimizing a weighted
 * sum w f₁ + (1 - w) f₂ picks one point of the front for each weight.
 */
export function ParetoView({ title, seed: initialSeed, weight }: { title: string; seed: number; weight?: number }) {
  const seed = useSeed(initialSeed);
  const candidates = useMemo(() => {
    const random = new Random(seed.seed);
    return Array.from({ length: CANDIDATES }, (): Point => [random.uniform(DECISION[0][0], DECISION[0][1]), random.uniform(DECISION[1][0], DECISION[1][1])]);
  }, [seed.seed]);
  const values = useMemo(() => candidates.map(objectives), [candidates]);
  const front = useMemo(() => new Set(paretoFront(values)), [values]);
  const firstStep = weight === undefined ? 0 : Math.round(weight * STEPS);
  const [step, setStep] = useState(firstStep);
  const playback = usePlayback({
    step: () => setStep((value) => (value + 1) % (STEPS + 1)),
    reset: () => setStep(firstStep),
    rate: STEPS_PER_SECOND,
    // A figure that fixes a weight opens on it; the reader starts the sweep.
    autoplay: weight === undefined,
  });
  const w = step / STEPS;
  const chosen = weightedOptimum(w);
  const [f1, f2] = objectives(chosen);
  // The exact front: images of the segment from A to B.
  const frontCurve = (x: number) => {
    // f1 = s²|B - A|² and f2 = (1 - s)²|B - A|² along the segment, so √f2 = |B - A| - √f1.
    const length = Math.hypot(IDEAL_B[0] - IDEAL_A[0], IDEAL_B[1] - IDEAL_A[1]);
    const r = length - Math.sqrt(Math.max(0, x));
    return r >= 0 ? r * r : Number.NaN;
  };
  const frontCount = values.filter((v) => front.has(v)).length;
  const description =
    `Dos objetivos: distancia al cuadrado a A = (0, 0) y a B = (2, 1). De ${CANDIDATES} decisiones al azar, ${frontCount} no están dominadas. ` +
    `Con peso w = ${num(w, 2)} la suma ponderada se minimiza en (${num(chosen[0], 2)}, ${num(chosen[1], 2)}), con f₁ = ${num(f1, 3)} y f₂ = ${num(f2, 3)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      readouts={[
        { label: 'Peso w de f₁', value: num(w, 2) },
        { label: 'Decisión elegida', value: `(${num(chosen[0], 2)}, ${num(chosen[1], 2)})`, color: DATA_COLORS.highlight },
        { label: 'f₁ y f₂', value: `${num(f1, 3)} y ${num(f2, 3)}` },
        { label: 'Candidatos no dominados', value: `${frontCount} de ${CANDIDATES}`, color: DATA_COLORS.secondary },
      ]}
      legend={[
        { label: 'Candidato dominado', color: DATA_COLORS.muted, shape: 'circle' },
        { label: 'Candidato no dominado', color: DATA_COLORS.secondary, shape: 'circle' },
        { label: 'Frente de Pareto exacto', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Óptimo de la suma ponderada', color: DATA_COLORS.highlight, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine
        className={styles.formula}
        tex={`\\min\\ \\big(f_1(\\mathbf{x}), f_2(\\mathbf{x})\\big) = \\big(\\lVert \\mathbf{x} - \\mathbf{a} \\rVert^2,\\ \\lVert \\mathbf{x} - \\mathbf{b} \\rVert^2\\big),\\quad \\mathbf{a} = (0, 0),\\ \\mathbf{b} = (2, 1)`}
      />
      <FormulaLine
        className={styles.formula}
        tex={`w = ${num(w, 2)}:\\quad \\min\\ ${num(w, 2)}\\,f_1 + ${num(1 - w, 2)}\\,f_2\\ \\Rightarrow\\ \\mathbf{x} = (${num(chosen[0], 2)}, ${num(chosen[1], 2)}),\\ (f_1, f_2) = (${num(f1, 3)}, ${num(f2, 3)})`}
      />
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Espacio de decisiones</p>
          <EqualPlane domain={DECISION} label={`Decisiones candidatas. ${description}`}>
            {({ x, y }) => (
              <g aria-hidden="true">
                <line x1={x(IDEAL_A[0])} y1={y(IDEAL_A[1])} x2={x(IDEAL_B[0])} y2={y(IDEAL_B[1])} stroke={DATA_COLORS.tertiary} strokeWidth={3} />
                {candidates.map((p, i) => (
                  <circle key={i} cx={x(p[0])} cy={y(p[1])} r={DOT_RADIUS} fill={front.has(item(values, i)) ? DATA_COLORS.secondary : DATA_COLORS.muted} fillOpacity={front.has(item(values, i)) ? 1 : 0.5} />
                ))}
                <circle cx={x(chosen[0])} cy={y(chosen[1])} r={DOT_RADIUS + 3} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
              </g>
            )}
          </EqualPlane>
        </div>
        <div>
          <p className={styles.panelTitle}>Espacio de objetivos (f₁, f₂)</p>
          <FunctionPlot
            xDomain={[0, OBJECTIVE_MAX]}
            yDomain={[0, OBJECTIVE_MAX]}
            xLabel="f₁, distancia al cuadrado a A"
            label={`Objetivos de cada candidato. ${description}`}
            aspect={0.9}
            curves={[{ f: frontCurve, color: DATA_COLORS.tertiary, width: 3, to: 5 }]}
          >
            {(s) => (
              <g aria-hidden="true">
                {values.map((v, i) => (
                  <circle key={i} cx={s.x(Math.min(v[0], OBJECTIVE_MAX))} cy={s.y(Math.min(v[1], OBJECTIVE_MAX))} r={DOT_RADIUS} fill={front.has(v) ? DATA_COLORS.secondary : DATA_COLORS.muted} fillOpacity={front.has(v) ? 1 : 0.5} />
                ))}
                <circle cx={s.x(f1)} cy={s.y(f2)} r={DOT_RADIUS + 3} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
              </g>
            )}
          </FunctionPlot>
        </div>
      </div>
    </VizFrame>
  );
}
