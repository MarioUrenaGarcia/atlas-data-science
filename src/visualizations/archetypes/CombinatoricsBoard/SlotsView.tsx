import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CombinatoricsBoard.module.css';

const SLOTS_PER_SECOND = 1.2;
const SLOT_HEIGHT = 58;
const MAX_SLOT_WIDTH = 78;
const BAR_HEIGHT = 18;
/** Room left after the longest bar for its value. */
const VALUE_LABEL_SPACE = 96;

export interface SlotScenario {
  nombre: string;
  casillas: { etiqueta: string; opciones: number }[];
  /** Number every count is divided by at the end, such as k! for unordered choices. */
  divisor?: { valor: number; texto: string };
}

interface SlotsViewProps {
  title: string;
  scenarios: readonly SlotScenario[];
}

const totalOf = (scenario: SlotScenario) =>
  scenario.casillas.reduce((product, slot) => product * slot.opciones, 1) /
  (scenario.divisor?.valor ?? 1);

/**
 * Counting by slots when the objects are too many to list: every position
 * shows how many options it has, the running product grows as the slots are
 * filled, and a final division removes orders that should not count. Bars on
 * a logarithmic scale compare the totals of the different scenarios.
 */
export function SlotsView({ title, scenarios }: SlotsViewProps) {
  const definitions = useMemo(
    () =>
      scenarios.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'escenario',
              label: 'Escenario',
              options: scenarios.map((scenario, index) => ({
                value: String(index),
                label: scenario.nombre,
              })),
              default: '0',
            },
          ]
        : [],
    [scenarios],
  );
  const parameters = useParameters(definitions);
  const chosen =
    scenarios.length > 1 ? Number((parameters.values as Record<string, string>).escenario) : 0;
  const scenario = scenarios[chosen] ?? scenarios[0];
  const slots = scenario?.casillas ?? [];
  const steps = slots.length + (scenario?.divisor ? 1 : 0);
  const [run, setRun] = useState(0);
  const [filled, update] = useResettableState<number>(`${chosen}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(steps, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: SLOTS_PER_SECOND,
    done: filled >= steps,
  });
  if (!scenario) return null;
  const used = slots.slice(0, Math.min(filled, slots.length));
  const product = used.reduce((acc, slot) => acc * slot.opciones, 1);
  const divided = scenario.divisor && filled > slots.length;
  const current = divided ? product / (scenario.divisor?.valor ?? 1) : product;
  const factors = used.map((slot) => slot.opciones).join(' \\cdot ') || '1';
  const formula = `${factors}${divided ? ` \\,/\\, ${scenario.divisor?.valor}` : ''} = ${formatNumber(current, 0).replace(/,/g, '{,}')}`;
  const description =
    `${scenario.nombre}: ${slots.map((slot) => `${slot.etiqueta} con ${slot.opciones} opciones`).join(', ')}. ` +
    `Producto de las casillas llenas: ${formatNumber(product, 0)}` +
    (divided
      ? `, dividido entre ${scenario.divisor?.valor} (${scenario.divisor?.texto}): ${formatNumber(current, 0)}.`
      : '.');
  const maxLog = Math.max(...scenarios.map((item) => Math.log10(Math.max(1, totalOf(item)))), 1);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'Casillas llenas', value: `${used.length} de ${slots.length}` },
        { label: 'Conteo actual', value: formatNumber(current, 0), color: DATA_COLORS.primary },
        ...(scenario.divisor
          ? [
              {
                label: 'Se divide entre',
                value: `${scenario.divisor.valor} (${scenario.divisor.texto})`,
              },
            ]
          : []),
        ...scenarios.map((item, index) => ({
          label: item.nombre,
          value: formatNumber(totalOf(item), 0),
          color: seriesColor(index),
        })),
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={formula} />
      </p>
      <ChartSvg
        label={description}
        aspect={0}
        minHeight={SLOT_HEIGHT + 60 + scenarios.length * (BAR_HEIGHT + 8)}
        maxHeight={SLOT_HEIGHT + 60 + scenarios.length * (BAR_HEIGHT + 8)}
        margins={{ top: 8, right: 12, bottom: 8, left: 12 }}
      >
        {(box) => {
          const width = Math.min(
            MAX_SLOT_WIDTH,
            (box.inner.width - 8 * slots.length) / slots.length,
          );
          const start = box.inner.left + (box.inner.width - slots.length * (width + 8)) / 2;
          const barsTop = box.inner.top + SLOT_HEIGHT + 44;
          const labelWidth = Math.min(180, box.inner.width * 0.35);
          return (
            <g aria-hidden="true">
              {slots.map((slot, index) => {
                const x = start + index * (width + 8);
                const done = index < filled;
                return (
                  <g key={index}>
                    <rect
                      x={x}
                      y={box.inner.top}
                      width={width}
                      height={SLOT_HEIGHT}
                      rx={8}
                      fill={done ? DATA_COLORS.primary : 'var(--color-surface)'}
                      fillOpacity={done ? 0.2 : 1}
                      stroke={DATA_COLORS.primary}
                      strokeDasharray={done ? undefined : '4 3'}
                    />
                    <text
                      x={x + width / 2}
                      y={box.inner.top + SLOT_HEIGHT / 2 - 4}
                      textAnchor="middle"
                      className={svgStyles.label}
                      style={{ fontWeight: 700, fontSize: 16 }}
                    >
                      {done ? slot.opciones : '?'}
                    </text>
                    <text
                      x={x + width / 2}
                      y={box.inner.top + SLOT_HEIGHT / 2 + 14}
                      textAnchor="middle"
                      className={svgStyles.labelMuted}
                      style={{ fontSize: 10 }}
                    >
                      opciones
                    </text>
                    <text
                      x={x + width / 2}
                      y={box.inner.top + SLOT_HEIGHT + 16}
                      textAnchor="middle"
                      className={svgStyles.labelMuted}
                      style={{ fontSize: 10 }}
                    >
                      {slot.etiqueta}
                    </text>
                  </g>
                );
              })}
              {scenarios.map((item, index) => {
                const y = barsTop + index * (BAR_HEIGHT + 8);
                const value = totalOf(item);
                const length =
                  ((box.inner.width - labelWidth - VALUE_LABEL_SPACE) *
                    Math.log10(Math.max(1, value))) /
                  maxLog;
                return (
                  <g key={item.nombre}>
                    <text
                      x={box.inner.left + labelWidth - 8}
                      y={y + BAR_HEIGHT / 2}
                      dy="0.35em"
                      textAnchor="end"
                      className={svgStyles.label}
                      style={{ fontSize: 11, fontWeight: index === chosen ? 700 : 400 }}
                    >
                      {item.nombre}
                    </text>
                    <rect
                      x={box.inner.left + labelWidth}
                      y={y}
                      width={Math.max(2, length)}
                      height={BAR_HEIGHT}
                      rx={4}
                      fill={seriesColor(index)}
                      fillOpacity={index === chosen ? 0.8 : 0.35}
                    />
                    <text
                      x={box.inner.left + labelWidth + Math.max(2, length) + 6}
                      y={y + BAR_HEIGHT / 2}
                      dy="0.35em"
                      className={svgStyles.labelMuted}
                      style={{ fontSize: 10 }}
                    >
                      {formatNumber(value, 0)}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
      <p className={styles.verdict}>
        Las barras usan escala logarítmica: cada tramo del mismo largo multiplica el total por la
        misma cantidad.
      </p>
    </VizFrame>
  );
}
