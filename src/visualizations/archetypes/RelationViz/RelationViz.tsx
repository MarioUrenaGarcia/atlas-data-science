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
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import { DigraphDiagram } from './DigraphDiagram.tsx';
import { HasseDiagram } from './HasseDiagram.tsx';
import { MatrixDiagram } from './MatrixDiagram.tsx';
import { PlaneDiagram } from './PlaneDiagram.tsx';
import styles from './RelationViz.module.css';
import { RULES, type RelationRule } from './rules.ts';
import type { RelationVizConfig } from './schema.ts';

const CELLS_PER_SECOND = 10;

type View = 'matriz' | 'grafo' | 'plano' | 'hasse';

const VIEWS = [
  { value: 'matriz', label: 'Matriz' },
  { value: 'grafo', label: 'Grafo de flechas' },
  { value: 'plano', label: 'Puntos en A × A' },
  { value: 'hasse', label: 'Diagrama de Hasse' },
] as const;

/**
 * The pairs of the relation are revealed one at a time, drawn as a matrix, as
 * a graph of arrows or as points of A x A. Once complete, each property is
 * checked and its first counterexample outlined; for equivalence relations
 * the pairs are colored by class.
 */
export default function RelationViz({ params, title }: VisualizationProps) {
  const config = params as unknown as RelationVizConfig;
  const rules = useMemo(
    () => config.relaciones ?? [config.relacion],
    [config.relaciones, config.relacion],
  );
  const elements = config.elementos;
  const labels = config.etiquetas ?? elements.map(String);
  const [view, setView] = useState<View>(config.vista ?? 'matriz');
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
      // Only congruence and closeness depend on the constant k.
      ...(rules.some((id) => id === 'congruencia' || id === 'cercania')
        ? [
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
          ]
        : []),
    ],
    [rules, config.relacion, config.k],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const rule = (rules.length > 1 ? String(values.relacion) : config.relacion) as RelationRule;
  const k = Number(values.k ?? config.k ?? 3);
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
    if (name === 'reflexiva') return `no: ${labels[i]} no se relaciona consigo mismo`;
    if (name === 'simetrica')
      return `no: ${labels[i]} R ${labels[j]} pero no ${labels[j]} R ${labels[i]}`;
    if (name === 'antisimetrica')
      return `no: ${labels[i]} R ${labels[j]} y ${labels[j]} R ${labels[i]}`;
    return `no: ${labels[i]} R ${labels[j]} y ${labels[j]} R ${labels[m]}, pero no ${labels[i]} R ${labels[m]}`;
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
                .map((members) => `{${members.map((index) => labels[index]).join(', ')}}`)
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

  const diagram = {
    elements,
    labels,
    matrix,
    filled,
    witnessCells,
    classOf,
    colorByClass: complete && isEquivalence,
    label: description,
  };

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      views={{ options: VIEWS, value: view, onChange: (next) => setView(next as View) }}
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
      {view === 'matriz' && <MatrixDiagram {...diagram} />}
      {view === 'grafo' && <DigraphDiagram {...diagram} />}
      {view === 'plano' && <PlaneDiagram {...diagram} />}
      {view === 'hasse' && (
        <HasseDiagram
          {...diagram}
          isOrder={checks.reflexiva.holds && checks.antisimetrica.holds && checks.transitiva.holds}
        />
      )}
    </VizFrame>
  );
}
