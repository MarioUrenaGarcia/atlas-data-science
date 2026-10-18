import { scaleLinear } from 'd3-scale';
import { useCallback, useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import {
  drawSample,
  estimateMean,
  frameUnits,
  generateGridPopulation,
  srsVariance,
  theoreticalVariance,
  type DesignId,
  type DesignOptions,
  type DrawnSample,
  type GridPopulation,
} from '../../../lib/sampling/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { EstimateHistogram } from '../../shared/EstimateHistogram.tsx';
import type { VisualizationProps } from '../../types.ts';
import { CLUSTER_DESIGNS, DESIGN_LABELS, headerFormula, stageText } from './formulas.ts';
import { PopulationGrid } from './PopulationGrid.tsx';
import type { PopulationConfig, SurveySamplerConfig } from './schema.ts';
import styles from './SurveySampler.module.css';

const UNITS_PER_SECOND = 10;
/** The first sample never takes longer than this to reveal, whatever its size. */
const FIRST_SAMPLE_SECONDS = 3;
const DEFAULT_REPETITIONS = 400;
const PILOT_REPETITIONS = 160;
const DEFAULT_BLOCK: [number, number] = [4, 3];

interface SimulationState {
  sample: DrawnSample;
  drawn: number;
  estimates: number[];
  srs: number[];
}

function buildPopulation(config: PopulationConfig, seed: number): GridPopulation {
  return generateGridPopulation(
    {
      columns: config.columnas,
      rows: config.filas,
      strata: config.estratos.map((s) => ({
        name: s.nombre,
        mean: s.media,
        ...(s.desviacion === undefined ? {} : { sd: s.desviacion }),
      })),
      cluster: config.conglomerado ?? DEFAULT_BLOCK,
      icc: config.icc ?? 0.2,
      sd: config.desviacion,
      ...(config.tendencia === undefined ? {} : { trend: config.tendencia }),
      ...(config.periodo === undefined ? {} : { period: config.periodo }),
      ...(config.amplitud === undefined ? {} : { amplitude: config.amplitud }),
      ...(config.correlacionTamano === undefined
        ? {}
        : { sizeCorrelation: config.correlacionTamano }),
      ...(config.minimo === undefined ? {} : { minimum: config.minimo }),
      binary: config.binaria ?? false,
      decimals: config.decimales ?? 1,
    },
    new Random(seed),
  );
}

/**
 * A finite population drawn as a grid. A design selects units (with strata,
 * clusters, sizes or biases visible on the grid), the estimator is computed
 * with the numbers of the sample, and repeated samples build the distribution
 * of the estimator around the true population mean.
 */
export default function SurveySampler({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as SurveySamplerConfig;
  const pop = config.poblacion;
  const offered = config.disenos ?? [config.diseno];
  const anyCluster = offered.some((d) => CLUSTER_DESIGNS.includes(d));
  const anyElement = offered.some((d) => !CLUSTER_DESIGNS.includes(d));
  const selector = offered.length > 1;
  const when = (designs: DesignId[]) => {
    const values = designs.filter((d) => offered.includes(d));
    return selector ? { shownWhen: { key: 'diseno', values } } : {};
  };
  const block = config.poblacion.conglomerado ?? DEFAULT_BLOCK;
  const totalUnits = pop.columnas * pop.filas;
  const clusterTotal = Math.ceil(pop.columnas / block[0]) * Math.ceil(pop.filas / block[1]);

  const definitions = useMemo<ParameterDefinition[]>(() => {
    const list: ParameterDefinition[] = [];
    if (selector) {
      list.push({
        type: 'select',
        key: 'diseno',
        label: 'Diseño',
        options: offered.map((d) => ({ value: d, label: DESIGN_LABELS[d] })),
        default: config.diseno,
      });
    }
    const elementDesigns = offered.filter((d) => !CLUSTER_DESIGNS.includes(d));
    const clusterDesigns = offered.filter((d) => CLUSTER_DESIGNS.includes(d));
    if (anyElement) {
      list.push({
        type: 'number',
        key: 'n',
        label: 'Tamaño de muestra',
        symbol: 'n',
        min: 2,
        max: Math.min(totalUnits, config.nMaximo ?? Math.min(120, totalUnits)),
        step: 1,
        default: CLUSTER_DESIGNS.includes(config.diseno) ? Math.min(24, totalUnits) : config.n,
        ...when(elementDesigns),
      });
    }
    if (anyCluster) {
      list.push({
        type: 'number',
        key: 'm',
        label: `Conglomerados sorteados`,
        symbol: 'm',
        min: 1,
        max: clusterTotal,
        step: 1,
        default: CLUSTER_DESIGNS.includes(config.diseno) ? Math.min(config.n, clusterTotal) : 2,
        ...when(clusterDesigns),
      });
    }
    if (offered.includes('multietapa')) {
      list.push({
        type: 'number',
        key: 'k',
        label: 'Unidades por conglomerado',
        symbol: 'k',
        min: 1,
        max: block[0] * block[1],
        step: 1,
        default: Math.min(config.porConglomerado ?? 3, block[0] * block[1]),
        ...when(['multietapa']),
      });
    }
    if (offered.includes('estratificado')) {
      list.push({
        type: 'select',
        key: 'asignacion',
        label: 'Asignación entre estratos',
        options: [
          { value: 'proporcional', label: 'Proporcional' },
          { value: 'neyman', label: 'De Neyman' },
          { value: 'igual', label: 'Igual en cada estrato' },
        ],
        default: config.asignacion ?? 'proporcional',
        ...when(['estratificado']),
      });
    }
    if (offered.includes('mas') && config.reemplazo !== undefined) {
      list.push({
        type: 'toggle',
        key: 'reemplazo',
        label: 'Con reemplazo',
        default: config.reemplazo,
        ...when(['mas']),
      });
    }
    if (offered.includes('seleccion')) {
      list.push({
        type: 'number',
        key: 'sesgo',
        label: 'Intensidad del sesgo de selección',
        symbol: 'β',
        min: -2,
        max: 2,
        step: 0.1,
        default: config.sesgo ?? 1,
        digits: 1,
        ...when(['seleccion']),
      });
    }
    if (offered.includes('no-respuesta')) {
      list.push({
        type: 'number',
        key: 'pendiente',
        label: 'Relación entre el valor y la respuesta',
        symbol: 'b',
        min: -3,
        max: 3,
        step: 0.1,
        default: config.respuesta?.pendiente ?? -1,
        digits: 1,
        ...when(['no-respuesta']),
      });
    }
    if (offered.includes('marco')) {
      list.push({
        type: 'number',
        key: 'cobertura',
        label: 'Cobertura del marco en el último estrato',
        min: 0,
        max: 1,
        step: 0.05,
        default: config.cobertura?.[config.cobertura.length - 1] ?? 0.5,
        digits: 2,
        ...when(['marco']),
      });
    }
    list.push({
      type: 'toggle',
      key: 'comparar',
      label: 'Comparar con muestreo aleatorio simple',
      default: config.comparar ?? false,
    });
    return list;
    // The configuration comes from static frontmatter and never changes after mounting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string | boolean>;
  const design = (selector ? String(values.diseno) : config.diseno) as DesignId;
  const isCluster = CLUSTER_DESIGNS.includes(design);
  const n = Number(isCluster ? values.m : values.n);
  const coverage = useMemo(() => {
    const base = config.cobertura ?? config.poblacion.estratos.map(() => 1);
    const last = Number(values.cobertura ?? base[base.length - 1] ?? 1);
    return config.poblacion.estratos.map((_, h) =>
      h === config.poblacion.estratos.length - 1 ? last : (base[h] ?? 1),
    );
  }, [config.cobertura, config.poblacion.estratos, values.cobertura]);
  const options = useMemo<DesignOptions>(
    () => ({
      design,
      n,
      replace: Boolean(values.reemplazo ?? false),
      allocation: (values.asignacion ?? config.asignacion ?? 'proporcional') as
        'proporcional' | 'neyman' | 'igual',
      perCluster: Number(values.k ?? config.porConglomerado ?? 3),
      bias: Number(values.sesgo ?? config.sesgo ?? 1),
      coverage,
      response: {
        base: config.respuesta?.base ?? 0,
        slope: Number(values.pendiente ?? config.respuesta?.pendiente ?? -1),
      },
    }),
    [
      design,
      n,
      values.reemplazo,
      values.asignacion,
      values.k,
      values.sesgo,
      values.pendiente,
      coverage,
      config,
    ],
  );
  const compare = Boolean(values.comparar);

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const population = useMemo(() => buildPopulation(pop, seed.seed), [pop, seed.seed]);
  const N = population.values.length;
  const mu = population.values.reduce((a, b) => a + b, 0) / N;
  const excluded = useMemo(() => {
    if (design !== 'marco') return new Set<number>();
    const inFrame = new Set(frameUnits(population, coverage));
    return new Set(population.values.map((_, i) => i).filter((i) => !inFrame.has(i)));
  }, [design, population, coverage]);

  const repetitions = config.repeticiones ?? DEFAULT_REPETITIONS;
  const [run, setRun] = useState(0);
  const runKey = `${JSON.stringify(options)}|${run}|${compare}`;
  // Each sample gets its own generator derived from its index, so the state
  // updates stay pure and a seed always replays the same sequence of samples.
  const generatorFor = useCallback(
    (index: number, stream: number) =>
      new Random((seed.seed * 7919 + index * 104729 + stream * 15485863 + run * 31) >>> 0),
    [seed.seed, run],
  );
  const firstSample = useCallback(
    () => drawSample(population, options, generatorFor(0, 0)),
    [population, options, generatorFor],
  );
  const [state, update] = useResettableState<SimulationState>(`${runKey}|${seed.seed}`, () => ({
    sample: firstSample(),
    drawn: 0,
    estimates: [],
    srs: [],
  }));

  /** Units per SRS comparison sample: the same number of units the design observes. */
  const unitsObserved = state.sample.units.length;

  const pilot = useMemo(() => {
    const generator = new Random(seed.seed + 101);
    const draws: number[] = [];
    for (let r = 0; r < PILOT_REPETITIONS; r += 1) {
      draws.push(estimateMean(population, drawSample(population, options, generator), design));
      if (compare) {
        draws.push(
          estimateMean(
            population,
            drawSample(population, { design: 'mas', n: Math.max(2, unitsObserved) }, generator),
            'mas',
          ),
        );
      }
    }
    return draws.filter(Number.isFinite);
  }, [seed.seed, population, options, design, compare, unitsObserved]);
  const domain = useMemo<[number, number]>(() => {
    let lo = Math.min(mu, ...pilot);
    let hi = Math.max(mu, ...pilot);
    if (!(hi > lo)) {
      lo -= 1;
      hi += 1;
    }
    const pad = (hi - lo) * 0.25;
    const [a = lo - pad, b = hi + pad] = scaleLinear()
      .domain([lo - pad, hi + pad])
      .nice()
      .domain();
    return [a, b];
  }, [pilot, mu]);

  const finish = useCallback(
    (next: SimulationState): SimulationState => {
      const estimate = estimateMean(population, next.sample, design);
      const srs = compare
        ? [
            ...next.srs,
            estimateMean(
              population,
              drawSample(
                population,
                { design: 'mas', n: Math.max(2, next.sample.units.length) },
                generatorFor(next.estimates.length, 1),
              ),
              'mas',
            ),
          ]
        : next.srs;
      return { ...next, estimates: [...next.estimates, estimate], srs };
    },
    [population, design, compare, generatorFor],
  );

  const stepUnits = useCallback(
    (count: number) =>
      update((previous) => {
        let next = previous;
        for (let i = 0; i < count; i += 1) {
          if (next.estimates.length >= repetitions) break;
          if (next.drawn < next.sample.units.length) {
            // Cluster designs reveal a whole cluster per step.
            let drawn = next.drawn + 1;
            if (design === 'conglomerados') {
              const cluster = population.cluster[next.sample.units[next.drawn] ?? 0];
              while (
                drawn < next.sample.units.length &&
                population.cluster[next.sample.units[drawn] ?? 0] === cluster
              )
                drawn += 1;
            }
            next = { ...next, drawn };
            if (drawn >= next.sample.units.length) {
              next = finish(next);
            }
          } else {
            const sample = drawSample(population, options, generatorFor(next.estimates.length, 0));
            next = finish({ ...next, sample, drawn: sample.units.length });
          }
        }
        return next;
      }),
    [update, repetitions, design, population, options, generatorFor, finish],
  );

  // The first sample is revealed unit by unit; later samples appear whole.
  const firstDone = state.estimates.length > 0;
  const playback = usePlayback({
    step: () => stepUnits(1),
    stepMany: (count) => stepUnits(count),
    reset: () => setRun((value) => value + 1),
    rate: firstDone
      ? Math.max(4, Math.min(30, repetitions / 12))
      : Math.max(UNITS_PER_SECOND, state.sample.units.length / FIRST_SAMPLE_SECONDS),
    done: state.estimates.length >= repetitions,
  });

  const shownUnits = state.sample.units.slice(0, state.drawn);
  const counts = new Map<number, number>();
  for (const unit of shownUnits) counts.set(unit, (counts.get(unit) ?? 0) + 1);
  const missing = new Set(
    shownUnits.filter((_, i) => design === 'no-respuesta' && !state.sample.responded[i]),
  );
  const complete = state.drawn >= state.sample.units.length;
  const current = complete ? estimateMean(population, state.sample, design) : Number.NaN;
  const decimals = pop.binaria ? 2 : (pop.decimales ?? 1);
  const digits = decimals + 2;
  const header = headerFormula({
    design,
    population,
    sample: state.sample,
    drawn: state.drawn,
    estimate: current,
    decimals,
  });

  const estimates = state.estimates;
  const average =
    estimates.length > 0 ? estimates.reduce((a, b) => a + b, 0) / estimates.length : Number.NaN;
  const empiricalVariance =
    estimates.length > 1
      ? estimates.reduce((a, e) => a + (e - average) ** 2, 0) / (estimates.length - 1)
      : Number.NaN;
  const theory = theoreticalVariance(population, options);
  const srsTheory = srsVariance(population.values, Math.max(2, Math.min(N, unitsObserved)));
  const deff = Number.isFinite(empiricalVariance) ? empiricalVariance / srsTheory : Number.NaN;
  const symbol = pop.binaria ? 'p' : '\\mu';
  const unitText = pop.unidad ? ` ${pop.unidad}` : '';
  const what = pop.binaria ? 'Proporción' : 'Media';

  const readouts = [
    {
      label: `${what} real de la población`,
      value: `${formatNumber(mu, digits)}${unitText}`,
      color: DATA_COLORS.primary,
    },
    {
      label: 'Estimación con la muestra actual',
      value: complete ? `${formatNumber(current, digits)}${unitText}` : 'en curso',
      color: DATA_COLORS.highlight,
    },
    {
      label: 'Unidades observadas',
      value: `${complete ? state.sample.responded.filter(Boolean).length : shownUnits.length} de ${N}`,
    },
    { label: 'Muestras repetidas', value: String(estimates.length) },
    {
      label: 'Promedio de las estimaciones',
      value: formatNumber(average, digits),
      color: DATA_COLORS.secondary,
    },
    { label: 'Sesgo observado', value: formatNumber(average - mu, digits) },
    {
      label: 'Error estándar observado',
      value: formatNumber(Math.sqrt(empiricalVariance), digits),
    },
    ...(theory !== null && design !== 'no-respuesta'
      ? [{ label: 'Error estándar teórico', value: formatNumber(Math.sqrt(theory), digits) }]
      : []),
    ...(compare
      ? [
          {
            label: 'Error estándar con muestreo aleatorio simple',
            value: formatNumber(Math.sqrt(srsTheory), digits),
          },
          { label: 'Efecto de diseño observado', value: formatNumber(deff, 2) },
        ]
      : []),
  ];

  const description =
    `${DESIGN_LABELS[design]} en una población de ${N} unidades (${pop.nombreUnidad}); ${what.toLowerCase()} real de ${pop.variable}: ${formatNumber(mu, digits)}. ` +
    (complete
      ? `La muestra actual estima ${formatNumber(current, digits)}. `
      : `Se han extraído ${shownUnits.length} de ${state.sample.units.length} unidades. `) +
    (estimates.length > 1
      ? `Tras ${estimates.length} muestras, el promedio de las estimaciones es ${formatNumber(average, digits)} y su error estándar ${formatNumber(Math.sqrt(empiricalVariance), digits)}.`
      : '');

  const legend = [
    {
      label: `${pop.nombreUnidad} de la población`,
      color: DATA_COLORS.primary,
      shape: 'circle' as const,
    },
    {
      label: `${pop.nombreUnidad} en la muestra`,
      color: DATA_COLORS.highlight,
      shape: 'circle' as const,
    },
    ...(design === 'marco'
      ? [{ label: 'Fuera del marco muestral', color: DATA_COLORS.muted, shape: 'dashed' as const }]
      : []),
    ...(design === 'no-respuesta'
      ? [
          {
            label: 'Seleccionada que no respondió',
            color: DATA_COLORS.negative,
            shape: 'line' as const,
          },
        ]
      : []),
    {
      label: `Valor real ${pop.binaria ? 'p' : 'μ'}`,
      color: DATA_COLORS.primary,
      shape: 'line' as const,
    },
    { label: 'Estimaciones del diseño', color: DATA_COLORS.secondary },
    ...(compare
      ? [{ label: 'Muestreo aleatorio simple', color: DATA_COLORS.text, shape: 'line' as const }]
      : []),
  ];

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={readouts}
      legend={legend}
      description={description}
      dataTable={{
        caption: `Unidades de la muestra actual`,
        columns: ['Orden', 'Unidad', 'Estrato', pop.variable],
        rows: shownUnits.map((unit, i) => [
          String(i + 1),
          `${pop.nombreUnidad} ${unit + 1}`,
          population.strataNames[population.stratum[unit] ?? 0] ?? '',
          formatNumber(population.values[unit] ?? 0, decimals),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <p className={styles.caption}>
        {stageText(design, complete, estimates.length)}
        {` (${symbol === 'p' ? 'p' : 'μ'} = ${formatNumber(mu, digits)})`}
      </p>
      <PopulationGrid
        population={population}
        label={description}
        counts={counts}
        missing={missing}
        excluded={excluded}
        clusters={new Set(state.sample.clusters)}
        showClusters={isCluster}
        showSizes={design === 'pps'}
        showAccess={design === 'conveniencia' || design === 'cuotas'}
        binary={pop.binaria ?? false}
        {...(design === 'sistematico' ? { path: shownUnits } : {})}
        clusterBlock={block}
      />
      {repetitions > 1 && (
        <EstimateHistogram
          values={estimates}
          {...(compare ? { compare: state.srs } : {})}
          domain={domain}
          markers={[
            { value: mu, label: `${pop.binaria ? 'p' : 'μ'} real`, color: DATA_COLORS.primary },
            ...(estimates.length > 1
              ? [{ value: average, label: 'promedio', color: DATA_COLORS.secondary, dashed: true }]
              : []),
          ]}
          label={`Distribución de las estimaciones en ${estimates.length} muestras`}
          axisLabel={`Estimación de ${pop.variable}${unitText ? ` (${pop.unidad})` : ''}`}
        />
      )}
    </VizFrame>
  );
}
