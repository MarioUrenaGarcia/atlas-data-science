import { useMemo, useState } from 'react';
import {
  catalan,
  dyckPaths,
  dyckWord,
  polygonTriangulations,
} from '../../../lib/combinatorics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './CatalanViz.module.css';
import type { CatalanVizConfig } from './schema.ts';

type View = 'caminos' | 'parentesis' | 'triangulaciones';

const VIEWS = [
  { value: 'caminos', label: 'Caminos de montaña' },
  { value: 'parentesis', label: 'Paréntesis' },
  { value: 'triangulaciones', label: 'Triangulaciones' },
] as const;

const MIN_OBJECTS_PER_SECOND = 1;
const TARGET_SECONDS = 25;

/**
 * Three families counted by the Catalan numbers, listed one object at a time:
 * mountain paths that never go below the ground, balanced parentheses, and
 * triangulations of a convex polygon with n + 2 corners.
 */
export default function CatalanViz({ params, title }: VisualizationProps) {
  const config = params as unknown as CatalanVizConfig;
  const [view, setView] = useState<View>(config.vista ?? 'caminos');
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'n',
        label: 'Tamaño',
        symbol: 'n',
        min: 1,
        max: 6,
        step: 1,
        default: config.n ?? 4,
      },
    ],
    [config.n],
  );
  const parameters = useParameters(definitions);
  const n = Number((parameters.values as Record<string, number>).n);
  const paths = useMemo(() => dyckPaths(n), [n]);
  const triangulations = useMemo(() => polygonTriangulations(n + 2), [n]);
  const total = view === 'triangulaciones' ? triangulations.length : paths.length;
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${view}|${n}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: Math.max(MIN_OBJECTS_PER_SECOND, total / TARGET_SECONDS),
    done: shown >= total,
  });
  const index = Math.max(0, shown - 1);
  const path = paths[index] ?? [];
  const triangulation = triangulations[index] ?? [];
  const recurrence = Array.from({ length: n }, (_, i) => `C_{${i}}C_{${n - 1 - i}}`).join(' + ');
  const objectName =
    view === 'caminos'
      ? 'caminos'
      : view === 'parentesis'
        ? 'palabras de paréntesis'
        : 'triangulaciones';
  const description =
    `Para n = ${n} hay C(${n}) = ${catalan(n)} ${objectName}. Listados: ${shown}. ` +
    (shown > 0
      ? view === 'triangulaciones'
        ? `La triangulación actual usa las diagonales ${triangulation.map(([a, b]) => `${a + 1}-${b + 1}`).join(', ')}.`
        : `El actual es ${dyckWord(path)}.`
      : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      views={{ options: VIEWS, value: view, onChange: (next) => setView(next as View) }}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'Listados', value: `${shown} de ${total}` },
        { label: `C(${n})`, value: String(catalan(n)), color: DATA_COLORS.primary },
        {
          label: 'Actual',
          value:
            shown === 0
              ? 'ninguno'
              : view === 'triangulaciones'
                ? `${triangulation.length} diagonales`
                : dyckWord(path),
          color: DATA_COLORS.highlight,
        },
      ]}
      description={description}
      dataTable={{
        caption: 'Números de Catalan',
        columns: ['n', 'C(n)'],
        rows: Array.from({ length: 11 }, (_, size) => [size, catalan(size)]),
      }}
    >
      <p className={styles.formula}>
        <Latex
          tex={`C_{${n}} = \\frac{1}{${n + 1}}\\binom{${2 * n}}{${n}} = ${recurrence} = ${catalan(n)}`}
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={220}
        maxHeight={380}
        margins={{ top: 16, right: 16, bottom: 24, left: 16 }}
      >
        {(box) => {
          if (view === 'triangulaciones') {
            const corners = n + 2;
            const radius = Math.min(box.inner.width, box.inner.height) / 2 - 8;
            const cx = box.inner.left + box.inner.width / 2;
            const cy = box.inner.top + box.inner.height / 2;
            const corner = (i: number) => {
              const angle = -Math.PI / 2 + (2 * Math.PI * i) / corners;
              return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
            };
            const outline = Array.from({ length: corners }, (_, i) => corner(i));
            return (
              <g aria-hidden="true">
                <polygon
                  points={outline.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill={DATA_COLORS.light}
                  fillOpacity={0.15}
                  stroke={DATA_COLORS.primary}
                  strokeWidth={2.5}
                />
                {shown > 0 &&
                  triangulation.map(([a, b]) => {
                    const from = corner(a);
                    const to = corner(b);
                    return (
                      <line
                        key={`${a}-${b}`}
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke={DATA_COLORS.secondary}
                        strokeWidth={2.5}
                      />
                    );
                  })}
                {outline.map((p, i) => (
                  <g key={i}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={10}
                      fill="var(--color-surface)"
                      stroke={DATA_COLORS.primary}
                    />
                    <text
                      x={p.x}
                      y={p.y}
                      dy="0.35em"
                      textAnchor="middle"
                      className={svgStyles.label}
                      style={{ fontSize: 10 }}
                    >
                      {i + 1}
                    </text>
                  </g>
                ))}
              </g>
            );
          }
          const steps = 2 * n;
          const unit = Math.min(box.inner.width / steps, box.inner.height / Math.max(2, n));
          const left = box.inner.left + (box.inner.width - unit * steps) / 2;
          const ground = box.inner.top + box.inner.height;
          let height = 0;
          const points = [{ x: left, y: ground }];
          path.forEach((step, position) => {
            height += step;
            points.push({ x: left + (position + 1) * unit, y: ground - height * unit });
          });
          const word = dyckWord(path);
          return (
            <g aria-hidden="true">
              <line
                x1={left}
                x2={left + steps * unit}
                y1={ground}
                y2={ground}
                stroke="var(--color-border-strong)"
                strokeWidth={2}
              />
              {view === 'caminos' && shown > 0 && (
                <polyline
                  points={points.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill={DATA_COLORS.primary}
                  fillOpacity={0.15}
                  stroke={DATA_COLORS.primary}
                  strokeWidth={3}
                  strokeLinejoin="round"
                />
              )}
              {view === 'parentesis' && shown > 0 && (
                <>
                  <polyline
                    points={points.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="var(--color-border-strong)"
                    strokeDasharray="4 4"
                  />
                  {[...word].map((symbol, position) => (
                    <text
                      key={position}
                      x={left + (position + 0.5) * unit}
                      y={
                        ((points[position]?.y ?? ground) + (points[position + 1]?.y ?? ground)) /
                          2 -
                        10
                      }
                      textAnchor="middle"
                      className={svgStyles.label}
                      style={{
                        fontSize: Math.min(28, unit * 0.8),
                        fontWeight: 700,
                        fill: symbol === '(' ? DATA_COLORS.primary : DATA_COLORS.secondary,
                      }}
                    >
                      {symbol}
                    </text>
                  ))}
                </>
              )}
            </g>
          );
        }}
      </ChartSvg>
      <ul tabIndex={0} className={styles.list} aria-label="Objetos listados">
        {Array.from({ length: shown }, (_, position) => (
          <li
            key={position}
            className={
              position === shown - 1 ? `${styles.item} ${styles.itemCurrent}` : styles.item
            }
          >
            {view === 'triangulaciones'
              ? (triangulations[position] ?? []).map(([a, b]) => `${a + 1}-${b + 1}`).join(' ')
              : dyckWord(paths[position] ?? [])}
          </li>
        ))}
      </ul>
    </VizFrame>
  );
}
