import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './IconArray.module.css';
import type { IconArrayConfig } from './schema.ts';

const STAGES_PER_SECOND = 0.5;
const LAST_STAGE = 4;
const COLUMNS_100 = 20;
const COLUMNS_1000 = 50;
const MAX_ICON = 26;

type Group = 'tp' | 'fn' | 'fp' | 'tn';

/** Expected counts rounded to whole people, adjusted so the four groups add up to the population. */
function naturalFrequencies(
  population: number,
  prevalence: number,
  sensitivity: number,
  specificity: number,
): Record<Group, number> {
  const sick = Math.round(population * prevalence);
  const healthy = population - sick;
  const tp = Math.round(sick * sensitivity);
  const fp = Math.round(healthy * (1 - specificity));
  return { tp, fn: sick - tp, fp, tn: healthy - fp };
}

/**
 * A population of 100 or 1000 people as icons, for natural frequencies. The
 * animation marks who has the condition, who tests positive, and then keeps
 * only the positives (or negatives), so the predictive value is read as a
 * count among the remaining icons instead of a formula.
 */
export default function IconArray({ params, title }: VisualizationProps) {
  const config = params as unknown as IconArrayConfig;
  const condition = config.condicion ?? 'tiene la condición';
  const positiveName = config.positivo ?? 'da positivo';
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'poblacion',
        label: 'Personas',
        options: [
          { value: '100', label: '100' },
          { value: '1000', label: '1000' },
        ],
        default: String(config.poblacion ?? 1000),
      },
      {
        type: 'number' as const,
        key: 'prevalencia',
        label: 'Prevalencia (tasa base)',
        min: 0.001,
        max: 0.5,
        step: 0.001,
        digits: 3,
        default: config.prevalencia ?? 0.01,
      },
      {
        type: 'number' as const,
        key: 'sensibilidad',
        label: 'Sensibilidad P(+ | condición)',
        min: 0.5,
        max: 1,
        step: 0.01,
        digits: 2,
        default: config.sensibilidad ?? 0.9,
      },
      {
        type: 'number' as const,
        key: 'especificidad',
        label: 'Especificidad P(- | sin condición)',
        min: 0.5,
        max: 1,
        step: 0.01,
        digits: 2,
        default: config.especificidad ?? 0.95,
      },
    ],
    [config.poblacion, config.prevalencia, config.sensibilidad, config.especificidad],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const population = Number(values.poblacion);
  const prevalence = Number(values.prevalencia);
  const sensitivity = Number(values.sensibilidad);
  const specificity = Number(values.especificidad);
  const counts = naturalFrequencies(population, prevalence, sensitivity, specificity);
  const sick = counts.tp + counts.fn;
  const positives = counts.tp + counts.fp;
  const negatives = counts.tn + counts.fn;
  const ppv = positives > 0 ? counts.tp / positives : 0;
  const npv = negatives > 0 ? counts.tn / negatives : 0;
  const focusNegatives = config.enfoque === 'negativos';

  const [run, setRun] = useState(0);
  const [stage, updateStage] = useResettableState(`${run}`, () => 0);
  const playback = usePlayback({
    step: () => updateStage((value) => Math.min(LAST_STAGE, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STAGES_PER_SECOND,
    done: stage >= LAST_STAGE,
  });

  // Icons are grouped so each count is a contiguous block: sick first, positives within each group first.
  const groups: Group[] = [
    ...Array<Group>(counts.tp).fill('tp'),
    ...Array<Group>(counts.fn).fill('fn'),
    ...Array<Group>(counts.fp).fill('fp'),
    ...Array<Group>(counts.tn).fill('tn'),
  ];
  const n = (value: number) => formatNumber(value, 0);
  const headers = [
    `${n(population)} \\text{ personas}`,
    `${n(population)} \\cdot ${formatNumber(prevalence, 3)} = ${n(sick)} \\text{ ${condition}}`,
    `\\text{Verdaderos positivos } ${n(counts.tp)},\\; \\text{falsos positivos } ${n(counts.fp)}`,
    focusNegatives
      ? `${n(negatives)} \\text{ negativos: } ${n(counts.tn)} \\text{ sin la condición y } ${n(counts.fn)} \\text{ con ella}`
      : `${n(positives)} \\text{ positivos: } ${n(counts.tp)} \\text{ con la condición y } ${n(counts.fp)} \\text{ sin ella}`,
    focusNegatives
      ? `P(\\text{sin condición} \\mid -) = \\frac{${n(counts.tn)}}{${n(counts.tn)} + ${n(counts.fn)}} = ${formatNumber(npv, 3)}`
      : `P(\\text{condición} \\mid +) = \\frac{${n(counts.tp)}}{${n(counts.tp)} + ${n(counts.fp)}} = ${formatNumber(ppv, 3)}`,
  ];
  const description =
    `De ${n(population)} personas, ${n(sick)} ${condition}. ${n(counts.tp)} de ellas ${positiveName} y ${n(counts.fn)} no. ` +
    `De las ${n(population - sick)} restantes, ${n(counts.fp)} ${positiveName} por error. ` +
    `Valor predictivo positivo ${formatNumber(ppv, 3)}; valor predictivo negativo ${formatNumber(npv, 3)}.`;

  const kept = (group: Group) =>
    stage < 3
      ? true
      : focusNegatives
        ? group === 'tn' || group === 'fn'
        : group === 'tp' || group === 'fp';
  const color = (group: Group) =>
    stage >= 1 && (group === 'tp' || group === 'fn') ? DATA_COLORS.secondary : DATA_COLORS.neutral;
  const marked = (group: Group) => stage >= 2 && (group === 'tp' || group === 'fp');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: `Con la condición`, value: n(sick), color: DATA_COLORS.secondary },
        { label: 'Verdaderos positivos', value: n(counts.tp) },
        { label: 'Falsos positivos', value: n(counts.fp) },
        { label: 'Falsos negativos', value: n(counts.fn) },
        {
          label: 'Valor predictivo positivo',
          value: formatNumber(ppv, 3),
          color: DATA_COLORS.highlight,
        },
        { label: 'Valor predictivo negativo', value: formatNumber(npv, 3) },
      ]}
      legend={[
        { label: `Persona que ${condition}`, color: DATA_COLORS.secondary },
        { label: 'Persona sin la condición', color: DATA_COLORS.neutral },
        { label: `Recuadro: ${positiveName}`, color: DATA_COLORS.highlight },
      ]}
      description={description}
      dataTable={{
        caption: 'Frecuencias naturales',
        columns: ['', 'Positivo', 'Negativo', 'Total'],
        rows: [
          ['Con la condición', counts.tp, counts.fn, sick],
          ['Sin la condición', counts.fp, counts.tn, population - sick],
          ['Total', positives, negatives, population],
        ],
      }}
    >
      <FormulaLine tex={headers[stage] ?? ''} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <ChartSvg
        label={description}
        aspect={population === 100 ? 0.25 : 0.4}
        minHeight={120}
        maxHeight={population === 100 ? 160 : 420}
        margins={{ top: 4, right: 4, bottom: 4, left: 4 }}
      >
        {(box) => {
          const columns = population === 100 ? COLUMNS_100 : COLUMNS_1000;
          const rows = Math.ceil(population / columns);
          const size = Math.min(MAX_ICON, box.inner.width / columns, box.inner.height / rows);
          const left = box.inner.left + (box.inner.width - size * columns) / 2;
          return (
            <g aria-hidden="true">
              {groups.map((group, index) => {
                const cx = left + ((index % columns) + 0.5) * size;
                const cy = box.inner.top + (Math.floor(index / columns) + 0.5) * size;
                const opacity = kept(group) ? 1 : 0.12;
                return (
                  <g key={index} opacity={opacity}>
                    {marked(group) && (
                      <rect
                        x={cx - size / 2 + 0.5}
                        y={cy - size / 2 + 0.5}
                        width={size - 1}
                        height={size - 1}
                        fill={DATA_COLORS.highlight}
                        fillOpacity={0.35}
                        stroke={DATA_COLORS.highlight}
                        strokeWidth={size > 10 ? 1.5 : 0.6}
                      />
                    )}
                    <circle cx={cx} cy={cy - size * 0.18} r={size * 0.16} fill={color(group)} />
                    <path
                      d={`M${cx - size * 0.26},${cy + size * 0.36} Q${cx - size * 0.26},${cy} ${cx},${cy} Q${cx + size * 0.26},${cy} ${cx + size * 0.26},${cy + size * 0.36} Z`}
                      fill={color(group)}
                    />
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Cada figura es una persona. Las personas se agrupan por estado y resultado para que cada
        cantidad se pueda contar a la vista.
      </p>
    </VizFrame>
  );
}
