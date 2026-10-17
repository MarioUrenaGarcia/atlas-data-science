import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { useMemo, useState } from 'react';
import { mice } from '../../../lib/dataprep/mice.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { mean, variance } from '../../../lib/stats/index.ts';
import { seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './Quality.module.css';
import { ScatterFrame } from '../../shared/ScatterCharts.tsx';
import { padded, SCENARIO, scenarioPoints, threeColumnTable } from './missingData.ts';
import type { MechanismId } from './schema.ts';

const ITERATIONS_PER_SECOND = 1.2;
const INCOME = 1;

interface MiceViewProps {
  title: string;
  m: number;
  iterations: number;
  mechanism: MechanismId;
  rate: number;
  strength: number;
  n: number;
  seed: number;
}

/**
 * Chained equations run as m independent chains. Missing incomes start at
 * the observed mean; each iteration re-imputes income from age and spending
 * and spending from age and income, drawing the regression parameters and
 * noise. The traces of the imputed means mix after a few iterations, and
 * the spread between chains is the uncertainty that a single imputation hides.
 */
export function MiceView(props: MiceViewProps) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'm',
      label: 'Imputaciones (cadenas)',
      min: 2,
      max: 8,
      step: 1,
      default: props.m,
      symbol: 'm',
    },
    {
      type: 'number',
      key: 'iteraciones',
      label: 'Iteraciones por cadena',
      min: 2,
      max: 20,
      step: 1,
      default: props.iterations,
      symbol: 'T',
    },
  ];
  const parameters = useParameters(definitions);
  const m = Number(parameters.values.m);
  const iterations = Number(parameters.values.iteraciones);
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
  const chains = useMemo(
    () =>
      Array.from({ length: m }, (_, c) =>
        mice(table, iterations, new Random(seed.seed * 31 + c + 1)),
      ),
    [table, iterations, m, seed.seed],
  );
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [t, update] = useResettableState<number>(`${seed.seed}|${m}|${iterations}|${run}`, () =>
    reducedMotion ? iterations : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(iterations, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: ITERATIONS_PER_SECOND,
    done: t >= iterations,
  });
  const missingRows = table.flatMap((row, i) => (Number.isNaN(row[INCOME] ?? 0) ? [i] : []));
  const currentMeans = chains.map((c) => c.trace.means[t]?.[INCOME] ?? Number.NaN);
  const between = m > 1 ? variance(currentMeans) : 0;
  const allMeans = chains.flatMap((c) => c.trace.means.map((row) => row[INCOME] ?? 0));
  const g = (v: number) => formatNumber(v, 2);
  const header =
    t === 0
      ? `\\tilde{y}^{(0)}_{\\text{mis}} = \\bar{y}_{\\text{obs}} = ${g(currentMeans[0] ?? 0)}`
      : `\\tilde{y}^{(${t})}_{\\text{mis}} \\sim \\mathcal{N}\\!\\left(\\tilde\\beta_0 + \\tilde\\beta_1\\,\\text{edad} + \\tilde\\beta_2\\,\\text{gasto}^{(${t})},\\ \\tilde\\sigma^2\\right),\\quad B = ${g(between)}`;
  const description =
    `${m} cadenas de imputación por ecuaciones encadenadas, iteración ${t} de ${iterations}. ` +
    `Media de los ingresos imputados por cadena: ${currentMeans.map(g).join(', ')}. ` +
    `Varianza entre cadenas: ${g(between)}.`;

  return (
    <VizFrame
      title={props.title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Iteración', value: `${t} de ${iterations}` },
        { label: 'Ingresos faltantes', value: String(missingRows.length) },
        { label: 'Media imputada (promedio de cadenas)', value: g(mean(currentMeans)) },
        { label: 'Varianza entre cadenas', value: g(between) },
      ]}
      legend={[
        { label: 'Ingreso observado', color: 'var(--data-neutral)', shape: 'circle' as const },
        ...chains.map((_, c) => ({
          label: `Imputación ${c + 1}`,
          color: seriesColor(c),
          shape: 'line' as const,
        })),
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div className={styles.pair}>
        <ChartSvg
          label={description}
          aspect={0.7}
          minHeight={240}
          maxHeight={360}
          margins={{ top: 12, right: 12, bottom: 46, left: 52 }}
        >
          {(box) => {
            const { left, top, width, height } = box.inner;
            const x = scaleLinear()
              .domain([0, iterations])
              .range([left, left + width]);
            const y = scaleLinear()
              .domain(padded(allMeans, 0.15))
              .range([top + height, top]);
            return (
              <g>
                <Axis
                  scale={y}
                  orientation="left"
                  position={left}
                  gridLength={width}
                  ticks={5}
                  label="Media del ingreso imputado"
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={top + height}
                  ticks={Math.min(iterations, 10)}
                  label="Iteración"
                />
                <g aria-hidden="true">
                  {chains.map((c, ci) => (
                    <path
                      key={ci}
                      d={
                        line<number>()
                          .x((_, i) => x(i))
                          .y((v) => y(v))(
                          c.trace.means.slice(0, t + 1).map((row) => row[INCOME] ?? 0),
                        ) ?? ''
                      }
                      fill="none"
                      stroke={seriesColor(ci)}
                      strokeWidth={2}
                    />
                  ))}
                </g>
              </g>
            );
          }}
        </ChartSvg>
        <ScatterFrame
          xDomain={padded(points.map((p) => p.x))}
          yDomain={padded(
            points.map((p) => p.y),
            0.15,
          )}
          xLabel={`${SCENARIO.xName} (${SCENARIO.xUnit})`}
          yLabel={`${SCENARIO.yName} (${SCENARIO.yUnit})`}
          label={description}
        >
          {({ x, y }) => (
            <g aria-hidden="true">
              {table.map((row, i) =>
                Number.isNaN(row[INCOME] ?? 0) ? null : (
                  <circle
                    key={i}
                    cx={x(row[0] ?? 0)}
                    cy={y(row[INCOME] ?? 0)}
                    r={3}
                    fill="var(--data-neutral)"
                    fillOpacity={0.5}
                  />
                ),
              )}
              {chains.map((c, ci) =>
                (c.trace.values[t]?.[INCOME] ?? []).map((v, j) => (
                  <circle
                    key={`${ci}-${j}`}
                    cx={x(table[missingRows[j] ?? 0]?.[0] ?? 0)}
                    cy={y(v)}
                    r={3.5}
                    fill={seriesColor(ci)}
                  />
                )),
              )}
            </g>
          )}
        </ScatterFrame>
      </div>
    </VizFrame>
  );
}
