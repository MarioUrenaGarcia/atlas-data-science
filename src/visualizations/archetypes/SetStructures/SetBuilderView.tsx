import { useMemo, useState } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { PREDICATES, type PredicateId } from '../LogicViz/predicates.ts';
import styles from './SetStructures.module.css';

const ELEMENTS_PER_SECOND = 2.5;
const CHIP_RADIUS = 15;

interface SetBuilderViewProps {
  title: string;
  universe: readonly number[];
  predicate: PredicateId;
  predicates: readonly PredicateId[];
  k: number;
}

/** Elements of the universe are tested one by one and move into the set when they satisfy the property. */
export function SetBuilderView({ title, universe, predicate, predicates, k }: SetBuilderViewProps) {
  const definitions = useMemo(
    () => [
      ...(predicates.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'predicado',
              label: 'Propiedad que define el conjunto',
              options: predicates.map((id) => ({ value: id, label: PREDICATES[id].label(k) })),
              default: predicate,
            },
          ]
        : []),
      // Only the threshold predicate depends on k.
      ...(predicates.includes('menor-que')
        ? [
            {
              type: 'number' as const,
              key: 'k',
              label: 'Constante k',
              symbol: 'k',
              min: -10,
              max: 30,
              step: 1,
              default: k,
            },
          ]
        : []),
    ],
    [predicates, predicate, k],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (predicates.length > 1 ? String(values.predicado) : predicate) as PredicateId;
  const constant = Number(values.k ?? k);
  const [run, setRun] = useState(0);
  const [tested, update] = useResettableState<number>(`${selected}|${constant}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(universe.length, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: ELEMENTS_PER_SECOND,
    done: tested >= universe.length,
  });

  const rule = PREDICATES[selected];
  const members = universe.filter((x, index) => index < tested && rule.test(x, constant));
  const complete = tested >= universe.length;
  const current = tested > 0 ? universe[tested - 1] : undefined;
  const extension = members.length === 0 ? '\\varnothing' : `\\{${members.join(', ')}\\}`;
  const description =
    `Conjunto de los elementos de U que cumplen ${rule.label(constant)}. ` +
    (current !== undefined
      ? `${current} ${rule.test(current, constant) ? 'pertenece' : 'no pertenece'} al conjunto. `
      : '') +
    `${complete ? 'Por extensión' : 'Hasta ahora'}: ${members.length === 0 ? 'vacío' : members.join(', ')}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Elementos revisados', value: `${tested} de ${universe.length}` },
        ...(current !== undefined
          ? [
              {
                label: 'Elemento actual',
                value: `${current} ${rule.test(current, constant) ? '∈ A' : '∉ A'}`,
              },
            ]
          : []),
        { label: 'Cardinalidad |A|', value: String(members.length), color: DATA_COLORS.tertiary },
      ]}
      legend={[
        { label: 'Pertenece a A', color: DATA_COLORS.tertiary, shape: 'circle' },
        { label: 'No pertenece a A', color: DATA_COLORS.neutral, shape: 'circle' },
      ]}
      description={description}
    >
      <p className={styles.notation}>
        <Latex tex={`A = \\{x \\in U : ${rule.latex(constant)}\\}`} />
        <span className={styles.equals}>=</span>
        <Latex
          tex={
            complete
              ? extension
              : members.length > 0
                ? `\\{${members.join(', ')}, \\dots\\}`
                : '\\{\\dots\\}'
          }
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={240}
        maxHeight={380}
        margins={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        {(box) => {
          const columns = Math.max(4, Math.floor(box.inner.width / (CHIP_RADIUS * 2.6)));
          const setTop = box.inner.top + box.inner.height * 0.5;
          const cell = CHIP_RADIUS * 2.5;
          const setColumns = Math.max(1, Math.floor((box.inner.width - 40) / cell));
          let memberIndex = 0;
          return (
            <>
              <text x={box.inner.left} y={box.inner.top + 12} className={svgStyles.labelMuted}>
                Universo U
              </text>
              <rect
                x={box.inner.left}
                y={setTop}
                width={box.inner.width}
                height={box.inner.height * 0.5}
                rx={14}
                fill={DATA_COLORS.tertiary}
                fillOpacity={0.08}
                stroke={DATA_COLORS.tertiary}
                strokeWidth={2}
              />
              <text
                x={box.inner.left + 12}
                y={setTop + 18}
                className={svgStyles.label}
                style={{ fontWeight: 700 }}
              >
                A
              </text>
              {universe.map((x, index) => {
                const inSet = index < tested && rule.test(x, constant);
                let px: number;
                let py: number;
                if (inSet) {
                  const slot = memberIndex;
                  memberIndex += 1;
                  px = box.inner.left + 34 + (slot % setColumns) * cell;
                  py = setTop + 40 + Math.floor(slot / setColumns) * cell;
                } else {
                  px = box.inner.left + CHIP_RADIUS + 4 + (index % columns) * (CHIP_RADIUS * 2.6);
                  py = box.inner.top + 34 + Math.floor(index / columns) * (CHIP_RADIUS * 2.6);
                }
                const examined = index < tested;
                return (
                  <g
                    key={x}
                    className={svgStyles.movable}
                    style={{ transform: `translate(${px}px, ${py}px)` }}
                    aria-hidden="true"
                  >
                    <circle
                      r={CHIP_RADIUS}
                      fill={inSet ? DATA_COLORS.tertiary : 'var(--color-surface-2)'}
                      fillOpacity={inSet ? 0.85 : 1}
                      stroke={x === current ? DATA_COLORS.text : 'var(--color-border-strong)'}
                      strokeWidth={x === current ? 2.5 : 1}
                      opacity={examined || inSet ? 1 : 0.55}
                    />
                    <text textAnchor="middle" dy="0.35em" className={svgStyles.label}>
                      {x}
                    </text>
                  </g>
                );
              })}
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
