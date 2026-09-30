import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataTypesViz.module.css';
import {
  allows,
  checkStatements,
  OPERATIONS,
  SCALE_CASES,
  SCALE_NAMES,
  SCALE_ORDER,
  type ScaleVariable,
} from './scales.ts';

const STAGES = 3;
const STAGES_PER_SECOND = 0.5;
const AXIS_GAP = 110;
const POINT_RADIUS = 8;

const VARIABLE_LABELS: Record<ScaleVariable, string> = {
  colores: 'Color de ojos (nominal)',
  satisfaccion: 'Satisfacción con un servicio (ordinal)',
  temperatura: 'Temperatura (de intervalo)',
  peso: 'Peso (de razón)',
};

/**
 * Two observations A and B pass through a transformation that the scale
 * allows. Statements that keep their meaning are the operations the scale
 * supports; the rest change with an arbitrary choice of codes or units.
 */
export function ScalesView({ title, variable }: { title: string; variable: ScaleVariable }) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'select',
      key: 'variable',
      label: 'Variable',
      options: (Object.keys(VARIABLE_LABELS) as ScaleVariable[]).map((value) => ({
        value,
        label: VARIABLE_LABELS[value],
      })),
      default: variable,
    },
  ];
  const parameters = useParameters(definitions);
  const chosen = String(parameters.values.variable) as ScaleVariable;
  const item = SCALE_CASES[chosen];
  const [stage, setStage] = useState(0);
  const playback = usePlayback({
    step: () => setStage((value) => Math.min(STAGES - 1, value + 1)),
    reset: () => setStage(0),
    rate: STAGES_PER_SECOND,
    done: stage >= STAGES - 1,
  });
  const checks = checkStatements(item);
  const transformed = stage >= 1;
  const judged = stage >= 2;
  const label = (value: number) => {
    const index = item.ticks.indexOf(value);
    return item.tickLabels?.[index] ?? `${value} ${item.unit}`.trim();
  };
  const after = (value: number) => {
    const t = item.transform(value);
    return Number.isInteger(t) ? String(t) : t.toFixed(1);
  };
  const header = [
    `\\text{Escala ${SCALE_NAMES[item.scale].toLowerCase()}. Observaciones } A = \\text{${label(item.a)}},\\ B = \\text{${label(item.b)}}`,
    `\\text{${item.transformName}: } ${item.transformTex}`,
    `\\text{Conservan su sentido: } ${checks
      .filter((check) => check.preserved)
      .map((check) => OPERATIONS.find((op) => op.id === check.operation)?.tex ?? '')
      .join(';\\ ')}`,
  ][stage];
  const description =
    `${VARIABLE_LABELS[chosen]}. ${item.transformName}. ` +
    checks
      .map(
        (check) =>
          `${check.before} pasa a ${check.after}: ${check.preserved ? 'conserva su sentido' : 'cambia con la elección de códigos o unidades'}`,
      )
      .join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={checks.map((check) => ({
        label: OPERATIONS.find((op) => op.id === check.operation)?.label ?? check.operation,
        value: transformed ? `${check.before} y luego ${check.after}` : check.before,
      }))}
      legend={[
        { label: 'Observación A', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Observación B', color: DATA_COLORS.highlight, shape: 'circle' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header ?? ''} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.34}
        minHeight={210}
        maxHeight={260}
        margins={{ top: 30, right: 36, bottom: 30, left: 36 }}
      >
        {(box) => {
          const top = box.inner.top + 10;
          const bottom = top + AXIS_GAP;
          const values = item.ticks.map(item.transform);
          const x0 = scaleLinear()
            .domain([Math.min(...item.ticks), Math.max(...item.ticks)])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const x1 = scaleLinear()
            .domain([Math.min(...values), Math.max(...values)])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const point = (value: number, row: 'top' | 'bottom', color: string, name: string) => {
            const cx = row === 'top' ? x0(value) : x1(item.transform(value));
            const cy = row === 'top' ? top : bottom;
            return (
              <g key={`${name}${row}`}>
                <circle cx={cx} cy={cy} r={POINT_RADIUS} fill={color} />
                <text
                  x={cx}
                  y={cy + (row === 'top' ? -14 : 24)}
                  textAnchor="middle"
                  className={styles.chartLabel}
                >
                  {name}
                </text>
              </g>
            );
          };
          return (
            <g>
              <text x={box.inner.left} y={top - 20} className={styles.chartLabel}>
                {item.unit ? `${item.variable} en ${item.unit}` : item.variable}
              </text>
              <line
                x1={box.inner.left}
                x2={box.inner.left + box.inner.width}
                y1={top}
                y2={top}
                stroke={DATA_COLORS.muted}
              />
              {item.ticks.map((tick) => (
                <g key={tick}>
                  <line
                    x1={x0(tick)}
                    x2={x0(tick)}
                    y1={top - 4}
                    y2={top + 4}
                    stroke={DATA_COLORS.muted}
                  />
                  <text x={x0(tick)} y={top + 18} textAnchor="middle" className={styles.chartLabel}>
                    {item.tickLabels ? `${tick}: ${label(tick)}` : String(tick)}
                  </text>
                  {transformed && (
                    <line
                      x1={x0(tick)}
                      x2={x1(item.transform(tick))}
                      y1={top + 24}
                      y2={bottom - 10}
                      stroke={DATA_COLORS.neutral}
                      strokeDasharray="4 3"
                    />
                  )}
                </g>
              ))}
              {point(item.a, 'top', DATA_COLORS.primary, 'A')}
              {point(item.b, 'top', DATA_COLORS.highlight, 'B')}
              {transformed && (
                <g>
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={bottom}
                    y2={bottom}
                    stroke={DATA_COLORS.muted}
                  />
                  {item.ticks.map((tick) => (
                    <text
                      key={tick}
                      x={x1(item.transform(tick))}
                      y={bottom + 40}
                      textAnchor="middle"
                      className={styles.chartLabel}
                    >
                      {after(tick)}
                    </text>
                  ))}
                  <text x={box.inner.left} y={bottom - 14} className={styles.chartLabel}>
                    {item.unitAfter ? `${item.variable} en ${item.unitAfter}` : 'Códigos nuevos'}
                  </text>
                  {point(item.a, 'bottom', DATA_COLORS.primary, 'A')}
                  {point(item.b, 'bottom', DATA_COLORS.highlight, 'B')}
                </g>
              )}
            </g>
          );
        }}
      </ChartSvg>
      <div className={styles.stack}>
        <div
          className={styles.tableScroll}
          role="region"
          aria-label="Afirmaciones sobre A y B"
          tabIndex={0}
        >
          <table className={styles.ops}>
            <thead>
              <tr>
                <th scope="col">Operación</th>
                <th scope="col">Antes</th>
                <th scope="col">Después</th>
                <th scope="col">¿Conserva su sentido?</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((check) => (
                <tr key={check.operation}>
                  <td>{OPERATIONS.find((op) => op.id === check.operation)?.label}</td>
                  <td className="mono">{check.before}</td>
                  <td className="mono">{transformed ? check.after : ''}</td>
                  <td>
                    {judged ? (
                      <span className={check.preserved ? styles.yes : styles.no}>
                        {check.preserved ? 'sí' : 'no'}
                      </span>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className={styles.tableScroll}
          role="region"
          aria-label="Operaciones permitidas por escala"
          tabIndex={0}
        >
          <table className={styles.ops}>
            <thead>
              <tr>
                <th scope="col">Escala</th>
                {OPERATIONS.map((op) => (
                  <th key={op.id} scope="col" title={op.label}>
                    <Latex tex={op.tex} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCALE_ORDER.map((scale) => (
                <tr key={scale} className={scale === item.scale ? styles.activeRow : undefined}>
                  <td>{SCALE_NAMES[scale]}</td>
                  {OPERATIONS.map((op) => (
                    <td key={op.id}>
                      <span className={allows(scale, op.id) ? styles.yes : styles.no}>
                        {allows(scale, op.id) ? 'sí' : 'no'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </VizFrame>
  );
}
