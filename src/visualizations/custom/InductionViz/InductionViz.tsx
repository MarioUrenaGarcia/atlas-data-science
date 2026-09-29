import { useMemo, useState } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './InductionViz.module.css';
import type { InductionVizConfig } from './schema.ts';

type View = 'fichas' | 'escalera';

const VIEWS = [
  { value: 'fichas', label: 'Base y paso' },
  { value: 'escalera', label: 'Suma 1 + 2 + ... + n' },
] as const;

const STEPS_PER_SECOND = 1.6;
const FALL_ANGLE = 62;

/**
 * Dominoes: the base case knocks down the first piece and the inductive step
 * guarantees that each falling piece knocks down the next one. Removing the
 * base or breaking the step at some k stops the chain, which is why both
 * parts are needed. The second view proves 1 + 2 + ... + n = n(n+1)/2 by
 * adding one column at a time to a staircase and completing a rectangle.
 */
export default function InductionViz({ params, title }: VisualizationProps) {
  const config = params as unknown as InductionVizConfig;
  const [view, setView] = useState<View>(config.vista ?? 'fichas');
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'n',
        label: 'Número de piezas',
        symbol: 'n',
        min: 2,
        max: 14,
        step: 1,
        default: config.n ?? 10,
      },
      { type: 'toggle' as const, key: 'base', label: 'Se cumple el caso base', default: true },
      {
        type: 'number' as const,
        key: 'falla',
        label: 'El paso falla en k (0: nunca falla)',
        symbol: 'k',
        min: 0,
        max: 13,
        step: 1,
        default: 0,
      },
    ],
    [config.n],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | boolean>;
  const n = Number(values.n);
  const base = Boolean(values.base);
  const breakAt = Number(values.falla);
  const [run, setRun] = useState(0);
  const [time, update] = useResettableState<number>(
    `${view}|${n}|${base}|${breakAt}|${run}`,
    () => 0,
  );
  const playback = usePlayback({
    step: () => update((value) => Math.min(n, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STEPS_PER_SECOND,
    done: time >= n,
  });

  // Pieces that fall: none without the base case, otherwise up to the first broken step.
  const lastPossible = !base ? 0 : breakAt > 0 && breakAt < n ? breakAt : n;
  const fallen = view === 'fichas' ? Math.min(time, lastPossible) : 0;

  const staircase = time;
  const sum = (staircase * (staircase + 1)) / 2;
  const description =
    view === 'fichas'
      ? !base
        ? 'Sin caso base ninguna pieza cae, aunque el paso inductivo se cumpla.'
        : `Han caído ${fallen} de ${n} piezas.` +
          (breakAt > 0 && breakAt < n
            ? ` El paso falla en k = ${breakAt}: la pieza ${breakAt} cae pero no tumba a la ${breakAt + 1}.`
            : ' Base y paso se cumplen, así que caen todas.')
      : `Escalera con columnas de altura 1 a ${staircase}: ${sum} bloques. Con una copia girada forma un rectángulo de ${staircase} por ${staircase + 1}, así que la suma es ${staircase}(${staircase} + 1)/2 = ${sum}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      views={{ options: VIEWS, value: view, onChange: (next) => setView(next as View) }}
      parameters={{ ...parameters, values, disabled: view === 'escalera' ? ['base', 'falla'] : [] }}
      readouts={
        view === 'fichas'
          ? [
              { label: 'Piezas caídas', value: `${fallen} de ${n}`, color: DATA_COLORS.primary },
              { label: 'Caso base P(1)', value: base ? 'se cumple' : 'no se cumple' },
              {
                label: 'Paso P(k) implica P(k + 1)',
                value:
                  breakAt > 0 && breakAt < n ? `falla en k = ${breakAt}` : 'se cumple para todo k',
              },
            ]
          : [
              { label: 'n', value: String(staircase) },
              { label: '1 + 2 + ... + n', value: String(sum), color: DATA_COLORS.primary },
              { label: 'n(n + 1)/2', value: String(sum), color: DATA_COLORS.secondary },
            ]
      }
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={
            view === 'fichas'
              ? '\\big[P(1) \\land \\forall k\\,(P(k) \\Rightarrow P(k+1))\\big] \\Rightarrow \\forall n\\ P(n)'
              : '\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}'
          }
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0.45}
        minHeight={220}
        maxHeight={380}
        margins={{ top: 16, right: 16, bottom: 26, left: 16 }}
      >
        {(box) => {
          if (view === 'fichas') {
            const spacing = box.inner.width / (n + 1);
            const height = Math.min(box.inner.height * 0.8, spacing * 1.8);
            const width = Math.max(6, spacing * 0.22);
            const floor = box.inner.top + box.inner.height;
            return (
              <g aria-hidden="true">
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={floor}
                  y2={floor}
                  stroke="var(--data-axis)"
                />
                {Array.from({ length: n }, (_, index) => {
                  const piece = index + 1;
                  const down = piece <= fallen;
                  const x = box.inner.left + spacing * (index + 0.8);
                  const broken = breakAt > 0 && piece === breakAt + 1;
                  return (
                    <g key={piece}>
                      <rect
                        x={x - width / 2}
                        y={floor - height}
                        width={width}
                        height={height}
                        rx={2}
                        fill={down ? DATA_COLORS.primary : 'var(--color-surface-3)'}
                        stroke={broken ? DATA_COLORS.secondary : 'var(--color-border-strong)'}
                        strokeWidth={broken ? 2.5 : 1}
                        className={svgStyles.movable}
                        style={{
                          transformOrigin: `${x + width / 2}px ${floor}px`,
                          transform: `rotate(${down ? FALL_ANGLE : 0}deg)`,
                        }}
                      />
                      <text
                        x={x}
                        y={floor + 16}
                        textAnchor="middle"
                        className={svgStyles.labelMuted}
                      >
                        {piece}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          }
          const maxN = n;
          const unit = Math.min(box.inner.width / (maxN + 2), box.inner.height / (maxN + 1));
          const left = box.inner.left + (box.inner.width - unit * (maxN + 1)) / 2;
          const floor = box.inner.top + box.inner.height;
          return (
            <g aria-hidden="true">
              {Array.from({ length: staircase }, (_, column) =>
                Array.from({ length: staircase + 1 }, (__, row) => {
                  // Column c of the staircase has height c + 1; the rest of its column belongs to the rotated copy.
                  const inStaircase = row <= column;
                  return (
                    <rect
                      key={`${column}-${row}`}
                      x={left + column * unit + 1}
                      y={floor - (row + 1) * unit + 1}
                      width={unit - 2}
                      height={unit - 2}
                      rx={2}
                      fill={inStaircase ? DATA_COLORS.primary : DATA_COLORS.secondary}
                      fillOpacity={inStaircase ? 0.75 : 0.3}
                    />
                  );
                }),
              )}
              <text x={left} y={box.inner.top + 10} className={svgStyles.labelMuted}>
                {staircase > 0
                  ? `${staircase} × ${staircase + 1} = ${staircase * (staircase + 1)} bloques, la mitad son la suma`
                  : ''}
              </text>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
