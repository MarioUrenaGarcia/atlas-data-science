import type { Experiment, Outcome } from '../../../lib/probability/sampleSpace.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';

export interface CellStyle {
  color: string;
  opacity: number;
}

interface SpaceGridProps {
  experiment: Experiment;
  label: string;
  /** Fill of each outcome cell; null leaves the neutral background. */
  fill: (outcome: Outcome, index: number) => CellStyle | null;
  /** Text inside the cell; defaults to the outcome itself. */
  text?: (outcome: Outcome, index: number) => string;
  /** Outcomes drawn with a thick outline, such as the last simulated result. */
  outlined?: ReadonlySet<number>;
  /** Second fill drawn as a hatched stripe, used to show event B under A. */
  stripe?: (outcome: Outcome, index: number) => string | null;
}

const MAX_CELL = 46;
const MIN_TEXT_CELL = 17;
const LABEL_SPACE = 30;

/**
 * The sample space drawn as a grid with one cell per outcome. Rows and
 * columns follow the natural structure of the experiment (first die by
 * second die, suit by rank), so events appear as recognizable shapes.
 */
export function SpaceGrid({ experiment, label, fill, text, outlined, stripe }: SpaceGridProps) {
  const { rows, cols } = experiment;
  const showLabels = cols <= 13;
  const left = showLabels && rows > 1 ? LABEL_SPACE + 12 : 8;
  const top = showLabels ? LABEL_SPACE : 8;
  return (
    <ChartSvg
      label={label}
      aspect={rows / cols}
      minHeight={rows === 1 ? 60 : 160}
      maxHeight={Math.min(560, rows * MAX_CELL + top + 8)}
      margins={{ top, right: 8, bottom: 8, left }}
    >
      {(box) => {
        const cell = Math.min(MAX_CELL, box.inner.width / cols, box.inner.height / rows);
        const x0 = box.inner.left + (box.inner.width - cell * cols) / 2;
        const y0 = box.inner.top + (box.inner.height - cell * rows) / 2;
        const fontSize = Math.min(13, cell * (experiment.id === 'carta' ? 0.42 : 0.34));
        const patternId = `stripe-${experiment.id}`;
        return (
          <g aria-hidden="true">
            <defs>
              <pattern
                id={patternId}
                width={6}
                height={6}
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect width={2.5} height={6} fill={DATA_COLORS.secondary} fillOpacity={0.75} />
              </pattern>
            </defs>
            {showLabels && (
              <>
                {experiment.colLabels.map((name, col) => (
                  <text
                    key={`c${col}`}
                    x={x0 + (col + 0.5) * cell}
                    y={y0 - 8}
                    textAnchor="middle"
                    className={svgStyles.label}
                  >
                    {name}
                  </text>
                ))}
                {rows > 1 &&
                  experiment.rowLabels.map((name, row) => (
                    <text
                      key={`r${row}`}
                      x={x0 - 8}
                      y={y0 + (row + 0.5) * cell}
                      dy="0.35em"
                      textAnchor="end"
                      className={svgStyles.label}
                    >
                      {name}
                    </text>
                  ))}
              </>
            )}
            {experiment.outcomes.map((outcome, index) => {
              const { row, col } = experiment.cell(outcome);
              const style = fill(outcome, index);
              const stripeColor = stripe?.(outcome, index) ?? null;
              const x = x0 + col * cell;
              const y = y0 + row * cell;
              const inset = cell > 10 ? 1 : 0.3;
              return (
                <g key={index}>
                  <rect
                    x={x + inset}
                    y={y + inset}
                    width={cell - 2 * inset}
                    height={cell - 2 * inset}
                    rx={cell > 10 ? 3 : 0}
                    fill={style ? style.color : 'var(--color-surface-2)'}
                    fillOpacity={style ? style.opacity : 1}
                    stroke={cell > 10 ? 'var(--color-border)' : 'none'}
                  />
                  {stripeColor && (
                    <rect
                      x={x + inset}
                      y={y + inset}
                      width={cell - 2 * inset}
                      height={cell - 2 * inset}
                      rx={cell > 10 ? 3 : 0}
                      fill={`url(#${patternId})`}
                    />
                  )}
                  {outlined?.has(index) && (
                    <rect
                      x={x + 1}
                      y={y + 1}
                      width={cell - 2}
                      height={cell - 2}
                      rx={3}
                      fill="none"
                      stroke={DATA_COLORS.text}
                      strokeWidth={Math.max(1.5, Math.min(3, cell / 10))}
                    />
                  )}
                  {cell >= MIN_TEXT_CELL && (
                    <text
                      x={x + cell / 2}
                      y={y + cell / 2}
                      dy="0.35em"
                      textAnchor="middle"
                      className={svgStyles.label}
                      style={{ fontSize }}
                    >
                      {text ? text(outcome, index) : experiment.format(outcome)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      }}
    </ChartSvg>
  );
}
