import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { meanReturn, simulateSurvival } from '../../../lib/sampling/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './SamplingProcess.module.css';
import type { SurvivalConfig } from './schema.ts';

const PERIODS_PER_SECOND = 1.2;

const pct = (v: number) => `${formatNumber(v * 100, 2)} %`;

/** Units that close when they fall below a threshold disappear from the data, inflating the survivors' average. */
export function SurvivalView({
  config,
  title,
  conceptId,
}: {
  config: SurvivalConfig;
  title: string;
  conceptId: string;
}) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'umbral',
      label: 'Valor al que se cierra una unidad',
      min: 0,
      max: 0.95,
      step: 0.05,
      default: config.umbral,
      digits: 2,
    },
    { type: 'toggle', key: 'cerrados', label: 'Mostrar las unidades cerradas', default: true },
  ];
  const parameters = useParameters(definitions);
  const threshold = Number(parameters.values.umbral);
  const showClosed = Boolean(parameters.values.cerrados);
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const panel = useMemo(
    () =>
      simulateSurvival(
        {
          units: config.unidades,
          periods: config.periodos,
          mean: config.media,
          dispersion: config.dispersion,
          volatility: config.volatilidad,
          threshold,
        },
        new Random(seed.seed),
      ),
    [
      config.unidades,
      config.periodos,
      config.media,
      config.dispersion,
      config.volatilidad,
      threshold,
      seed.seed,
    ],
  );
  const [run, setRun] = useState(0);
  const [t, update] = useResettableState<number>(`${threshold}|${seed.seed}|${run}`, () => 0);
  const last = config.periodos - 1;
  const playback = usePlayback({
    step: () => update((v) => Math.min(last, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: PERIODS_PER_SECOND,
    done: t >= last,
  });
  const alive = panel.closed.filter((c) => c === null || c > t).length;
  const survivors = meanReturn(panel, t, true);
  const everyone = meanReturn(panel, t, false);
  const header = `\\bar{r}_{\\text{sobrevivientes}} = ${pct(survivors).replace('%', '\\%')},\\quad \\bar{r}_{\\text{todos}} = ${pct(everyone).replace('%', '\\%')},\\quad \\text{sesgo} = ${pct(survivors - everyone).replace('%', '\\%')}`;
  const unitName = config.nombreUnidad.toLowerCase();
  const description =
    `${config.nombrePeriodo} ${t + 1} de ${config.periodos}: siguen ${alive} de ${config.unidades} ${unitName}s. ` +
    `${config.variable} promedio de los que siguen: ${pct(survivors)}; de todos, incluidos los cerrados: ${pct(everyone)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: config.nombrePeriodo, value: `${t + 1} de ${config.periodos}` },
        { label: `${config.nombreUnidad}s que siguen`, value: `${alive} de ${config.unidades}` },
        {
          label: 'Promedio de los sobrevivientes',
          value: pct(survivors),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Promedio de todas las unidades',
          value: pct(everyone),
          color: DATA_COLORS.neutral,
        },
        {
          label: 'Sesgo de supervivencia',
          value: pct(survivors - everyone),
          color: DATA_COLORS.highlight,
        },
      ]}
      legend={[
        { label: `${config.nombreUnidad} que sigue`, color: DATA_COLORS.primary, shape: 'line' },
        { label: `${config.nombreUnidad} que cerró`, color: DATA_COLORS.negative, shape: 'dashed' },
        { label: 'Umbral de cierre', color: DATA_COLORS.muted, shape: 'dashed' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <p className={styles.caption}>
        Valor acumulado de cada unidad; empieza en 1 y se cierra al cruzar el umbral.
      </p>
      <ChartSvg
        label={description}
        aspect={0.55}
        minHeight={260}
        maxHeight={420}
        margins={{ left: 48, bottom: 44, top: 12, right: 16 }}
      >
        {(box) => {
          const finite = panel.values.flat().filter((v) => Number.isFinite(v));
          const hi = Math.max(1.5, ...finite);
          const x = scaleLinear()
            .domain([0, config.periodos])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, hi * 1.05])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="Valor acumulado"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={Math.min(10, config.periodos)}
                label={config.nombrePeriodo}
              />
              <line
                x1={box.inner.left}
                x2={box.inner.left + box.inner.width}
                y1={y(threshold)}
                y2={y(threshold)}
                stroke={DATA_COLORS.muted}
                strokeDasharray="6 4"
                strokeWidth={1.5}
              />
              <g aria-hidden="true">
                {panel.values.map((series, u) => {
                  const closedAt = panel.closed[u];
                  const dead = closedAt !== null && closedAt !== undefined && closedAt <= t;
                  if (dead && !showClosed) return null;
                  const points = [
                    `${x(0)},${y(1)}`,
                    ...series
                      .slice(0, t + 1)
                      .flatMap((v, s) => (Number.isFinite(v) ? [`${x(s + 1)},${y(v)}`] : [])),
                  ];
                  return (
                    <polyline
                      key={u}
                      points={points.join(' ')}
                      fill="none"
                      stroke={dead ? DATA_COLORS.negative : DATA_COLORS.primary}
                      strokeOpacity={dead ? 0.45 : 0.6}
                      strokeWidth={1.3}
                      strokeDasharray={dead ? '3 3' : undefined}
                    />
                  );
                })}
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
