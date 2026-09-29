import { useMemo, useState } from 'react';
import {
  antisymmetric,
  equivalenceClasses,
  reflexive,
  relationMatrix,
  symmetric,
  transitive,
  type PropertyCheck,
} from '../../../lib/sets/relations.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './RelationViz.module.css';
import { RULES, type RelationRule } from './rules.ts';
import type { RelationVizConfig } from './schema.ts';

const CELLS_PER_SECOND = 10;

/**
 * The relation is filled in as a matrix, cell (a, b) marked when a R b. Once
 * complete, each property is checked and its first counterexample outlined;
 * for equivalence relations the cells are colored by class.
 */
export default function RelationViz({ params, title }: VisualizationProps) {
  const config = params as unknown as RelationVizConfig;
  const rules = useMemo(
    () => config.relaciones ?? [config.relacion],
    [config.relaciones, config.relacion],
  );
  const elements = config.elementos;
  const definitions = useMemo(
    () => [
      ...(rules.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'relacion',
              label: 'Relación',
              options: rules.map((id) => ({ value: id, label: RULES[id].label(config.k ?? 3) })),
              default: config.relacion,
            },
          ]
        : []),
      {
        type: 'number' as const,
        key: 'k',
        label: 'Constante k',
        symbol: 'k',
        min: 1,
        max: 6,
        step: 1,
        default: config.k ?? 3,
      },
    ],
    [rules, config.relacion, config.k],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const rule = (rules.length > 1 ? String(values.relacion) : config.relacion) as RelationRule;
  const k = Number(values.k);
  const matrix = useMemo(
    () => relationMatrix(elements, (a, b) => RULES[rule].test(a, b, k)),
    [elements, rule, k],
  );
  const total = elements.length * elements.length;
  const [run, setRun] = useState(0);
  const [filled, update] = useResettableState<number>(`${rule}|${k}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    stepMany: (count) => update((value) => Math.min(total, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: CELLS_PER_SECOND,
    done: filled >= total,
  });
  const complete = filled >= total;
  const checks = {
    reflexiva: reflexive(matrix),
    simetrica: symmetric(matrix),
    antisimetrica: antisymmetric(matrix),
    transitiva: transitive(matrix),
  };
  const isEquivalence = checks.reflexiva.holds && checks.simetrica.holds && checks.transitiva.holds;
  const classes = isEquivalence ? equivalenceClasses(matrix) : [];
  const classOf = new Map<number, number>();
  classes.forEach((members, index) => members.forEach((member) => classOf.set(member, index)));
  const pairs = matrix.reduce((count, row) => count + row.filter(Boolean).length, 0);

  const describe = (name: string, check: PropertyCheck) => {
    if (check.holds) return 'sí';
    const [i = 0, j = 0, m = 0] = check.witness ?? [];
    if (name === 'reflexiva') return `no: ${elements[i]} no se relaciona consigo mismo`;
    if (name === 'simetrica')
      return `no: ${elements[i]} R ${elements[j]} pero no ${elements[j]} R ${elements[i]}`;
    if (name === 'antisimetrica')
      return `no: ${elements[i]} R ${elements[j]} y ${elements[j]} R ${elements[i]}`;
    return `no: ${elements[i]} R ${elements[j]} y ${elements[j]} R ${elements[m]}, pero no ${elements[i]} R ${elements[m]}`;
  };
  const witnessCells = new Set<string>();
  if (complete) {
    for (const [name, check] of Object.entries(checks)) {
      if (check.holds || !check.witness || name === 'antisimetrica') continue;
      const [i = 0, j = 0, m = 0] = check.witness;
      if (name === 'reflexiva') witnessCells.add(`${i},${i}`);
      if (name === 'simetrica') witnessCells.add(`${j},${i}`);
      if (name === 'transitiva') witnessCells.add(`${i},${m}`);
    }
  }
  const readouts = complete
    ? [
        { label: 'Pares relacionados', value: `${pairs} de ${total}` },
        { label: 'Reflexiva', value: describe('reflexiva', checks.reflexiva) },
        { label: 'Simétrica', value: describe('simetrica', checks.simetrica) },
        { label: 'Antisimétrica', value: describe('antisimetrica', checks.antisimetrica) },
        { label: 'Transitiva', value: describe('transitiva', checks.transitiva) },
        {
          label: 'Clases de equivalencia',
          value: isEquivalence
            ? classes
                .map((members) => `{${members.map((index) => elements[index]).join(', ')}}`)
                .join(' ')
            : 'no es de equivalencia',
          color: isEquivalence ? DATA_COLORS.tertiary : undefined,
        },
      ]
    : [{ label: 'Celdas revisadas', value: `${filled} de ${total}` }];
  const description = complete
    ? `Relación ${RULES[rule].label(k)}. ${readouts
        .slice(1)
        .map((readout) => `${readout.label}: ${readout.value}`)
        .join('. ')}.`
    : `Se revisan los pares (a, b) de la relación ${RULES[rule].label(k)}: ${filled} de ${total}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={readouts}
      legend={[
        { label: 'a R b', color: DATA_COLORS.primary },
        { label: 'Contraejemplo de una propiedad', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`a \\mathrel{R} b \\iff ${RULES[rule].latex(k)}`} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.62}
        minHeight={260}
        maxHeight={440}
        margins={{ top: 30, right: 12, bottom: 12, left: 40 }}
      >
        {(box) => {
          const size = Math.min(box.inner.width, box.inner.height) / elements.length;
          const left = box.inner.left + (box.inner.width - size * elements.length) / 2;
          return (
            <>
              <text x={left - 26} y={box.inner.top - 12} className={svgStyles.labelMuted}>
                a \ b
              </text>
              {elements.map((element, index) => (
                <g key={element} aria-hidden="true">
                  <text
                    x={left + size * (index + 0.5)}
                    y={box.inner.top - 10}
                    textAnchor="middle"
                    className={svgStyles.label}
                  >
                    {element}
                  </text>
                  <text
                    x={left - 10}
                    y={box.inner.top + size * (index + 0.5)}
                    textAnchor="end"
                    dy="0.35em"
                    className={svgStyles.label}
                  >
                    {element}
                  </text>
                </g>
              ))}
              {matrix.flatMap((row, i) =>
                row.map((related, j) => {
                  const index = i * elements.length + j;
                  const shown = index < filled;
                  const classIndex = classOf.get(i);
                  const fill =
                    complete && isEquivalence && related && classIndex !== undefined
                      ? seriesColor(classIndex)
                      : DATA_COLORS.primary;
                  const witness = witnessCells.has(`${i},${j}`);
                  return (
                    <rect
                      key={`${i}-${j}`}
                      x={left + size * j + 1}
                      y={box.inner.top + size * i + 1}
                      width={size - 2}
                      height={size - 2}
                      rx={3}
                      fill={shown && related ? fill : 'var(--color-surface-2)'}
                      fillOpacity={shown && related ? 0.75 : 1}
                      stroke={
                        witness
                          ? DATA_COLORS.secondary
                          : index === filled - 1
                            ? DATA_COLORS.text
                            : 'var(--color-border)'
                      }
                      strokeWidth={witness || index === filled - 1 ? 3 : 1}
                      aria-hidden="true"
                    />
                  );
                }),
              )}
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
