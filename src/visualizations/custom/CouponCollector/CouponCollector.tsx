import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { couponExpectation, couponVariance } from '../../../lib/probability/puzzles.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { Bars } from '../../core/svg/Bars.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './CouponCollector.module.css';
import type { CouponCollectorConfig } from './schema.ts';

const DRAWS_PER_SECOND = 8;
/** After the first collections the draws speed up so the histogram fills in reasonable time. */
const FAST_DRAWS_PER_SECOND = 400;
const SLOW_COLLECTIONS = 2;
const DEFAULT_COLLECTIONS = 300;
const SLOT_COLUMNS = 12;
const BIN_COUNT = 24;

interface Simulation {
  counts: number[];
  draws: number;
  last: number | null;
  /** Draws needed by every completed collection. */
  completed: number[];
}

/**
 * Buying packs with one of n equally likely coupons until the collection is
 * complete. The board fills slot by slot, slowing down as new coupons become
 * rare, and the histogram of completion times builds up around n H_n.
 */
export default function CouponCollector({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as CouponCollectorConfig;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'cupones',
        label: 'Tipos de cupón',
        symbol: 'n',
        min: 2,
        max: 60,
        step: 1,
        default: config.cupones ?? 10,
      },
    ],
    [config.cupones],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const n = values.cupones ?? 10;
  const maxCollections = config.colecciones ?? DEFAULT_COLLECTIONS;
  const expected = couponExpectation(n);
  const sd = Math.sqrt(couponVariance(n));

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${n}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const fresh = (): Simulation => ({
    counts: Array<number>(n).fill(0),
    draws: 0,
    last: null,
    completed: [],
  });
  const [sim, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, fresh);
  const draw = (count: number) => {
    const generator = random();
    const coupons = Array.from({ length: count }, () => generator.int(0, n - 1));
    update((previous) => {
      let { counts, draws, last, completed } = previous;
      counts = [...counts];
      for (const coupon of coupons) {
        if (completed.length >= maxCollections) break;
        if (counts.every((value) => value > 0)) counts = Array<number>(n).fill(0);
        counts[coupon] = (counts[coupon] ?? 0) + 1;
        draws = counts.reduce((sum, value) => sum + value, 0);
        last = coupon;
        if (counts.every((value) => value > 0)) completed = [...completed, draws];
      }
      return { counts, draws, last, completed };
    });
  };
  const slow = sim.completed.length < SLOW_COLLECTIONS;
  const playback = usePlayback({
    step: () => draw(1),
    stepMany: draw,
    reset: () => setRun((value) => value + 1),
    rate: slow ? DRAWS_PER_SECOND : FAST_DRAWS_PER_SECOND,
    done: sim.completed.length >= maxCollections,
  });

  const distinct = sim.counts.filter((value) => value > 0).length;
  const mean =
    sim.completed.length > 0
      ? sim.completed.reduce((sum, value) => sum + value, 0) / sim.completed.length
      : 0;
  const nextWait = distinct < n ? n / (n - distinct) : 0;
  const header =
    distinct < n
      ? `\\text{Con ${distinct} de ${n}, espera del siguiente nuevo: } \\frac{${n}}{${n} - ${distinct}} = ${formatNumber(nextWait, 2)}`
      : `\\mathbb{E}[T] = n H_n = ${n}\\left(1 + \\tfrac{1}{2} + \\cdots + \\tfrac{1}{${n}}\\right) = ${formatNumber(expected, 2)}`;
  const description =
    `${n} tipos de cupón. Colección actual: ${distinct} distintos tras ${sim.draws} compras. ` +
    `Colecciones completas: ${sim.completed.length}, con media ${formatNumber(mean, 1)} compras; valor esperado ${formatNumber(expected, 1)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Distintos en la colección actual', value: `${distinct} de ${n}` },
        { label: 'Compras en la colección actual', value: String(sim.draws) },
        { label: 'Colecciones completas', value: String(sim.completed.length) },
        { label: 'Media simulada', value: formatNumber(mean, 1), color: DATA_COLORS.primary },
        {
          label: 'Esperanza n·H_n',
          value: formatNumber(expected, 1),
          color: DATA_COLORS.secondary,
        },
        { label: 'Desviación estándar', value: formatNumber(sd, 1) },
      ]}
      legend={[
        { label: 'Cupón obtenido', color: DATA_COLORS.primary },
        { label: 'Último cupón', color: DATA_COLORS.highlight },
        { label: 'Esperanza', color: DATA_COLORS.secondary, shape: 'dashed' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0}
        minHeight={Math.ceil(n / SLOT_COLUMNS) * 40 + 8}
        maxHeight={Math.ceil(n / SLOT_COLUMNS) * 40 + 8}
        margins={{ top: 4, right: 4, bottom: 4, left: 4 }}
      >
        {(box) => {
          const size = Math.min(40, box.inner.width / SLOT_COLUMNS);
          const columns = Math.min(SLOT_COLUMNS, n);
          const left = box.inner.left + (box.inner.width - size * columns) / 2;
          return (
            <g aria-hidden="true">
              {sim.counts.map((count, index) => {
                const x = left + (index % SLOT_COLUMNS) * size;
                const y = box.inner.top + Math.floor(index / SLOT_COLUMNS) * size;
                return (
                  <g key={index}>
                    <rect
                      x={x + 2}
                      y={y + 2}
                      width={size - 4}
                      height={size - 4}
                      rx={4}
                      fill={
                        sim.last === index
                          ? DATA_COLORS.highlight
                          : count > 0
                            ? DATA_COLORS.primary
                            : 'var(--color-surface-2)'
                      }
                      fillOpacity={count > 0 ? 0.75 : 1}
                      stroke="var(--color-border)"
                    />
                    <text
                      x={x + size / 2}
                      y={y + size / 2}
                      dy="0.35em"
                      textAnchor="middle"
                      className={svgStyles.label}
                      style={{ fontSize: 11 }}
                    >
                      {count > 0 ? count : index + 1}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Cada casilla es un tipo de cupón; el número indica cuántas veces ha salido en la colección
        actual (las vacías muestran su número de tipo).
      </p>
      <ChartSvg label={description} aspect={0.4} minHeight={200} maxHeight={300}>
        {(box) => {
          const top = Math.max(expected + 4 * sd, ...sim.completed);
          const width = Math.max(1, Math.ceil(top / BIN_COUNT));
          const bins = Array.from({ length: BIN_COUNT }, (_, i) => ({
            x0: i * width,
            x1: (i + 1) * width,
            value: 0,
          }));
          sim.completed.forEach((value) => {
            const bin = bins[Math.min(BIN_COUNT - 1, Math.floor(value / width))];
            if (bin) bin.value += 1;
          });
          const x = scaleLinear()
            .domain([0, width * BIN_COUNT])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, Math.max(5, ...bins.map((bin) => bin.value))])
            .nice()
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={4}
                label="colecciones"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="compras para completar"
                format={(v) => formatNumber(v, 0)}
              />
              <Bars bars={bins} xScale={x} yScale={y} color={DATA_COLORS.primary} animate={false} />
              <line
                x1={x(expected)}
                x2={x(expected)}
                y1={box.inner.top}
                y2={box.inner.top + box.inner.height}
                stroke={DATA_COLORS.secondary}
                strokeWidth={2}
                strokeDasharray="6 4"
                aria-hidden="true"
              />
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
