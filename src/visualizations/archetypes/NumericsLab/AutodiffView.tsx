import { useMemo, useState } from 'react';
import { autodiffGraph, type GraphNode } from '../../../lib/numerics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { exact } from './format.ts';
import styles from './NumericsLab.module.css';

const STEPS_PER_SECOND = 0.8;
const NODE_COUNT = 5;
/** Significant digits shown for node values, enough to check the arithmetic by hand. */
const DIGITS = 6;
const READOUT_DIGITS = 10;

type Direction = 'forward' | 'reverse';

/** Rule that produces the tangent (forward) or adjoint (reverse) of each node, in LaTeX. */
function ruleFor(
  node: GraphNode,
  nodes: GraphNode[],
  direction: Direction,
  seed: 'x1' | 'x2',
): string {
  const get = (id: string) => nodes.find((item) => item.id === id);
  const v1 = get('v1');
  const v2 = get('v2');
  const v3 = get('v3');
  const v4 = get('v4');
  const num = (value: number | undefined) => {
    const text = exact(value ?? 0, true, DIGITS);
    return (value ?? 0) < 0 ? `(${text})` : text;
  };
  if (direction === 'forward') {
    switch (node.id) {
      case 'v1':
        return `\\dot{v}_1 = \\partial x_1 / \\partial ${seed === 'x1' ? 'x_1' : 'x_2'} = ${num(node.tangent)}`;
      case 'v2':
        return `\\dot{v}_2 = \\partial x_2 / \\partial ${seed === 'x1' ? 'x_1' : 'x_2'} = ${num(node.tangent)}`;
      case 'v3':
        return `\\dot{v}_3 = \\dot{v}_1 v_2 + v_1 \\dot{v}_2 = ${num(v1?.tangent)} \\cdot ${num(v2?.value)} + ${num(v1?.value)} \\cdot ${num(v2?.tangent)} = ${num(node.tangent)}`;
      case 'v4':
        return `\\dot{v}_4 = \\cos(v_1)\\,\\dot{v}_1 = ${num(Math.cos(v1?.value ?? 0))} \\cdot ${num(v1?.tangent)} = ${num(node.tangent)}`;
      default:
        return `\\dot{v}_5 = \\dot{v}_3 + \\dot{v}_4 = ${num(v3?.tangent)} + ${num(v4?.tangent)} = ${num(node.tangent)} = \\partial f / \\partial ${seed === 'x1' ? 'x_1' : 'x_2'}`;
    }
  }
  switch (node.id) {
    case 'v5':
      return `\\bar{v}_5 = \\partial f / \\partial v_5 = 1`;
    case 'v4':
      return `\\bar{v}_4 = \\bar{v}_5 \\cdot 1 = ${num(node.adjoint)}`;
    case 'v3':
      return `\\bar{v}_3 = \\bar{v}_5 \\cdot 1 = ${num(node.adjoint)}`;
    case 'v2':
      return `\\bar{v}_2 = \\bar{v}_3\\, v_1 = ${num(v3?.adjoint)} \\cdot ${num(v1?.value)} = ${num(node.adjoint)} = \\partial f / \\partial x_2`;
    default:
      return `\\bar{v}_1 = \\bar{v}_3\\, v_2 + \\bar{v}_4 \\cos(v_1) = ${num(v3?.adjoint)} \\cdot ${num(v2?.value)} + ${num(v4?.adjoint)} \\cdot ${num(Math.cos(v1?.value ?? 0))} = ${num(node.adjoint)} = \\partial f / \\partial x_1`;
  }
}

interface AutodiffViewProps {
  title: string;
  x1: number;
  x2: number;
  direction: Direction;
}

/**
 * Automatic differentiation of f(x1, x2) = x1 x2 + sin x1 on its computational
 * graph. Forward mode carries a tangent from one input to the output and gives
 * one partial derivative per sweep; reverse mode carries adjoints from the
 * output back to the inputs and gives the whole gradient in one sweep.
 */
export function AutodiffView({ title, x1, x2, direction }: AutodiffViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'sentido',
        label: 'Modo',
        options: [
          { value: 'forward', label: 'Hacia adelante (forward)' },
          { value: 'reverse', label: 'Hacia atrás (reverse)' },
        ],
        default: direction,
      },
      {
        type: 'select' as const,
        key: 'semilla',
        label: 'Derivar respecto a',
        options: [
          { value: 'x1', label: 'x₁' },
          { value: 'x2', label: 'x₂' },
        ],
        default: 'x1',
        shownWhen: { key: 'sentido', values: ['forward'] },
      },
      {
        type: 'number' as const,
        key: 'x1',
        label: 'Entrada x₁',
        min: -4,
        max: 4,
        step: 0.1,
        default: x1,
        symbol: 'x₁',
        digits: 1,
      },
      {
        type: 'number' as const,
        key: 'x2',
        label: 'Entrada x₂',
        min: -4,
        max: 4,
        step: 0.1,
        default: x2,
        symbol: 'x₂',
        digits: 1,
      },
    ],
    [direction, x1, x2],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, unknown>;
  const mode = String(values.sentido) as Direction;
  const seed = String(values.semilla) as 'x1' | 'x2';
  const nodes = autodiffGraph(Number(values.x1), Number(values.x2), seed);
  const [step, setStep] = useState(NODE_COUNT - 1);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(NODE_COUNT - 1, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= NODE_COUNT - 1,
  });
  const order = mode === 'forward' ? nodes : [...nodes].reverse();
  const active = order[Math.min(step, NODE_COUNT - 1)] ?? nodes[0];
  const doneIds = new Set(order.slice(0, step + 1).map((node) => node.id));
  const output = nodes[NODE_COUNT - 1];
  const description =
    `f(${values.x1}, ${values.x2}) = ${exact(output?.value ?? 0)}. Modo ${mode === 'forward' ? 'hacia adelante' : 'hacia atrás'}, paso ${step + 1} de ${NODE_COUNT}, nodo ${active?.id}. ` +
    (mode === 'forward'
      ? `La derivada respecto a ${seed} es ${exact(output?.tangent ?? 0)}.`
      : `El gradiente es (${exact(nodes[0]?.adjoint ?? 0)}, ${exact(nodes[1]?.adjoint ?? 0)}).`);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      graphic="html"
      readouts={[
        { label: 'f(x₁, x₂)', value: exact(output?.value ?? 0, false, READOUT_DIGITS) },
        {
          label: '∂f/∂x₁ exacta',
          value: exact(nodes[0]?.adjoint ?? 0, false, READOUT_DIGITS),
          color: DATA_COLORS.primary,
        },
        {
          label: '∂f/∂x₂ exacta',
          value: exact(nodes[1]?.adjoint ?? 0, false, READOUT_DIGITS),
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Recorridos para el gradiente',
          value: mode === 'forward' ? '2, uno por entrada' : '1, para cualquier número de entradas',
        },
      ]}
      legend={[{ label: 'Nodo que se calcula en este paso', color: DATA_COLORS.highlight }]}
      description={description}
    >
      <FormulaLine
        tex={`f(x_1, x_2) = x_1 x_2 + \\operatorname{sen} x_1,\\qquad ${active ? ruleFor(active, nodes, mode, seed) : ''}`}
      />
      <div className={styles.graph}>
        {order.map((node) => (
          <div
            key={node.id}
            className={`${styles.node} ${node.id === active?.id ? styles.nodeActive : ''}`}
          >
            <div className={styles.nodeHead}>
              <span>{node.id}</span>
              <span>{node.inputs.length ? `de ${node.inputs.join(', ')}` : 'entrada'}</span>
            </div>
            <div className={styles.nodeRow}>
              <span>valor</span>
              <span className={styles.nodeValue}>{exact(node.value, false, DIGITS)}</span>
            </div>
            <div className={styles.nodeRow}>
              <span>{mode === 'forward' ? 'tangente' : 'adjunto'}</span>
              <span className={styles.nodeValue}>
                {doneIds.has(node.id)
                  ? exact(mode === 'forward' ? node.tangent : node.adjoint, false, DIGITS)
                  : '?'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
