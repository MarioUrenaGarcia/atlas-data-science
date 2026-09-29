import { useMemo, useState } from 'react';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './PigeonholeViz.module.css';
import type { PigeonholeVizConfig } from './schema.ts';

const OBJECTS_PER_SECOND = 3;
const DOT_RADIUS = 7;
const DOT_GAP = 3;

/**
 * Objects dropped into boxes, either spread as evenly as possible (the best
 * attempt to avoid crowding) or at random. Even the even spread leaves some
 * box with at least ceil(n / m) objects, which is the pigeonhole principle.
 */
export default function PigeonholeViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as PigeonholeVizConfig;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'n',
        label: 'Objetos',
        symbol: 'n',
        min: 1,
        max: 40,
        step: 1,
        default: config.objetos ?? 11,
      },
      {
        type: 'number' as const,
        key: 'm',
        label: 'Cajas',
        symbol: 'm',
        min: 1,
        max: 10,
        step: 1,
        default: config.cajas ?? 10,
      },
      {
        type: 'select' as const,
        key: 'estrategia',
        label: 'Forma de repartir',
        options: [
          { value: 'repartir', label: 'Lo más parejo posible' },
          { value: 'azar', label: 'Al azar' },
        ],
        default: config.estrategia ?? 'repartir',
      },
    ],
    [config.objetos, config.cajas, config.estrategia],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const n = Number(values.n);
  const m = Number(values.m);
  const strategy = String(values.estrategia);
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const targets = useMemo(() => {
    if (strategy === 'repartir') return Array.from({ length: n }, (_, index) => index % m);
    const random = new Random(seed.seed);
    return Array.from({ length: n }, () => random.int(0, m - 1));
  }, [n, m, strategy, seed.seed]);
  const [run, setRun] = useState(0);
  const [placed, update] = useResettableState<number>(
    `${n}|${m}|${strategy}|${seed.seed}|${run}`,
    () => 0,
  );
  const playback = usePlayback({
    step: () => update((value) => Math.min(n, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: OBJECTS_PER_SECOND,
    done: placed >= n,
  });
  const loads = Array.from({ length: m }, () => 0);
  targets.slice(0, placed).forEach((box) => {
    loads[box] = (loads[box] ?? 0) + 1;
  });
  const fullest = Math.max(...loads);
  const guaranteed = Math.ceil(n / m);
  const complete = placed >= n;
  const verdict = !complete
    ? 'Repartiendo objetos.'
    : n > m
      ? `Con ${n} objetos y ${m} cajas alguna caja recibe al menos ${guaranteed}; aquí la más llena tiene ${fullest}.`
      : `Con ${n} objetos y ${m} cajas es posible que ninguna caja repita; la más llena tiene ${fullest}.`;
  const description = `${verdict} Objetos colocados: ${placed} de ${n}. Ocupación de las cajas: ${loads.join(', ')}.`;
  const tallest = Math.max(
    guaranteed,
    ...targets.reduce(
      (acc, box) => {
        acc[box] = (acc[box] ?? 0) + 1;
        return acc;
      },
      Array.from({ length: m }, () => 0),
    ),
  );

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={strategy === 'azar' ? seed : undefined}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Colocados', value: `${placed} de ${n}` },
        { label: 'Caja más llena', value: String(fullest), color: DATA_COLORS.secondary },
        {
          label: 'Mínimo garantizado',
          value: `⌈${n}/${m}⌉ = ${guaranteed}`,
          color: DATA_COLORS.primary,
        },
      ]}
      legend={[
        { label: 'Objeto', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Nivel garantizado', color: DATA_COLORS.secondary, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`n > m \\;\\Rightarrow\\; \\text{alguna caja tiene al menos } \\left\\lceil \\tfrac{n}{m} \\right\\rceil = \\left\\lceil \\tfrac{${n}}{${m}} \\right\\rceil = ${guaranteed}`}
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0.45}
        minHeight={220}
        maxHeight={380}
        margins={{ top: 12, right: 12, bottom: 30, left: 12 }}
      >
        {(box) => {
          const width = box.inner.width / m;
          const dot = Math.min(
            DOT_RADIUS,
            width / 4,
            box.inner.height / (2 * tallest + 2) - DOT_GAP / 2,
          );
          const floor = box.inner.top + box.inner.height;
          const levelY = (level: number) => floor - (level - 0.5) * (2 * dot + DOT_GAP) - 4;
          const stacks = Array.from({ length: m }, () => 0);
          return (
            <g aria-hidden="true">
              {Array.from({ length: m }, (_, index) => (
                <g key={index}>
                  <rect
                    x={box.inner.left + index * width + 4}
                    y={box.inner.top}
                    width={width - 8}
                    height={box.inner.height}
                    rx={6}
                    fill="var(--color-surface)"
                    stroke="var(--color-border-strong)"
                  />
                  <text
                    x={box.inner.left + (index + 0.5) * width}
                    y={floor + 18}
                    textAnchor="middle"
                    className={svgStyles.labelMuted}
                  >
                    {index + 1}
                  </text>
                </g>
              ))}
              {targets.slice(0, placed).map((target, index) => {
                stacks[target] = (stacks[target] ?? 0) + 1;
                const level = stacks[target] ?? 1;
                const crowded = level >= 2;
                return (
                  <circle
                    key={index}
                    cx={box.inner.left + (target + 0.5) * width}
                    cy={levelY(level)}
                    r={dot}
                    fill={crowded ? DATA_COLORS.secondary : DATA_COLORS.primary}
                    stroke={index === placed - 1 ? DATA_COLORS.text : 'none'}
                    strokeWidth={2}
                  />
                );
              })}
              {n > m && (
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={levelY(guaranteed)}
                  y2={levelY(guaranteed)}
                  stroke={DATA_COLORS.secondary}
                  strokeDasharray="6 4"
                  strokeWidth={2}
                />
              )}
            </g>
          );
        }}
      </ChartSvg>
      <p className={styles.verdict}>{verdict}</p>
    </VizFrame>
  );
}
