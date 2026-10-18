import { scaleLinear, scaleSymlog } from 'd3-scale';
import { useState } from 'react';
import { tukeyFences } from '../../../lib/dataprep/missing.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { mean, standardDeviation } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './Quality.module.css';
import { OUTLIER_CASES, type OutlierTruth } from './outlierCases.ts';
import type { OutlierCaseId, OutlierRule } from './schema.ts';

const VALUES_PER_SECOND = 3;
const Z_CUTOFF = 3;
const RULE_NAMES: Record<OutlierRule, string> = {
  iqr: 'Cercas de Tukey (1.5 RIC)',
  z: 'Puntuación z mayor que 3',
  dominio: 'Rango plausible del dominio',
};
const TRUTH_COLORS: Record<OutlierTruth, string> = {
  normal: DATA_COLORS.neutral,
  extremo: DATA_COLORS.primary,
  error: DATA_COLORS.negative,
};
const TRUTH_NAMES: Record<OutlierTruth, string> = {
  normal: 'Valor ordinario',
  extremo: 'Extremo real',
  error: 'Error de captura',
};

/**
 * Values are screened one at a time by a detection rule. Color shows what
 * each value really is (ordinary, a genuine extreme or a capture error) and a
 * ring shows what the rule flags, so its misses and false alarms are visible.
 */
export function OutlierView({
  title,
  caseId,
  rule,
}: {
  title: string;
  caseId: OutlierCaseId;
  rule: OutlierRule;
}) {
  const item = OUTLIER_CASES[caseId];
  const definitions: ParameterDefinition[] = [
    {
      type: 'select',
      key: 'regla',
      label: 'Regla de detección',
      options: (Object.keys(RULE_NAMES) as OutlierRule[]).map((r) => ({
        value: r,
        label: RULE_NAMES[r],
      })),
      default: rule,
    },
  ];
  const parameters = useParameters(definitions);
  const current = String(parameters.values.regla) as OutlierRule;
  const values = item.values.map((v) => v.value);
  const [lowFence, highFence] = tukeyFences(values);
  const m = mean(values);
  const s = standardDeviation(values);
  const limits: [number, number] =
    current === 'iqr'
      ? [lowFence, highFence]
      : current === 'z'
        ? [m - Z_CUTOFF * s, m + Z_CUTOFF * s]
        : item.plausible;
  const flagged = values.map((v) => v < limits[0] || v > limits[1]);
  const total = values.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${caseId}|${run}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: VALUES_PER_SECOND,
    done: shown >= total,
  });
  const seen = item.values.slice(0, shown);
  const count = (truth: OutlierTruth, flag: boolean) =>
    seen.filter((v, i) => v.truth === truth && flagged[i] === flag).length;
  const errorsTotal = item.values.filter((v) => v.truth === 'error').length;
  const currentValue = shown > 0 ? item.values[shown - 1] : undefined;
  const f = (v: number) => formatNumber(v, 2);
  const header =
    current === 'iqr'
      ? `[Q_1 - 1.5\\,\\mathrm{RIC},\\ Q_3 + 1.5\\,\\mathrm{RIC}] = [${f(lowFence)},\\ ${f(highFence)}]`
      : current === 'z'
        ? `[\\bar{x} - 3s,\\ \\bar{x} + 3s] = [${f(limits[0])},\\ ${f(limits[1])}],\\quad \\bar{x} = ${f(m)},\\ s = ${f(s)}`
        : `\\text{rango plausible} = [${item.plausible[0]},\\ ${item.plausible[1]}]\\ \\text{${item.unit}}`;
  const description =
    `${item.name}. Regla: ${RULE_NAMES[current]}, límites ${f(limits[0])} y ${f(limits[1])} ${item.unit}. ` +
    `Revisados ${shown} de ${total}. Errores detectados ${count('error', true)} de ${errorsTotal}; ` +
    `extremos reales marcados ${count('extremo', true)}; valores ordinarios marcados ${count('normal', true)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Revisados', value: `${shown} de ${total}` },
        {
          label: 'Errores detectados',
          value: `${count('error', true)} de ${errorsTotal}`,
          color: DATA_COLORS.negative,
        },
        { label: 'Errores no detectados', value: String(count('error', false)) },
        {
          label: 'Extremos reales marcados',
          value: String(count('extremo', true)),
          color: DATA_COLORS.primary,
        },
        { label: 'Ordinarios marcados', value: String(count('normal', true)) },
      ]}
      legend={[
        ...(Object.keys(TRUTH_NAMES) as OutlierTruth[]).map((t) => ({
          label: TRUTH_NAMES[t],
          color: TRUTH_COLORS[t],
          shape: 'circle' as const,
        })),
        { label: 'Marcado por la regla', color: DATA_COLORS.highlight, shape: 'circle' },
        { label: 'Límites de la regla', color: DATA_COLORS.highlight, shape: 'dashed' },
      ]}
      description={description}
      dataTable={{
        caption: item.name,
        columns: ['Captura', `Valor (${item.unit})`, 'Tipo', 'Marcado', 'Nota'],
        rows: item.values.map((v, i) => [
          i + 1,
          formatNumber(v.value, 2),
          TRUTH_NAMES[v.truth],
          flagged[i] ? 'sí' : 'no',
          v.note ?? '',
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <p className={styles.stage}>
        {currentValue
          ? `Captura ${shown}: ${formatNumber(currentValue.value, 2)} ${item.unit}. ${flagged[shown - 1] ? 'La regla lo marca.' : 'La regla no lo marca.'} ${currentValue.note ?? ''}`
          : item.name}
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={260}
        maxHeight={380}
        margins={{ top: 12, right: 16, bottom: 44, left: 64 }}
      >
        {(box) => {
          const { left, top, width, height } = box.inner;
          const x = scaleLinear()
            .domain([0.5, total + 0.5])
            .range([left, left + width]);
          const all = [...values, ...limits];
          const y = scaleSymlog()
            .constant(item.symlog)
            .domain([Math.min(...all), Math.max(...all)])
            .nice()
            .range([top + height, top]);
          const ticks = y
            .ticks(6)
            .filter((t, i, arr) => i === 0 || Math.abs(y(t) - y(arr[i - 1] ?? t)) > 14);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={left}
                gridLength={width}
                tickValues={ticks}
                label={`Valor (${item.unit}, escala logarítmica simétrica)`}
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={top + height}
                ticks={Math.min(10, total)}
                format={(v) => (Number.isInteger(v) ? String(v) : '')}
                label="Orden de captura"
              />
              <g aria-hidden="true">
                {limits.map((l, i) => (
                  <line
                    key={i}
                    x1={left}
                    x2={left + width}
                    y1={y(l)}
                    y2={y(l)}
                    stroke={DATA_COLORS.highlight}
                    strokeWidth={1.8}
                    strokeDasharray="6 4"
                  />
                ))}
                {seen.map((v, i) => (
                  <g key={i}>
                    <circle cx={x(i + 1)} cy={y(v.value)} r={5} fill={TRUTH_COLORS[v.truth]} />
                    {flagged[i] && (
                      <circle
                        cx={x(i + 1)}
                        cy={y(v.value)}
                        r={9}
                        fill="none"
                        stroke={DATA_COLORS.highlight}
                        strokeWidth={2.5}
                      />
                    )}
                  </g>
                ))}
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
