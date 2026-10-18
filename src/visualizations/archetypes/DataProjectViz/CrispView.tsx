import { useId, useState, type KeyboardEvent } from 'react';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import {
  CRISP_CASES,
  PHASE_NAMES,
  PHASE_TASKS,
  PHASES,
  RETURN_EDGES,
  type Phase,
} from './crispCases.ts';
import styles from './DataProjectViz.module.css';
import type { CrispCaseId } from './schema.ts';

const STEPS_PER_SECOND = 0.7;
const NODE_HEIGHT = 40;
const MAX_NODE_WIDTH = 132;
const ANGLES_DEG = [-120, -60, 0, 60, 120, 180];
const BADGE_RADIUS = 9;

/** Two-line labels keep the nodes narrow enough for phone screens. */
const NODE_LINES: Record<Phase, [string, string]> = {
  negocio: ['Comprensión', 'del negocio'],
  datos: ['Comprensión', 'de los datos'],
  preparacion: ['Preparación', 'de los datos'],
  modelado: ['Modelado', ''],
  evaluacion: ['Evaluación', ''],
  despliegue: ['Despliegue', ''],
};

function phaseIndex(phase: Phase): number {
  return PHASES.indexOf(phase);
}

/**
 * The six CRISP-DM phases arranged in a cycle. A case study advances step by
 * step, returning to earlier phases when the work reveals a problem, and the
 * generic tasks of the current (or selected) phase are listed below.
 */
export function CrispView({ title, caseId }: { title: string; caseId: CrispCaseId }) {
  const item = CRISP_CASES[caseId];
  const total = item.steps.length;
  const reducedMotion = useReducedMotion();
  const markerId = useId().replace(/:/g, '');
  const [run, setRun] = useState(0);
  const [state, update] = useResettableState(`${caseId}|${run}`, () => ({
    shown: reducedMotion ? total : 1,
    selected: null as Phase | null,
  }));
  const playback = usePlayback({
    step: () =>
      update((previous) => ({
        ...previous,
        shown: Math.min(total, previous.shown + 1),
        selected: null,
      })),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: state.shown >= total,
  });
  const done = state.shown >= total;
  const steps = item.steps.slice(0, state.shown);
  const current = steps[steps.length - 1] ?? item.steps[0];
  const previous = steps[steps.length - 2];
  const currentPhase: Phase = current?.phase ?? 'negocio';
  const focusPhase = state.selected ?? currentPhase;
  const visits = PHASES.map((phase) => steps.filter((s) => s.phase === phase).length);
  const returns = steps.filter(
    (s, i) => i > 0 && phaseIndex(s.phase) < phaseIndex(steps[i - 1]?.phase ?? 'negocio'),
  ).length;
  const weeks = steps.reduce((acc, s) => acc + s.weeks, 0);
  const select = (phase: Phase) => {
    playback.pause();
    update((prev) => ({ ...prev, selected: phase }));
  };
  const onKey = (event: KeyboardEvent, phase: Phase) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select(phase);
    }
  };
  const description =
    `${item.name}. Paso ${state.shown} de ${total}: ${PHASE_NAMES[currentPhase]}. ${current?.activity ?? ''} ` +
    `Hasta ahora hubo ${returns} regresos a fases anteriores y ${weeks} semanas de trabajo.` +
    (done ? ' El caso llegó al despliegue.' : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Paso', value: `${state.shown} de ${total}` },
        { label: 'Fase actual', value: PHASE_NAMES[currentPhase] },
        { label: 'Regresos a fases anteriores', value: String(returns) },
        { label: 'Semanas acumuladas', value: String(weeks) },
      ]}
      legend={[
        { label: 'Flujo principal del ciclo', color: DATA_COLORS.muted, shape: 'line' },
        { label: 'Regreso posible entre fases', color: DATA_COLORS.muted, shape: 'dashed' },
        { label: 'Caso de estudio', color: DATA_COLORS.highlight, shape: 'circle' },
      ]}
      description={description}
      dataTable={{
        caption: `Pasos del caso: ${item.name}`,
        columns: ['Paso', 'Fase', 'Actividad', 'Entregable', 'Semanas'],
        rows: item.steps.map((s, i) => [
          i + 1,
          PHASE_NAMES[s.phase],
          s.activity,
          s.artifact,
          s.weeks,
        ]),
      }}
    >
      <p className={styles.stage}>
        <strong>{item.name}.</strong> {item.goal}
      </p>
      <ChartSvg
        label={description}
        interactive
        aspect={0.62}
        minHeight={300}
        maxHeight={420}
        margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {(box) => {
          const cx = box.width / 2;
          const cy = box.height / 2;
          const nodeWidth = Math.min(MAX_NODE_WIDTH, box.width * 0.3);
          const rx = Math.max(60, cx - nodeWidth / 2 - 10);
          const ry = Math.max(60, cy - NODE_HEIGHT / 2 - 10);
          const pos = PHASES.map((_, i) => {
            const a = ((ANGLES_DEG[i] ?? 0) * Math.PI) / 180;
            return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
          });
          const at = (phase: Phase) => pos[phaseIndex(phase)] ?? { x: cx, y: cy };
          const shrink = (from: { x: number; y: number }, to: { x: number; y: number }) => {
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const length = Math.hypot(dx, dy) || 1;
            // Leave room for the node box at both ends of the edge.
            const pad = Math.min(
              length / 3,
              Math.abs(dx) > Math.abs(dy) ? nodeWidth / 2 + 4 : NODE_HEIGHT / 2 + 6,
            );
            return {
              x1: from.x + (dx / length) * pad,
              y1: from.y + (dy / length) * pad,
              x2: to.x - (dx / length) * pad,
              y2: to.y - (dy / length) * pad,
            };
          };
          const lastEdge = previous ? `${previous.phase}>${currentPhase}` : '';
          const tokenPos = at(currentPhase);
          return (
            <g>
              <defs>
                <marker
                  id={`${markerId}-a`}
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={DATA_COLORS.muted} />
                </marker>
                <marker
                  id={`${markerId}-h`}
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={DATA_COLORS.highlight} />
                </marker>
              </defs>
              <g aria-hidden="true">
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={Math.min(46, rx * 0.35)}
                  ry={Math.min(30, ry * 0.3)}
                  fill="var(--color-surface-2)"
                  stroke={DATA_COLORS.muted}
                />
                <text x={cx} y={cy} dy="0.35em" textAnchor="middle" className={styles.nodeText}>
                  Datos
                </text>
                {PHASES.map((phase, i) => {
                  const next = PHASES[(i + 1) % PHASES.length] ?? 'negocio';
                  const e = shrink(at(phase), at(next));
                  const active = lastEdge === `${phase}>${next}`;
                  return (
                    <line
                      key={phase}
                      {...e}
                      stroke={active ? DATA_COLORS.highlight : DATA_COLORS.muted}
                      strokeWidth={active ? 3.5 : 1.8}
                      markerEnd={`url(#${markerId}-${active ? 'h' : 'a'})`}
                    />
                  );
                })}
                {RETURN_EDGES.map(([from, to]) => {
                  const a = at(from);
                  const b = at(to);
                  // Return edges bend toward the center so they do not overlap the main cycle.
                  const mx = (a.x + b.x) / 2 + (cx - (a.x + b.x) / 2) * 0.45;
                  const my = (a.y + b.y) / 2 + (cy - (a.y + b.y) / 2) * 0.45;
                  const s = shrink(a, { x: mx, y: my });
                  const t = shrink({ x: mx, y: my }, b);
                  const active = lastEdge === `${from}>${to}`;
                  return (
                    <path
                      key={`${from}-${to}`}
                      d={`M ${s.x1} ${s.y1} Q ${mx} ${my} ${t.x2} ${t.y2}`}
                      fill="none"
                      stroke={active ? DATA_COLORS.highlight : DATA_COLORS.muted}
                      strokeWidth={active ? 3.5 : 1.5}
                      strokeDasharray="6 4"
                      markerEnd={`url(#${markerId}-${active ? 'h' : 'a'})`}
                    />
                  );
                })}
              </g>
              {PHASES.map((phase, i) => {
                const p = pos[i] ?? { x: cx, y: cy };
                const [line1, line2] = NODE_LINES[phase];
                const isFocus = phase === focusPhase;
                return (
                  <g
                    key={phase}
                    role="button"
                    tabIndex={0}
                    aria-pressed={state.selected === phase}
                    aria-label={`${PHASE_NAMES[phase]}: ${visits[i] ?? 0} visitas. Mostrar sus tareas.`}
                    className={styles.node}
                    onClick={() => select(phase)}
                    onKeyDown={(event) => onKey(event, phase)}
                  >
                    <rect
                      x={p.x - nodeWidth / 2}
                      y={p.y - NODE_HEIGHT / 2}
                      width={nodeWidth}
                      height={NODE_HEIGHT}
                      rx={8}
                      fill="var(--color-surface)"
                      stroke={seriesColor(i)}
                      strokeWidth={isFocus ? 3.5 : 2}
                    />
                    <text x={p.x} y={p.y} textAnchor="middle" className={styles.nodeText}>
                      {line2 ? (
                        <>
                          <tspan x={p.x} dy="-0.25em">
                            {line1}
                          </tspan>
                          <tspan x={p.x} dy="1.15em">
                            {line2}
                          </tspan>
                        </>
                      ) : (
                        <tspan x={p.x} dy="0.35em">
                          {line1}
                        </tspan>
                      )}
                    </text>
                    {(visits[i] ?? 0) > 0 && (
                      <g aria-hidden="true">
                        <circle
                          cx={p.x + nodeWidth / 2 - 2}
                          cy={p.y - NODE_HEIGHT / 2 + 2}
                          r={BADGE_RADIUS}
                          fill="var(--color-surface)"
                          stroke={seriesColor(i)}
                          strokeWidth={2}
                        />
                        <text
                          x={p.x + nodeWidth / 2 - 2}
                          y={p.y - NODE_HEIGHT / 2 + 2}
                          dy="0.35em"
                          textAnchor="middle"
                          className={styles.nodeText}
                        >
                          {visits[i]}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
              <g
                className={styles.token}
                style={{
                  transform: `translate(${tokenPos.x - nodeWidth / 2 + 4}px, ${tokenPos.y + NODE_HEIGHT / 2 - 4}px)`,
                }}
                aria-hidden="true"
              >
                <circle
                  r={8}
                  fill={DATA_COLORS.highlight}
                  stroke="var(--color-surface)"
                  strokeWidth={2}
                />
              </g>
            </g>
          );
        }}
      </ChartSvg>
      <div className={styles.pair}>
        <div
          className={styles.card}
          style={{ ['--card-color' as string]: seriesColor(phaseIndex(currentPhase)) }}
        >
          <h4 className={styles.cardTitle}>
            Paso {state.shown}: {PHASE_NAMES[currentPhase]}
          </h4>
          <p className={styles.cardBody}>{current?.activity}</p>
          <p className={styles.cardNote}>Entregable: {current?.artifact}</p>
        </div>
        <div
          className={styles.card}
          style={{ ['--card-color' as string]: seriesColor(phaseIndex(focusPhase)) }}
        >
          <h4 className={styles.cardTitle}>Tareas de {PHASE_NAMES[focusPhase].toLowerCase()}</h4>
          <ul className={styles.list}>
            {PHASE_TASKS[focusPhase].map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ul>
        </div>
      </div>
      <ol className={styles.log} aria-label="Recorrido del caso por fases">
        {steps.map((s, i) => (
          <li
            key={i}
            className={`${styles.logItem} ${i === steps.length - 1 ? styles.logCurrent : ''}`}
            style={{ ['--log-color' as string]: seriesColor(phaseIndex(s.phase)) }}
            title={PHASE_NAMES[s.phase]}
          >
            {phaseIndex(s.phase) + 1}
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
