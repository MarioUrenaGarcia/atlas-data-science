import { useState } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataProjectViz.module.css';
import { FIELD_NAMES, FRAMING_CASES, FRAMING_FIELDS, type FramingWindows } from './framingCases.ts';
import type { FramingCaseId } from './schema.ts';

const FIELDS_PER_SECOND = 0.8;
/** Smallest share of the timeline given to a window so short ones stay readable. */
const MIN_SHARE = 0.18;

function WindowsTimeline({ windows, label }: { windows: FramingWindows; label: string }) {
  const parts = [windows.observation, windows.gap, windows.outcome];
  const raw = parts.map((d) => (d > 0 ? Math.max(MIN_SHARE, Math.sqrt(d)) : 0));
  const totalRaw = raw.reduce((a, b) => a + b, 0) || 1;
  return (
    <ChartSvg
      label={label}
      aspect={0.2}
      minHeight={96}
      maxHeight={120}
      margins={{ top: 8, right: 16, bottom: 8, left: 16 }}
    >
      {(box) => {
        const { left, width, top } = box.inner;
        let x = left;
        const segments = raw.map((r, i) => {
          const w = (r / totalRaw) * width;
          const segment = { x, w, i };
          x += w;
          return segment;
        });
        const cut = left + ((raw[0] ?? 0) / totalRaw) * width;
        const colors = [DATA_COLORS.primary, DATA_COLORS.neutral, DATA_COLORS.secondary];
        return (
          <g aria-hidden="true">
            {segments.map((s) =>
              s.w > 0 ? (
                <g key={s.i}>
                  <rect
                    x={s.x + 1}
                    y={top + 18}
                    width={Math.max(0, s.w - 2)}
                    height={22}
                    rx={4}
                    fill={colors[s.i]}
                    fillOpacity={s.i === 1 ? 0.25 : 0.35}
                    stroke={colors[s.i]}
                  />
                  <text
                    x={s.x + s.w / 2}
                    y={top + 33}
                    textAnchor="middle"
                    className={styles.nodeText}
                  >
                    {parts[s.i]} días
                  </text>
                  {s.i !== 1 && (
                    <text
                      x={s.x + s.w / 2}
                      y={top + 58}
                      textAnchor="middle"
                      className={styles.chartLabel}
                    >
                      {windows.labels[s.i]}
                    </text>
                  )}
                </g>
              ) : null,
            )}
            <line
              x1={cut}
              x2={cut}
              y1={top + 6}
              y2={top + 46}
              stroke={DATA_COLORS.highlight}
              strokeWidth={3}
            />
            <text x={cut} y={top + 4} textAnchor="middle" className={styles.chartLabel}>
              {windows.labels[1]}
            </text>
          </g>
        );
      }}
    </ChartSvg>
  );
}

/**
 * A vague request becomes a problem statement: each field of the framing
 * canvas is filled in turn, optionally next to a deficient version, and the
 * time windows of the prediction are drawn once the horizon is set.
 */
export function FramingView({
  title,
  caseId,
  compare,
}: {
  title: string;
  caseId: FramingCaseId;
  compare: boolean;
}) {
  const item = FRAMING_CASES[caseId];
  const total = FRAMING_FIELDS.length + 1;
  const definitions: ParameterDefinition[] = [
    {
      type: 'toggle',
      key: 'comparar',
      label: 'Mostrar el planteamiento deficiente',
      default: compare,
    },
  ];
  const parameters = useParameters(definitions);
  const showBad = Boolean(parameters.values.comparar);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [filled, update] = useResettableState(`${caseId}|${run}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: FIELDS_PER_SECOND,
    done: filled >= total,
  });
  const fieldsDone = Math.min(filled, FRAMING_FIELDS.length);
  const horizonIndex = FRAMING_FIELDS.indexOf('horizonte');
  const showWindows = fieldsDone > horizonIndex;
  const done = filled >= total;
  const activeField =
    filled > 0 && filled <= FRAMING_FIELDS.length ? FRAMING_FIELDS[filled - 1] : undefined;
  const timelineLabel = `Ventanas de tiempo: ${item.windows.observation} días de historial, ${item.windows.gap} días de espera y ${item.windows.outcome} días de resultado.`;
  const description =
    `Solicitud: ${item.request} Campos definidos: ${fieldsDone} de ${FRAMING_FIELDS.length}.` +
    (activeField ? ` ${FIELD_NAMES[activeField]}: ${item.fields[activeField].good}` : '') +
    (done ? ` Enunciado final: ${item.statement}` : '');

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Campos definidos', value: `${fieldsDone} de ${FRAMING_FIELDS.length}` },
        { label: 'Historial usado', value: `${item.windows.observation} días` },
        { label: 'Ventana del resultado', value: `${item.windows.outcome} días` },
      ]}
      description={description}
      dataTable={{
        caption: 'Campos del planteamiento',
        columns: ['Campo', 'Planteamiento bien definido', 'Planteamiento deficiente'],
        rows: FRAMING_FIELDS.map((f) => [FIELD_NAMES[f], item.fields[f].good, item.fields[f].bad]),
      }}
    >
      <p className={styles.request}>Solicitud original: {item.request}</p>
      <div className={styles.canvas}>
        {FRAMING_FIELDS.map((field, i) => {
          const isFilled = i < fieldsDone;
          const classes = [
            styles.field,
            isFilled ? styles.fieldFilled : '',
            field === activeField ? styles.fieldActive : '',
          ].join(' ');
          return (
            <div key={field} className={classes}>
              <span className={styles.fieldLabel}>{FIELD_NAMES[field]}</span>
              {isFilled ? item.fields[field].good : <span aria-hidden="true">?</span>}
              {showBad && <span className={styles.bad}>Deficiente: {item.fields[field].bad}</span>}
            </div>
          );
        })}
      </div>
      {showWindows && <WindowsTimeline windows={item.windows} label={timelineLabel} />}
      {done && (
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Enunciado del problema</h4>
          <p className={styles.cardBody}>{item.statement}</p>
        </div>
      )}
    </VizFrame>
  );
}
