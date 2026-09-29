import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { integerAt, zigzagFractions } from '../../../lib/sets/enumeration.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './CountableSets.module.css';
import type { CountableSetsConfig } from './schema.ts';

type View = 'finitos' | 'enteros' | 'racionales';

const VIEWS = [
  { value: 'finitos', label: 'Conjuntos finitos' },
  { value: 'enteros', label: 'Los enteros' },
  { value: 'racionales', label: 'Los racionales' },
] as const;

const STEPS: Record<View, number> = { finitos: 7, enteros: 21, racionales: 28 };
const RATE: Record<View, number> = { finitos: 1.2, enteros: 2, racionales: 3 };
const GRID = 7;
const FINITE_A = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

/**
 * Three ways to count by pairing: matching two finite sets element by
 * element, listing the integers as 0, 1, -1, 2, -2, ... and walking the grid
 * of fractions along its diagonals. Each list assigns a natural number to
 * every element, which is what "countable" means.
 */
export default function CountableSets({ params, title }: VisualizationProps) {
  const config = params as unknown as CountableSetsConfig;
  const [view, setView] = useState<View>(config.vista ?? 'enteros');
  const [run, setRun] = useState(0);
  const total = STEPS[view];
  const [shown, update] = useResettableState<number>(`${view}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: RATE[view],
    done: shown >= total,
  });
  const fractions = useMemo(() => zigzagFractions(STEPS.racionales), []);
  const countedSoFar = fractions.slice(0, shown).filter((step) => step.counted).length;

  let description: string;
  let readouts: { label: string; value: string; color?: string }[];
  if (view === 'finitos') {
    description = `Se emparejan los días de la semana con 1, 2, 3, ... Hay ${shown} pares; al terminar, el conjunto queda en correspondencia con {1, ..., 7}, así que tiene 7 elementos.`;
    readouts = [
      { label: 'Pares formados', value: `${shown} de 7` },
      { label: 'Cardinalidad', value: shown >= 7 ? '7' : 'por determinar' },
    ];
  } else if (view === 'enteros') {
    const listed = Array.from({ length: shown }, (_, index) => integerAt(index));
    description = `Lista de los enteros: ${listed.join(', ')}. Cada entero aparece una sola vez y en una posición finita, por eso Z es numerable.`;
    readouts = [
      { label: 'Posiciones usadas', value: String(shown) },
      {
        label: 'Último entero listado',
        value: shown > 0 ? String(listed[shown - 1]) : 'ninguno',
        color: DATA_COLORS.primary,
      },
    ];
  } else {
    const last = fractions[shown - 1];
    description =
      `Recorrido en zigzag de las fracciones positivas. Se han visitado ${shown} casillas y contado ${countedSoFar} racionales distintos; ` +
      'las fracciones que no están en su mínima expresión se saltan porque su valor ya apareció.';
    readouts = [
      { label: 'Casillas visitadas', value: String(shown) },
      { label: 'Racionales contados', value: String(countedSoFar), color: DATA_COLORS.tertiary },
      {
        label: 'Casilla actual',
        value: last
          ? `${last.numerator}/${last.denominator}${last.counted ? '' : ' (repetida)'}`
          : 'ninguna',
      },
    ];
  }

  return (
    <VizFrame
      title={title}
      playback={playback}
      views={{ options: VIEWS, value: view, onChange: (next) => setView(next as View) }}
      readouts={readouts}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={
            view === 'racionales'
              ? 'f : \\mathbb{N} \\to \\mathbb{Q}^{+} \\text{ biyectiva}'
              : view === 'enteros'
                ? 'f(n) = \\begin{cases} (n+1)/2 & n \\text{ impar} \\\\ -n/2 & n \\text{ par} \\end{cases}'
                : '|A| = n \\iff \\exists\\, f : A \\to \\{1, \\dots, n\\} \\text{ biyectiva}'
          }
        />
      </p>
      <ChartSvg
        label={description}
        aspect={view === 'racionales' ? 0.7 : 0.42}
        minHeight={230}
        maxHeight={440}
        margins={{ top: 20, right: 16, bottom: 20, left: 16 }}
      >
        {(box) => {
          if (view === 'finitos') {
            const x0 = box.inner.left + box.inner.width * 0.25;
            const x1 = box.inner.left + box.inner.width * 0.75;
            const y = (index: number) => box.inner.top + ((index + 0.5) * box.inner.height) / 7;
            return FINITE_A.map((day, index) => (
              <g key={day} aria-hidden="true">
                {index < shown && (
                  <line
                    x1={x0 + 50}
                    x2={x1 - 20}
                    y1={y(index)}
                    y2={y(index)}
                    stroke={DATA_COLORS.primary}
                    strokeWidth={2}
                  />
                )}
                <text
                  x={x0 + 40}
                  y={y(index)}
                  textAnchor="end"
                  dy="0.35em"
                  className={svgStyles.label}
                >
                  {day}
                </text>
                <circle
                  cx={x1}
                  cy={y(index)}
                  r={14}
                  fill={index < shown ? DATA_COLORS.primary : 'var(--color-surface-2)'}
                  fillOpacity={index < shown ? 0.3 : 1}
                  stroke="var(--color-border-strong)"
                />
                <text
                  x={x1}
                  y={y(index)}
                  textAnchor="middle"
                  dy="0.35em"
                  className={svgStyles.label}
                >
                  {index + 1}
                </text>
              </g>
            ));
          }
          if (view === 'enteros') {
            const x = scaleLinear()
              .domain([-10.5, 10.5])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const lineY = box.inner.top + box.inner.height * 0.55;
            return (
              <g aria-hidden="true">
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={lineY}
                  y2={lineY}
                  stroke="var(--data-axis)"
                />
                {Array.from({ length: 21 }, (_, index) => index - 10).map((z) => {
                  const position = z > 0 ? 2 * z - 1 : -2 * z;
                  const listed = position < shown;
                  return (
                    <g key={z}>
                      <circle
                        cx={x(z)}
                        cy={lineY}
                        r={9}
                        fill={listed ? DATA_COLORS.primary : 'var(--color-surface-2)'}
                        fillOpacity={listed ? 0.35 : 1}
                        stroke="var(--color-border-strong)"
                      />
                      <text x={x(z)} y={lineY + 26} textAnchor="middle" className={svgStyles.label}>
                        {z}
                      </text>
                      {listed && (
                        <text
                          x={x(z)}
                          y={lineY - 18}
                          textAnchor="middle"
                          className={svgStyles.labelMuted}
                        >
                          {position + 1}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          }
          const cell = Math.min(box.inner.width, box.inner.height) / GRID;
          const left = box.inner.left + (box.inner.width - cell * GRID) / 2;
          const center = (p: number, q: number) => ({
            x: left + (q - 0.5) * cell,
            y: box.inner.top + (p - 0.5) * cell,
          });
          const visited = fractions.slice(0, shown);
          const path = visited.map((step, index) => {
            const point = center(step.numerator, step.denominator);
            return `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`;
          });
          let counter = 0;
          const numbers = new Map<string, number>();
          for (const step of visited) {
            if (step.counted) {
              counter += 1;
              numbers.set(`${step.numerator}/${step.denominator}`, counter);
            }
          }
          return (
            <g aria-hidden="true">
              <path d={path.join(' ')} fill="none" stroke={DATA_COLORS.highlight} strokeWidth={2} />
              {Array.from({ length: GRID }, (_, p) =>
                Array.from({ length: GRID }, (__, q) => {
                  const numerator = p + 1;
                  const denominator = q + 1;
                  const key = `${numerator}/${denominator}`;
                  const point = center(numerator, denominator);
                  const step = visited.find(
                    (candidate) =>
                      candidate.numerator === numerator && candidate.denominator === denominator,
                  );
                  const number = numbers.get(key);
                  return (
                    <g key={key}>
                      <rect
                        x={point.x - cell * 0.42}
                        y={point.y - cell * 0.32}
                        width={cell * 0.84}
                        height={cell * 0.64}
                        rx={6}
                        fill={
                          step
                            ? step.counted
                              ? DATA_COLORS.tertiary
                              : 'var(--color-surface-3)'
                            : 'var(--color-surface)'
                        }
                        fillOpacity={step?.counted ? 0.3 : 1}
                        stroke="var(--color-border)"
                      />
                      <text
                        x={point.x}
                        y={point.y}
                        textAnchor="middle"
                        dy="0.35em"
                        className={step && !step.counted ? svgStyles.labelMuted : svgStyles.label}
                        style={
                          step && !step.counted ? { textDecoration: 'line-through' } : undefined
                        }
                      >
                        {key}
                      </text>
                      {number !== undefined && (
                        <text
                          x={point.x + cell * 0.38}
                          y={point.y - cell * 0.2}
                          textAnchor="end"
                          className={svgStyles.labelMuted}
                          style={{ fontSize: 9 }}
                        >
                          {number}
                        </text>
                      )}
                    </g>
                  );
                }),
              )}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
