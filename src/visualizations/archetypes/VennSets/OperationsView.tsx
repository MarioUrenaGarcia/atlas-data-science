import { useMemo, useState } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { SetOperation } from './schema.ts';
import {
  formatSet,
  membershipMask,
  OPERATION_LABELS,
  OPERATION_REGIONS,
  operationLatex,
} from './setMath.ts';
import styles from './VennSets.module.css';
import { VennDiagram } from './VennDiagram.tsx';

const CHECKS_PER_SECOND = 2.5;

interface OperationsViewProps {
  title: string;
  universe: readonly number[];
  sets: readonly { etiqueta: string; elementos: number[] }[];
  operation: SetOperation;
  operations: readonly SetOperation[];
}

/** Each element of the universe is tested in turn and joins the result when it satisfies the operation. */
export function OperationsView({
  title,
  universe,
  sets,
  operation,
  operations,
}: OperationsViewProps) {
  const definitions = useMemo(
    () =>
      operations.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'operacion',
              label: 'Operación',
              options: operations.map((id) => ({ value: id, label: OPERATION_LABELS[id] })),
              default: operation,
            },
          ]
        : [],
    [operations, operation],
  );
  const parameters = useParameters(definitions);
  const selected = (
    operations.length > 1
      ? String((parameters.values as Record<string, unknown>).operacion)
      : operation
  ) as SetOperation;
  const labels = sets.map((set) => set.etiqueta);
  const [a = 'A', b = 'B'] = labels;
  const members = sets.map((set) => set.elementos);
  const masks = universe.map((element) => membershipMask(element, members));
  const regions = new Set(OPERATION_REGIONS[selected]);
  const [run, setRun] = useState(0);
  const [checked, update] = useResettableState<number>(`${selected}|${run}`, () => 0);

  const playback = usePlayback({
    step: () => update((value) => Math.min(universe.length, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: CHECKS_PER_SECOND,
    done: checked >= universe.length,
  });

  const verdicts = new Map<number, boolean>();
  universe
    .slice(0, checked)
    .forEach((element, index) => verdicts.set(element, regions.has(masks[index] ?? 0)));
  const result = universe.filter((_, index) => index < checked && regions.has(masks[index] ?? 0));
  const complete = checked >= universe.length;
  const current = checked > 0 ? (universe[checked - 1] ?? null) : null;
  const expression = operationLatex(selected, a, b);
  const description =
    `${OPERATION_LABELS[selected]} de ${a} y ${b}. ${complete ? 'Resultado' : `Tras revisar ${checked} de ${universe.length} elementos, resultado parcial`}: ${formatSet(result)}, ` +
    `con ${result.length} elementos.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={
        definitions.length > 0
          ? { ...parameters, values: parameters.values as Record<string, unknown> }
          : undefined
      }
      readouts={[
        { label: a, value: formatSet(members[0] ?? []), color: 'var(--data-1)' },
        { label: b, value: formatSet(members[1] ?? []), color: 'var(--data-2)' },
        { label: 'Resultado', value: formatSet(result), color: DATA_COLORS.tertiary },
        { label: 'Cardinalidad del resultado', value: String(result.length) },
      ]}
      legend={[
        { label: 'Región de la operación', color: DATA_COLORS.highlight },
        {
          label: 'Elemento que pertenece al resultado',
          color: DATA_COLORS.tertiary,
          shape: 'circle',
        },
      ]}
      description={description}
    >
      <p className={styles.expression}>
        <Latex tex={`${expression} = \\{x \\in U : ${membershipCondition(selected, a, b)}\\}`} />
      </p>
      <VennDiagram
        labels={labels}
        elements={universe}
        masks={masks}
        shaded={regions}
        highlighted={verdicts}
        current={current}
        label={description}
      />
    </VizFrame>
  );
}

function membershipCondition(operation: SetOperation, a: string, b: string): string {
  switch (operation) {
    case 'union':
      return `x \\in ${a} \\lor x \\in ${b}`;
    case 'interseccion':
      return `x \\in ${a} \\land x \\in ${b}`;
    case 'complemento':
      return `x \\notin ${a}`;
    case 'diferencia':
      return `x \\in ${a} \\land x \\notin ${b}`;
    case 'diferencia-simetrica':
      return `x \\in ${a} \\oplus x \\in ${b}`;
  }
}
