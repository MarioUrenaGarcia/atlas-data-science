import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './ProbabilityTree.module.css';
import type { ProbabilityTreeConfig } from './schema.ts';
import { flattenTree, leafSum, leavesInOrder, type TreeNode } from './treeModel.ts';

const STEPS_PER_SECOND = 0.8;
const ROW_HEIGHT = 40;
const LEAF_TEXT_WIDTH = 150;
const NODE_RADIUS = 5;
const DIGITS = 3;

const f = (value: number) => formatNumber(value, DIGITS);
const tex = (name: string) => `\\text{${name}}`;
/** Event of a path, such as "A y B", written as an intersection. */
const pathTex = (path: string) => path.split('/').map(tex).join(' \\cap ');

/**
 * A probability tree that grows one split at a time. Each branch carries a
 * conditional probability; multiplying along a path gives the probability of
 * the leaf (chain rule), adding leaves gives the probability of an event
 * (total probability) and dividing by the leaves of a condition gives a
 * conditional probability (Bayes).
 */
export default function ProbabilityTree({ params, title }: VisualizationProps) {
  const config = params as unknown as ProbabilityTreeConfig;
  const nodes = useMemo(() => flattenTree(config.ramas), [config.ramas]);
  const leaves = useMemo(() => leavesInOrder(nodes), [nodes]);
  const internal = nodes.filter((node) => node.children.length > 0);
  const queries = useMemo(() => config.consultas ?? [], [config.consultas]);
  const definitions = useMemo(
    () =>
      queries.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'consulta',
              label: 'Qué se calcula',
              options: queries.map((query, index) => ({
                value: String(index),
                label: query.nombre,
              })),
              default: '0',
            },
          ]
        : [],
    [queries],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const query = queries[Number(values.consulta ?? 0)];
  const queryIndex = Number(values.consulta ?? 0);

  const growSteps = internal.length;
  const productSteps = leaves.length;
  const querySteps = query ? (query.condicion ? 2 : 1) : 0;
  const lastStage = growSteps + productSteps + querySteps;
  const [run, setRun] = useState(0);
  const [stage, updateStage] = useResettableState(`${queryIndex}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => updateStage((value) => Math.min(lastStage, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STEPS_PER_SECOND,
    done: stage >= lastStage,
  });

  const grown = new Set(internal.slice(0, stage).map((node) => node.path));
  const visible = (node: TreeNode) => node.parent === null || grown.has(node.parent);
  const productsShown = Math.max(0, Math.min(productSteps, stage - growSteps));
  const shownLeaves = new Set(leaves.slice(0, productsShown).map((leaf) => leaf.path));
  const queryStage = stage - growSteps - productSteps;
  const target = new Set(query?.hojas ?? []);
  const condition = new Set(query?.condicion ?? []);
  const both = [...target].filter((leaf) => condition.has(leaf));
  const pTarget = leafSum(nodes, query?.hojas ?? []);
  const pCondition = leafSum(nodes, query?.condicion ?? []);
  const pBoth = leafSum(nodes, both);

  const header = (() => {
    if (stage === 0) return '\\text{Cada rama lleva una probabilidad condicional}';
    if (stage <= growSteps) {
      const node = internal[stage - 1];
      if (!node) return '';
      const given = node.path ? ` \\mid ${pathTex(node.path)}` : '';
      return node.children
        .map((child) => {
          const childNode = nodes.find((candidate) => candidate.path === child);
          return `P(${tex(childNode?.label ?? '')}${given}) = ${f(childNode?.prob ?? 0)}`;
        })
        .join(',\\quad ');
    }
    if (stage <= growSteps + productSteps) {
      const leaf = leaves[stage - growSteps - 1];
      if (!leaf) return '';
      const chain = leaf.path
        .split('/')
        .map((_, depth, parts) => {
          const path = parts.slice(0, depth + 1).join('/');
          return f(nodes.find((node) => node.path === path)?.prob ?? 0);
        })
        .join(' \\cdot ');
      return `P(${pathTex(leaf.path)}) = ${chain} = ${f(leaf.pathProb)}`;
    }
    if (!query) return '';
    if (query.condicion && queryStage === 1) {
      const terms = (query.condicion ?? [])
        .map((leaf) => f(nodes.find((node) => node.path === leaf)?.pathProb ?? 0))
        .join(' + ');
      return `P(\\text{condición}) = ${terms} = ${f(pCondition)}`;
    }
    if (query.condicion) {
      return `P(\\text{${query.nombre}}) = \\frac{${f(pBoth)}}{${f(pCondition)}} = ${f(pCondition > 0 ? pBoth / pCondition : 0)}`;
    }
    const terms = query.hojas
      .map((leaf) => f(nodes.find((node) => node.path === leaf)?.pathProb ?? 0))
      .join(' + ');
    return `P(\\text{${query.nombre}}) = ${terms} = ${f(pTarget)}`;
  })();

  const highlightTarget = queryStage >= 1 && !query?.condicion;
  const highlightCondition = Boolean(query?.condicion) && queryStage >= 1;
  const highlightBoth = Boolean(query?.condicion) && queryStage >= 2;
  const leafColor = (path: string) => {
    if (highlightBoth && target.has(path) && condition.has(path)) return DATA_COLORS.highlight;
    if (highlightCondition && condition.has(path)) return DATA_COLORS.primary;
    if (highlightTarget && target.has(path)) return DATA_COLORS.highlight;
    return null;
  };
  const description =
    `Árbol de probabilidad con ${leaves.length} hojas. ` +
    leaves.map((leaf) => `${leaf.path.replaceAll('/', ' y ')}: ${f(leaf.pathProb)}`).join('; ') +
    '.' +
    (query
      ? ` ${query.nombre}: ${f(query.condicion ? (pCondition > 0 ? pBoth / pCondition : 0) : pTarget)}.`
      : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={definitions.length > 0 ? { ...parameters, values } : undefined}
      readouts={[
        { label: 'Hojas', value: String(leaves.length) },
        {
          label: 'Suma de todas las hojas',
          value: f(
            leafSum(
              nodes,
              leaves.map((leaf) => leaf.path),
            ),
          ),
        },
        ...(query
          ? [
              {
                label: query.nombre,
                value: f(query.condicion ? (pCondition > 0 ? pBoth / pCondition : 0) : pTarget),
                color: DATA_COLORS.highlight,
              },
            ]
          : []),
      ]}
      legend={[
        { label: 'Hoja en el evento', color: DATA_COLORS.highlight },
        ...(query?.condicion
          ? [{ label: 'Hoja de la condición', color: DATA_COLORS.primary }]
          : []),
      ]}
      description={description}
      dataTable={{
        caption: 'Probabilidad de cada camino',
        columns: ['Camino', 'Probabilidad'],
        rows: leaves.map((leaf) => [leaf.path.replaceAll('/', ' y '), f(leaf.pathProb)]),
      }}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <ChartSvg
        label={description}
        aspect={0}
        minHeight={leaves.length * ROW_HEIGHT + 50}
        maxHeight={leaves.length * ROW_HEIGHT + 50}
        margins={{ top: 26, right: 8, bottom: 8, left: 12 }}
      >
        {(box) => {
          const depth = Math.max(...nodes.map((node) => node.depth));
          const columnWidth = (box.inner.width - LEAF_TEXT_WIDTH) / Math.max(1, depth);
          const position = new Map<string, { x: number; y: number }>();
          leaves.forEach((leaf, index) =>
            position.set(leaf.path, {
              x: box.inner.left + leaf.depth * columnWidth,
              y: box.inner.top + (index + 0.5) * ROW_HEIGHT,
            }),
          );
          // Internal nodes sit at the mean height of their children, deepest first.
          [...nodes]
            .sort((a, b) => b.depth - a.depth)
            .forEach((node) => {
              if (node.children.length === 0) return;
              const ys = node.children.map((child) => position.get(child)?.y ?? 0);
              position.set(node.path, {
                x: box.inner.left + node.depth * columnWidth,
                y: ys.reduce((sum, y) => sum + y, 0) / ys.length,
              });
            });
          return (
            <g aria-hidden="true">
              {(config.niveles ?? []).map((name, index) => (
                <text
                  key={name}
                  x={box.inner.left + (index + 0.5) * columnWidth}
                  y={box.inner.top - 12}
                  textAnchor="middle"
                  className={svgStyles.label}
                >
                  {name}
                </text>
              ))}
              {nodes.map((node) => {
                if (node.parent === null || !visible(node)) return null;
                const from = position.get(node.parent);
                const to = position.get(node.path);
                if (!from || !to) return null;
                const leafHighlight = leafColor(node.path);
                return (
                  <g key={node.path}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={leafHighlight ?? 'var(--color-border-strong)'}
                      strokeWidth={leafHighlight ? 2.5 : 1.5}
                    />
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 + (to.y > from.y ? 14 : -6)}
                      textAnchor="middle"
                      className={svgStyles.label}
                      style={{ fontSize: 11 }}
                    >
                      {f(node.prob)}
                    </text>
                    <circle
                      cx={to.x}
                      cy={to.y}
                      r={NODE_RADIUS}
                      fill={leafHighlight ?? DATA_COLORS.muted}
                    />
                    <text
                      x={node.children.length === 0 ? to.x + 8 : to.x}
                      y={node.children.length === 0 ? to.y : to.y - 10}
                      dy={node.children.length === 0 ? '0.35em' : undefined}
                      textAnchor={node.children.length === 0 ? 'start' : 'middle'}
                      className={svgStyles.label}
                      style={node.children.length === 0 ? undefined : { fontWeight: 700 }}
                    >
                      {node.label}
                      {node.children.length === 0 && shownLeaves.has(node.path)
                        ? `   ${f(node.pathProb)}`
                        : ''}
                    </text>
                  </g>
                );
              })}
              <circle
                cx={position.get('')?.x ?? 0}
                cy={position.get('')?.y ?? 0}
                r={NODE_RADIUS + 1}
                fill={DATA_COLORS.text}
              />
            </g>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        El número sobre cada rama es su probabilidad condicional; el número junto a cada hoja es el
        producto de las ramas del camino.
      </p>
    </VizFrame>
  );
}
