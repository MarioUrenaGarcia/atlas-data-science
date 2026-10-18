import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { trainEmbeddings } from '../../../lib/dataprep/features.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './FeatureEngineeringViz.module.css';

const PRODUCTS = [
  { name: 'Café', group: 0 },
  { name: 'Pan dulce', group: 0 },
  { name: 'Leche', group: 0 },
  { name: 'Carne', group: 1 },
  { name: 'Carbón', group: 1 },
  { name: 'Tortillas', group: 1 },
  { name: 'Detergente', group: 2 },
  { name: 'Suavizante', group: 2 },
];
const GROUP_NAMES = ['Desayuno', 'Carne asada', 'Lavandería'];
const SAME_GROUP = 1;
const OTHER_GROUP = -0.4;
const LEARNING_RATE = 0.02;
const STEPS_PER_SECOND = 60;
const START_SCALE = 0.15;

/**
 * Products bought together should have similar vectors. Starting from small
 * random vectors, gradient descent moves each product so that dot products
 * match how often products share a basket; groups emerge as directions.
 */
export function EmbeddingView({
  title,
  steps,
  seed: seed0,
}: {
  title: string;
  steps: number;
  seed: number;
}) {
  const seed = useSeed(seed0);
  const target = useMemo(
    () =>
      PRODUCTS.map((a) => PRODUCTS.map((b) => (a.group === b.group ? SAME_GROUP : OTHER_GROUP))),
    [],
  );
  const trace = useMemo(() => {
    const random = new Random(seed.seed);
    const start = PRODUCTS.map(
      () => [random.normal(0, START_SCALE), random.normal(0, START_SCALE)] as [number, number],
    );
    return trainEmbeddings(target, start, steps, LEARNING_RATE);
  }, [target, steps, seed.seed]);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [step, update] = useResettableState<number>(`${seed.seed}|${steps}|${run}`, () =>
    reducedMotion ? steps : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(steps, v + 1)),
    stepMany: (count) => update((v) => Math.min(steps, v + count)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: step >= steps,
  });
  const frame = trace.frames[step] ?? trace.frames[0] ?? [];
  const loss = trace.losses[step] ?? 0;
  const cosine = (i: number, j: number) => {
    const a = frame[i] ?? [0, 0];
    const b = frame[j] ?? [0, 0];
    const na = Math.hypot(a[0], a[1]) || 1;
    const nb = Math.hypot(b[0], b[1]) || 1;
    return (a[0] * b[0] + a[1] * b[1]) / (na * nb);
  };
  const g = (v: number) => formatNumber(v, 3);
  const header = `L = \\sum_{i < j} \\left(s_{ij} - \\mathbf{e}_i^\\top \\mathbf{e}_j\\right)^2 = ${g(loss)}\\quad (\\text{paso } ${step})`;
  const description =
    `Embeddings de dos dimensiones de ${PRODUCTS.length} productos, paso ${step} de ${steps}. Pérdida ${g(loss)}. ` +
    `Coseno entre café y pan dulce ${g(cosine(0, 1))}; entre café y carbón ${g(cosine(0, 4))}.`;
  const extent = Math.max(1.3, ...frame.flat().map(Math.abs)) * 1.1;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      readouts={[
        { label: 'Paso', value: `${step} de ${steps}` },
        { label: 'Pérdida', value: g(loss) },
        { label: 'Coseno café y pan dulce', value: g(cosine(0, 1)) },
        { label: 'Coseno café y carbón', value: g(cosine(0, 4)) },
        { label: 'Distancia entre dos categorías con one-hot', value: g(Math.SQRT2) },
      ]}
      legend={GROUP_NAMES.map((n, i) => ({
        label: n,
        color: seriesColor(i),
        shape: 'circle' as const,
      }))}
      description={description}
      dataTable={{
        caption: 'Vector aprendido de cada producto',
        columns: ['Producto', 'Grupo de compra', 'Componente 1', 'Componente 2'],
        rows: PRODUCTS.map((p, i) => [
          p.name,
          GROUP_NAMES[p.group] ?? '',
          g(frame[i]?.[0] ?? 0),
          g(frame[i]?.[1] ?? 0),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.8}
        minHeight={280}
        maxHeight={440}
        margins={{ top: 12, right: 16, bottom: 46, left: 52 }}
      >
        {(box) => {
          const side = Math.min(box.inner.width, box.inner.height);
          const left = box.inner.left + (box.inner.width - side) / 2;
          const top = box.inner.top;
          const x = scaleLinear()
            .domain([-extent, extent])
            .range([left, left + side]);
          const y = scaleLinear()
            .domain([-extent, extent])
            .range([top + side, top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={left}
                gridLength={side}
                ticks={5}
                label="Componente 2"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={top + side}
                ticks={5}
                label="Componente 1"
              />
              <g aria-hidden="true">
                {frame.map((p, i) => (
                  <g key={i}>
                    <line
                      x1={x(0)}
                      y1={y(0)}
                      x2={x(p[0])}
                      y2={y(p[1])}
                      stroke={seriesColor(PRODUCTS[i]?.group ?? 0)}
                      strokeOpacity={0.4}
                    />
                    <circle
                      cx={x(p[0])}
                      cy={y(p[1])}
                      r={6}
                      fill={seriesColor(PRODUCTS[i]?.group ?? 0)}
                    />
                    <text x={x(p[0]) + 8} y={y(p[1]) - 6} className={styles.chartLabel}>
                      {PRODUCTS[i]?.name}
                    </text>
                  </g>
                ))}
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
