import { useMemo, useState } from 'react';
import { checkFunction, classifyFunction, image, type Arrow } from '../../../lib/sets/functions.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { ArrowDiagram, type NodeMark } from './ArrowDiagram.tsx';
import styles from './FunctionMapping.module.css';
import type { MappingExample } from './schema.ts';

const ARROWS_PER_SECOND = 1.5;

interface MappingViewProps {
  title: string;
  examples: readonly MappingExample[];
  mode: 'funcion' | 'clasificacion';
}

interface EditState {
  arrows: Arrow[];
  shown: number;
  selected: number | null;
}

/**
 * Arrows appear one at a time and can be redrawn: selecting an element of the
 * domain and then one of the codomain adds or moves its arrow. The readouts
 * report, as the diagram changes, whether it is a function and of what kind.
 */
export function MappingView({ title, examples, mode }: MappingViewProps) {
  const definitions = useMemo(
    () =>
      examples.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'ejemplo',
              label: 'Ejemplo',
              options: examples.map((example, index) => ({
                value: String(index),
                label: example.nombre,
              })),
              default: '0',
            },
          ]
        : [],
    [examples],
  );
  const parameters = useParameters(definitions);
  const chosen =
    examples.length > 1 ? Number((parameters.values as Record<string, unknown>).ejemplo) : 0;
  const example = examples[chosen] ?? examples[0];
  const [run, setRun] = useState(0);
  const [state, update] = useResettableState<EditState>(`${chosen}|${run}`, () => ({
    arrows: (example?.flechas ?? []).map(([from, to]) => [from, to] as const),
    shown: 0,
    selected: null,
  }));
  const playback = usePlayback({
    step: () =>
      update((previous) => ({
        ...previous,
        shown: Math.min(previous.arrows.length, previous.shown + 1),
      })),
    reset: () => setRun((value) => value + 1),
    rate: ARROWS_PER_SECOND,
    done: state.shown >= state.arrows.length,
  });
  if (!example) return null;

  const visible = state.arrows.slice(0, state.shown);
  const complete = state.shown >= state.arrows.length;
  const check = checkFunction(example.dominio.length, state.arrows);
  const kind = classifyFunction(example.codominio.length, state.arrows);
  const reached = image(state.arrows);
  const names = (indices: readonly number[], set: readonly string[]) =>
    indices.map((index) => set[index]).join(', ');

  const onNodeClick = (column: number, index: number) => {
    playback.pause();
    update((previous) => {
      const all = { ...previous, shown: previous.arrows.length };
      if (column === 0) return { ...all, selected: previous.selected === index ? null : index };
      if (previous.selected === null) return all;
      const from = previous.selected;
      let arrows: Arrow[];
      if (mode === 'clasificacion') {
        // Keep a function: moving the arrow of the selected element.
        arrows = [...previous.arrows.filter(([source]) => source !== from), [from, index]];
      } else {
        const exists = previous.arrows.some(
          ([source, target]) => source === from && target === index,
        );
        arrows = exists
          ? previous.arrows.filter(([source, target]) => !(source === from && target === index))
          : [...previous.arrows, [from, index]];
      }
      return { arrows, shown: arrows.length, selected: null };
    });
  };

  const marks: NodeMark[] = [];
  if (complete && mode === 'funcion') {
    check.withoutImage.forEach((index) =>
      marks.push({ column: 0, index, color: DATA_COLORS.secondary }),
    );
    check.withSeveralImages.forEach((index) =>
      marks.push({ column: 0, index, color: DATA_COLORS.secondary }),
    );
    reached.forEach((index) => marks.push({ column: 1, index, color: DATA_COLORS.tertiary }));
  }
  if (complete && mode === 'clasificacion') {
    kind.collision?.forEach((index) =>
      marks.push({ column: 0, index, color: DATA_COLORS.secondary }),
    );
    kind.unreached.forEach((index) =>
      marks.push({ column: 1, index, color: DATA_COLORS.highlight }),
    );
  }

  const readouts =
    mode === 'funcion'
      ? [
          { label: 'Dominio', value: `{${example.dominio.join(', ')}}` },
          { label: 'Codominio', value: `{${example.codominio.join(', ')}}` },
          {
            label: 'Imagen',
            value: `{${names(reached, example.codominio)}}`,
            color: DATA_COLORS.tertiary,
          },
          {
            label: '¿Es función?',
            value: check.isFunction
              ? 'sí'
              : check.withoutImage.length > 0
                ? `no: ${names(check.withoutImage, example.dominio)} sin imagen`
                : `no: ${names(check.withSeveralImages, example.dominio)} con varias imágenes`,
            color: check.isFunction ? undefined : DATA_COLORS.secondary,
          },
        ]
      : [
          {
            label: 'Inyectiva',
            value: kind.injective
              ? 'sí'
              : `no: ${names(kind.collision ?? [], example.dominio)} comparten imagen`,
            color: kind.injective ? undefined : DATA_COLORS.secondary,
          },
          {
            label: 'Suprayectiva',
            value: kind.surjective
              ? 'sí'
              : `no: ${names(kind.unreached, example.codominio)} sin preimagen`,
            color: kind.surjective ? undefined : DATA_COLORS.highlight,
          },
          { label: 'Biyectiva', value: kind.bijective ? 'sí' : 'no' },
          {
            label: '|dominio| y |codominio|',
            value: `${example.dominio.length} y ${example.codominio.length}`,
          },
        ];

  const description =
    `${example.nombre}. ${visible.length} de ${state.arrows.length} flechas dibujadas. ` +
    readouts.map((readout) => `${readout.label} ${readout.value}`).join('. ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={
        definitions.length > 0
          ? { ...parameters, values: parameters.values as Record<string, unknown> }
          : undefined
      }
      readouts={readouts}
      description={description}
      legend={
        mode === 'funcion'
          ? [
              { label: 'Imagen', color: DATA_COLORS.tertiary, shape: 'circle' },
              {
                label: 'Elemento que impide ser función',
                color: DATA_COLORS.secondary,
                shape: 'circle',
              },
            ]
          : [
              {
                label: 'Elementos con la misma imagen',
                color: DATA_COLORS.secondary,
                shape: 'circle',
              },
              { label: 'Elementos sin preimagen', color: DATA_COLORS.highlight, shape: 'circle' },
            ]
      }
    >
      <ArrowDiagram
        columns={[
          { name: 'Dominio', items: example.dominio },
          { name: 'Codominio', items: example.codominio },
        ]}
        arrows={visible.map(([from, to]) => ({
          column: 0,
          from,
          to,
          color: state.selected === from ? DATA_COLORS.text : undefined,
        }))}
        marks={marks}
        selected={state.selected === null ? null : { column: 0, index: state.selected }}
        label={description}
        onNodeClick={onNodeClick}
      />
      <p className={styles.hint}>
        Un clic en un elemento del dominio y luego en uno del codominio{' '}
        {mode === 'funcion' ? 'agrega o quita esa flecha' : 'mueve su flecha'}.
      </p>
    </VizFrame>
  );
}
