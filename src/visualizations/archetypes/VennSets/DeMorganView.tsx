import { useMemo, useState } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { formatSet, membershipMask } from './setMath.ts';
import styles from './VennSets.module.css';
import { VennDiagram } from './VennDiagram.tsx';

type Law = 'union' | 'interseccion';

interface Stage {
  side: 'izquierda' | 'derecha';
  latex: string;
  regions: number[];
  text: string;
}

/** Construction stages of each side of the chosen law (bit 0: A, bit 1: B). */
function stagesFor(law: Law, a: string, b: string): Stage[] {
  if (law === 'union') {
    return [
      {
        side: 'izquierda',
        latex: `${a} \\cup ${b}`,
        regions: [1, 2, 3],
        text: `Se sombrea la unión de ${a} y ${b}.`,
      },
      {
        side: 'izquierda',
        latex: `(${a} \\cup ${b})^{c}`,
        regions: [0],
        text: 'Se toma su complemento: lo que queda fuera de ambos.',
      },
      {
        side: 'derecha',
        latex: `${a}^{c}`,
        regions: [0, 2],
        text: `Se sombrea el complemento de ${a}.`,
      },
      {
        side: 'derecha',
        latex: `${b}^{c}`,
        regions: [0, 1],
        text: `Se sombrea el complemento de ${b}.`,
      },
      {
        side: 'derecha',
        latex: `${a}^{c} \\cap ${b}^{c}`,
        regions: [0],
        text: 'Se intersectan ambos complementos.',
      },
    ];
  }
  return [
    {
      side: 'izquierda',
      latex: `${a} \\cap ${b}`,
      regions: [3],
      text: `Se sombrea la intersección de ${a} y ${b}.`,
    },
    {
      side: 'izquierda',
      latex: `(${a} \\cap ${b})^{c}`,
      regions: [0, 1, 2],
      text: 'Se toma su complemento: todo excepto la parte común.',
    },
    {
      side: 'derecha',
      latex: `${a}^{c}`,
      regions: [0, 2],
      text: `Se sombrea el complemento de ${a}.`,
    },
    {
      side: 'derecha',
      latex: `${b}^{c}`,
      regions: [0, 1],
      text: `Se sombrea el complemento de ${b}.`,
    },
    {
      side: 'derecha',
      latex: `${a}^{c} \\cup ${b}^{c}`,
      regions: [0, 1, 2],
      text: 'Se unen ambos complementos.',
    },
  ];
}

const STAGES_PER_SECOND = 0.55;

interface DeMorganViewProps {
  title: string;
  universe: readonly number[];
  sets: readonly { etiqueta: string; elementos: number[] }[];
  law: Law;
}

/** Both sides of a De Morgan law built step by step on twin diagrams until they coincide. */
export function DeMorganView({ title, universe, sets, law }: DeMorganViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'ley',
        label: 'Ley',
        options: [
          { value: 'union', label: 'Complemento de una unión' },
          { value: 'interseccion', label: 'Complemento de una intersección' },
        ],
        default: law,
      },
    ],
    [law],
  );
  const parameters = useParameters(definitions);
  const selected = String((parameters.values as Record<string, unknown>).ley) as Law;
  const labels = sets.map((set) => set.etiqueta);
  const [a = 'A', b = 'B'] = labels;
  const masks = universe.map((element) =>
    membershipMask(
      element,
      sets.map((set) => set.elementos),
    ),
  );
  const stages = stagesFor(selected, a, b);
  const [run, setRun] = useState(0);
  const [stage, update] = useResettableState<number>(`${selected}|${run}`, () => 0);

  const playback = usePlayback({
    step: () => update((value) => Math.min(stages.length, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STAGES_PER_SECOND,
    done: stage >= stages.length,
  });

  const lastOf = (side: Stage['side']) =>
    stages
      .slice(0, stage)
      .filter((item) => item.side === side)
      .pop();
  const left = lastOf('izquierda');
  const right = lastOf('derecha');
  const regionsLeft = new Set(left?.regions ?? []);
  const regionsRight = new Set(right?.regions ?? []);
  const elementsIn = (regions: Set<number>) =>
    universe.filter((_, index) => regions.has(masks[index] ?? -1));
  const complete = stage >= stages.length;
  const current = stage > 0 ? stages[stage - 1] : undefined;
  const leftFinal = stages[1]?.latex ?? '';
  const rightFinal = stages[stages.length - 1]?.latex ?? '';
  const description = complete
    ? `Ambos lados coinciden: ${formatSet(elementsIn(regionsLeft))}. Esto ilustra la igualdad entre ${leftFinal.replace(/\\/g, '')} y ${rightFinal.replace(/\\/g, '')}.`
    : current
      ? `Paso ${stage} de ${stages.length}: ${current.text}`
      : 'Los dos diagramas empiezan sin sombrear.';

  const panel = (side: 'izquierda' | 'derecha', item: Stage | undefined, regions: Set<number>) => (
    <div className={styles.panel}>
      <p className={styles.panelTitle}>
        {item ? (
          <Latex tex={item.latex} />
        ) : side === 'izquierda' ? (
          'Lado izquierdo'
        ) : (
          'Lado derecho'
        )}
      </p>
      <VennDiagram
        labels={labels}
        elements={universe}
        masks={masks}
        shaded={regions}
        shadeColor={side === 'izquierda' ? DATA_COLORS.highlight : DATA_COLORS.light}
        label={`${side === 'izquierda' ? 'Lado izquierdo' : 'Lado derecho'}: ${formatSet(elementsIn(regions))}`}
        compact
      />
    </div>
  );

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'Paso', value: `${stage} de ${stages.length}` },
        {
          label: 'Lado izquierdo',
          value: formatSet(elementsIn(regionsLeft)),
          color: DATA_COLORS.highlight,
        },
        {
          label: 'Lado derecho',
          value: formatSet(elementsIn(regionsRight)),
          color: DATA_COLORS.light,
        },
      ]}
      description={description}
    >
      <p className={styles.expression}>
        <Latex tex={`${leftFinal} = ${rightFinal}`} display />
      </p>
      <div className={styles.panels}>
        {panel('izquierda', left, regionsLeft)}
        {panel('derecha', right, regionsRight)}
      </div>
      <p className={complete ? styles.equal : styles.stage}>{description}</p>
    </VizFrame>
  );
}
