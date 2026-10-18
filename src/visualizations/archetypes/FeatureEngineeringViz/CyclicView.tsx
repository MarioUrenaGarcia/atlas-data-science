import { useState } from 'react';
import { cyclicDistance, cyclicEncode } from '../../../lib/dataprep/features.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './FeatureEngineeringViz.module.css';

const MORPH_STEPS = 30;
const STEPS_PER_SECOND = 15;

type PeriodId = 'horas' | 'meses' | 'dias';

const PERIODS: Record<PeriodId, { period: number; name: string; label: (v: number) => string }> = {
  horas: { period: 24, name: 'Hora del día', label: (v) => `${v} h` },
  meses: {
    period: 12,
    name: 'Mes',
    label: (v) =>
      ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][v] ?? '',
  },
  dias: {
    period: 7,
    name: 'Día de la semana',
    label: (v) => ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'][v] ?? '',
  },
};

/**
 * A periodic variable written as a number puts its last and first values
 * at opposite ends of a line. Mapping each value to (sin, cos) bends the line
 * into a circle where 23 h and 0 h are neighbors again.
 */
export function CyclicView({
  title,
  period,
  a,
  b,
}: {
  title: string;
  period: PeriodId;
  a: number;
  b: number;
}) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'select',
      key: 'periodo',
      label: 'Variable periódica',
      options: (Object.keys(PERIODS) as PeriodId[]).map((p) => ({
        value: p,
        label: PERIODS[p].name,
      })),
      default: period,
    },
    {
      type: 'number',
      key: 'a',
      label: 'Primer valor',
      min: 0,
      max: 23,
      step: 1,
      default: a,
      symbol: 'a',
    },
    {
      type: 'number',
      key: 'b',
      label: 'Segundo valor',
      min: 0,
      max: 23,
      step: 1,
      default: b,
      symbol: 'b',
    },
  ];
  const parameters = useParameters(definitions);
  const pid = String(parameters.values.periodo) as PeriodId;
  const spec = PERIODS[pid];
  const P = spec.period;
  const va = Math.min(P - 1, Number(parameters.values.a));
  const vb = Math.min(P - 1, Number(parameters.values.b));
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [stepIndex, update] = useResettableState<number>(`${pid}|${run}`, () =>
    reducedMotion ? MORPH_STEPS : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(MORPH_STEPS, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: stepIndex >= MORPH_STEPS,
  });
  const t = stepIndex / MORPH_STEPS;
  const linear = Math.abs(va - vb);
  const circular = cyclicDistance(va, vb, P);
  const [sa, ca] = cyclicEncode(va, P);
  const f = (v: number) => formatNumber(v, 3);
  const header = `(\\sin\\tfrac{2\\pi \\cdot ${va}}{${P}},\\ \\cos\\tfrac{2\\pi \\cdot ${va}}{${P}}) = (${f(sa)},\\ ${f(ca)}),\\quad d = 2\\sin\\tfrac{\\pi\\,|${va} - ${vb}|}{${P}} = ${f(circular)}`;
  const description =
    `${spec.name} con periodo ${P}. Entre ${spec.label(va)} y ${spec.label(vb)}: diferencia lineal ${linear}, ` +
    `distancia en la codificación cíclica ${f(circular)} (máxima posible 2).`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Diferencia como número', value: `${linear} de ${P - 1} posibles` },
        { label: 'Distancia cíclica', value: f(circular), color: DATA_COLORS.highlight },
        { label: `Coordenadas de ${spec.label(va)}`, value: `(${f(sa)}, ${f(ca)})` },
      ]}
      legend={[
        { label: 'Valores del ciclo', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Valores comparados', color: DATA_COLORS.negative, shape: 'circle' },
        { label: 'Distancia entre ellos', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.7}
        minHeight={260}
        maxHeight={400}
        margins={{ top: 16, right: 16, bottom: 16, left: 16 }}
      >
        {(box) => {
          const { left, top, width, height } = box.inner;
          const r = Math.min(width, height) * 0.38;
          const cx = left + width / 2;
          const cy = top + height / 2;
          const pos = (v: number) => {
            const lx = left + 10 + ((width - 20) * v) / (P - 1);
            const ly = cy;
            const [s, c] = cyclicEncode(v, P);
            const qx = cx + r * s;
            const qy = cy - r * c;
            return [lx + (qx - lx) * t, ly + (qy - ly) * t] as [number, number];
          };
          const values = Array.from({ length: P }, (_, v) => v);
          const pa = pos(va);
          const pb = pos(vb);
          return (
            <g aria-hidden="true">
              {values.slice(1).map((v) => {
                const p0 = pos(v - 1);
                const p1 = pos(v);
                return (
                  <line
                    key={v}
                    x1={p0[0]}
                    y1={p0[1]}
                    x2={p1[0]}
                    y2={p1[1]}
                    stroke={DATA_COLORS.grid}
                    strokeWidth={2}
                  />
                );
              })}
              <line
                x1={pa[0]}
                y1={pa[1]}
                x2={pb[0]}
                y2={pb[1]}
                stroke={DATA_COLORS.highlight}
                strokeWidth={3}
              />
              {values.map((v) => {
                const p = pos(v);
                const chosen = v === va || v === vb;
                return (
                  <g key={v}>
                    <circle
                      cx={p[0]}
                      cy={p[1]}
                      r={chosen ? 7 : 4}
                      fill={chosen ? DATA_COLORS.negative : DATA_COLORS.primary}
                    />
                    {(P <= 12 || v % 3 === 0 || chosen) && (
                      <text
                        x={p[0]}
                        y={p[1] - 10}
                        textAnchor="middle"
                        className={styles.chartLabel}
                      >
                        {spec.label(v)}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
