import { useMemo, useState } from 'react';
import { canonicalRotation, factorial, permutations } from '../../../lib/combinatorics/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CombinatoricsBoard.module.css';
import { GroupList } from './GroupList.tsx';
import { enumerationRate } from './pace.ts';

const TABLE_RADIUS = 0.3;
const SEAT_RADIUS = 20;

interface CircularViewProps {
  title: string;
  people: readonly string[];
}

/**
 * Seatings around a round table. Every linear order is listed; orders that
 * differ by a rotation (and, optionally, by a reflection) describe the same
 * seating and fall into the same class, which has n (or 2n) members.
 */
export function CircularView({ title, people }: CircularViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'n',
        label: 'Personas',
        symbol: 'n',
        min: 3,
        max: people.length,
        step: 1,
        default: Math.min(4, people.length),
      },
      {
        type: 'toggle' as const,
        key: 'reflejos',
        label: 'Considerar iguales los reflejos',
        default: false,
      },
    ],
    [people.length],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | boolean>;
  const n = Number(values.n);
  const reflections = Boolean(values.reflejos);
  const all = useMemo(() => permutations(n), [n]);
  const classOf = (arrangement: readonly number[]) => {
    const rotation = canonicalRotation(arrangement);
    if (!reflections) return rotation.join(',');
    const mirrored = canonicalRotation([...arrangement].reverse());
    const a = rotation.join(',');
    const b = mirrored.join(',');
    return a < b ? a : b;
  };
  const order: string[] = [];
  const seen = new Set<string>();
  all.forEach((arrangement) => {
    const key = classOf(arrangement);
    if (!seen.has(key)) {
      seen.add(key);
      order.push(key);
    }
  });

  const total = all.length;
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${n}|${reflections}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    stepMany: (count) => update((value) => Math.min(total, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: enumerationRate(total) / 2,
    done: shown >= total,
  });
  const filled = new Map<string, number>();
  all.slice(0, shown).forEach((arrangement) => {
    const key = classOf(arrangement);
    filled.set(key, (filled.get(key) ?? 0) + 1);
  });
  const current = shown > 0 ? all[shown - 1] : undefined;
  const classSize = reflections ? 2 * n : n;
  const classes = order.length;
  const names = (key: string) =>
    key
      .split(',')
      .map((index) => people[Number(index)]?.slice(0, 3))
      .join(' ');
  const formula = reflections
    ? `\\frac{${n}!}{2 \\cdot ${n}} = \\frac{(${n} - 1)!}{2} = ${classes}`
    : `\\frac{${n}!}{${n}} = (${n} - 1)! = ${factorial(n - 1)}`;
  const description =
    `${n} personas en una mesa redonda: ${total} órdenes en fila, que forman ${classes} acomodos distintos de ${classSize} órdenes cada uno. ` +
    `Revisados: ${shown}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Órdenes en fila', value: `${n}! = ${total}` },
        {
          label: reflections ? 'Giros y reflejos por acomodo' : 'Giros por acomodo',
          value: String(classSize),
        },
        { label: 'Acomodos distintos', value: String(classes), color: DATA_COLORS.primary },
        { label: 'Revisados', value: `${shown} de ${total}` },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={formula} />
      </p>
      <ChartSvg
        label={description}
        aspect={0}
        minHeight={220}
        maxHeight={220}
        margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {(box) => {
          const cx = box.inner.left + box.inner.width / 2;
          const cy = box.inner.top + box.inner.height / 2;
          const radius = Math.min(box.inner.width, box.inner.height) * TABLE_RADIUS;
          const seating = current ?? Array.from({ length: n }, (_, index) => index);
          return (
            <g aria-hidden="true">
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="var(--color-surface-2)"
                stroke="var(--color-border-strong)"
              />
              {seating.map((person, seat) => {
                const angle = -Math.PI / 2 + (2 * Math.PI * seat) / n;
                const x = cx + (radius + SEAT_RADIUS + 6) * Math.cos(angle);
                const y = cy + (radius + SEAT_RADIUS + 6) * Math.sin(angle);
                return (
                  <g key={seat}>
                    <circle
                      cx={x}
                      cy={y}
                      r={SEAT_RADIUS}
                      fill={seriesColor(person)}
                      fillOpacity={0.25}
                      stroke={seriesColor(person)}
                      strokeWidth={2}
                    />
                    <text
                      x={x}
                      y={y}
                      dy="0.35em"
                      textAnchor="middle"
                      className={svgStyles.label}
                      style={{ fontSize: 11, fontWeight: 700 }}
                    >
                      {people[person]?.slice(0, 3)}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
      <GroupList
        label="Acomodos alrededor de la mesa"
        wide
        current={current ? classOf(current) : undefined}
        groups={order.map((key) => ({
          key,
          title: names(key),
          filled: filled.get(key) ?? 0,
          capacity: classSize,
        }))}
      />
    </VizFrame>
  );
}
