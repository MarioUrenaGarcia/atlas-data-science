import { useMemo, useState } from 'react';
import { feasibleVertices, simplex, type LinearProgram } from '../../../lib/optimization/linear.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { EqualPlane } from '../../core/plane/EqualPlane.tsx';
import { num } from '../../core/plane/levels.ts';
import { Arrow } from '../../core/svg/Arrow.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './OptimizerRace.module.css';
import { item } from './shared.ts';

const SWEEP_STEPS = 40;
const SWEEP_PER_SECOND = 8;
const PIVOTS_PER_SECOND = 0.7;
const PAD = 0.15;
const DOT_RADIUS = 6;
const ARROW = 0.7;

interface LinearProgramViewProps {
  title: string;
  lp: LinearProgram;
  /** 'grafico' sweeps the objective line; 'simplex' walks from vertex to vertex. */
  method: 'grafico' | 'simplex';
  variables: [string, string];
}

const term = (coefficient: number, name: string, first: boolean) =>
  `${first ? (coefficient < 0 ? '-' : '') : coefficient < 0 ? ' - ' : ' + '}${Math.abs(coefficient) === 1 ? '' : num(Math.abs(coefficient), 2)}${name}`;

/** a₁x + a₂y written without the zero terms. */
function linear(a1: number, a2: number, [v1, v2]: [string, string]): string {
  if (a1 === 0) return term(a2, v2, true);
  if (a2 === 0) return term(a1, v1, true);
  return `${term(a1, v1, true)}${term(a2, v2, false)}`;
}

/**
 * A linear program in two variables. The feasible region is a polygon and
 * the level lines of the objective are parallel; the optimum is the last
 * vertex the line touches as it moves in the direction of c. The simplex
 * method reaches it by moving along edges from vertex to adjacent vertex.
 */
export function LinearProgramView({ title, lp, method, variables }: LinearProgramViewProps) {
  const vertices = useMemo(() => feasibleVertices(lp), [lp]);
  const result = useMemo(() => simplex(lp), [lp]);
  const optimum = item(result.steps, result.steps.length - 1);
  const total = method === 'grafico' ? SWEEP_STEPS : result.steps.length - 1;
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(total, value + 1)),
    reset: () => setStep(0),
    rate: method === 'grafico' ? SWEEP_PER_SECOND : PIVOTS_PER_SECOND,
    done: step >= total,
  });
  const [c1, c2] = [lp.c[0] ?? 0, lp.c[1] ?? 0];
  const maxX = Math.max(...vertices.map((v) => v[0]));
  const maxY = Math.max(...vertices.map((v) => v[1]));
  const extent = Math.max(maxX, maxY) * (1 + PAD);
  const domain: [[number, number], [number, number]] = [
    [-extent * PAD, extent],
    [-extent * PAD, extent],
  ];
  const [v1, v2] = variables;
  const objectiveTex = linear(c1, c2, variables);
  const constraintsTex = lp.a.map((row, i) => `${linear(row[0] ?? 0, row[1] ?? 0, variables)} \\le ${num(lp.b[i] ?? 0, 2)}`).join(',\\ ');
  const level = method === 'grafico' ? (optimum.value * step) / SWEEP_STEPS : (result.steps[step]?.value ?? 0);
  const current = method === 'simplex' ? (result.steps[step] ?? item(result.steps, 0)) : null;
  const description =
    method === 'grafico'
      ? `Programa lineal: maximizar ${objectiveTex.replace(/\\/g, '')} en una región de ${vertices.length} vértices. La recta de nivel z = ${num(level, 2)} avanza; el óptimo es z = ${num(optimum.value, 2)} en (${num(optimum.x[0] ?? 0, 2)}, ${num(optimum.x[1] ?? 0, 2)}).`
      : `Simplex, paso ${step}: vértice (${num(current?.x[0] ?? 0, 2)}, ${num(current?.x[1] ?? 0, 2)}) con z = ${num(current?.value ?? 0, 2)}${current?.entering ? `; entra ${current.entering} y sale ${current.leaving}` : ''}.`;

  // Points of the level line c·x = level, clipped later by the plot.
  const lineEnds = (): [number, number][] => {
    const [lo, hi] = domain[0];
    if (Math.abs(c2) > 1e-12) return [[lo, (level - c1 * lo) / c2], [hi, (level - c1 * hi) / c2]];
    return [[level / c1, lo], [level / c1, hi]];
  };
  const norm = Math.hypot(c1, c2) || 1;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        ...(method === 'simplex'
          ? [
              { label: 'Paso', value: `${step} de ${total}` },
              { label: 'Variables básicas', value: current?.basis.join(', ') ?? '' },
              { label: 'Entra / sale', value: current?.entering ? `${current.entering} / ${current.leaving}` : 'inicio' },
            ]
          : [{ label: 'Nivel z de la recta', value: num(level, 2) }]),
        { label: 'Valor del vértice óptimo', value: num(optimum.value, 2), color: DATA_COLORS.tertiary },
        { label: 'Precios sombra', value: result.duals.map((d) => num(d, 2)).join(', ') },
      ]}
      legend={[
        { label: 'Región factible', color: DATA_COLORS.primary },
        { label: 'Recta de nivel del objetivo', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Dirección c de mejora', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Vértice óptimo', color: DATA_COLORS.tertiary, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine className={styles.formula} tex={`\\max\\ z = ${objectiveTex}\\ \\text{ sujeto a }\\ ${constraintsTex},\\ ${v1}, ${v2} \\ge 0`} />
      <FormulaLine
        className={styles.formula}
        tex={
          method === 'grafico'
            ? `${objectiveTex} = ${num(level, 2)}${step >= total ? `\\ \\Rightarrow\\ \\text{óptimo en } (${num(optimum.x[0] ?? 0, 2)}, ${num(optimum.x[1] ?? 0, 2)})` : ''}`
            : `\\text{Paso ${step}}:\\ (${v1}, ${v2}) = (${num(current?.x[0] ?? 0, 2)}, ${num(current?.x[1] ?? 0, 2)}),\\ z = ${num(current?.value ?? 0, 2)}${current?.entering ? `,\\ \\text{entra } ${current.entering.replace(/(\d+)/, '_{$1}')},\\ \\text{sale } ${(current.leaving ?? '').replace(/(\d+)/, '_{$1}')}` : ',\\ \\text{vértice inicial}'}${step >= total ? '\\ \\Rightarrow\\ \\text{óptimo}' : ''}`
        }
      />
      <EqualPlane domain={domain} label={description} xLabel={v1} yLabel={v2}>
        {({ x, y, unit }) => {
          const ends = lineEnds();
          const path = method === 'simplex' ? result.steps.slice(0, step + 1) : [];
          return (
            <g aria-hidden="true">
              <polygon points={vertices.map((v) => `${x(v[0])},${y(v[1])}`).join(' ')} fill={DATA_COLORS.primary} fillOpacity={0.2} stroke={DATA_COLORS.primary} strokeWidth={2} />
              {vertices.map((v, i) => (
                <circle key={i} cx={x(v[0])} cy={y(v[1])} r={3} fill={DATA_COLORS.primary} />
              ))}
              <line x1={x(item(ends, 0)[0])} y1={y(item(ends, 0)[1])} x2={x(item(ends, 1)[0])} y2={y(item(ends, 1)[1])} stroke={DATA_COLORS.highlight} strokeWidth={2.5} />
              <Arrow x1={x(0)} y1={y(0)} x2={x(0) + (c1 / norm) * ARROW * unit} y2={y(0) - (c2 / norm) * ARROW * unit} color={DATA_COLORS.secondary} width={2.5} />
              {path.length > 1 && (
                <polyline points={path.map((s) => `${x(s.x[0] ?? 0)},${y(s.x[1] ?? 0)}`).join(' ')} fill="none" stroke={DATA_COLORS.text} strokeWidth={2.5} />
              )}
              {current && <circle cx={x(current.x[0] ?? 0)} cy={y(current.x[1] ?? 0)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />}
              {step >= total && (
                <circle cx={x(optimum.x[0] ?? 0)} cy={y(optimum.x[1] ?? 0)} r={DOT_RADIUS + 1} fill={DATA_COLORS.tertiary} stroke="var(--color-surface)" strokeWidth={2} />
              )}
            </g>
          );
        }}
      </EqualPlane>
    </VizFrame>
  );
}
