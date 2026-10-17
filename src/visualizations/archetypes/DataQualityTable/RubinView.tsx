import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { meanWithVariance, mice } from '../../../lib/dataprep/mice.ts';
import { normalInterval, rubinPool } from '../../../lib/dataprep/missing.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { HBars } from '../../shared/HBars.tsx';
import styles from './Quality.module.css';
import { padded, scenarioPoints, threeColumnTable } from './missingData.ts';
import type { MechanismId } from './schema.ts';

const STEPS_PER_SECOND = 1.2;
const MICE_ITERATIONS = 10;
const INCOME = 1;
const ROW_HEIGHT = 22;

interface RubinViewProps {
  title: string;
  m: number;
  mechanism: MechanismId;
  rate: number;
  strength: number;
  n: number;
  seed: number;
}

/**
 * The mean income is estimated in each of m imputed tables, each with its
 * own 95 % interval. Rubin's rules pool them: the average estimate, the
 * average within variance W, the between variance B and the total
 * T = W + (1 + 1/m) B, whose interval is wider than any single one.
 */
export function RubinView(props: RubinViewProps) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'm',
      label: 'Número de imputaciones',
      min: 2,
      max: 20,
      step: 1,
      default: props.m,
      symbol: 'm',
    },
  ];
  const parameters = useParameters(definitions);
  const m = Number(parameters.values.m);
  const seed = useSeed(props.seed);
  const points = useMemo(
    () =>
      scenarioPoints({
        mechanism: props.mechanism,
        rate: props.rate,
        strength: props.strength,
        n: props.n,
        seed: seed.seed,
      }),
    [props.mechanism, props.rate, props.strength, props.n, seed.seed],
  );
  const table = useMemo(() => threeColumnTable(points, seed.seed), [points, seed.seed]);
  const estimates = useMemo(
    () =>
      Array.from({ length: m }, (_, c) => {
        const completed = mice(table, MICE_ITERATIONS, new Random(seed.seed * 17 + c + 1)).data;
        return meanWithVariance(completed.map((row) => row[INCOME] ?? 0));
      }),
    [table, m, seed.seed],
  );
  const total = m + 1;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${seed.seed}|${m}|${run}`, () =>
    reducedMotion ? total : 1,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: shown >= total,
  });
  const visible = estimates.slice(0, Math.min(shown, m));
  const pooled = rubinPool(
    visible.map((e) => e.estimate),
    visible.map((e) => e.variance),
  );
  const finished = shown > m;
  const full = rubinPool(
    estimates.map((e) => e.estimate),
    estimates.map((e) => e.variance),
  );
  const pooledCi = normalInterval(full.qBar, full.total);
  const naiveCi = normalInterval(estimates[0]?.estimate ?? 0, estimates[0]?.variance ?? 0);
  const trueMean = points.reduce((a, p) => a + p.y, 0) / points.length;
  const intervals = estimates.map((e) => normalInterval(e.estimate, e.variance));
  const domain = padded([...intervals.flat(), ...pooledCi, trueMean], 0.1);
  const g = (v: number) => formatNumber(v, 3);
  const header = finished
    ? `T = \\bar{W} + \\left(1 + \\tfrac{1}{m}\\right)B = ${g(full.within)} + \\left(1 + \\tfrac{1}{${m}}\\right)${g(full.between)} = ${g(full.total)}`
    : `\\bar{Q} = \\frac{1}{${visible.length}}\\sum_{l=1}^{${visible.length}} \\hat{Q}_l = ${g(pooled.qBar)},\\quad B = ${g(pooled.between)}`;
  const description =
    `${visible.length} de ${m} estimaciones de la media del ingreso. Estimación combinada ${g(full.qBar)}, ` +
    `varianza dentro ${g(full.within)}, entre ${g(full.between)}, total ${g(full.total)}. ` +
    `Intervalo combinado de 95 %: ${g(pooledCi[0])} a ${g(pooledCi[1])}; con una sola imputación: ${g(naiveCi[0])} a ${g(naiveCi[1])}.`;
  const rows = m + 2;

  return (
    <VizFrame
      title={props.title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Estimación combinada', value: g(pooled.qBar), color: DATA_COLORS.highlight },
        { label: 'Varianza dentro (W)', value: g(pooled.within) },
        { label: 'Varianza entre (B)', value: g(pooled.between) },
        { label: 'Varianza total (T)', value: g(pooled.total) },
        { label: 'Fracción por datos faltantes (λ)', value: formatNumber(pooled.lambda, 3) },
        {
          label: 'Grados de libertad',
          value: Number.isFinite(pooled.df) ? formatNumber(pooled.df, 1) : '∞',
        },
      ]}
      legend={[
        { label: 'Intervalo de cada imputación', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Intervalo combinado con T', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Media real (oculta)', color: DATA_COLORS.muted, shape: 'dashed' },
      ]}
      description={description}
      dataTable={{
        caption: 'Estimación y varianza de cada imputación',
        columns: ['Imputación', 'Media estimada', 'Varianza (error estándar al cuadrado)'],
        rows: estimates.map((e, i) => [i + 1, g(e.estimate), g(e.variance)]),
      }}
    >
      <FormulaLine tex={header} />
      <div className={styles.pair}>
        <ChartSvg
          label={description}
          aspect={0.75}
          minHeight={Math.max(240, rows * ROW_HEIGHT + 60)}
          maxHeight={560}
          margins={{ top: 12, right: 16, bottom: 46, left: 96 }}
        >
          {(box) => {
            const { left, top, width, height } = box.inner;
            const x = scaleLinear()
              .domain(domain)
              .range([left, left + width]);
            const step = height / rows;
            return (
              <g>
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={top + height}
                  gridLength={height}
                  ticks={5}
                  label="Media del ingreso (miles de pesos)"
                />
                <g aria-hidden="true">
                  <line
                    x1={x(trueMean)}
                    x2={x(trueMean)}
                    y1={top}
                    y2={top + height}
                    stroke={DATA_COLORS.muted}
                    strokeDasharray="4 4"
                  />
                  {intervals.slice(0, visible.length).map(([lo, hi], i) => {
                    const yy = top + step * (i + 0.5);
                    return (
                      <g key={i}>
                        <text
                          x={left - 8}
                          y={yy}
                          dy="0.35em"
                          textAnchor="end"
                          className={styles.chartLabel}
                        >
                          Imputación {i + 1}
                        </text>
                        <line
                          x1={x(lo)}
                          x2={x(hi)}
                          y1={yy}
                          y2={yy}
                          stroke={seriesColor(0)}
                          strokeWidth={2.5}
                        />
                        <circle
                          cx={x(estimates[i]?.estimate ?? 0)}
                          cy={yy}
                          r={4}
                          fill={seriesColor(0)}
                        />
                      </g>
                    );
                  })}
                  {finished && (
                    <g>
                      <text
                        x={left - 8}
                        y={top + step * (m + 1)}
                        dy="0.35em"
                        textAnchor="end"
                        className={styles.chartText}
                      >
                        Combinado
                      </text>
                      <line
                        x1={x(pooledCi[0])}
                        x2={x(pooledCi[1])}
                        y1={top + step * (m + 1)}
                        y2={top + step * (m + 1)}
                        stroke={DATA_COLORS.highlight}
                        strokeWidth={4}
                      />
                      <circle
                        cx={x(full.qBar)}
                        cy={top + step * (m + 1)}
                        r={5}
                        fill={DATA_COLORS.highlight}
                      />
                    </g>
                  )}
                </g>
              </g>
            );
          }}
        </ChartSvg>
        <div>
          <h4 className={styles.panelTitle}>Componentes de la varianza total</h4>
          <HBars
            labels={['W (dentro)', '(1 + 1/m) B', 'T (total)']}
            values={[
              pooled.within,
              (1 + 1 / Math.max(1, visible.length)) * pooled.between,
              pooled.total,
            ]}
            highlight={finished ? 2 : -1}
            axisLabel="Varianza"
            decimals={3}
            label={description}
          />
        </div>
      </div>
    </VizFrame>
  );
}
