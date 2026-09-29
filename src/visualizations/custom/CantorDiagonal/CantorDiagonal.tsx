import { useMemo, useState } from 'react';
import { Random } from '../../../lib/random/index.ts';
import { diagonalComplement } from '../../../lib/sets/enumeration.ts';
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
import styles from './CantorDiagonal.module.css';
import type { CantorDiagonalConfig } from './schema.ts';

const DIGITS_PER_SECOND = 1;

/**
 * A supposed complete list of infinite binary sequences (only the first
 * digits are drawn). The new sequence takes the opposite of the i-th digit of
 * row i, so it differs from every row in at least one place and cannot be in
 * the list. Clicking a digit changes it; the construction always succeeds.
 */
export default function CantorDiagonal({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as CantorDiagonalConfig;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'filas',
        label: 'Filas mostradas de la lista',
        symbol: 'k',
        min: 3,
        max: 10,
        step: 1,
        default: config.lista?.length ?? config.filas ?? 6,
      },
    ],
    [config.filas, config.lista?.length],
  );
  const parameters = useParameters(definitions);
  const size = Number((parameters.values as Record<string, number>).filas);
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const [state, update] = useResettableState<{ rows: number[][]; built: number }>(
    `${size}|${seed.seed}|${run}`,
    () => {
      const random = new Random(seed.seed);
      return {
        // Rows given in the configuration come first; missing digits and rows are drawn at random.
        rows: Array.from({ length: size }, (_, row) =>
          Array.from({ length: size + 3 }, (__, column) => {
            const given = config.lista?.[row]?.[column];
            const drawn = random.bernoulli(0.5) ? 1 : 0;
            return given ?? drawn;
          }),
        ),
        built: 0,
      };
    },
  );
  const playback = usePlayback({
    step: () => update((previous) => ({ ...previous, built: Math.min(size, previous.built + 1) })),
    reset: () => setRun((value) => value + 1),
    rate: DIGITS_PER_SECOND,
    done: state.built >= size,
  });
  const diagonal = diagonalComplement(state.rows);
  const complete = state.built >= size;
  const current = state.built - 1;
  const description = complete
    ? `La sucesión nueva ${diagonal.join('')}... difiere de la fila i en el dígito i para cada i de 1 a ${size}; por eso no aparece en la lista.`
    : current >= 0
      ? `Dígito ${current + 1}: la fila ${current + 1} tiene ${state.rows[current]?.[current]} en la posición ${current + 1}, así que la sucesión nueva lleva ${diagonal[current]}.`
      : 'Se recorre la diagonal de la lista para construir una sucesión que no esté en ella.';

  const toggle = (row: number, column: number) => {
    playback.pause();
    update((previous) => ({
      ...previous,
      rows: previous.rows.map((digits, r) =>
        r === row ? digits.map((digit, c) => (c === column ? 1 - digit : digit)) : digits,
      ),
    }));
  };

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'Dígitos construidos', value: `${state.built} de ${size}` },
        {
          label: 'Sucesión nueva d',
          value: `${diagonal.slice(0, state.built).join('')}${complete ? '...' : ''}`,
          color: DATA_COLORS.secondary,
        },
      ]}
      legend={[
        { label: 'Diagonal de la lista', color: DATA_COLORS.highlight },
        { label: 'Sucesión nueva: dígitos invertidos', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={'d_i = 1 - s_i(i) \\implies d \\neq s_i \\ \\text{para todo } i'} />
      </p>
      <ChartSvg
        interactive
        label={description}
        aspect={0.62}
        minHeight={260}
        maxHeight={460}
        margins={{ top: 14, right: 14, bottom: 14, left: 50 }}
      >
        {(box) => {
          const columns = size + 3;
          const cell = Math.min(box.inner.width / (columns + 1), box.inner.height / (size + 2));
          const x = (column: number) => box.inner.left + column * cell;
          const y = (row: number) => box.inner.top + row * cell;
          return (
            <>
              {state.rows.map((digits, row) => (
                <g key={row}>
                  <text
                    x={box.inner.left - 10}
                    y={y(row) + cell / 2}
                    textAnchor="end"
                    dy="0.35em"
                    className={svgStyles.labelMuted}
                    aria-hidden="true"
                  >
                    s{row + 1}
                  </text>
                  {digits.map((digit, column) => {
                    const onDiagonal = row === column;
                    const reached = onDiagonal && row < state.built;
                    return (
                      <g
                        key={column}
                        role="button"
                        tabIndex={0}
                        aria-label={`Fila ${row + 1}, dígito ${column + 1}: ${digit}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggle(row, column)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            toggle(row, column);
                          }
                        }}
                      >
                        <rect
                          x={x(column) + 1}
                          y={y(row) + 1}
                          width={cell - 2}
                          height={cell - 2}
                          rx={4}
                          fill={onDiagonal ? DATA_COLORS.highlight : 'var(--color-surface-2)'}
                          fillOpacity={onDiagonal ? (reached ? 0.55 : 0.2) : 1}
                          stroke={
                            row === current && onDiagonal ? DATA_COLORS.text : 'var(--color-border)'
                          }
                          strokeWidth={row === current && onDiagonal ? 2.5 : 1}
                        />
                        <text
                          x={x(column) + cell / 2}
                          y={y(row) + cell / 2}
                          textAnchor="middle"
                          dy="0.35em"
                          className={svgStyles.label}
                        >
                          {digit}
                        </text>
                      </g>
                    );
                  })}
                  <text
                    x={x(columns) + 6}
                    y={y(row) + cell / 2}
                    dy="0.35em"
                    className={svgStyles.labelMuted}
                    aria-hidden="true"
                  >
                    ...
                  </text>
                </g>
              ))}
              <g aria-hidden="true">
                <text
                  x={box.inner.left - 10}
                  y={y(size + 1) + cell / 2}
                  textAnchor="end"
                  dy="0.35em"
                  className={svgStyles.label}
                  style={{ fontWeight: 700, fill: DATA_COLORS.secondary }}
                >
                  d
                </text>
                {diagonal.map((digit, column) => (
                  <g key={column}>
                    <rect
                      x={x(column) + 1}
                      y={y(size + 1) + 1}
                      width={cell - 2}
                      height={cell - 2}
                      rx={4}
                      fill={DATA_COLORS.secondary}
                      fillOpacity={column < state.built ? 0.4 : 0.06}
                      stroke={DATA_COLORS.secondary}
                    />
                    {column < state.built && (
                      <text
                        x={x(column) + cell / 2}
                        y={y(size + 1) + cell / 2}
                        textAnchor="middle"
                        dy="0.35em"
                        className={svgStyles.label}
                        style={{ fontWeight: 700 }}
                      >
                        {digit}
                      </text>
                    )}
                  </g>
                ))}
              </g>
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
