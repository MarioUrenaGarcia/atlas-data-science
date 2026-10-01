import { useMemo, useState } from 'react';
import type { Point } from '../../../lib/optimization/index.ts';
import { lineSearchTrials } from '../../../lib/optimization/paths.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { num } from '../../core/plane/levels.ts';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { FunctionMap } from './FunctionMap.tsx';
import styles from './OptimizerRace.module.css';
import { point, useFunctionChoice } from './shared.ts';

const STEPS_PER_SECOND = 1;
const DOT_RADIUS = 5;
const CURVATURE = 0.9;

interface LineSearchViewProps {
  title: string;
  ids: readonly string[];
  start: Point;
  alpha0: number;
  c1: number;
  rho: number;
}

/**
 * Backtracking line search along the steepest descent direction. The plot
 * shows φ(α) = f(x + α d) with the Armijo line φ(0) + c₁ α φ'(0); trial steps
 * are halved, one per frame, until a trial falls below that line.
 */
export function LineSearchView({ title, ids, start, alpha0, c1: initialC1, rho: initialRho }: LineSearchViewProps) {
  const extra = useMemo(
    () => [
      { type: 'number' as const, key: 'c1', label: 'Constante de Armijo', symbol: 'c₁', min: 0.0001, max: 0.9, step: 0.0001, default: initialC1, digits: 4 },
      { type: 'number' as const, key: 'rho', label: 'Factor de reducción', symbol: 'ρ', min: 0.1, max: 0.9, step: 0.05, default: initialRho, digits: 2 },
    ],
    [initialC1, initialRho],
  );
  const { parameters, values, fn, start: x } = useFunctionChoice(ids, start, extra);
  const c1 = Number(values.c1);
  const rho = Number(values.rho);
  const g = fn.gradient(x);
  const d: Point = [-g[0], -g[1]];
  const trials = useMemo(
    () => lineSearchTrials(fn, x, d, { alpha0, shrink: rho, c1, c2: CURVATURE }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fn, x[0], x[1], alpha0, rho, c1],
  );
  const [shown, setShown] = useState(1);
  const playback = usePlayback({
    step: () => setShown((value) => Math.min(trials.length, value + 1)),
    reset: () => setShown(1),
    rate: STEPS_PER_SECOND,
    done: shown >= trials.length,
  });
  const visible = trials.slice(0, Math.min(shown, trials.length));
  const current = visible[visible.length - 1];
  const f0 = fn.f(x);
  const slope = g[0] * d[0] + g[1] * d[1];
  const phi = (alpha: number) => fn.f([x[0] + alpha * d[0], x[1] + alpha * d[1]]);
  const bound = (alpha: number) => f0 + c1 * alpha * slope;
  const accepted = current?.armijo ?? false;
  const description =
    `${fn.label} en ${point(x)}, dirección -∇f = ${point(d, 3)}. Prueba ${visible.length}: α = ${num(current?.alpha ?? alpha0, 4)}, ` +
    `φ(α) = ${num(current?.value ?? f0, 4)} frente al límite de Armijo ${num(bound(current?.alpha ?? alpha0), 4)}: ${accepted ? 'se acepta' : 'se reduce α'}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Prueba', value: `${visible.length} de ${trials.length}` },
        { label: 'α actual', value: num(current?.alpha ?? alpha0, 4), color: DATA_COLORS.highlight },
        { label: 'φ(α)', value: num(current?.value ?? f0, 4) },
        { label: "φ(0) + c₁αφ'(0)", value: num(bound(current?.alpha ?? alpha0), 4), color: DATA_COLORS.secondary },
        { label: 'Armijo', value: accepted ? 'se cumple' : 'no se cumple' },
        { label: 'Wolfe (curvatura)', value: current?.wolfe ? 'se cumple' : 'no se cumple' },
      ]}
      legend={[
        { label: 'φ(α) = f(x + αd)', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Recta de Armijo', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Prueba rechazada', color: DATA_COLORS.muted, shape: 'circle' },
        { label: 'Prueba aceptada', color: DATA_COLORS.tertiary, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine
        className={styles.formula}
        tex={`\\varphi(\\alpha) = f(\\mathbf{x} + \\alpha\\mathbf{d}),\\quad \\mathbf{d} = -\\nabla f(\\mathbf{x}) = ${`\\begin{pmatrix} ${num(d[0], 3)} \\\\ ${num(d[1], 3)} \\end{pmatrix}`},\\quad \\varphi'(0) = -\\lVert \\nabla f \\rVert^2 = ${num(slope, 3)}`}
      />
      <FormulaLine
        className={styles.formula}
        tex={`\\alpha = ${num(current?.alpha ?? alpha0, 4)}:\\quad \\varphi(\\alpha) = ${num(current?.value ?? f0, 4)}\\ ${accepted ? '\\le' : '>'}\\ ${num(f0, 4)} + ${num(c1, 4)}\\cdot${num(current?.alpha ?? alpha0, 4)}\\cdot(${num(slope, 3)}) = ${num(bound(current?.alpha ?? alpha0), 4)}`}
      />
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>La dirección de búsqueda y las pruebas</p>
          <FunctionMap fn={fn} label={description}>
            {({ x: sx, y: sy }) => (
              <g aria-hidden="true">
                <line x1={sx(x[0])} y1={sy(x[1])} x2={sx(x[0] + alpha0 * d[0])} y2={sy(x[1] + alpha0 * d[1])} stroke={DATA_COLORS.text} strokeDasharray="4 4" />
                {visible.map((t, i) => (
                  <circle
                    key={i}
                    cx={sx(x[0] + t.alpha * d[0])}
                    cy={sy(x[1] + t.alpha * d[1])}
                    r={DOT_RADIUS - 1}
                    fill={t.armijo ? DATA_COLORS.tertiary : DATA_COLORS.muted}
                  />
                ))}
                <circle cx={sx(x[0])} cy={sy(x[1])} r={DOT_RADIUS} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
              </g>
            )}
          </FunctionMap>
        </div>
        <div>
          <p className={styles.panelTitle}>φ(α) y la condición de Armijo</p>
          <FunctionPlot
            xDomain={[0, alpha0 * 1.05]}
            xLabel="α, longitud del paso"
            label={`Función a lo largo de la dirección. ${description}`}
            aspect={0.8}
            curves={[
              { f: phi, color: DATA_COLORS.primary, width: 3 },
              { f: bound, color: DATA_COLORS.secondary, width: 2, dashed: true },
            ]}
          >
            {(s) => (
              <g aria-hidden="true">
                {visible.map((t, i) => (
                  <g key={i}>
                    <line x1={s.x(t.alpha)} x2={s.x(t.alpha)} y1={s.y(t.value)} y2={s.y(bound(t.alpha))} stroke={DATA_COLORS.text} strokeDasharray="2 3" />
                    <circle cx={s.x(t.alpha)} cy={s.y(t.value)} r={DOT_RADIUS} fill={t.armijo ? DATA_COLORS.tertiary : DATA_COLORS.muted} />
                  </g>
                ))}
              </g>
            )}
          </FunctionPlot>
        </div>
      </div>
    </VizFrame>
  );
}
