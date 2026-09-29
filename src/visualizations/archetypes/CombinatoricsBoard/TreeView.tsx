import { useMemo, useState } from 'react';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CombinatoricsBoard.module.css';
import { enumerationRate } from './pace.ts';

const NODE_RADIUS = 5;
const LABEL_MIN_SPACING = 34;

interface TreeViewProps {
  title: string;
  stages: readonly { nombre: string; opciones: readonly string[] }[];
}

/**
 * Counting tree: each level is one stage of the choice and each node branches
 * into the options of the next stage. Paths from the root to the leaves are
 * drawn one at a time, and their number is the product of the branchings.
 */
export function TreeView({ title, stages }: TreeViewProps) {
  const definitions = useMemo(
    () =>
      stages.map((stage, index) => ({
        type: 'number' as const,
        key: `e${index}`,
        label: `Opciones de ${stage.nombre}`,
        min: 1,
        max: stage.opciones.length,
        step: 1,
        default: stage.opciones.length,
      })),
    [stages],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const counts = stages.map((stage, index) =>
    Math.min(stage.opciones.length, values[`e${index}`] ?? stage.opciones.length),
  );
  const leaves = counts.reduce((product, count) => product * count, 1);
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${counts.join()}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(leaves, value + 1)),
    stepMany: (count) => update((value) => Math.min(leaves, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: enumerationRate(leaves),
    done: shown >= leaves,
  });

  // Leaf index to the option chosen at each stage (mixed radix, first stage most significant).
  const pathOf = (leaf: number) => {
    const path: number[] = [];
    let rest = leaf;
    for (let level = counts.length - 1; level >= 0; level -= 1) {
      const count = counts[level] ?? 1;
      path.unshift(rest % count);
      rest = Math.floor(rest / count);
    }
    return path;
  };
  const current = shown > 0 ? pathOf(shown - 1) : null;
  const currentLabel = current
    ? current.map((option, level) => stages[level]?.opciones[option]).join(', ')
    : 'ninguno';
  const description = `Árbol de ${stages.length} etapas con ${counts.join(' por ')} igual a ${leaves} resultados. Caminos trazados: ${shown}; el último es (${currentLabel}).`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        {
          label: 'Resultados posibles',
          value: `${counts.join(' · ')} = ${leaves}`,
          color: DATA_COLORS.primary,
        },
        { label: 'Caminos trazados', value: `${shown} de ${leaves}` },
        { label: 'Último resultado', value: `(${currentLabel})`, color: DATA_COLORS.highlight },
      ]}
      legend={stages.map((stage, index) => ({
        label: stage.nombre,
        color: seriesColor(index),
        shape: 'circle' as const,
      }))}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`${counts.map((count, index) => `\\underbrace{${count}}_{\\text{${stages[index]?.nombre ?? ''}}}`).join(' \\times ')} = ${leaves}`}
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0.55}
        minHeight={260}
        maxHeight={460}
        margins={{ top: 18, right: 14, bottom: 34, left: 14 }}
      >
        {(box) => {
          const levels = counts.length;
          const levelY = (level: number) => box.inner.top + (box.inner.height * level) / levels;
          const leafX = (leaf: number) =>
            box.inner.left + (box.inner.width * (leaf + 0.5)) / leaves;
          // A node at `level` covering leaves [first, first + span) sits above their center.
          const nodes: {
            key: string;
            level: number;
            x: number;
            parentX: number;
            option: number;
            first: number;
            span: number;
          }[] = [];
          const build = (level: number, first: number, span: number, parentX: number) => {
            if (level === levels) return;
            const count = counts[level] ?? 1;
            const child = span / count;
            for (let option = 0; option < count; option += 1) {
              const start = first + option * child;
              const x = (leafX(start) + leafX(start + child - 1)) / 2;
              nodes.push({
                key: `${level}-${start}`,
                level: level + 1,
                x,
                parentX,
                option,
                first: start,
                span: child,
              });
              build(level + 1, start, child, x);
            }
          };
          const rootX = box.inner.left + box.inner.width / 2;
          build(0, 0, leaves, rootX);
          const onPath = (node: (typeof nodes)[number]) =>
            current !== null && shown - 1 >= node.first && shown - 1 < node.first + node.span;
          const labelSpacing = box.inner.width / leaves;
          return (
            <g aria-hidden="true">
              {nodes.map((node) => {
                const visible = node.first < shown;
                const highlighted = onPath(node);
                return (
                  <line
                    key={`l${node.key}`}
                    x1={node.parentX}
                    y1={levelY(node.level - 1)}
                    x2={node.x}
                    y2={levelY(node.level)}
                    stroke={highlighted ? DATA_COLORS.highlight : 'var(--color-border-strong)'}
                    strokeWidth={highlighted ? 3 : 1.2}
                    strokeOpacity={visible ? 1 : 0.18}
                  />
                );
              })}
              <circle cx={rootX} cy={levelY(0)} r={NODE_RADIUS + 1} fill={DATA_COLORS.text} />
              {nodes.map((node) => {
                const visible = node.first < shown;
                const color = seriesColor(node.level - 1);
                const nodeSpacing = (node.span * box.inner.width) / leaves;
                return (
                  <g key={`n${node.key}`} opacity={visible ? 1 : 0.25}>
                    <circle cx={node.x} cy={levelY(node.level)} r={NODE_RADIUS} fill={color} />
                    {nodeSpacing >= LABEL_MIN_SPACING && (
                      <text
                        x={node.x + 8}
                        y={levelY(node.level) - 6}
                        className={svgStyles.labelMuted}
                        style={{ fontSize: 11 }}
                      >
                        {stages[node.level - 1]?.opciones[node.option]}
                      </text>
                    )}
                  </g>
                );
              })}
              {labelSpacing >= 12 &&
                Array.from({ length: leaves }, (_, leaf) => (
                  <text
                    key={`h${leaf}`}
                    x={leafX(leaf)}
                    y={box.inner.top + box.inner.height + 18}
                    textAnchor="middle"
                    className={svgStyles.labelMuted}
                    style={{ fontSize: 10, fontWeight: leaf === shown - 1 ? 700 : 400 }}
                    opacity={leaf < shown ? 1 : 0.3}
                  >
                    {leaf + 1}
                  </text>
                ))}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
