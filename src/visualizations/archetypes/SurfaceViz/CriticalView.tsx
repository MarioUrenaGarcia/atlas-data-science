import { useMemo, useState } from 'react';
import { criticalPoints, eigenSym2, type CriticalKind } from '../../../lib/multivariable/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { ContourMap } from './ContourMap.tsx';
import { fieldRange, num } from './levels.ts';
import { SurfacePanel } from './SurfacePanel.tsx';
import styles from './SurfaceViz.module.css';
import { fieldName, useFieldChoice } from './useFieldChoice.ts';

const STEPS_PER_SECOND = 0.6;
const DOT_RADIUS = 6;
const RING = 11;
const KIND_COLORS: Record<CriticalKind, string> = {
  mínimo: DATA_COLORS.tertiary,
  máximo: DATA_COLORS.secondary,
  silla: DATA_COLORS.highlight,
  degenerado: DATA_COLORS.muted,
};
const KIND_TEXT: Record<CriticalKind, string> = {
  mínimo: 'mínimo local: los dos valores propios son positivos',
  máximo: 'máximo local: los dos valores propios son negativos',
  silla: 'punto silla: un valor propio positivo y otro negativo',
  degenerado: 'caso degenerado: un valor propio es cero y la prueba no decide',
};

interface CriticalViewProps {
  title: string;
  ids: readonly string[];
}

/**
 * Critical points, where the gradient vanishes, found numerically and visited
 * one by one. Each is classified by the signs of the eigenvalues of the
 * Hessian there: both positive, a minimum; both negative, a maximum; mixed
 * signs, a saddle.
 */
export function CriticalView({ title, ids }: CriticalViewProps) {
  const { parameters, values, field } = useFieldChoice(ids, null);
  const range = useMemo(() => fieldRange(field.f, field.domain), [field]);
  const points = useMemo(() => criticalPoints(field), [field]);
  const [visit, setVisit] = useState(0);
  const playback = usePlayback({
    step: () => setVisit((value) => (value + 1) % Math.max(1, points.length)),
    reset: () => setVisit(0),
    rate: STEPS_PER_SECOND,
  });
  const current = points[visit % Math.max(1, points.length)];
  const counts = points.reduce<Record<string, number>>((total, { kind }) => ({ ...total, [kind]: (total[kind] ?? 0) + 1 }), {});
  const h = current ? field.hess(current.point[0], current.point[1]) : null;
  const eigen = h ? eigenSym2(h).values : null;
  const det = h ? h[0][0] * h[1][1] - h[0][1] * h[1][0] : 0;
  const description = current
    ? `${fieldName(field.id)} tiene ${points.length} puntos críticos en la ventana. El punto (${num(current.point[0], 3)}, ${num(current.point[1], 3)}) es un ${KIND_TEXT[current.kind]}.`
    : `${fieldName(field.id)} no tiene puntos críticos en la ventana: el gradiente nunca se anula.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Puntos críticos', value: String(points.length) },
        { label: 'Mínimos', value: String(counts.mínimo ?? 0), color: KIND_COLORS.mínimo },
        { label: 'Máximos', value: String(counts.máximo ?? 0), color: KIND_COLORS.máximo },
        { label: 'Sillas', value: String(counts.silla ?? 0), color: KIND_COLORS.silla },
        { label: 'Punto actual', value: current ? `(${num(current.point[0], 3)}, ${num(current.point[1], 3)})` : 'ninguno' },
        { label: 'Clasificación', value: current ? current.kind : 'sin puntos' },
      ]}
      legend={[
        { label: 'Mínimo', color: KIND_COLORS.mínimo, shape: 'circle' },
        { label: 'Máximo', color: KIND_COLORS.máximo, shape: 'circle' },
        { label: 'Silla', color: KIND_COLORS.silla, shape: 'circle' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`f(x, y) = ${field.latex},\\qquad \\nabla f = \\mathbf{0}`} />
      </p>
      <p className={styles.formula}>
        {current && h && eigen ? (
          <Latex
            tex={`\\mathbf{H}(${num(current.point[0], 2)}, ${num(current.point[1], 2)}) = \\begin{pmatrix} ${num(h[0][0], 3)} & ${num(h[0][1], 3)} \\\\ ${num(h[1][0], 3)} & ${num(h[1][1], 3)} \\end{pmatrix},\\quad \\lambda_1 = ${num(eigen[0], 3)},\\ \\lambda_2 = ${num(eigen[1], 3)},\\quad \\det \\mathbf{H} = ${num(det, 3)}\\ \\Rightarrow\\ \\text{${current.kind}}`}
          />
        ) : (
          <Latex tex={'\\nabla f \\neq \\mathbf{0}\\ \\text{en toda la ventana}'} />
        )}
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Puntos críticos sobre las curvas de nivel</p>
          <ContourMap f={field.f} domain={field.domain} range={range} highlight={current ? field.f(...current.point) : null} label={description}>
            {({ x, y }) => (
              <g aria-hidden="true">
                {points.map(({ point, kind }, index) => (
                  <g key={index}>
                    <circle cx={x(point[0])} cy={y(point[1])} r={DOT_RADIUS} fill={KIND_COLORS[kind]} stroke="var(--color-surface)" strokeWidth={2} />
                    {index === visit % points.length && <circle cx={x(point[0])} cy={y(point[1])} r={RING} fill="none" stroke={DATA_COLORS.text} strokeWidth={2} />}
                  </g>
                ))}
              </g>
            )}
          </ContourMap>
        </div>
        <div>
          <p className={styles.panelTitle}>Los mismos puntos sobre la superficie</p>
          <SurfacePanel f={field.f} domain={field.domain} range={range} label={`Superficie con sus puntos críticos. ${description}`}>
            {({ screen, at }) =>
              points.map(({ point, kind }, index) => {
                const p = screen.at(at(point[0], point[1], field.f(point[0], point[1])));
                return (
                  <g key={index} aria-hidden="true">
                    <circle cx={p.x} cy={p.y} r={DOT_RADIUS} fill={KIND_COLORS[kind]} stroke="var(--color-surface)" strokeWidth={2} />
                    {index === visit % points.length && <circle cx={p.x} cy={p.y} r={RING} fill="none" stroke={DATA_COLORS.text} strokeWidth={2} />}
                  </g>
                );
              })
            }
          </SurfacePanel>
        </div>
      </div>
    </VizFrame>
  );
}
