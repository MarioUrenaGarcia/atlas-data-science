import { useMemo, useState } from 'react';
import { compose, inverse } from '../../../lib/sets/functions.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { useTransitionProgress } from '../../core/useTransitionProgress.ts';
import { ArrowDiagram, type DiagramArrow } from './ArrowDiagram.tsx';
import styles from './FunctionMapping.module.css';

const TRACES_PER_SECOND = 0.8;
const TRACE_DURATION_MS = 900;

interface CompositionViewProps {
  title: string;
  a: readonly string[];
  b: readonly string[];
  c: readonly string[];
  f: readonly number[];
  g: readonly number[];
}

/**
 * Each element of A is followed through f and then g; the composite g o f
 * collects the end points. The inverse view reverses the arrows of f, which
 * only yields a function when f is a bijection.
 */
export function CompositionView({ title, a, b, c, f, g }: CompositionViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'vista',
        label: 'Vista',
        options: [
          { value: 'composicion', label: 'Composición g ∘ f' },
          { value: 'inversa', label: 'Inversa de f' },
        ],
        default: 'composicion',
      },
    ],
    [],
  );
  const parameters = useParameters(definitions);
  const view = String((parameters.values as Record<string, unknown>).vista);
  const composite = compose(f, g);
  const fInverse = inverse(f, b.length);
  const [run, setRun] = useState(0);
  const [traced, update] = useResettableState<number>(`${view}|${run}`, () => 0);
  const total = a.length;
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: TRACES_PER_SECOND,
    done: traced >= total,
  });
  const progress = useTransitionProgress(`${view}|${traced}`, TRACE_DURATION_MS);
  const current = traced - 1;

  let arrows: DiagramArrow[];
  let columns;
  if (view === 'inversa') {
    columns = [
      { name: 'B', items: b },
      { name: 'A', items: a },
    ];
    arrows = f.flatMap((to, from) =>
      from < traced
        ? [
            {
              column: 0,
              from: to,
              to: from,
              color: DATA_COLORS.secondary,
              progress: from === current ? progress : 1,
            },
          ]
        : [],
    );
  } else {
    columns = [
      { name: 'A', items: a },
      { name: 'B', items: b },
      { name: 'C', items: c },
    ];
    arrows = [
      ...f.map((to, from) => ({
        column: 0,
        from,
        to,
        color: from === current ? DATA_COLORS.primary : undefined,
        dashed: from > current,
      })),
      ...g.map((to, from) => ({
        column: 1,
        from,
        to,
        color: from === f[current] ? DATA_COLORS.tertiary : undefined,
        dashed: true,
      })),
    ];
  }

  const bijective = fInverse !== null;
  const description =
    view === 'inversa'
      ? `${bijective ? 'f es biyectiva: al invertir sus flechas cada elemento de B recibe exactamente una preimagen.' : 'f no es biyectiva: al invertir sus flechas algún elemento de B queda con cero o con varias flechas, así que no hay función inversa.'}`
      : current >= 0
        ? `${a[current]} va a ${b[f[current] ?? 0]} por f y luego a ${c[composite[current] ?? 0]} por g, así que (g ∘ f)(${a[current]}) = ${c[composite[current] ?? 0]}.`
        : 'Se sigue cada elemento de A a través de f y luego de g.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={
        view === 'inversa'
          ? [
              { label: '¿f es biyectiva?', value: bijective ? 'sí' : 'no' },
              {
                label: 'Inversa',
                value: fInverse
                  ? b
                      .map((element, index) => `f⁻¹(${element}) = ${a[fInverse[index] ?? 0]}`)
                      .join(', ')
                  : 'no existe',
              },
            ]
          : [
              { label: 'Elementos seguidos', value: `${traced} de ${total}` },
              {
                label: 'g ∘ f',
                value:
                  a
                    .slice(0, traced)
                    .map((element, index) => `g∘f(${element}) = ${c[composite[index] ?? 0]}`)
                    .join(', ') || 'sin elementos todavía',
                color: DATA_COLORS.tertiary,
              },
            ]
      }
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={
            view === 'inversa'
              ? 'f^{-1}(y) = x \\iff f(x) = y'
              : '(g \\circ f)(x) = g\\big(f(x)\\big)'
          }
        />
      </p>
      <ArrowDiagram
        columns={columns}
        arrows={arrows}
        marks={
          view === 'composicion' && current >= 0
            ? [
                { column: 0, index: current, color: DATA_COLORS.primary },
                { column: 1, index: f[current] ?? 0, color: DATA_COLORS.primary },
                { column: 2, index: composite[current] ?? 0, color: DATA_COLORS.tertiary },
              ]
            : []
        }
        label={description}
      />
      <p className={styles.hint}>{description}</p>
    </VizFrame>
  );
}
