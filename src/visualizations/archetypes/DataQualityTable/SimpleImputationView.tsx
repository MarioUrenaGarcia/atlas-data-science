import { useMemo, useState } from 'react';
import { imputationEffect, simpleFillValue } from '../../../lib/dataprep/missing.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './Quality.module.css';
import { ScatterFrame, StackedHistogram } from '../../shared/ScatterCharts.tsx';
import { MECHANISM_LABELS, padded, SCENARIO, scenarioPoints } from './missingData.ts';
import { MECHANISMS, SIMPLE_METHODS, type MechanismId, type SimpleMethod } from './schema.ts';

const IMPUTATIONS_PER_SECOND = 12;
const BIN_WIDTH = 2;
const METHOD_NAMES: Record<SimpleMethod, string> = {
  media: 'Media',
  mediana: 'Mediana',
  moda: 'Moda',
};
const METHOD_TEX: Record<SimpleMethod, string> = {
  media: '\\bar{y}_{\\text{obs}}',
  mediana: '\\operatorname{mediana}(y_{\\text{obs}})',
  moda: '\\operatorname{moda}(y_{\\text{obs}})',
};

interface SimpleImputationViewProps {
  title: string;
  method: SimpleMethod;
  mechanism: MechanismId;
  rate: number;
  strength: number;
  n: number;
  seed: number;
}

/**
 * Missing incomes are replaced one by one by a single value computed from
 * the observed ones. The histogram grows a spike at that value, the spread
 * shrinks and, in the scatter, the imputed points form a flat line that
 * weakens the correlation with age.
 */
export function SimpleImputationView(props: SimpleImputationViewProps) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'select',
      key: 'metodo',
      label: 'Valor de relleno',
      options: SIMPLE_METHODS.map((m) => ({ value: m, label: METHOD_NAMES[m] })),
      default: props.method,
    },
    {
      type: 'select',
      key: 'mecanismo',
      label: 'Mecanismo de los faltantes',
      options: MECHANISMS.map((m) => ({ value: m, label: MECHANISM_LABELS[m] })),
      default: props.mechanism,
    },
    {
      type: 'number',
      key: 'tasa',
      label: 'Proporción de faltantes',
      min: 0.05,
      max: 0.6,
      step: 0.05,
      default: props.rate,
      digits: 2,
    },
  ];
  const parameters = useParameters(definitions);
  const method = String(parameters.values.metodo) as SimpleMethod;
  const mechanism = String(parameters.values.mecanismo) as MechanismId;
  const rate = Number(parameters.values.tasa);
  const seed = useSeed(props.seed);
  const points = useMemo(
    () =>
      scenarioPoints({ mechanism, rate, strength: props.strength, n: props.n, seed: seed.seed }),
    [mechanism, rate, props.strength, props.n, seed.seed],
  );
  const observedY = points.filter((p) => !p.missing).map((p) => p.y);
  const fill = simpleFillValue(observedY, method, 0);
  const missingIdx = points.flatMap((p, i) => (p.missing ? [i] : []));
  const total = missingIdx.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(
    `${seed.seed}|${mechanism}|${rate}|${run}`,
    () => (reducedMotion ? total : 0),
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    stepMany: (count) => update((v) => Math.min(total, v + count)),
    reset: () => setRun((v) => v + 1),
    rate: IMPUTATIONS_PER_SECOND,
    done: shown >= total,
  });
  const filledSet = new Set(missingIdx.slice(0, shown));
  // Statistics of the table as it stands: observed rows plus the rows imputed so far.
  const current = points.filter((p, i) => !p.missing || filledSet.has(i));
  const effect = imputationEffect(
    current,
    current.map((p) => (p.missing ? fill : p.y)),
  );
  const trueMean = points.reduce((a, p) => a + p.y, 0) / points.length;
  const g = (v: number) => formatNumber(v, 2);
  const header = `\\hat{y}_i = ${METHOD_TEX[method]} = ${g(fill)}\\quad (${shown} \\text{ de } ${total} \\text{ imputados})`;
  const description =
    `${METHOD_NAMES[method]} de los ingresos observados (${g(fill)}) usada para ${total} faltantes. ` +
    `Desviación estándar: ${g(effect.sdObserved)} observada, ${g(effect.sdImputed)} tras imputar. ` +
    `Correlación con la edad: ${g(effect.corrObserved)} observada, ${g(effect.corrImputed)} tras imputar.`;
  const yDomain = padded(points.map((p) => p.y));

  return (
    <VizFrame
      title={props.title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Valor de relleno', value: g(fill), color: DATA_COLORS.negative },
        {
          label: 'Media real, observada e imputada',
          value: `${g(trueMean)}, ${g(effect.meanObserved)}, ${g(effect.meanImputed)}`,
        },
        { label: 'Desviación estándar observada', value: g(effect.sdObserved) },
        {
          label: 'Desviación estándar tras imputar',
          value: g(effect.sdImputed),
          color: DATA_COLORS.highlight,
        },
        {
          label: 'Correlación con la edad: observada y tras imputar',
          value: `${g(effect.corrObserved)} y ${g(effect.corrImputed)}`,
        },
      ]}
      legend={[
        { label: 'Ingreso observado', color: DATA_COLORS.primary },
        { label: 'Ingreso imputado', color: DATA_COLORS.negative },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div className={styles.pair}>
        <StackedHistogram
          series={[
            { values: observedY, color: DATA_COLORS.primary },
            { values: missingIdx.slice(0, shown).map(() => fill), color: DATA_COLORS.negative },
          ]}
          domain={yDomain}
          binWidth={BIN_WIDTH}
          label={description}
          axisLabel={`${SCENARIO.yName} (${SCENARIO.yUnit})`}
        />
        <ScatterFrame
          xDomain={padded(points.map((p) => p.x))}
          yDomain={yDomain}
          xLabel={`${SCENARIO.xName} (${SCENARIO.xUnit})`}
          yLabel={SCENARIO.yName}
          label={description}
        >
          {({ x, y }) => (
            <g aria-hidden="true">
              {points.map((p, i) =>
                p.missing ? (
                  filledSet.has(i) ? (
                    <circle key={i} cx={x(p.x)} cy={y(fill)} r={4} fill={DATA_COLORS.negative} />
                  ) : null
                ) : (
                  <circle
                    key={i}
                    cx={x(p.x)}
                    cy={y(p.y)}
                    r={3.5}
                    fill={DATA_COLORS.primary}
                    fillOpacity={0.6}
                  />
                ),
              )}
            </g>
          )}
        </ScatterFrame>
      </div>
    </VizFrame>
  );
}
